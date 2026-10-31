// Tenth Down126/Up95; prior direction schedules unchanged.
if (!route_lists_ready) exit;
if (!instance_exists(camera_player)) camera_player = instance_find(obj_mm5_megaman, 0);
if (!instance_exists(camera_player))
{
    if (route_busy) scr_mm1_cutman_scroll_finish();
    exit;
}
if (route_block_fire)
{
    if (keyboard_check_direct(route_fire_key)) keyboard_clear(route_fire_key);
    else route_block_fire = false;
}
if (route_busy && route_gate_mode)
{
    if (route_fire_held && !keyboard_check(route_fire_key)) route_fire_released = true;
    route_tick += 1;
    camera_player.x = route_entry_x;
    camera_player.y = route_entry_y;
    if (route_tick == 32)
        route_gate_voice = audio_play_sound(snd_mm5_gate_open, 15, false);
    if (instance_exists(route_gate))
    {
        if (route_tick >= 33) route_gate.gate_open_rows = min(4, 1 + floor((route_tick - 33) / 6));
    }
    view_yview[0] = 720;
    view_xview[0] = 2048;
    if (route_tick >= 56)
    {
        var gate_step;
        gate_step = min(64, route_tick - 55);
        view_xview[0] = 2048 + gate_step * 4;
        camera_player.x = route_entry_x + gate_step;
    }
    if (route_tick < 119)
    {
        camera_player.anim_walk_timer += 1;
        if (camera_player.anim_walk_timer >= 7)
        {
            camera_player.anim_walk_timer = 0;
            camera_player.anim_walk_frame = (camera_player.anim_walk_frame + 1) mod 4;
        }
        camera_player.sprite_index = spr_mm5_megaman_walk;
        camera_player.image_index = camera_player.anim_walk_frame;
    }
    else
    {
        camera_player.sprite_index = spr_mm5_megaman_idle;
        camera_player.image_index = 0;
    }
    camera_player.image_speed = 0;
    if (route_tick >= 152) route_section = 12;
    if (route_tick >= 153)
    {
        camera_player.walk_pause = 0;
        camera_player.walk_previous_input = 0;
        scr_mm1_cutman_scroll_finish();
        route_gate_mode = false;
        if (route_block_fire && keyboard_check_direct(route_fire_key)) keyboard_clear(route_fire_key);
    }
    exit;
}
if (route_busy)
{
    if (route_fire_held && !keyboard_check(route_fire_key)) route_fire_released = true;
    route_tick += 1;
    camera_player.x = route_entry_x;
    if (route_tick < 32) exit;
    if (route_tick < 92)
    {
        var step;
        step = route_tick - 32;
        if (route_dir == -1)
        {
            // Origin-relative native upward camera: base-1, base-5, ..., base-237.
            view_yview[0] = route_origin_y - 1 - step * 4;
            camera_player.y = route_entry_y - 1 - step * (65 / 256);
        }
        else
        {
            view_yview[0] = route_origin_y + step * 4;
            camera_player.y = route_entry_y + step * (65 / 256);
        }
        if (route_was_ladder)
        {
            // Retain established MM5 two-pose cadence, not MM1 player artwork/cadence.
            camera_player.anim_climb_timer += 1;
            if (camera_player.anim_climb_timer >= 9)
            {
                camera_player.anim_climb_timer = 0;
                camera_player.anim_climb_frame = 1 - camera_player.anim_climb_frame;
            }
            camera_player.sprite_index = spr_mm5_megaman_climb;
            camera_player.image_speed = 0;
            camera_player.image_index = camera_player.anim_climb_frame;
        }
        exit;
    }
    if (route_tick == 92)
    {
        route_section = route_target_section;
        view_yview[0] = route_origin_y + route_dir * 240;
        if (route_dir == -1)
            camera_player.y = floor(route_entry_y - 240 + 60 * (959 / 256));
        else
            camera_player.y = floor(route_entry_y + 240 - 60 * (959 / 256));
        camera_player.anim_climb_timer = 0;
        camera_player.ladder_moving = false;
    }
    // Up/first/fifth/ninth descents ready126; other returns settled92..93/bookkeeping94, ready95.
    if (route_tick >= route_unlock)
    {
        scr_mm1_cutman_scroll_finish();
        if (route_block_fire && keyboard_check_direct(route_fire_key)) keyboard_clear(route_fire_key);
    }
    exit;
}
if (camera_player.mm5_startup_active) exit;
// Fresh Start can pause BEFORE a ladder handoff; do not race the pause Begin Step.
if (keyboard_check_pressed(vk_enter)) exit;
// MM5 grounded standing contact adaptation: no midair/slide teleport.
if (route_section == 11 && view_xview[0] == 2048
    && keyboard_check(vk_right) && !keyboard_check(vk_left)
    && camera_player.grounded && !camera_player.sliding && !camera_player.on_ladder
    && camera_player.fall_speed == 0
    && camera_player.x >= 2264 && camera_player.x < 2265
    && abs(camera_player.y + camera_player.feet_offset - 880) <= 1)
{
    scr_mm1_cutman_gate_start();
    exit;
}
var up, down, climbing;
up = keyboard_check(vk_up) && !keyboard_check(vk_down);
down = keyboard_check(vk_down) && !keyboard_check(vk_up);
climbing = camera_player.on_ladder && camera_player.buster_pose_timer <= 0
    && !keyboard_check_pressed(camera_player.buster_fire_key);
