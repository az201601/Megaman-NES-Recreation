// Manager context: halfsize7 versus accepted8px targets reduces both bounds by1.
var p, i, actor, half_y;
p = argument0;
half_y = 19;
if (p.sliding) half_y = 12;
for (i = instance_number(obj_mm1_octopus_battery) - 1; i >= 0; i -= 1)
{
    actor = instance_find(obj_mm1_octopus_battery, i);
    if (actor.battery_born_tick == combat_tick) continue;
    if (scr_mm5_combat_overlap(p.x, p.y, actor.x, actor.y, 15, half_y))
        scr_mm5_combat_damage(p, 4);
}
