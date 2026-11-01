// Body stays at numeric12x20 collision center; native32x48 artwork.
var pose;
pose = 0;
if (big_eye_airborne) pose = 1;
draw_sprite_ext(spr_mm1_big_eye, pose, floor(x), floor(y), -big_eye_facing, 1, 0, c_white, 1);
