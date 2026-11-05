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

		self::catalog_taxonomy( 'pooja_category', 'pooja' );
		self::catalog_taxonomy( 'product_category', 'product' );

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

		self::public_type(
			'vendor',
			'Pooja Temple',
			'Pooja Temples',
			'dashicons-building',
			10,
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
			'website_registration',
			'Registration',
			'Registrations',
			'dashicons-id',
			25
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
			'Product Booking',
			'Product Bookings',
			'dashicons-cart',
			28
		);

		self::private_type(
			'travel_booking',
			'Yatra Booking',
			'Yatra Bookings',
			'dashicons-palmtree',
			29
		);

		self::private_type(
			'consultation_booking',
			'Scheduled Consultation',
			'Schedule Consultations',
			'dashicons-clock',
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
		remove_post_type_support( 'post', 'author' );
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

	public static function seed_categories() {
		if ( get_option( 'ju_catalog_categories_v1' ) ) {
			return;
		}

		$pooja_terms = array(
			'ganesha'    => 'Ganesha',
			'shiva'      => 'Shiva',
			'vishnu'     => 'Vishnu',
			'devi'       => 'Devi',
			'navagraha'  => 'Navagraha',
		);
		$product_terms = array(
			'rudraksha' => 'Rudraksha',
			'yantra'    => 'Yantra',
			'incense'   => 'Incense',
			'samagri'   => 'Puja samagri',
			'gem'       => 'Gem',
			'mala'      => 'Mala',
		);

		foreach ( $pooja_terms as $slug => $name ) {
			if ( ! term_exists( $slug, 'pooja_category' ) ) {
				wp_insert_term( $name, 'pooja_category', array( 'slug' => $slug ) );
			}
		}
		foreach ( $product_terms as $slug => $name ) {
			if ( ! term_exists( $slug, 'product_category' ) ) {
				wp_insert_term( $name, 'product_category', array( 'slug' => $slug ) );
			}
		}

		$pooja_rules = array(
			'ganesha'   => '/ganapathi|ganesha|ganesh|vinayaka/i',
			'shiva'     => '/mrityunjaya|mrityunjay|shiva|aghora|rudra|bhairav/i',
			'vishnu'    => '/sudarshan|vishnu|narayan/i',
			'devi'      => '/devi|durga|kali|lalita|chandi|laxmi|lakshmi|bagalamukhi|amman/i',
			'navagraha' => '/navagraha|nava\s*graha/i',
		);
		$product_rules = array(
			'rudraksha' => '/rudraksha/i',
			'yantra'    => '/yantra/i',
			'incense'   => '/incense|agarbatti|dhoop|sambrani/i',
			'samagri'   => '/ghee|chandan|sandal|kumkum|camphor|karpuram|samagri/i',
			'gem'       => '/\bgem|navratna|\bratna|pukhraj|neelam/i',
			'mala'      => '/\bmala|sphatik|tulsi|\bbead/i',
		);

		self::assign_seeded_terms( 'pooja', 'pooja_category', $pooja_rules );
		self::assign_seeded_terms( 'product', 'product_category', $product_rules );
		update_option( 'ju_catalog_categories_v1', 1, false );
	}

	private static function assign_seeded_terms( $post_type, $taxonomy, $rules ) {
		$posts = get_posts(
			array(
				'post_type'      => $post_type,
				'post_status'    => 'publish',
				'posts_per_page' => -1,
			)
		);
		foreach ( $posts as $post ) {
			if ( get_post_meta( $post->ID, '_ju_category_seeded', true ) ) {
				continue;
			}
			$text = $post->post_title . ' ' . $post->post_name . ' ' . $post->post_excerpt;
			$slug = '';
			foreach ( $rules as $candidate => $pattern ) {
				if ( preg_match( $pattern, $text ) ) {
					$slug = $candidate;
					break;
				}
			}
			if ( $slug ) {
				wp_set_object_terms( $post->ID, $slug, $taxonomy, false );
			}
			update_post_meta( $post->ID, '_ju_category_seeded', '1' );
		}
	}

	private static function catalog_taxonomy( $taxonomy, $post_type ) {
		register_taxonomy(
			$taxonomy,
			$post_type,
			array(
				'labels'            => array(
					'name'          => 'Categories',
					'singular_name' => 'Category',
					'menu_name'     => 'Categories',
					'all_items'     => 'All Categories',
					'add_new_item'  => 'Add New Category',
					'edit_item'     => 'Edit Category',
					'search_items'  => 'Search Categories',
				),
				'public'            => false,
				'show_ui'           => true,
				'show_admin_column' => true,
				'show_in_rest'      => true,
				'hierarchical'      => true,
				'rewrite'           => false,
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
