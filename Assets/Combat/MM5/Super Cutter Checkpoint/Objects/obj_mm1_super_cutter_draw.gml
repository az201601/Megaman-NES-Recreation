// Native 10-update closed/open cycle; canonical art faces left.
draw_sprite_ext(spr_mm1_super_cutter, floor(super_age / 10) mod 2,
    floor(x), floor(y), -super_direction, 1, 0, c_white, 1);
