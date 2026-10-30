// Controller context. Restore ONLY IDs this controller deactivated, never activate_all.
if (!menu_lists_ready) exit;
for (var i = 0; i < ds_list_size(menu_frozen_list); i += 1)
{
    // Inactive IDs fail instance_exists; do NOT filter them before activation.
    instance_activate_object(ds_list_find_value(menu_frozen_list, i));
}
ds_list_clear(menu_frozen_list);
if (menu_fire_released && instance_exists(menu_player))
{
    // A B release while menu was open must not emit a buffered shot on return.
    menu_player.buster_charge = 0;
    if (menu_charge_object >= 0)
    {
        with (menu_charge_object) scr_mm5_charge_audio_stop();
    }
}
else
{
    for (var j = 0; j < ds_list_size(menu_voice_list); j += 1)
    {
        var voice;
        voice = ds_list_find_value(menu_voice_list, j);
        if (audio_is_paused(voice)) audio_resume_sound(voice);
    }
}
ds_list_clear(menu_voice_list);
menu_open = false;
menu_pending_close = false;
menu_nav_key = -1;
menu_nav_timer = 0;
global.mm5_pause_active = false;
