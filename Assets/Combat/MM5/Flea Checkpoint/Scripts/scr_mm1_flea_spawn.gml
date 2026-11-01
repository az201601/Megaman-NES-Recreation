// Manager context: native record enters the256px view, then waits one update.
var i, inside, actor;
for (i = 0; i < flea_spawn_count; i += 1)
{
    inside = flea_spawn_band[i] == view_yview[0]
        && flea_spawn_x[i] >= view_xview[0] && flea_spawn_x[i] < view_xview[0] + 256;
    if (!inside) { flea_spawn_armed[i] = true; continue; }
    if (!flea_spawn_armed[i] || instance_exists(flea_spawn_id[i])) continue;
    actor = instance_create(flea_spawn_x[i], flea_spawn_y[i], obj_mm1_flea);
    actor.flea_band = flea_spawn_band[i];
    actor.flea_born_tick = combat_tick;
    flea_spawn_id[i] = actor;
    flea_spawn_armed[i] = false;
}
