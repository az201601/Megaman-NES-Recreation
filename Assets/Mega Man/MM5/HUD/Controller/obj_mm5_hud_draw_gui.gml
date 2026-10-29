// Draw > Draw GUI, NOT ordinary Draw. Independent of the player's startup lock.
if (!instance_exists(hud_player)) exit;
var hud_health_frame;
hud_health_frame = max(0, min(28, floor(hud_player.mm5_health)));
draw_sprite_ext(spr_mm5_health_meter, hud_health_frame,
    24, 25, 1, 1, 0, c_white, 1);
