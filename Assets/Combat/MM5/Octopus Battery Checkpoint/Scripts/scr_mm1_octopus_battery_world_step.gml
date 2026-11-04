// Manager context: no extra Step pass on enemies.
var i, actor;
for (i = instance_number(obj_mm1_octopus_battery) - 1; i >= 0; i -= 1)
{
    actor = instance_find(obj_mm1_octopus_battery, i);
    if (actor.battery_band != view_yview[0]) { with (actor) instance_destroy(); continue; }
    if (actor.battery_born_tick == combat_tick) continue;
    with (actor) scr_mm1_octopus_battery_step();
    if (actor.x < view_xview[0] || actor.x >= view_xview[0] + 256
        || actor.y < view_yview[0] || actor.y >= view_yview[0] + 240)
        with (actor) instance_destroy();
}
