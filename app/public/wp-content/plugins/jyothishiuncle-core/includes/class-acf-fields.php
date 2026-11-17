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
		$services_id    = self::page_id_by_slug( 'services' );
		$travel_id      = self::page_id_by_slug( 'religious-travel' );
		$articles_id    = self::page_id_by_slug( 'articles' );
		$exclude_ids    = array_values(
			array_filter(
				array( $about_id, $contact_id, $astrologers_id, $services_id, $travel_id, $articles_id )
			)
		);

		self::register_page_heading_group(
			'group_ju_site_pages',
			'Page sections',
			$locales,
			array(
				'eyebrow'   => true,
				'hero_copy' => true,
				'about'     => false,
				'photos'    => false,
			),
			self::page_locations_excluding( $exclude_ids ),
			'<p><strong>1 · Page hero</strong> — title (WordPress title above), eyebrow, intro, Featured image.</p><p><strong>2 · Page body</strong> — use the main WordPress editor for policy / long text.</p><p><strong>Languages</strong> — Hindi / Tamil / Malayalam / Kannada / Telugu tabs. Leave blank to keep English.</p>'
		);

		if ( $about_id ) {
			$about_fields   = array();
			$about_fields[] = array(
				'key'       => 'field_about_tab_banner',
				'label'     => '1 · Guru-Shishya Parampara (banner)',
				'name'      => '',
				'type'      => 'tab',
				'placement' => 'top',
			);
			$about_fields[] = array(
				'key'     => 'field_about_banner_help',
				'label'   => 'Banner',
				'name'    => '',
				'type'    => 'message',
				'message' => '<p><strong>Title</strong> — use the main WordPress title above this box (example: The Unbroken Lineage of Stellar Seers).</p><p>This tab is the top banner: eyebrow, intro, and the four lineage cards under the tree graphic.</p>',
			);
			$about_fields[] = self::field( 'field_about_eyebrow', 'eyebrow', 'Eyebrow', 'text', 'Short gold label above the title. Example: Guru-Shishya Parampara · Vedic Lineage' );
			$about_fields[] = self::field( 'field_about_hero_copy', 'hero_copy', 'Intro under the title', 'textarea', 'Shown under the banner heading.' );
			$about_fields[] = self::field( 'field_about_root_1_title', 'root_1_title', 'Lineage card 1 title', 'text', 'Example: PARASHARA HORA' );
			$about_fields[] = self::field( 'field_about_root_1_copy', 'root_1_copy', 'Lineage card 1 text', 'text', 'Example: Vedic Astrology Foundation' );
			$about_fields[] = self::field( 'field_about_root_2_title', 'root_2_title', 'Lineage card 2 title', 'text' );
			$about_fields[] = self::field( 'field_about_root_2_copy', 'root_2_copy', 'Lineage card 2 text', 'text' );
			$about_fields[] = self::field( 'field_about_root_3_title', 'root_3_title', 'Lineage card 3 title', 'text' );
			$about_fields[] = self::field( 'field_about_root_3_copy', 'root_3_copy', 'Lineage card 3 text', 'text' );
			$about_fields[] = self::field( 'field_about_root_4_title', 'root_4_title', 'Lineage card 4 title', 'text' );
			$about_fields[] = self::field( 'field_about_root_4_copy', 'root_4_copy', 'Lineage card 4 text', 'text' );

			$about_fields[] = array(
				'key'       => 'field_about_tab_family',
				'label'     => '2 · About Us',
				'name'      => '',
				'type'      => 'tab',
				'placement' => 'top',
			);
			$about_fields[] = array(
				'key'     => 'field_about_family_help',
				'label'   => 'About Us block',
				'name'    => '',
				'type'    => 'message',
				'message' => '<p>Left portrait + right text (“A family of traditional astrologers”).</p><p><strong>Featured image</strong> in the right sidebar is the portrait photo for this section.</p>',
			);
			$about_fields[] = self::field( 'field_about_section_eyebrow', 'about_eyebrow', 'Eyebrow', 'text', 'Example: About Us' );
			$about_fields[] = self::field( 'field_about_section_lead', 'about_lead', 'Heading (first part)', 'text', 'Example: A family of traditional' );
			$about_fields[] = self::field( 'field_about_section_accent', 'about_accent', 'Heading (gold italic part)', 'text', 'Example: astrologers.' );
			$about_fields[] = self::field( 'field_about_section_body', 'about_body', 'About text', 'wysiwyg', 'Main About Us paragraphs. Leave blank to keep the website default text.' );
			$about_fields[] = self::field( 'field_about_portrait_name', 'portrait_name', 'Portrait name plaque', 'text', 'Optional name on the portrait.' );
			$about_fields[] = self::field( 'field_about_portrait_caption', 'portrait_caption', 'Portrait caption', 'text' );

			$about_fields[] = array(
				'key'       => 'field_about_tab_tantric',
				'label'     => '3 · Agni Kund & Tantric Vidya',
				'name'      => '',
				'type'      => 'tab',
				'placement' => 'top',
			);
			$about_fields[] = array(
				'key'     => 'field_about_tantric_help',
				'label'   => 'Tantric Vidya',
				'name'    => '',
				'type'    => 'message',
				'message' => '<p>Rituals block with two large photos (homam / Navagraha).</p>',
			);
			$about_fields[] = self::field( 'field_about_tantric_eyebrow', 'tantric_eyebrow', 'Eyebrow', 'text', 'Example: Agni Kund & Tantric Vidya' );
			$about_fields[] = self::field( 'field_about_tantric_lead', 'tantric_lead', 'Heading (first part)', 'text', 'Example: Authentic Shastric Rituals &' );
			$about_fields[] = self::field( 'field_about_tantric_accent', 'tantric_accent', 'Heading (gold italic part)', 'text', 'Example: Planetary Remediation' );
			$about_fields[] = self::field( 'field_about_tantric_copy', 'tantric_copy', 'Intro under heading', 'textarea' );
			$about_fields[] = self::image_field( 'field_about_image_1', 'image_1', 'Photo 1 (left ritual card)', 'Homam / Agni photo.' );
			$about_fields[] = self::field( 'field_about_image_1_title', 'image_1_title', 'Photo 1 title', 'text' );
			$about_fields[] = self::field( 'field_about_image_1_copy', 'image_1_copy', 'Photo 1 text', 'textarea' );
			$about_fields[] = self::image_field( 'field_about_image_2', 'image_2', 'Photo 2 (right ritual card)', 'Navagraha photo.' );
			$about_fields[] = self::field( 'field_about_image_2_title', 'image_2_title', 'Photo 2 title', 'text' );
			$about_fields[] = self::field( 'field_about_image_2_copy', 'image_2_copy', 'Photo 2 text', 'textarea' );

			$translated = array(
				array( 'name' => 'title', 'label' => 'Banner title', 'type' => 'text' ),
				array( 'name' => 'eyebrow', 'label' => 'Banner eyebrow', 'type' => 'text' ),
				array( 'name' => 'hero_copy', 'label' => 'Banner intro', 'type' => 'textarea' ),
				array( 'name' => 'root_1_title', 'label' => 'Lineage card 1 title', 'type' => 'text' ),
				array( 'name' => 'root_1_copy', 'label' => 'Lineage card 1 text', 'type' => 'text' ),
				array( 'name' => 'root_2_title', 'label' => 'Lineage card 2 title', 'type' => 'text' ),
				array( 'name' => 'root_2_copy', 'label' => 'Lineage card 2 text', 'type' => 'text' ),
				array( 'name' => 'root_3_title', 'label' => 'Lineage card 3 title', 'type' => 'text' ),
				array( 'name' => 'root_3_copy', 'label' => 'Lineage card 3 text', 'type' => 'text' ),
				array( 'name' => 'root_4_title', 'label' => 'Lineage card 4 title', 'type' => 'text' ),
				array( 'name' => 'root_4_copy', 'label' => 'Lineage card 4 text', 'type' => 'text' ),
				array( 'name' => 'about_eyebrow', 'label' => 'About Us eyebrow', 'type' => 'text' ),
				array( 'name' => 'about_lead', 'label' => 'About Us heading (first part)', 'type' => 'text' ),
				array( 'name' => 'about_accent', 'label' => 'About Us heading (gold part)', 'type' => 'text' ),
				array( 'name' => 'about_body', 'label' => 'About Us text', 'type' => 'wysiwyg' ),
				array( 'name' => 'portrait_name', 'label' => 'Portrait name', 'type' => 'text' ),
				array( 'name' => 'portrait_caption', 'label' => 'Portrait caption', 'type' => 'text' ),
				array( 'name' => 'tantric_eyebrow', 'label' => 'Tantric eyebrow', 'type' => 'text' ),
				array( 'name' => 'tantric_lead', 'label' => 'Tantric heading (first part)', 'type' => 'text' ),
				array( 'name' => 'tantric_accent', 'label' => 'Tantric heading (gold part)', 'type' => 'text' ),
				array( 'name' => 'tantric_copy', 'label' => 'Tantric intro', 'type' => 'textarea' ),
				array( 'name' => 'image_1_title', 'label' => 'Photo 1 title', 'type' => 'text' ),
				array( 'name' => 'image_1_copy', 'label' => 'Photo 1 text', 'type' => 'textarea' ),
				array( 'name' => 'image_2_title', 'label' => 'Photo 2 title', 'type' => 'text' ),
				array( 'name' => 'image_2_copy', 'label' => 'Photo 2 text', 'type' => 'textarea' ),
				array( 'name' => 'content', 'label' => 'Extra page body (optional)', 'type' => 'wysiwyg' ),
			);
			foreach ( $locales as $locale ) {
				$id             = sanitize_key( $locale['id'] );
				$about_fields[] = array(
					'key'       => 'field_about_tab_' . $id,
					'label'     => $locale['native'],
					'name'      => '',
					'type'      => 'tab',
					'placement' => 'top',
				);
				foreach ( $translated as $field ) {
					$name           = $field['name'] . '_' . $id;
					$about_fields[] = self::field(
						'field_about_i18n_' . $name,
						$name,
						$field['label'],
						$field['type'],
						'Leave blank to keep the English text on the website.'
					);
				}
			}

			acf_add_local_field_group(
				array(
					'key'        => 'group_ju_about_page',
					'title'      => 'About page sections',
					'fields'     => $about_fields,
					'location'   => array(
						array(
							array(
								'param'    => 'page',
								'operator' => '==',
								'value'    => (string) $about_id,
							),
						),
					),
					'position'   => 'acf_after_title',
					'menu_order' => 0,
				)
			);
		}

		if ( $contact_id ) {
			$fields = array();
			$fields = array_merge(
				$fields,
				self::section_tab( 'field_contact_tab_hero', '1 · Sacred Portals (banner)' ),
				array(
					self::acf_message( 'field_contact_hero_help', 'Banner', '<p><strong>Title</strong> — WordPress title above. <strong>Featured image</strong> — first large photo in “Sanctified Environment”.</p>' ),
					self::field( 'field_contact_eyebrow', 'eyebrow', 'Eyebrow', 'text', 'Example: Sacred Portals & Ritual Access' ),
					self::field( 'field_contact_hero_copy', 'hero_copy', 'Intro under the title', 'textarea' ),
				),
				self::section_tab( 'field_contact_tab_enquiry', '2 · Enquiry form' ),
				array(
					self::acf_message(
						'field_contact_enquiry_help',
						'Enquiry',
						'<p>The enquiry form uses contact details from <a href="' . esc_url( admin_url( 'admin.php?page=ju-settings' ) ) . '">JyothishiUncle → Home page / settings</a> (phone, email, address, hours). Form headings are under the Enquiry section there.</p>'
					),
				),
				self::section_tab( 'field_contact_tab_photos', '3 · Sanctified Environment' ),
				array(
					self::acf_message( 'field_contact_photos_help', 'Photos', '<p>Two large photos under the enquiry form. Featured image = photo 1. Photo 2 field below = second card.</p>' ),
					self::field( 'field_contact_photos_eyebrow', 'photos_eyebrow', 'Section eyebrow', 'text', 'Example: Sanctified Environment' ),
					self::field( 'field_contact_photos_lead', 'photos_lead', 'Section heading', 'text', 'Example: Where Every Form Transmutes into Ahuti' ),
					self::field( 'field_contact_photos_copy', 'photos_copy', 'Section intro', 'textarea' ),
					self::field( 'field_contact_photo1_badge', 'photo1_badge', 'Photo 1 badge', 'text', 'Example: Agni Pratishtapana' ),
					self::field( 'field_contact_photo1_title', 'photo1_title', 'Photo 1 title', 'text' ),
					self::field( 'field_contact_photo1_copy', 'photo1_copy', 'Photo 1 text', 'textarea' ),
					self::image_field( 'field_contact_image_1', 'image_1', 'Photo 2', 'Second large photo.' ),
					self::field( 'field_contact_image_1_title', 'image_1_title', 'Photo 2 title', 'text' ),
					self::field( 'field_contact_image_1_copy', 'image_1_copy', 'Photo 2 text', 'textarea' ),
					self::field( 'field_contact_photo2_badge', 'photo2_badge', 'Photo 2 badge', 'text', 'Example: Jyotish Ratna Sanctity' ),
				)
			);
			self::register_sectioned_page(
				'group_ju_contact_page',
				'Contact page sections',
				$contact_id,
				$fields,
				$locales,
				array(
					array( 'name' => 'title', 'label' => 'Banner title', 'type' => 'text' ),
					array( 'name' => 'eyebrow', 'label' => 'Banner eyebrow', 'type' => 'text' ),
					array( 'name' => 'hero_copy', 'label' => 'Banner intro', 'type' => 'textarea' ),
					array( 'name' => 'photos_eyebrow', 'label' => 'Photos eyebrow', 'type' => 'text' ),
					array( 'name' => 'photos_lead', 'label' => 'Photos heading', 'type' => 'text' ),
					array( 'name' => 'photos_copy', 'label' => 'Photos intro', 'type' => 'textarea' ),
					array( 'name' => 'photo1_badge', 'label' => 'Photo 1 badge', 'type' => 'text' ),
					array( 'name' => 'photo1_title', 'label' => 'Photo 1 title', 'type' => 'text' ),
					array( 'name' => 'photo1_copy', 'label' => 'Photo 1 text', 'type' => 'textarea' ),
					array( 'name' => 'photo2_badge', 'label' => 'Photo 2 badge', 'type' => 'text' ),
					array( 'name' => 'image_1_title', 'label' => 'Photo 2 title', 'type' => 'text' ),
					array( 'name' => 'image_1_copy', 'label' => 'Photo 2 text', 'type' => 'textarea' ),
					array( 'name' => 'content', 'label' => 'Extra page body', 'type' => 'wysiwyg' ),
				)
			);
		}

		if ( $services_id ) {
			$fields = array();
			$fields = array_merge(
				$fields,
				self::section_tab( 'field_services_tab_hero', '1 · Vedic Tantric Shastra (banner)' ),
				array(
					self::acf_message( 'field_services_hero_help', 'Banner', '<p><strong>Title</strong> — WordPress title. <strong>Featured image</strong> — optional soft hero background.</p>' ),
					self::field( 'field_services_eyebrow', 'eyebrow', 'Eyebrow', 'text', 'Example: Vedic Tantric Shastra · Anushthana Protocols' ),
					self::field( 'field_services_hero_copy', 'hero_copy', 'Intro under the title', 'textarea' ),
				),
				self::section_tab( 'field_services_tab_poojas', '2 · Agnikarya & Yajnas (poojas)' ),
				array(
					self::acf_message( 'field_services_pooja_help', 'Poojas listing', '<p>Section headings above the pooja cards. Cards themselves come from <strong>Poojas</strong> in the left menu.</p>' ),
					self::field( 'field_services_list_eyebrow', 'list_eyebrow', 'Section eyebrow', 'text', 'Example: 01 / Agnikarya & Yajnas' ),
					self::field( 'field_services_list_title', 'list_title', 'Section heading', 'text', 'Example: Sacred Fire Homams & Poojas' ),
					self::field( 'field_services_list_copy', 'list_copy', 'Section intro', 'textarea' ),
				),
				self::section_tab( 'field_services_tab_products', '3 · Sacred products' ),
				array(
					self::acf_message( 'field_services_products_help', 'Products listing', '<p>Shown when visitors open the Products tab. Product cards come from <strong>Products</strong> in the left menu.</p>' ),
					self::field( 'field_services_list2_eyebrow', 'list2_eyebrow', 'Section eyebrow', 'text', 'Example: 02 / Sacred products' ),
					self::field( 'field_services_list2_title', 'list2_title', 'Section heading', 'text', 'Example: Sacred Planetary Products & Talismans' ),
					self::field( 'field_services_list2_copy', 'list2_copy', 'Section intro', 'textarea' ),
				),
				self::section_tab( 'field_services_tab_cta', '4 · Book consultation' ),
				array(
					self::field( 'field_services_cta_eyebrow', 'cta_eyebrow', 'CTA eyebrow', 'text', 'Example: Live Astrological Ephemeris Sync' ),
					self::field( 'field_services_cta_title', 'cta_title', 'CTA heading', 'text', 'Example: Book a 1-on-1 Consultation' ),
					self::field( 'field_services_cta_copy', 'cta_copy', 'CTA text', 'textarea' ),
				)
			);
			self::register_sectioned_page(
				'group_ju_services_page',
				'Services page sections',
				$services_id,
				$fields,
				$locales,
				array(
					array( 'name' => 'title', 'label' => 'Banner title', 'type' => 'text' ),
					array( 'name' => 'eyebrow', 'label' => 'Banner eyebrow', 'type' => 'text' ),
					array( 'name' => 'hero_copy', 'label' => 'Banner intro', 'type' => 'textarea' ),
					array( 'name' => 'list_eyebrow', 'label' => 'Poojas eyebrow', 'type' => 'text' ),
					array( 'name' => 'list_title', 'label' => 'Poojas heading', 'type' => 'text' ),
					array( 'name' => 'list_copy', 'label' => 'Poojas intro', 'type' => 'textarea' ),
					array( 'name' => 'list2_eyebrow', 'label' => 'Products eyebrow', 'type' => 'text' ),
					array( 'name' => 'list2_title', 'label' => 'Products heading', 'type' => 'text' ),
					array( 'name' => 'list2_copy', 'label' => 'Products intro', 'type' => 'textarea' ),
					array( 'name' => 'cta_eyebrow', 'label' => 'CTA eyebrow', 'type' => 'text' ),
					array( 'name' => 'cta_title', 'label' => 'CTA heading', 'type' => 'text' ),
					array( 'name' => 'cta_copy', 'label' => 'CTA text', 'type' => 'textarea' ),
				)
			);
		}

		if ( $travel_id ) {
			$fields = array();
			$fields = array_merge(
				$fields,
				self::section_tab( 'field_travel_tab_hero', '1 · Tirtha Yatra (banner)' ),
				array(
					self::acf_message( 'field_travel_hero_help', 'Banner', '<p><strong>Title</strong> — WordPress title. <strong>Featured image</strong> — optional hero background. Stats chips below are editable here.</p>' ),
					self::field( 'field_travel_eyebrow', 'eyebrow', 'Eyebrow', 'text', 'Example: Tirtha Yatra · Consecrated pilgrimages' ),
					self::field( 'field_travel_hero_copy', 'hero_copy', 'Intro under the title', 'textarea' ),
					self::field( 'field_travel_stat_1_value', 'stat_1_value', 'Stat 1 value', 'text', 'Example: 12 Peethas' ),
					self::field( 'field_travel_stat_1_note', 'stat_1_note', 'Stat 1 note', 'text' ),
					self::field( 'field_travel_stat_2_value', 'stat_2_value', 'Stat 2 value', 'text' ),
					self::field( 'field_travel_stat_2_note', 'stat_2_note', 'Stat 2 note', 'text' ),
					self::field( 'field_travel_stat_3_value', 'stat_3_value', 'Stat 3 value', 'text' ),
					self::field( 'field_travel_stat_3_note', 'stat_3_note', 'Stat 3 note', 'text' ),
					self::field( 'field_travel_stat_4_value', 'stat_4_value', 'Stat 4 value', 'text' ),
					self::field( 'field_travel_stat_4_note', 'stat_4_note', 'Stat 4 note', 'text' ),
				),
				self::section_tab( 'field_travel_tab_list', '2 · Current Sacred Expeditions' ),
				array(
					self::acf_message( 'field_travel_list_help', 'Expeditions', '<p>Listing headings. Destination cards come from <strong>Religious Travel</strong> in the left menu.</p>' ),
					self::field( 'field_travel_list_eyebrow', 'list_eyebrow', 'Section eyebrow', 'text', 'Example: Elemental terrain' ),
					self::field( 'field_travel_list_title', 'list_title', 'Section heading', 'text', 'Example: Current Sacred Expeditions' ),
					self::field( 'field_travel_list_copy', 'list_copy', 'Note beside heading', 'text', 'Example: Only 3 to 5 spots left per departure' ),
				),
				self::section_tab( 'field_travel_tab_unique', '3 · What Makes Yatras Unique' ),
				array(
					self::field( 'field_travel_unique_eyebrow', 'unique_eyebrow', 'Section eyebrow', 'text', 'Example: Vedic excellence' ),
					self::field( 'field_travel_unique_title', 'unique_title', 'Section heading', 'text' ),
					self::field( 'field_travel_unique_copy', 'unique_copy', 'Section intro', 'textarea' ),
					self::field( 'field_travel_unique_1_title', 'unique_1_title', 'Card 1 title', 'text' ),
					self::field( 'field_travel_unique_1_copy', 'unique_1_copy', 'Card 1 text', 'textarea' ),
					self::field( 'field_travel_unique_1_note', 'unique_1_note', 'Card 1 footer label', 'text', 'Example: 01 · Astro synchronicity' ),
					self::field( 'field_travel_unique_2_title', 'unique_2_title', 'Card 2 title', 'text' ),
					self::field( 'field_travel_unique_2_copy', 'unique_2_copy', 'Card 2 text', 'textarea' ),
					self::field( 'field_travel_unique_2_note', 'unique_2_note', 'Card 2 footer label', 'text' ),
					self::field( 'field_travel_unique_3_title', 'unique_3_title', 'Card 3 title', 'text' ),
					self::field( 'field_travel_unique_3_copy', 'unique_3_copy', 'Card 3 text', 'textarea' ),
					self::field( 'field_travel_unique_3_note', 'unique_3_note', 'Card 3 footer label', 'text' ),
					self::field( 'field_travel_unique_4_title', 'unique_4_title', 'Card 4 title', 'text' ),
					self::field( 'field_travel_unique_4_copy', 'unique_4_copy', 'Card 4 text', 'textarea' ),
					self::field( 'field_travel_unique_4_note', 'unique_4_note', 'Card 4 footer label', 'text' ),
				),
				self::section_tab( 'field_travel_tab_cta', '4 · Kundali pilgrimage CTA' ),
				array(
					self::field( 'field_travel_cta_eyebrow', 'cta_eyebrow', 'CTA eyebrow', 'text' ),
					self::field( 'field_travel_cta_title', 'cta_title', 'CTA heading', 'text' ),
					self::field( 'field_travel_cta_copy', 'cta_copy', 'CTA text', 'textarea' ),
				)
			);
			self::register_sectioned_page(
				'group_ju_travel_page',
				'Religious travel page sections',
				$travel_id,
				$fields,
				$locales,
				array(
					array( 'name' => 'title', 'label' => 'Banner title', 'type' => 'text' ),
					array( 'name' => 'eyebrow', 'label' => 'Banner eyebrow', 'type' => 'text' ),
					array( 'name' => 'hero_copy', 'label' => 'Banner intro', 'type' => 'textarea' ),
					array( 'name' => 'stat_1_value', 'label' => 'Stat 1 value', 'type' => 'text' ),
					array( 'name' => 'stat_1_note', 'label' => 'Stat 1 note', 'type' => 'text' ),
					array( 'name' => 'stat_2_value', 'label' => 'Stat 2 value', 'type' => 'text' ),
					array( 'name' => 'stat_2_note', 'label' => 'Stat 2 note', 'type' => 'text' ),
					array( 'name' => 'stat_3_value', 'label' => 'Stat 3 value', 'type' => 'text' ),
					array( 'name' => 'stat_3_note', 'label' => 'Stat 3 note', 'type' => 'text' ),
					array( 'name' => 'stat_4_value', 'label' => 'Stat 4 value', 'type' => 'text' ),
					array( 'name' => 'stat_4_note', 'label' => 'Stat 4 note', 'type' => 'text' ),
					array( 'name' => 'list_eyebrow', 'label' => 'Expeditions eyebrow', 'type' => 'text' ),
					array( 'name' => 'list_title', 'label' => 'Expeditions heading', 'type' => 'text' ),
					array( 'name' => 'list_copy', 'label' => 'Expeditions note', 'type' => 'text' ),
					array( 'name' => 'unique_eyebrow', 'label' => 'Unique eyebrow', 'type' => 'text' ),
					array( 'name' => 'unique_title', 'label' => 'Unique heading', 'type' => 'text' ),
					array( 'name' => 'unique_copy', 'label' => 'Unique intro', 'type' => 'textarea' ),
					array( 'name' => 'unique_1_title', 'label' => 'Card 1 title', 'type' => 'text' ),
					array( 'name' => 'unique_1_copy', 'label' => 'Card 1 text', 'type' => 'textarea' ),
					array( 'name' => 'unique_1_note', 'label' => 'Card 1 footer', 'type' => 'text' ),
					array( 'name' => 'unique_2_title', 'label' => 'Card 2 title', 'type' => 'text' ),
					array( 'name' => 'unique_2_copy', 'label' => 'Card 2 text', 'type' => 'textarea' ),
					array( 'name' => 'unique_2_note', 'label' => 'Card 2 footer', 'type' => 'text' ),
					array( 'name' => 'unique_3_title', 'label' => 'Card 3 title', 'type' => 'text' ),
					array( 'name' => 'unique_3_copy', 'label' => 'Card 3 text', 'type' => 'textarea' ),
					array( 'name' => 'unique_3_note', 'label' => 'Card 3 footer', 'type' => 'text' ),
					array( 'name' => 'unique_4_title', 'label' => 'Card 4 title', 'type' => 'text' ),
					array( 'name' => 'unique_4_copy', 'label' => 'Card 4 text', 'type' => 'textarea' ),
					array( 'name' => 'unique_4_note', 'label' => 'Card 4 footer', 'type' => 'text' ),
					array( 'name' => 'cta_eyebrow', 'label' => 'CTA eyebrow', 'type' => 'text' ),
					array( 'name' => 'cta_title', 'label' => 'CTA heading', 'type' => 'text' ),
					array( 'name' => 'cta_copy', 'label' => 'CTA text', 'type' => 'textarea' ),
				)
			);
		}

		if ( $articles_id ) {
			$fields = array();
			$fields = array_merge(
				$fields,
				self::section_tab( 'field_articles_tab_hero', '1 · Vedic Shastra (banner)' ),
				array(
					self::acf_message( 'field_articles_hero_help', 'Banner', '<p><strong>Title</strong> — WordPress title. Article cards come from <strong>Posts</strong>.</p>' ),
					self::field( 'field_articles_eyebrow', 'eyebrow', 'Eyebrow', 'text', 'Example: Vedic Shastra · Sacred Wisdom' ),
					self::field( 'field_articles_hero_copy', 'hero_copy', 'Intro under the title', 'textarea' ),
				),
				self::section_tab( 'field_articles_tab_archive', '2 · Archive chronicles' ),
				array(
					self::field( 'field_articles_list_eyebrow', 'list_eyebrow', 'Archive eyebrow', 'text', 'Example: Archive chronicles' ),
					self::field( 'field_articles_list_title', 'list_title', 'Archive heading', 'text', 'Example: Cosmic discourses' ),
					self::field( 'field_articles_list_copy', 'list_copy', 'Archive intro', 'textarea' ),
				),
				self::section_tab( 'field_articles_tab_cta', '3 · Personal guidance CTA' ),
				array(
					self::field( 'field_articles_cta_eyebrow', 'cta_eyebrow', 'CTA eyebrow', 'text', 'Example: Personal guidance' ),
					self::field( 'field_articles_cta_title', 'cta_title', 'CTA heading', 'text' ),
					self::field( 'field_articles_cta_copy', 'cta_copy', 'CTA text', 'textarea' ),
				)
			);
			self::register_sectioned_page(
				'group_ju_articles_page',
				'Articles page sections',
				$articles_id,
				$fields,
				$locales,
				array(
					array( 'name' => 'title', 'label' => 'Banner title', 'type' => 'text' ),
					array( 'name' => 'eyebrow', 'label' => 'Banner eyebrow', 'type' => 'text' ),
					array( 'name' => 'hero_copy', 'label' => 'Banner intro', 'type' => 'textarea' ),
					array( 'name' => 'list_eyebrow', 'label' => 'Archive eyebrow', 'type' => 'text' ),
					array( 'name' => 'list_title', 'label' => 'Archive heading', 'type' => 'text' ),
					array( 'name' => 'list_copy', 'label' => 'Archive intro', 'type' => 'textarea' ),
					array( 'name' => 'cta_eyebrow', 'label' => 'CTA eyebrow', 'type' => 'text' ),
					array( 'name' => 'cta_title', 'label' => 'CTA heading', 'type' => 'text' ),
					array( 'name' => 'cta_copy', 'label' => 'CTA text', 'type' => 'textarea' ),
				)
			);
		}

		if ( $astrologers_id ) {
			$fields = array();
			$fields = array_merge(
				$fields,
				self::section_tab( 'field_astro_page_tab_hero', '1 · Talk to an Astrologer (banner)' ),
				array(
					self::acf_message(
						'field_astro_page_hero_help',
						'Banner',
						'<p>Page hero text. If left blank, the website uses Home page → “Talk to an Astrologer” strings.</p><p><strong>Title</strong> — WordPress title above (optional override).</p>'
					),
					self::field( 'field_astro_page_eyebrow', 'eyebrow', 'Eyebrow', 'text', 'Leave blank to use Home page online count eyebrow.' ),
					self::field( 'field_astro_page_hero_copy', 'hero_copy', 'Intro under the title', 'textarea' ),
					self::field( 'field_astro_page_list_title', 'list_title', 'Heading (first / gold part)', 'text', 'Optional override for the main heading lead.' ),
					self::field( 'field_astro_page_list_copy', 'list_copy', 'Heading (accent / italic part)', 'text', 'Optional override for the gold italic accent.' ),
				),
				self::section_tab( 'field_astro_page_tab_listing', '2 · Astrologer listing' ),
				array(
					self::acf_message(
						'field_astro_page_listing_help',
						'Cards',
						'<p>Astrologer cards are edited under <strong>Astrologers</strong> in the left menu (name, bio, languages, Featured image).</p>'
					),
				),
				self::section_tab( 'field_astro_page_tab_wisdom', '3 · Jyotishya Vedanga Shastra' ),
				array(
					self::field( 'field_astro_wisdom_eyebrow', 'wisdom_eyebrow', 'Section eyebrow', 'text', 'Example: Jyotishya Vedanga Shastra' ),
					self::field( 'field_astro_wisdom_title', 'wisdom_title', 'Section heading', 'text' ),
					self::field( 'field_astro_wisdom_copy', 'wisdom_copy', 'Section intro', 'textarea' ),
					self::field( 'field_astro_wisdom_1_kicker', 'wisdom_1_kicker', 'Card 1 kicker', 'text' ),
					self::field( 'field_astro_wisdom_1_title', 'wisdom_1_title', 'Card 1 title', 'text' ),
					self::field( 'field_astro_wisdom_1_copy', 'wisdom_1_copy', 'Card 1 text', 'textarea' ),
					self::field( 'field_astro_wisdom_1_left', 'wisdom_1_left', 'Card 1 footer left', 'text' ),
					self::field( 'field_astro_wisdom_1_right', 'wisdom_1_right', 'Card 1 footer right', 'text' ),
					self::field( 'field_astro_wisdom_2_kicker', 'wisdom_2_kicker', 'Card 2 kicker', 'text' ),
					self::field( 'field_astro_wisdom_2_title', 'wisdom_2_title', 'Card 2 title', 'text' ),
					self::field( 'field_astro_wisdom_2_copy', 'wisdom_2_copy', 'Card 2 text', 'textarea' ),
					self::field( 'field_astro_wisdom_2_left', 'wisdom_2_left', 'Card 2 footer left', 'text' ),
					self::field( 'field_astro_wisdom_2_right', 'wisdom_2_right', 'Card 2 footer right', 'text' ),
					self::field( 'field_astro_wisdom_3_kicker', 'wisdom_3_kicker', 'Card 3 kicker', 'text' ),
					self::field( 'field_astro_wisdom_3_title', 'wisdom_3_title', 'Card 3 title', 'text' ),
					self::field( 'field_astro_wisdom_3_copy', 'wisdom_3_copy', 'Card 3 text', 'textarea' ),
					self::field( 'field_astro_wisdom_3_left', 'wisdom_3_left', 'Card 3 footer left', 'text' ),
					self::field( 'field_astro_wisdom_3_right', 'wisdom_3_right', 'Card 3 footer right', 'text' ),
				),
				self::section_tab( 'field_astro_page_tab_tools', '4 · Free astrology tools' ),
				array(
					self::acf_message(
						'field_astro_page_tools_help',
						'Horoscope band',
						'<p>The rashi / free-tools strip uses Home page → <strong>Free astrology tools</strong> section. Edit it under <a href="' . esc_url( admin_url( 'admin.php?page=ju-settings' ) ) . '">JyothishiUncle → Home page</a>.</p>'
					),
				),
				self::section_tab( 'field_astro_page_tab_match', '5 · Astrologer match CTA' ),
				array(
					self::field( 'field_astro_match_eyebrow', 'cta_eyebrow', 'CTA eyebrow (optional)', 'text' ),
					self::field( 'field_astro_match_title', 'cta_title', 'CTA heading', 'text', 'Example: Unsure Which Astrologer is Aligned with Your Kundali?' ),
					self::field( 'field_astro_match_copy', 'cta_copy', 'CTA text', 'textarea' ),
				)
			);
			self::register_sectioned_page(
				'group_ju_astrologers_page',
				'Astrologers page sections',
				$astrologers_id,
				$fields,
				$locales,
				array(
					array( 'name' => 'title', 'label' => 'Banner title', 'type' => 'text' ),
					array( 'name' => 'eyebrow', 'label' => 'Banner eyebrow', 'type' => 'text' ),
					array( 'name' => 'hero_copy', 'label' => 'Banner intro', 'type' => 'textarea' ),
					array( 'name' => 'list_title', 'label' => 'Heading lead', 'type' => 'text' ),
					array( 'name' => 'list_copy', 'label' => 'Heading accent', 'type' => 'text' ),
					array( 'name' => 'wisdom_eyebrow', 'label' => 'Wisdom eyebrow', 'type' => 'text' ),
					array( 'name' => 'wisdom_title', 'label' => 'Wisdom heading', 'type' => 'text' ),
					array( 'name' => 'wisdom_copy', 'label' => 'Wisdom intro', 'type' => 'textarea' ),
					array( 'name' => 'wisdom_1_kicker', 'label' => 'Wisdom card 1 kicker', 'type' => 'text' ),
					array( 'name' => 'wisdom_1_title', 'label' => 'Wisdom card 1 title', 'type' => 'text' ),
					array( 'name' => 'wisdom_1_copy', 'label' => 'Wisdom card 1 text', 'type' => 'textarea' ),
					array( 'name' => 'wisdom_1_left', 'label' => 'Wisdom card 1 footer left', 'type' => 'text' ),
					array( 'name' => 'wisdom_1_right', 'label' => 'Wisdom card 1 footer right', 'type' => 'text' ),
					array( 'name' => 'wisdom_2_kicker', 'label' => 'Wisdom card 2 kicker', 'type' => 'text' ),
					array( 'name' => 'wisdom_2_title', 'label' => 'Wisdom card 2 title', 'type' => 'text' ),
					array( 'name' => 'wisdom_2_copy', 'label' => 'Wisdom card 2 text', 'type' => 'textarea' ),
					array( 'name' => 'wisdom_2_left', 'label' => 'Wisdom card 2 footer left', 'type' => 'text' ),
					array( 'name' => 'wisdom_2_right', 'label' => 'Wisdom card 2 footer right', 'type' => 'text' ),
					array( 'name' => 'wisdom_3_kicker', 'label' => 'Wisdom card 3 kicker', 'type' => 'text' ),
					array( 'name' => 'wisdom_3_title', 'label' => 'Wisdom card 3 title', 'type' => 'text' ),
					array( 'name' => 'wisdom_3_copy', 'label' => 'Wisdom card 3 text', 'type' => 'textarea' ),
					array( 'name' => 'wisdom_3_left', 'label' => 'Wisdom card 3 footer left', 'type' => 'text' ),
					array( 'name' => 'wisdom_3_right', 'label' => 'Wisdom card 3 footer right', 'type' => 'text' ),
					array( 'name' => 'cta_eyebrow', 'label' => 'Match CTA eyebrow', 'type' => 'text' ),
					array( 'name' => 'cta_title', 'label' => 'Match CTA heading', 'type' => 'text' ),
					array( 'name' => 'cta_copy', 'label' => 'Match CTA text', 'type' => 'textarea' ),
					array( 'name' => 'content', 'label' => 'Extra page body', 'type' => 'wysiwyg' ),
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

	private static function section_tab( $key, $label ) {
		return array(
			array(
				'key'       => $key,
				'label'     => $label,
				'name'      => '',
				'type'      => 'tab',
				'placement' => 'top',
			),
		);
	}

	private static function acf_message( $key, $label, $message ) {
		return array(
			'key'     => $key,
			'label'   => $label,
			'name'    => '',
			'type'    => 'message',
			'message' => $message,
		);
	}

	private static function register_sectioned_page( $key, $title, $page_id, $fields, $locales, $translated ) {
		if ( ! $page_id ) {
			return;
		}
		$prefix = 'field_' . sanitize_key( str_replace( 'group_', '', $key ) ) . '_';
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
				'location'   => array(
					array(
						array(
							'param'    => 'page',
							'operator' => '==',
							'value'    => (string) $page_id,
						),
					),
				),
				'position'   => 'acf_after_title',
				'menu_order' => 0,
			)
		);
	}

	private static function register_page_heading_group( $key, $title, $locales, $opts, $location, $help_html ) {
		$prefix = 'field_' . sanitize_key( str_replace( 'group_', '', $key ) ) . '_';
		$fields = array();
		$fields = array_merge( $fields, self::section_tab( $prefix . 'tab_hero', '1 · Page hero' ) );
		$fields[] = self::acf_message( $prefix . 'help', 'How to edit this page', $help_html );
		if ( ! empty( $opts['eyebrow'] ) ) {
			$fields[] = self::field( $prefix . 'eyebrow', 'eyebrow', 'Eyebrow', 'text', 'Short gold label above the title.' );
		}
		if ( ! empty( $opts['hero_copy'] ) ) {
			$fields[] = self::field( $prefix . 'hero_copy', 'hero_copy', 'Intro under the title', 'textarea', 'Shown under the page title on the public website.' );
		}
		$fields = array_merge( $fields, self::section_tab( $prefix . 'tab_body', '2 · Page body' ) );
		$fields[] = self::acf_message(
			$prefix . 'body_help',
			'Body',
			'<p>Use the main WordPress editor above this box for long page text (policies, disclaimers).</p>'
		);
		if ( ! empty( $opts['about'] ) ) {
			$fields[] = self::field( $prefix . 'portrait_name', 'portrait_name', 'Portrait name (About page)', 'text', 'Name on the portrait plaque. Used on About only.' );
			$fields[] = self::field( $prefix . 'portrait_note', 'portrait_caption', 'Portrait caption (About page)', 'text' );
		}
		if ( ! empty( $opts['photos'] ) ) {
			$fields[] = self::image_field( $prefix . 'image_1', 'image_1', 'Photo 2', 'Set Featured image (right sidebar) first — that is Photo 1.' );
			$fields[] = self::field( $prefix . 'image_1_title', 'image_1_title', 'Photo 2 title', 'text' );
			$fields[] = self::field( $prefix . 'image_1_copy', 'image_1_copy', 'Photo 2 text', 'textarea' );
			if ( ! isset( $opts['photo3'] ) || $opts['photo3'] ) {
				$fields[] = self::image_field( $prefix . 'image_2', 'image_2', 'Photo 3', 'Optional third photo.' );
				$fields[] = self::field( $prefix . 'image_2_title', 'image_2_title', 'Photo 3 title', 'text' );
				$fields[] = self::field( $prefix . 'image_2_copy', 'image_2_copy', 'Photo 3 text', 'textarea' );
			}
		}

		$translated = array(
			array( 'name' => 'title', 'label' => 'Title', 'type' => 'text' ),
			array( 'name' => 'eyebrow', 'label' => 'Eyebrow', 'type' => 'text' ),
			array( 'name' => 'hero_copy', 'label' => 'Intro under the title', 'type' => 'textarea' ),
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
