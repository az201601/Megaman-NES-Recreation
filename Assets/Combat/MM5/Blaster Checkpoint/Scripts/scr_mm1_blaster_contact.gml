// Manager context. MM1 contact amounts with accepted MM5 hurt/protection rules.
var p, i, actor, half_y;
p = argument0;
half_y = 20;
if (p.sliding) half_y = 13;
for (i = instance_number(obj_mm1_blaster) - 1; i >= 0; i -= 1)
{
    actor = instance_find(obj_mm1_blaster, i);
    if (scr_mm5_combat_overlap(p.x, p.y, actor.x, actor.y, 10, half_y))
        scr_mm5_combat_damage(p, 1);
}
half_y = 13;
if (p.sliding) half_y = 6;
for (i = instance_number(obj_mm1_blaster_bullet) - 1; i >= 0; i -= 1)
{
    actor = instance_find(obj_mm1_blaster_bullet, i);
    if (actor.blaster_bullet_born_tick == combat_tick) continue;
    if (scr_mm5_combat_overlap(p.x, p.y, actor.x, actor.y, 9, half_y))
    {
        if (scr_mm5_combat_damage(p, 2)) with (actor) instance_destroy();
    }
}
