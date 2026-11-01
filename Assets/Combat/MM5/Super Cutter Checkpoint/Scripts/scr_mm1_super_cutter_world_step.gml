// Manager context; called only by the existing central combat pass.
var p, i, actor, inside, delta, direction;
p = argument0;
for (i = instance_number(obj_mm1_super_cutter) - 1; i >= 0; i -= 1)
{
    actor = instance_find(obj_mm1_super_cutter, i);
    if (actor.super_born_tick == combat_tick) continue;
    with (actor) scr_mm1_super_cutter_step();
    if (actor.x < view_xview[0] || actor.x >= view_xview[0] + 256
        || actor.y < view_yview[0] || actor.y >= view_yview[0] + 240
        || actor.super_band != view_yview[0])
        with (actor) instance_destroy();
}
// Invisible native generators, NOT a second copy of the accepted building art.
for (i = 0; i < super_spawn_count; i += 1)
{
    inside = super_spawn_band[i] == view_yview[0]
        && super_spawn_x[i] >= view_xview[0] && super_spawn_x[i] < view_xview[0] + 256;
    if (!inside) { super_spawn_timer[i] = 0; continue; }
    if (super_spawn_timer[i] == 0)
    {
        delta = floor(p.x) - super_spawn_x[i];
        if (abs(delta) < 80)
        {
            direction = 1;
            if (delta < 0) direction = -1;
            actor = instance_create(super_spawn_x[i], super_spawn_y[i], obj_mm1_super_cutter);
            actor.super_vx = direction * floor(abs(delta) * 256 / 51) / 256;
            actor.super_direction = direction;
            actor.super_band = super_spawn_band[i];
            actor.super_born_tick = combat_tick;
            super_spawn_timer[i] = 32;
            // Original launches are silent. Do not reuse the Blaster fire cue.
        }
    }
    if (super_spawn_timer[i] > 0) super_spawn_timer[i] -= 1;
}
