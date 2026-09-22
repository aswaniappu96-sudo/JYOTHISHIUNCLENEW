<?php
/**
 * Plugin Name: JyothishiUncle Core
 * Description: Custom post types, site settings, galleries, and sample content for the JyothishiUncle headless website. The public site is Next.js — do not install a page-builder theme.
 * Version: 0.5.1
 * Author: JyothishiUncle
 * Requires at least: 6.4
 * Requires PHP: 8.1
 * Text Domain: jyothishiuncle-core
 *
 * @package JyothishiUncleCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'JU_CORE_VERSION', '0.5.1' );
define( 'JU_CORE_FILE', __FILE__ );
define( 'JU_CORE_DIR', plugin_dir_path( __FILE__ ) );
define( 'JU_CORE_URL', plugin_dir_url( __FILE__ ) );

require_once JU_CORE_DIR . 'includes/class-roles.php';
require_once JU_CORE_DIR . 'includes/class-post-types.php';
require_once JU_CORE_DIR . 'includes/class-settings.php';
require_once JU_CORE_DIR . 'includes/class-acf-fields.php';
require_once JU_CORE_DIR . 'includes/class-gallery-meta.php';
require_once JU_CORE_DIR . 'includes/class-admin.php';
require_once JU_CORE_DIR . 'includes/class-sample-content.php';
require_once JU_CORE_DIR . 'includes/class-rest-serialize.php';
require_once JU_CORE_DIR . 'includes/class-availability.php';
require_once JU_CORE_DIR . 'includes/class-rest.php';
require_once JU_CORE_DIR . 'includes/class-jwt.php';
require_once JU_CORE_DIR . 'includes/class-mail.php';
require_once JU_CORE_DIR . 'includes/class-submissions.php';
require_once JU_CORE_DIR . 'includes/class-export.php';
require_once JU_CORE_DIR . 'includes/class-admin-lists.php';

register_activation_hook( JU_CORE_FILE, 'ju_core_activate' );
register_deactivation_hook( JU_CORE_FILE, 'ju_core_deactivate' );

/**
 * Plugin activation.
 */
function ju_core_activate() {
	JU_Roles::register();
	JU_Post_Types::register();
	JU_Settings::seed_defaults();
	JU_JWT::secret();
	flush_rewrite_rules();
}

/**
 * Plugin deactivation.
 */
function ju_core_deactivate() {
	flush_rewrite_rules();
}

add_action( 'init', array( 'JU_Roles', 'register' ) );
add_action( 'init', array( 'JU_Post_Types', 'register' ) );
add_action( 'init', array( 'JU_Post_Types', 'relabel_articles' ) );
add_action( 'init', array( 'JU_Sample_Content', 'maybe_seed_extras' ), 30 );
add_action( 'acf/init', array( 'JU_ACF_Fields', 'register' ) );
add_action( 'after_setup_theme', array( 'JU_Admin', 'theme_supports' ) );
add_action( 'wp_dashboard_setup', array( 'JU_Admin', 'dashboard_widget' ) );
add_action( 'admin_init', array( 'JU_Settings', 'register' ) );
add_action( 'admin_menu', array( 'JU_Settings', 'menu' ) );
add_action( 'admin_init', array( 'JU_Settings', 'redirect_page_shortcuts' ) );
add_action( 'admin_enqueue_scripts', array( 'JU_Settings', 'assets' ) );
add_action( 'admin_menu', array( 'JU_Admin', 'adjust_menus' ), 99 );
add_action( 'admin_enqueue_scripts', array( 'JU_Admin', 'assets' ) );
add_action( 'admin_enqueue_scripts', array( 'JU_Gallery_Meta', 'assets' ) );
add_action( 'add_meta_boxes', array( 'JU_Gallery_Meta', 'boxes' ) );
add_action( 'save_post', array( 'JU_Gallery_Meta', 'save' ) );
add_action( 'admin_notices', array( 'JU_Admin', 'acf_notice' ) );
add_action( 'admin_notices', array( 'JU_Sample_Content', 'notice' ) );
add_action( 'admin_post_ju_install_sample_content', array( 'JU_Sample_Content', 'handle_install' ) );
add_filter( 'enter_title_here', array( 'JU_Admin', 'title_placeholders' ), 10, 2 );
add_action( 'admin_notices', array( 'JU_Admin', 'smtp_notice' ) );
add_action( 'admin_notices', array( 'JU_Admin', 'content_guide' ) );

JU_REST::hooks();
JU_Export::hooks();
JU_Admin_Lists::hooks();
