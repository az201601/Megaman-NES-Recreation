// Draw. Player keeps its normal sprite/mask and position throughout startup.
if (!instance_exists(start_player)) exit;
if (start_state == 1)
{
    if ((floor((start_ready_tick - 1) / 6) mod 2) == 0)
        draw_sprite(spr_mm5_ready, 0, start_ready_x, start_ready_y);
}
else if (start_state == 2 || start_state == 3)
{
    draw_sprite(spr_mm5_megaman_arrival, start_frame, start_x, start_y);
}
