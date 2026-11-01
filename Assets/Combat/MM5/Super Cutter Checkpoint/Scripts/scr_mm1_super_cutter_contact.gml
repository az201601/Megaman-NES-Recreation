// Manager context: native cutter halfsize8/8 + accepted MM5 player bounds.
var p, i, actor, half_y;
p = argument0;
half_y = 20;
if (p.sliding) half_y = 13;
for (i = instance_number(obj_mm1_super_cutter) - 1; i >= 0; i -= 1)
{
    actor = instance_find(obj_mm1_super_cutter, i);
    if (actor.super_born_tick == combat_tick) continue;
    if (scr_mm5_combat_overlap(p.x, p.y, actor.x, actor.y, 16, half_y))
        scr_mm5_combat_damage(p, 4);
}
