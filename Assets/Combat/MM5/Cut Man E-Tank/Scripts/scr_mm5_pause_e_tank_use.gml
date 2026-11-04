// Pause controller context. Fresh Start only; caller requires ready phase2/E row.
if (!menu_open || menu_phase != 2 || menu_page != 0 || menu_cursor != 11) return false;
if (menu_e_tank_refilling || menu_e_tank_pending || menu_health <= 0 || menu_health >= 28
    || global.mm5_pause_tanks[0] <= 0) return false;
global.mm5_pause_tanks[0] -= 1;
menu_e_tank_pending = true;
menu_e_tank_refilling = true;
mm5_health = menu_health;
mm5_refill_left = 28 - mm5_health;
mm5_refill_wait = 0;
// First bar and cue occur on confirmation, then the existing4-update cadence.
scr_mm5_pause_e_tank_tick();
return true;
