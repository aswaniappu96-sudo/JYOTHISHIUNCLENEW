<?php
/**
 * Plugin Name: JyothishiUncle CORS
 * Description: Lets the Vercel website read WordPress REST data in the browser.
 *
 * @package JyothishiUncleCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter(
	'rest_pre_serve_request',
	static function ( $value ) {
		$origin = get_http_origin();
		if ( $origin ) {
			header( 'Access-Control-Allow-Origin: ' . esc_url_raw( $origin ) );
			header( 'Vary: Origin' );
		} else {
			header( 'Access-Control-Allow-Origin: *' );
		}
		header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS' );
		header( 'Access-Control-Allow-Headers: Content-Type, Authorization' );
		return $value;
	},
	20
);
