// Projectile context,argument0 target. MM1 table damages normalized into existing
// accepted stage HP. C differs from P only for Battery and Screw here:both kill.
// Current contiguous-overlap suppression is owned by contacts,NOT each Draw.
var enemy, dead, owner, boom, spawn_index;
enemy = argument0;
if (!instance_exists(enemy) || scr_mm1_cutman_victory_busy()) return false;
dead = false;
switch (enemy.object_index)
{
    case obj_mm1_blader:
        if (enemy.blader_dead) return false;
        enemy.blader_hp = 0; enemy.blader_dead = true; dead = true; break;
    case obj_mm1_blaster:
        if (enemy.blaster_dead || !enemy.blaster_open) return false;
        enemy.blaster_hp = 0; enemy.blaster_dead = true; dead = true; break;
    case obj_mm1_super_cutter:
        if (enemy.super_dead) return false;
        enemy.super_hp -= 1; dead = enemy.super_hp <= 0;
        enemy.super_dead = dead; break;
    case obj_mm1_flea:
        if (enemy.flea_dead) return false;
        enemy.flea_hp = 0; enemy.flea_dead = true; dead = true; break;
    case obj_mm1_octopus_battery:
        if (enemy.battery_dead) return false;
        enemy.battery_hp = 0; enemy.battery_dead = true; dead = true; break;
    case obj_mm1_flying_shell:
        if (enemy.shell_dead || !enemy.shell_open) return false;
        enemy.shell_hp = 0; enemy.shell_dead = true; dead = true;
        owner = instance_find(obj_mm5_combat, 0);
        spawn_index = enemy.shell_spawn_index;
        if (spawn_index >= 0 && spawn_index < owner.shell_spawn_count)
        {
            owner.shell_spawn_wait[spawn_index] = 70;
            owner.shell_spawn_wait_tick[spawn_index] = owner.combat_tick;
            owner.shell_spawn_id[spawn_index] = noone;
        }
        break;
    case obj_mm1_big_eye:
        if (enemy.big_eye_dead) return false;
        enemy.big_eye_hp -= 1; dead = enemy.big_eye_hp <= 0;
        enemy.big_eye_dead = dead; break;
    case obj_mm1_screw_bomber:
        if (enemy.screw_dead) return false;
        enemy.screw_hp = 0; enemy.screw_dead = true; dead = true; break;
    case obj_mm1_cutman_boss:
        return scr_mm1_cutman_boss_hit(enemy, id);
    default: return false;
}
audio_play_sound(snd_mm6_enemy_hit, 10, false);
if (dead)
{
    owner = instance_find(obj_mm5_combat, 0);
    boom = instance_create(enemy.x, enemy.y, obj_mm5_enemy_explosion);
    boom.explosion_born_tick = owner.combat_tick;
    with (enemy) instance_destroy();
}
// Native launch bit04:the Cutter survives accepted hits; no Buster deflection.
return true;
