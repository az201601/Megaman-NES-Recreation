// Projectile context,argument0 shared tick. Explicit hybrid contact-edge adapter:
// once per contiguous overlap with each ID; may hit again after separation.
// This is not claimed as a port of the complete MM1 enemy hit-state machine.
var group, i, enemy, half_x, half_y, last_tick, tick, accepted;
tick = argument0;
for (group = 0; group < 9; group += 1)
{
    half_x = 16; half_y = 16;
    switch (group)
    {
        case 0: pc_target_object = obj_mm1_blader; break;
        case 1: pc_target_object = obj_mm1_blaster; half_x = 10; break;
        case 2: pc_target_object = obj_mm1_super_cutter; break;
        case 3: pc_target_object = obj_mm1_flea; break;
        case 4: pc_target_object = obj_mm1_octopus_battery; half_x = 15; half_y = 15; break;
        case 5: pc_target_object = obj_mm1_flying_shell; half_y = 17; break;
        case 6: pc_target_object = obj_mm1_big_eye; half_x = 20; half_y = 28; break;
        case 7: pc_target_object = obj_mm1_screw_bomber; break;
        case 8: pc_target_object = obj_mm1_cutman_boss; half_y = 20; break;
    }
    for (i = instance_number(pc_target_object) - 1; i >= 0; i -= 1)
    {
        enemy = instance_find(pc_target_object, i);
        if (!instance_exists(enemy)) continue;
        if (!scr_mm5_combat_overlap(floor(x), floor(y), enemy.x, enemy.y, half_x, half_y)) continue;
        last_tick = -100;
        if (ds_map_exists(pc_contacts, enemy))
            last_tick = ds_map_find_value(pc_contacts, enemy);
        if (last_tick >= tick - 1)
        {
            ds_map_replace(pc_contacts, enemy, tick);
            continue;
        }
        accepted = scr_mm1_player_cutter_hit(enemy);
        // Lethal boss handoff may synchronously destroy THIS projectile.
        if (scr_mm1_cutman_victory_busy()) exit;
        if (accepted)
        {
            if (ds_map_exists(pc_contacts, enemy)) ds_map_replace(pc_contacts, enemy, tick);
            else ds_map_add(pc_contacts, enemy, tick);
        }
    }
}