var base_y, seam_x;
base_y = 1920 - route_section * 240;
if (route_section >= 9) base_y = (route_section - 8) * 240;
seam_x = 984;
if ((route_section == 3 && up) || (route_section == 4 && down)) seam_x = 824;
if ((route_section == 4 && up) || route_section >= 5) seam_x = 1496;
if ((route_section == 6 && up) || (route_section == 7 && down)) seam_x = 1320;
if ((route_section == 7 && up) || (route_section == 8 && down)) seam_x = 1336;
if (route_section == 9 || (route_section == 8 && down && view_xview[0] == 1792)) seam_x = 1992;
if ((route_section == 9 && down) || route_section == 10) seam_x = 1896;
if ((route_section == 10 && down) || route_section == 11) seam_x = 1832;
if ((route_section < 8 || (route_section >= 9 && route_section <= 11)) && climbing && up
    && abs(camera_player.x - seam_x) <= 1
    && (route_section != 4 || view_xview[0] == 1280)
    && (route_section != 11 || view_xview[0] == 1792)
    && camera_player.y >= base_y - 8 && camera_player.y < base_y + 20
    && floor(camera_player.y - camera_player.ladder_speed) < base_y + 4)
{
    route_start_version = 0;
    scr_mm1_cutman_scroll_start(-1);
    if (route_start_version != 1201)
        show_error("Cut Man route script mismatch: replace the ENTIRE scr_mm1_cutman_scroll_start with the First Gate Passage version, then restart. Do not change room/view/player coordinates.", true);
}
else if (route_section > 0 && route_section < 11 && climbing && down
    && abs(camera_player.x - seam_x) <= 1
    && (route_section != 8 || view_xview[0] == 1280 || view_xview[0] == 1792)
    && floor(camera_player.y + camera_player.ladder_speed) >= base_y + 232)
{
    route_start_version = 0;
    scr_mm1_cutman_scroll_start(1);
    if (route_start_version != 1201)
        show_error("Cut Man route script mismatch: replace the ENTIRE scr_mm1_cutman_scroll_start with the First Gate Passage version, then restart. Do not change room/view/player coordinates.", true);
}
else if (route_section > 0 && route_section < 11 && !camera_player.on_ladder
    && camera_player.fall_speed > 0 && camera_player.y >= base_y + 232
    && (route_section != 4 || (view_xview[0] == 768 && camera_player.x < 1016))
    && (route_section != 8 || (view_xview[0] == 1280 && camera_player.x < 1528)
        || (view_xview[0] == 1792 && camera_player.x >= 1984 && camera_player.x < 2000)))
{
    // Controller adaptation for falling through open return seam, not native-certified.
    route_start_version = 0;
    scr_mm1_cutman_scroll_start(1);
    if (route_start_version != 1201)
        show_error("Cut Man route script mismatch: replace the ENTIRE scr_mm1_cutman_scroll_start with the First Gate Passage version, then restart. Do not change room/view/player coordinates.", true);
}
