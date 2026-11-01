// Player-death shutdown. Existing Room End/Destroy may call music dispose again.
// No inventory, lives, entrance timing or E-Tank persistence changes.
var actor, music;
actor = instance_find(obj_mm1_cutman_boss, 0);
if (instance_exists(actor))
{
    actor.cm_active = false;
    actor.cm_cutter = 0;
    actor.cm_throw_requested = false;
    actor.cm_speed_x = 0;
    actor.cm_speed_y = 0;
}
music = instance_find(obj_mm1_cutman_boss_music, 0);
if (instance_exists(music))
    with (music) scr_mm1_cutman_boss_music_dispose();
