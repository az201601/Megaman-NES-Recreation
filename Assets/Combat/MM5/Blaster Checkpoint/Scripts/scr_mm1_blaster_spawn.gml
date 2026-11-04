// Manager context, after existing spawn pass. No manual room instances.
var i, inside, actor;
for (i = 0; i < blaster_spawn_count; i += 1)
{
    inside = blaster_spawn_band[i] == view_yview[0]
        && blaster_spawn_x[i] >= view_xview[0] && blaster_spawn_x[i] <= view_xview[0] + 255;
    if (!inside) { blaster_spawn_armed[i] = true; continue; }
    if (!blaster_spawn_armed[i] || instance_exists(blaster_spawn_id[i])) continue;
    actor = instance_create(blaster_spawn_x[i], blaster_spawn_y[i], obj_mm1_blaster);
    actor.blaster_direction = blaster_spawn_direction[i];
    actor.blaster_timer = blaster_spawn_timer[i];
    actor.blaster_band = blaster_spawn_band[i];
    actor.blaster_born_tick = combat_tick;
    blaster_spawn_id[i] = actor;
    blaster_spawn_armed[i] = false;
}
