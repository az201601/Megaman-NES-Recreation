// OBJECT: obj_boss  |  EVENT: Create
// Step 10 starter AI. Port the ROM strategy tables for a true 1:1 fight.
scr_mm_constants();
boss_id = 0;                       // 0 = Cut Man, see scr_mm_weapon_damage
hp = 28;
flash = 0;
phase = 0;
timer = 0;
vsp = 0; hsp = 0;
sprite_index = spr_boss_cutman;
image_speed = 0;
depth = -6;
global.mm_boss_active = true;
