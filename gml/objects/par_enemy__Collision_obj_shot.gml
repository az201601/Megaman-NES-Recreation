// OBJECT: par_enemy  |  EVENT: Collision -> obj_shot
var d, w;
d = other.damage;
w = other.weapon;
with (other) instance_destroy();
scr_mm_hurt_enemy(id, d, w);
