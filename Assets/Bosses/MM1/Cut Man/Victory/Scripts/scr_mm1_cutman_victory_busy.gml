// Read-only lock query. Works immediately on the lethal latch, even BEFORE the
// next controller update. No resource/global existence APIs (GMS1.4 compatible).
var boss;
boss = instance_find(obj_mm1_cutman_boss, 0);
if (!instance_exists(boss)) return false;
return boss.cm_defeat_pending;
