<?php
/**
 * CSV exports for admin.
 *
 * @package JyothishiUncleCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JU_Export {

	public static function hooks() {
		add_action( 'admin_post_ju_export', array( __CLASS__, 'handle' ) );
		add_action( 'restrict_manage_posts', array( __CLASS__, 'button' ) );
		add_action( 'admin_notices', array( __CLASS__, 'users_button' ) );
	}

	public static function button() {
		$screen = get_current_screen();
		if ( ! $screen || ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$map = array(
			'customer_enquiry'     => 'enquiries',
			'website_registration' => 'registrations',
			'pooja_booking'        => 'pooja_bookings',
			'product_enquiry'      => 'product_enquiries',
			'travel_booking'       => 'travel_bookings',
			'consultation_booking' => 'consultation_bookings',
		);
		if ( ! isset( $map[ $screen->post_type ] ) ) {
			return;
		}

		$url = wp_nonce_url( admin_url( 'admin-post.php?action=ju_export&type=' . $map[ $screen->post_type ] ), 'ju_export' );
		echo '<a class="button button-primary" href="' . esc_url( $url ) . '" style="margin-left:8px;">Export CSV</a>';
	}

	public static function users_button() {
		$screen = get_current_screen();
		if ( ! $screen || 'users' !== $screen->id || ! current_user_can( 'manage_options' ) ) {
			return;
		}
		$url = wp_nonce_url( admin_url( 'admin-post.php?action=ju_export&type=users' ), 'ju_export' );
		echo '<div class="notice notice-info"><p>Export customer details: <a class="button button-primary" href="' . esc_url( $url ) . '">Export CSV</a></p></div>';
	}

	public static function handle() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( 'Not allowed' );
		}
		check_admin_referer( 'ju_export' );

		$type = sanitize_key( (string) wp_unslash( $_GET['type'] ?? '' ) );
		$rows = array();
		$name = 'jyothishiuncle-' . $type . '-' . gmdate( 'Y-m-d' ) . '.csv';

		if ( 'users' === $type ) {
			$rows = self::users();
		} elseif ( 'registrations' === $type ) {
			$rows = self::posts(
				'website_registration',
				array(
					'Name'           => 'customer_name',
					'Email'          => 'email',
					'Mobile'         => 'mobile',
					'Location'       => 'location',
					'How they heard' => 'source',
					'Message'        => 'message',
					'Status'         => 'status',
				)
			);
		} elseif ( 'enquiries' === $type ) {
			$rows = self::posts(
				'customer_enquiry',
				array( 'Name' => 'customer_name', 'Email' => 'email', 'Mobile' => 'mobile', 'Location' => 'location', 'Subject' => 'subject', 'Source' => 'source', 'Message' => 'message', 'Status' => 'status' )
			);
		} elseif ( 'pooja_bookings' === $type ) {
			$rows = self::posts(
				'pooja_booking',
				array(
					'Customer'     => 'customer_name',
					'Email'        => 'email',
					'Pooja'          => 'pooja_title',
					'Mode'           => 'offering_mode',
					'Pooja temple'   => 'vendor_name',
					'Date'           => 'preferred_date',
					'Phone'        => 'mobile',
					'Location'     => 'location',
					'Message'      => 'message',
					'Status'       => 'status',
				)
			);
		} elseif ( 'product_enquiries' === $type ) {
			$rows = self::posts(
				'product_enquiry',
				array(
					'Customer' => 'customer_name',
					'Email'    => 'email',
					'Product'  => 'product_title',
					'Quantity' => 'quantity',
					'Phone'    => 'mobile',
					'Location' => 'location',
					'Message'  => 'message',
					'Status'   => 'status',
				)
			);
		} elseif ( 'travel_bookings' === $type ) {
			$rows = self::posts(
				'travel_booking',
				array(
					'Customer'        => 'customer_name',
					'Email'           => 'email',
					'Yatra'           => 'travel_title',
					'Preferred dates' => 'preferred_dates',
					'Phone'           => 'mobile',
					'Location'        => 'location',
					'Message'         => 'message',
					'Status'          => 'status',
				)
			);
		} elseif ( 'consultation_bookings' === $type ) {
			$rows = self::posts(
				'consultation_booking',
				array(
					'Customer'   => 'customer_name',
					'Astrologer' => 'astrologer_name',
					'Type'       => 'consultation_type',
					'Service'    => 'service_title',
					'Date'       => 'booking_date',
					'Time'       => 'start_time',
					'Slot'       => 'slot_offer',
					'Phone'      => 'mobile',
					'Email'      => 'email',
					'Location'   => 'location',
					'Message'    => 'message',
					'Status'     => 'status',
				)
			);
			foreach ( $rows as &$row ) {
				$row['Astrologer'] = JU_Consultation_Schedule::astrologer_label( $row['Astrologer'] );
			}
			unset( $row );
		} else {
			wp_die( 'Unknown export' );
		}

		self::send( $name, $rows );
	}

	private static function users() {
		$users = get_users( array( 'role' => 'customer', 'number' => 2000 ) );
		$out   = array();
		foreach ( $users as $user ) {
			$out[] = array(
				'Name'               => $user->display_name,
				'Email'              => $user->user_email,
				'Mobile'             => (string) get_user_meta( $user->ID, 'ju_mobile', true ),
				'Location'           => (string) get_user_meta( $user->ID, 'ju_location', true ),
				'How they heard'     => (string) get_user_meta( $user->ID, 'ju_source', true ),
				'Message'            => (string) get_user_meta( $user->ID, 'ju_intro_message', true ),
				'Status'             => (string) get_user_meta( $user->ID, 'ju_reg_status', true ),
				'Registration date'  => $user->user_registered,
			);
		}
		return $out;
	}

	private static function posts( $type, array $map ) {
		$query = new WP_Query(
			array(
				'post_type'      => $type,
				'post_status'    => 'any',
				'posts_per_page' => 2000,
				'no_found_rows'  => true,
			)
		);
		$out = array();
		foreach ( $query->posts as $post ) {
			$row = array();
			foreach ( $map as $label => $key ) {
				$row[ $label ] = (string) JU_REST_Serialize::meta( $post->ID, $key );
			}
			$row['Booking date'] = get_post_time( 'Y-m-d H:i', false, $post );
			$out[] = $row;
		}
		return $out;
	}

	private static function send( $filename, array $rows ) {
		nocache_headers();
		header( 'Content-Type: text/csv; charset=utf-8' );
		header( 'Content-Disposition: attachment; filename=' . $filename );
		$out = fopen( 'php://output', 'w' );
		fwrite( $out, "\xEF\xBB\xBF" );
		if ( $rows ) {
			fputcsv( $out, array_keys( $rows[0] ) );
			foreach ( $rows as $row ) {
				fputcsv( $out, $row );
			}
		} else {
			fputcsv( $out, array( 'No records' ) );
		}
		fclose( $out );
		exit;
	}
}
