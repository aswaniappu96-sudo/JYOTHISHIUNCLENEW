<?php
/**
 * Public write endpoints: auth, enquiries, bookings.
 *
 * @package JyothishiUncleCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JU_Submissions {

	public static function register() {
		$public_post = array(
			'methods'             => 'POST',
			'permission_callback' => '__return_true',
		);

		register_rest_route( JU_REST::NS, '/enquiry', array_merge( $public_post, array( 'callback' => array( __CLASS__, 'enquiry' ) ) ) );
		register_rest_route( JU_REST::NS, '/pooja-bookings', array_merge( $public_post, array( 'callback' => array( __CLASS__, 'pooja_booking' ) ) ) );
		register_rest_route( JU_REST::NS, '/product-enquiries', array_merge( $public_post, array( 'callback' => array( __CLASS__, 'product_enquiry' ) ) ) );
		register_rest_route( JU_REST::NS, '/travel-bookings', array_merge( $public_post, array( 'callback' => array( __CLASS__, 'travel_booking' ) ) ) );
		register_rest_route( JU_REST::NS, '/consultation-bookings', array_merge( $public_post, array( 'callback' => array( __CLASS__, 'consultation_booking' ) ) ) );
		register_rest_route( JU_REST::NS, '/auth/register', array_merge( $public_post, array( 'callback' => array( __CLASS__, 'register_user' ) ) ) );
		register_rest_route( JU_REST::NS, '/auth/login', array_merge( $public_post, array( 'callback' => array( __CLASS__, 'login' ) ) ) );

		register_rest_route(
			JU_REST::NS,
			'/me',
			array(
				array(
					'methods'             => 'GET',
					'permission_callback' => '__return_true',
					'callback'            => array( __CLASS__, 'me' ),
				),
				array(
					'methods'             => 'POST',
					'permission_callback' => '__return_true',
					'callback'            => array( __CLASS__, 'update_me' ),
				),
			)
		);

		register_rest_route(
			JU_REST::NS,
			'/me/bookings',
			array(
				'methods'             => 'GET',
				'permission_callback' => '__return_true',
				'callback'            => array( __CLASS__, 'my_bookings' ),
			)
		);
	}

	public static function enquiry( WP_REST_Request $request ) {
		$guard = self::guard( $request );
		if ( $guard ) {
			return $guard;
		}

		$p = self::person( $request );
		if ( is_wp_error( $p ) ) {
			return $p;
		}

		$subject = sanitize_text_field( (string) $request->get_param( 'subject' ) );

		$id = self::create_item(
			'customer_enquiry',
			$subject ? $p['name'] . ' — ' . $subject : $p['name'],
			array(
				'customer_name' => $p['name'],
				'email'         => $p['email'],
				'mobile'        => $p['mobile'],
				'location'      => $p['location'],
				'subject'       => $subject,
				'source'        => sanitize_text_field( (string) $request->get_param( 'source' ) ),
				'message'       => $p['message'],
				'status'        => 'new',
			)
		);

		JU_Mail::notify(
			'[JyothishiUncle] New client enquiry — ' . $p['name'],
			array(
				'Name'     => $p['name'],
				'Email'    => $p['email'],
				'Mobile'   => $p['mobile'],
				'Location' => $p['location'],
				'Subject'  => $subject,
				'Source'   => (string) $request->get_param( 'source' ),
				'Message'  => $p['message'],
			),
			'A new client enquiry was received from the website. It is also saved in Customer Enquiries → Client enquiries (Excel).'
		);

		return rest_ensure_response( array( 'ok' => true, 'id' => $id ) );
	}

	public static function pooja_booking( WP_REST_Request $request ) {
		$guard = self::guard( $request );
		if ( $guard ) {
			return $guard;
		}

		$p = self::person( $request );
		if ( is_wp_error( $p ) ) {
			return $p;
		}

		$pooja_slug = sanitize_title( (string) $request->get_param( 'pooja' ) );
		$pooja      = $pooja_slug ? get_page_by_path( $pooja_slug, OBJECT, 'pooja' ) : null;
		$title      = $pooja ? $pooja->post_title : sanitize_text_field( (string) $request->get_param( 'pooja_title' ) );
		$date       = sanitize_text_field( (string) $request->get_param( 'preferred_date' ) );
		$mode       = sanitize_key( (string) $request->get_param( 'offering_mode' ) );
		if ( ! in_array( $mode, array( 'online', 'offline' ), true ) ) {
			$mode = 'online';
		}

		$vendor_slug = sanitize_title( (string) ( $request->get_param( 'vendor' ) ?: $request->get_param( 'vendor_slug' ) ) );
		$vendor      = $vendor_slug ? get_page_by_path( $vendor_slug, OBJECT, 'vendor' ) : null;
		$vendor_name = $vendor ? $vendor->post_title : sanitize_text_field( (string) $request->get_param( 'vendor_name' ) );
		if ( ! $vendor_name ) {
			$has_vendors = (int) wp_count_posts( 'vendor' )->publish;
			if ( $has_vendors > 0 ) {
				return new WP_Error( 'ju_invalid', 'Please choose a pooja temple.', array( 'status' => 400 ) );
			}
		}

		$user = JU_JWT::user_from_request( $request );

		if ( $user ) {
			$p = self::merge_user( $p, $user );
		}

		$id = self::create_item(
			'pooja_booking',
			$p['name'] . ' — ' . $title,
			array(
				'customer_name'  => $p['name'],
				'email'          => $p['email'],
				'mobile'         => $p['mobile'],
				'location'       => $p['location'],
				'pooja_title'    => $title,
				'pooja_id'       => $pooja ? $pooja->ID : 0,
				'preferred_date' => $date,
				'offering_mode'  => $mode,
				'vendor_name'    => $vendor_name,
				'vendor_id'      => $vendor ? $vendor->ID : 0,
				'message'        => $p['message'],
				'status'         => 'new',
			)
		);

		JU_Mail::notify(
			'[JyothishiUncle] New pooja booking — ' . $title,
			array(
				'Customer'       => $p['name'],
				'Pooja'          => $title,
				'Mode'           => 'offline' === $mode ? 'Offline' : 'Online',
				'Pooja temple'   => $vendor_name ? $vendor_name : '—',
				'Preferred date' => $date,
				'Email'          => $p['email'],
				'Phone'          => $p['mobile'],
				'Location'       => $p['location'],
				'Message'        => $p['message'],
			)
		);

		return rest_ensure_response( array( 'ok' => true, 'id' => $id ) );
	}

	public static function product_enquiry( WP_REST_Request $request ) {
		$guard = self::guard( $request );
		if ( $guard ) {
			return $guard;
		}

		$p = self::person( $request );
		if ( is_wp_error( $p ) ) {
			return $p;
		}

		$slug    = sanitize_title( (string) $request->get_param( 'product' ) );
		$product = $slug ? get_page_by_path( $slug, OBJECT, 'product' ) : null;
		$title   = $product ? $product->post_title : sanitize_text_field( (string) $request->get_param( 'product_title' ) );
		$qty     = max( 1, (int) $request->get_param( 'quantity' ) );

		$id = self::create_item(
			'product_enquiry',
			$p['name'] . ' — ' . $title,
			array(
				'customer_name' => $p['name'],
				'email'         => $p['email'],
				'mobile'        => $p['mobile'],
				'location'      => $p['location'],
				'product_title' => $title,
				'product_id'    => $product ? $product->ID : 0,
				'quantity'      => $qty,
				'message'       => $p['message'],
				'status'        => 'new',
			)
		);

		JU_Mail::notify(
			'[JyothishiUncle] New product booking — ' . $title,
			array(
				'Customer' => $p['name'],
				'Product'  => $title,
				'Quantity' => (string) $qty,
				'Email'    => $p['email'],
				'Phone'    => $p['mobile'],
				'Location' => $p['location'],
				'Message'  => $p['message'],
			)
		);

		return rest_ensure_response( array( 'ok' => true, 'id' => $id ) );
	}

	public static function travel_booking( WP_REST_Request $request ) {
		$guard = self::guard( $request );
		if ( $guard ) {
			return $guard;
		}

		$p = self::person( $request );
		if ( is_wp_error( $p ) ) {
			return $p;
		}

		$slug    = sanitize_title( (string) ( $request->get_param( 'travel' ) ?: $request->get_param( 'slug' ) ) );
		$travel  = $slug ? get_page_by_path( $slug, OBJECT, 'religious_travel' ) : null;
		$title   = $travel ? $travel->post_title : sanitize_text_field( (string) $request->get_param( 'travel_title' ) );
		$dates   = sanitize_text_field( (string) $request->get_param( 'preferred_dates' ) );
		$notes   = $p['message'];

		$id = self::create_item(
			'travel_booking',
			$p['name'] . ' — ' . $title,
			array(
				'customer_name'   => $p['name'],
				'email'           => $p['email'],
				'mobile'          => $p['mobile'],
				'location'        => $p['location'],
				'travel_title'    => $title,
				'travel_id'       => $travel ? $travel->ID : 0,
				'preferred_dates' => $dates,
				'message'         => $notes,
				'status'          => 'new',
			)
		);

		JU_Mail::notify(
			'[JyothishiUncle] New yatra booking — ' . $title,
			array(
				'Customer'         => $p['name'],
				'Yatra'            => $title,
				'Preferred dates'  => $dates,
				'Email'            => $p['email'],
				'Phone'            => $p['mobile'],
				'Location'         => $p['location'],
				'Message'          => $notes,
			)
		);

		return rest_ensure_response( array( 'ok' => true, 'id' => $id ) );
	}

	public static function consultation_booking( WP_REST_Request $request ) {
		$guard = self::guard( $request );
		if ( $guard ) {
			return $guard;
		}

		$p = self::person( $request );
		if ( is_wp_error( $p ) ) {
			return $p;
		}

		$types = array(
			'pooja'    => 'Pooja',
			'marriage' => 'Marriage',
			'jathaka'  => 'Jathaka',
			'other'    => 'Other',
		);
		$type_key = sanitize_key( (string) $request->get_param( 'consultation_type' ) );
		if ( ! isset( $types[ $type_key ] ) ) {
			return new WP_Error( 'ju_invalid', 'Please choose a consultation type.', array( 'status' => 400 ) );
		}

		$date = sanitize_text_field( (string) $request->get_param( 'date' ) );
		if ( ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $date ) ) {
			return new WP_Error( 'ju_invalid', 'Please choose a valid date.', array( 'status' => 400 ) );
		}

		$settings = JU_Settings::get();
		$timezone = new DateTimeZone( $settings['consultation_timezone'] ?: 'Asia/Muscat' );
		$today    = ( new DateTimeImmutable( 'now', $timezone ) )->format( 'Y-m-d' );
		if ( $date < $today ) {
			return new WP_Error( 'ju_invalid', 'Please choose a future date.', array( 'status' => 400 ) );
		}

		$user = JU_JWT::user_from_request( $request );
		if ( $user ) {
			$p = self::merge_user( $p, $user );
		}
		$wants_free = filter_var( $request->get_param( 'claim_free_slot' ), FILTER_VALIDATE_BOOLEAN );
		$free_slot  = $wants_free && self::user_eligible_for_free_slot( $user );
		$slot_offer = $free_slot ? '10 MIN FREE SLOT' : '';

		$duration = (int) $settings['consultation_slot_minutes'];
		$slug     = sanitize_title( (string) $request->get_param( 'service' ) );
		$service  = $slug ? get_page_by_path( $slug, OBJECT, 'astrology_service' ) : null;
		if ( $service ) {
			$custom = (int) JU_REST_Serialize::meta( $service->ID, 'duration_minutes', $duration );
			if ( $custom > 0 ) {
				$duration = $custom;
			}
		}
		if ( $free_slot ) {
			$duration = 10;
		}

		$month = substr( $date, 0, 7 );
		$days  = JU_Availability::month_slots( $month, $duration, $settings );
		$ok    = false;
		foreach ( $days as $day ) {
			if ( $day['date'] === $date && ! empty( $day['available'] ) ) {
				$ok = true;
				break;
			}
		}
		if ( ! $ok ) {
			return new WP_Error( 'ju_slot_taken', 'That date is no longer available. Please choose another day.', array( 'status' => 409 ) );
		}

		$start = sanitize_text_field( (string) $request->get_param( 'start_time' ) );
		if ( ! preg_match( '/^\d{2}:\d{2}$/', $start ) ) {
			$start = $settings['consultation_start_time'] ?: '10:00';
		}
		$start_dt = DateTimeImmutable::createFromFormat( 'Y-m-d H:i', $date . ' ' . $start, $timezone );
		$end      = $start_dt ? $start_dt->modify( '+' . $duration . ' minutes' )->format( 'H:i' ) : '';

		$meeting = sanitize_text_field( (string) $request->get_param( 'meeting_method' ) );
		if ( ! $meeting ) {
			$meeting = $settings['default_meeting_method'];
		}

		$label     = $types[ $type_key ];
		$astrologer = sanitize_text_field( (string) $request->get_param( 'astrologer_name' ) );
		$astrologer = $astrologer ? substr( $astrologer, 0, 120 ) : 'Consultation only';

		$id = self::create_item(
			'consultation_booking',
			$p['name'] . ' — ' . $label . ' · ' . $date,
			array(
				'customer_name'     => $p['name'],
				'email'             => $p['email'],
				'mobile'            => $p['mobile'],
				'location'          => $p['location'],
				'consultation_type' => $type_key,
				'service_title'     => $label,
				'service_id'        => $service ? $service->ID : 0,
				'booking_date'      => $date,
				'start_time'        => $start,
				'end_time'          => $end,
				'meeting_method'    => $meeting,
				'message'           => $p['message'],
				'astrologer_name'   => $astrologer,
				'slot_offer'        => $slot_offer,
				'user_id'           => $user ? (int) $user->ID : 0,
				'status'            => 'new',
			)
		);

		if ( $id && $free_slot && $user ) {
			update_user_meta( $user->ID, 'ju_free_consultation_used', 1 );
		}

		JU_Mail::notify(
			'[JyothishiUncle] New consultation booking — ' . $label,
			array(
				'Customer'   => $p['name'],
				'Astrologer' => $astrologer,
				'Type'       => $label,
				'Slot'       => $slot_offer ? $slot_offer : 'Standard',
				'Date'       => $date,
				'Time'       => $start . ( $end ? '–' . $end : '' ) . ' (calendar time)',
				'Meeting'    => $meeting,
				'Email'      => $p['email'],
				'Phone'      => $p['mobile'],
				'Location'   => $p['location'],
				'Message'    => $p['message'],
			)
		);

		return rest_ensure_response(
			array(
				'ok'        => true,
				'id'        => $id,
				'free_slot' => (bool) ( $id && $free_slot ),
			)
		);
	}

	public static function register_user( WP_REST_Request $request ) {
		$guard = self::guard( $request );
		if ( $guard ) {
			return $guard;
		}

		$email    = sanitize_email( (string) $request->get_param( 'email' ) );
		$password = (string) $request->get_param( 'password' );
		$name     = sanitize_text_field( (string) $request->get_param( 'name' ) );
		$mobile   = sanitize_text_field( (string) ( $request->get_param( 'mobile' ) ?: $request->get_param( 'phone' ) ) );
		$location = sanitize_text_field( (string) ( $request->get_param( 'location' ) ?: $request->get_param( 'address' ) ) );
		$source   = sanitize_text_field( (string) $request->get_param( 'source' ) );
		$message  = sanitize_textarea_field( (string) $request->get_param( 'message' ) );

		if ( ! is_email( $email ) || strlen( $password ) < 8 ) {
			return new WP_Error( 'ju_invalid', 'Enter a valid email and a password of at least 8 characters.', array( 'status' => 400 ) );
		}
		if ( ! $name || ! $mobile ) {
			return new WP_Error( 'ju_invalid', 'Name and phone number are required.', array( 'status' => 400 ) );
		}
		if ( email_exists( $email ) ) {
			return new WP_Error( 'ju_exists', 'An account with this email already exists. Please log in.', array( 'status' => 409 ) );
		}

		$user_id = wp_insert_user(
			array(
				'user_login'   => $email,
				'user_email'   => $email,
				'user_pass'    => $password,
				'role'         => 'customer',
				'display_name' => $name,
				'first_name'   => $name,
			)
		);
		if ( is_wp_error( $user_id ) ) {
			return new WP_Error( 'ju_invalid', $user_id->get_error_message(), array( 'status' => 400 ) );
		}

		update_user_meta( $user_id, 'ju_mobile', $mobile );
		update_user_meta( $user_id, 'ju_location', $location );
		update_user_meta( $user_id, 'ju_source', $source );
		update_user_meta( $user_id, 'ju_intro_message', $message );
		update_user_meta( $user_id, 'ju_profile_complete', 1 );
		update_user_meta( $user_id, 'ju_reg_status', 'new' );
		$user = get_user_by( 'id', $user_id );

		self::create_item(
			'website_registration',
			$name,
			array(
				'customer_name' => $name,
				'email'         => $email,
				'mobile'        => $mobile,
				'location'      => $location,
				'source'        => $source,
				'message'       => $message,
				'user_id'       => $user_id,
				'status'        => 'new',
			)
		);

		JU_Mail::notify(
			'[JyothishiUncle] New client registration — ' . $name,
			array(
				'Name'     => $name,
				'Email'    => $email,
				'Phone'    => $mobile,
				'Location' => $location,
				'Source'   => $source,
				'Message'  => $message,
			),
			'A new client registered on the website. Details are saved in Registrations → Registrations (Excel).'
		);

		return rest_ensure_response(
			array(
				'ok'    => true,
				'token' => JU_JWT::encode( $user_id ),
				'user'  => JU_JWT::public_user( $user ),
			)
		);
	}

	public static function login( WP_REST_Request $request ) {
		$guard = self::guard( $request, false );
		if ( $guard ) {
			return $guard;
		}

		$email    = sanitize_email( (string) $request->get_param( 'email' ) );
		$password = (string) $request->get_param( 'password' );
		$user     = wp_authenticate( $email, $password );
		if ( is_wp_error( $user ) ) {
			return new WP_Error( 'ju_auth', 'Email or password is incorrect.', array( 'status' => 401 ) );
		}

		return rest_ensure_response(
			array(
				'ok'    => true,
				'token' => JU_JWT::encode( $user->ID ),
				'user'  => JU_JWT::public_user( $user ),
			)
		);
	}

	public static function me( WP_REST_Request $request ) {
		$user = JU_JWT::user_from_request( $request );
		if ( ! $user ) {
			return new WP_Error( 'ju_auth', 'Please log in.', array( 'status' => 401 ) );
		}
		return rest_ensure_response( array( 'ok' => true, 'user' => JU_JWT::public_user( $user ) ) );
	}

	public static function update_me( WP_REST_Request $request ) {
		$user = JU_JWT::user_from_request( $request );
		if ( ! $user ) {
			return new WP_Error( 'ju_auth', 'Please log in.', array( 'status' => 401 ) );
		}

		$name     = sanitize_text_field( (string) $request->get_param( 'name' ) );
		$mobile   = sanitize_text_field( (string) $request->get_param( 'mobile' ) );
		$location = sanitize_text_field( (string) $request->get_param( 'location' ) );
		$source   = sanitize_text_field( (string) $request->get_param( 'source' ) );
		$message  = sanitize_textarea_field( (string) $request->get_param( 'message' ) );

		if ( ! $name || ! $mobile ) {
			return new WP_Error( 'ju_invalid', 'Name and mobile are required.', array( 'status' => 400 ) );
		}

		wp_update_user(
			array(
				'ID'           => $user->ID,
				'display_name' => $name,
				'first_name'   => $name,
			)
		);
		update_user_meta( $user->ID, 'ju_mobile', $mobile );
		update_user_meta( $user->ID, 'ju_location', $location );
		update_user_meta( $user->ID, 'ju_source', $source );
		update_user_meta( $user->ID, 'ju_intro_message', $message );
		update_user_meta( $user->ID, 'ju_profile_complete', 1 );

		JU_Mail::notify(
			'[JyothishiUncle] Customer profile completed — ' . $name,
			array(
				'Name'     => $name,
				'Email'    => $user->user_email,
				'Mobile'   => $mobile,
				'Location' => $location,
				'Source'   => $source,
				'Message'  => $message,
			)
		);

		$user = get_user_by( 'id', $user->ID );
		return rest_ensure_response( array( 'ok' => true, 'user' => JU_JWT::public_user( $user ) ) );
	}

	public static function my_bookings( WP_REST_Request $request ) {
		$user = JU_JWT::user_from_request( $request );
		if ( ! $user ) {
			return new WP_Error( 'ju_auth', 'Please log in.', array( 'status' => 401 ) );
		}

		$email = $user->user_email;

		return rest_ensure_response(
			array(
				'ok'            => true,
				'pooja'         => self::bookings_for_email( 'pooja_booking', $email, array( 'pooja_title', 'preferred_date', 'offering_mode', 'vendor_name', 'status', 'message' ) ),
				'products'      => self::bookings_for_email( 'product_enquiry', $email, array( 'product_title', 'quantity', 'status', 'message' ) ),
				'travel'        => self::bookings_for_email( 'travel_booking', $email, array( 'travel_title', 'preferred_dates', 'status', 'message' ) ),
				'consultations' => self::bookings_for_email( 'consultation_booking', $email, array( 'consultation_type', 'service_title', 'booking_date', 'start_time', 'slot_offer', 'status', 'message' ) ),
			)
		);
	}

	private static function bookings_for_email( $type, $email, array $fields ) {
		$query = new WP_Query(
			array(
				'post_type'      => $type,
				'post_status'    => 'publish',
				'posts_per_page' => 50,
				'no_found_rows'  => true,
				'meta_query'     => array(
					array(
						'key'   => 'email',
						'value' => $email,
					),
				),
			)
		);

		$out = array();
		foreach ( $query->posts as $post ) {
			$row = array(
				'id'      => $post->ID,
				'title'   => get_the_title( $post ),
				'created' => get_post_time( 'c', false, $post ),
			);
			foreach ( $fields as $key ) {
				$row[ $key ] = JU_REST_Serialize::meta( $post->ID, $key );
			}
			$out[] = $row;
		}
		return $out;
	}

	private static function guard( WP_REST_Request $request, $need_honeypot = true ) {
		if ( $need_honeypot && $request->get_param( 'website' ) ) {
			return rest_ensure_response( array( 'ok' => true, 'id' => 0 ) );
		}

		$ip  = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown';
		$key = 'ju_rl_' . md5( $ip );
		$n   = (int) get_transient( $key );
		if ( $n >= 12 ) {
			return new WP_Error( 'ju_rate', 'Please wait a few minutes before sending again.', array( 'status' => 429 ) );
		}
		set_transient( $key, $n + 1, 10 * MINUTE_IN_SECONDS );
		return null;
	}

	private static function person( WP_REST_Request $request ) {
		$name     = sanitize_text_field( (string) $request->get_param( 'name' ) );
		$email    = sanitize_email( (string) $request->get_param( 'email' ) );
		$mobile   = sanitize_text_field( (string) ( $request->get_param( 'mobile' ) ?: $request->get_param( 'phone' ) ) );
		$location = sanitize_text_field( (string) ( $request->get_param( 'location' ) ?: $request->get_param( 'address' ) ) );
		$message  = sanitize_textarea_field( (string) $request->get_param( 'message' ) );

		if ( ! $name || ! is_email( $email ) || ! $mobile ) {
			return new WP_Error( 'ju_invalid', 'Name, email and mobile are required.', array( 'status' => 400 ) );
		}

		return compact( 'name', 'email', 'mobile', 'location', 'message' );
	}

	private static function user_eligible_for_free_slot( $user ) {
		if ( ! $user instanceof WP_User ) {
			return false;
		}
		if ( (int) get_user_meta( $user->ID, 'ju_free_consultation_used', true ) ) {
			return false;
		}

		$existing = new WP_Query(
			array(
				'post_type'      => 'consultation_booking',
				'post_status'    => 'publish',
				'posts_per_page' => 1,
				'no_found_rows'  => true,
				'fields'         => 'ids',
				'meta_query'     => array(
					'relation' => 'AND',
					array(
						'key'     => 'slot_offer',
						'value'   => array( '10 MIN FREE SLOT', '30 MIN FREE SLOT' ),
						'compare' => 'IN',
					),
					array(
						'relation' => 'OR',
						array(
							'key'   => 'email',
							'value' => $user->user_email,
						),
						array(
							'key'   => 'user_id',
							'value' => (string) $user->ID,
						),
					),
				),
			)
		);

		if ( $existing->have_posts() ) {
			update_user_meta( $user->ID, 'ju_free_consultation_used', 1 );
			return false;
		}

		return true;
	}

	private static function merge_user( array $p, WP_User $user ) {
		$meta = JU_JWT::public_user( $user );
		if ( empty( $p['name'] ) ) {
			$p['name'] = $meta['name'];
		}
		if ( empty( $p['email'] ) ) {
			$p['email'] = $meta['email'];
		}
		if ( empty( $p['mobile'] ) ) {
			$p['mobile'] = $meta['mobile'];
		}
		if ( empty( $p['location'] ) ) {
			$p['location'] = $meta['location'];
		}
		return $p;
	}

	private static function create_item( $type, $title, array $meta ) {
		$id = wp_insert_post(
			array(
				'post_type'   => $type,
				'post_status' => 'publish',
				'post_title'  => $title,
			),
			true
		);
		if ( is_wp_error( $id ) ) {
			return 0;
		}
		foreach ( $meta as $key => $value ) {
			if ( function_exists( 'update_field' ) ) {
				update_field( $key, $value, $id );
			} else {
				update_post_meta( $id, $key, $value );
			}
		}
		return (int) $id;
	}
}
