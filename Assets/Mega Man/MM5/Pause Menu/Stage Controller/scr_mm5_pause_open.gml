// Controller context. Player validated active by Begin Step; freeze exact active IDs.
if (menu_open || !menu_lists_ready) exit;
// Last completed stage Draw GUI cached application surface + known health HUD.
// Never deactivate the world without a valid outgoing picture.
if (!surface_exists(menu_stage_surface)) exit;
menu_player = instance_find(obj_mm5_megaman, 0);
if (!instance_exists(menu_player)) exit;
if (menu_player.mm5_startup_active) exit;
menu_health = clamp(floor(menu_player.mm5_health), 0, 28);
menu_lives = global.mm5_lives;
for (var i = 0; i < 11; i += 1) menu_energy[i] = global.mm5_pause_energy[i];
menu_fire_key = menu_player.buster_fire_key;
menu_fire_held_at_open = keyboard_check(menu_fire_key);
// Also cancel a pending charge if B was released on the very update Start opened.
menu_fire_released = !menu_fire_held_at_open;
ds_list_clear(menu_frozen_list);
ds_list_clear(menu_voice_list);
// Keep ONLY charge managers active for their async queue callbacks; pause their OWN voices.
with (all)
{
    if (id != other.id)
    {
        if (object_index == other.menu_charge_object)
        {
            // Accepted charge manager defines this field in Create.
            if (charge_audio_voice != -1)
            {
                if (audio_is_playing(charge_audio_voice) && !audio_is_paused(charge_audio_voice))
                {
                    ds_list_add(other.menu_voice_list, charge_audio_voice);
                    audio_pause_sound(charge_audio_voice);
                }
            }
        }
        else ds_list_add(other.menu_frozen_list, id);
    }
}
for (var j = 0; j < ds_list_size(menu_frozen_list); j += 1)
{
    instance_deactivate_object(ds_list_find_value(menu_frozen_list, j));
}
menu_open = true;
menu_phase = 1;
menu_tick = 1;
menu_pending_close = false;
menu_cursor = 0;
menu_page = 0;
menu_upgrade_cursor = 0;
menu_nav_key = -1;
menu_nav_timer = 0;
global.mm5_pause_active = true;
audio_play_sound(snd_mm5_menu_open, 0, false);
