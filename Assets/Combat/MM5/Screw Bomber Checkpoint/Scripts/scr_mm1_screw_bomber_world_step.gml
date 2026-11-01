// Manager context. Existing Blaster bullet owner also moves/cleans Screw2D bullets.
var p, i, actor, random_byte;
p = argument0;
for (i = instance_number(obj_mm1_screw_bomber) - 1; i >= 0; i -= 1)
{
    actor = instance_find(obj_mm1_screw_bomber, i);
    if (actor.x < view_xview[0] || actor.x >= view_xview[0] + 256
        || actor.screw_band != view_yview[0])
    { with (actor) instance_destroy(); continue; }
    if (actor.screw_born_tick == combat_tick) continue;
    random_byte = 0;
    if (actor.screw_state > 1 && actor.screw_state < 80 && actor.screw_timer == 0)
        random_byte = irandom(255);
    with (actor) scr_mm1_screw_bomber_step(p.x, random_byte);
}
