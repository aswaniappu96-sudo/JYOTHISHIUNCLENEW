<?php
/**
 * Shape WordPress content for the public API. Never expose prices or private contacts.
 *
 * @package JyothishiUncleCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JU_REST_Serialize {

	public static function pooja( WP_Post $post ) {
		return array_merge(
			self::card( $post ),
			array(
				'full_description' => self::html_meta( $post->ID, 'full_description', $post->post_content ),
				'benefits'         => self::html_meta( $post->ID, 'benefits' ),
				'requirements'     => self::html_meta( $post->ID, 'requirements' ),
				'gallery'          => self::gallery( $post->ID ),
				'booking_enabled'  => (bool) self::meta( $post->ID, 'booking_enabled', true ),
				'whatsapp_message' => (string) self::meta( $post->ID, 'whatsapp_message', 'Hello, I am interested in ' . $post->post_title . '.' ),
			)
		);
	}

	public static function product( WP_Post $post ) {
		return array_merge(
			self::card( $post ),
			array(
				'full_description' => self::html_meta( $post->ID, 'full_description', $post->post_content ),
				'product_info'     => self::html_meta( $post->ID, 'product_info' ),
				'availability'     => (string) self::meta( $post->ID, 'availability', 'in_stock' ),
				'gallery'          => self::gallery( $post->ID ),
				'whatsapp_message' => (string) self::meta( $post->ID, 'whatsapp_message', 'Hello, I am interested in ' . $post->post_title . '.' ),
			)
		);
	}

	public static function service( WP_Post $post ) {
		return array_merge(
			self::card( $post ),
			array(
				'full_description'  => self::html_meta( $post->ID, 'full_description', $post->post_content ),
				'duration_minutes'  => (int) self::meta( $post->ID, 'duration_minutes', 30 ),
				'booking_enabled'   => (bool) self::meta( $post->ID, 'booking_enabled', true ),
				'whatsapp_message'  => (string) self::meta( $post->ID, 'whatsapp_message', 'Hello, I would like to book an astrology consultation.' ),
			)
		);
	}

	public static function astrologer( WP_Post $post ) {
		return array_merge(
			self::card( $post ),
			array(
				'specialty'          => (string) self::meta( $post->ID, 'specialty' ),
				'location'           => (string) self::meta( $post->ID, 'location' ),
				'full_description'   => self::html_meta( $post->ID, 'full_description', $post->post_content ),
				'first_session_note' => (string) self::meta( $post->ID, 'first_session_note', 'First call and chat are free.' ),
			)
		);
	}

	public static function travel( WP_Post $post ) {
		return array_merge(
			self::card( $post ),
			array(
				'location'           => (string) self::meta( $post->ID, 'location' ),
				'full_description'   => self::html_meta( $post->ID, 'full_description', $post->post_content ),
				'travel_information' => self::html_meta( $post->ID, 'travel_information' ),
				'phone'              => (string) self::meta( $post->ID, 'phone' ),
				'gallery'            => self::gallery( $post->ID ),
				'whatsapp_message'   => (string) self::meta( $post->ID, 'whatsapp_message', 'Hello, I need guidance for ' . $post->post_title . '.' ),
			)
		);
	}

	public static function faq( WP_Post $post ) {
		return array(
			'id'            => $post->ID,
			'slug'          => $post->post_name,
			'question'      => get_the_title( $post ),
			'answer'        => wp_kses_post( $post->post_content ),
			'display_order' => (int) self::meta( $post->ID, 'display_order', 10 ),
		);
	}

	public static function testimonial( WP_Post $post ) {
		return array(
			'id'            => $post->ID,
			'name'          => get_the_title( $post ),
			'review'        => (string) self::meta( $post->ID, 'review' ),
			'rating'        => (int) self::meta( $post->ID, 'rating', 5 ),
			'image'         => self::image( get_post_thumbnail_id( $post ) ),
			'display_order' => (int) self::meta( $post->ID, 'display_order', 10 ),
		);
	}

	public static function article( WP_Post $post ) {
		$cats = wp_get_post_terms( $post->ID, 'category', array( 'fields' => 'names' ) );
		$tags = wp_get_post_terms( $post->ID, 'post_tag', array( 'fields' => 'names' ) );

		return array(
			'id'            => $post->ID,
			'slug'          => $post->post_name,
			'title'         => get_the_title( $post ),
			'excerpt'       => wp_strip_all_tags( $post->post_excerpt ? $post->post_excerpt : wp_trim_words( wp_strip_all_tags( $post->post_content ), 24 ) ),
			'content'       => wp_kses_post( apply_filters( 'the_content', $post->post_content ) ),
			'date'          => get_post_time( 'c', true, $post ),
			'featured_image'=> self::image( get_post_thumbnail_id( $post ) ),
			'categories'    => is_wp_error( $cats ) ? array() : array_values( $cats ),
			'tags'          => is_wp_error( $tags ) ? array() : array_values( $tags ),
		);
	}

	public static function page( WP_Post $post ) {
		return array(
			'id'               => $post->ID,
			'slug'             => $post->post_name,
			'title'            => get_the_title( $post ),
			'content'          => wp_kses_post( apply_filters( 'the_content', $post->post_content ) ),
			'eyebrow'          => (string) self::meta( $post->ID, 'eyebrow' ),
			'hero_copy'        => (string) self::meta( $post->ID, 'hero_copy' ),
			'portrait_name'    => (string) self::meta( $post->ID, 'portrait_name' ),
			'portrait_caption' => (string) self::meta( $post->ID, 'portrait_caption' ),
			'featured_image'   => self::image( get_post_thumbnail_id( $post ) ),
			'image_1'          => self::field_image( $post->ID, 'image_1' ),
			'image_1_title'    => (string) self::meta( $post->ID, 'image_1_title' ),
			'image_1_copy'     => (string) self::meta( $post->ID, 'image_1_copy' ),
			'image_2'          => self::field_image( $post->ID, 'image_2' ),
			'image_2_title'    => (string) self::meta( $post->ID, 'image_2_title' ),
			'image_2_copy'     => (string) self::meta( $post->ID, 'image_2_copy' ),
		);
	}

	public static function card( WP_Post $post ) {
		return array(
			'id'                => $post->ID,
			'slug'              => $post->post_name,
			'title'             => get_the_title( $post ),
			'short_description' => (string) self::meta( $post->ID, 'short_description', $post->post_excerpt ),
			'featured_image'    => self::image( get_post_thumbnail_id( $post ) ),
			'display_order'     => (int) self::meta( $post->ID, 'display_order', 10 ),
			'show_on_homepage'  => (bool) self::meta( $post->ID, 'show_on_homepage', false ),
		);
	}

	public static function meta( $post_id, $key, $default = '' ) {
		if ( function_exists( 'get_field' ) ) {
			$value = get_field( $key, $post_id );
			if ( null !== $value && false !== $value && '' !== $value ) {
				return $value;
			}
		}

		$value = get_post_meta( $post_id, $key, true );
		return ( '' === $value || null === $value ) ? $default : $value;
	}

	private static function html_meta( $post_id, $key, $fallback = '' ) {
		$value = self::meta( $post_id, $key, $fallback );
		return wp_kses_post( (string) $value );
	}

	private static function gallery( $post_id ) {
		$ids = JU_Gallery_Meta::get_ids( $post_id );
		$out = array();
		foreach ( $ids as $id ) {
			$image = self::image( $id );
			if ( $image ) {
				$out[] = $image;
			}
		}
		return $out;
	}

	public static function field_image( $post_id, $key ) {
		$value = self::meta( $post_id, $key, 0 );
		if ( is_array( $value ) ) {
			if ( ! empty( $value['ID'] ) ) {
				return self::image( (int) $value['ID'] );
			}
			if ( ! empty( $value['id'] ) ) {
				return self::image( (int) $value['id'] );
			}
		}

		return self::image( (int) $value );
	}

	public static function image( $attachment_id ) {
		$attachment_id = (int) $attachment_id;
		if ( ! $attachment_id ) {
			return null;
		}

		$url = wp_get_attachment_image_url( $attachment_id, 'large' );
		if ( ! $url ) {
			return null;
		}

		$alt = get_post_meta( $attachment_id, '_wp_attachment_image_alt', true );

		return array(
			'id'    => $attachment_id,
			'url'   => $url,
			'alt'   => $alt ? $alt : '',
			'full'  => wp_get_attachment_image_url( $attachment_id, 'full' ),
			'thumb' => wp_get_attachment_image_url( $attachment_id, 'medium' ),
		);
	}
}
