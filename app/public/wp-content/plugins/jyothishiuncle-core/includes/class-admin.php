<?php
/**
 * Admin polish for a non-technical client.
 *
 * @package JyothishiUncleCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JU_Admin {

	public static function theme_supports() {
		add_theme_support( 'post-thumbnails' );
		add_post_type_support( 'page', 'thumbnail' );
		add_post_type_support( 'post', 'thumbnail' );
	}

	public static function dashboard_widget() {
		if ( ! current_user_can( 'edit_pages' ) ) {
			return;
		}

		wp_add_dashboard_widget(
			'ju_how_to_edit',
			'How to edit the website',
			array( __CLASS__, 'render_dashboard_widget' )
		);
	}

	public static function render_dashboard_widget() {
		echo '<p>Website page titles and photos are under <strong>JyothishiUncle</strong> in the left menu. Poojas, products, astrologers, travel places, and articles are separate items — each one has its own featured image.</p>';
		echo '<p><a class="button button-primary" href="' . esc_url( admin_url( 'admin.php?page=ju-how-to-edit' ) ) . '">Open the full guide</a></p>';
	}

	public static function render_help() {
		if ( ! current_user_can( 'edit_pages' ) ) {
			return;
		}

		$rows = array(
			array( 'Home', admin_url( 'admin.php?page=ju-settings' ), 'JyothishiUncle → Home page', 'Logo, hero photo, homepage titles by language, WhatsApp, address, footer.' ),
			array( 'Language content', admin_url( 'admin.php?page=ju-language' ), 'JyothishiUncle → Language content', 'English, Hindi, Tamil, Malayalam, Kannada, Telugu: menu, banner, buttons, footer.' ),
			array( 'About', admin_url( 'admin.php?page=ju-edit-about' ), 'JyothishiUncle → About page', 'Title, intro, editor text, Featured image (portrait), Photo 2, Photo 3.' ),
			array( 'Services heading', admin_url( 'admin.php?page=ju-edit-services' ), 'JyothishiUncle → Services page', 'Page title, intro, and hero photo. Pooja/product cards are not on this screen.' ),
			array( 'Pooja cards', admin_url( 'edit.php?post_type=pooja' ), 'Left menu → Poojas', 'Each pooja: English title and text, Featured image, gallery. Language tabs: Hindi, Tamil, Malayalam, Kannada, Telugu.' ),
			array( 'Pooja temples', admin_url( 'edit.php?post_type=vendor' ), 'Left menu → Pooja Temples', 'Temples that can host online or offline poojas. They appear on the pooja page and in the booking form.' ),
			array( 'Product cards', admin_url( 'edit.php?post_type=product' ), 'Left menu → Products', 'Each product: English title and text, Featured image, gallery. Language tabs: Hindi, Tamil, Malayalam, Kannada, Telugu.' ),
			array( 'Astrologers heading', admin_url( 'admin.php?page=ju-edit-astrologers' ), 'JyothishiUncle → Astrologers page', 'Page title, intro, and hero photo.' ),
			array( 'Astrologer cards', admin_url( 'edit.php?post_type=astrologer' ), 'Left menu → Astrologers', 'Each astrologer: English name, bio, location, portrait. Language tabs: Hindi, Tamil, Malayalam, Kannada, Telugu.' ),
			array( 'Travel heading', admin_url( 'admin.php?page=ju-edit-travel' ), 'JyothishiUncle → Religious Travel page', 'Page title, intro, and hero photo.' ),
			array( 'Travel places', admin_url( 'edit.php?post_type=religious_travel' ), 'Left menu → Religious Travel', 'Each destination: title, text, Featured image, gallery.' ),
			array( 'Articles heading', admin_url( 'admin.php?page=ju-edit-articles' ), 'JyothishiUncle → Articles page', 'Listing page title, intro, and hero photo.' ),
			array( 'Article posts', admin_url( 'edit.php' ), 'Left menu → Articles', 'Each article: English title, excerpt, content, Featured image, Writer name. Language tabs: Hindi, Tamil, Malayalam, Kannada, Telugu.' ),
			array( 'Contact', admin_url( 'admin.php?page=ju-edit-contact' ), 'JyothishiUncle → Contact page', 'Title, intro, editor text, Featured image, Photo 2.' ),
			array( 'Consultation schedule', admin_url( 'edit.php?post_type=consultation_booking&page=ju-consultation-schedule' ), 'Left menu → Schedule Consultations → Schedule (Excel)', 'Change date or time, mark meeting finished, or delete. Locked dates leave the public calendar until finished or deleted.' ),
			array( 'Pooja bookings', admin_url( 'edit.php?post_type=pooja_booking&page=ju-pooja-schedule' ), 'Left menu → Pooja Bookings → Pooja bookings (Excel)', 'Website pooja bookings are saved here even if WhatsApp is not sent. Change date, online/offline, pooja temple, or status.' ),
			array( 'Product bookings', admin_url( 'edit.php?post_type=product_enquiry&page=ju-product-schedule' ), 'Left menu → Product Bookings → Product bookings (Excel)', 'Website Buy form bookings are saved here even if WhatsApp is not sent. Change quantity or status.' ),
			array( 'Yatra bookings', admin_url( 'edit.php?post_type=travel_booking&page=ju-travel-schedule' ), 'Left menu → Yatra Bookings → Yatra bookings (Excel)', 'Website yatra form bookings are saved here even if WhatsApp is not sent. Change preferred dates or status.' ),
			array( 'Client enquiries', admin_url( 'edit.php?post_type=customer_enquiry&page=ju-enquiry-schedule' ), 'Left menu → Customer Enquiries → Client enquiries (Excel)', 'Website enquiry form submissions are saved here. Admin also gets an email for each new client enquiry. Change status after you reply.' ),
			array( 'Registrations', admin_url( 'edit.php?post_type=website_registration&page=ju-registration-schedule' ), 'Left menu → Registrations → Registrations (Excel)', 'Website Register form details are saved here as a separate Excel sheet, not mixed with client enquiries.' ),
			array( 'Privacy / Terms', admin_url( 'edit.php?post_type=page' ), 'Left menu → Pages', 'Open Privacy Policy or Terms & Conditions and edit the text.' ),
		);
		?>
		<div class="wrap ju-settings-wrap ju-help-wrap">
			<h1>How to edit the website</h1>
			<p>The public website is not edited with a page builder. You change text and photos here in WordPress, then they appear on the Next.js site.</p>

			<h2>1. Website pages (headings and page photos)</h2>
			<p>Use the <strong>JyothishiUncle</strong> menu. Open the page, change the title and text, then set <strong>Featured image</strong> in the right sidebar. Click Update.</p>

			<h2>2. Left-sidebar items (cards and posts)</h2>
			<p>Poojas, Products, Astrologers, Pooja Temples, Religious Travel, and Articles are lists. Open one item, edit it, set its Featured image, then Update. Add a new item with Add New. Do not create a new WordPress Page for each pooja or article.</p>

			<table class="widefat striped" style="max-width:1100px;margin-top:16px;">
				<thead>
					<tr>
						<th>On the website</th>
						<th>Edit here</th>
						<th>What to change</th>
					</tr>
				</thead>
				<tbody>
					<?php foreach ( $rows as $row ) : ?>
						<tr>
							<td><?php echo esc_html( $row[0] ); ?></td>
							<td><a href="<?php echo esc_url( $row[1] ); ?>"><?php echo esc_html( $row[2] ); ?></a></td>
							<td><?php echo esc_html( $row[3] ); ?></td>
						</tr>
					<?php endforeach; ?>
				</tbody>
			</table>

			<h2>Photos</h2>
			<ul>
				<li>Every page and every list item uses <strong>Featured image</strong> (right sidebar) as the main photo.</li>
				<li>About and Contact also have Photo 2 and Photo 3 under <em>Page photos &amp; headings</em>.</li>
				<li>Poojas, products, and travel can have extra gallery photos below the editor.</li>
				<li>Home logo and hero photo are only on <a href="<?php echo esc_url( admin_url( 'admin.php?page=ju-settings' ) ); ?>">Home page</a>.</li>
			</ul>
		</div>
		<?php
	}

	public static function adjust_menus() {
		remove_menu_page( 'edit-comments.php' );
	}

	public static function assets( $hook ) {
		wp_enqueue_style(
			'ju-admin',
			JU_CORE_URL . 'assets/admin.css',
			array(),
			JU_CORE_VERSION
		);
	}

	public static function acf_notice() {
		if ( ! current_user_can( 'activate_plugins' ) ) {
			return;
		}

		if ( function_exists( 'acf_add_local_field_group' ) ) {
			return;
		}

		$search = admin_url( 'plugin-install.php?s=advanced+custom+fields&tab=search&type=term' );
		echo '<div class="notice notice-warning"><p><strong>JyothishiUncle:</strong> Please install and activate the free <a href="' . esc_url( $search ) . '">Advanced Custom Fields</a> plugin. Do not install ACF Pro. Do not add a page-builder theme.</p></div>';
	}

	public static function smtp_notice() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		if ( ! function_exists( 'is_plugin_active' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		if ( ! is_plugin_active( 'wp-mail-smtp/wp_mail_smtp.php' ) ) {
			return;
		}

		$options = get_option( 'wp_mail_smtp', array() );
		$mailer  = isset( $options['mail']['mailer'] ) ? $options['mail']['mailer'] : 'mail';
		if ( $mailer && 'mail' !== $mailer ) {
			return;
		}

		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
		if ( $screen && ! in_array( $screen->id, array( 'dashboard', 'toplevel_page_ju-settings', 'plugins' ), true ) ) {
			return;
		}

		$link = admin_url( 'admin.php?page=wp-mail-smtp' );
		echo '<div class="notice notice-info"><p><strong>JyothishiUncle:</strong> WP Mail SMTP is installed. You do <em>not</em> need to finish setup on this Local computer. Configure it later before the live website, using the mailbox that should receive bookings. <a href="' . esc_url( $link ) . '">Open WP Mail SMTP</a></p></div>';
	}

	public static function content_guide() {
		if ( ! current_user_can( 'edit_pages' ) ) {
			return;
		}

		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
		if ( ! $screen ) {
			return;
		}

		if ( 'dashboard' === $screen->id ) {
			$regs = admin_url( 'edit.php?post_type=website_registration&page=ju-registration-schedule' );
			echo '<div class="notice notice-info"><p><strong>How to change website content and photos:</strong> open <a href="' . esc_url( admin_url( 'admin.php?page=ju-how-to-edit' ) ) . '">JyothishiUncle → How to edit</a>. Home, About, Services, Astrologers, Travel, Articles, and Contact are website pages. The left-sidebar lists (Poojas, Products, Astrologers, Religious Travel, Articles) are the cards and posts on those pages — set a Featured image on each item.</p><p><strong>Website registrations:</strong> left menu → <a href="' . esc_url( $regs ) . '">Registrations → Registrations (Excel)</a>. New Register form accounts are saved there.</p></div>';
			return;
		}

		self::editor_help( $screen );
	}

	public static function editor_help( $screen ) {
		global $post;

		$base = '<strong>Photos:</strong> set the <em>Featured image</em> in the right sidebar, then click Update. That photo appears on the public website.';

		if ( 'page' === $screen->post_type && in_array( $screen->base, array( 'post', 'page' ), true ) ) {
			$slug = $post ? $post->post_name : '';
			$extra = array(
				'about'             => ' About: Featured image is the portrait. Photo 2 and Photo 3 are extra ritual photos.',
				'services'          => ' This heading appears on the Services page. Individual poojas and products are in the left menu.',
				'astrologers'       => ' This heading appears on the Astrologers page. Individual astrologers are in the left menu.',
				'religious-travel'  => ' This heading appears on the Travel page. Individual destinations are in Religious Travel.',
				'articles'          => ' This heading appears on the Articles listing. Individual posts are in Articles.',
				'contact'           => ' Contact: Featured image is the first large photo. Photo 2 is the second large photo.',
			);
			$note = isset( $extra[ $slug ] ) ? $extra[ $slug ] : ' Page title, intro text, and Featured image appear on the matching website page.';
			echo '<div class="notice notice-info"><p>' . $base . esc_html( $note ) . '</p></div>';
			return;
		}

		$cpt_notes = array(
			'pooja'             => 'This pooja card appears on the Services page. Gallery photos appear on the pooja detail page.',
			'vendor'            => 'This pooja temple appears on pooja pages and in the online and offline booking form.',
			'product'           => 'This product card appears on the Services page. Gallery photos appear on the product detail page.',
			'astrologer'        => 'This portrait card appears on the Astrologers page.',
			'religious_travel'  => 'This destination appears on the Religious Travel page.',
			'post'              => 'This article appears under Articles on the website. Fill Writer name in the sidebar; that is the name shown on the article page.',
			'testimonial'       => 'This review can appear on the home page.',
			'faq'               => 'This question can appear on the home page.',
		);

		if ( isset( $cpt_notes[ $screen->post_type ] ) && in_array( $screen->base, array( 'post' ), true ) ) {
			echo '<div class="notice notice-info"><p>' . $base . ' ' . esc_html( $cpt_notes[ $screen->post_type ] ) . '</p></div>';
		}
	}

	public static function title_placeholders( $title, $post ) {
		if ( ! $post ) {
			return $title;
		}

		$map = array(
			'pooja'                => 'Pooja name, e.g. Ganapathi Homam',
			'product'              => 'Product name, e.g. Rudraksha Mala',
			'astrology_service'    => 'Service name, e.g. Jathakam',
			'religious_travel'     => 'Place name, e.g. Guruvayur Temple',
			'faq'                  => 'Question, e.g. How do online consultations work?',
			'testimonial'          => 'Customer name',
			'customer_enquiry'     => 'Customer name',
			'pooja_booking'        => 'Customer name — Pooja',
			'product_enquiry'      => 'Customer name — Product',
			'travel_booking'       => 'Customer name — Yatra',
			'website_registration' => 'Customer name',
			'consultation_booking' => 'Customer name — Service',
			'astrologer'           => 'Astrologer name, e.g. Sri Devadathan Namboothiri',
			'vendor'               => 'Temple name, e.g. Sri Mahaganapathi Temple',
		);

		return isset( $map[ $post->post_type ] ) ? $map[ $post->post_type ] : $title;
	}
}
