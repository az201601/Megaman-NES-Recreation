// argument0 boss, argument1 shot. Boss shot-routing adapter; not called live yet.
// Approved MM5-style balance28HP: normal1, partial1, full3.
// Boss absorbs every colliding shot, including full charge (no boss piercing).
var actor, shot, hit_damage;
actor = argument0;
shot = argument1;
if (!instance_exists(actor) || !instance_exists(shot)) return false;
if (!actor.boss_intro_complete || !actor.cm_active || actor.cm_defeat_pending) return false;
if (actor.cm_blink > 0)
{
    with (shot) instance_destroy();
    return true;
}
hit_damage = 1;
if (shot.object_index == obj_mm5_buster_full) hit_damage = 3;
actor.boss_health = max(0, actor.boss_health - hit_damage);
audio_play_sound(snd_mm6_enemy_hit, 10, false);
with (shot) instance_destroy();
if (actor.boss_health == 0)
{
    // Latch BEFORE any victory audio/effects/reward. Later shots/contact cannot
    // re-enter combat or create another cutter while the victory owner takes over.
    actor.cm_defeat_pending = true;
    actor.cm_active = false;
    actor.cm_cutter = 0;
    actor.cm_throw_requested = false;
    actor.cm_speed_x = 0;
    actor.cm_speed_y = 0;
}
else actor.cm_blink = 63;
return true;
