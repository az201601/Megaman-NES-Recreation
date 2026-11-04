// Other > Room Start, AFTER all room instances have run Create.
if (instance_number(obj_mm5_stage_start) != 1)
    show_error("Use exactly ONE obj_mm5_stage_start in this room.", true);
if (instance_number(obj_mm5_megaman) != 1)
    show_error("READY/arrival requires exactly ONE obj_mm5_megaman.", true);
start_player = instance_find(obj_mm5_megaman, 0);
with (start_player)
{
    if (!scr_mm5_player_supported(x, y) || on_ladder || sliding)
        show_error("Arrival target must start supported on a flat floor, not a ladder/slide. Check player Create X/Y and floor.", true);
    mm5_startup_active = true;
}
start_x = start_player.x;
start_target_y = start_player.y;
start_y = 0;
start_ready_x = 128;
start_ready_y = 128;
if (view_enabled && view_visible[0])
{
    start_y = view_yview[0];
    start_ready_x += view_xview[0];
    start_ready_y += view_yview[0];
}
if (start_target_y <= start_y)
    show_error("Arrival target must be below the top of the gameplay view.", true);
start_state = 1;
