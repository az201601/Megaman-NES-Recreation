// OBJECT: obj_pickup  |  EVENT: Step -> Step
if (global.mm_paused) exit;
switch (kind) {
case 0: sprite_index = spr_pickup_life_small;   break;
case 1: sprite_index = spr_pickup_weapon_small; break;
case 2: sprite_index = spr_pickup_life_large;   break;
case 3: sprite_index = spr_pickup_weapon_large; break;
}
vsp += 0.25;
y += vsp;
if (place_meeting(x, y, par_solid)) {
    while (place_meeting(x, y-1, par_solid)) y -= 1;
    vsp = 0;
}
if (y > room_height + 32) instance_destroy();
