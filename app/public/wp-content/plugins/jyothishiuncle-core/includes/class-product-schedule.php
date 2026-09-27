<?php
/**
 * Spreadsheet-style product bookings for WordPress admin.
 *
 * @package JyothishiUncleCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JU_Product_Schedule {

	public static function hooks() {
		add_action( 'admin_menu', array( __CLASS__, 'menu' ) );
		add_action( 'admin_post_ju_save_product_schedule', array( __CLASS__, 'save' ) );
		add_action( 'admin_post_ju_delete_product_schedule', array( __CLASS__, 'delete' ) );
		add_action( 'admin_notices', array( __CLASS__, 'list_notice' ) );
	}

	public static function menu() {
		add_submenu_page(
			'edit.php?post_type=product_enquiry',
			'Product bookings (Excel)',
			'Product bookings (Excel)',
			'edit_posts',
			'ju-product-schedule',
			array( __CLASS__, 'render' )
		);
	}

	public static function list_notice() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return;
		}
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
		if ( ! $screen || 'product_enquiry' !== $screen->post_type ) {
			return;
		}
		if ( ! in_array( $screen->base, array( 'edit', 'post' ), true ) ) {
			return;
		}
		$url = admin_url( 'edit.php?post_type=product_enquiry&page=ju-product-schedule' );
		echo '<div class="notice notice-info"><p><strong>Product bookings:</strong> open the <a href="' . esc_url( $url ) . '">Excel-style sheet</a> to change quantity or status. Bookings are saved here even if WhatsApp is not sent.</p></div>';
	}

	public static function render() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			wp_die( 'Not allowed' );
		}

		$updated = isset( $_GET['updated'] );
		$deleted = isset( $_GET['deleted'] );
		$error   = isset( $_GET['ju_error'] ) ? sanitize_text_field( (string) wp_unslash( $_GET['ju_error'] ) ) : '';
		$export  = wp_nonce_url( admin_url( 'admin-post.php?action=ju_export&type=product_enquiries' ), 'ju_export' );
		$rows    = self::rows();
		?>
		<div class="wrap ju-schedule-wrap">
			<h1>Product bookings</h1>
			<p>This sheet is the live product booking diary. A row is created when a family submits the website Buy form, whether or not they send the WhatsApp message. Change quantity or status, then Save.</p>

			<?php if ( $updated ) : ?>
				<div class="notice notice-success is-dismissible"><p>Product bookings saved.</p></div>
			<?php endif; ?>
			<?php if ( $deleted ) : ?>
				<div class="notice notice-success is-dismissible"><p>Product booking deleted.</p></div>
			<?php endif; ?>
			<?php if ( $error ) : ?>
				<div class="notice notice-error"><p><?php echo esc_html( $error ); ?></p></div>
			<?php endif; ?>

			<p>
				<a class="button button-primary" href="<?php echo esc_url( $export ); ?>">Download CSV (Excel)</a>
				<a class="button" href="<?php echo esc_url( admin_url( 'edit.php?post_type=product_enquiry' ) ); ?>">Open list view</a>
			</p>

			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="ju_save_product_schedule" />
				<?php wp_nonce_field( 'ju_product_schedule' ); ?>
				<p class="ju-schedule-save">
					<button type="submit" class="button button-primary button-hero">Save all changes</button>
				</p>
				<div class="ju-schedule-table-wrap">
					<table class="ju-schedule-table">
						<thead>
							<tr>
								<th>Name</th>
								<th>Phone</th>
								<th>Email</th>
								<th>Address</th>
								<th>Product</th>
								<th>Quantity</th>
								<th>Message</th>
								<th>Status</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							<?php if ( ! $rows ) : ?>
								<tr>
									<td colspan="9">No product bookings yet.</td>
								</tr>
							<?php endif; ?>
							<?php foreach ( $rows as $row ) : ?>
								<tr class="ju-schedule-row ju-status-<?php echo esc_attr( $row['status'] ); ?>">
									<td>
										<input type="hidden" name="rows[<?php echo (int) $row['id']; ?>][id]" value="<?php echo (int) $row['id']; ?>" />
										<strong><?php echo esc_html( $row['name'] ); ?></strong>
									</td>
									<td><?php echo esc_html( $row['mobile'] ); ?></td>
									<td><?php echo esc_html( $row['email'] ); ?></td>
									<td><?php echo esc_html( $row['location'] ); ?></td>
									<td><?php echo esc_html( $row['product'] ); ?></td>
									<td>
										<input type="number" min="1" name="rows[<?php echo (int) $row['id']; ?>][quantity]" value="<?php echo esc_attr( (string) $row['quantity'] ); ?>" />
									</td>
									<td class="ju-schedule-reason"><?php echo esc_html( $row['message'] ); ?></td>
									<td>
										<select name="rows[<?php echo (int) $row['id']; ?>][status]">
											<?php foreach ( self::status_choices() as $key => $label ) : ?>
												<option value="<?php echo esc_attr( $key ); ?>" <?php selected( $row['status'], $key ); ?>><?php echo esc_html( $label ); ?></option>
											<?php endforeach; ?>
										</select>
									</td>
									<td>
										<a class="button button-small button-link-delete" href="<?php echo esc_url( self::delete_url( $row['id'] ) ); ?>" onclick="return confirm('Delete this product booking?');">Delete</a>
									</td>
								</tr>
							<?php endforeach; ?>
						</tbody>
					</table>
				</div>
				<p class="ju-schedule-save">
					<button type="submit" class="button button-primary">Save all changes</button>
				</p>
			</form>
		</div>
		<?php
	}

	public static function save() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			wp_die( 'Not allowed' );
		}
		check_admin_referer( 'ju_product_schedule' );

		$rows = isset( $_POST['rows'] ) && is_array( $_POST['rows'] ) ? wp_unslash( $_POST['rows'] ) : array();
		foreach ( $rows as $raw ) {
			$result = self::save_row( is_array( $raw ) ? $raw : array() );
			if ( is_wp_error( $result ) ) {
				self::redirect( array( 'ju_error' => $result->get_error_message() ) );
			}
		}

		self::redirect( array( 'updated' => '1' ) );
	}

	public static function delete() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			wp_die( 'Not allowed' );
		}
		check_admin_referer( 'ju_delete_product_schedule' );
		$id = isset( $_GET['id'] ) ? (int) $_GET['id'] : 0;
		if ( $id && 'product_enquiry' === get_post_type( $id ) && current_user_can( 'delete_post', $id ) ) {
			wp_delete_post( $id, true );
		}
		self::redirect( array( 'deleted' => '1' ) );
	}

	private static function save_row( array $raw ) {
		$id = isset( $raw['id'] ) ? (int) $raw['id'] : 0;
		if ( ! $id || 'product_enquiry' !== get_post_type( $id ) || ! current_user_can( 'edit_post', $id ) ) {
			return true;
		}

		$qty = max( 1, (int) ( isset( $raw['quantity'] ) ? $raw['quantity'] : 1 ) );
		$status = sanitize_key( isset( $raw['status'] ) ? (string) $raw['status'] : 'new' );
		if ( ! isset( self::status_choices()[ $status ] ) ) {
			$status = 'new';
		}

		JU_Availability::save_meta( $id, 'quantity', $qty );
		JU_Availability::save_meta( $id, 'status', $status );

		$name  = (string) JU_REST_Serialize::meta( $id, 'customer_name' );
		$label = (string) JU_REST_Serialize::meta( $id, 'product_title', 'Product' );
		wp_update_post(
			array(
				'ID'         => $id,
				'post_title' => trim( $name . ' — ' . $label . ' × ' . $qty ),
			)
		);

		return true;
	}

	private static function rows() {
		$query = new WP_Query(
			array(
				'post_type'      => 'product_enquiry',
				'post_status'    => array( 'publish', 'private' ),
				'posts_per_page' => 500,
				'orderby'        => 'date',
				'order'          => 'DESC',
			)
		);

		$out = array();
		foreach ( $query->posts as $post ) {
			$id     = $post->ID;
			$status = (string) JU_REST_Serialize::meta( $id, 'status', 'new' );
			$out[]  = array(
				'id'       => $id,
				'name'     => (string) JU_REST_Serialize::meta( $id, 'customer_name' ),
				'mobile'   => (string) JU_REST_Serialize::meta( $id, 'mobile' ),
				'email'    => (string) JU_REST_Serialize::meta( $id, 'email' ),
				'location' => (string) JU_REST_Serialize::meta( $id, 'location' ),
				'product'  => (string) JU_REST_Serialize::meta( $id, 'product_title' ),
				'quantity' => max( 1, (int) JU_REST_Serialize::meta( $id, 'quantity', 1 ) ),
				'message'  => (string) JU_REST_Serialize::meta( $id, 'message' ),
				'status'   => $status ? $status : 'new',
			);
		}

		return $out;
	}

	public static function status_choices() {
		return array(
			'new'       => 'New',
			'contacted' => 'Contacted',
			'confirmed' => 'Confirmed',
			'completed' => 'Completed',
			'cancelled' => 'Cancelled',
		);
	}

	private static function delete_url( $id ) {
		return wp_nonce_url(
			admin_url( 'admin-post.php?action=ju_delete_product_schedule&id=' . (int) $id ),
			'ju_delete_product_schedule'
		);
	}

	private static function redirect( array $args ) {
		wp_safe_redirect(
			add_query_arg(
				$args,
				admin_url( 'edit.php?post_type=product_enquiry&page=ju-product-schedule' )
			)
		);
		exit;
	}
}
