// Manager context: native record enters the256px view, then waits one update.
var i, inside, actor;
for (i = 0; i < screw_spawn_count; i += 1)
{
    inside = screw_spawn_band[i] == view_yview[0]
        && screw_spawn_x[i] >= view_xview[0] && screw_spawn_x[i] < view_xview[0] + 256;
    if (!inside) { screw_spawn_armed[i] = true; continue; }
    if (!screw_spawn_armed[i] || instance_exists(screw_spawn_id[i])) continue;
    actor = instance_create(screw_spawn_x[i], screw_spawn_y[i], obj_mm1_screw_bomber);
    actor.screw_band = screw_spawn_band[i];
    actor.screw_ceiling = screw_spawn_ceiling[i];
    actor.screw_born_tick = combat_tick;
    screw_spawn_id[i] = actor;
    screw_spawn_armed[i] = false;
}
