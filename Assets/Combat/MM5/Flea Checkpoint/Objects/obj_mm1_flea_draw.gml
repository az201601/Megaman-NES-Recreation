// Body stays at original8x8 collision center; spring extends beneath it.
var pose;
pose = 0;
if (flea_airborne) pose = 1;
draw_sprite_ext(spr_mm1_flea, pose, floor(x), floor(y), -flea_facing, 1, 0, c_white, 1);
