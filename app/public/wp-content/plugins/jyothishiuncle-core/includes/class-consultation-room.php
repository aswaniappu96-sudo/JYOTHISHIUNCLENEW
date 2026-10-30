<?php
/**
 * Private video-room keys for a scheduled consultation.
 *
 * @package JyothishiUncleCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JU_Consultation_Room {

	public static function register() {
		register_rest_route(
			JU_REST::NS,
			'/consultation-room/(?P<id>\d+)',
			array(
				'methods'             => 'GET',
				'permission_callback' => '__return_true',
				'callback'            => array( __CLASS__, 'rest' ),
			)
		);
	}

	public static function public_site_url() {
		$host = (string) wp_parse_url( home_url(), PHP_URL_HOST );
		if ( in_array( $host, array( 'localhost', '127.0.0.1', 'jyothishiuncle.local' ), true ) ) {
			return 'http://localhost:3000';
		}
		return 'https://jyothishiuncle-new.vercel.app';
	}

	public static function video_url( $id, $key ) {
		return self::public_site_url() . '/consult/' . (int) $id . '?k=' . rawurlencode( (string) $key );
	}

	public static function new_keys() {
		return array(
			'room_key' => bin2hex( random_bytes( 16 ) ),
			'host_key' => bin2hex( random_bytes( 16 ) ),
		);
	}

	public static function room_id_for( $id ) {
		return 'consult' . (int) $id;
	}

	public static function store_keys( $id, $room_key, $host_key ) {
		self::write_key( $id, 'room_key', $room_key );
		self::write_key( $id, 'host_key', $host_key );
		self::store_meeting( $id );
	}

	public static function store_meeting( $id ) {
		$room_id = self::room_id_for( $id );
		self::write_meta( $id, 'room_id', $room_id );

		$provider = (string) JU_REST_Serialize::meta( $id, 'meeting_provider' );
		if ( 'zegocloud' !== $provider ) {
			$provider = 'zegocloud';
			self::write_meta( $id, 'meeting_provider', $provider );
		}

		$status = (string) JU_REST_Serialize::meta( $id, 'meeting_status' );
		if ( ! in_array( $status, array( 'scheduled', 'ready', 'ended', 'closed' ), true ) ) {
			$booking = (string) JU_REST_Serialize::meta( $id, 'status', 'new' );
			$status  = in_array( $booking, array( 'completed', 'cancelled' ), true ) ? 'closed' : 'scheduled';
			self::write_meta( $id, 'meeting_status', $status );
		}

		return array(
			'room_id'          => $room_id,
			'meeting_provider' => $provider,
			'meeting_status'   => $status,
		);
	}

	public static function ensure_keys( $id ) {
		$room = self::read_key( $id, 'room_key' );
		$host = self::read_key( $id, 'host_key' );
		if ( ! $room || ! $host ) {
			$fresh = self::new_keys();
			$room  = $room ? $room : $fresh['room_key'];
			$host  = $host ? $host : $fresh['host_key'];
			self::store_keys( $id, $room, $host );
		} else {
			self::store_meeting( $id );
		}
		return array(
			'room_key' => $room,
			'host_key' => $host,
		);
	}

	public static function rest( WP_REST_Request $request ) {
		$id   = (int) $request->get_param( 'id' );
		$post = get_post( $id );
		if ( ! $post || 'consultation_booking' !== $post->post_type || 'publish' !== $post->post_status ) {
			return new WP_Error( 'ju_missing', 'This consultation was not found.', array( 'status' => 404 ) );
		}

		$given = strtolower( (string) $request->get_param( 'k' ) );
		if ( ! preg_match( '/^[a-f0-9]{32}$/', $given ) ) {
			$given = '';
		}

		$room_key = self::read_key( $id, 'room_key' );
		$host_key = self::read_key( $id, 'host_key' );
		$role     = '';
		if ( $given && $host_key && hash_equals( $host_key, $given ) ) {
			$role = 'host';
		} elseif ( $given && $room_key && hash_equals( $room_key, $given ) ) {
			$role = 'guest';
		} else {
			$user  = JU_JWT::user_from_request( $request );
			$email = (string) JU_REST_Serialize::meta( $id, 'email' );
			if ( $user && $email && strcasecmp( $user->user_email, $email ) === 0 ) {
				$role = 'guest';
			}
		}

		if ( ! $role ) {
			return new WP_Error( 'ju_auth', 'This video link is not valid.', array( 'status' => 403 ) );
		}

		if ( ! $room_key || ! $host_key ) {
			self::ensure_keys( $id );
		}
		$meeting = self::store_meeting( $id );

		$settings = JU_Settings::get();
		return rest_ensure_response(
			array(
				'ok'               => true,
				'id'               => $id,
				'role'             => $role,
				'room_id'          => $meeting['room_id'],
				'meeting_provider' => $meeting['meeting_provider'],
				'meeting_status'   => $meeting['meeting_status'],
				'customer_name'  => (string) JU_REST_Serialize::meta( $id, 'customer_name' ),
				'service_title'  => (string) JU_REST_Serialize::meta( $id, 'service_title' ),
				'booking_date'   => JU_Availability::normalize_date( (string) JU_REST_Serialize::meta( $id, 'booking_date' ) ),
				'start_time'     => substr( (string) JU_REST_Serialize::meta( $id, 'start_time' ), 0, 5 ),
				'end_time'       => substr( (string) JU_REST_Serialize::meta( $id, 'end_time' ), 0, 5 ),
				'slot_offer'     => (string) JU_REST_Serialize::meta( $id, 'slot_offer' ),
				'status'         => (string) JU_REST_Serialize::meta( $id, 'status', 'new' ),
				'timezone'       => (string) ( $settings['consultation_timezone'] ? $settings['consultation_timezone'] : 'Asia/Kolkata' ),
				'slot_minutes'   => (int) $settings['consultation_slot_minutes'],
			)
		);
	}

	private static function read_key( $id, $name ) {
		$value = (string) JU_REST_Serialize::meta( $id, $name );
		return preg_match( '/^[a-f0-9]{32}$/', $value ) ? $value : '';
	}

	private static function write_key( $id, $name, $value ) {
		self::write_meta( $id, $name, $value );
	}

	private static function write_meta( $id, $name, $value ) {
		update_post_meta( $id, $name, $value );
		if ( function_exists( 'update_field' ) ) {
			update_field( $name, $value, $id );
		}
	}
}
