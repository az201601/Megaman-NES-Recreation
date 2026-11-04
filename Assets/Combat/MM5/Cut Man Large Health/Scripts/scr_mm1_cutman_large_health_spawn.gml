// Manager context; script-owned fixed pickup. No editor-placed instance.
var inside, item;
if (combat_dead || combat_refilling || scr_mm1_cutman_route_busy()) exit;
inside = view_yview[0] == cutman_health_band
    && cutman_health_x >= view_xview[0] && cutman_health_x < view_xview[0] + 256;
if (!inside)
{
    cutman_health_armed = true;
    if (instance_exists(cutman_health_id))
        with (cutman_health_id) instance_destroy();
    cutman_health_id = noone;
    exit;
}
if (!cutman_health_armed || instance_exists(cutman_health_id)) exit;
item = instance_create(cutman_health_x, cutman_health_y, obj_mm1_cutman_large_health);
item.pickup_born_tick = combat_tick;
cutman_health_id = item;
cutman_health_armed = false;
