// No animation/physics/audio mutation in Draw. Canonical art faces right.
var facing;
if (!pc_active || scr_mm1_cutman_victory_busy()) exit;
facing = -1;
if (pc_right) facing = 1;
draw_sprite_ext(spr_mm1_player_rolling_cutter, pc_draw_frame,
    floor(x), floor(y), facing, 1, 0, c_white, 1);
