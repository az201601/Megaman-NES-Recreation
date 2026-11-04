// Draw GUI. Cache native stage pixels PLUS installed HUD; all fades render at256x240.
// Do not move to ordinary Draw: GUI HUD is not part of application_surface.
if (!menu_lists_ready) exit;
draw_set_alpha(1);
draw_set_color(c_white);
texture_set_interpolation(false);
if (!menu_open)
{
    if (!surface_exists(application_surface)) exit;
    if (!surface_exists(menu_stage_surface)) menu_stage_surface = surface_create(256, 240);
    if (!surface_exists(menu_stage_surface)) exit;
    surface_set_target(menu_stage_surface);
    draw_clear_alpha(c_black, 1);
    draw_surface_stretched(application_surface, 0, 0, 256, 240);
    // Exact installed obj_mm5_hud display. No second visible HUD; this is offscreen only.
    var hp_player;
    hp_player = instance_find(obj_mm5_megaman, 0);
    if (instance_exists(obj_mm5_hud) && instance_exists(hp_player))
        draw_sprite_ext(spr_mm5_health_meter, clamp(floor(hp_player.mm5_health), 0, 28),
            24, 25, 1, 1, 0, c_white, 1);
    surface_reset_target();
    exit;
}
scr_mm5_pause_transition_sample();
// A true black interval: no alpha tween, no partly rendered stage/menu beneath it.
if (menu_dim == 4 || !surface_exists(menu_stage_surface))
{
    draw_set_color(c_black);
    draw_rectangle(0, 0, 256, 240, false);
    draw_set_color(c_white);
    exit;
}
if (!surface_exists(menu_frame_surface)) menu_frame_surface = surface_create(256, 240);
if (!surface_exists(menu_lut_surface))
{
    menu_lut_surface = surface_create(64, 512);
    if (surface_exists(menu_lut_surface))
    {
        surface_set_target(menu_lut_surface);
        // LUT is NOT GUI-sized; explicitly select its pixel projection (GMS1.4 API).
        d3d_set_projection_ortho(0, 0, 64, 512, 0);
        draw_clear_alpha(c_black, 1);
        draw_sprite(spr_mm5_pause_fade_lut, 0, 0, 0);
        surface_reset_target();
        d3d_set_projection_ortho(0, 0, 256, 240, 0);
    }
}
if (!surface_exists(menu_frame_surface) || !surface_exists(menu_lut_surface))
{
    // Low-memory allocation failure: show black this update, abort safely next Begin Step.
    if (surface_exists(menu_stage_surface)) surface_free(menu_stage_surface);
    menu_stage_surface = -1;
    draw_set_color(c_black);
    draw_rectangle(0, 0, 256, 240, false);
    draw_set_color(c_white);
    exit;
}
surface_set_target(menu_frame_surface);
draw_clear_alpha(c_black, 1);
if (menu_dim > 0)
{
    shader_set(shd_mm5_pause_fade);
    shader_set_uniform_f(menu_dim_uniform, menu_dim);
    shader_set_uniform_f(menu_white_uniform, 0);
    texture_set_stage(menu_lut_sampler, surface_get_texture(menu_lut_surface));
}
if (menu_show_stage) draw_surface(menu_stage_surface, 0, 0);
else scr_mm5_pause_draw_page();
if (menu_dim > 0) shader_reset();
surface_reset_target();
draw_set_color(c_white);
draw_set_alpha(1);
draw_surface(menu_frame_surface, 0, 0);
