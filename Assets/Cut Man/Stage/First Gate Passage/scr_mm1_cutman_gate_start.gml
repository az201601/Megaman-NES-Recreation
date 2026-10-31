// Camera context; share existing shot/charge/rearm ownership, not a new player controller.
if (route_busy || !route_lists_ready || !instance_exists(camera_player)) exit;
route_gate = instance_nearest(2272, 816, obj_mm1_cutman_boss_gate);
if (!instance_exists(route_gate)) exit;
if (route_gate.x != 2272 || route_gate.y != 816) exit;
route_start_version = 0;
scr_mm1_cutman_scroll_start(0);
if (route_start_version != 1201)
    show_error("Cut Man gate script mismatch: replace the ENTIRE scr_mm1_cutman_scroll_start with the First Gate Passage version, then restart.", true);
route_gate_mode = true;
route_target_section = 12;
route_unlock = 153;
// Snap only the quarter-pixel native gate-entry phase; floor adapts MM5 feet reference.
route_entry_x = 2264.25;
route_entry_y = 880 - camera_player.feet_offset;
route_was_ladder = false;
route_fall_speed = 0;
camera_player.x = route_entry_x;
camera_player.y = route_entry_y;
camera_player.fall_speed = 0;
camera_player.grounded = true;
camera_player.image_xscale = 1;
camera_player.anim_walk_frame = 0;
camera_player.anim_walk_timer = 0;
camera_player.sprite_index = spr_mm5_megaman_walk;
camera_player.image_index = 0;
camera_player.image_speed = 0;
view_xview[0] = 2048;
view_yview[0] = 720;
