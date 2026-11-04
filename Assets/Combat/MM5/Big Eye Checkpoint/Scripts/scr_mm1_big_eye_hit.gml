// argument0=Big Eye,1=player projectile. Native HP20/basic1 = twenty normal hits.
// MM5 charge adaptation: full damage3, pierce only when pre-hit HP<4.
var enemy, shot, damage, old_hp, boom, owner;
enemy = argument0;
shot = argument1;
if (!instance_exists(enemy) || !instance_exists(shot) || enemy.big_eye_dead) return false;
old_hp = enemy.big_eye_hp;
damage = 1;
if (shot.object_index == obj_mm5_buster_full) damage = 3;
enemy.big_eye_hp -= damage;
audio_play_sound(snd_mm6_enemy_hit, 10, false);
if (enemy.big_eye_hp <= 0)
{
    enemy.big_eye_dead = true;
    boom = instance_create(enemy.x, enemy.y, obj_mm5_enemy_explosion);
    owner = instance_find(obj_mm5_combat, 0);
    boom.explosion_born_tick = owner.combat_tick;
    with (enemy) instance_destroy();
}
if (shot.object_index != obj_mm5_buster_full || old_hp >= 4)
    with (shot) instance_destroy();
return true;
