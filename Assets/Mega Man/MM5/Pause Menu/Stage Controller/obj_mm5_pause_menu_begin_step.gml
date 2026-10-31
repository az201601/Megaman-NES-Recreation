// BEGIN Step: freeze/restore before gameplay Step. Native input-ready boundary38.
if (!menu_lists_ready) exit;
if (menu_open)
{
    if (menu_fire_held_at_open && !keyboard_check(menu_fire_key)) menu_fire_released = true;
    // Surfaces are volatile (minimize/device reset). Recover safely, never strand actors.
    if (!surface_exists(menu_stage_surface))
    {
        scr_mm5_pause_restore();
        show_debug_message("MM5 pause: lost stage surface; safely returned to gameplay.");
    }
    else if (menu_phase == 1 || menu_phase == 3)
    {
        menu_tick += 1;
        if (menu_tick >= 38)
        {
            if (menu_phase == 1) menu_phase = 2;
            else scr_mm5_pause_restore();
        }
    }
    // Do not reopen on the same update as restoration.
    if (menu_block_fire && keyboard_check_direct(menu_fire_key)) keyboard_clear(menu_fire_key);
    exit;
}
// Windows target: direct physical polling bypasses keyboard_clear's logical key buffer.
// Only NEW/re-pressed fire is suppressed until released; old continuous charge survives.
if (menu_block_fire)
{
    if (keyboard_check_direct(menu_fire_key)) keyboard_clear(menu_fire_key);
    else menu_block_fire = false;
}
if (keyboard_check_pressed(vk_enter)) scr_mm5_pause_open();
