// Camera context. argument0=-1 up, +1 down. Native timing trigger=age0.
if (route_busy || !route_lists_ready || !instance_exists(camera_player)) exit;
// Matched camera/start handshake. Older start scripts must not silently select section0.
route_start_version = 1101;
route_dir = argument0;
route_target_section = route_section - route_dir;
// Right-hand descent is a new branch, NOT the left return to section7.
if (route_section == 8 && route_dir == 1 && view_xview[0] == 1792 && camera_player.x > 1792)
    route_target_section = 9;
if (route_section == 9 && route_dir == -1) route_target_section = 8;
if (route_section == 9 && route_dir == 1) route_target_section = 10;
if (route_section == 10 && route_dir == -1) route_target_section = 9;
if (route_section == 10 && route_dir == 1) route_target_section = 11;
if (route_section == 11 && route_dir == -1) route_target_section = 10;
route_origin_y = 1920 - route_section * 240;
if (route_section >= 9) route_origin_y = (route_section - 8) * 240;
// Returns into single-screen pages4/5/6/10/11/12 ready95; first and fifth return ready126.
route_unlock = 126;
if (route_dir == 1 && (route_section == 2 || route_section == 3 || route_section == 4 || route_section == 6 || route_section == 7 || route_section == 8)) route_unlock = 95;
// Independently measured long ninth descent; eighth left return remains95.
if (route_section == 8 && route_target_section == 9) route_unlock = 126;
// Independently measured short upward return from page17 to page16.
if (route_section >= 10 && route_dir == -1) route_unlock = 95;
route_busy = true;
route_tick = 0;
route_entry_x = camera_player.x;
route_entry_y = camera_player.y;
route_was_ladder = camera_player.on_ladder;
route_fall_speed = camera_player.fall_speed;
route_fire_key = camera_player.buster_fire_key;
route_fire_held = keyboard_check(route_fire_key);
route_fire_released = !route_fire_held;
// Original MM1 room handoff clears outgoing shots. Includes BOTH charged children.
// Do not destroy static solids, blocks, HUD, music or charge manager.
with (obj_mm5_buster_shot) instance_destroy();
ds_list_clear(route_voices);
if (route_charge_object >= 0)
{
    with (route_charge_object)
    {
        if (charge_audio_voice != -1)
        {
            if (audio_is_playing(charge_audio_voice) && !audio_is_paused(charge_audio_voice))
            {
                ds_list_add(other.route_voices, charge_audio_voice);
                audio_pause_sound(charge_audio_voice);
            }
        }
    }
}
// Lock X at the currently displayed final column while either room is on screen.
view_xview[0] = 768;
if ((route_section == 4 && route_dir == -1) || route_section >= 5) view_xview[0] = 1280;
if (route_section >= 9 || (route_section == 8 && route_target_section == 9)) view_xview[0] = 1792;
