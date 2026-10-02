<?php
/**
 * Installs replaceable sample content.
 *
 * @package JyothishiUncleCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JU_Sample_Content {

	const FLAG = 'ju_sample_content_installed';

	public static function notice() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		if ( isset( $_GET['ju_seeded'] ) ) {
			echo '<div class="notice notice-success is-dismissible"><p>Sample content added. Edit any item whenever you have the real text and photos.</p></div>';
			return;
		}

		if ( get_option( self::FLAG ) ) {
			return;
		}

		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
		if ( $screen && 'plugins' === $screen->id ) {
			return;
		}

		$url = wp_nonce_url( admin_url( 'admin-post.php?action=ju_install_sample_content' ), 'ju_install_sample_content' );
		echo '<div class="notice notice-info"><p><strong>JyothishiUncle:</strong> Sample poojas, products, travel, FAQs, and articles are ready to install. You can edit or replace all of this later. <a class="button button-primary" href="' . esc_url( $url ) . '">Add sample content</a></p></div>';
	}

	public static function handle_install() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( 'Not allowed' );
		}

		check_admin_referer( 'ju_install_sample_content' );
		self::install();
		wp_safe_redirect( admin_url( 'admin.php?page=ju-settings&ju_seeded=1' ) );
		exit;
	}

	public static function install() {
		if ( get_option( self::FLAG ) ) {
			return;
		}

		self::poojas();
		self::products();
		self::services();
		self::travel();
		self::faqs();
		self::testimonials();
		self::pages();
		self::articles();
		self::astrologers();
		self::vendors();
		self::ensure_contact_page();

		update_option( self::FLAG, 1 );
	}

	public static function maybe_seed_extras() {
		self::astrologers();
		self::vendors();
		self::pages();
		self::ensure_contact_page();
		self::services();
	}

	private static function poojas() {
		$items = array(
			array(
				'title'   => 'Ganapathi Homam',
				'slug'    => 'ganapathi-homam',
				'short'   => 'A traditional fire ritual to remove obstacles and begin new work with Lord Ganesha’s blessing.',
				'full'    => '<p>Ganapathi Homam is performed to invoke Lord Ganesha before new beginnings — home, business, travel, or family ceremonies.</p><p>The JyothishiUncle team guides the sankalpa and explains each step so the family can participate with clarity, whether the ritual is arranged locally or coordinated online.</p>',
				'benefits'=> '<ul><li>Removes obstacles before a new start</li><li>Brings calm and clarity</li><li>Suitable before other poojas</li></ul>',
				'reqs'    => '<ul><li>Name, nakshatra, and gotra if known</li><li>Preferred date</li><li>Location of the ritual</li></ul>',
				'wa'      => 'Hello, I am interested in Ganapathi Homam.',
				'order'   => 1,
			),
			array(
				'title'   => 'Navagraha Homam',
				'slug'    => 'navagraha-homam',
				'short'   => 'A homam for planetary balance, offered when the horoscope shows graha pressure.',
				'full'    => '<p>Navagraha Homam is performed to honour the nine grahas and seek balance during difficult dasa or transit periods.</p>',
				'benefits'=> '<ul><li>Supports planetary remedies</li><li>Often recommended with consultation</li></ul>',
				'reqs'    => '<ul><li>Birth details if a chart reading is needed</li><li>Preferred date</li></ul>',
				'wa'      => 'Hello, I am interested in Navagraha Homam.',
				'order'   => 2,
			),
			array(
				'title'   => 'Maha Mrityunjaya Homam',
				'slug'    => 'maha-mrityunjaya-homam',
				'short'   => 'A sacred homam for health, protection, and the well-being of loved ones.',
				'full'    => '<p>This homam is offered for recovery, protection, and peace. Families often request it during illness or after a difficult period.</p>',
				'benefits'=> '<ul><li>Prayer for health and protection</li><li>Comfort for the family</li></ul>',
				'reqs'    => '<ul><li>Name of the person for whom it is offered</li><li>Preferred date</li></ul>',
				'wa'      => 'Hello, I am interested in Maha Mrityunjaya Homam.',
				'order'   => 3,
			),
		);

		foreach ( $items as $item ) {
			self::create_post(
				'pooja',
				$item['title'],
				$item['slug'],
				$item['full'],
				array(
					'short_description'  => $item['short'],
					'full_description'   => $item['full'],
					'benefits'           => $item['benefits'],
					'requirements'       => $item['reqs'],
					'whatsapp_message'   => $item['wa'],
					'display_order'      => $item['order'],
					'booking_enabled'    => 1,
					'show_on_homepage'   => 1,
					'internal_fee_note'  => 'Discuss privately. Not shown on website.',
				)
			);
		}
	}

	private static function products() {
		$items = array(
			array(
				'title' => 'Five Mukhi Rudraksha Mala',
				'slug'  => 'five-mukhi-rudraksha-mala',
				'short' => 'A classic five-mukhi rudraksha mala for daily japa and quiet wearing.',
				'full'  => '<p>Five mukhi rudraksha is widely used for sadhana. Energising and wearing guidance can be shared after your enquiry.</p>',
				'info'  => '<p>Bead type: Five mukhi. Use: japa and daily wear. Availability confirmed on enquiry.</p>',
				'wa'    => 'Hello, I am interested in the Five Mukhi Rudraksha Mala.',
				'order' => 1,
			),
			array(
				'title' => 'Sandalwood Chandan',
				'slug'  => 'sandalwood-chandan',
				'short' => 'Pure sandal paste for puja, tilak, and temple use.',
				'full'  => '<p>Chandan is used in daily puja. Quantity and packing can be confirmed on WhatsApp.</p>',
				'info'  => '<p>Use: puja and tilak. Packed for travel where possible.</p>',
				'wa'    => 'Hello, I am interested in Sandalwood Chandan.',
				'order' => 2,
			),
			array(
				'title' => 'Sphatik Mala',
				'slug'  => 'sphatik-mala',
				'short' => 'A clear sphatik mala for mantra japa and calm focus.',
				'full'  => '<p>Sphatik is often chosen for mantra practice. Size and bead count can be confirmed before dispatch.</p>',
				'info'  => '<p>Material: sphatik. Use: japa.</p>',
				'wa'    => 'Hello, I am interested in the Sphatik Mala.',
				'order' => 3,
			),
		);

		foreach ( $items as $item ) {
			self::create_post(
				'product',
				$item['title'],
				$item['slug'],
				$item['full'],
				array(
					'short_description' => $item['short'],
					'full_description'  => $item['full'],
					'product_info'      => $item['info'],
					'availability'      => 'in_stock',
					'whatsapp_message'  => $item['wa'],
					'display_order'     => $item['order'],
					'show_on_homepage'  => 1,
					'internal_fee_note' => 'Discuss privately. Not shown on website.',
				)
			);
		}
	}

	private static function services() {
		$items = array(
			array(
				'title'    => 'Jathakam',
				'slug'     => 'jathakam',
				'short'    => 'Horoscope analysis',
				'full'     => '<p>Janma kundali reading covering dasa, strengths, and practical guidance. Share birth date, time, and place. The consultation is online.</p>',
				'wa'       => 'Hello, I would like to book a Jathakam (horoscope analysis) consultation.',
				'duration' => 45,
				'order'    => 1,
			),
			array(
				'title'    => 'Prasnam',
				'slug'     => 'prasnam',
				'short'    => 'Astrological predictions',
				'full'     => '<p>A focused question session for a decision, timing, or family matter. Useful when a full birth time is not available.</p>',
				'wa'       => 'Hello, I would like to book a Prasnam consultation.',
				'duration' => 30,
				'order'    => 2,
			),
			array(
				'title'    => 'Porutham',
				'slug'     => 'porutham',
				'short'    => 'Horoscope matching',
				'full'     => '<p>Porutham / guna matching with a clear explanation of the result. Birth details of both people are required.</p>',
				'wa'       => 'Hello, I would like to book Porutham (horoscope matching).',
				'duration' => 30,
				'order'    => 3,
			),
			array(
				'title'    => 'Ashtamangala Prasnam',
				'slug'     => 'ashtamangala-prasnam',
				'short'    => 'Thamboola & ashtamangala',
				'full'     => '<p>Traditional Ashtamangala and Thamboola prasnam for deeper clarity on family and dharmic questions.</p>',
				'wa'       => 'Hello, I would like to book Ashtamangala Prasnam.',
				'duration' => 45,
				'order'    => 4,
			),
			array(
				'title'    => 'Family guidance',
				'slug'     => 'family-guidance',
				'short'    => 'Finance, career & marriage',
				'full'     => '<p>Guidance for the household on finance, career, and marriage questions, with practical next steps.</p>',
				'wa'       => 'Hello, I would like family guidance on finance, career, or marriage.',
				'duration' => 30,
				'order'    => 5,
			),
			array(
				'title'    => 'Parihara remedies',
				'slug'     => 'parihara-remedies',
				'short'    => 'Planetary doshas & obstacles',
				'full'     => '<p>Remedial guidance for planetary doshas and obstacles. Mantra, homam, and dana notes are shared privately.</p>',
				'wa'       => 'Hello, I would like guidance on Parihara remedies.',
				'duration' => 30,
				'order'    => 6,
			),
		);

		foreach ( $items as $item ) {
			self::create_post(
				'astrology_service',
				$item['title'],
				$item['slug'],
				$item['full'],
				array(
					'short_description' => $item['short'],
					'full_description'  => $item['full'],
					'duration_minutes'  => $item['duration'],
					'booking_enabled'   => 1,
					'whatsapp_message'  => $item['wa'],
					'display_order'     => $item['order'],
					'internal_fee_note' => 'Discuss privately. Not shown on website.',
				)
			);
		}

		foreach ( array( 'birth-chart-reading', 'marriage-matching', 'prashna-consultation' ) as $old_slug ) {
			$old = get_page_by_path( $old_slug, OBJECT, 'astrology_service' );
			if ( $old ) {
				wp_trash_post( (int) $old->ID );
			}
		}
	}

	private static function travel() {
		$items = array(
			array(
				'title'    => 'Guruvayur Temple',
				'slug'     => 'guruvayur-temple',
				'location' => 'Guruvayur, India',
				'short'    => 'Guidance for darshan, timing, and family pooja at Guruvayur Sri Krishna Temple.',
				'full'     => '<p>Information for devotees travelling to Guruvayur — dress, darshan, and related poojas. This is guidance and coordination, not a packaged tour checkout.</p>',
				'info'     => '<p>Nearest airport: Kochi. Dress: traditional. Confirm festival dates before travel.</p>',
				'wa'       => 'Hello, I need guidance for Guruvayur Temple.',
				'order'    => 1,
			),
			array(
				'title'    => 'Sabarimala',
				'slug'     => 'sabarimala',
				'location' => 'Pathanamthitta, India',
				'short'    => 'Vratham, travel notes, and mandala season information for Sabarimala pilgrims.',
				'full'     => '<p>Sabarimala pilgrimage needs preparation. We share vratham notes and practical travel points. Confirm official opening dates each season.</p>',
				'info'     => '<p>Seasonal pilgrimage. Follow temple board rules for virtual queue and dress.</p>',
				'wa'       => 'Hello, I need guidance for Sabarimala.',
				'order'    => 2,
			),
			array(
				'title'    => 'Rameswaram',
				'slug'     => 'rameswaram',
				'location' => 'Ramanathapuram, Tamil Nadu, India',
				'short'    => 'Temple bath, darshan sequence, and family ritual notes for Rameswaram.',
				'full'     => '<p>Rameswaram is often combined with a South Indian temple journey. We share sequence and ritual notes for the family.</p>',
				'info'     => '<p>Plan extra time for theertham. Confirm opening hours locally.</p>',
				'wa'       => 'Hello, I need guidance for Rameswaram.',
				'order'    => 3,
			),
		);

		foreach ( $items as $item ) {
			self::create_post(
				'religious_travel',
				$item['title'],
				$item['slug'],
				$item['full'],
				array(
					'location'           => $item['location'],
					'short_description'  => $item['short'],
					'full_description'   => $item['full'],
					'travel_information' => $item['info'],
					'whatsapp_message'   => $item['wa'],
					'display_order'      => $item['order'],
					'show_on_homepage'   => 1,
				)
			);
		}
	}

	private static function faqs() {
		$items = array(
			array(
				'q' => 'Do I need to visit in person for a consultation?',
				'a' => '<p>No. The JyothishiUncle team consults devotees worldwide online through video consulting.</p>',
				'o' => 1,
			),
			array(
				'q' => 'Are prices shown on the website?',
				'a' => '<p>No. Fees are shared privately after your enquiry or booking request, according to the pooja or consultation.</p>',
				'o' => 2,
			),
			array(
				'q' => 'Can I book a pooja without creating an account?',
				'a' => '<p>Yes. You can continue without login, or register if you want to save your details for next time.</p>',
				'o' => 3,
			),
			array(
				'q' => 'What birth details are needed for astrology?',
				'a' => '<p>Date, time, and place of birth. If the time is unknown, a prashna consultation can still be arranged.</p>',
				'o' => 4,
			),
		);

		foreach ( $items as $item ) {
			self::create_post(
				'faq',
				$item['q'],
				sanitize_title( $item['q'] ),
				$item['a'],
				array( 'display_order' => $item['o'] )
			);
		}
	}

	private static function testimonials() {
		$items = array(
			array(
				'name'   => 'Lakshmi, Kochi',
				'review' => 'The consultation was clear and calm. We received the meeting link after confirmation and the guidance was practical for our family.',
				'order'  => 1,
			),
			array(
				'name'   => 'Arun, Kochi',
				'review' => 'We booked Ganapathi Homam online. Communication was simple on WhatsApp and the sankalpa was explained well.',
				'order'  => 2,
			),
			array(
				'name'   => 'Meera, Bengaluru',
				'review' => 'Marriage matching was explained without pressure. We knew what to do next after the session.',
				'order'  => 3,
			),
		);

		foreach ( $items as $item ) {
			self::create_post(
				'testimonial',
				$item['name'],
				sanitize_title( $item['name'] ),
				'',
				array(
					'review'        => $item['review'],
					'rating'        => 5,
					'display_order' => $item['order'],
				)
			);
		}
	}

	private static function pages() {
		$pages = array(
			array(
				'title'     => 'About Us',
				'slug'      => 'about',
				'content'   => '<p>JyothishiUncle is a spiritual services practice offering pooja, homam, astrology consultation, spiritual products, and temple travel guidance.</p><p>The team consults devotees anywhere through online meetings. Rituals and product enquiries are coordinated with care rather than through an automated checkout.</p>',
				'eyebrow'   => 'Guru-Shishya Parampara · Vedic Lineage',
				'hero_copy' => 'Deep in the celestial soils of ancient Bharat, wisdom descends like golden light. From Sage Parashara to the palm leaf Thaliola masters, our lineage is rooted in eternal cosmic mathematics.',
			),
			array(
				'title'     => 'Sacred Services & Divine Consecrations',
				'slug'      => 'services',
				'content'   => '<p>Pooja and product cards on this page come from the Poojas and Products menus. Edit this page for the heading, intro, and hero photo.</p>',
				'eyebrow'   => 'Vedic Tantric Shastra · Anushthana Protocols',
				'hero_copy' => 'Ancient Shastric Poojas, Vedic Homams & Consecrated Planetary Artifacts calibrated precisely to your individual birth Nakshatra, Dasha coordinates, and planetary afflictions.',
			),
			array(
				'title'     => 'Hereditary Vedic Astrologers & Cosmic Gurus',
				'slug'      => 'astrologers',
				'content'   => '<p>Astrologer cards come from the Astrologers menu. Edit this page for the heading, intro, and hero photo.</p>',
				'eyebrow'   => 'Parashara & Surya Siddhanta Lineage · Revered Jyothishis',
				'hero_copy' => 'Connect in sacred 1-on-1 communion with enlightened masters of Ashtamangala Prashnam, Jathaka Shastra, and Nadi palm leaf wisdom. Every consultation is strictly confidential and spiritually sanctified.',
			),
			array(
				'title'     => 'Sacred Temple Yatras & Himalayan Sanctuaries',
				'slug'      => 'religious-travel',
				'content'   => '<p>Travel destinations come from the Religious Travel menu. Edit this page for the heading, intro, and hero photo.</p>',
				'eyebrow'   => 'Tirtha Yatra · Consecrated pilgrimages',
				'hero_copy' => 'Immersive spiritual journeys led by consecrated Vedic scholars. Experience high-frequency temple vortices, private sanctum pujas, and planetary alignments at primordial sacred sites.',
			),
			array(
				'title'     => 'Reading for a quieter mind',
				'slug'      => 'articles',
				'content'   => '<p>Individual articles come from the Articles menu. Edit this page for the listing heading, intro, and hero photo.</p>',
				'eyebrow'   => 'Articles',
				'hero_copy' => 'Guidance on pooja, consultation, and temple journeys from JyothishiUncle.',
			),
			array(
				'title'     => 'Contact',
				'slug'      => 'contact',
				'content'   => '<p>Send an enquiry for pooja, consultation, products, or temple travel. The JyothishiUncle team replies by phone, WhatsApp, or email.</p>',
				'eyebrow'   => 'Sacred Portals & Ritual Access',
				'hero_copy' => 'High-fidelity sanctuary interfaces, authenticated seeker flows, auspicious Muhurtha calendars, and consecrated order mechanisms configured for celestial accuracy.',
			),
			array(
				'title'   => 'Privacy Policy',
				'slug'    => 'privacy-policy',
				'content' => '<p>This is sample privacy text. Replace it before the website goes live.</p><p>We collect name, email, mobile, location, and messages when you enquire or book. This information is used to respond to you and is not sold.</p>',
			),
			array(
				'title'   => 'Terms & Conditions',
				'slug'    => 'terms',
				'content' => '<p>This is sample terms text. Replace it before the website goes live.</p><p>Consultations are online. Bookings are requests until the JyothishiUncle team confirms the time and sends a meeting link. Fees are agreed privately.</p>',
			),
		);

		foreach ( $pages as $page ) {
			$existing = get_page_by_path( $page['slug'] );
			$id       = $existing ? (int) $existing->ID : 0;

			if ( ! $id ) {
				$id = (int) wp_insert_post(
				array(
					'post_title'   => $page['title'],
					'post_name'    => $page['slug'],
					'post_content' => $page['content'],
					'post_status'  => 'publish',
					'post_type'    => 'page',
				)
			);
			}

			if ( ! $id ) {
				continue;
			}

			if ( ! empty( $page['eyebrow'] ) && ! get_post_meta( $id, 'eyebrow', true ) ) {
				update_post_meta( $id, 'eyebrow', $page['eyebrow'] );
			}
			if ( ! empty( $page['hero_copy'] ) && ! get_post_meta( $id, 'hero_copy', true ) ) {
				update_post_meta( $id, 'hero_copy', $page['hero_copy'] );
			}
		}
	}

	private static function articles() {
		$posts = array(
			array(
				'title'   => 'How to prepare for an online astrology consultation',
				'slug'    => 'prepare-online-astrology-consultation',
				'excerpt' => 'Birth details, questions, and a quiet place — a simple way to get more from the session.',
				'content' => '<p>Keep birth date, time, and place ready. Write two or three questions. Join from a quiet room. Your meeting time is confirmed in your local time.</p>',
			),
			array(
				'title'   => 'When families choose Ganapathi Homam',
				'slug'    => 'when-families-choose-ganapathi-homam',
				'excerpt' => 'New home, new work, or a fresh beginning — why this homam is often first.',
				'content' => '<p>Ganapathi Homam is often the first ritual before other ceremonies. Share the purpose and preferred date when you enquire. This article is sample content and can be rewritten in your own words.</p>',
			),
		);

		foreach ( $posts as $post ) {
			if ( get_page_by_path( $post['slug'], OBJECT, 'post' ) ) {
				continue;
			}

			wp_insert_post(
				array(
					'post_title'   => $post['title'],
					'post_name'    => $post['slug'],
					'post_excerpt' => $post['excerpt'],
					'post_content' => $post['content'],
					'post_status'  => 'publish',
					'post_type'    => 'post',
				)
			);
		}
	}

	private static function create_post( $type, $title, $slug, $content, $meta ) {
		$existing = get_page_by_path( $slug, OBJECT, $type );
		if ( $existing ) {
			return (int) $existing->ID;
		}

		$id = wp_insert_post(
			array(
				'post_title'   => $title,
				'post_name'    => $slug,
				'post_content' => $content,
				'post_status'  => 'publish',
				'post_type'    => $type,
			)
		);

		if ( is_wp_error( $id ) || ! $id ) {
			return 0;
		}

		foreach ( $meta as $key => $value ) {
			if ( function_exists( 'update_field' ) ) {
				update_field( $key, $value, $id );
			} else {
				update_post_meta( $id, $key, $value );
			}
		}

		return (int) $id;
	}

	private static function astrologers() {
		$items = array(
			array(
				'title'     => 'Sri Devadathan Namboothiri',
				'slug'      => 'sri-devadathan-namboothiri',
				'specialty' => 'Vedic Jyothisha · Jathaka',
				'location'  => 'Thrissur',
				'short'     => 'Hereditary Vedic jyothisha for birth-chart reading and family sankalpa.',
				'full'      => '<p>Sri Devadathan Namboothiri continues a gurukula lineage of Vedic jyothisha. Sessions cover jathaka, dasha timing, and practical remedies for the household.</p>',
				'gift'      => 'First call and chat are free.',
				'order'     => 1,
			),
			array(
				'title'     => 'Pandit Radhakrishnan Shastri',
				'slug'      => 'pandit-radhakrishnan-shastri',
				'specialty' => 'Marriage matching · Muhurta',
				'location'  => 'Varanasi, Uttar Pradesh',
				'short'     => 'Marriage matching, muhurta, and family ritual timing with clear next steps.',
				'full'      => '<p>Pandit Radhakrishnan Shastri guides marriage matching and auspicious timing. Guidance is explained without pressure, so the family knows what to do next.</p>',
				'gift'      => 'First call and chat are free.',
				'order'     => 2,
			),
			array(
				'title'     => 'Vidushi Gayatri Devi',
				'slug'      => 'vidushi-gayatri-devi',
				'specialty' => 'Prashna · Women’s guidance',
				'location'  => 'Rameswaram, Tamil Nadu',
				'short'     => 'Prashna consultation and calm guidance for women and family questions.',
				'full'      => '<p>Vidushi Gayatri Devi offers prashna and natal guidance with particular care for women’s questions, family harmony, and spiritual practice.</p>',
				'gift'      => 'First call and chat are free.',
				'order'     => 3,
			),
			array(
				'title'     => 'Acharya Shankaranarayana Bhat',
				'slug'      => 'acharya-shankaranarayana-bhat',
				'specialty' => 'Temple ritual · Nadi notes',
				'location'  => 'Ujjain, Madhya Pradesh',
				'short'     => 'Temple ritual sequencing and nadi notes for devotees travelling worldwide.',
				'full'      => '<p>Acharya Shankaranarayana Bhat advises on temple ritual sequence and nadi notes, coordinating remote sankalpa for families worldwide.</p>',
				'gift'      => 'First call and chat are free.',
				'order'     => 4,
			),
		);

		foreach ( $items as $item ) {
			self::create_post(
				'astrologer',
				$item['title'],
				$item['slug'],
				$item['full'],
				array(
					'specialty'          => $item['specialty'],
					'location'           => $item['location'],
					'short_description'  => $item['short'],
					'full_description'   => $item['full'],
					'first_session_note' => $item['gift'],
					'display_order'      => $item['order'],
					'show_on_homepage'   => 0,
				)
			);
		}
	}

	private static function vendors() {
		$items = array(
			array(
				'title'    => 'Sri Mahaganapathi Temple',
				'slug'     => 'sri-mahaganapathi-temple',
				'location' => 'Udupi',
				'short'    => 'A pooja temple for Ganapathi and family poojas, arranged online or offline through JyothishiUncle.',
				'full'     => '<p>Poojas can be offered here when the family prefers this temple. Date and sankalpa are confirmed privately.</p>',
				'order'    => 1,
			),
			array(
				'title'    => 'Sri Mahavishnu Temple',
				'slug'     => 'sri-mahavishnu-temple',
				'location' => 'Tirupati',
				'short'    => 'A pooja temple for Vishnu-related poojas and family sankalpa, online or offline.',
				'full'     => '<p>This temple can host the pooja when chosen on the booking form. Timing is confirmed after your request.</p>',
				'order'    => 2,
			),
			array(
				'title'    => 'Sri Mahadeva Temple',
				'slug'     => 'sri-mahadeva-temple',
				'location' => 'Varanasi',
				'short'    => 'A pooja temple for Shiva-related poojas and homam arrangements, online or offline.',
				'full'     => '<p>Choose this temple from the pooja form. Dakshina and schedule are shared privately.</p>',
				'order'    => 3,
			),
		);

		foreach ( $items as $item ) {
			self::create_post(
				'vendor',
				$item['title'],
				$item['slug'],
				$item['full'],
				array(
					'location'          => $item['location'],
					'short_description' => $item['short'],
					'full_description'  => $item['full'],
					'display_order'     => $item['order'],
				)
			);
		}
	}

	private static function ensure_contact_page() {
		if ( get_page_by_path( 'contact' ) ) {
			return;
		}

		wp_insert_post(
			array(
				'post_title'   => 'Contact',
				'post_name'    => 'contact',
				'post_content' => '<p>Send an enquiry for pooja, consultation, products, or temple travel. The JyothishiUncle team replies by phone, WhatsApp, or email.</p>',
				'post_status'  => 'publish',
				'post_type'    => 'page',
			)
		);
	}
}
