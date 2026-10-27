// SCRIPT: scr_mm_set_sprite(state, facing)  facing = -1 left, +1 right
// Picks the right sprite and ROM animation speed. image_speed is in
// "frames advanced per Step": ROM run = 6 frames/step -> 1/6.
var st, f, R, want;
st = argument0; f = argument1; R = (f > 0);
want = -1;

switch (st) {
case 0: // stand
    if (R) want = spr_mm_stand_R; else want = spr_mm_stand_L; break;
case 1: // stand + shoot
    if (R) want = spr_mm_shoot_R; else want = spr_mm_shoot_L; break;
case 2: // run
    if (R) want = spr_mm_run_R; else want = spr_mm_run_L; break;
case 3: // run + shoot
    if (R) want = spr_mm_runshoot_R; else want = spr_mm_runshoot_L; break;
case 4: // jump
    if (R) want = spr_mm_jump_R; else want = spr_mm_jump_L; break;
case 5: // jump + shoot
    if (R) want = spr_mm_jumpshoot_R; else want = spr_mm_jumpshoot_L; break;
case 6: // climb
    if (R) want = spr_mm_climb_R; else want = spr_mm_climb_L; break;
case 7: // hurt
    if (R) want = spr_mm_hurt_R; else want = spr_mm_hurt_L; break;
}

if (want != -1 && sprite_index != want) {
    sprite_index = want;
    image_index = 0;
}

switch (st) {
case 0: case 1: case 4: case 5: image_speed = 0;   image_index = 0; break;
case 2: case 3: image_speed = 1/6; break;    // ROM: 6 frames per run frame
case 6: image_speed = 1/8; break;             // ROM: 8 frames per climb frame
case 7: image_speed = 1/2; break;             // ROM: 2 frames per hurt frame
}
