// Step > Step. No test inventory, real tank effects/extra weapon behaviours not connected yet.
// Phase is unlocked in BEGIN Step at measured frame38, not when full-bright35.
if (!menu_open || menu_phase != 2) exit;
if (keyboard_check_pressed(vk_enter) || keyboard_check_pressed(vk_space))
{
    if (menu_page == 1)
    {
        if (menu_upgrade_cursor == 1) menu_page = 0;
    }
    else if (menu_cursor == 14)
    {
        menu_page = 1;
        menu_upgrade_cursor = 0;
    }
    else if (menu_cursor >= 11 && menu_cursor <= 13)
    {
        // User specifies Start for tank use. A-on-tank behaviour is not assigned here.
        if (!keyboard_check_pressed(vk_enter)) exit;
        // Never consume real inventory without a working refill effect.
        if (global.mm5_pause_tanks[menu_cursor - 11] > 0)
            show_debug_message("Tank use requires refill integration; inventory was NOT consumed.");
    }
    else if (menu_cursor == 0)
    {
        menu_last_weapon = 0;
        audio_stop_sound(snd_mm5_menu_cursor);
        audio_play_sound(snd_mm5_menu_close, 0, false);
        menu_pending_close = true;
        menu_phase = 3;
        menu_tick = 1;
    }
    else
    {
        show_debug_message("This weapon is not connected to gameplay yet. Select M.BUSTER to resume.");
    }
    menu_nav_key = -1;
    menu_nav_timer = 0;
    exit;
}
var key, dx, dy, move_now;
key = -1; dx = 0; dy = 0;
if (keyboard_check(vk_left) && !keyboard_check(vk_right)) { key = vk_left; dx = -1; }
else if (keyboard_check(vk_right) && !keyboard_check(vk_left)) { key = vk_right; dx = 1; }
else if (keyboard_check(vk_up) && !keyboard_check(vk_down)) { key = vk_up; dy = -1; }
else if (keyboard_check(vk_down) && !keyboard_check(vk_up)) { key = vk_down; dy = 1; }
move_now = false;
if (key == -1) { menu_nav_key = -1; menu_nav_timer = 0; }
else if (key != menu_nav_key) { menu_nav_key = key; menu_nav_timer = 0; move_now = true; }
else
{
    menu_nav_timer += 1;
    if (menu_nav_timer >= 18 && ((menu_nav_timer - 18) mod 6) == 0) move_now = true;
}
if (move_now) scr_mm5_pause_stage_move(dx, dy);
