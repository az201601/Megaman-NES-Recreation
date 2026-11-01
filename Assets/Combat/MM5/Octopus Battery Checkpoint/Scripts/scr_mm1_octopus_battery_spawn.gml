// Manager context: all16 native records, rearm only after anchor leaves view.
var i, inside, actor;
for (i = 0; i < battery_spawn_count; i += 1)
{
    inside = battery_spawn_band[i] == view_yview[0]
        && battery_spawn_x[i] >= view_xview[0] && battery_spawn_x[i] < view_xview[0] + 256;
    if (!inside) { battery_spawn_armed[i] = true; continue; }
    if (!battery_spawn_armed[i] || instance_exists(battery_spawn_id[i])) continue;
    actor = instance_create(battery_spawn_x[i], battery_spawn_y[i], obj_mm1_octopus_battery);
    actor.battery_vertical = battery_spawn_vertical[i];
    actor.battery_band = battery_spawn_band[i];
    actor.battery_born_tick = combat_tick;
    battery_spawn_id[i] = actor;
    battery_spawn_armed[i] = false;
}
