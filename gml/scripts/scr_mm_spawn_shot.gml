// SCRIPT: scr_mm_spawn_shot(x, y, direction, weapon_id) -> instance id or -1
// 1:1: only 3 Mega Buster pellets may exist at once.
var px, py, dir, wpn, s;
px = argument0; py = argument1; dir = argument2; wpn = argument3;
if (instance_number(obj_shot) >= global.MM_MAXSHOTS) return -1;
s = instance_create(px, py, obj_shot);
s.dir = dir;
s.weapon = wpn;
s.hsp = dir * global.MM_SHOT_SPD;
s.damage = 1;
s.depth = -20;
return s;
