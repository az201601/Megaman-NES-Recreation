// REPLACE existing End Step. Busy camera position is owned by Begin Step.
if (route_busy || !route_lists_ready) exit;
if (!instance_exists(camera_player)) camera_player = instance_find(obj_mm5_megaman, 0);
if (!instance_exists(camera_player)) exit;
if (camera_player.mm5_startup_active)
{
    view_xview[0] = 0;
    view_yview[0] = 480;
    exit;
}
if (route_section == 0)
{
    camera_player.x = clamp(camera_player.x, 8, 1016);
    view_xview[0] = clamp(floor(camera_player.x) - 128, 0, 768);
    view_yview[0] = 480;
}
else
{
    // Single-screen upper stripe. Keep player within its room, not invisible world void.
    //8px edge padding adapts existing MM5 side probes; not original MM1 per-pixel bounds.
    camera_player.x = clamp(camera_player.x, 776, 1016);
    view_xview[0] = 768;
    view_yview[0] = 480 - route_section * 240;
}
