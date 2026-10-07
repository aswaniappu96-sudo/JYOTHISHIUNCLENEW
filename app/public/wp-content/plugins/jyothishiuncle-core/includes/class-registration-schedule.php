<?php
/**
 * Spreadsheet-style website registrations for WordPress admin.
 *
 * @package JyothishiUncleCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JU_Registration_Schedule {

	public static function hooks() {
		add_action( 'admin_menu', array( __CLASS__, 'menu' ) );
		add_action( 'admin_init', array( __CLASS__, 'maybe_backfill' ) );
		add_action( 'admin_post_ju_save_registration_schedule', array( __CLASS__, 'save' ) );
		add_action( 'admin_post_ju_delete_registration_schedule', array( __CLASS__, 'delete' ) );
		add_action( 'admin_notices', array( __CLASS__, 'list_notice' ) );
	}

	public static function menu() {
		add_submenu_page(
			'edit.php?post_type=website_registration',
			'Registrations (Excel)',
			'Registrations (Excel)',
			'edit_posts',
			'ju-registration-schedule',
			array( __CLASS__, 'render' )
		);
	}

	public static function list_notice() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return;
		}
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
		if ( $screen && 'users' === $screen->id ) {
			$url = admin_url( 'edit.php?post_type=website_registration&page=ju-registration-schedule' );
			echo '<div class="notice notice-info"><p><strong>Website registrations:</strong> open <a href="' . esc_url( $url ) . '">Registrations → Registrations (Excel)</a>. New accounts from the website Register form are saved there.</p></div>';
			return;
		}
		if ( ! $screen || 'website_registration' !== $screen->post_type ) {
			return;
		}
		if ( ! in_array( $screen->base, array( 'edit', 'post' ), true ) ) {
			return;
		}
		$url = admin_url( 'edit.php?post_type=website_registration&page=ju-registration-schedule' );
		echo '<div class="notice notice-info"><p><strong>Website registrations:</strong> open the <a href="' . esc_url( $url ) . '">Excel-style sheet</a>. New accounts from the website Register form are saved here.</p></div>';
	}

	public static function render() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			wp_die( 'Not allowed' );
		}

		$updated = isset( $_GET['updated'] );
		$deleted = isset( $_GET['deleted'] );
		$error   = isset( $_GET['ju_error'] ) ? sanitize_text_field( (string) wp_unslash( $_GET['ju_error'] ) ) : '';
		$export  = wp_nonce_url( admin_url( 'admin-post.php?action=ju_export&type=registrations' ), 'ju_export' );
		$rows    = self::rows();
		?>
		<div class="wrap ju-schedule-wrap">
			<h1>Registrations</h1>
			<p>This sheet is a separate Excel diary for website registrations. A row is created when someone creates an account. It is not mixed with client enquiries. Change the status after you contact them, then Save. Download CSV to open the sheet in Excel.</p>

			<?php if ( $updated ) : ?>
				<div class="notice notice-success is-dismissible"><p>Registrations saved.</p></div>
			<?php endif; ?>
			<?php if ( $deleted ) : ?>
				<div class="notice notice-success is-dismissible"><p>Registration deleted.</p></div>
			<?php endif; ?>
			<?php if ( $error ) : ?>
				<div class="notice notice-error"><p><?php echo esc_html( $error ); ?></p></div>
			<?php endif; ?>

			<p>
				<a class="button button-primary" href="<?php echo esc_url( $export ); ?>">Download CSV (Excel)</a>
				<a class="button" href="<?php echo esc_url( admin_url( 'edit.php?post_type=website_registration' ) ); ?>">Open list view</a>
			</p>

			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="ju_save_registration_schedule" />
				<?php wp_nonce_field( 'ju_registration_schedule' ); ?>
				<p class="ju-schedule-save">
					<button type="submit" class="button button-primary button-hero">Save all changes</button>
				</p>
				<div class="ju-schedule-table-wrap">
					<table class="ju-schedule-table">
						<thead>
							<tr>
								<th>Registered</th>
								<th>Type</th>
								<th>Name</th>
								<th>Phone</th>
								<th>Email</th>
								<th>Location</th>
								<th>Experience</th>
								<th>Languages</th>
								<th>Specialties</th>
								<th>How they heard</th>
								<th>Message</th>
								<th>Status</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							<?php if ( ! $rows ) : ?>
								<tr>
									<td colspan="13">No website registrations yet.</td>
								</tr>
							<?php endif; ?>
							<?php foreach ( $rows as $row ) : ?>
								<tr class="ju-schedule-row ju-status-<?php echo esc_attr( $row['status'] ); ?>">
									<td><?php echo esc_html( $row['registered'] ); ?></td>
									<td><?php echo esc_html( 'astrologer' === $row['account_type'] ? 'Astrologer' : 'User' ); ?></td>
									<td>
										<input type="hidden" name="rows[<?php echo (int) $row['id']; ?>][id]" value="<?php echo (int) $row['id']; ?>" />
										<strong><?php echo esc_html( $row['name'] ); ?></strong>
									</td>
									<td><?php echo esc_html( $row['mobile'] ); ?></td>
									<td><?php echo esc_html( $row['email'] ); ?></td>
									<td><?php echo esc_html( $row['location'] ); ?></td>
									<td><?php echo esc_html( $row['experience'] ); ?></td>
									<td><?php echo esc_html( $row['languages'] ); ?></td>
									<td><?php echo esc_html( $row['specialties'] ); ?></td>
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
										<a class="button button-small button-link-delete" href="<?php echo esc_url( self::delete_url( $row['id'] ) ); ?>" onclick="return confirm('Delete this registration record?');">Delete</a>
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
		check_admin_referer( 'ju_registration_schedule' );

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
		check_admin_referer( 'ju_delete_registration_schedule' );
		$id = isset( $_GET['id'] ) ? (int) $_GET['id'] : 0;
		if ( $id && 'website_registration' === get_post_type( $id ) && current_user_can( 'delete_post', $id ) ) {
			wp_delete_post( $id, true );
		}
		self::redirect( array( 'deleted' => '1' ) );
	}

	public static function maybe_backfill() {
		if ( get_option( 'ju_reg_cpt_backfilled' ) ) {
			return;
		}
		if ( ! post_type_exists( 'website_registration' ) ) {
			return;
		}

		$known = array();
		$existing = new WP_Query(
			array(
				'post_type'      => 'website_registration',
				'post_status'    => 'any',
				'posts_per_page' => 2000,
				'fields'         => 'ids',
				'no_found_rows'  => true,
			)
		);
		foreach ( $existing->posts as $id ) {
			$email = strtolower( (string) JU_REST_Serialize::meta( $id, 'email' ) );
			$uid   = (int) JU_REST_Serialize::meta( $id, 'user_id' );
			if ( $email ) {
				$known[ $email ] = true;
			}
			if ( $uid ) {
				$known[ 'u' . $uid ] = true;
			}
		}

		$users = get_users(
			array(
				'role'   => 'customer',
				'number' => 2000,
			)
		);
		foreach ( $users as $user ) {
			$email = strtolower( (string) $user->user_email );
			if ( isset( $known[ $email ] ) || isset( $known[ 'u' . $user->ID ] ) ) {
				continue;
			}
			self::create_from_user( $user );
		}

		update_option( 'ju_reg_cpt_backfilled', 1, false );
	}

	private static function create_from_user( WP_User $user ) {
		$id = wp_insert_post(
			array(
				'post_type'   => 'website_registration',
				'post_status' => 'publish',
				'post_title'  => $user->display_name,
				'post_date'   => $user->user_registered,
			),
			true
		);
		if ( is_wp_error( $id ) ) {
			return;
		}

		$meta = array(
			'customer_name' => $user->display_name,
			'email'         => $user->user_email,
			'mobile'        => (string) get_user_meta( $user->ID, 'ju_mobile', true ),
			'location'      => (string) get_user_meta( $user->ID, 'ju_location', true ),
			'source'        => (string) get_user_meta( $user->ID, 'ju_source', true ),
			'message'       => (string) get_user_meta( $user->ID, 'ju_intro_message', true ),
			'account_type'  => (string) get_user_meta( $user->ID, 'ju_account_type', true ) ?: 'user',
			'experience'    => (string) get_user_meta( $user->ID, 'ju_experience', true ),
			'languages'     => (string) get_user_meta( $user->ID, 'ju_languages', true ),
			'specialties'   => (string) get_user_meta( $user->ID, 'ju_specialties', true ),
			'user_id'       => $user->ID,
			'status'        => (string) get_user_meta( $user->ID, 'ju_reg_status', true ) ?: 'new',
		);
		foreach ( $meta as $key => $value ) {
			JU_Availability::save_meta( $id, $key, $value );
		}
	}

	private static function save_row( array $raw ) {
		$id = isset( $raw['id'] ) ? (int) $raw['id'] : 0;
		if ( ! $id || 'website_registration' !== get_post_type( $id ) || ! current_user_can( 'edit_post', $id ) ) {
			return true;
		}

		$status = sanitize_key( isset( $raw['status'] ) ? (string) $raw['status'] : 'new' );
		if ( ! isset( self::status_choices()[ $status ] ) ) {
			$status = 'new';
		}

		JU_Availability::save_meta( $id, 'status', $status );

		$user_id = (int) JU_REST_Serialize::meta( $id, 'user_id' );
		if ( $user_id ) {
			update_user_meta( $user_id, 'ju_reg_status', $status );
		}

		return true;
	}

	private static function rows() {
		$query = new WP_Query(
			array(
				'post_type'      => 'website_registration',
				'post_status'    => array( 'publish', 'private' ),
				'posts_per_page' => 2000,
				'orderby'        => 'date',
				'order'          => 'DESC',
			)
		);

		$out = array();
		foreach ( $query->posts as $post ) {
			$id     = $post->ID;
			$status = (string) JU_REST_Serialize::meta( $id, 'status', 'new' );
			$out[]  = array(
				'id'         => $id,
				'registered' => get_post_time( 'Y-m-d H:i', false, $post ),
				'name'       => (string) JU_REST_Serialize::meta( $id, 'customer_name' ),
				'mobile'     => (string) JU_REST_Serialize::meta( $id, 'mobile' ),
				'email'      => (string) JU_REST_Serialize::meta( $id, 'email' ),
				'location'   => (string) JU_REST_Serialize::meta( $id, 'location' ),
				'source'     => (string) JU_REST_Serialize::meta( $id, 'source' ),
				'message'    => (string) JU_REST_Serialize::meta( $id, 'message' ),
				'account_type' => (string) JU_REST_Serialize::meta( $id, 'account_type', 'user' ),
				'experience'   => (string) JU_REST_Serialize::meta( $id, 'experience' ),
				'languages'    => (string) JU_REST_Serialize::meta( $id, 'languages' ),
				'specialties'  => (string) JU_REST_Serialize::meta( $id, 'specialties' ),
				'status'     => $status && isset( self::status_choices()[ $status ] ) ? $status : 'new',
			);
		}

		return $out;
	}

	public static function status_choices() {
		return array(
			'new'       => 'New',
			'contacted' => 'Contacted',
			'confirmed' => 'Active',
			'cancelled' => 'Inactive',
		);
	}

	private static function delete_url( $id ) {
		return wp_nonce_url(
			admin_url( 'admin-post.php?action=ju_delete_registration_schedule&id=' . (int) $id ),
			'ju_delete_registration_schedule'
		);
	}

	private static function redirect( array $args ) {
		wp_safe_redirect(
			add_query_arg(
				$args,
				admin_url( 'edit.php?post_type=website_registration&page=ju-registration-schedule' )
			)
		);
		exit;
	}
}
