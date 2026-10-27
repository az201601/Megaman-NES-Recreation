// OBJECT: obj_pickup  |  EVENT: Collision -> obj_player
var w;
w = global.mm_weapon;
switch (kind) {
case 0: global.mm_hp = min(global.MM_HP_MAX, global.mm_hp + 2); break;
case 2: global.mm_hp = min(global.MM_HP_MAX, global.mm_hp + 10); break;
case 1:
    if (w > 0) global.mm_energy[w] = min(global.MM_ENERGY_MAX, global.mm_energy[w] + 2);
    else       global.mm_hp = min(global.MM_HP_MAX, global.mm_hp + 2);
    break;
case 3:
    if (w > 0) global.mm_energy[w] = min(global.MM_ENERGY_MAX, global.mm_energy[w] + 10);
    else       global.mm_hp = min(global.MM_HP_MAX, global.mm_hp + 10);
    break;
}
global.mm_score += 100;
instance_destroy();
