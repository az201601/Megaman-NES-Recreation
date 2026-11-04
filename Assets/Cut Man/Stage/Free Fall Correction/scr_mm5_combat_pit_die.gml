// Instant pit death uses accepted sound/music stop/countdown/lives/retry ownership.
// No call to ordinary damage; post-hit invulnerability must NOT protect from a pit.
var p, owner;
p = argument0;
owner = instance_find(obj_mm5_combat, 0);
if (!instance_exists(owner) || owner.combat_dead) exit;
scr_mm5_combat_die(p);
owner.combat_pit_death = true;
