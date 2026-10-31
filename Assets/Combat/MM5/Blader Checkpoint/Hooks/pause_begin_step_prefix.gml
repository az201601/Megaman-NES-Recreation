scr_mm5_combat_begin();
// TOP of pause Begin Step, ABOVE route guard. Keep existing menu events intact.
if (scr_mm5_combat_locked()) exit;
var combat_p;
combat_p = instance_find(obj_mm5_megaman, 0);
if (instance_exists(combat_p))
    if (combat_p.mm5_hurt_left > 0) exit;
