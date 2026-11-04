var owner;
owner = instance_find(obj_mm5_combat, 0);
if (!instance_exists(owner) || pickup_taken) exit;
draw_sprite(spr_mm5_pickup_e_tank, floor(owner.combat_tick / 9) mod 2, floor(x), floor(y));
