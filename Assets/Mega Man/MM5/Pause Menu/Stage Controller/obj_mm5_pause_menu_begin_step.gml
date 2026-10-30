// Step > BEGIN Step. Freeze before ordinary gameplay Step; do not use normal Step here.
if (!menu_lists_ready) exit;
if (menu_open)
{
    if (menu_fire_held_at_open && !keyboard_check(menu_fire_key)) menu_fire_released = true;
    if (menu_pending_close)
    {
        var blocked;
        blocked = keyboard_check(vk_enter) || keyboard_check(vk_space) || keyboard_check(vk_left)
            || keyboard_check(vk_right) || keyboard_check(vk_up) || keyboard_check(vk_down);
        // A fire key held continuously since BEFORE pause may continue its existing charge.
        if (keyboard_check(menu_fire_key)
            && (!menu_fire_held_at_open || menu_fire_released)) blocked = true;
        if (!blocked) scr_mm5_pause_restore();
    }
    exit;
}
if (keyboard_check_pressed(vk_enter)) scr_mm5_pause_open();
