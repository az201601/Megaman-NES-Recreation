// Camera Begin Step owns ONE intro tick; no actor Step/event-order dependency.
route_boss_intro_tick += 1;
if (route_fire_held && !keyboard_check(route_fire_key)) route_fire_released = true;
camera_player.x = 3096.5625;
camera_player.y = route_entry_y;
camera_player.sprite_index = spr_mm5_megaman_idle;
camera_player.image_index = 0;
camera_player.image_speed = 0;
view_xview[0] = 3072;
view_yview[0] = 720;
if (route_boss_intro_tick == 183)
{
    route_boss_shutter = instance_create(3072, 816, obj_mm1_cutman_boss_entry_gate);
    route_boss_close_voice = audio_play_sound(snd_mm5_gate_open, 15, false);
}
if (route_boss_intro_tick >= 184 && instance_exists(route_boss_shutter))
    route_boss_shutter.gate_open_rows = max(0, 3 - floor((route_boss_intro_tick - 184) / 6));
// No standalone appearance/head-scissors cue: isolated export was not audibly verified.
if (instance_exists(route_boss_actor))
{
    route_boss_actor.image_index = 0;
    if (route_boss_intro_tick >= 209) route_boss_actor.boss_visible = true;
    // Native rendered scissors: first open hold11 updates, then9-update alternation.
    if (route_boss_intro_tick >= 220)
        route_boss_actor.image_index = (1 + floor((route_boss_intro_tick - 220) / 9)) mod 2;
    route_boss_actor.boss_health = clamp(floor((route_boss_intro_tick - 209) / 2), 0, 28);
}
if (route_boss_intro_tick >= 217 && route_boss_intro_tick <= 265
    && ((route_boss_intro_tick - 217) mod 8) == 0)
{
    if (route_boss_fill_voice != -1) audio_stop_sound(route_boss_fill_voice);
    route_boss_fill_voice = audio_play_sound(snd_mm1_cutman_boss_fill, 15, false);
}
// Native FE at first full-meter check stops the last fill SFX; music continues.
if (route_boss_intro_tick == 267 && route_boss_fill_voice != -1)
{
    audio_stop_sound(route_boss_fill_voice);
    route_boss_fill_voice = -1;
}
if (route_boss_intro_tick >= 303)
{
    if (instance_exists(route_boss_actor)) route_boss_actor.boss_intro_complete = true;
    camera_player.walk_pause = 0;
    camera_player.walk_previous_input = 0;
    scr_mm1_cutman_scroll_finish();
    route_boss_intro = false;
    if (route_block_fire && keyboard_check_direct(route_fire_key)) keyboard_clear(route_fire_key);
    // Combat AI/contacts/boss damage are intentionally the NEXT checkpoint.
}
