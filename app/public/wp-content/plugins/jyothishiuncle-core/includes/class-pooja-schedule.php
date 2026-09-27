<?php
/**
 * Spreadsheet-style pooja bookings for WordPress admin.
 *
 * @package JyothishiUncleCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JU_Pooja_Schedule {

	public static function hooks() {
		add_action( 'admin_menu', array( __CLASS__, 'menu' ) );
		add_action( 'admin_post_ju_save_pooja_schedule', array( __CLASS__, 'save' ) );
		add_action( 'admin_post_ju_delete_pooja_schedule', array( __CLASS__, 'delete' ) );
		add_action( 'admin_notices', array( __CLASS__, 'list_notice' ) );
	}

	public static function menu() {
		add_submenu_page(
			'edit.php?post_type=pooja_booking',
			'Pooja bookings (Excel)',
			'Pooja bookings (Excel)',
			'edit_posts',
			'ju-pooja-schedule',
			array( __CLASS__, 'render' )
		);
	}

	public static function list_notice() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return;
		}
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
		if ( ! $screen || 'pooja_booking' !== $screen->post_type ) {
			return;
		}
		if ( ! in_array( $screen->base, array( 'edit', 'post' ), true ) ) {
			return;
		}
		$url = admin_url( 'edit.php?post_type=pooja_booking&page=ju-pooja-schedule' );
		echo '<div class="notice notice-info"><p><strong>Pooja bookings:</strong> open the <a href="' . esc_url( $url ) . '">Excel-style sheet</a> to change the date, mode, pooja temple, or status. Bookings are saved here even if WhatsApp is not sent.</p></div>';
	}

	public static function render() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			wp_die( 'Not allowed' );
		}

		$updated = isset( $_GET['updated'] );
		$deleted = isset( $_GET['deleted'] );
		$error   = isset( $_GET['ju_error'] ) ? sanitize_text_field( (string) wp_unslash( $_GET['ju_error'] ) ) : '';
		$export  = wp_nonce_url( admin_url( 'admin-post.php?action=ju_export&type=pooja_bookings' ), 'ju_export' );
		$rows    = self::rows();
		?>
		<div class="wrap ju-schedule-wrap">
			<h1>Pooja bookings</h1>
			<p>This sheet is the live pooja booking diary. A row is created when a family submits the website form, whether or not they send the WhatsApp message. Change the date, online/offline mode, pooja temple, or status, then Save.</p>

			<?php if ( $updated ) : ?>
				<div class="notice notice-success is-dismissible"><p>Pooja bookings saved.</p></div>
			<?php endif; ?>
			<?php if ( $deleted ) : ?>
				<div class="notice notice-success is-dismissible"><p>Pooja booking deleted.</p></div>
			<?php endif; ?>
			<?php if ( $error ) : ?>
				<div class="notice notice-error"><p><?php echo esc_html( $error ); ?></p></div>
			<?php endif; ?>

			<p>
				<a class="button button-primary" href="<?php echo esc_url( $export ); ?>">Download CSV (Excel)</a>
				<a class="button" href="<?php echo esc_url( admin_url( 'edit.php?post_type=pooja_booking' ) ); ?>">Open list view</a>
			</p>

			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="ju_save_pooja_schedule" />
				<?php wp_nonce_field( 'ju_pooja_schedule' ); ?>
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
								<th>Pooja</th>
								<th>Mode</th>
								<th>Pooja temple</th>
								<th>Preferred date</th>
								<th>Sankalpa</th>
								<th>Status</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							<?php if ( ! $rows ) : ?>
								<tr>
									<td colspan="11">No pooja bookings yet.</td>
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
									<td><?php echo esc_html( $row['pooja'] ); ?></td>
									<td>
										<select name="rows[<?php echo (int) $row['id']; ?>][offering_mode]">
											<option value="online" <?php selected( $row['offering_mode'], 'online' ); ?>>Online</option>
											<option value="offline" <?php selected( $row['offering_mode'], 'offline' ); ?>>Offline</option>
										</select>
									</td>
									<td>
										<input type="text" name="rows[<?php echo (int) $row['id']; ?>][vendor_name]" value="<?php echo esc_attr( $row['vendor'] ); ?>" />
									</td>
									<td>
										<input type="date" name="rows[<?php echo (int) $row['id']; ?>][preferred_date]" value="<?php echo esc_attr( $row['preferred_date'] ); ?>" required />
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
										<a class="button button-small button-link-delete" href="<?php echo esc_url( self::delete_url( $row['id'] ) ); ?>" onclick="return confirm('Delete this pooja booking?');">Delete</a>
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
		check_admin_referer( 'ju_pooja_schedule' );

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
		check_admin_referer( 'ju_delete_pooja_schedule' );
		$id = isset( $_GET['id'] ) ? (int) $_GET['id'] : 0;
		if ( $id && 'pooja_booking' === get_post_type( $id ) && current_user_can( 'delete_post', $id ) ) {
			wp_delete_post( $id, true );
		}
		self::redirect( array( 'deleted' => '1' ) );
	}

	private static function save_row( array $raw ) {
		$id = isset( $raw['id'] ) ? (int) $raw['id'] : 0;
		if ( ! $id || 'pooja_booking' !== get_post_type( $id ) || ! current_user_can( 'edit_post', $id ) ) {
			return true;
		}

		$date = JU_Availability::normalize_date( isset( $raw['preferred_date'] ) ? (string) $raw['preferred_date'] : '' );
		if ( ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $date ) ) {
			return new WP_Error( 'ju_date', 'Please enter a valid preferred date (YYYY-MM-DD).' );
		}

		$mode = sanitize_key( isset( $raw['offering_mode'] ) ? (string) $raw['offering_mode'] : 'online' );
		if ( ! in_array( $mode, array( 'online', 'offline' ), true ) ) {
			$mode = 'online';
		}

		$vendor = sanitize_text_field( isset( $raw['vendor_name'] ) ? (string) $raw['vendor_name'] : '' );

		$status = sanitize_key( isset( $raw['status'] ) ? (string) $raw['status'] : 'new' );
		if ( ! isset( self::status_choices()[ $status ] ) ) {
			$status = 'new';
		}

		JU_Availability::save_meta( $id, 'preferred_date', $date );
		JU_Availability::save_meta( $id, 'offering_mode', $mode );
		JU_Availability::save_meta( $id, 'vendor_name', $vendor );
		JU_Availability::save_meta( $id, 'status', $status );

		$name  = (string) JU_REST_Serialize::meta( $id, 'customer_name' );
		$label = (string) JU_REST_Serialize::meta( $id, 'pooja_title', 'Pooja' );
		wp_update_post(
			array(
				'ID'         => $id,
				'post_title' => trim( $name . ' — ' . $label . ' · ' . $date ),
			)
		);

		return true;
	}

	private static function rows() {
		$query = new WP_Query(
			array(
				'post_type'      => 'pooja_booking',
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
			$mode   = (string) JU_REST_Serialize::meta( $id, 'offering_mode', 'online' );
			$out[]  = array(
				'id'             => $id,
				'name'           => (string) JU_REST_Serialize::meta( $id, 'customer_name' ),
				'mobile'         => (string) JU_REST_Serialize::meta( $id, 'mobile' ),
				'email'          => (string) JU_REST_Serialize::meta( $id, 'email' ),
				'location'       => (string) JU_REST_Serialize::meta( $id, 'location' ),
				'pooja'          => (string) JU_REST_Serialize::meta( $id, 'pooja_title' ),
				'offering_mode'  => in_array( $mode, array( 'online', 'offline' ), true ) ? $mode : 'online',
				'vendor'         => (string) JU_REST_Serialize::meta( $id, 'vendor_name' ),
				'preferred_date' => JU_Availability::normalize_date( (string) JU_REST_Serialize::meta( $id, 'preferred_date' ) ),
				'message'        => (string) JU_REST_Serialize::meta( $id, 'message' ),
				'status'         => $status ? $status : 'new',
			);
		}

		usort(
			$out,
			static function ( $a, $b ) {
				return strcmp( $b['preferred_date'] . $b['name'], $a['preferred_date'] . $a['name'] );
			}
		);

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
			admin_url( 'admin-post.php?action=ju_delete_pooja_schedule&id=' . (int) $id ),
			'ju_delete_pooja_schedule'
		);
	}

	private static function redirect( array $args ) {
		wp_safe_redirect(
			add_query_arg(
				$args,
				admin_url( 'edit.php?post_type=pooja_booking&page=ju-pooja-schedule' )
			)
		);
		exit;
	}
}
