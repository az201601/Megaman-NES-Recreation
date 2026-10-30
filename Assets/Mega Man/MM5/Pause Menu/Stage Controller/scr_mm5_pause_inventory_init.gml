// Script.0=explicit new-game reset. Call false on stage entry; true ONLY at a new game.
var initialize_inventory;
initialize_inventory = argument0;
if (!variable_global_exists("mm5_pause_inventory_ready")) initialize_inventory = true;
if (initialize_inventory)
{
    for (var i = 0; i < 11; i += 1)
    {
        global.mm5_pause_owned[i] = false;
        global.mm5_pause_energy[i] = 0;
    }
    global.mm5_pause_owned[0] = true;
    global.mm5_pause_energy[0] = 28;
    for (var j = 0; j < 3; j += 1) global.mm5_pause_tanks[j] = 0;
    global.mm5_energy_balancer_owned = false;
    global.mm5_pause_inventory_ready = true;
}
if (!variable_global_exists("mm5_lives")) global.mm5_lives = 2;
if (argument0) global.mm5_lives = 2;
//02 spare lives approved. Death/life decrement and pickup awards are later systems.
