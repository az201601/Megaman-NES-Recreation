// Manager context: native floor1/ceiling2 contact through the accepted MM5 hurt owner.
var p, i, actor, half_y;
p = argument0;
half_y = 20;
if (p.sliding) half_y = 13;
for (i = instance_number(obj_mm1_screw_bomber) - 1; i >= 0; i -= 1)
{
    actor = instance_find(obj_mm1_screw_bomber, i);
    if (actor.screw_born_tick == combat_tick) continue;
    if (scr_mm5_combat_overlap(p.x, p.y, actor.x, actor.y, 16, half_y))
        scr_mm5_combat_damage(p, 1 + actor.screw_ceiling);
}
