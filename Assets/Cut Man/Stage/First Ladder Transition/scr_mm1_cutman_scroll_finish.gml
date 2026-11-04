// Camera context; also safe cleanup on Room End/Destroy. No actor deactivation.
if (!route_lists_ready) exit;
if (route_busy && route_fire_released)
{
    if (instance_exists(camera_player)) camera_player.buster_charge = 0;
    // Stop our known manager even if the player disappeared during teardown.
    if (route_charge_object >= 0)
    {
        with (route_charge_object) scr_mm5_charge_audio_stop();
    }
}
if (route_busy && instance_exists(camera_player))
{
    route_block_fire = keyboard_check(route_fire_key)
        && !keyboard_check_pressed(route_fire_key)
        && (!route_fire_held || route_fire_released);
    if (route_was_ladder) camera_player.fall_speed = 0;
    else camera_player.fall_speed = route_fall_speed;
    camera_player.ladder_moving = false;
}
if (!route_fire_released)
{
    for (var i = 0; i < ds_list_size(route_voices); i += 1)
    {
        var voice;
        voice = ds_list_find_value(route_voices, i);
        if (audio_is_paused(voice)) audio_resume_sound(voice);
    }
}
ds_list_clear(route_voices);
route_busy = false;
