// OBJECT: obj_hud  |  EVENT: Draw
// MM1's HUD sits on the LEFT of the screen, not in a top bar.
var vx, vy, e;
vx = view_xview[0]; vy = view_yview[0];
if (global.mm_weapon < 0 || global.mm_weapon > 7) global.mm_weapon = 0;
e = global.mm_energy[global.mm_weapon];

draw_set_color(c_white);
draw_text(vx+8,  vy+16, "LIFE");
draw_text(vx+40, vy+16, "WEAPON");
draw_text(vx+40, vy+28, global.mm_weapon_name[global.mm_weapon]);

scr_mm_draw_bar(vx+8,  vy+104, global.mm_hp, global.MM_HP_MAX, c_cyan);
scr_mm_draw_bar(vx+40, vy+104, e, global.MM_ENERGY_MAX, c_yellow);

draw_set_color(c_white);
draw_text(vx+8,   vy+220, "SCORE " + string(global.mm_score));
draw_text(vx+220, vy+220, "x" + string(max(0, global.mm_lives)));
