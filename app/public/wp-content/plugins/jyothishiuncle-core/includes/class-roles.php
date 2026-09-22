<?php
/**
 * Customer role. Customers must not access wp-admin.
 *
 * @package JyothishiUncleCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JU_Roles {

	public static function register() {
		if ( get_role( 'customer' ) ) {
			return;
		}

		add_role(
			'customer',
			__( 'Customer', 'jyothishiuncle-core' ),
			array(
				'read' => true,
			)
		);
	}
}
