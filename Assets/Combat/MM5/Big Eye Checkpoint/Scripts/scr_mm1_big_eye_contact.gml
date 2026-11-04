// Manager context: native contact10 through the accepted MM5 hurt owner.
var p, i, actor, half_y;
p = argument0;
half_y = 32;
if (p.sliding) half_y = 25;
for (i = instance_number(obj_mm1_big_eye) - 1; i >= 0; i -= 1)
{
    actor = instance_find(obj_mm1_big_eye, i);
    if (actor.big_eye_born_tick == combat_tick) continue;
    if (scr_mm5_combat_overlap(p.x, p.y, actor.x, actor.y, 20, half_y))
        scr_mm5_combat_damage(p, 10);
}
