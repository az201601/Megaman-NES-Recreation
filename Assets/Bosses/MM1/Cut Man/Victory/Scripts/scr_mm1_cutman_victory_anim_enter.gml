// Boss context: entry event, supported player anchorX/Y, shared active tick.
// Entered synchronously AFTER phase transition, BEFORE audio and Draw.
if (argument0 == 4)
{
    if (!cmv_anim_loaded)
    {
        scr_mm1_cutman_victory_anim_data();
        cmv_anim_loaded = true;
    }
    cmv_anim_started = true;
    cmv_anim_age = 0;
    cmv_anim_x = argument1;
    cmv_anim_y = argument2;
    cmv_anim_tick = argument3;
    cmv_acquisition_sound_requested = false;
    cmv_acquisition_sound_ended = false;
}
if (argument0 == 5 && cmv_anim_started)
{
    // Continuous native frame1358: landing pose then teleport, no second jump.
    cmv_anim_age = 282;
    cmv_anim_tick = argument3;
}
