<?php
/**
 * Builds consultation slots from working hours minus booked times.
 *
 * @package JyothishiUncleCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JU_Availability {

	public static function month_slots( $month, $duration_minutes, $settings ) {
		$timezone = new DateTimeZone( $settings['consultation_timezone'] ?: 'Asia/Muscat' );
		$start    = DateTimeImmutable::createFromFormat( 'Y-m-d H:i:s', $month . '-01 00:00:00', $timezone );
		if ( ! $start ) {
			return array();
		}

		$end          = $start->modify( 'last day of this month' );
		$working_days = (array) $settings['consultation_days'];
		$day_start    = $settings['consultation_start_time'] ?: '10:00';
		$day_end      = $settings['consultation_end_time'] ?: '18:00';
		$duration     = max( 15, (int) $duration_minutes );

		$booked       = self::booked_keys( $start, $end );
		$booked_dates = self::booked_dates( $booked );
		$days         = array();
		$cursor       = $start;

		while ( $cursor <= $end ) {
			$key      = $cursor->format( 'Y-m-d' );
			$weekday  = strtolower( $cursor->format( 'D' ) );
			$map      = array(
				'sun' => 'sun',
				'mon' => 'mon',
				'tue' => 'tue',
				'wed' => 'wed',
				'thu' => 'thu',
				'fri' => 'fri',
				'sat' => 'sat',
			);
			$day_code = $map[ $weekday ] ?? $weekday;
			$is_work  = in_array( $day_code, $working_days, true );
			$is_taken = in_array( $key, $booked_dates, true );
			$slots    = array();

			if ( $is_work && ! $is_taken ) {
				$slots = self::day_slots( $key, $day_start, $day_end, $duration, $timezone, $booked );
			}

			$days[] = array(
				'date'      => $key,
				'available' => ! empty( $slots ) && ! $is_taken,
				'blocked'   => false,
				'booked'    => $is_taken,
				'working'   => $is_work,
				'slots'     => $slots,
			);

			$cursor = $cursor->modify( '+1 day' );
		}

		return $days;
	}

	private static function day_slots( $date, $start_time, $end_time, $duration, DateTimeZone $timezone, array $booked ) {
		$begin = DateTimeImmutable::createFromFormat( 'Y-m-d H:i', $date . ' ' . $start_time, $timezone );
		$stop  = DateTimeImmutable::createFromFormat( 'Y-m-d H:i', $date . ' ' . $end_time, $timezone );
		if ( ! $begin || ! $stop ) {
			return array();
		}

		$now   = new DateTimeImmutable( 'now', $timezone );
		$slots = array();
		$cursor = $begin;

		while ( $cursor < $stop ) {
			$slot_end = $cursor->modify( '+' . $duration . ' minutes' );
			if ( $slot_end > $stop ) {
				break;
			}

			$key     = $cursor->format( 'Y-m-d H:i' );
			$is_past = $cursor <= $now;
			$taken   = in_array( $key, $booked, true );

			if ( ! $is_past && ! $taken ) {
				$slots[] = array(
					'start' => $cursor->format( 'H:i' ),
					'end'   => $slot_end->format( 'H:i' ),
				);
			}

			$cursor = $slot_end;
		}

		return $slots;
	}

	private static function booked_keys( DateTimeImmutable $start, DateTimeImmutable $end ) {
		$query = new WP_Query(
			array(
				'post_type'      => 'consultation_booking',
				'post_status'    => 'publish',
				'posts_per_page' => 500,
				'no_found_rows'  => true,
				'fields'         => 'ids',
			)
		);

		$keys = array();

		foreach ( $query->posts as $id ) {
			$status = (string) JU_REST_Serialize::meta( $id, 'status', 'new' );
			if ( ! self::locks_calendar( $status ) ) {
				continue;
			}

			$date = self::normalize_date( (string) JU_REST_Serialize::meta( $id, 'booking_date' ) );
			$time = (string) JU_REST_Serialize::meta( $id, 'start_time' );
			if ( ! $date ) {
				continue;
			}

			if ( $date < $start->format( 'Y-m-d' ) || $date > $end->format( 'Y-m-d' ) ) {
				continue;
			}

			$time   = $time ? substr( $time, 0, 5 ) : '00:00';
			$keys[] = $date . ' ' . $time;
		}

		return $keys;
	}

	private static function booked_dates( array $booked_keys ) {
		$dates = array();
		foreach ( $booked_keys as $key ) {
			$dates[] = substr( $key, 0, 10 );
		}
		return array_values( array_unique( $dates ) );
	}

	public static function locks_calendar( $status ) {
		return in_array( (string) $status, array( 'new', 'contacted', 'confirmed' ), true );
	}

	public static function normalize_date( $value ) {
		$digits = preg_replace( '/\D/', '', (string) $value );
		if ( strlen( $digits ) === 8 ) {
			return substr( $digits, 0, 4 ) . '-' . substr( $digits, 4, 2 ) . '-' . substr( $digits, 6, 2 );
		}
		return (string) $value;
	}

	public static function date_is_taken( $date, $exclude_id = 0 ) {
		$date = self::normalize_date( $date );
		$query = new WP_Query(
			array(
				'post_type'      => 'consultation_booking',
				'post_status'    => 'publish',
				'posts_per_page' => 500,
				'no_found_rows'  => true,
				'fields'         => 'ids',
				'post__not_in'   => $exclude_id ? array( (int) $exclude_id ) : array(),
			)
		);

		foreach ( $query->posts as $id ) {
			$status = (string) JU_REST_Serialize::meta( $id, 'status', 'new' );
			if ( ! self::locks_calendar( $status ) ) {
				continue;
			}
			if ( self::normalize_date( (string) JU_REST_Serialize::meta( $id, 'booking_date' ) ) === $date ) {
				return true;
			}
		}

		return false;
	}

	public static function save_meta( $post_id, $key, $value ) {
		if ( function_exists( 'update_field' ) ) {
			update_field( $key, $value, $post_id );
			return;
		}
		update_post_meta( $post_id, $key, $value );
	}
}
