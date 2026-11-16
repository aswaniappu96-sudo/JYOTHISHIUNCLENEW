<?php
/**
 * Editable language copy for the public site.
 *
 * @package JyothishiUncleCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JU_I18n {

	const OPTION_KEY = 'ju_i18n_strings';

	public static function page_fields() {
		return array(
			'site_tagline'   => array(
				'label' => 'Tagline',
				'type'  => 'text',
			),
			'hero_title'     => array(
				'label' => 'Hero title',
				'type'  => 'text',
			),
			'hero_subtitle'  => array(
				'label' => 'Hero subtitle',
				'type'  => 'textarea',
			),
			'about_excerpt'  => array(
				'label' => 'About excerpt',
				'type'  => 'textarea',
			),
			'footer_text'    => array(
				'label' => 'Footer text',
				'type'  => 'text',
			),
			'address'        => array(
				'label' => 'Address / location',
				'type'  => 'textarea',
			),
		);
	}

	public static function locales() {
		$catalog = self::catalog();
		return isset( $catalog['locales'] ) && is_array( $catalog['locales'] ) ? $catalog['locales'] : array();
	}

	public static function catalog() {
		static $catalog = null;
		if ( null !== $catalog ) {
			return $catalog;
		}

		$path = JU_CORE_DIR . 'includes/i18n-catalog.json';
		if ( ! is_readable( $path ) ) {
			$catalog = array(
				'locales'  => array(),
				'groups'   => array(),
				'messages' => array(),
			);
			return $catalog;
		}

		$raw     = file_get_contents( $path );
		$decoded = json_decode( $raw, true );
		$catalog = is_array( $decoded ) ? $decoded : array(
			'locales'  => array(),
			'groups'   => array(),
			'messages' => array(),
		);
		return $catalog;
	}

	public static function locale_ids() {
		$ids = array();
		foreach ( self::locales() as $locale ) {
			if ( ! empty( $locale['id'] ) ) {
				$ids[] = sanitize_key( $locale['id'] );
			}
		}
		return $ids ? $ids : array( 'en' );
	}

	public static function content_locales() {
		$out = array();
		foreach ( self::locales() as $locale ) {
			if ( empty( $locale['id'] ) || 'en' === $locale['id'] ) {
				continue;
			}
			$out[] = $locale;
		}
		return $out;
	}

	public static function get_all() {
		$stored = get_option( self::OPTION_KEY, array() );
		return is_array( $stored ) ? $stored : array();
	}

	public static function get_locale( $locale ) {
		$all = self::get_all();
		$locale = self::normalize_locale( $locale );
		return ( isset( $all[ $locale ] ) && is_array( $all[ $locale ] ) ) ? $all[ $locale ] : array();
	}

	public static function catalog_value( $locale, $key ) {
		$catalog = self::catalog();
		$locale  = self::normalize_locale( $locale );
		if ( isset( $catalog['messages'][ $locale ][ $key ] ) ) {
			return (string) $catalog['messages'][ $locale ][ $key ];
		}
		if ( isset( $catalog['messages']['en'][ $key ] ) ) {
			return (string) $catalog['messages']['en'][ $key ];
		}
		$settings = JU_Settings::get();
		if ( isset( $settings[ $key ] ) && is_string( $settings[ $key ] ) ) {
			return $settings[ $key ];
		}
		return '';
	}

	private static function plain_text( $value ) {
		$value = (string) $value;
		$previous = null;
		while ( $previous !== $value && false !== strpos( $value, '&' ) ) {
			$previous = $value;
			$value    = html_entity_decode( $value, ENT_QUOTES | ENT_HTML5, 'UTF-8' );
		}
		return $value;
	}

	public static function value( $locale, $key ) {
		$saved = self::get_locale( $locale );
		if ( isset( $saved[ $key ] ) && '' !== trim( (string) $saved[ $key ] ) ) {
			return self::plain_text( $saved[ $key ] );
		}
		if ( 'en' === self::normalize_locale( $locale ) ) {
			$settings = JU_Settings::get();
			if ( isset( $settings[ $key ] ) && is_string( $settings[ $key ] ) && '' !== trim( $settings[ $key ] ) ) {
				return self::plain_text( $settings[ $key ] );
			}
		}
		return self::plain_text( self::catalog_value( $locale, $key ) );
	}

	public static function normalize_locale( $locale ) {
		$locale = sanitize_key( (string) $locale );
		$ids    = self::locale_ids();
		return in_array( $locale, $ids, true ) ? $locale : 'en';
	}

	public static function menu() {
		add_submenu_page(
			'ju-settings',
			'Language content',
			'Language content',
			'manage_options',
			'ju-language',
			array( __CLASS__, 'render' )
		);
	}

	public static function assets( $hook ) {
		$hook = (string) $hook;
		if ( false === strpos( $hook, 'ju-settings' ) && false === strpos( $hook, 'ju-language' ) ) {
			return;
		}

		wp_enqueue_style(
			'ju-i18n-admin',
			JU_CORE_URL . 'assets/admin-i18n.css',
			array(),
			JU_CORE_VERSION
		);
		wp_enqueue_script(
			'ju-i18n-admin',
			JU_CORE_URL . 'assets/admin-i18n.js',
			array(),
			JU_CORE_VERSION,
			true
		);
	}

	public static function handle_save() {
		if ( empty( $_POST['ju_i18n'] ) || ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$from_language_page = isset( $_POST['ju_i18n_save'] );
		if ( $from_language_page ) {
			check_admin_referer( 'ju_save_i18n' );
		} elseif ( isset( $_POST['option_page'] ) && 'ju_site_settings_group' === $_POST['option_page'] ) {
			check_admin_referer( 'ju_site_settings_group-options' );
		} else {
			return;
		}

		$posted = wp_unslash( $_POST['ju_i18n'] );
		if ( ! is_array( $posted ) ) {
			return;
		}

		$mode   = isset( $_POST['ju_i18n_mode'] ) ? sanitize_key( wp_unslash( $_POST['ju_i18n_mode'] ) ) : 'home';
		$active = isset( $_POST['ju_i18n_lang'] ) ? self::normalize_locale( wp_unslash( $_POST['ju_i18n_lang'] ) ) : 'en';
		$all    = self::get_all();

		if ( 'full' === $mode ) {
			$all[ $active ] = self::sanitize_strings( isset( $posted[ $active ] ) ? $posted[ $active ] : array() );
			self::sync_english_settings( $all[ $active ] );
		} else {
			foreach ( self::locale_ids() as $locale ) {
				$chunk = isset( $posted[ $locale ] ) && is_array( $posted[ $locale ] ) ? $posted[ $locale ] : array();
				$clean = self::sanitize_strings( $chunk );
				$all[ $locale ] = array_merge( isset( $all[ $locale ] ) && is_array( $all[ $locale ] ) ? $all[ $locale ] : array(), $clean );
			}
			if ( isset( $all['en'] ) ) {
				self::sync_english_settings( $all['en'] );
			}
		}

		update_option( self::OPTION_KEY, $all, false );

		if ( $from_language_page ) {
			wp_safe_redirect(
				add_query_arg(
					array(
						'page'    => 'ju-language',
						'lang'    => $active,
						'updated' => '1',
					),
					admin_url( 'admin.php' )
				)
			);
			exit;
		}
	}

	private static function sanitize_strings( $input ) {
		$out = array();
		if ( ! is_array( $input ) ) {
			return $out;
		}

		$page_keys = array_keys( self::page_fields() );
		$catalog   = self::catalog();
		$known     = array();
		if ( isset( $catalog['messages']['en'] ) && is_array( $catalog['messages']['en'] ) ) {
			$known = array_keys( $catalog['messages']['en'] );
		}
		$allowed = array_unique( array_merge( $page_keys, $known ) );

		foreach ( $allowed as $key ) {
			if ( ! isset( $input[ $key ] ) ) {
				continue;
			}
			$value = $input[ $key ];
			if ( ! is_string( $value ) ) {
				continue;
			}
			$value = self::plain_text( trim( wp_kses_post( $value ) ) );
			if ( '' === $value ) {
				continue;
			}
			$out[ $key ] = $value;
		}

		return $out;
	}

	private static function sync_english_settings( $strings ) {
		$settings = JU_Settings::get();
		$changed  = false;
		foreach ( array_keys( self::page_fields() ) as $key ) {
			if ( ! isset( $strings[ $key ] ) ) {
				continue;
			}
			$settings[ $key ] = $strings[ $key ];
			$changed          = true;
		}
		if ( $changed ) {
			update_option( JU_Settings::OPTION_KEY, $settings );
		}
	}

	public static function migrate_slide_three() {
		$all     = self::get_all();
		$current = isset( $all['en']['hero.title3'] ) ? self::plain_text( $all['en']['hero.title3'] ) : '';
		$old     = 'Your Destiny. Through Vedic Kundli.';
		if ( '' !== $current && $current !== $old ) {
			return;
		}

		$pack = array(
			'en' => array(
				'hero.kicker3'      => 'Priest-led pilgrimage & darshan',
				'hero.title3'       => 'Peaceful, Spiritual guided Temple Yatras',
				'hero.copy3'        => 'Join for unhurried darshan at Guruvayur, Sabarimala, Kashi, and Rameshwaram—with travel, Satvik food, and stay.',
				'hero.yatraWa'      => 'Get Yatra Details on WhatsApp →',
				'hero.familyYatra'  => 'Plan a Private Family Yatra',
				'hero.trustPace'    => 'Friendly Pace',
				'hero.trustMeals'   => 'Satvik Meals & Stay',
				'hero.trustRituals' => 'Guided Temple Rituals',
			),
			'hi' => array(
				'hero.kicker3'      => 'पुरोहित के साथ तीर्थ और दर्शन',
				'hero.title3'       => 'शांत, आध्यात्मिक निर्देशित मंदिर यात्राएँ',
				'hero.copy3'        => 'गुरुवायूर, सबरीमाला, काशी और रामेश्वरम में बिना जल्दबाजी दर्शन करें—यात्रा, सात्विक भोजन और ठहराव के साथ।',
				'hero.yatraWa'      => 'व्हाट्सऐप पर यात्रा विवरण पाएँ →',
				'hero.familyYatra'  => 'निजी पारिवारिक यात्रा की योजना बनाएँ',
				'hero.trustPace'    => 'सहज गति',
				'hero.trustMeals'   => 'सात्विक भोजन और ठहराव',
				'hero.trustRituals' => 'निर्देशित मंदिर अनुष्ठान',
			),
			'ta' => array(
				'hero.kicker3'      => 'அர்ச்சகர் தலைமையிலான யாத்திரை மற்றும் தரிசனம்',
				'hero.title3'       => 'அமைதியான, ஆன்மீக வழிகாட்டல் கோவில் யாத்திரைகள்',
				'hero.copy3'        => 'குருவாயூர், சபரிமலை, காசி, ராமேஸ்வரம் ஆகியவற்றில் அவசரமில்லாத தரிசனம்—பயணம், சாத்விக உணவு மற்றும் தங்குமிடத்துடன்.',
				'hero.yatraWa'      => 'வாட்ஸ்அப்பில் யாத்திரை விவரம் →',
				'hero.familyYatra'  => 'தனி குடும்ப யாத்திரையை திட்டமிடுங்கள்',
				'hero.trustPace'    => 'வசதியான வேகம்',
				'hero.trustMeals'   => 'சாத்விக உணவு மற்றும் தங்குமிடம்',
				'hero.trustRituals' => 'வழிகாட்டும் கோவில் சடங்குகள்',
			),
			'ml' => array(
				'hero.kicker3'      => 'പുരോഹിത നേതൃത്വത്തിലുള്ള തീർത്ഥാടനവും ദർശനവും',
				'hero.title3'       => 'ശാന്തവും ആത്മീയവുമായ വഴികാട്ടിയുള്ള ക്ഷേത്രയാത്രകൾ',
				'hero.copy3'        => 'ഗുരുവായൂർ, ശബരിമല, കാശി, രാമേശ്വരം എന്നിവിടങ്ങളിൽ തിരക്കില്ലാത്ത ദർശനം—യാത്ര, സാത്വിക ഭക്ഷണം, താമസം എന്നിവയോടെ.',
				'hero.yatraWa'      => 'വാട്ട്‌സ്ആപ്പിൽ യാത്ര വിവരം →',
				'hero.familyYatra'  => 'സ്വകാര്യ കുടുംബ യാത്ര ആസൂത്രണം ചെയ്യുക',
				'hero.trustPace'    => 'സൗകര്യപ്രദമായ വേഗം',
				'hero.trustMeals'   => 'സാത്വിക ഭക്ഷണവും താമസവും',
				'hero.trustRituals' => 'വഴികാട്ടിയുള്ള ക്ഷേത്ര കർമ്മങ്ങൾ',
			),
			'kn' => array(
				'hero.kicker3'      => 'ಪುರೋಹಿತ ನೇತೃತ್ವದ ಯಾತ್ರೆ ಮತ್ತು ದರ್ಶನ',
				'hero.title3'       => 'ಶಾಂತ, ಆಧ್ಯಾತ್ಮಿಕ ಮಾರ್ಗದರ್ಶಿತ ದೇವಾಲಯ ಯಾತ್ರೆಗಳು',
				'hero.copy3'        => 'ಗುರುವಾಯೂರು, ಶಬರಿಮಲೆ, ಕಾಶಿ ಮತ್ತು ರಾಮೇಶ್ವರದಲ್ಲಿ ಆತುರವಿಲ್ಲದ ದರ್ಶನ—ಪ್ರಯಾಣ, ಸಾತ್ವಿಕ ಆಹಾರ ಮತ್ತು ವಾಸ್ತವ್ಯದೊಂದಿಗೆ.',
				'hero.yatraWa'      => 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಯಾತ್ರೆ ವಿವರ →',
				'hero.familyYatra'  => 'ಖಾಸಗಿ ಕುಟುಂಬ ಯಾತ್ರೆಯನ್ನು ಯೋಜಿಸಿ',
				'hero.trustPace'    => 'ಸೌಕರ್ಯದ ವೇಗ',
				'hero.trustMeals'   => 'ಸಾತ್ವಿಕ ಊಟ ಮತ್ತು ವಾಸ್ತವ್ಯ',
				'hero.trustRituals' => 'ಮಾರ್ಗದರ್ಶಿತ ದೇವಾಲಯ ವಿಧಿಗಳು',
			),
			'te' => array(
				'hero.kicker3'      => 'పూజారి నేతృత్వంలోని యాత్ర మరియు దర్శనం',
				'hero.title3'       => 'ప్రశాంతమైన, ఆధ్యాత్మిక మార్గదర్శక ఆలయ యాత్రలు',
				'hero.copy3'        => 'గురువాయూరు, శబరిమల, కాశి, రామేశ్వరంలో తొందరలేని దర్శనం—ప్రయాణం, సాత్విక ఆహారం మరియు వసతితో.',
				'hero.yatraWa'      => 'వాట్సాప్‌లో యాత్ర వివరాలు →',
				'hero.familyYatra'  => 'ప్రైవేట్ కుటుంబ యాత్రను ప్లాన్ చేయండి',
				'hero.trustPace'    => 'సౌకర్యవంతమైన వేగం',
				'hero.trustMeals'   => 'సాత్విక భోజనం మరియు వసతి',
				'hero.trustRituals' => 'మార్గదర్శక ఆలయ కర్మలు',
			),
		);

		foreach ( $pack as $locale => $strings ) {
			if ( ! isset( $all[ $locale ] ) || ! is_array( $all[ $locale ] ) ) {
				$all[ $locale ] = array();
			}
			$all[ $locale ] = array_merge( $all[ $locale ], $strings );
		}

		update_option( self::OPTION_KEY, $all, false );
		update_option( 'ju_slide3_yatra', '1', false );
	}

	public static function rest() {
		$out = array();
		foreach ( self::locale_ids() as $locale ) {
			$saved = self::get_locale( $locale );
			if ( $saved ) {
				$clean = array();
				foreach ( $saved as $key => $text ) {
					$clean[ $key ] = is_string( $text ) ? self::plain_text( $text ) : $text;
				}
				$out[ $locale ] = $clean;
			}
		}
		return rest_ensure_response(
			array(
				'locales' => self::locale_ids(),
				'strings' => $out,
			)
		);
	}

	public static function home_fields( $locale ) {
		$locale = self::normalize_locale( $locale );
		foreach ( self::page_fields() as $key => $field ) {
			$name  = 'ju_i18n[' . $locale . '][' . $key . ']';
			$id    = 'ju_i18n_' . $locale . '_' . $key;
			$value = self::value( $locale, $key );
			$help  = 'en' === $locale ? '' : 'English: ' . self::value( 'en', $key );
			echo '<tr class="ju-i18n-home-row">';
			echo '<th scope="row"><label for="' . esc_attr( $id ) . '">' . esc_html( $field['label'] ) . '</label></th><td>';
			if ( 'textarea' === $field['type'] ) {
				echo '<textarea name="' . esc_attr( $name ) . '" id="' . esc_attr( $id ) . '" class="large-text" rows="4">' . esc_textarea( $value ) . '</textarea>';
			} else {
				echo '<input name="' . esc_attr( $name ) . '" id="' . esc_attr( $id ) . '" type="text" class="large-text" value="' . esc_attr( $value ) . '">';
			}
			if ( $help ) {
				echo '<p class="description">' . esc_html( $help ) . '</p>';
			}
			echo '</td></tr>';
		}
	}

	public static function home_blocks() {
		return array(
			array(
				'title'  => 'Slide 1 — Astrology consultation',
				'help'   => 'Eyebrow, headline, sub-headline, buttons, and trust line on the first banner.',
				'fields' => array(
					array( 'hero.kicker1', 'Eyebrow', 'text' ),
					array( 'hero.title1', 'Headline', 'text' ),
					array( 'hero.copy1', 'Sub-headline', 'textarea' ),
					array( 'hero.consultWa', 'Primary button', 'text' ),
					array( 'hero.acharyas', 'Secondary button', 'text' ),
					array( 'hero.trustSessions', 'Trust line — part 1', 'text' ),
					array( 'hero.trustModes', 'Trust line — part 2', 'text' ),
					array( 'hero.trustLangs', 'Trust line — part 3', 'text' ),
				),
			),
			array(
				'title'  => 'Slide 2 — Homam, poojas and remedies',
				'help'   => 'Text on the second banner. The third button, Book Video Consultation, is shared below.',
				'fields' => array(
					array( 'hero.kicker2', 'Eyebrow', 'text' ),
					array( 'hero.title2', 'Headline', 'text' ),
					array( 'hero.copy2', 'Sub-headline', 'textarea' ),
					array( 'hero.bookPoojaWa', 'Primary button', 'text' ),
					array( 'hero.remedies', 'Secondary button', 'text' ),
					array( 'hero.trustSankalpa', 'Trust line — part 1', 'text' ),
					array( 'hero.trustStream', 'Trust line — part 2', 'text' ),
					array( 'hero.trustPrasad', 'Trust line — part 3', 'text' ),
				),
			),
			array(
				'title'  => 'Slide 3 — Temple yatra',
				'help'   => 'Text on the third banner. The video button is shared with the other slides.',
				'fields' => array(
					array( 'hero.kicker3', 'Eyebrow', 'text' ),
					array( 'hero.title3', 'Headline', 'text' ),
					array( 'hero.copy3', 'Sub-headline', 'textarea' ),
					array( 'hero.yatraWa', 'Primary button', 'text' ),
					array( 'hero.familyYatra', 'Secondary button', 'text' ),
					array( 'hero.video', 'Video button (shown on every slide)', 'text' ),
					array( 'hero.trustPace', 'Trust line — part 1', 'text' ),
					array( 'hero.trustMeals', 'Trust line — part 2', 'text' ),
					array( 'hero.trustRituals', 'Trust line — part 3', 'text' ),
				),
			),
			array(
				'title'  => 'Service line under the banner',
				'help'   => 'Shown where the search box used to be, on every slide.',
				'fields' => array(
					array( 'hero.serviceLine', 'Service line', 'text' ),
					array( 'hero.trustOne', 'Trust box 1', 'text' ),
					array( 'hero.trustMoola', 'Trust box 2', 'text' ),
					array( 'hero.trustReach', 'Trust box 3', 'text' ),
				),
			),
			array(
				'title'  => 'About section',
				'help'   => 'The first section under the banner.',
				'fields' => array(
					array( 'about.kicker', 'Eyebrow', 'text' ),
					array( 'about.lead', 'Heading start', 'text' ),
					array( 'about.accent', 'Heading highlight', 'text' ),
					array( 'about.rest', 'Heading end', 'text' ),
					array( 'about.body', 'Paragraph', 'textarea' ),
					array( 'about_excerpt', 'Longer about text', 'textarea' ),
					array( 'about.read', 'Button', 'text' ),
				),
			),
			array(
				'title'  => 'How it works',
				'fields' => array(
					array( 'how.kicker', 'Eyebrow', 'text' ),
					array( 'how.lead', 'Heading start', 'text' ),
					array( 'how.accent', 'Heading highlight', 'text' ),
					array( 'how.step1', 'Step 1', 'text' ),
					array( 'how.step2', 'Step 2', 'text' ),
					array( 'how.step3', 'Step 3', 'text' ),
					array( 'how.cta', 'Button', 'text' ),
				),
			),
			array(
				'title'  => 'Guidance topics',
				'fields' => array(
					array( 'consult.lead', 'Heading start', 'text' ),
					array( 'consult.accent', 'Heading highlight', 'text' ),
					array( 'consult.copy', 'Paragraph', 'textarea' ),
					array( 'consult.quote', 'Quote', 'textarea' ),
					array( 'consult.ctaTitle', 'Side heading', 'text' ),
					array( 'consult.ctaCopy', 'Side text', 'textarea' ),
				),
			),
			array(
				'title'  => 'Astrologers section',
				'help'   => 'Headings only. Each astrologer card is edited under Astrologers.',
				'fields' => array(
					array( 'astro.kicker', 'Eyebrow', 'text' ),
					array( 'astro.lead', 'Heading start', 'text' ),
					array( 'astro.accent', 'Heading highlight', 'text' ),
					array( 'astro.copy', 'Paragraph', 'textarea' ),
					array( 'astro.view', 'Button', 'text' ),
				),
			),
			array(
				'title'  => 'Join as an astrologer',
				'fields' => array(
					array( 'join.kicker', 'Eyebrow', 'text' ),
					array( 'join.lead', 'Heading start', 'text' ),
					array( 'join.accent', 'Heading highlight', 'text' ),
					array( 'join.copy', 'Paragraph', 'textarea' ),
					array( 'join.cta', 'Button', 'text' ),
				),
			),
			array(
				'title'  => 'Free astrology tools',
				'fields' => array(
					array( 'daily.kicker', 'Eyebrow', 'text' ),
					array( 'daily.lead', 'Heading start', 'text' ),
					array( 'daily.accent', 'Heading highlight', 'text' ),
					array( 'daily.copy', 'Paragraph', 'textarea' ),
				),
			),
			array(
				'title'  => 'Pooja section',
				'help'   => 'Headings only. Each pooja card is edited under Poojas.',
				'fields' => array(
					array( 'pooja.badge', 'Eyebrow', 'text' ),
					array( 'pooja.lead', 'Heading start', 'text' ),
					array( 'pooja.accent', 'Heading highlight', 'text' ),
					array( 'pooja.copy', 'Paragraph', 'textarea' ),
					array( 'pooja.view', 'Button', 'text' ),
				),
			),
			array(
				'title'  => 'Products section',
				'help'   => 'Headings only. Each product card is edited under Products.',
				'fields' => array(
					array( 'store.badge', 'Eyebrow', 'text' ),
					array( 'store.lead', 'Heading start', 'text' ),
					array( 'store.accent', 'Heading highlight', 'text' ),
					array( 'store.copy', 'Paragraph', 'textarea' ),
					array( 'store.view', 'Button', 'text' ),
				),
			),
			array(
				'title'  => 'Temple yatra section',
				'help'   => 'Headings only. Each yatra card is edited under Religious Travel.',
				'fields' => array(
					array( 'yatra.badge', 'Eyebrow', 'text' ),
					array( 'yatra.lead', 'Heading start', 'text' ),
					array( 'yatra.accent', 'Heading highlight', 'text' ),
					array( 'yatra.copy', 'Paragraph', 'textarea' ),
					array( 'yatra.view', 'Button', 'text' ),
				),
			),
			array(
				'title'  => 'Reviews section',
				'help'   => 'Headings only. Each review is edited under Testimonials.',
				'fields' => array(
					array( 'review.kicker', 'Eyebrow', 'text' ),
					array( 'review.lead', 'Heading start', 'text' ),
					array( 'review.accent', 'Heading highlight', 'text' ),
					array( 'review.copy', 'Paragraph', 'textarea' ),
				),
			),
			array(
				'title'  => 'Articles section',
				'help'   => 'Headings only. Each article is edited under Articles.',
				'fields' => array(
					array( 'articles.kicker', 'Eyebrow', 'text' ),
					array( 'articles.lead', 'Heading start', 'text' ),
					array( 'articles.accent', 'Heading highlight', 'text' ),
					array( 'articles.copy', 'Paragraph', 'textarea' ),
					array( 'articles.view', 'Button', 'text' ),
				),
			),
			array(
				'title'  => 'Enquiry section',
				'fields' => array(
					array( 'enquiry.kicker', 'Eyebrow', 'text' ),
					array( 'enquiry.lead', 'Heading start', 'text' ),
					array( 'enquiry.accent', 'Heading highlight', 'text' ),
					array( 'enquiry.copy', 'Paragraph', 'textarea' ),
				),
			),
			array(
				'title'  => 'Closing section',
				'fields' => array(
					array( 'cta.lead', 'Heading start', 'text' ),
					array( 'cta.accent', 'Heading highlight', 'text' ),
					array( 'cta.copy', 'Paragraph', 'textarea' ),
				),
			),
			array(
				'title'  => 'Footer and site line',
				'fields' => array(
					array( 'site_tagline', 'Tagline', 'text' ),
					array( 'footer_text', 'Footer text', 'text' ),
					array( 'address', 'Address', 'textarea' ),
				),
			),
		);
	}

	private static function editor_field( $locale, $key, $label, $type ) {
		$name  = 'ju_i18n[' . $locale . '][' . $key . ']';
		$id    = 'ju_i18n_' . $locale . '_' . sanitize_html_class( str_replace( '.', '_', $key ) );
		$value = self::value( $locale, $key );
		echo '<tr class="ju-i18n-home-row">';
		echo '<th scope="row"><label for="' . esc_attr( $id ) . '">' . esc_html( $label ) . '</label></th><td>';
		if ( 'textarea' === $type ) {
			echo '<textarea name="' . esc_attr( $name ) . '" id="' . esc_attr( $id ) . '" class="large-text" rows="3">' . esc_textarea( $value ) . '</textarea>';
		} else {
			echo '<input name="' . esc_attr( $name ) . '" id="' . esc_attr( $id ) . '" type="text" class="large-text" value="' . esc_attr( $value ) . '">';
		}
		if ( 'en' !== $locale ) {
			echo '<p class="description">English: ' . esc_html( self::value( 'en', $key ) ) . '</p>';
		}
		echo '</td></tr>';
	}

	public static function render_home_tabs() {
		$locales = self::locales();
		$blocks  = self::home_blocks();
		?>
		<input type="hidden" name="ju_i18n_mode" value="home">
		<h2>Banner text and section text</h2>
		<p>Choose a language, edit the banner and each section, then click <strong>Save home page</strong> at the bottom. English is used when another language is left blank.</p>
		<nav class="nav-tab-wrapper ju-i18n-tabs" data-ju-tabs="home">
			<?php foreach ( $locales as $index => $locale ) : ?>
				<a href="#ju-home-lang-<?php echo esc_attr( $locale['id'] ); ?>" class="nav-tab<?php echo 0 === $index ? ' nav-tab-active' : ''; ?>" data-lang="<?php echo esc_attr( $locale['id'] ); ?>">
					<?php echo esc_html( $locale['native'] ); ?>
				</a>
			<?php endforeach; ?>
		</nav>
		<?php foreach ( $locales as $index => $locale ) : ?>
			<div class="ju-i18n-panel" data-lang="<?php echo esc_attr( $locale['id'] ); ?>" <?php echo 0 === $index ? '' : 'hidden'; ?>>
				<?php foreach ( $blocks as $block ) : ?>
					<div class="ju-home-block">
						<h3><?php echo esc_html( $block['title'] ); ?></h3>
						<?php if ( ! empty( $block['help'] ) ) : ?>
							<p class="description"><?php echo esc_html( $block['help'] ); ?></p>
						<?php endif; ?>
						<table class="form-table" role="presentation">
							<?php foreach ( $block['fields'] as $field ) : ?>
								<?php self::editor_field( $locale['id'], $field[0], $field[1], $field[2] ); ?>
							<?php endforeach; ?>
						</table>
					</div>
				<?php endforeach; ?>
			</div>
		<?php endforeach; ?>
		<?php
	}

	public static function render() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$active  = isset( $_GET['lang'] ) ? self::normalize_locale( wp_unslash( $_GET['lang'] ) ) : 'en';
		$locales = self::locales();
		$groups  = self::catalog()['groups'];
		?>
		<div class="wrap ju-settings-wrap ju-i18n-wrap">
			<h1>Language content</h1>
			<p>Edit menu, banner, buttons, and footer text for each language. Leave a box blank to keep the built-in default. Photos, phone numbers, and WhatsApp stay on the <a href="<?php echo esc_url( admin_url( 'admin.php?page=ju-settings' ) ); ?>">Home page</a>. About, Contact, legal pages, poojas, products, astrologers, travel, temples, and articles each have their own language bar — open the item and switch English / Hindi / Tamil / Malayalam / Kannada / Telugu.</p>

			<?php if ( ! empty( $_GET['updated'] ) ) : ?>
				<div class="notice notice-success is-dismissible"><p>Language content saved.</p></div>
			<?php endif; ?>

			<nav class="nav-tab-wrapper">
				<?php foreach ( $locales as $locale ) : ?>
					<a class="nav-tab<?php echo $active === $locale['id'] ? ' nav-tab-active' : ''; ?>" href="<?php echo esc_url( admin_url( 'admin.php?page=ju-language&lang=' . $locale['id'] ) ); ?>">
						<?php echo esc_html( $locale['native'] ); ?>
					</a>
				<?php endforeach; ?>
			</nav>

			<form method="post" action="<?php echo esc_url( admin_url( 'admin.php?page=ju-language&lang=' . $active ) ); ?>">
				<input type="hidden" name="ju_i18n_save" value="1">
				<input type="hidden" name="ju_i18n_mode" value="full">
				<input type="hidden" name="ju_i18n_lang" value="<?php echo esc_attr( $active ); ?>">
				<?php wp_nonce_field( 'ju_save_i18n' ); ?>

				<details open>
					<summary>Homepage text</summary>
					<table class="form-table" role="presentation">
						<?php self::home_fields( $active ); ?>
					</table>
				</details>

				<?php foreach ( $groups as $group ) : ?>
					<details>
						<summary><?php echo esc_html( $group['label'] ); ?></summary>
						<table class="form-table" role="presentation">
							<?php foreach ( $group['keys'] as $key ) : ?>
								<?php
								$id    = 'ju_i18n_full_' . $active . '_' . sanitize_html_class( $key );
								$name  = 'ju_i18n[' . $active . '][' . $key . ']';
								$value = self::value( $active, $key );
								$en    = self::value( 'en', $key );
								$long  = strlen( $value ) > 90 || strlen( $en ) > 90;
								?>
								<tr>
									<th scope="row">
										<label for="<?php echo esc_attr( $id ); ?>"><?php echo esc_html( $en ? $en : $key ); ?></label>
										<p class="description"><code><?php echo esc_html( $key ); ?></code></p>
									</th>
									<td>
										<?php if ( $long ) : ?>
											<textarea name="<?php echo esc_attr( $name ); ?>" id="<?php echo esc_attr( $id ); ?>" class="large-text" rows="3"><?php echo esc_textarea( $value ); ?></textarea>
										<?php else : ?>
											<input name="<?php echo esc_attr( $name ); ?>" id="<?php echo esc_attr( $id ); ?>" type="text" class="large-text" value="<?php echo esc_attr( $value ); ?>">
										<?php endif; ?>
									</td>
								</tr>
							<?php endforeach; ?>
						</table>
					</details>
				<?php endforeach; ?>

				<?php submit_button( 'Save ' . $active . ' content' ); ?>
			</form>
		</div>
		<?php
	}
}
