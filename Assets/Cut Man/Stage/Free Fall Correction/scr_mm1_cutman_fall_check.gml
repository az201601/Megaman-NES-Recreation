// Camera context, after startup/Start/refill/death guards. No ladder requirement.
var destination, old_view_x, old_view_y, left_limit, right_limit;
if (route_busy || camera_player.on_ladder || camera_player.fall_speed <= 0) return false;
if (camera_player.y < view_yview[0] + 232) return false;
destination = scr_mm1_cutman_room_below(route_section, camera_player.x);
if (destination == -1)
{
    // Native MM5 out-of-screen death, not ordinary damage: ignores hurt protection.
    if (camera_player.y < view_yview[0] + 240) return false;
    scr_mm5_combat_pit_die(camera_player);
    return true;
}
old_view_x = view_xview[0];
old_view_y = view_yview[0];
route_start_version = 0;
// Reuse accepted outgoing-shot/charge/audio ownership, NOT its ladder timing.
scr_mm1_cutman_scroll_start(1);
if (route_start_version != 1301)
    show_error("Free Fall Correction needs the accepted Second Gate Passage scr_mm1_cutman_scroll_start, version1301. Replace that entire resource before running.", true);
route_target_section = destination;
route_origin_y = old_view_y;
route_fall_mode = true;
route_was_ladder = false;
route_fall_from_x = old_view_x;
left_limit = 768;
right_limit = 768;
if (destination == 0) { left_limit = 0; right_limit = 768; }
if (destination == 4) { left_limit = 768; right_limit = 1280; }
if (destination >= 5 && destination <= 7) { left_limit = 1280; right_limit = 1280; }
if (destination == 9 || destination == 10) { left_limit = 1792; right_limit = 1792; }
if (destination == 11) { left_limit = 1792; right_limit = 2048; }
route_fall_to_x = clamp(floor(route_entry_x) - 128, left_limit, right_limit);
view_xview[0] = old_view_x;
camera_player.on_ladder = false;
camera_player.ladder_instance = noone;
camera_player.ladder_moving = false;
camera_player.grounded = false;
camera_player.sliding = false;
scr_mm1_cutman_fall_step();
return true;
