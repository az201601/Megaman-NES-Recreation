// argument0=shell,1=projectile. One normal hit ONLY when the shell is open.
var enemy, shot, owner, boom, spawn_index;
enemy = argument0;
shot = argument1;
if (!instance_exists(enemy) || !instance_exists(shot) || enemy.shell_dead) return false;
if (!enemy.shell_open)
{
    // Same accepted MM5 hybrid deflection as Blaster; native MM1 has no charge.
    audio_play_sound(snd_mm6_blocked_hit, 10, false);
    shot.mm5_shot_deflected = true;
    shot.shot_direction = -shot.shot_direction;
    shot.image_xscale = shot.shot_direction;
    return true;
}
enemy.shell_dead = true;
enemy.shell_hp = 0;
audio_play_sound(snd_mm6_enemy_hit, 10, false);
owner = instance_find(obj_mm5_combat, 0);
spawn_index = enemy.shell_spawn_index;
if (spawn_index >= 0 && spawn_index < owner.shell_spawn_count)
{
    // Native birthcounter72 consumes2ticks in the measured death update.
    // Preserve the observed70 subsequent-update wait without hidden actor events.
    owner.shell_spawn_wait[spawn_index] = 70;
    owner.shell_spawn_wait_tick[spawn_index] = owner.combat_tick;
    owner.shell_spawn_id[spawn_index] = noone;
}
boom = instance_create(enemy.x, enemy.y, obj_mm5_enemy_explosion);
boom.explosion_born_tick = owner.combat_tick;
with (enemy) instance_destroy();
if (shot.object_index != obj_mm5_buster_full) with (shot) instance_destroy();
return true;
