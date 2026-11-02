// Boss context; sole coordinator calls BEFORE core. Shared tick,frozen.
// Replay original rendered animation updates, not a fabricated completion timer.
if (!cmv_anim_started || cmv_phase < 6 || cmv_phase > 7) return;
if (argument1 || cmv_anim_tick == argument0) return;
cmv_anim_tick = argument0;
cmv_anim_age += 1;
// Native1130 energy-circle onset and1349 F0: exactly219 active updates apart.
if (cmv_anim_age >= 54 && cmv_anim_age < 273)
    cmv_acquisition_sound_requested = true;
if (cmv_anim_age >= 273) cmv_acquisition_sound_ended = true;
// Native acquisition1076..1357; teleport1358..1418, then custom screen request.
// Only this animation owner writes these completion acknowledgements.
if (cmv_phase == 6 && cmv_anim_age >= 282) cmv_acquisition_done = true;
if (cmv_phase == 7 && cmv_anim_age >= 343)
{
    cmv_anim_age = 342;
    cmv_teleport_done = true;
}
