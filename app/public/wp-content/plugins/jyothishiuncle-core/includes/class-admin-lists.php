<?php
/**
 * Admin list columns for bookings and enquiries.
 *
 * @package JyothishiUncleCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JU_Admin_Lists {

	public static function hooks() {
		foreach ( array( 'customer_enquiry', 'pooja_booking', 'product_enquiry', 'consultation_booking' ) as $type ) {
			add_filter( "manage_{$type}_posts_columns", array( __CLASS__, 'columns' ) );
			add_action( "manage_{$type}_posts_custom_column", array( __CLASS__, 'column' ), 10, 2 );
		}
		add_action( 'admin_init', array( __CLASS__, 'block_customers' ) );
		add_filter( 'show_admin_bar', array( __CLASS__, 'admin_bar' ) );
	}

	public static function columns( $columns ) {
		$screen = get_current_screen();
		$type   = $screen ? $screen->post_type : '';
		$base   = array(
			'cb'     => $columns['cb'],
			'title'  => 'Record',
			'person' => 'Customer',
			'meta'   => 'Details',
			'status' => 'Status',
			'date'   => 'Date',
		);
		if ( 'pooja_booking' === $type ) {
			$base['meta'] = 'Pooja / date';
		}
		if ( 'product_enquiry' === $type ) {
			$base['meta'] = 'Product / qty';
		}
		if ( 'consultation_booking' === $type ) {
			$base['meta'] = 'Service / slot';
		}
		return $base;
	}

	public static function column( $column, $post_id ) {
		if ( 'person' === $column ) {
			echo esc_html( JU_REST_Serialize::meta( $post_id, 'customer_name' ) );
			echo '<br><span style="color:#646970;">' . esc_html( JU_REST_Serialize::meta( $post_id, 'email' ) ) . '</span>';
			return;
		}
		if ( 'status' === $column ) {
			echo esc_html( JU_REST_Serialize::meta( $post_id, 'status', 'new' ) );
			return;
		}
		if ( 'meta' === $column ) {
			$type = get_post_type( $post_id );
			if ( 'pooja_booking' === $type ) {
				echo esc_html( JU_REST_Serialize::meta( $post_id, 'pooja_title' ) . ' · ' . JU_REST_Serialize::meta( $post_id, 'preferred_date' ) );
			} elseif ( 'product_enquiry' === $type ) {
				echo esc_html( JU_REST_Serialize::meta( $post_id, 'product_title' ) . ' × ' . JU_REST_Serialize::meta( $post_id, 'quantity' ) );
			} elseif ( 'consultation_booking' === $type ) {
				echo esc_html( JU_REST_Serialize::meta( $post_id, 'service_title' ) . ' · ' . JU_REST_Serialize::meta( $post_id, 'booking_date' ) . ' ' . JU_REST_Serialize::meta( $post_id, 'start_time' ) );
			} elseif ( 'customer_enquiry' === $type ) {
				$subject = JU_REST_Serialize::meta( $post_id, 'subject' );
				echo esc_html( $subject ? $subject : JU_REST_Serialize::meta( $post_id, 'mobile' ) );
			} else {
				echo esc_html( JU_REST_Serialize::meta( $post_id, 'mobile' ) );
			}
		}
	}

	public static function block_customers() {
		if ( ! is_admin() || wp_doing_ajax() ) {
			return;
		}
		$user = wp_get_current_user();
		if ( $user && in_array( 'customer', (array) $user->roles, true ) && ! current_user_can( 'manage_options' ) ) {
			wp_safe_redirect( home_url( '/' ) );
			exit;
		}
	}

	public static function admin_bar( $show ) {
		$user = wp_get_current_user();
		if ( $user && in_array( 'customer', (array) $user->roles, true ) ) {
			return false;
		}
		return $show;
	}
}
