// Camera context. argument0=-1 up, +1 down. Native timing trigger=age0.
if (route_busy || !route_lists_ready || !instance_exists(camera_player)) exit;
route_dir = argument0;
route_origin_y = 1440 - route_section * 240;
// Returns into single-screen pages4/5/6/10 ready95; first and fifth return ready126.
route_unlock = 126;
if (route_dir == 1 && (route_section == 2 || route_section == 3 || route_section == 4 || route_section == 6)) route_unlock = 95;
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
