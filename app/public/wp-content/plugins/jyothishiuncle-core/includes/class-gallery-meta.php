<?php
/**
 * Multi-image gallery metabox (ACF Gallery is Pro-only).
 *
 * @package JyothishiUncleCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JU_Gallery_Meta {

	const META_KEY = 'ju_gallery_ids';

	private static function post_types() {
		return array( 'pooja', 'product', 'religious_travel' );
	}

	public static function boxes() {
		foreach ( self::post_types() as $type ) {
			add_meta_box(
				'ju_gallery',
				'Photo gallery',
				array( __CLASS__, 'render' ),
				$type,
				'normal',
				'default'
			);
		}
	}

	public static function assets( $hook ) {
		if ( ! in_array( $hook, array( 'post.php', 'post-new.php' ), true ) ) {
			return;
		}

		$screen = get_current_screen();
		if ( ! $screen || ! in_array( $screen->post_type, self::post_types(), true ) ) {
			return;
		}

		wp_enqueue_media();
		wp_enqueue_script(
			'ju-gallery',
			JU_CORE_URL . 'assets/admin-gallery.js',
			array( 'jquery' ),
			JU_CORE_VERSION,
			true
		);
	}

	public static function render( $post ) {
		wp_nonce_field( 'ju_gallery_save', 'ju_gallery_nonce' );
		$ids = self::get_ids( $post->ID );
		?>
		<p>Add extra photos for this item. The featured image (right sidebar) is the main photo. These gallery photos appear on the detail page.</p>
		<div id="ju-gallery-app" class="ju-gallery">
			<ul class="ju-gallery-list">
				<?php foreach ( $ids as $id ) : ?>
					<li data-id="<?php echo esc_attr( $id ); ?>">
						<?php echo wp_get_attachment_image( $id, 'thumbnail' ); ?>
						<button type="button" class="button-link ju-gallery-remove">Remove</button>
					</li>
				<?php endforeach; ?>
			</ul>
			<input type="hidden" name="ju_gallery_ids" id="ju_gallery_ids" value="<?php echo esc_attr( implode( ',', $ids ) ); ?>">
			<button type="button" class="button" id="ju-gallery-add">Add photos</button>
		</div>
		<?php
	}

	public static function save( $post_id ) {
		if ( ! isset( $_POST['ju_gallery_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['ju_gallery_nonce'] ) ), 'ju_gallery_save' ) ) {
			return;
		}

		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}

		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		$raw = isset( $_POST['ju_gallery_ids'] ) ? sanitize_text_field( wp_unslash( $_POST['ju_gallery_ids'] ) ) : '';
		$ids = array_filter( array_map( 'absint', explode( ',', $raw ) ) );
		update_post_meta( $post_id, self::META_KEY, array_values( $ids ) );
	}

	public static function get_ids( $post_id ) {
		$ids = get_post_meta( $post_id, self::META_KEY, true );
		if ( ! is_array( $ids ) ) {
			$ids = array_filter( array_map( 'absint', explode( ',', (string) $ids ) ) );
		}

		return array_values( array_filter( $ids ) );
	}
}
