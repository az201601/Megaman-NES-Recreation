// obj_mm5_pause_menu_test > Draw > Draw GUI. Uses existing256x240 imported assets.
draw_set_alpha(1);
draw_set_color(c_white);
if (!menu_open)
{
    scr_mm5_pause_text("TEST ROOM", 88, 96, c_white);
    scr_mm5_pause_text("ENTER OPENS MENU", 64, 120, c_white);
    exit;
}
var blue, cyan, i, selected, frame, tx, amount;
blue = make_color_rgb(21, 95, 217);
cyan = make_color_rgb(100, 176, 255);
if (menu_page == 0) draw_sprite(spr_mm5_pause_main_panel, 0, 0, 0);
else draw_sprite(spr_mm5_pause_upgrades_panel, 0, 0, 0);
draw_sprite(spr_mm5_pause_lives, 0, 16, 13);
scr_mm5_pause_text(string_copy(string(100 + clamp(floor(menu_test_lives), 0, 99)), 2, 2), 36, 19, c_white);
scr_mm5_pause_text("HEALTH", 96, 19, c_white);
scr_mm5_pause_meter(menu_test_health, false, 152, 18);
if (menu_page == 0)
{
    scr_mm5_pause_text("WEAPONS AND UTILITIES", 16, 39, c_white);
    for (i = 0; i < 11; i += 1)
    {
        selected = (menu_cursor == i);
        frame = i * 2;
        if (selected) frame += 1;
        draw_sprite(spr_mm5_pause_weapon_icons, frame, menu_x[i], menu_y[i]);
        if (selected)
        {
            scr_mm5_pause_text(menu_label[i], menu_x[i] + 20, menu_y[i], cyan);
            scr_mm5_pause_box(menu_x[i] - 3, menu_y[i] - 1, 111, 18, cyan);
        }
        else scr_mm5_pause_text(menu_label[i], menu_x[i] + 20, menu_y[i], c_white);
        scr_mm5_pause_meter(menu_test_energy[i], selected, menu_x[i] + 20, menu_y[i] + 8);
    }
    scr_mm5_pause_text("TANKS", 16, 170, c_white);
    for (i = 0; i < 3; i += 1)
    {
        tx = 16 + i * 72;
        selected = (menu_cursor == 11 + i);
        frame = i * 2;
        if (selected) frame += 1;
        draw_sprite(spr_mm5_pause_tanks, frame, tx, 182);
        amount = clamp(floor(menu_test_tanks[i]), 0, 99);
        if (selected)
        {
            scr_mm5_pause_text(string_copy(string(100 + amount), 2, 2), tx + 20, 187, cyan);
            scr_mm5_pause_box(tx - 3, 179, 42, 22, cyan);
        }
        else scr_mm5_pause_text(string_copy(string(100 + amount), 2, 2), tx + 20, 187, c_white);
    }
    if (menu_cursor == 14) scr_mm5_pause_box(80, 208, 96, 18, cyan);
    else scr_mm5_pause_box(80, 208, 96, 18, blue);
    scr_mm5_pause_text("UPGRADES", 96, 214, c_white);
}
else
{
    scr_mm5_pause_text("UPGRADES", 96, 39, c_white);
    selected = (menu_upgrade_cursor == 0);
    frame = 0;
    if (selected) frame = 1;
    draw_sprite(spr_mm5_pause_upgrade_icons, frame, 32, 64);
    if (selected)
    {
        scr_mm5_pause_box(24, 56, 32, 32, cyan);
        scr_mm5_pause_text("ENERGY BALANCER", 24, 122, cyan);
        scr_mm5_pause_text("ROUTES SPARE WEAPON", 24, 146, c_white);
        scr_mm5_pause_text("ENERGY TO THE WEAPON", 24, 160, c_white);
        scr_mm5_pause_text("WITH THE LOWEST ENERGY.", 24, 174, c_white);
    }
    if (menu_upgrade_cursor == 1) scr_mm5_pause_box(80, 208, 96, 18, cyan);
    else scr_mm5_pause_box(80, 208, 96, 18, blue);
    scr_mm5_pause_text("WEAPONS", 100, 214, c_white);
}
draw_set_color(c_white);
draw_set_alpha(1);
