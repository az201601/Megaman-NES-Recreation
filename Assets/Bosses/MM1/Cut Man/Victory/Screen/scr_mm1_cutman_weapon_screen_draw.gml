// Read-only256x240 GUI design draft. Not wired into gameplay pending appearance review.
// Full-screen frame covers stage/HUD only when final screen GUI owner calls it last.
draw_sprite(spr_mm1_weapon_get_frame, 0, 0, 0);
draw_sprite(spr_mm6_weapon_get_megaman, 0, 176, 72);
draw_sprite(spr_mm1_menu_rolling_cutter_selected, 0, 25, 144);
scr_mm5_pause_text("CUT MAN", 100, 22, make_color_rgb(100, 176, 255));
scr_mm5_pause_text("YOU GOT", 24, 88, make_color_rgb(100, 176, 255));
scr_mm5_pause_text("ROLLING CUTTER", 24, 112, c_white);
scr_mm5_pause_text("R.CUTTER", 56, 150, c_white);
scr_mm5_pause_text("WEAPON ACQUIRED", 68, 210, make_color_rgb(100, 176, 255));
