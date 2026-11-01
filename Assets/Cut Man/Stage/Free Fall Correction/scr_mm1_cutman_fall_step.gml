// Camera context: separate MM5-inspired non-ladder fall, no32-update ladder hold.
// Native reference:60scroll steps at4px and player screenY -=3.5; incoming8px alignment.
var scroll_age;
if (route_fire_held && !keyboard_check(route_fire_key)) route_fire_released = true;
route_tick += 1;
scroll_age = min(60, route_tick);
camera_player.x = route_entry_x;
view_yview[0] = route_origin_y + scroll_age * 4;
// WorldY+0.5 with camera+4 gives the native screen-relative -3.5 each step.
camera_player.y = route_entry_y + scroll_age * (1 / 2);
view_xview[0] = route_fall_from_x
    + floor((route_fall_to_x - route_fall_from_x) * scroll_age / 60);
// Horizontal interpolation is a Cut Man editor-layout adaptation; worldX never teleports.
if (route_tick >= 61)
{
    route_section = route_target_section;
    view_yview[0] = route_origin_y + 240;
    view_xview[0] = route_fall_to_x;
    camera_player.y = view_yview[0]
        + floor((route_entry_y - route_origin_y - 210) / 8) * 8;
    // Keep the alignment frame locked; player physics resumes on the next update.
    if (route_tick >= 62)
    {
        scr_mm1_cutman_scroll_finish();
        route_fall_mode = false;
        if (route_block_fire && keyboard_check_direct(route_fire_key)) keyboard_clear(route_fire_key);
    }
}
