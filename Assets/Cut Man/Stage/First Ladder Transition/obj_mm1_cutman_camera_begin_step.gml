// BEGIN Step, before player ordinary Step. Native trigger age0; playable age126.
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
            // Native239,235,...3 upward camera sequence; old viewport was240.
            view_yview[0] = 239 - step * 4;
            camera_player.y = route_entry_y - 1 - step * (65 / 256);
        }
        else
        {
            view_yview[0] = step * 4;
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
        if (route_dir == -1)
        {
            route_section = 1;
            view_yview[0] = 0;
            camera_player.y = floor(route_entry_y - 240 + 60 * (959 / 256));
        }
        else
        {
            route_section = 0;
            view_yview[0] = 240;
            camera_player.y = 240 + floor(route_entry_y - 60 * (959 / 256));
        }
        camera_player.anim_climb_timer = 0;
        camera_player.ladder_moving = false;
    }
    //33post-upload frames92..124, bookkeeping125, first accepted freshUp126.
    if (route_tick >= 126)
    {
        scr_mm1_cutman_scroll_finish();
        if (route_block_fire && keyboard_check_direct(route_fire_key)) keyboard_clear(route_fire_key);
    }
    exit;
}
if (camera_player.mm5_startup_active) exit;
// Fresh Start can pause BEFORE a ladder handoff; do not race the pause Begin Step.
if (keyboard_check_pressed(vk_enter)) exit;
var up, down, climbing;
up = keyboard_check(vk_up) && !keyboard_check(vk_down);
down = keyboard_check(vk_down) && !keyboard_check(vk_up);
climbing = camera_player.on_ladder && camera_player.buster_pose_timer <= 0
    && !keyboard_check_pressed(camera_player.buster_fire_key);
if (route_section == 0 && climbing && up
    && abs(camera_player.x - 984) <= 1
    && camera_player.y >= 232 && camera_player.y < 260
    && floor(camera_player.y - camera_player.ladder_speed) < 244)
{
    scr_mm1_cutman_scroll_start(-1);
}
else if (route_section == 1 && climbing && down
    && abs(camera_player.x - 984) <= 1
    && floor(camera_player.y + camera_player.ladder_speed) >= 232)
{
    scr_mm1_cutman_scroll_start(1);
}
else if (route_section == 1 && !camera_player.on_ladder
    && camera_player.fall_speed > 0 && camera_player.y >= 232)
{
    // Falling through the same open seam must not leave the camera on the old room.
    // Falling entry is a hybrid-controller adaptation, not separately ROM-replay certified.
    scr_mm1_cutman_scroll_start(1);
}
