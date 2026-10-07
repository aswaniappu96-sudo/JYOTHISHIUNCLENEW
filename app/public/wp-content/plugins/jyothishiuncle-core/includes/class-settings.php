<?php
/**
 * JyothishiUncle site settings (replaces ACF Options, which is Pro-only).
 *
 * @package JyothishiUncleCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JU_Settings {

	const OPTION_KEY = 'ju_site_settings';

	public static function defaults() {
		return array(
			'site_tagline'              => 'Sacred guidance for devotees everywhere.',
			'whatsapp_number'           => '96800000000',
			'admin_notify_email'        => 'hello@jyothishiuncle.com',
			'phone_number'              => '+968 0000 0000',
			'address'                   => 'Consultations are online worldwide.',
			'hero_title'                => 'JyothishiUncle',
			'hero_subtitle'             => 'Pooja, astrology consultation, spiritual products, and temple travel — guided with care.',
			'hero_primary_cta_label'    => 'Book a consultation',
			'hero_primary_cta_url'      => '/services',
			'about_excerpt'             => 'JyothishiUncle.com is a venture from a family of Traditional Astrologers with more than 500+ years of tradition. We practice Astrology as divine and this wisdom is being transferred through generations. Our aim is to make people understand the true spiritual traditions of Bharat and follow them in their true spirit for a better tomorrow filled with discipline and happiness. We offer a better space for astrologers who practice Astrology in its true spirit and share their wisdom for the betterment of society.',
			'consultation_timezone'     => 'Asia/Muscat',
			'consultation_slot_minutes' => '30',
			'consultation_days'         => array( 'sun', 'mon', 'tue', 'wed', 'thu' ),
			'consultation_start_time'   => '10:00',
			'consultation_end_time'     => '18:00',
			'meeting_methods'           => array( 'whatsapp', 'google_meet', 'zoom' ),
			'default_meeting_method'    => 'whatsapp',
			'show_prices_on_website'    => '0',
			'social_instagram'          => '',
			'social_facebook'           => '',
			'social_youtube'            => '',
			'footer_text'               => 'JyothishiUncle — spiritual services worldwide.',
			'brand_midnight'            => '#1A1630',
			'brand_saffron'             => '#C4A574',
			'brand_cream'               => '#F7F1E8',
			'brand_ink'                 => '#2C2416',
			'logo_id'                   => '0',
			'hero_image_id'             => '0',
			'about_teaser_image_id'     => '0',
		);
	}

	public static function get() {
		$stored = get_option( self::OPTION_KEY, array() );
		if ( ! is_array( $stored ) ) {
			$stored = array();
		}

		return wp_parse_args( $stored, self::defaults() );
	}

	public static function seed_defaults() {
		if ( get_option( self::OPTION_KEY ) ) {
			return;
		}

		add_option( self::OPTION_KEY, self::defaults() );
	}

	public static function register() {
		register_setting(
			'ju_site_settings_group',
			self::OPTION_KEY,
			array(
				'type'              => 'array',
				'sanitize_callback' => array( __CLASS__, 'sanitize' ),
			)
		);
	}

	public static function menu() {
		add_menu_page(
			'Home page',
			'JyothishiUncle',
			'manage_options',
			'ju-settings',
			array( __CLASS__, 'render' ),
			'dashicons-heart',
			3
		);
		add_submenu_page(
			'ju-settings',
			'Home page',
			'Home page',
			'manage_options',
			'ju-settings',
			array( __CLASS__, 'render' )
		);
		add_submenu_page(
			'ju-settings',
			'About page',
			'About page',
			'edit_pages',
			'ju-edit-about',
			'__return_null'
		);
		add_submenu_page(
			'ju-settings',
			'Services page',
			'Services page',
			'edit_pages',
			'ju-edit-services',
			'__return_null'
		);
		add_submenu_page(
			'ju-settings',
			'Astrologers page',
			'Astrologers page',
			'edit_pages',
			'ju-edit-astrologers',
			'__return_null'
		);
		add_submenu_page(
			'ju-settings',
			'Religious Travel page',
			'Religious Travel page',
			'edit_pages',
			'ju-edit-travel',
			'__return_null'
		);
		add_submenu_page(
			'ju-settings',
			'Articles page',
			'Articles page',
			'edit_pages',
			'ju-edit-articles',
			'__return_null'
		);
		add_submenu_page(
			'ju-settings',
			'Contact page',
			'Contact page',
			'edit_pages',
			'ju-edit-contact',
			'__return_null'
		);
		add_submenu_page(
			'ju-settings',
			'How to edit',
			'How to edit',
			'edit_pages',
			'ju-how-to-edit',
			array( 'JU_Admin', 'render_help' )
		);
	}

	public static function redirect_page_shortcuts() {
		if ( ! is_admin() || empty( $_GET['page'] ) ) {
			return;
		}

		$map = array(
			'ju-edit-about'      => 'about',
			'ju-edit-services'   => 'services',
			'ju-edit-astrologers'=> 'astrologers',
			'ju-edit-travel'     => 'religious-travel',
			'ju-edit-articles'   => 'articles',
			'ju-edit-contact'    => 'contact',
		);
		$key = sanitize_key( wp_unslash( $_GET['page'] ) );
		if ( ! isset( $map[ $key ] ) ) {
			return;
		}

		$page = get_page_by_path( $map[ $key ] );
		if ( $page ) {
			wp_safe_redirect( admin_url( 'post.php?post=' . $page->ID . '&action=edit' ) );
			exit;
		}

		wp_safe_redirect( admin_url( 'edit.php?post_type=page' ) );
		exit;
	}

	public static function assets( $hook ) {
		if ( 'toplevel_page_ju-settings' !== $hook ) {
			return;
		}

		wp_enqueue_media();
		wp_enqueue_script(
			'ju-settings-media',
			JU_CORE_URL . 'assets/admin-media.js',
			array( 'jquery' ),
			JU_CORE_VERSION,
			true
		);
	}

	public static function sanitize( $input ) {
		$defaults = self::defaults();
		$current  = self::get();
		$input    = is_array( $input ) ? $input : array();
		$out      = array();

		$text_keys = array(
			'site_tagline',
			'whatsapp_number',
			'phone_number',
			'hero_title',
			'hero_primary_cta_label',
			'hero_primary_cta_url',
			'consultation_timezone',
			'consultation_start_time',
			'consultation_end_time',
			'default_meeting_method',
			'social_instagram',
			'social_facebook',
			'social_youtube',
			'footer_text',
			'brand_midnight',
			'brand_saffron',
			'brand_cream',
			'brand_ink',
		);

		foreach ( $text_keys as $key ) {
			$fallback    = isset( $current[ $key ] ) ? $current[ $key ] : $defaults[ $key ];
			$out[ $key ] = isset( $input[ $key ] ) ? sanitize_text_field( $input[ $key ] ) : $fallback;
		}

		$out['admin_notify_email']        = isset( $input['admin_notify_email'] ) ? sanitize_email( $input['admin_notify_email'] ) : $current['admin_notify_email'];
		$out['address']                   = isset( $input['address'] ) ? sanitize_textarea_field( $input['address'] ) : $current['address'];
		$out['hero_subtitle']             = isset( $input['hero_subtitle'] ) ? sanitize_textarea_field( $input['hero_subtitle'] ) : $current['hero_subtitle'];
		$out['about_excerpt']             = isset( $input['about_excerpt'] ) ? wp_kses_post( $input['about_excerpt'] ) : $current['about_excerpt'];
		$out['consultation_slot_minutes'] = isset( $input['consultation_slot_minutes'] ) ? (string) absint( $input['consultation_slot_minutes'] ) : '30';
		$out['show_prices_on_website']    = empty( $input['show_prices_on_website'] ) ? '0' : '1';

		$days = isset( $input['consultation_days'] ) && is_array( $input['consultation_days'] ) ? $input['consultation_days'] : array();
		$out['consultation_days'] = array_values( array_intersect( $days, array( 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat' ) ) );

		$methods = isset( $input['meeting_methods'] ) && is_array( $input['meeting_methods'] ) ? $input['meeting_methods'] : array();
		$out['meeting_methods'] = array_values( array_intersect( $methods, array( 'whatsapp', 'google_meet', 'zoom', 'teams' ) ) );

		$out['whatsapp_number'] = preg_replace( '/\D+/', '', $out['whatsapp_number'] );

		$out['logo_id']               = isset( $input['logo_id'] ) ? (string) absint( $input['logo_id'] ) : '0';
		$out['hero_image_id']         = isset( $input['hero_image_id'] ) ? (string) absint( $input['hero_image_id'] ) : '0';
		$out['about_teaser_image_id'] = isset( $input['about_teaser_image_id'] ) ? (string) absint( $input['about_teaser_image_id'] ) : '0';

		return $out;
	}

	public static function render() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$s    = self::get();
		$days = array(
			'sun' => 'Sunday',
			'mon' => 'Monday',
			'tue' => 'Tuesday',
			'wed' => 'Wednesday',
			'thu' => 'Thursday',
			'fri' => 'Friday',
			'sat' => 'Saturday',
		);
		$methods = array(
			'whatsapp'    => 'WhatsApp video',
			'google_meet' => 'Google Meet',
			'zoom'        => 'Zoom',
			'teams'       => 'Microsoft Teams',
		);
		?>
		<div class="wrap ju-settings-wrap">
			<h1>Home page</h1>
			<p>This is the <strong>home page</strong> (logo, hero photo, titles). Other website pages are under this same JyothishiUncle menu. Items in the left sidebar (Poojas, Products, Astrologers, Religious Travel, Articles) are the cards and posts that fill those pages. See <a href="<?php echo esc_url( admin_url( 'admin.php?page=ju-how-to-edit' ) ); ?>">How to edit</a>.</p>

			<form method="post" action="options.php">
				<?php settings_fields( 'ju_site_settings_group' ); ?>

				<h2>Contact</h2>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row"><label for="ju_whatsapp">WhatsApp number</label></th>
						<td>
							<input name="<?php echo esc_attr( self::OPTION_KEY ); ?>[whatsapp_number]" id="ju_whatsapp" type="text" class="regular-text" value="<?php echo esc_attr( $s['whatsapp_number'] ); ?>">
							<p class="description">Digits with country code, no + or spaces. Example: 96812345678</p>
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="ju_email">Admin email</label></th>
						<td>
							<input name="<?php echo esc_attr( self::OPTION_KEY ); ?>[admin_notify_email]" id="ju_email" type="email" class="regular-text" value="<?php echo esc_attr( $s['admin_notify_email'] ); ?>">
							<p class="description">Booking and enquiry emails go here.</p>
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="ju_phone">Phone</label></th>
						<td>
							<input name="<?php echo esc_attr( self::OPTION_KEY ); ?>[phone_number]" id="ju_phone" type="text" class="regular-text" value="<?php echo esc_attr( $s['phone_number'] ); ?>">
						</td>
					</tr>
				</table>

				<h2>Homepage photos</h2>
				<p>Upload images from the Media Library. These replace the design placeholders on the public homepage.</p>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row">Logo</th>
						<td><?php self::media_field( 'logo_id', $s['logo_id'], 'Shown in the header.' ); ?></td>
					</tr>
					<tr>
						<th scope="row">Hero photo</th>
						<td><?php self::media_field( 'hero_image_id', $s['hero_image_id'], 'Optional photo behind the homepage mandala. Leave empty to keep the cosmic graphic only.' ); ?></td>
					</tr>
					<tr>
						<th scope="row">About teaser photo</th>
						<td><?php self::media_field( 'about_teaser_image_id', $s['about_teaser_image_id'], 'Photo in the homepage Living Vedic Heritage section. If empty, the About page featured image is used.' ); ?></td>
					</tr>
				</table>

				<?php JU_I18n::render_home_tabs(); ?>

				<h2>Consultation calendar</h2>
				<p>Times are stored in the consultation timezone. The public website converts them to each visitor’s local clock. Meetings are online only.</p>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row">Timezone</th>
						<td>
							<input name="<?php echo esc_attr( self::OPTION_KEY ); ?>[consultation_timezone]" type="text" class="regular-text" value="<?php echo esc_attr( $s['consultation_timezone'] ); ?>" readonly>
							<p class="description">Calendar timezone (IANA), currently <?php echo esc_html( $s['consultation_timezone'] ); ?></p>
						</td>
					</tr>
					<tr>
						<th scope="row">Working days</th>
						<td>
							<?php foreach ( $days as $key => $label ) : ?>
								<label style="display:inline-block;margin-right:12px;">
									<input type="checkbox" name="<?php echo esc_attr( self::OPTION_KEY ); ?>[consultation_days][]" value="<?php echo esc_attr( $key ); ?>" <?php checked( in_array( $key, (array) $s['consultation_days'], true ) ); ?>>
									<?php echo esc_html( $label ); ?>
								</label>
							<?php endforeach; ?>
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="ju_start">Start time</label></th>
						<td><input name="<?php echo esc_attr( self::OPTION_KEY ); ?>[consultation_start_time]" id="ju_start" type="time" value="<?php echo esc_attr( $s['consultation_start_time'] ); ?>"></td>
					</tr>
					<tr>
						<th scope="row"><label for="ju_end">End time</label></th>
						<td><input name="<?php echo esc_attr( self::OPTION_KEY ); ?>[consultation_end_time]" id="ju_end" type="time" value="<?php echo esc_attr( $s['consultation_end_time'] ); ?>"></td>
					</tr>
					<tr>
						<th scope="row"><label for="ju_slot">Slot length (minutes)</label></th>
						<td>
							<select name="<?php echo esc_attr( self::OPTION_KEY ); ?>[consultation_slot_minutes]" id="ju_slot">
								<option value="30" <?php selected( $s['consultation_slot_minutes'], '30' ); ?>>30</option>
								<option value="45" <?php selected( $s['consultation_slot_minutes'], '45' ); ?>>45</option>
								<option value="60" <?php selected( $s['consultation_slot_minutes'], '60' ); ?>>60</option>
							</select>
						</td>
					</tr>
					<tr>
						<th scope="row">Meeting methods</th>
						<td>
							<?php foreach ( $methods as $key => $label ) : ?>
								<label style="display:block;margin-bottom:4px;">
									<input type="checkbox" name="<?php echo esc_attr( self::OPTION_KEY ); ?>[meeting_methods][]" value="<?php echo esc_attr( $key ); ?>" <?php checked( in_array( $key, (array) $s['meeting_methods'], true ) ); ?>>
									<?php echo esc_html( $label ); ?>
								</label>
							<?php endforeach; ?>
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="ju_meet_default">Default meeting method</label></th>
						<td>
							<select name="<?php echo esc_attr( self::OPTION_KEY ); ?>[default_meeting_method]" id="ju_meet_default">
								<?php foreach ( $methods as $key => $label ) : ?>
									<option value="<?php echo esc_attr( $key ); ?>" <?php selected( $s['default_meeting_method'], $key ); ?>><?php echo esc_html( $label ); ?></option>
								<?php endforeach; ?>
							</select>
						</td>
					</tr>
				</table>

				<h2>Website prices</h2>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row">Show prices on website</th>
						<td>
							<label>
								<input type="checkbox" name="<?php echo esc_attr( self::OPTION_KEY ); ?>[show_prices_on_website]" value="1" <?php checked( $s['show_prices_on_website'], '1' ); ?>>
								Show prices publicly
							</label>
							<p class="description">Leave this unchecked. Fees are discussed privately after enquiry. Internal fee notes in each item stay in WordPress only.</p>
						</td>
					</tr>
				</table>

				<h2>Social links</h2>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row">Instagram</th>
						<td><input name="<?php echo esc_attr( self::OPTION_KEY ); ?>[social_instagram]" type="url" class="regular-text" value="<?php echo esc_attr( $s['social_instagram'] ); ?>"></td>
					</tr>
					<tr>
						<th scope="row">Facebook</th>
						<td><input name="<?php echo esc_attr( self::OPTION_KEY ); ?>[social_facebook]" type="url" class="regular-text" value="<?php echo esc_attr( $s['social_facebook'] ); ?>"></td>
					</tr>
					<tr>
						<th scope="row">YouTube</th>
						<td><input name="<?php echo esc_attr( self::OPTION_KEY ); ?>[social_youtube]" type="url" class="regular-text" value="<?php echo esc_attr( $s['social_youtube'] ); ?>"></td>
					</tr>
				</table>

				<?php submit_button( 'Save home page' ); ?>
			</form>
		</div>
		<?php
	}

	private static function media_field( $key, $value, $help ) {
		$id  = (int) $value;
		$url = $id ? wp_get_attachment_image_url( $id, 'medium' ) : '';
		?>
		<div class="ju-media-field">
			<input type="hidden" name="<?php echo esc_attr( self::OPTION_KEY . '[' . $key . ']' ); ?>" value="<?php echo esc_attr( (string) $id ); ?>">
			<img src="<?php echo esc_url( $url ? $url : '' ); ?>" alt="" class="ju-media-preview" style="display:<?php echo $url ? 'block' : 'none'; ?>;max-width:220px;height:auto;margin-bottom:8px;border-radius:8px;">
			<button type="button" class="button ju-media-select">Choose image</button>
			<button type="button" class="button ju-media-clear">Remove</button>
			<p class="description"><?php echo esc_html( $help ); ?></p>
		</div>
		<?php
	}
}
