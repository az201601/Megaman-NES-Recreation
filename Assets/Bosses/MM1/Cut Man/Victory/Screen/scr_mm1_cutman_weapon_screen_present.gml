// Boss context. Read-only256x240 Draw GUI,after all stage/HUD/pause rendering.
if (!cmv_screen_started || cmv_phase < 8 || cmv_phase > 9) return;
draw_set_alpha(1);
draw_set_color(c_white);
texture_set_interpolation(false);
draw_sprite(spr_mm1_weapon_get_frame, 0, 0, 0);
if (cmv_screen_reveal > 0)
    draw_sprite_part(spr_mm1_weapon_get_rolling_cutter_megaman, 0,
        0, 96 - cmv_screen_reveal, 64, cmv_screen_reveal,
        176, 72 + 96 - cmv_screen_reveal);
if (cmv_screen_you_chars > 0)
    scr_mm5_pause_text(string_copy("YOU GOT", 1, cmv_screen_you_chars),
        24, 88, make_color_rgb(100, 176, 255));
if (cmv_screen_weapon_chars > 0)
    scr_mm5_pause_text(string_copy("ROLLING CUTTER", 1, cmv_screen_weapon_chars),
        24, 112, c_white);
scr_mm5_pause_text("WEAPON ACQUIRED", 68, 210, make_color_rgb(100, 176, 255));
