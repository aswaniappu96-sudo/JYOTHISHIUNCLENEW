<?php
/**
 * Spreadsheet-style client enquiries for WordPress admin.
 *
 * @package JyothishiUncleCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JU_Enquiry_Schedule {

	public static function hooks() {
		add_action( 'admin_menu', array( __CLASS__, 'menu' ) );
		add_action( 'admin_post_ju_save_enquiry_schedule', array( __CLASS__, 'save' ) );
		add_action( 'admin_post_ju_delete_enquiry_schedule', array( __CLASS__, 'delete' ) );
		add_action( 'admin_notices', array( __CLASS__, 'list_notice' ) );
	}

	public static function menu() {
		add_submenu_page(
			'edit.php?post_type=customer_enquiry',
			'Client enquiries (Excel)',
			'Client enquiries (Excel)',
			'edit_posts',
			'ju-enquiry-schedule',
			array( __CLASS__, 'render' )
		);
	}

	public static function list_notice() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return;
		}
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
		if ( ! $screen || 'customer_enquiry' !== $screen->post_type ) {
			return;
		}
		if ( ! in_array( $screen->base, array( 'edit', 'post' ), true ) ) {
			return;
		}
		$url = admin_url( 'edit.php?post_type=customer_enquiry&page=ju-enquiry-schedule' );
		echo '<div class="notice notice-info"><p><strong>Client enquiries:</strong> open the <a href="' . esc_url( $url ) . '">Excel-style sheet</a>. Website enquiry form submissions are saved here and emailed to the admin.</p></div>';
	}

	public static function render() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			wp_die( 'Not allowed' );
		}

		$updated = isset( $_GET['updated'] );
		$deleted = isset( $_GET['deleted'] );
		$error   = isset( $_GET['ju_error'] ) ? sanitize_text_field( (string) wp_unslash( $_GET['ju_error'] ) ) : '';
		$export  = wp_nonce_url( admin_url( 'admin-post.php?action=ju_export&type=enquiries' ), 'ju_export' );
		$rows    = self::rows();
		?>
		<div class="wrap ju-schedule-wrap">
			<h1>Client enquiries</h1>
			<p>This sheet is the live enquiry diary. A row is created when someone submits the website enquiry form. The admin also receives an email for each new client enquiry. Change the status after you reply, then Save.</p>

			<?php if ( $updated ) : ?>
				<div class="notice notice-success is-dismissible"><p>Client enquiries saved.</p></div>
			<?php endif; ?>
			<?php if ( $deleted ) : ?>
				<div class="notice notice-success is-dismissible"><p>Client enquiry deleted.</p></div>
			<?php endif; ?>
			<?php if ( $error ) : ?>
				<div class="notice notice-error"><p><?php echo esc_html( $error ); ?></p></div>
			<?php endif; ?>

			<p>
				<a class="button button-primary" href="<?php echo esc_url( $export ); ?>">Download CSV (Excel)</a>
				<a class="button" href="<?php echo esc_url( admin_url( 'edit.php?post_type=customer_enquiry' ) ); ?>">Open list view</a>
			</p>

			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="ju_save_enquiry_schedule" />
				<?php wp_nonce_field( 'ju_enquiry_schedule' ); ?>
				<p class="ju-schedule-save">
					<button type="submit" class="button button-primary button-hero">Save all changes</button>
				</p>
				<div class="ju-schedule-table-wrap">
					<table class="ju-schedule-table">
						<thead>
							<tr>
								<th>Received</th>
								<th>Name</th>
								<th>Phone</th>
								<th>Email</th>
								<th>Location</th>
								<th>Subject</th>
								<th>Source</th>
								<th>Message</th>
								<th>Status</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							<?php if ( ! $rows ) : ?>
								<tr>
									<td colspan="10">No client enquiries yet.</td>
								</tr>
							<?php endif; ?>
							<?php foreach ( $rows as $row ) : ?>
								<tr class="ju-schedule-row ju-status-<?php echo esc_attr( $row['status'] ); ?>">
									<td><?php echo esc_html( $row['received'] ); ?></td>
									<td>
										<input type="hidden" name="rows[<?php echo (int) $row['id']; ?>][id]" value="<?php echo (int) $row['id']; ?>" />
										<strong><?php echo esc_html( $row['name'] ); ?></strong>
									</td>
									<td><?php echo esc_html( $row['mobile'] ); ?></td>
									<td><?php echo esc_html( $row['email'] ); ?></td>
									<td><?php echo esc_html( $row['location'] ); ?></td>
									<td><?php echo esc_html( $row['subject'] ); ?></td>
									<td><?php echo esc_html( $row['source'] ); ?></td>
									<td class="ju-schedule-reason"><?php echo esc_html( $row['message'] ); ?></td>
									<td>
										<select name="rows[<?php echo (int) $row['id']; ?>][status]">
											<?php foreach ( self::status_choices() as $key => $label ) : ?>
												<option value="<?php echo esc_attr( $key ); ?>" <?php selected( $row['status'], $key ); ?>><?php echo esc_html( $label ); ?></option>
											<?php endforeach; ?>
										</select>
									</td>
									<td>
										<a class="button button-small button-link-delete" href="<?php echo esc_url( self::delete_url( $row['id'] ) ); ?>" onclick="return confirm('Delete this client enquiry?');">Delete</a>
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
		check_admin_referer( 'ju_enquiry_schedule' );

		$rows = isset( $_POST['rows'] ) && is_array( $_POST['rows'] ) ? wp_unslash( $_POST['rows'] ) : array();
		foreach ( $rows as $raw ) {
			self::save_row( is_array( $raw ) ? $raw : array() );
		}

		self::redirect( array( 'updated' => '1' ) );
	}

	public static function delete() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			wp_die( 'Not allowed' );
		}
		check_admin_referer( 'ju_delete_enquiry_schedule' );
		$id = isset( $_GET['id'] ) ? (int) $_GET['id'] : 0;
		if ( $id && 'customer_enquiry' === get_post_type( $id ) && current_user_can( 'delete_post', $id ) ) {
			wp_delete_post( $id, true );
		}
		self::redirect( array( 'deleted' => '1' ) );
	}

	private static function save_row( array $raw ) {
		$id = isset( $raw['id'] ) ? (int) $raw['id'] : 0;
		if ( ! $id || 'customer_enquiry' !== get_post_type( $id ) || ! current_user_can( 'edit_post', $id ) ) {
			return true;
		}

		$status = sanitize_key( isset( $raw['status'] ) ? (string) $raw['status'] : 'new' );
		if ( ! isset( self::status_choices()[ $status ] ) ) {
			$status = 'new';
		}

		JU_Availability::save_meta( $id, 'status', $status );
		return true;
	}

	private static function rows() {
		$query = new WP_Query(
			array(
				'post_type'      => 'customer_enquiry',
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
				'received' => get_post_time( 'Y-m-d H:i', false, $post ),
				'name'     => (string) JU_REST_Serialize::meta( $id, 'customer_name' ),
				'mobile'   => (string) JU_REST_Serialize::meta( $id, 'mobile' ),
				'email'    => (string) JU_REST_Serialize::meta( $id, 'email' ),
				'location' => (string) JU_REST_Serialize::meta( $id, 'location' ),
				'subject'  => (string) JU_REST_Serialize::meta( $id, 'subject' ),
				'source'   => (string) JU_REST_Serialize::meta( $id, 'source' ),
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
			'confirmed' => 'In progress',
			'completed' => 'Closed',
			'cancelled' => 'Cancelled',
		);
	}

	private static function delete_url( $id ) {
		return wp_nonce_url(
			admin_url( 'admin-post.php?action=ju_delete_enquiry_schedule&id=' . (int) $id ),
			'ju_delete_enquiry_schedule'
		);
	}

	private static function redirect( array $args ) {
		wp_safe_redirect(
			add_query_arg(
				$args,
				admin_url( 'edit.php?post_type=customer_enquiry&page=ju-enquiry-schedule' )
			)
		);
		exit;
	}
}
