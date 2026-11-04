// REPLACE camera End Step. Accepted view logic runs first, then one combat pass.
// Keep this order: no dependence on GameMaker instance-ID event ordering.
if (!scr_mm5_combat_locked()) scr_mm1_cutman_camera_end_update();
var combat_owner;
combat_owner = instance_find(obj_mm5_combat, 0);
if (instance_exists(combat_owner))
{
    with (combat_owner) scr_mm5_combat_end_frame();
}
