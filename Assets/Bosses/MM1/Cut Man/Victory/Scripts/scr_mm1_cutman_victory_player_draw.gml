// Player context. Return true to suppress ONLY ordinary character drawing.
// Preserve startup prefix, HUD and debug drawing. Never exit entire Draw event.
var boss;
boss = instance_find(obj_mm1_cutman_boss, 0);
if (!instance_exists(boss) || !boss.cm_defeat_pending) return false;
if (boss.cmv_phase < 6 || boss.cmv_phase == 10) return false;
with (boss) scr_mm1_cutman_victory_anim_draw();
// During custom screen/return Mega Man stays hidden, not idle at arena centre.
return true;
