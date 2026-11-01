// argument0=Flea,1=player projectile; native20HP/basic20 is one normal hit.
var enemy, shot, boom, owner;
enemy = argument0;
shot = argument1;
if (!instance_exists(enemy) || !instance_exists(shot) || enemy.flea_dead) return false;
enemy.flea_dead = true;
enemy.flea_hp = 0;
audio_play_sound(snd_mm6_enemy_hit, 10, false);
boom = instance_create(enemy.x, enemy.y, obj_mm5_enemy_explosion);
owner = instance_find(obj_mm5_combat, 0);
boom.explosion_born_tick = owner.combat_tick;
with (enemy) instance_destroy();
// Weak-target MM5 fullcharge piercing; normal/mid consumed.
if (shot.object_index != obj_mm5_buster_full) with (shot) instance_destroy();
return true;
