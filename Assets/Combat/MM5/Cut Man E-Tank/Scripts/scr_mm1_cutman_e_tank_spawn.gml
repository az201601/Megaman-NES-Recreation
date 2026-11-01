// Manager context. Collected flag belongs to new-game inventory, NOT room Create.
var inside, item;
if (combat_dead || combat_refilling || scr_mm1_cutman_route_busy()) exit;
inside = view_yview[0] == cutman_e_tank_band
    && cutman_e_tank_x >= view_xview[0] && cutman_e_tank_x < view_xview[0] + 256;
if (!inside || global.mm1_cutman_e_tank_taken)
{
    if (instance_exists(cutman_e_tank_id))
        with (cutman_e_tank_id) instance_destroy();
    cutman_e_tank_id = noone;
    exit;
}
if (instance_exists(cutman_e_tank_id)) exit;
item = instance_create(cutman_e_tank_x, cutman_e_tank_y, obj_mm1_cutman_e_tank);
item.pickup_born_tick = combat_tick;
cutman_e_tank_id = item;
