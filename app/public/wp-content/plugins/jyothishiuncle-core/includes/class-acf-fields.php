<?php
/**
 * ACF free field groups. No Repeaters, Gallery, or Options pages.
 *
 * @package JyothishiUncleCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JU_ACF_Fields {

	public static function register() {
		if ( ! function_exists( 'acf_add_local_field_group' ) ) {
			return;
		}

		self::pooja();
		self::product();
		self::service();
		self::astrologer();
		self::site_pages();
		self::travel();
		self::faq();
		self::testimonial();
		self::customer_enquiry();
		self::pooja_booking();
		self::product_enquiry();
		self::consultation_booking();
		self::consultation_block();
	}

	private static function pooja() {
		acf_add_local_field_group(
			array(
				'key'      => 'group_ju_pooja',
				'title'    => 'Pooja details',
				'fields'   => array_merge(
					self::common_content_fields( 'pooja' ),
					array(
						self::field( 'field_pooja_benefits', 'benefits', 'Benefits', 'wysiwyg', 'Use a short bullet list.' ),
						self::field( 'field_pooja_requirements', 'requirements', 'Requirements', 'wysiwyg', 'Items the family should keep ready.' ),
						self::true_false( 'field_pooja_booking', 'booking_enabled', 'Allow booking', 1 ),
						self::true_false( 'field_pooja_home', 'show_on_homepage', 'Show on homepage', 1 ),
					)
				),
				'location' => self::location( 'pooja' ),
			)
		);
	}

	private static function product() {
		acf_add_local_field_group(
			array(
				'key'      => 'group_ju_product',
				'title'    => 'Product details',
				'fields'   => array_merge(
					self::common_content_fields( 'product' ),
					array(
						array(
							'key'     => 'field_product_availability',
							'label'   => 'Availability',
							'name'    => 'availability',
							'type'    => 'select',
							'choices' => array(
								'in_stock'      => 'Available',
								'made_to_order' => 'Made to order',
								'unavailable'   => 'Unavailable',
							),
							'default_value' => 'in_stock',
						),
						self::field( 'field_product_info', 'product_info', 'Product information', 'wysiwyg', 'Material, size, or how it is used.' ),
						self::true_false( 'field_product_home', 'show_on_homepage', 'Show on homepage', 1 ),
					)
				),
				'location' => self::location( 'product' ),
			)
		);
	}

	private static function service() {
		acf_add_local_field_group(
			array(
				'key'      => 'group_ju_service',
				'title'    => 'Service details',
				'fields'   => array_merge(
					self::common_content_fields( 'service' ),
					array(
						array(
							'key'           => 'field_service_duration',
							'label'         => 'Duration (minutes)',
							'name'          => 'duration_minutes',
							'type'          => 'number',
							'default_value' => 30,
							'min'           => 15,
							'step'          => 15,
						),
						self::true_false( 'field_service_booking', 'booking_enabled', 'Allow calendar booking', 1 ),
					)
				),
				'location' => self::location( 'astrology_service' ),
			)
		);
	}

	private static function astrologer() {
		acf_add_local_field_group(
			array(
				'key'      => 'group_ju_astrologer',
				'title'    => 'Astrologer details',
				'fields'   => array(
					self::field( 'field_astrologer_specialty', 'specialty', 'Specialty', 'text', 'Example: Jathaka, marriage matching, prashna.' ),
					self::field( 'field_astrologer_location', 'location', 'Location', 'text', 'Example: Thrissur, Kerala. Shown on the astrologers page.' ),
					self::field( 'field_astrologer_short', 'short_description', 'Short description', 'textarea' ),
					self::field( 'field_astrologer_full', 'full_description', 'Full biography', 'wysiwyg' ),
					self::field( 'field_astrologer_gift', 'first_session_note', 'First session note', 'text', 'Shown on the welcome popup and profile.' ),
					self::number( 'field_astrologer_order', 'display_order', 'Display order', 10 ),
					self::true_false( 'field_astrologer_home', 'show_on_homepage', 'Show on homepage', 0 ),
				),
				'location' => self::location( 'astrologer' ),
			)
		);
	}

	private static function travel() {
		acf_add_local_field_group(
			array(
				'key'      => 'group_ju_travel',
				'title'    => 'Travel details',
				'fields'   => array_merge(
					self::common_content_fields( 'travel' ),
					array(
						self::field( 'field_travel_location', 'location', 'Temple / place location', 'text' ),
						self::field( 'field_travel_info', 'travel_information', 'Travel information', 'wysiwyg' ),
						self::field( 'field_travel_phone', 'phone', 'Phone for this destination', 'text' ),
						self::true_false( 'field_travel_home', 'show_on_homepage', 'Show on homepage', 1 ),
					)
				),
				'location' => self::location( 'religious_travel' ),
			)
		);
	}

	private static function faq() {
		acf_add_local_field_group(
			array(
				'key'      => 'group_ju_faq',
				'title'    => 'FAQ details',
				'fields'   => array(
					self::number( 'field_faq_order', 'display_order', 'Display order', 10 ),
				),
				'location' => self::location( 'faq' ),
			)
		);
	}

	private static function testimonial() {
		acf_add_local_field_group(
			array(
				'key'      => 'group_ju_testimonial',
				'title'    => 'Testimonial details',
				'fields'   => array(
					self::field( 'field_testimonial_review', 'review', 'Review', 'textarea' ),
					array(
						'key'           => 'field_testimonial_rating',
						'label'         => 'Rating',
						'name'          => 'rating',
						'type'          => 'number',
						'min'           => 1,
						'max'           => 5,
						'default_value' => 5,
					),
					self::number( 'field_testimonial_order', 'display_order', 'Display order', 10 ),
				),
				'location' => self::location( 'testimonial' ),
			)
		);
	}

	private static function customer_enquiry() {
		acf_add_local_field_group(
			array(
				'key'      => 'group_ju_enquiry',
				'title'    => 'Enquiry',
				'fields'   => array_merge(
					self::person_fields( 'enquiry' ),
					array(
						self::field( 'field_enquiry_subject', 'subject', 'Subject', 'text' ),
						self::field( 'field_enquiry_source', 'source', 'How they heard about us', 'text' ),
						self::field( 'field_enquiry_message', 'message', 'Message', 'textarea' ),
						self::status_field( 'field_enquiry_status', 'new' ),
					)
				),
				'location' => self::location( 'customer_enquiry' ),
			)
		);
	}

	private static function pooja_booking() {
		acf_add_local_field_group(
			array(
				'key'      => 'group_ju_pooja_booking',
				'title'    => 'Pooja booking',
				'fields'   => array_merge(
					self::person_fields( 'pooja_booking' ),
					array(
						self::field( 'field_pb_pooja', 'pooja_title', 'Pooja', 'text' ),
						array(
							'key'           => 'field_pb_pooja_id',
							'label'         => 'Pooja ID',
							'name'          => 'pooja_id',
							'type'          => 'number',
							'instructions'  => 'Filled automatically from the website.',
						),
						array(
							'key'   => 'field_pb_date',
							'label' => 'Preferred date',
							'name'  => 'preferred_date',
							'type'  => 'date_picker',
							'return_format' => 'Y-m-d',
							'display_format' => 'd/m/Y',
						),
						self::field( 'field_pb_message', 'message', 'Message', 'textarea' ),
						self::status_field( 'field_pb_status', 'new' ),
					)
				),
				'location' => self::location( 'pooja_booking' ),
			)
		);
	}

	private static function product_enquiry() {
		acf_add_local_field_group(
			array(
				'key'      => 'group_ju_product_enquiry',
				'title'    => 'Product enquiry',
				'fields'   => array_merge(
					self::person_fields( 'product_enquiry' ),
					array(
						self::field( 'field_pe_product', 'product_title', 'Product', 'text' ),
						array(
							'key'  => 'field_pe_product_id',
							'label'=> 'Product ID',
							'name' => 'product_id',
							'type' => 'number',
						),
						self::number( 'field_pe_qty', 'quantity', 'Quantity', 1 ),
						self::field( 'field_pe_message', 'message', 'Message', 'textarea' ),
						self::status_field( 'field_pe_status', 'new' ),
					)
				),
				'location' => self::location( 'product_enquiry' ),
			)
		);
	}

	private static function consultation_booking() {
		acf_add_local_field_group(
			array(
				'key'      => 'group_ju_consult_booking',
				'title'    => 'Consultation booking',
				'fields'   => array_merge(
					self::person_fields( 'consult' ),
					array(
						array(
							'key'     => 'field_cb_type',
							'label'   => 'Consultation type',
							'name'    => 'consultation_type',
							'type'    => 'select',
							'choices' => array(
								'pooja'    => 'Pooja',
								'marriage' => 'Marriage',
								'jathaka'  => 'Jathaka',
								'other'    => 'Other',
							),
						),
						self::field( 'field_cb_service', 'service_title', 'Service / type label', 'text' ),
						array(
							'key'  => 'field_cb_service_id',
							'label'=> 'Service ID',
							'name' => 'service_id',
							'type' => 'number',
						),
						array(
							'key'            => 'field_cb_date',
							'label'          => 'Date (Oman)',
							'name'           => 'booking_date',
							'type'           => 'date_picker',
							'return_format'  => 'Y-m-d',
							'display_format' => 'd/m/Y',
						),
						self::field( 'field_cb_start', 'start_time', 'Start time (Oman)', 'time_picker', '', array( 'display_format' => 'H:i', 'return_format' => 'H:i' ) ),
						self::field( 'field_cb_end', 'end_time', 'End time (Oman)', 'time_picker', '', array( 'display_format' => 'H:i', 'return_format' => 'H:i' ) ),
						array(
							'key'     => 'field_cb_meeting',
							'label'   => 'Preferred meeting method',
							'name'    => 'meeting_method',
							'type'    => 'select',
							'choices' => array(
								'whatsapp'    => 'WhatsApp video',
								'google_meet' => 'Google Meet',
								'zoom'        => 'Zoom',
								'teams'       => 'Microsoft Teams',
							),
						),
						self::field( 'field_cb_message', 'message', 'Message', 'textarea' ),
						self::status_field( 'field_cb_status', 'new' ),
					)
				),
				'location' => self::location( 'consultation_booking' ),
			)
		);
	}

	private static function consultation_block() {
		acf_add_local_field_group(
			array(
				'key'      => 'group_ju_consult_block',
				'title'    => 'Blocked date',
				'fields'   => array(
					array(
						'key'            => 'field_block_date',
						'label'          => 'Date',
						'name'           => 'block_date',
						'type'           => 'date_picker',
						'return_format'  => 'Y-m-d',
						'display_format' => 'd/m/Y',
					),
					self::field( 'field_block_reason', 'reason', 'Reason (optional)', 'text' ),
				),
				'location' => self::location( 'consultation_block' ),
			)
		);
	}

	private static function site_pages() {
		acf_add_local_field_group(
			array(
				'key'      => 'group_ju_site_pages',
				'title'    => 'Page photos & headings',
				'fields'   => array(
					self::field( 'field_page_eyebrow', 'eyebrow', 'Small heading (eyebrow)', 'text', 'Short gold label above the title. Example: Vedic Lineage.' ),
					self::field( 'field_page_hero_copy', 'hero_copy', 'Intro text under the title', 'textarea', 'Shown under the page title on the public website.' ),
					self::field( 'field_page_portrait_name', 'portrait_name', 'Portrait name (About page)', 'text', 'Name on the portrait plaque. Used on About only.' ),
					self::field( 'field_page_portrait_note', 'portrait_caption', 'Portrait caption (About page)', 'text' ),
					self::image_field( 'field_page_image_1', 'image_1', 'Photo 2', 'Set Featured image (right sidebar) first — that is Photo 1. Photo 2: About homam, Contact second large photo. Optional on other pages.' ),
					self::field( 'field_page_image_1_title', 'image_1_title', 'Photo 2 title', 'text' ),
					self::field( 'field_page_image_1_copy', 'image_1_copy', 'Photo 2 text', 'textarea' ),
					self::image_field( 'field_page_image_2', 'image_2', 'Photo 3', 'About: Navagraha photo. Optional extra photo on other pages.' ),
					self::field( 'field_page_image_2_title', 'image_2_title', 'Photo 3 title', 'text' ),
					self::field( 'field_page_image_2_copy', 'image_2_copy', 'Photo 3 text', 'textarea' ),
				),
				'location' => array(
					array(
						array(
							'param'    => 'post_type',
							'operator' => '==',
							'value'    => 'page',
						),
					),
				),
			)
		);
	}

	private static function common_content_fields( $prefix ) {
		return array(
			self::field( "field_{$prefix}_short", 'short_description', 'Short description', 'textarea', 'One or two sentences for cards.' ),
			self::field( "field_{$prefix}_full", 'full_description', 'Full description', 'wysiwyg', 'Shown on the detail page. You can also use the main editor above.' ),
			self::field( "field_{$prefix}_internal_fee", 'internal_fee_note', 'Internal fee note (not shown on website)', 'text', 'Optional. For your records only. The public website does not display currency or prices.' ),
			self::field( "field_{$prefix}_wa", 'whatsapp_message', 'WhatsApp message', 'text', 'Example: Hello, I am interested in Ganapathi Homam.' ),
			self::number( "field_{$prefix}_order", 'display_order', 'Display order', 10 ),
		);
	}

	private static function person_fields( $prefix ) {
		return array(
			self::field( "field_{$prefix}_name", 'customer_name', 'Name', 'text' ),
			self::field( "field_{$prefix}_email", 'email', 'Email', 'email' ),
			self::field( "field_{$prefix}_mobile", 'mobile', 'Mobile', 'text' ),
			self::field( "field_{$prefix}_location", 'location', 'Location', 'text' ),
		);
	}

	private static function status_field( $key, $default = 'new' ) {
		return array(
			'key'           => $key,
			'label'         => 'Status',
			'name'          => 'status',
			'type'          => 'select',
			'choices'       => array(
				'new'       => 'New',
				'contacted' => 'Contacted',
				'confirmed' => 'Confirmed',
				'completed' => 'Completed',
				'cancelled' => 'Cancelled',
			),
			'default_value' => $default,
		);
	}

	private static function field( $key, $name, $label, $type, $instructions = '', $extra = array() ) {
		return array_merge(
			array(
				'key'          => $key,
				'label'        => $label,
				'name'         => $name,
				'type'         => $type,
				'instructions' => $instructions,
			),
			$extra
		);
	}

	private static function number( $key, $name, $label, $default ) {
		return array(
			'key'           => $key,
			'label'         => $label,
			'name'          => $name,
			'type'          => 'number',
			'default_value' => $default,
		);
	}

	private static function image_field( $key, $name, $label, $instructions = '' ) {
		return array(
			'key'           => $key,
			'label'         => $label,
			'name'          => $name,
			'type'          => 'image',
			'return_format' => 'id',
			'preview_size'  => 'medium',
			'library'       => 'all',
			'instructions'  => $instructions,
		);
	}

	private static function true_false( $key, $name, $label, $default ) {
		return array(
			'key'           => $key,
			'label'         => $label,
			'name'          => $name,
			'type'          => 'true_false',
			'ui'            => 1,
			'default_value' => $default,
		);
	}

	private static function location( $post_type ) {
		return array(
			array(
				array(
					'param'    => 'post_type',
					'operator' => '==',
					'value'    => $post_type,
				),
			),
		);
	}
}
