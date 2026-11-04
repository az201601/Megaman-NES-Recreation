// Step > END Step. Unlock AFTER player's final suspended Step, independent of instance order.
if (start_state == 3 && start_material_tick >= 11)
{
    if (instance_exists(start_player)) start_player.mm5_startup_active = false;
    start_state = 4;
}
