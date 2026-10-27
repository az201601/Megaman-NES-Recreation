// SCRIPT: scr_mm_hurt_enemy(target_instance, damage, weapon_id)
var e, d, w;
e = argument0; d = argument1; w = argument2;
if (!instance_exists(e)) exit;
with (e) {
    hp -= d;
    flash = 8;
    if (hp <= 0) instance_destroy();
}
global.mm_score += 10 * d;
