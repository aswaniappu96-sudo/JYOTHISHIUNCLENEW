<?php
/**
 * Email a consultation reminder 30 minutes before the booked time.
 *
 * @package JyothishiUncleCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JU_Consultation_Reminders {

	const HOOK = 'ju_consultation_reminder_30';
	const SCAN = 'ju_consultation_reminders_scan';
	const LEAD = 1800;

	public static function hooks() {
		add_filter( 'cron_schedules', array( __CLASS__, 'schedules' ) );
		add_action( 'init', array( __CLASS__, 'ensure_scan' ) );
		add_action( self::SCAN, array( __CLASS__, 'scan' ) );
		add_action( self::HOOK, array( __CLASS__, 'send' ) );
	}

	public static function schedules( $schedules ) {
		if ( ! isset( $schedules['ju_five_minutes'] ) ) {
			$schedules['ju_five_minutes'] = array(
				'interval' => 5 * MINUTE_IN_SECONDS,
				'display'  => 'Every five minutes',
			);
		}
		return $schedules;
	}

	public static function ensure_scan() {
		if ( ! wp_next_scheduled( self::SCAN ) ) {
			wp_schedule_event( time() + MINUTE_IN_SECONDS, 'ju_five_minutes', self::SCAN );
		}
		if ( get_transient( 'ju_reminder_scan' ) ) {
			return;
		}
		set_transient( 'ju_reminder_scan', 1, MINUTE_IN_SECONDS );
		self::scan();
	}

	public static function schedule( $id ) {
		$id = (int) $id;
		self::unschedule( $id );
		if ( get_post_meta( $id, 'reminder_30_sent', true ) ) {
			return;
		}
		if ( ! self::can_remind( $id ) ) {
			return;
		}
		$start = self::start_timestamp( $id );
		if ( ! $start ) {
			return;
		}
		$when = $start - self::LEAD;
		if ( $when <= time() ) {
			return;
		}
		wp_schedule_single_event( $when, self::HOOK, array( $id ) );
		update_post_meta( $id, 'reminder_30_at', gmdate( 'c', $when ) );
	}

	public static function cancel( $id ) {
		self::unschedule( (int) $id );
	}

	public static function scan() {
		$query = new WP_Query(
			array(
				'post_type'      => 'consultation_booking',
				'post_status'    => 'publish',
				'posts_per_page' => 200,
				'fields'         => 'ids',
				'no_found_rows'  => true,
			)
		);
		foreach ( $query->posts as $id ) {
			if ( get_post_meta( $id, 'reminder_30_sent', true ) ) {
				continue;
			}
			if ( ! self::can_remind( $id ) ) {
				self::unschedule( $id );
				continue;
			}
			$start = self::start_timestamp( $id );
			$end   = self::end_timestamp( $id );
			if ( ! $start || ! $end ) {
				continue;
			}
			$now  = time();
			$when = $start - self::LEAD;
			if ( $now >= $end ) {
				update_post_meta( $id, 'reminder_30_sent', 'skipped' );
				self::unschedule( $id );
				continue;
			}
			if ( $now >= $when ) {
				self::send( $id );
				continue;
			}
			if ( ! wp_next_scheduled( self::HOOK, array( (int) $id ) ) ) {
				self::schedule( $id );
			}
		}
	}

	public static function send( $id ) {
		$id = (int) $id;
		if ( get_post_meta( $id, 'reminder_30_sent', true ) ) {
			return;
		}
		if ( ! self::can_remind( $id ) ) {
			return;
		}
		$start = self::start_timestamp( $id );
		$end   = self::end_timestamp( $id );
		$now   = time();
		if ( ! $start || ! $end || $now < ( $start - self::LEAD ) || $now >= $end ) {
			return;
		}

		$keys = JU_Consultation_Room::ensure_keys( $id );
		$date = JU_Availability::normalize_date( (string) JU_REST_Serialize::meta( $id, 'booking_date' ) );
		$time = substr( (string) JU_REST_Serialize::meta( $id, 'start_time' ), 0, 5 );
		$until = substr( (string) JU_REST_Serialize::meta( $id, 'end_time' ), 0, 5 );
		$when = $date . ', ' . $time . ( $until ? '–' . $until : '' );
		$email = (string) JU_REST_Serialize::meta( $id, 'email' );
		$name = (string) JU_REST_Serialize::meta( $id, 'customer_name' );
		$service = (string) JU_REST_Serialize::meta( $id, 'service_title', 'Consultation' );

		$client_sent = JU_Mail::send_to(
			$email,
			'Your MaharshiOm consultation starts in 30 minutes — ' . $when,
			array(
				'Date'      => $date,
				'Time'      => $time . ( $until ? '–' . $until : '' ),
				'Service'   => $service,
				'Join link' => JU_Consultation_Room::video_url( $id, $keys['room_key'] ),
			),
			'Your video consultation starts in 30 minutes. Join from the link below at the time shown.'
		);

		JU_Mail::notify(
			'[MaharshiOm] Consultation in 30 minutes — ' . $when,
			array(
				'Customer'    => $name,
				'Email'       => $email,
				'Date'        => $date,
				'Time'        => $time . ( $until ? '–' . $until : '' ),
				'Service'     => $service,
				'Join link'   => JU_Consultation_Room::video_url( $id, $keys['host_key'] ),
			),
			'A video consultation starts in 30 minutes. Join from the astrologer link below.'
		);

		if ( $client_sent ) {
			update_post_meta( $id, 'reminder_30_sent', 'sent' );
			update_post_meta( $id, 'reminder_30_sent_at', gmdate( 'c' ) );
		}
	}

	private static function can_remind( $id ) {
		$post = get_post( $id );
		if ( ! $post || 'consultation_booking' !== $post->post_type || 'publish' !== $post->post_status ) {
			return false;
		}
		$status = (string) JU_REST_Serialize::meta( $id, 'status', 'new' );
		return JU_Availability::locks_calendar( $status );
	}

	private static function timezone() {
		$settings = JU_Settings::get();
		$name     = ! empty( $settings['consultation_timezone'] ) ? $settings['consultation_timezone'] : 'Asia/Kolkata';
		try {
			return new DateTimeZone( $name );
		} catch ( Exception $e ) {
			return new DateTimeZone( 'Asia/Kolkata' );
		}
	}

	private static function start_timestamp( $id ) {
		$date = JU_Availability::normalize_date( (string) JU_REST_Serialize::meta( $id, 'booking_date' ) );
		$time = substr( (string) JU_REST_Serialize::meta( $id, 'start_time' ), 0, 5 );
		$dt   = DateTimeImmutable::createFromFormat( 'Y-m-d H:i', $date . ' ' . $time, self::timezone() );
		return $dt ? $dt->getTimestamp() : 0;
	}

	private static function end_timestamp( $id ) {
		$date = JU_Availability::normalize_date( (string) JU_REST_Serialize::meta( $id, 'booking_date' ) );
		$time = substr( (string) JU_REST_Serialize::meta( $id, 'end_time' ), 0, 5 );
		if ( preg_match( '/^\d{2}:\d{2}$/', $time ) ) {
			$dt = DateTimeImmutable::createFromFormat( 'Y-m-d H:i', $date . ' ' . $time, self::timezone() );
			if ( $dt ) {
				return $dt->getTimestamp();
			}
		}
		$start = self::start_timestamp( $id );
		return $start ? $start + ( 30 * MINUTE_IN_SECONDS ) : 0;
	}

	private static function unschedule( $id ) {
		$id    = (int) $id;
		$guard = 0;
		$next  = wp_next_scheduled( self::HOOK, array( $id ) );
		while ( $next && $guard < 5 ) {
			wp_unschedule_event( $next, self::HOOK, array( $id ) );
			$next = wp_next_scheduled( self::HOOK, array( $id ) );
			$guard++;
		}
	}
}
