<?php
/**
 * Custom post types and article labels.
 *
 * @package JyothishiUncleCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JU_Post_Types {

	public static function register() {
		self::public_type(
			'pooja',
			'Pooja',
			'Poojas',
			'dashicons-star-filled',
			5,
			array( 'title', 'editor', 'thumbnail', 'excerpt' )
		);

		self::public_type(
			'product',
			'Product',
			'Products',
			'dashicons-tag',
			6,
			array( 'title', 'editor', 'thumbnail', 'excerpt' )
		);

		self::public_type(
			'astrology_service',
			'Astrology Service',
			'Astrology Services',
			'dashicons-visibility',
			7,
			array( 'title', 'editor', 'thumbnail', 'excerpt' )
		);

		self::public_type(
			'astrologer',
			'Astrologer',
			'Astrologers',
			'dashicons-groups',
			8,
			array( 'title', 'editor', 'thumbnail', 'excerpt' )
		);

		self::public_type(
			'religious_travel',
			'Religious Travel',
			'Religious Travel',
			'dashicons-location-alt',
			9,
			array( 'title', 'editor', 'thumbnail', 'excerpt' )
		);

		self::ui_type(
			'faq',
			'FAQ',
			'FAQs',
			'dashicons-editor-help',
			20,
			array( 'title', 'editor' )
		);

		self::ui_type(
			'testimonial',
			'Testimonial',
			'Testimonials',
			'dashicons-format-quote',
			21,
			array( 'title', 'thumbnail' )
		);

		self::private_type(
			'customer_enquiry',
			'Customer Enquiry',
			'Customer Enquiries',
			'dashicons-email-alt',
			26
		);

		self::private_type(
			'pooja_booking',
			'Pooja Booking',
			'Pooja Bookings',
			'dashicons-calendar-alt',
			27
		);

		self::private_type(
			'product_enquiry',
			'Product Enquiry',
			'Product Enquiries',
			'dashicons-cart',
			28
		);

		self::private_type(
			'consultation_booking',
			'Consultation Booking',
			'Consultation Bookings',
			'dashicons-clock',
			29
		);

		self::private_type(
			'consultation_block',
			'Blocked Date',
			'Blocked Dates',
			'dashicons-hidden',
			30
		);
	}

	public static function relabel_articles() {
		$post = get_post_type_object( 'post' );
		if ( ! $post ) {
			return;
		}

		$post->labels->name               = 'Articles';
		$post->labels->singular_name      = 'Article';
		$post->labels->add_new            = 'Add Article';
		$post->labels->add_new_item       = 'Add Article';
		$post->labels->edit_item          = 'Edit Article';
		$post->labels->new_item           = 'New Article';
		$post->labels->view_item          = 'View Article';
		$post->labels->search_items       = 'Search Articles';
		$post->labels->not_found          = 'No articles found';
		$post->labels->not_found_in_trash = 'No articles found in Trash';
		$post->labels->all_items          = 'All Articles';
		$post->labels->menu_name          = 'Articles';
		$post->labels->name_admin_bar     = 'Article';
	}

	private static function public_type( $slug, $singular, $plural, $icon, $position, $supports ) {
		register_post_type(
			$slug,
			array(
				'labels'              => self::labels( $singular, $plural ),
				'public'              => true,
				'publicly_queryable'  => false,
				'show_ui'             => true,
				'show_in_menu'        => true,
				'show_in_rest'        => true,
				'rest_base'           => $slug,
				'has_archive'         => false,
				'rewrite'             => array( 'slug' => $slug ),
				'exclude_from_search' => true,
				'menu_icon'           => $icon,
				'menu_position'       => $position,
				'supports'            => $supports,
				'capability_type'     => 'post',
			)
		);
	}

	private static function ui_type( $slug, $singular, $plural, $icon, $position, $supports ) {
		register_post_type(
			$slug,
			array(
				'labels'              => self::labels( $singular, $plural ),
				'public'              => false,
				'publicly_queryable'  => false,
				'show_ui'             => true,
				'show_in_menu'        => true,
				'show_in_rest'        => true,
				'rest_base'           => $slug,
				'has_archive'         => false,
				'rewrite'             => false,
				'exclude_from_search' => true,
				'menu_icon'           => $icon,
				'menu_position'       => $position,
				'supports'            => $supports,
				'capability_type'     => 'post',
			)
		);
	}

	private static function private_type( $slug, $singular, $plural, $icon, $position ) {
		register_post_type(
			$slug,
			array(
				'labels'              => self::labels( $singular, $plural ),
				'public'              => false,
				'publicly_queryable'  => false,
				'show_ui'             => true,
				'show_in_menu'        => true,
				'show_in_rest'        => false,
				'has_archive'         => false,
				'rewrite'             => false,
				'exclude_from_search' => true,
				'menu_icon'           => $icon,
				'menu_position'       => $position,
				'supports'            => array( 'title' ),
				'capability_type'     => 'post',
				'map_meta_cap'        => true,
			)
		);
	}

	private static function labels( $singular, $plural ) {
		return array(
			'name'               => $plural,
			'singular_name'      => $singular,
			'add_new'            => 'Add New',
			'add_new_item'       => 'Add ' . $singular,
			'edit_item'          => 'Edit ' . $singular,
			'new_item'           => 'New ' . $singular,
			'view_item'          => 'View ' . $singular,
			'search_items'       => 'Search ' . $plural,
			'not_found'          => 'No items found',
			'not_found_in_trash' => 'No items found in Trash',
			'all_items'          => 'All ' . $plural,
			'menu_name'          => $plural,
		);
	}
}
