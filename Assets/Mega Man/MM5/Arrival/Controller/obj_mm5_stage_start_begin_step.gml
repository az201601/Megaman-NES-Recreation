// Step > BEGIN Step (not ordinary Step).
if (start_state == 0 || start_state == 4) exit;
if (!instance_exists(start_player))
{
    start_state = 4;
    exit;
}
if (start_state == 1)
{
    if (start_ready_tick < 90)
    {
        start_ready_tick += 1;
        exit;
    }
    start_state = 2;
}
if (start_state == 2)
{
    start_speed += 0.25;
    start_y += start_speed;
    if (start_y >= start_target_y)
    {
        start_y = start_target_y;
        start_state = 3;
        start_material_tick = 0;
        start_frame = 0;
        start_voice = audio_play_sound(snd_mm5_megaman_arrival, 1, false);
    }
    exit;
}
if (start_state == 3)
{
    start_material_tick += 1;
    start_frame = min(4, 1 + floor((start_material_tick - 1) / 3));
}
