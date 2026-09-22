<?php
/**
 * HMAC JWT for customer sessions. Secret never leaves WordPress.
 *
 * @package JyothishiUncleCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JU_JWT {

	public static function secret() {
		$secret = get_option( 'ju_jwt_secret' );
		if ( ! $secret ) {
			$secret = wp_generate_password( 64, true, true );
			update_option( 'ju_jwt_secret', $secret, false );
		}
		return $secret;
	}

	public static function encode( $user_id ) {
		$header  = self::b64( wp_json_encode( array( 'typ' => 'JWT', 'alg' => 'HS256' ) ) );
		$payload = self::b64(
			wp_json_encode(
				array(
					'sub' => (int) $user_id,
					'iat' => time(),
					'exp' => time() + ( 14 * DAY_IN_SECONDS ),
				)
			)
		);
		$sig = self::b64( hash_hmac( 'sha256', $header . '.' . $payload, self::secret(), true ) );
		return $header . '.' . $payload . '.' . $sig;
	}

	public static function user_id_from_token( $token ) {
		$parts = explode( '.', (string) $token );
		if ( 3 !== count( $parts ) ) {
			return 0;
		}
		list( $header, $payload, $signature ) = $parts;
		$expected = self::b64( hash_hmac( 'sha256', $header . '.' . $payload, self::secret(), true ) );
		if ( ! hash_equals( $expected, $signature ) ) {
			return 0;
		}
		$data = json_decode( self::unb64( $payload ), true );
		if ( ! is_array( $data ) || empty( $data['sub'] ) || empty( $data['exp'] ) || $data['exp'] < time() ) {
			return 0;
		}
		return (int) $data['sub'];
	}

	public static function user_from_request( WP_REST_Request $request ) {
		$auth = (string) $request->get_header( 'authorization' );
		if ( ! preg_match( '/Bearer\s+(.+)/i', $auth, $matches ) ) {
			return null;
		}
		$user_id = self::user_id_from_token( $matches[1] );
		if ( ! $user_id ) {
			return null;
		}
		$user = get_user_by( 'id', $user_id );
		return $user ? $user : null;
	}

	public static function public_user( WP_User $user ) {
		return array(
			'id'               => $user->ID,
			'email'            => $user->user_email,
			'name'             => $user->display_name,
			'mobile'           => (string) get_user_meta( $user->ID, 'ju_mobile', true ),
			'location'         => (string) get_user_meta( $user->ID, 'ju_location', true ),
			'source'           => (string) get_user_meta( $user->ID, 'ju_source', true ),
			'message'          => (string) get_user_meta( $user->ID, 'ju_intro_message', true ),
			'profile_complete' => (bool) get_user_meta( $user->ID, 'ju_profile_complete', true ),
		);
	}

	private static function b64( $value ) {
		return rtrim( strtr( base64_encode( $value ), '+/', '-_' ), '=' );
	}

	private static function unb64( $value ) {
		$remainder = strlen( $value ) % 4;
		if ( $remainder ) {
			$value .= str_repeat( '=', 4 - $remainder );
		}
		return base64_decode( strtr( $value, '-_', '+/' ) );
	}
}
