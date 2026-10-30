<?php
/**
 * Admin email notifications via wp_mail (WP Mail SMTP when configured).
 *
 * @package JyothishiUncleCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JU_Mail {

	public static function notify( $subject, array $rows, $intro = '' ) {
		return self::send_to( self::admin_recipients(), $subject, $rows, $intro );
	}

	public static function send_to( $to, $subject, array $rows, $intro = '' ) {
		$recipients = array_values( array_filter( (array) $to, 'is_email' ) );
		if ( ! $recipients ) {
			return false;
		}

		$lines = '';
		foreach ( $rows as $label => $value ) {
			$text = (string) $value;
			$cell = esc_html( $text );
			if ( preg_match( '#^https?://#i', $text ) ) {
				$cell = '<a href="' . esc_url( $text ) . '">' . esc_html( $text ) . '</a>';
			}
			$lines .= '<tr><th style="text-align:left;padding:8px;border-bottom:1px solid #eee;width:180px;">' . esc_html( $label ) . '</th><td style="padding:8px;border-bottom:1px solid #eee;">' . $cell . '</td></tr>';
		}

		$lead     = $intro ? $intro : 'A new MaharshiOm submission was received.';
		$body     = '<p>' . esc_html( $lead ) . '</p><table cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;font-family:Georgia,serif;">' . $lines . '</table>';
		$headers  = array( 'Content-Type: text/html; charset=UTF-8' );
		$settings = JU_Settings::get();
		$from     = isset( $settings['admin_notify_email'] ) ? $settings['admin_notify_email'] : '';
		if ( is_email( $from ) ) {
			$headers[] = 'From: MaharshiOm <' . $from . '>';
		}

		return wp_mail( $recipients, $subject, $body, $headers );
	}

	/**
	 * Local WordPress uses Mailpit. Keep the saved Brevo mailer for a live site.
	 *
	 * @param mixed  $value Option value.
	 * @param string $group Option group.
	 * @param string $key   Option key.
	 * @return mixed
	 */
	public static function local_mailer( $value, $group, $key ) {
		if ( 'mail' !== $group || ! self::is_local_site() ) {
			return $value;
		}
		if ( 'mailer' === $key && ! self::remote_mailer_ready() ) {
			return 'mail';
		}
		if ( 'from_name' === $key ) {
			return 'MaharshiOm';
		}
		if ( 'from_email' === $key ) {
			$from = self::local_from_email();
			return $from ? $from : $value;
		}
		return $value;
	}

	private static function local_from_email() {
		static $from = false;
		if ( false !== $from ) {
			return $from;
		}
		$from = '';
		if ( class_exists( 'JU_Settings' ) ) {
			$settings = JU_Settings::get();
			$candidate = isset( $settings['admin_notify_email'] ) ? $settings['admin_notify_email'] : '';
			if ( is_email( $candidate ) ) {
				$from = $candidate;
			}
		}
		return $from;
	}

	private static function remote_mailer_ready() {
		$options = get_option( 'wp_mail_smtp', array() );
		$mailer  = isset( $options['mail']['mailer'] ) ? (string) $options['mail']['mailer'] : '';
		if ( 'sendinblue' === $mailer ) {
			$key = isset( $options['sendinblue']['api_key'] ) ? trim( (string) $options['sendinblue']['api_key'] ) : '';
			return strlen( $key ) > 10;
		}
		if ( 'smtp' === $mailer ) {
			return ! empty( $options['smtp']['host'] );
		}
		return false;
	}

	private static function is_local_site() {
		$host = isset( $_SERVER['HTTP_HOST'] ) ? strtolower( (string) $_SERVER['HTTP_HOST'] ) : '';
		$host = preg_replace( '/:\d+$/', '', $host );
		return in_array( $host, array( 'localhost', '127.0.0.1', 'jyothishiuncle.local' ), true );
	}

	private static function admin_recipients() {
		$settings = JU_Settings::get();
		$to       = array();
		if ( ! empty( $settings['admin_notify_email'] ) && is_email( $settings['admin_notify_email'] ) ) {
			$to[] = $settings['admin_notify_email'];
		}
		$admin = get_option( 'admin_email' );
		if ( $admin && is_email( $admin ) && ! in_array( $admin, $to, true ) ) {
			$to[] = $admin;
		}
		return $to;
	}
}

add_filter( 'wp_mail_smtp_options_get', array( 'JU_Mail', 'local_mailer' ), 10, 3 );
