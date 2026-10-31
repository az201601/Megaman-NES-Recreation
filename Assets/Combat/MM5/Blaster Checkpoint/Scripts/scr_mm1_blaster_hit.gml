// argument0=cannon,1=player projectile. Return true on hit, including a block.
var enemy, shot, owner, boom;
enemy = argument0;
shot = argument1;
if (!instance_exists(enemy) || !instance_exists(shot) || enemy.blaster_dead) return false;
if (!enemy.blaster_open)
{
    audio_play_sound(snd_mm6_blocked_hit, 10, false);
    // Hybrid deflection: all three MM5 projectile sizes bounce up/back.
    // This is not a claim of native MM1 charge behavior (MM1 has no charge shot).
    shot.mm5_shot_deflected = true;
    shot.shot_direction = -shot.shot_direction;
    shot.image_xscale = shot.shot_direction;
    return true;
}
// Original20HP minus20basic: one hit. MM5 fullcharge also kills and pierces.
enemy.blaster_dead = true;
enemy.blaster_hp = 0;
audio_play_sound(snd_mm6_enemy_hit, 10, false);
boom = instance_create(enemy.x, enemy.y, obj_mm5_enemy_explosion);
owner = instance_find(obj_mm5_combat, 0);
boom.explosion_born_tick = owner.combat_tick;
with (enemy) instance_destroy();
if (shot.object_index != obj_mm5_buster_full) with (shot) instance_destroy();
return true;
