<?php
/**
 * Spreadsheet-style consultation schedule for WordPress admin.
 *
 * @package JyothishiUncleCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JU_Consultation_Schedule {

	public static function hooks() {
		add_action( 'admin_menu', array( __CLASS__, 'menu' ) );
		add_action( 'admin_post_ju_save_consultation_schedule', array( __CLASS__, 'save' ) );
		add_action( 'admin_post_ju_delete_consultation_schedule', array( __CLASS__, 'delete' ) );
		add_action( 'admin_notices', array( __CLASS__, 'list_notice' ) );
	}

	public static function menu() {
		add_submenu_page(
			'edit.php?post_type=consultation_booking',
			'Schedule (Excel)',
			'Schedule (Excel)',
			'edit_posts',
			'ju-consultation-schedule',
			array( __CLASS__, 'render' )
		);
	}

	public static function list_notice() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return;
		}
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
		if ( ! $screen || 'consultation_booking' !== $screen->post_type ) {
			return;
		}
		if ( ! in_array( $screen->base, array( 'edit', 'post' ), true ) ) {
			return;
		}
		$url = admin_url( 'edit.php?post_type=consultation_booking&page=ju-consultation-schedule' );
		echo '<div class="notice notice-info"><p><strong>Schedule consultations:</strong> open the <a href="' . esc_url( $url ) . '">Excel-style schedule</a> to change the date or time, mark a meeting finished, or delete a row. Changing or finishing a booking unlocks the old date on the public calendar. Deleting a booking also frees that date.</p></div>';
	}

	public static function render() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			wp_die( 'Not allowed' );
		}

		$updated = isset( $_GET['updated'] );
		$deleted = isset( $_GET['deleted'] );
		$error   = isset( $_GET['ju_error'] ) ? sanitize_text_field( (string) wp_unslash( $_GET['ju_error'] ) ) : '';
		$export  = wp_nonce_url( admin_url( 'admin-post.php?action=ju_export&type=consultation_bookings' ), 'ju_export' );
		$rows    = self::rows();
		?>
		<div class="wrap ju-schedule-wrap">
			<h1>Schedule consultations</h1>
			<p>This sheet is the live consultation diary. A <strong>Scheduled</strong> date is locked on the public calendar. Change the date or time if the client needs another slot, then Save — the new date locks and the old date opens again. After the meeting, mark <strong>Meeting finished</strong> (kept here for reference) or Delete the row to free the date. The <strong>Astrologer</strong> column shows the chosen guide, or <strong>Consultation only</strong> for bookings made from the common calendar.</p>

			<?php if ( $updated ) : ?>
				<div class="notice notice-success is-dismissible"><p>Schedule saved. Locked dates on the public calendar now follow these rows.</p></div>
			<?php endif; ?>
			<?php if ( $deleted ) : ?>
				<div class="notice notice-success is-dismissible"><p>Booking deleted. That date is available again on the calendar.</p></div>
			<?php endif; ?>
			<?php if ( $error ) : ?>
				<div class="notice notice-error"><p><?php echo esc_html( $error ); ?></p></div>
			<?php endif; ?>

			<p>
				<a class="button button-primary" href="<?php echo esc_url( $export ); ?>">Download CSV (Excel)</a>
				<a class="button" href="<?php echo esc_url( admin_url( 'edit.php?post_type=consultation_booking' ) ); ?>">Open list view</a>
			</p>

			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="ju_save_consultation_schedule" />
				<?php wp_nonce_field( 'ju_consultation_schedule' ); ?>
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
								<th>Astrologer</th>
								<th>Preferred date</th>
								<th>Time</th>
								<th>Slot</th>
								<th>Reason</th>
								<th>Status</th>
								<th>Calendar</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							<?php if ( ! $rows ) : ?>
								<tr>
									<td colspan="12">No scheduled consultations yet.</td>
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
									<td><?php echo esc_html( $row['astrologer'] ); ?></td>
									<td>
										<input type="date" name="rows[<?php echo (int) $row['id']; ?>][booking_date]" value="<?php echo esc_attr( $row['booking_date'] ); ?>" required />
									</td>
									<td>
										<input type="time" name="rows[<?php echo (int) $row['id']; ?>][start_time]" value="<?php echo esc_attr( $row['start_time'] ); ?>" required />
									</td>
									<td>
										<?php if ( $row['slot_offer'] ) : ?>
											<strong><?php echo esc_html( $row['slot_offer'] ); ?></strong>
										<?php else : ?>
											—
										<?php endif; ?>
									</td>
									<td class="ju-schedule-reason"><?php echo esc_html( $row['message'] ); ?></td>
									<td>
										<select name="rows[<?php echo (int) $row['id']; ?>][status]">
											<?php foreach ( self::status_choices() as $key => $label ) : ?>
												<option value="<?php echo esc_attr( $key ); ?>" <?php selected( $row['status'], $key ); ?>><?php echo esc_html( $label ); ?></option>
											<?php endforeach; ?>
										</select>
									</td>
									<td><?php echo JU_Availability::locks_calendar( $row['status'] ) ? '<span class="ju-lock">Locked</span>' : '<span class="ju-open">Open</span>'; ?></td>
									<td>
										<a class="button button-small button-link-delete" href="<?php echo esc_url( self::delete_url( $row['id'] ) ); ?>" onclick="return confirm('Delete this booking? The date will become free on the calendar.');">Delete</a>
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
		check_admin_referer( 'ju_consultation_schedule' );

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
		check_admin_referer( 'ju_delete_consultation_schedule' );
		$id = isset( $_GET['id'] ) ? (int) $_GET['id'] : 0;
		if ( $id && 'consultation_booking' === get_post_type( $id ) && current_user_can( 'delete_post', $id ) ) {
			wp_delete_post( $id, true );
		}
		self::redirect( array( 'deleted' => '1' ) );
	}

	private static function save_row( array $raw ) {
		$id = isset( $raw['id'] ) ? (int) $raw['id'] : 0;
		if ( ! $id || 'consultation_booking' !== get_post_type( $id ) || ! current_user_can( 'edit_post', $id ) ) {
			return true;
		}

		$date = JU_Availability::normalize_date( isset( $raw['booking_date'] ) ? (string) $raw['booking_date'] : '' );
		if ( ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $date ) ) {
			return new WP_Error( 'ju_date', 'Please enter a valid date (YYYY-MM-DD).' );
		}

		$start = isset( $raw['start_time'] ) ? substr( sanitize_text_field( (string) $raw['start_time'] ), 0, 5 ) : '';
		if ( ! preg_match( '/^\d{2}:\d{2}$/', $start ) ) {
			return new WP_Error( 'ju_time', 'Please enter a valid time.' );
		}

		$status = sanitize_key( isset( $raw['status'] ) ? (string) $raw['status'] : 'new' );
		if ( ! isset( self::status_choices()[ $status ] ) ) {
			$status = 'new';
		}

		if ( JU_Availability::locks_calendar( $status ) && JU_Availability::date_is_taken( $date, $id ) ) {
			return new WP_Error( 'ju_taken', 'That date is already locked by another scheduled consultation. Choose a free date or mark the other meeting finished first.' );
		}

		$settings = JU_Settings::get();
		$timezone = new DateTimeZone( $settings['consultation_timezone'] ?: 'Asia/Kolkata' );
		$duration = max( 15, (int) $settings['consultation_slot_minutes'] );
		$start_dt = DateTimeImmutable::createFromFormat( 'Y-m-d H:i', $date . ' ' . $start, $timezone );
		$end      = $start_dt ? $start_dt->modify( '+' . $duration . ' minutes' )->format( 'H:i' ) : '';

		JU_Availability::save_meta( $id, 'booking_date', $date );
		JU_Availability::save_meta( $id, 'start_time', $start );
		JU_Availability::save_meta( $id, 'end_time', $end );
		JU_Availability::save_meta( $id, 'status', $status );

		$name  = (string) JU_REST_Serialize::meta( $id, 'customer_name' );
		$label = (string) JU_REST_Serialize::meta( $id, 'service_title', 'Consultation' );
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
				'post_type'      => 'consultation_booking',
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
				'id'           => $id,
				'name'         => (string) JU_REST_Serialize::meta( $id, 'customer_name' ),
				'mobile'       => (string) JU_REST_Serialize::meta( $id, 'mobile' ),
				'email'        => (string) JU_REST_Serialize::meta( $id, 'email' ),
				'location'     => (string) JU_REST_Serialize::meta( $id, 'location' ),
				'booking_date' => JU_Availability::normalize_date( (string) JU_REST_Serialize::meta( $id, 'booking_date' ) ),
				'start_time'   => substr( (string) JU_REST_Serialize::meta( $id, 'start_time' ), 0, 5 ),
				'slot_offer'   => (string) JU_REST_Serialize::meta( $id, 'slot_offer' ),
				'message'      => (string) JU_REST_Serialize::meta( $id, 'message' ),
				'astrologer'   => self::astrologer_label( (string) JU_REST_Serialize::meta( $id, 'astrologer_name' ) ),
				'status'       => $status ? $status : 'new',
			);
		}

		usort(
			$out,
			static function ( $a, $b ) {
				return strcmp( $a['booking_date'] . $a['start_time'], $b['booking_date'] . $b['start_time'] );
			}
		);

		return $out;
	}

	public static function astrologer_label( $value ) {
		$value = trim( (string) $value );
		return $value !== '' ? $value : 'Consultation only';
	}

	public static function status_choices() {
		return array(
			'new'       => 'Scheduled — date locked',
			'contacted' => 'Contacted — date locked',
			'confirmed' => 'Confirmed — date locked',
			'completed' => 'Meeting finished — date open',
			'cancelled' => 'Cancelled — date open',
		);
	}

	private static function delete_url( $id ) {
		return wp_nonce_url(
			admin_url( 'admin-post.php?action=ju_delete_consultation_schedule&id=' . (int) $id ),
			'ju_delete_consultation_schedule'
		);
	}

	private static function redirect( array $args ) {
		wp_safe_redirect(
			add_query_arg(
				$args,
				admin_url( 'edit.php?post_type=consultation_booking&page=ju-consultation-schedule' )
			)
		);
		exit;
	}
}
