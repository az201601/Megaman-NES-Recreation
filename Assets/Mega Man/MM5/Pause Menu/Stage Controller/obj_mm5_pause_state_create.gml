// obj_mm5_pause_state > Create. No sprite, invisible, persistent, not Solid.
// Created automatically once by the stage controller. Do NOT place room instances.
if (instance_number(obj_mm5_pause_state) > 1)
{
    instance_destroy();
    exit;
}
persistent = true;
visible = false;
scr_mm5_pause_inventory_init(true);
