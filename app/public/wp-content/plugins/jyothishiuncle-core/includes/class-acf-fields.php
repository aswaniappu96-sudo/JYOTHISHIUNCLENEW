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
		self::content_translations();
		self::vendor();
		add_filter( 'acf/load_field/key=field_vendor_poojas', array( __CLASS__, 'pooja_tick_choices' ) );
		self::site_pages();
		self::travel();
		self::article();
		self::faq();
		self::testimonial();
		self::customer_enquiry();
		self::website_registration();
		self::pooja_booking();
		self::product_enquiry();
		self::travel_booking();
		self::consultation_booking();
	}

	private static function content_translations() {
		self::translation_group(
			'pooja_i18n',
			'Pooja translations',
			'pooja',
			array(
				array( 'name' => 'title', 'label' => 'Title', 'type' => 'text' ),
				array( 'name' => 'short_description', 'label' => 'Short description', 'type' => 'textarea' ),
				array( 'name' => 'full_description', 'label' => 'Full description', 'type' => 'wysiwyg' ),
				array( 'name' => 'benefits', 'label' => 'Benefits', 'type' => 'wysiwyg' ),
				array( 'name' => 'requirements', 'label' => 'Requirements', 'type' => 'wysiwyg' ),
			)
		);
		self::translation_group(
			'product_i18n',
			'Product translations',
			'product',
			array(
				array( 'name' => 'title', 'label' => 'Title', 'type' => 'text' ),
				array( 'name' => 'short_description', 'label' => 'Short description', 'type' => 'textarea' ),
				array( 'name' => 'full_description', 'label' => 'Full description', 'type' => 'wysiwyg' ),
				array( 'name' => 'product_info', 'label' => 'Product information', 'type' => 'wysiwyg' ),
			)
		);
		self::translation_group(
			'astrologer_i18n',
			'Astrologer translations',
			'astrologer',
			array(
				array( 'name' => 'title', 'label' => 'Name', 'type' => 'text' ),
				array( 'name' => 'specialty', 'label' => 'Specialty', 'type' => 'text' ),
				array( 'name' => 'location', 'label' => 'Location', 'type' => 'text' ),
				array( 'name' => 'short_description', 'label' => 'Short description', 'type' => 'textarea' ),
				array( 'name' => 'full_description', 'label' => 'Full biography', 'type' => 'wysiwyg' ),
				array( 'name' => 'first_session_note', 'label' => 'First session note', 'type' => 'text' ),
			)
		);
		self::translation_group(
			'article_i18n',
			'Article translations',
			'post',
			array(
				array( 'name' => 'title', 'label' => 'Title', 'type' => 'text' ),
				array( 'name' => 'excerpt', 'label' => 'Excerpt', 'type' => 'textarea' ),
				array( 'name' => 'content', 'label' => 'Article body', 'type' => 'wysiwyg' ),
			)
		);
		self::translation_group(
			'travel_i18n',
			'Travel translations',
			'religious_travel',
			array(
				array( 'name' => 'title', 'label' => 'Title', 'type' => 'text' ),
				array( 'name' => 'location', 'label' => 'Location', 'type' => 'text' ),
				array( 'name' => 'short_description', 'label' => 'Short description', 'type' => 'textarea' ),
				array( 'name' => 'full_description', 'label' => 'Full description', 'type' => 'wysiwyg' ),
				array( 'name' => 'travel_information', 'label' => 'Travel information', 'type' => 'wysiwyg' ),
			)
		);
		self::translation_group(
			'service_i18n',
			'Service translations',
			'astrology_service',
			array(
				array( 'name' => 'title', 'label' => 'Title', 'type' => 'text' ),
				array( 'name' => 'short_description', 'label' => 'Short description', 'type' => 'textarea' ),
				array( 'name' => 'full_description', 'label' => 'Full description', 'type' => 'wysiwyg' ),
			)
		);
		self::translation_group(
			'vendor_i18n',
			'Temple translations',
			'vendor',
			array(
				array( 'name' => 'title', 'label' => 'Title', 'type' => 'text' ),
				array( 'name' => 'location', 'label' => 'Location', 'type' => 'text' ),
				array( 'name' => 'short_description', 'label' => 'Short description', 'type' => 'textarea' ),
				array( 'name' => 'full_description', 'label' => 'Full description', 'type' => 'wysiwyg' ),
			)
		);
	}

	private static function translation_group( $key, $title, $post_type, $fields, $intro = '' ) {
		$acf_fields = array();
		$locales    = class_exists( 'JU_I18n' ) ? JU_I18n::content_locales() : array();
		if ( ! $locales ) {
			$locales = array(
				array( 'id' => 'hi', 'native' => 'हिन्दी' ),
				array( 'id' => 'ta', 'native' => 'தமிழ்' ),
				array( 'id' => 'ml', 'native' => 'മലയാളം' ),
				array( 'id' => 'kn', 'native' => 'ಕನ್ನಡ' ),
				array( 'id' => 'te', 'native' => 'తెలుగు' ),
			);
		}

		$acf_fields[] = array(
			'key'       => 'field_' . $key . '_tab_en',
			'label'     => 'English',
			'name'      => '',
			'type'      => 'tab',
			'placement' => 'top',
		);
		$acf_fields[] = array(
			'key'     => 'field_' . $key . '_en_note',
			'label'   => 'English',
			'name'    => '',
			'type'    => 'message',
			'message' => $intro
				? $intro
				: 'Edit English in the Title and fields above this box. Then click Hindi, Tamil, Malayalam, Kannada, or Telugu. Leave a box blank to keep the English text on the website.',
		);

		foreach ( $locales as $locale ) {
			$id = sanitize_key( $locale['id'] );
			$acf_fields[] = array(
				'key'       => 'field_' . $key . '_tab_' . $id,
				'label'     => $locale['native'],
				'name'      => '',
				'type'      => 'tab',
				'placement' => 'top',
			);
			foreach ( $fields as $field ) {
				$name         = $field['name'] . '_' . $id;
				$acf_fields[] = self::field(
					'field_' . $key . '_' . $name,
					$name,
					$field['label'],
					$field['type'],
					'Leave blank to keep the English text.'
				);
			}
		}

		acf_add_local_field_group(
			array(
				'key'        => 'group_' . $key,
				'title'      => $title,
				'fields'     => $acf_fields,
				'location'   => self::location( $post_type ),
				'position'   => 'acf_after_title',
				'menu_order' => 0,
			)
		);
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
					self::field( 'field_astrologer_location', 'location', 'Location', 'text', 'Example: Thrissur. Shown on the astrologers page.' ),
					self::field( 'field_astrologer_short', 'short_description', 'Short description', 'textarea' ),
					self::field( 'field_astrologer_full', 'full_description', 'Full biography', 'wysiwyg' ),
					self::field( 'field_astrologer_gift', 'first_session_note', 'First session note', 'text', 'Shown on the welcome popup and profile.' ),
					self::number( 'field_astrologer_order', 'display_order', 'Display order', 10 ),
					self::true_false( 'field_astrologer_home', 'show_on_homepage', 'Show on homepage', 0, 'Yes = appear on the home page. No = only on the Astrologers page.' ),
				),
				'location' => self::location( 'astrologer' ),
			)
		);
	}

	private static function vendor() {
		acf_add_local_field_group(
			array(
				'key'      => 'group_ju_vendor',
				'title'    => 'Pooja temple details',
				'fields'   => array(
					self::field( 'field_vendor_location', 'location', 'Temple / place', 'text', 'Shown on the pooja page and in the booking form.' ),
					self::field( 'field_vendor_short', 'short_description', 'Short description', 'textarea', 'One or two sentences for the pooja page list.' ),
					self::field( 'field_vendor_full', 'full_description', 'Full description', 'wysiwyg', 'Optional extra notes about this pooja temple.' ),
					self::field(
						'field_vendor_poojas',
						'temple_poojas',
						'Poojas at this temple',
						'checkbox',
						'Tick the poojas performed at this temple. Only the ticked poojas appear under this temple on the website.',
						array(
							'choices'       => array(),
							'layout'        => 'vertical',
							'return_format' => 'value',
							'toggle'        => 1,
						)
					),
					self::number( 'field_vendor_order', 'display_order', 'Display order', 10 ),
				),
				'location' => self::location( 'vendor' ),
			)
		);
	}

	public static function pooja_tick_choices( $field ) {
		$posts = get_posts(
			array(
				'post_type'      => 'pooja',
				'post_status'    => 'publish',
				'posts_per_page' => 100,
				'orderby'        => 'title',
				'order'          => 'ASC',
				'no_found_rows'  => true,
			)
		);
		$choices = array();
		foreach ( $posts as $post ) {
			$choices[ (string) $post->ID ] = html_entity_decode( get_the_title( $post ), ENT_QUOTES | ENT_HTML5, 'UTF-8' );
		}
		$field['choices'] = $choices;
		return $field;
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

	private static function website_registration() {
		acf_add_local_field_group(
			array(
				'key'      => 'group_ju_registration',
				'title'    => 'Registration',
				'fields'   => array_merge(
					self::person_fields( 'registration' ),
					array(
						array(
							'key'           => 'field_reg_account_type',
							'label'         => 'Register as',
							'name'          => 'account_type',
							'type'          => 'select',
							'choices'       => array(
								'user'       => 'User',
								'astrologer' => 'Astrologer',
							),
							'default_value' => 'user',
						),
						self::field( 'field_reg_experience', 'experience', 'Years of experience', 'text' ),
						self::field( 'field_reg_languages', 'languages', 'Languages', 'text' ),
						self::field( 'field_reg_specialties', 'specialties', 'Specialties', 'text' ),
						self::field( 'field_reg_source', 'source', 'How they heard about us', 'text' ),
						self::field( 'field_reg_message', 'message', 'Message', 'textarea' ),
						array(
							'key'          => 'field_reg_user_id',
							'label'        => 'User ID',
							'name'         => 'user_id',
							'type'         => 'number',
							'instructions' => 'Filled automatically from the website Register form.',
						),
						self::status_field(
							'field_reg_status',
							'new',
							array(
								'new'       => 'New',
								'contacted' => 'Contacted',
								'confirmed' => 'Active',
								'cancelled' => 'Inactive',
							)
						),
					)
				),
				'location' => self::location( 'website_registration' ),
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
						array(
							'key'           => 'field_pb_mode',
							'label'         => 'Online or offline',
							'name'          => 'offering_mode',
							'type'          => 'select',
							'choices'       => array(
								'online'  => 'Online',
								'offline' => 'Offline',
							),
							'default_value' => 'online',
						),
						self::field( 'field_pb_vendor', 'vendor_name', 'Pooja temple', 'text', 'Filled when the family chooses a temple for online or offline pooja.' ),
						array(
							'key'          => 'field_pb_vendor_id',
							'label'        => 'Temple ID',
							'name'         => 'vendor_id',
							'type'         => 'number',
							'instructions' => 'Filled automatically from the website.',
						),
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
				'title'    => 'Product booking',
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

	private static function travel_booking() {
		acf_add_local_field_group(
			array(
				'key'      => 'group_ju_travel_booking',
				'title'    => 'Yatra booking',
				'fields'   => array_merge(
					self::person_fields( 'travel_booking' ),
					array(
						self::field( 'field_tb_travel', 'travel_title', 'Yatra', 'text' ),
						array(
							'key'          => 'field_tb_travel_id',
							'label'        => 'Destination ID',
							'name'         => 'travel_id',
							'type'         => 'number',
							'instructions' => 'Filled automatically from the website.',
						),
						self::field( 'field_tb_dates', 'preferred_dates', 'Preferred dates', 'text', 'Month, festival, or dates the family shared.' ),
						self::field( 'field_tb_message', 'message', 'Message', 'textarea' ),
						self::status_field( 'field_tb_status', 'new' ),
					)
				),
				'location' => self::location( 'travel_booking' ),
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
							'label'          => 'Date',
							'name'           => 'booking_date',
							'type'           => 'date_picker',
							'return_format'  => 'Y-m-d',
							'display_format' => 'd/m/Y',
						),
						self::field( 'field_cb_start', 'start_time', 'Start time', 'time_picker', '', array( 'display_format' => 'H:i', 'return_format' => 'H:i' ) ),
						self::field( 'field_cb_end', 'end_time', 'End time', 'time_picker', '', array( 'display_format' => 'H:i', 'return_format' => 'H:i' ) ),
						array(
							'key'     => 'field_cb_meeting',
							'label'   => 'Preferred meeting method',
							'name'    => 'meeting_method',
							'type'    => 'select',
							'choices' => array(
								'zegocloud'   => 'ZEGOCLOUD',
								'whatsapp'    => 'WhatsApp video',
								'google_meet' => 'Google Meet',
								'zoom'        => 'Zoom',
								'teams'       => 'Microsoft Teams',
							),
							'default_value' => 'zegocloud',
						),
						self::field( 'field_cb_message', 'message', 'Message', 'textarea' ),
						self::field(
							'field_cb_astrologer',
							'astrologer_name',
							'Astrologer',
							'text',
							'The astrologer this booking is for. Bookings from the homepage calendar are saved as “Consultation only”.'
						),
						self::field(
							'field_cb_slot_offer',
							'slot_offer',
							'Slot offer',
							'text',
							'Set automatically for a logged-in first consultation as “10 MIN FREE SLOT”.'
						),
						self::field(
							'field_cb_room_key',
							'room_key',
							'Customer video key',
							'text',
							'Private key in the customer video link. The room opens 10 minutes before the booked time.'
						),
						self::field(
							'field_cb_host_key',
							'host_key',
							'Astrologer video key',
							'text',
							'Private key in the astrologer video link. Do not send this key to the customer.'
						),
						self::field(
							'field_cb_room_id',
							'room_id',
							'Meeting room ID',
							'text',
							'ZEGOCLOUD room for this booking. Saved automatically. The private video keys stay separate.'
						),
						array(
							'key'           => 'field_cb_meeting_provider',
							'label'         => 'Meeting provider',
							'name'          => 'meeting_provider',
							'type'          => 'select',
							'choices'       => array(
								'zegocloud' => 'ZEGOCLOUD',
							),
							'instructions'  => 'Saved automatically when the consultation is booked.',
							'default_value' => 'zegocloud',
						),
						array(
							'key'           => 'field_cb_meeting_status',
							'label'         => 'Meeting status',
							'name'          => 'meeting_status',
							'type'          => 'select',
							'choices'       => array(
								'scheduled' => 'Scheduled',
								'ready'     => 'Ready to join',
								'ended'     => 'Ended',
								'closed'    => 'Closed',
							),
							'instructions'  => 'Scheduled when the booking is saved. The video room still opens 10 minutes before the booked time.',
							'default_value' => 'scheduled',
						),
						array(
							'key'   => 'field_cb_user_id',
							'label' => 'User ID',
							'name'  => 'user_id',
							'type'  => 'number',
						),
						self::status_field( 'field_cb_status', 'new', JU_Consultation_Schedule::status_choices() ),
					)
				),
				'location' => self::location( 'consultation_booking' ),
			)
		);
	}

	private static function article() {
		acf_add_local_field_group(
			array(
				'key'      => 'group_ju_article',
				'title'    => 'Writer',
				'fields'   => array(
					self::field(
						'field_article_writer_name',
						'writer_name',
						'Writer name',
						'text',
						'Shown on the public article page. Leave blank to show JyothishiUncle. This is not the WordPress login name.'
					),
				),
				'location' => self::location( 'post' ),
				'position' => 'side',
			)
		);
	}

	private static function site_pages() {
		$locales = class_exists( 'JU_I18n' ) ? JU_I18n::content_locales() : array();
		if ( ! $locales ) {
			$locales = array(
				array( 'id' => 'hi', 'native' => 'हिन्दी' ),
				array( 'id' => 'ta', 'native' => 'தமிழ்' ),
				array( 'id' => 'ml', 'native' => 'മലയാളം' ),
				array( 'id' => 'kn', 'native' => 'ಕನ್ನಡ' ),
				array( 'id' => 'te', 'native' => 'తెలుగు' ),
			);
		}

		$about_id       = self::page_id_by_slug( 'about' );
		$contact_id     = self::page_id_by_slug( 'contact' );
		$astrologers_id = self::page_id_by_slug( 'astrologers' );
		$exclude_ids    = array_values( array_filter( array( $about_id, $contact_id, $astrologers_id ) ) );

		self::register_page_heading_group(
			'group_ju_site_pages',
			'Page headings & languages',
			$locales,
			array(
				'eyebrow'   => true,
				'hero_copy' => true,
				'about'     => false,
				'photos'    => false,
			),
			self::page_locations_excluding( $exclude_ids ),
			'<strong>1 · Page hero:</strong> edit the title above, the eyebrow and intro here, and set <em>Featured image</em> in the right sidebar.<br><strong>Languages:</strong> English / Hindi / Tamil / Malayalam / Kannada / Telugu. Leave a language blank to keep English.'
		);

		if ( $about_id ) {
			self::register_page_heading_group(
				'group_ju_about_page',
				'About page sections',
				$locales,
				array(
					'eyebrow'   => true,
					'hero_copy' => true,
					'about'     => true,
					'photos'    => true,
				),
				array(
					array(
						array(
							'param'    => 'page',
							'operator' => '==',
							'value'    => (string) $about_id,
						),
					),
				),
				'<strong>1 · Page hero:</strong> title, eyebrow, intro, Featured image (portrait).<br><strong>2 · Extra photos:</strong> Photo 2 and Photo 3 below.<br><strong>Languages:</strong> use the language tabs, then Update.'
			);
		}

		if ( $contact_id ) {
			self::register_page_heading_group(
				'group_ju_contact_page',
				'Contact page sections',
				$locales,
				array(
					'eyebrow'   => true,
					'hero_copy' => true,
					'about'     => false,
					'photos'    => true,
					'photo3'    => false,
				),
				array(
					array(
						array(
							'param'    => 'page',
							'operator' => '==',
							'value'    => (string) $contact_id,
						),
					),
				),
				'<strong>1 · Page hero:</strong> title, eyebrow, intro, Featured image (first large photo).<br><strong>2 · Photo 2:</strong> second large photo below.<br><strong>Languages:</strong> use the language tabs, then Update.'
			);
		}

		if ( $astrologers_id ) {
			$astro_fields   = array();
			$astro_fields[] = array(
				'key'       => 'field_astro_page_tab_hero',
				'label'     => '1 · Page hero',
				'name'      => '',
				'type'      => 'tab',
				'placement' => 'top',
			);
			$astro_fields[] = array(
				'key'     => 'field_astro_page_hero_help',
				'label'   => 'Page hero',
				'name'    => '',
				'type'    => 'message',
				'message' => '<p>This tab is the <strong>Astrologers page heading</strong> visitors see at the top.</p><ul><li><strong>Title</strong> — the main WordPress title field above this box.</li><li><strong>Eyebrow</strong> — short gold label above the title.</li><li><strong>Intro</strong> — text under the title.</li><li><strong>Featured image</strong> — optional page hero photo in the right sidebar.</li></ul><p>Use the language tabs (English / Hindi / …) for translations, then click Update.</p>',
			);
			$astro_fields[] = self::field( 'field_astro_page_eyebrow', 'eyebrow', 'Small heading (eyebrow)', 'text', 'Short gold label above the title. Example: Live video consulting.' );
			$astro_fields[] = self::field( 'field_astro_page_hero_copy', 'hero_copy', 'Intro text under the title', 'textarea', 'Shown under the page title on the public website.' );

			$astro_fields[] = array(
				'key'       => 'field_astro_page_tab_listing',
				'label'     => '2 · Astrologer listing',
				'name'      => '',
				'type'      => 'tab',
				'placement' => 'top',
			);
			$astro_fields[] = array(
				'key'     => 'field_astro_page_listing_help',
				'label'   => 'Astrologer cards',
				'name'    => '',
				'type'    => 'message',
				'message' => '<p>Astrologer <strong>cards and portraits are not edited on this page</strong>.</p><p>Open <strong>Astrologers</strong> in the left menu. Each person has a name, bio, languages, and Featured image (portrait). Those cards appear in the listing below the page hero.</p>',
			);

			$astro_fields[] = array(
				'key'       => 'field_astro_page_tab_cta',
				'label'     => '3 · Lower page sections',
				'name'      => '',
				'type'      => 'tab',
				'placement' => 'top',
			);
			$astro_fields[] = array(
				'key'     => 'field_astro_page_cta_help',
				'label'   => 'Wisdom, tools, match CTA',
				'name'    => '',
				'type'    => 'message',
				'message' => '<p>Below the listing, the public page also shows Jyotisha wisdom, free tools, and a match CTA. Homepage-style headings for those shared blocks are edited under <a href="' . esc_url( admin_url( 'admin.php?page=ju-settings' ) ) . '">JyothishiUncle → Home page</a> section tabs (Talk to an Astrologer, Free astrology tools, Personalized Guidance).</p>',
			);

			$translated = array(
				array( 'name' => 'title', 'label' => 'Title', 'type' => 'text' ),
				array( 'name' => 'eyebrow', 'label' => 'Small heading (eyebrow)', 'type' => 'text' ),
				array( 'name' => 'hero_copy', 'label' => 'Intro text under the title', 'type' => 'textarea' ),
				array( 'name' => 'content', 'label' => 'Page body', 'type' => 'wysiwyg' ),
			);
			foreach ( $locales as $locale ) {
				$id             = sanitize_key( $locale['id'] );
				$astro_fields[] = array(
					'key'       => 'field_astro_page_tab_' . $id,
					'label'     => $locale['native'],
					'name'      => '',
					'type'      => 'tab',
					'placement' => 'top',
				);
				foreach ( $translated as $field ) {
					$name           = $field['name'] . '_' . $id;
					$astro_fields[] = self::field(
						'field_astro_page_i18n_' . $name,
						$name,
						$field['label'],
						$field['type'],
						'Leave blank to keep the English text on the website.'
					);
				}
			}

			acf_add_local_field_group(
				array(
					'key'        => 'group_ju_astrologers_page',
					'title'      => 'Astrologers page sections',
					'fields'     => $astro_fields,
					'location'   => array(
						array(
							array(
								'param'    => 'page',
								'operator' => '==',
								'value'    => (string) $astrologers_id,
							),
						),
					),
					'position'   => 'acf_after_title',
					'menu_order' => 0,
				)
			);
		}
	}

	private static function page_id_by_slug( $slug ) {
		$page = get_page_by_path( $slug );
		return $page ? (int) $page->ID : 0;
	}

	private static function page_locations_excluding( $exclude_ids ) {
		$rule = array(
			array(
				'param'    => 'post_type',
				'operator' => '==',
				'value'    => 'page',
			),
		);
		foreach ( (array) $exclude_ids as $id ) {
			$rule[] = array(
				'param'    => 'page',
				'operator' => '!=',
				'value'    => (string) $id,
			);
		}
		return array( $rule );
	}

	private static function register_page_heading_group( $key, $title, $locales, $opts, $location, $help_html ) {
		$prefix = 'field_' . sanitize_key( str_replace( 'group_', '', $key ) ) . '_';
		$fields = array();
		$fields[] = array(
			'key'       => $prefix . 'tab_en',
			'label'     => 'English',
			'name'      => '',
			'type'      => 'tab',
			'placement' => 'top',
		);
		$fields[] = array(
			'key'     => $prefix . 'help',
			'label'   => 'How to edit this page',
			'name'    => '',
			'type'    => 'message',
			'message' => $help_html,
		);
		if ( ! empty( $opts['eyebrow'] ) ) {
			$fields[] = self::field( $prefix . 'eyebrow', 'eyebrow', 'Small heading (eyebrow)', 'text', 'Short gold label above the title. Example: Vedic Lineage.' );
		}
		if ( ! empty( $opts['hero_copy'] ) ) {
			$fields[] = self::field( $prefix . 'hero_copy', 'hero_copy', 'Intro text under the title', 'textarea', 'Shown under the page title on the public website.' );
		}
		if ( ! empty( $opts['about'] ) ) {
			$fields[] = self::field( $prefix . 'portrait_name', 'portrait_name', 'Portrait name (About page)', 'text', 'Name on the portrait plaque. Used on About only.' );
			$fields[] = self::field( $prefix . 'portrait_note', 'portrait_caption', 'Portrait caption (About page)', 'text' );
		}
		if ( ! empty( $opts['photos'] ) ) {
			$fields[] = self::image_field( $prefix . 'image_1', 'image_1', 'Photo 2', 'Set Featured image (right sidebar) first — that is Photo 1.' );
			$fields[] = self::field( $prefix . 'image_1_title', 'image_1_title', 'Photo 2 title', 'text' );
			$fields[] = self::field( $prefix . 'image_1_copy', 'image_1_copy', 'Photo 2 text', 'textarea' );
			if ( ! isset( $opts['photo3'] ) || $opts['photo3'] ) {
				$fields[] = self::image_field( $prefix . 'image_2', 'image_2', 'Photo 3', 'About: Navagraha photo. Optional on Contact.' );
				$fields[] = self::field( $prefix . 'image_2_title', 'image_2_title', 'Photo 3 title', 'text' );
				$fields[] = self::field( $prefix . 'image_2_copy', 'image_2_copy', 'Photo 3 text', 'textarea' );
			}
		}

		$translated = array(
			array( 'name' => 'title', 'label' => 'Title', 'type' => 'text' ),
			array( 'name' => 'eyebrow', 'label' => 'Small heading (eyebrow)', 'type' => 'text' ),
			array( 'name' => 'hero_copy', 'label' => 'Intro text under the title', 'type' => 'textarea' ),
			array( 'name' => 'content', 'label' => 'Page body', 'type' => 'wysiwyg' ),
		);
		if ( ! empty( $opts['about'] ) ) {
			$translated[] = array( 'name' => 'portrait_name', 'label' => 'Portrait name', 'type' => 'text' );
			$translated[] = array( 'name' => 'portrait_caption', 'label' => 'Portrait caption', 'type' => 'text' );
		}
		if ( ! empty( $opts['photos'] ) ) {
			$translated[] = array( 'name' => 'image_1_title', 'label' => 'Photo 2 title', 'type' => 'text' );
			$translated[] = array( 'name' => 'image_1_copy', 'label' => 'Photo 2 text', 'type' => 'textarea' );
			if ( ! isset( $opts['photo3'] ) || $opts['photo3'] ) {
				$translated[] = array( 'name' => 'image_2_title', 'label' => 'Photo 3 title', 'type' => 'text' );
				$translated[] = array( 'name' => 'image_2_copy', 'label' => 'Photo 3 text', 'type' => 'textarea' );
			}
		}

		foreach ( $locales as $locale ) {
			$id       = sanitize_key( $locale['id'] );
			$fields[] = array(
				'key'       => $prefix . 'tab_' . $id,
				'label'     => $locale['native'],
				'name'      => '',
				'type'      => 'tab',
				'placement' => 'top',
			);
			foreach ( $translated as $field ) {
				$name     = $field['name'] . '_' . $id;
				$fields[] = self::field(
					$prefix . 'i18n_' . $name,
					$name,
					$field['label'],
					$field['type'],
					'Leave blank to keep the English text on the website.'
				);
			}
		}

		acf_add_local_field_group(
			array(
				'key'        => $key,
				'title'      => $title,
				'fields'     => $fields,
				'location'   => $location,
				'position'   => 'acf_after_title',
				'menu_order' => 0,
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

	private static function status_field( $key, $default = 'new', $choices = array() ) {
		if ( ! $choices ) {
			$choices = array(
				'new'       => 'New',
				'contacted' => 'Contacted',
				'confirmed' => 'Confirmed',
				'completed' => 'Completed',
				'cancelled' => 'Cancelled',
			);
		}
		return array(
			'key'           => $key,
			'label'         => 'Status',
			'name'          => 'status',
			'type'          => 'select',
			'choices'       => $choices,
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

	private static function true_false( $key, $name, $label, $default, $instructions = '' ) {
		return array(
			'key'           => $key,
			'label'         => $label,
			'name'          => $name,
			'type'          => 'true_false',
			'ui'            => 1,
			'default_value' => $default,
			'instructions'  => $instructions,
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
