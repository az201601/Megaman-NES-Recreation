// REPLACE existing End Step. Busy camera position is owned by Begin Step.
if (route_busy || !route_lists_ready) exit;
if (!instance_exists(camera_player)) camera_player = instance_find(obj_mm5_megaman, 0);
if (!instance_exists(camera_player)) exit;
if (camera_player.mm5_startup_active)
{
    view_xview[0] = 0;
    view_yview[0] = 1920;
    exit;
}
if (route_section == 0)
{
    camera_player.x = clamp(camera_player.x, 8, 1016);
    view_xview[0] = clamp(floor(camera_player.x) - 128, 0, 768);
    view_yview[0] = 1920;
}
else if (route_section == 4)
{
    camera_player.x = clamp(camera_player.x, 776, 1528);
    view_xview[0] = clamp(floor(camera_player.x) - 128, 768, 1280);
    view_yview[0] = 960;
}
else if (route_section == 8)
{
    camera_player.x = clamp(camera_player.x, 1288, 2040);
    view_xview[0] = clamp(floor(camera_player.x) - 128, 1280, 1792);
    view_yview[0] = 0;
}
else if (route_section >= 9)
{
    camera_player.x = clamp(camera_player.x, 1800, 2040);
    view_xview[0] = 1792;
    view_yview[0] = (route_section - 8) * 240;
}
else if (route_section >= 5)
{
    camera_player.x = clamp(camera_player.x, 1288, 1528);
    view_xview[0] = 1280;
    view_yview[0] = 1920 - route_section * 240;
}
else
{
    // Single-screen upper stripe. Keep player within its room, not invisible world void.
    //8px edge padding adapts existing MM5 side probes; not original MM1 per-pixel bounds.
    camera_player.x = clamp(camera_player.x, 776, 1016);
    view_xview[0] = 768;
    view_yview[0] = 1920 - route_section * 240;
}
