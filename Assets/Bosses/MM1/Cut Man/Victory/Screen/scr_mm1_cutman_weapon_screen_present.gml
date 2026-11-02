// Read-only256x240 GUI. Approved MM6-adapted sequence, no animation/audio in Draw.
var age, cx, shade, actor, ax;
if (!cmv_screen_started || cmv_phase < 8 || cmv_phase > 9) exit;
age = cmv_screen_age;
draw_set_alpha(1);
draw_set_color(c_white);
texture_set_interpolation(false);
if (age < 164)
{
    draw_sprite(spr_mm1_cutter_screen_intro_strip22, cmv_screen_intro, 0, 0);
    exit;
}
draw_sprite(spr_mm1_weapon_get_frame, 0, 0, 0);
if (age < 399)
{
    cx = min(208, 128 + 2 * (age - 163));
    shade = 1;
    if (age >= 378) shade = max(0, 1 - (floor((age - 378) / 5) + 1) / 4);
    shade = floor(255 * shade);
    draw_sprite_ext(spr_mm1_weapon_get_rolling_cutter_megaman, 0,
        cx - 32, 72, 1, 1, 0, make_color_rgb(shade, shade, shade), 1);
}
if (cmv_screen_you_chars > 0)
    scr_mm5_pause_text(string_copy("YOU GOT", 1, cmv_screen_you_chars),
        24, 88, make_color_rgb(100, 176, 255));
if (cmv_screen_weapon_chars > 0)
    scr_mm5_pause_text(string_copy("ROLLING CUTTER", 1, cmv_screen_weapon_chars),
        24, 112, c_white);
scr_mm5_pause_text("WEAPON ACQUIRED", 68, 210, make_color_rgb(100, 176, 255));
if (age >= 429 && age < 704)
{
    shade = min(1, (floor((age - 429) / 5) + 1) / 5);
    shade = floor(255 * shade);
    actor = spr_mm5_cutter_demo_idle;
    ax = 192;
    if (cmv_demo_throwing)
    {
        actor = spr_mm5_cutter_demo_throw;
        ax = 184;
    }
    // Explicit mirrored assets retain approved left-facing alignment/origin0.
    if (cmv_demo_throwing) actor = spr_mm5_cutter_demo_throw_left;
    else actor = spr_mm5_cutter_demo_idle_left;
    draw_sprite_ext(actor, 0, ax, 128, 1, 1, 0,
        make_color_rgb(shade, shade, shade), 1);
    if (cmv_demo_pose >= 0)
        draw_sprite(spr_mm1_player_rolling_cutter_demo_left_strip2,
            cmv_demo_pose, 208 - cmv_demo_dx - 8, 144 + cmv_demo_dy - 7);
}
if (age >= 794)
{
    shade = min(1, (floor((age - 794) / 5) + 1) / 4);
    draw_set_color(c_black);
    draw_set_alpha(shade);
    draw_rectangle(0, 0, 256, 240, false);
    draw_set_alpha(1);
    draw_set_color(c_white);
}
