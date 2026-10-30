// END Step: use completed player movement for this frame's rendered view.
// Pause controller deactivates/restores this camera with ordinary gameplay actors.
if (!instance_exists(camera_player)) camera_player = instance_find(obj_mm5_megaman, 0);
if (!instance_exists(camera_player)) exit;
if (camera_player.mm5_startup_active)
{
    view_xview[0] = 0;
    view_yview[0] = 0;
    exit;
}
// Original first-stripe rule: centre atX128, clamp world camera to0..768.
// Different MM5 player movement speed is intentional; camera has no easing/dead zone.
view_xview[0] = clamp(floor(camera_player.x) - 128, 0, 768);
view_yview[0] = 0;
