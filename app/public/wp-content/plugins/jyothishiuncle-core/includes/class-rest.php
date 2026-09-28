<?php
/**
 * Public REST API for the Next.js frontend.
 *
 * @package JyothishiUncleCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JU_REST {

	const NS = 'ju/v1';

	public static function hooks() {
		add_action( 'rest_api_init', array( __CLASS__, 'register' ) );
		add_action( 'rest_api_init', array( __CLASS__, 'cors' ) );
	}

	public static function cors() {
		remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
		add_filter(
			'rest_pre_serve_request',
			function ( $value ) {
				$origin  = get_http_origin();
				$allowed = self::allowed_origins();

				if ( $origin && self::origin_allowed( $origin, $allowed ) ) {
					header( 'Access-Control-Allow-Origin: ' . $origin );
					header( 'Vary: Origin' );
					header( 'Access-Control-Allow-Credentials: true' );
				} else {
					header( 'Access-Control-Allow-Origin: *' );
				}

				header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS' );
				header( 'Access-Control-Allow-Headers: Content-Type, Authorization' );

				return $value;
			}
		);
	}

	private static function origin_allowed( $origin, array $allowed ) {
		if ( in_array( $origin, $allowed, true ) ) {
			return true;
		}
		return (bool) preg_match( '#^https://[a-z0-9-]+(\.vercel\.app)$#i', $origin );
	}

	private static function allowed_origins() {
		$origins = array(
			'http://localhost:3000',
			'http://127.0.0.1:3000',
		);

		$site = home_url();
		if ( $site ) {
			$origins[] = untrailingslashit( $site );
		}

		if ( defined( 'JU_FRONTEND_URL' ) && JU_FRONTEND_URL ) {
			$origins[] = untrailingslashit( (string) JU_FRONTEND_URL );
		}

		return apply_filters( 'ju_rest_allowed_origins', $origins );
	}

	public static function register() {
		$public = array(
			'methods'             => 'GET',
			'permission_callback' => '__return_true',
		);

		register_rest_route( self::NS, '/health', array_merge( $public, array( 'callback' => array( __CLASS__, 'health' ) ) ) );
		register_rest_route( self::NS, '/home', array_merge( $public, array( 'callback' => array( __CLASS__, 'home' ) ) ) );
		register_rest_route( self::NS, '/settings', array_merge( $public, array( 'callback' => array( __CLASS__, 'settings' ) ) ) );

		self::collection( '/poojas', 'poojas' );
		self::item( '/poojas/(?P<slug>[a-z0-9-]+)', 'pooja' );
		self::collection( '/vendors', 'vendors' );
		self::item( '/vendors/(?P<slug>[a-z0-9-]+)', 'vendor' );
		self::collection( '/products', 'products' );
		self::item( '/products/(?P<slug>[a-z0-9-]+)', 'product' );
		self::collection( '/services', 'services' );
		self::item( '/services/(?P<slug>[a-z0-9-]+)', 'service' );
		self::collection( '/astrologers', 'astrologers' );
		self::item( '/astrologers/(?P<slug>[a-z0-9-]+)', 'astrologer' );
		self::collection( '/travel', 'travel' );
		self::item( '/travel/(?P<slug>[a-z0-9-]+)', 'travel_item' );
		self::collection( '/faqs', 'faqs' );
		self::collection( '/testimonials', 'testimonials' );
		self::collection( '/articles', 'articles' );
		self::item( '/articles/(?P<slug>[a-z0-9-]+)', 'article' );
		self::item( '/pages/(?P<slug>[a-z0-9-]+)', 'page' );

		register_rest_route(
			self::NS,
			'/consultation/availability',
			array_merge(
				$public,
				array(
					'callback' => array( __CLASS__, 'availability' ),
					'args'     => array(
						'service' => array(
							'required'          => false,
							'sanitize_callback' => 'sanitize_title',
						),
						'month'   => array(
							'required'          => false,
							'sanitize_callback' => 'sanitize_text_field',
						),
					),
				)
			)
		);

		JU_Submissions::register();
	}

	private static function collection( $path, $method ) {
		register_rest_route(
			self::NS,
			$path,
			array(
				'methods'             => 'GET',
				'permission_callback' => '__return_true',
				'callback'            => array( __CLASS__, $method ),
			)
		);
	}

	private static function item( $path, $method ) {
		register_rest_route(
			self::NS,
			$path,
			array(
				'methods'             => 'GET',
				'permission_callback' => '__return_true',
				'callback'            => array( __CLASS__, $method ),
			)
		);
	}

	public static function health() {
		return rest_ensure_response(
			array(
				'ok'      => true,
				'plugin'  => 'jyothishiuncle-core',
				'version' => JU_CORE_VERSION,
			)
		);
	}

	public static function home() {
		$poojas       = self::serialize_many( 'pooja', null, array( 'JU_REST_Serialize', 'pooja' ) );
		$products     = self::serialize_many( 'product', null, array( 'JU_REST_Serialize', 'product' ) );
		$travel       = self::serialize_many( 'religious_travel', null, array( 'JU_REST_Serialize', 'travel' ) );
		$astrologers  = self::serialize_many( 'astrologer', null, array( 'JU_REST_Serialize', 'astrologer' ) );
		$featured_p   = array_values( array_filter( $poojas, array( __CLASS__, 'on_home' ) ) );
		$featured_pr  = array_values( array_filter( $products, array( __CLASS__, 'on_home' ) ) );
		$featured_t   = array_values( array_filter( $travel, array( __CLASS__, 'on_home' ) ) );
		$featured_a   = array_values( array_filter( $astrologers, array( __CLASS__, 'on_home' ) ) );
		$article_query = new WP_Query(
			array(
				'post_type'      => 'post',
				'post_status'    => 'publish',
				'posts_per_page' => 3,
				'orderby'        => 'date',
				'order'          => 'DESC',
				'no_found_rows'  => true,
				'post__not_in'   => self::excluded_article_ids(),
			)
		);

		return rest_ensure_response(
			array(
				'settings'     => self::settings_payload(),
				'poojas'       => array_slice( $featured_p ? $featured_p : $poojas, 0, 3 ),
				'products'     => array_slice( $featured_pr ? $featured_pr : $products, 0, 3 ),
				'astrologers'  => $featured_a,
				'services'     => self::serialize_many( 'astrology_service', null, array( 'JU_REST_Serialize', 'service' ) ),
				'travel'       => array_slice( $featured_t ? $featured_t : $travel, 0, 3 ),
				'faqs'         => self::serialize_many( 'faq', null, array( 'JU_REST_Serialize', 'faq' ) ),
				'testimonials' => self::serialize_many( 'testimonial', null, array( 'JU_REST_Serialize', 'testimonial' ) ),
				'articles'     => array_map( array( 'JU_REST_Serialize', 'article' ), $article_query->posts ),
			)
		);
	}

	public static function settings() {
		return rest_ensure_response( self::settings_payload() );
	}

	private static function on_home( $item ) {
		$value = isset( $item['show_on_homepage'] ) ? $item['show_on_homepage'] : false;
		if ( is_bool( $value ) ) {
			return $value;
		}
		if ( is_numeric( $value ) ) {
			return 1 === (int) $value;
		}
		return in_array( strtolower( trim( (string) $value ) ), array( '1', 'true', 'yes', 'on' ), true );
	}

	private static function settings_payload() {
		$s    = JU_Settings::get();
		$logo = JU_REST_Serialize::image( (int) $s['logo_id'] );
		$hero = JU_REST_Serialize::image( (int) $s['hero_image_id'] );
		$about_photo = JU_REST_Serialize::image( (int) $s['about_teaser_image_id'] );

		return array(
			'site_tagline'              => $s['site_tagline'],
			'whatsapp_number'           => $s['whatsapp_number'],
			'phone_number'              => $s['phone_number'],
			'address'                   => $s['address'],
			'hero_title'                => $s['hero_title'],
			'hero_subtitle'             => $s['hero_subtitle'],
			'hero_primary_cta_label'    => $s['hero_primary_cta_label'],
			'hero_primary_cta_url'      => $s['hero_primary_cta_url'],
			'about_excerpt'             => $s['about_excerpt'],
			'consultation_timezone'     => $s['consultation_timezone'],
			'consultation_slot_minutes' => (int) $s['consultation_slot_minutes'],
			'consultation_days'         => array_values( (array) $s['consultation_days'] ),
			'consultation_start_time'   => $s['consultation_start_time'],
			'consultation_end_time'     => $s['consultation_end_time'],
			'meeting_methods'           => array_values( (array) $s['meeting_methods'] ),
			'default_meeting_method'    => $s['default_meeting_method'],
			'show_prices_on_website'    => false,
			'social_instagram'          => $s['social_instagram'],
			'social_facebook'           => $s['social_facebook'],
			'social_youtube'            => $s['social_youtube'],
			'footer_text'               => $s['footer_text'],
			'brand'                     => array(
				'midnight' => $s['brand_midnight'],
				'saffron'  => $s['brand_saffron'],
				'cream'    => $s['brand_cream'],
				'ink'      => $s['brand_ink'],
			),
			'logo'                      => $logo,
			'logo_url'                  => $logo && ! empty( $logo['url'] ) ? $logo['url'] : JU_CORE_URL . 'assets/logo-placeholder.svg',
			'hero_image'                => $hero,
			'about_teaser_image'        => $about_photo,
		);
	}

	public static function poojas( WP_REST_Request $request ) {
		return rest_ensure_response( self::serialize_many( 'pooja', $request, array( 'JU_REST_Serialize', 'pooja' ) ) );
	}

	public static function pooja( WP_REST_Request $request ) {
		return self::one( 'pooja', $request['slug'], array( 'JU_REST_Serialize', 'pooja' ) );
	}

	public static function vendors() {
		return rest_ensure_response( self::serialize_many( 'vendor', null, array( 'JU_REST_Serialize', 'vendor' ) ) );
	}

	public static function vendor( WP_REST_Request $request ) {
		return self::one( 'vendor', $request['slug'], array( 'JU_REST_Serialize', 'vendor' ) );
	}

	public static function products( WP_REST_Request $request ) {
		return rest_ensure_response( self::serialize_many( 'product', $request, array( 'JU_REST_Serialize', 'product' ) ) );
	}

	public static function product( WP_REST_Request $request ) {
		return self::one( 'product', $request['slug'], array( 'JU_REST_Serialize', 'product' ) );
	}

	public static function services( WP_REST_Request $request ) {
		return rest_ensure_response( self::serialize_many( 'astrology_service', $request, array( 'JU_REST_Serialize', 'service' ) ) );
	}

	public static function service( WP_REST_Request $request ) {
		return self::one( 'astrology_service', $request['slug'], array( 'JU_REST_Serialize', 'service' ) );
	}

	public static function astrologers( WP_REST_Request $request ) {
		return rest_ensure_response( self::serialize_many( 'astrologer', $request, array( 'JU_REST_Serialize', 'astrologer' ) ) );
	}

	public static function astrologer( WP_REST_Request $request ) {
		return self::one( 'astrologer', $request['slug'], array( 'JU_REST_Serialize', 'astrologer' ) );
	}

	public static function travel( WP_REST_Request $request ) {
		return rest_ensure_response( self::serialize_many( 'religious_travel', $request, array( 'JU_REST_Serialize', 'travel' ) ) );
	}

	public static function travel_item( WP_REST_Request $request ) {
		return self::one( 'religious_travel', $request['slug'], array( 'JU_REST_Serialize', 'travel' ) );
	}

	public static function faqs() {
		return rest_ensure_response( self::serialize_many( 'faq', null, array( 'JU_REST_Serialize', 'faq' ) ) );
	}

	public static function testimonials() {
		return rest_ensure_response( self::serialize_many( 'testimonial', null, array( 'JU_REST_Serialize', 'testimonial' ) ) );
	}

	public static function articles( WP_REST_Request $request ) {
		$per_page = min( 20, max( 1, (int) $request->get_param( 'per_page' ) ?: 6 ) );
		$query    = new WP_Query(
			array(
				'post_type'      => 'post',
				'post_status'    => 'publish',
				'posts_per_page' => $per_page,
				'orderby'        => 'date',
				'order'          => 'DESC',
				'no_found_rows'  => true,
				'post__not_in'   => self::excluded_article_ids(),
			)
		);

		return rest_ensure_response( array_map( array( 'JU_REST_Serialize', 'article' ), $query->posts ) );
	}

	private static function excluded_article_ids() {
		$hello = get_page_by_path( 'hello-world', OBJECT, 'post' );
		return $hello ? array( $hello->ID ) : array();
	}

	public static function article( WP_REST_Request $request ) {
		return self::one( 'post', $request['slug'], array( 'JU_REST_Serialize', 'article' ) );
	}

	public static function page( WP_REST_Request $request ) {
		return self::one( 'page', $request['slug'], array( 'JU_REST_Serialize', 'page' ) );
	}

	public static function availability( WP_REST_Request $request ) {
		$settings = JU_Settings::get();
		$month    = $request->get_param( 'month' );
		$service  = $request->get_param( 'service' );

		if ( ! $month || ! preg_match( '/^\d{4}-\d{2}$/', $month ) ) {
			$month = wp_date( 'Y-m', null, new DateTimeZone( $settings['consultation_timezone'] ) );
		}

		$duration = (int) $settings['consultation_slot_minutes'];
		if ( $service ) {
			$post = get_page_by_path( $service, OBJECT, 'astrology_service' );
			if ( $post ) {
				$custom = (int) JU_REST_Serialize::meta( $post->ID, 'duration_minutes', $duration );
				if ( $custom > 0 ) {
					$duration = $custom;
				}
			}
		}

		$days = JU_Availability::month_slots( $month, $duration, $settings );

		return rest_ensure_response(
			array(
				'timezone'      => $settings['consultation_timezone'],
				'month'         => $month,
				'slot_minutes'  => $duration,
				'working_days'  => array_values( (array) $settings['consultation_days'] ),
				'start_time'    => $settings['consultation_start_time'],
				'end_time'      => $settings['consultation_end_time'],
				'days'          => $days,
				'note'          => 'Times are stored in the consultation timezone. The website should convert them to the visitor’s local clock.',
			)
		);
	}

	private static function serialize_many( $post_type, $request, $callback ) {
		$homepage = $request instanceof WP_REST_Request ? (int) $request->get_param( 'homepage' ) : 0;

		$query = new WP_Query(
			array(
				'post_type'      => $post_type,
				'post_status'    => 'publish',
				'posts_per_page' => 100,
				'no_found_rows'  => true,
			)
		);
		$items = array_map( $callback, $query->posts );

		if ( $homepage ) {
			$items = array_values( array_filter( $items, array( __CLASS__, 'on_home' ) ) );
		}

		$items = array_map(
			static function ( $item ) {
				if ( is_array( $item ) ) {
					unset( $item['gallery'] );
				}
				return $item;
			},
			$items
		);

		usort(
			$items,
			function ( $a, $b ) {
				$ao = isset( $a['display_order'] ) ? (int) $a['display_order'] : 10;
				$bo = isset( $b['display_order'] ) ? (int) $b['display_order'] : 10;
				if ( $ao === $bo ) {
					return 0;
				}
				return $ao < $bo ? -1 : 1;
			}
		);

		return $items;
	}

	private static function one( $post_type, $slug, $callback ) {
		$post = get_page_by_path( sanitize_title( $slug ), OBJECT, $post_type );
		if ( ! $post || 'publish' !== $post->post_status ) {
			return new WP_Error( 'ju_not_found', 'Not found.', array( 'status' => 404 ) );
		}

		return rest_ensure_response( call_user_func( $callback, $post ) );
	}
}
