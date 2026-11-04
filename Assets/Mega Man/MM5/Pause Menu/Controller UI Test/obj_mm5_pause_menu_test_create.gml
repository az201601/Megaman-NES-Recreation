// obj_mm5_pause_menu_test > Create. ISOLATED TEST ROOM ONLY.
// These are explicitly test values, not your player's inventory.
menu_open = true;
menu_page = 0;
menu_cursor = 0;
menu_upgrade_cursor = 0;
menu_last_weapon = 0;
menu_test_health = 14;
menu_test_lives = 3;
menu_nav_key = -1;
menu_nav_timer = 0;
menu_test_tanks[0] = 2;
menu_test_tanks[1] = 2;
menu_test_tanks[2] = 1;
menu_test_uses[0] = 0;
menu_test_uses[1] = 0;
menu_test_uses[2] = 0;
for (var i = 0; i < 11; i += 1) menu_test_energy[i] = 14;
menu_test_energy[0] = 28;
menu_test_tank_name[0] = "E";
menu_test_tank_name[1] = "W";
menu_test_tank_name[2] = "M";
display_set_gui_size(256, 240);
image_speed = 0;
menu_label[0] = "M.BUSTER"; menu_x[0] = 16; menu_y[0] = 52;
menu_label[1] = "R.CUTTER"; menu_x[1] = 16; menu_y[1] = 70;
menu_label[2] = "I.SLASHER"; menu_x[2] = 16; menu_y[2] = 88;
menu_label[3] = "H.BOMB"; menu_x[3] = 16; menu_y[3] = 106;
menu_label[4] = "F.STORM"; menu_x[4] = 16; menu_y[4] = 124;
menu_label[5] = "T.BEAM"; menu_x[5] = 16; menu_y[5] = 142;
menu_label[6] = "S.ARM"; menu_x[6] = 136; menu_y[6] = 52;
menu_label[7] = "M.BEAM"; menu_x[7] = 136; menu_y[7] = 70;
menu_label[8] = "R.COIL"; menu_x[8] = 136; menu_y[8] = 88;
menu_label[9] = "R.JET"; menu_x[9] = 136; menu_y[9] = 106;
menu_label[10] = "R.MARINE"; menu_x[10] = 136; menu_y[10] = 124;
// Target centres:11 weapon rows,3 tank groups,Upgrades button.
for (var j = 0; j < 11; j += 1)
{
    menu_target_x[j] = menu_x[j] + 56;
    menu_target_y[j] = menu_y[j] + 8;
}
menu_target_x[11] = 36; menu_target_y[11] = 190;
menu_target_x[12] = 108; menu_target_y[12] = 190;
menu_target_x[13] = 180; menu_target_y[13] = 190;
menu_target_x[14] = 128; menu_target_y[14] = 217;

if (sprite_get_number(spr_mm5_pause_weapon_icons) != 22
    || sprite_get_number(spr_mm5_pause_tanks) != 6
    || sprite_get_number(spr_mm5_pause_upgrade_icons) != 2
    || sprite_get_number(spr_mm5_pause_font) != 38)
{
    show_error("Pause UI test: check weapon22, tank6, upgrade2 and font38 strip imports.", true);
}
