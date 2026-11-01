// Pause-controller context. Retain the paid benefit until the SAME player is active.
// GMS activation may not become visible to instance_exists in the restore event.
if (!menu_e_tank_pending) exit;
if (!instance_exists(menu_player)) exit;
menu_player.mm5_health = 28;
menu_player.mm5_refill_left = 0;
menu_player.mm5_refill_wait = 0;
menu_e_tank_pending = false;
