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

	public static function value( $locale, $key ) {
		$saved = self::get_locale( $locale );
		if ( isset( $saved[ $key ] ) && '' !== trim( (string) $saved[ $key ] ) ) {
			return (string) $saved[ $key ];
		}
		if ( 'en' === self::normalize_locale( $locale ) ) {
			$settings = JU_Settings::get();
			if ( isset( $settings[ $key ] ) && is_string( $settings[ $key ] ) && '' !== trim( $settings[ $key ] ) ) {
				return $settings[ $key ];
			}
		}
		return self::catalog_value( $locale, $key );
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
			$value = trim( wp_kses_post( $value ) );
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

	public static function rest() {
		$out = array();
		foreach ( self::locale_ids() as $locale ) {
			$saved = self::get_locale( $locale );
			if ( $saved ) {
				$out[ $locale ] = $saved;
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

	public static function render_home_tabs() {
		$locales = self::locales();
		?>
		<input type="hidden" name="ju_i18n_mode" value="home">
		<h2>Homepage text by language</h2>
		<p>Choose a language tab, edit the text, then save. English is also used if another language is left blank.</p>
		<nav class="nav-tab-wrapper ju-i18n-tabs" data-ju-tabs="home">
			<?php foreach ( $locales as $index => $locale ) : ?>
				<a href="#ju-home-lang-<?php echo esc_attr( $locale['id'] ); ?>" class="nav-tab<?php echo 0 === $index ? ' nav-tab-active' : ''; ?>" data-lang="<?php echo esc_attr( $locale['id'] ); ?>">
					<?php echo esc_html( $locale['native'] ); ?>
				</a>
			<?php endforeach; ?>
		</nav>
		<?php foreach ( $locales as $index => $locale ) : ?>
			<div class="ju-i18n-panel" data-lang="<?php echo esc_attr( $locale['id'] ); ?>" <?php echo 0 === $index ? '' : 'hidden'; ?>>
				<table class="form-table" role="presentation">
					<?php self::home_fields( $locale['id'] ); ?>
				</table>
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
			<p>Edit menu, banner, buttons, and footer text for each language. Leave a box blank to keep the built-in default. Photos, phone numbers, and WhatsApp stay on the <a href="<?php echo esc_url( admin_url( 'admin.php?page=ju-settings' ) ); ?>">Home page</a>. Pooja, product, astrologer, and article translations are on each item — open it and use the language tabs under the English fields.</p>

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
