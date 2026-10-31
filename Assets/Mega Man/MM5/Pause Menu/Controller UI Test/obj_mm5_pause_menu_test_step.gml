// obj_mm5_pause_menu_test > Step > Step. Test room only, no player/inventory access.
if (!menu_open)
{
    if (keyboard_check_pressed(vk_enter))
    {
        menu_open = true;
        menu_page = 0;
        menu_nav_key = -1;
        menu_nav_timer = 0;
        audio_play_sound(snd_mm5_menu_open, 0, false);
    }
    exit;
}
if (keyboard_check_pressed(vk_escape))
{
    if (menu_page == 1) menu_page = 0;
    else menu_open = false;
    menu_nav_key = -1;
    menu_nav_timer = 0;
    exit;
}
if (keyboard_check_pressed(vk_enter))
{
    if (menu_page == 1)
    {
        if (menu_upgrade_cursor == 1) menu_page = 0;
        // Energy Balancer is passive. Start on its icon does not consume it.
    }
    else if (menu_cursor == 14)
    {
        menu_page = 1;
        menu_upgrade_cursor = 0;
    }
    else if (menu_cursor >= 11 && menu_cursor <= 13)
    {
        var tank;
        tank = menu_cursor - 11;
        if (menu_test_tanks[tank] > 0)
        {
            menu_test_tanks[tank] -= 1;
            menu_test_uses[tank] += 1;
            show_debug_message("MENU UI TEST: " + menu_test_tank_name[tank]
                + " tank activated once. Remaining " + string(menu_test_tanks[tank])
                + ". Test counter only. Gameplay refill is NOT implemented.");
        }
        // Stays open in this test to inspect counts; final game closing rule undecided.
    }
    else
    {
        menu_last_weapon = menu_cursor;
        menu_open = false;
        // Test records selection only. Does NOT change the player's weapon.
    }
    menu_nav_key = -1;
    menu_nav_timer = 0;
    exit;
}
var key, dx, dy, move_now;
key = -1;
dx = 0;
dy = 0;
if (keyboard_check(vk_left) && !keyboard_check(vk_right)) { key = vk_left; dx = -1; }
else if (keyboard_check(vk_right) && !keyboard_check(vk_left)) { key = vk_right; dx = 1; }
else if (keyboard_check(vk_up) && !keyboard_check(vk_down)) { key = vk_up; dy = -1; }
else if (keyboard_check(vk_down) && !keyboard_check(vk_up)) { key = vk_down; dy = 1; }
move_now = false;
if (key == -1)
{
    menu_nav_key = -1;
    menu_nav_timer = 0;
}
else if (key != menu_nav_key)
{
    menu_nav_key = key;
    menu_nav_timer = 0;
    move_now = true;
}
else
{
    menu_nav_timer += 1;
    if (menu_nav_timer >= 18 && ((menu_nav_timer - 18) mod 6) == 0) move_now = true;
}
if (move_now) scr_mm5_pause_test_move(dx, dy);
