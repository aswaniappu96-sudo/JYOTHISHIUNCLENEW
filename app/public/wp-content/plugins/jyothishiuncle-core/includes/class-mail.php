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
		$settings = JU_Settings::get();
		$to       = array();
		if ( ! empty( $settings['admin_notify_email'] ) && is_email( $settings['admin_notify_email'] ) ) {
			$to[] = $settings['admin_notify_email'];
		}
		$admin = get_option( 'admin_email' );
		if ( $admin && is_email( $admin ) && ! in_array( $admin, $to, true ) ) {
			$to[] = $admin;
		}
		if ( ! $to ) {
			return false;
		}

		$lines = '';
		foreach ( $rows as $label => $value ) {
			$lines .= '<tr><th style="text-align:left;padding:8px;border-bottom:1px solid #eee;width:180px;">' . esc_html( $label ) . '</th><td style="padding:8px;border-bottom:1px solid #eee;">' . esc_html( (string) $value ) . '</td></tr>';
		}

		$lead = $intro ? $intro : 'A new JyothishiUncle submission was received.';
		$body = '<p>' . esc_html( $lead ) . '</p><table cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;font-family:Georgia,serif;">' . $lines . '</table>';

		return wp_mail(
			$to,
			$subject,
			$body,
			array(
				'Content-Type: text/html; charset=UTF-8',
			)
		);
	}
}
