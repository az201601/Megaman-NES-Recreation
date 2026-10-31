// argument0=enemy,1=shot. Return true if accepted; no drop in Destroy event.
var enemy, shot, damage, boom, owner;
enemy = argument0;
shot = argument1;
if (!instance_exists(enemy) || !instance_exists(shot) || enemy.blader_dead) return false;
damage = 1;
if (shot.object_index == obj_mm5_buster_full) damage = 3;
enemy.blader_hp -= damage;
audio_play_sound(snd_mm6_enemy_hit, 10, false);
if (enemy.blader_hp <= 0)
{
    enemy.blader_dead = true;
    boom = instance_create(enemy.x, enemy.y, obj_mm5_enemy_explosion);
    owner = instance_find(obj_mm5_combat, 0);
    boom.explosion_born_tick = owner.combat_tick;
    with (enemy) instance_destroy();
}
// Native full buster pierces targets with oldHP<4; Blader always satisfies that.
if (shot.object_index != obj_mm5_buster_full)
{
    with (shot) instance_destroy();
}
return true;
