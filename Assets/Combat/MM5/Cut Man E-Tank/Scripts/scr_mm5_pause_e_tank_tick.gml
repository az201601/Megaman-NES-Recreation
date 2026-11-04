// Pause controller context; the existing health helper and voice owner are reusable.
if (!menu_e_tank_refilling) exit;
if (scr_mm5_health_refill_tick()) scr_mm5_combat_refill_sound();
menu_health = mm5_health;
if (mm5_refill_left <= 0 && mm5_refill_wait <= 0)
{
    menu_e_tank_refilling = false;
    // Original successful E use stays in the menu and returns selection to Buster.
    menu_cursor = menu_last_weapon;
    menu_nav_key = -1;
    menu_nav_timer = 0;
}
