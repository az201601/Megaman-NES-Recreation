// Camera context; share existing shot/charge/rearm ownership, not a new player controller.
if (route_busy || !route_lists_ready || !instance_exists(camera_player)) exit;
var gate_x;
route_gate_second = (route_section == 12);
gate_x = 2272;
if (route_gate_second) gate_x = 3056;
route_gate_origin_x = gate_x - 224;
if (route_gate_second) route_gate_origin_x = 2816;
route_gate = instance_nearest(gate_x, 816, obj_mm1_cutman_boss_gate);
if (!instance_exists(route_gate)) exit;
if (route_gate.x != gate_x || route_gate.y != 816) exit;
route_start_version = 0;
scr_mm1_cutman_scroll_start(0);
if (route_start_version != 1301)
    show_error("Cut Man gate script mismatch: replace the ENTIRE scr_mm1_cutman_scroll_start with the Second Gate Passage version, then restart.", true);
// MM5-style immediate response; retain adapted MM1 four-strip artwork/cadence.
route_gate_voice = audio_play_sound(snd_mm5_gate_open, 15, false);
route_gate.gate_open_rows = 1;
route_gate_mode = true;
route_target_section = 12;
if (route_gate_second) route_target_section = 13;
route_unlock = 121;
// Keep accepted quarter-pixel X entry. Preserve airborne Y/velocity instead of teleporting to floor.
route_gate_entry_air = !camera_player.grounded || camera_player.fall_speed != 0;
route_gate_fall_speed = camera_player.fall_speed;
route_entry_x = gate_x - 8 + 0.25;
route_entry_y = 880 - camera_player.feet_offset;
if (route_gate_entry_air) route_entry_y = camera_player.y;
route_was_ladder = false;
route_fall_speed = 0;
camera_player.x = route_entry_x;
camera_player.y = route_entry_y;
camera_player.fall_speed = 0;
camera_player.grounded = !route_gate_entry_air;
camera_player.image_xscale = 1;
camera_player.anim_walk_frame = 0;
camera_player.anim_walk_timer = 0;
camera_player.sprite_index = spr_mm5_megaman_walk;
if (route_gate_entry_air) camera_player.sprite_index = spr_mm5_megaman_air;
camera_player.image_index = 0;
camera_player.image_speed = 0;
view_xview[0] = route_gate_origin_x;
view_yview[0] = 720;
