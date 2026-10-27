// OBJECT: obj_boss  |  EVENT: Collision -> obj_shot
// Uses the ROM's 11x8 damage table. 0 = immune (the shot still disappears).
var d, w;
d = scr_mm_weapon_damage(boss_id, other.weapon);
w = other.weapon;
with (other) instance_destroy();
if (d <= 0) exit;
hp -= d;
flash = 8;
if (hp <= 0) {
    global.mm_boss_defeated[boss_id] = 1;
    global.mm_unlocked[boss_id+1] = 1;
    global.mm_energy[boss_id+1] = global.MM_ENERGY_MAX;
    global.mm_message = "WEAPON GET";
    global.mm_message_timer = 180;
    global.mm_boss_active = false;
    instance_destroy();
}
