// Manager context. Shared accepted Blaster pass already moves enemy bullets.
var i, actor;
for (i = instance_number(obj_mm1_flying_shell) - 1; i >= 0; i -= 1)
{
    actor = instance_find(obj_mm1_flying_shell, i);
    if (actor.shell_band != view_yview[0] || actor.x >= view_xview[0] + 256)
    { with (actor) instance_destroy(); continue; }
    if (actor.shell_born_tick == combat_tick) continue;
    with (actor) scr_mm1_flying_shell_step();
}
