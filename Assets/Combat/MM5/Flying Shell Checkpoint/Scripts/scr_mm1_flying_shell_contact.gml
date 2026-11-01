// Manager context: native body1, halfsize8x9. Bullets2 use existing shared pass.
var p, i, actor, half_y;
p = argument0;
half_y = 21;
if (p.sliding) half_y = 14;
for (i = instance_number(obj_mm1_flying_shell) - 1; i >= 0; i -= 1)
{
    actor = instance_find(obj_mm1_flying_shell, i);
    if (actor.shell_born_tick == combat_tick) continue;
    if (scr_mm5_combat_overlap(p.x, p.y, actor.x, actor.y, 16, half_y))
        scr_mm5_combat_damage(p, 1);
}
