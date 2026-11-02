// Boss/owner context, called by sole player victory coordinator. argument0 frozen.
// Finite approved WAV resources only; custom screen music is NOT substituted.
// Acquisition animator raises cmv_acquisition_sound_requested at energy-circle
// onset (not merely on acquisition entry/jump). It owns animation completion.
var serial_new;
if (cmv_audio_closing) return;
serial_new = cmv_audio_serial != cmv_entry_serial;
// Terminal cleanup wins even on a frozen/duplicate phase update.
if (serial_new && (cmv_entry_event == 7 || cmv_entry_event == 8))
{
    cmv_audio_serial = cmv_entry_serial;
    scr_mm1_cutman_victory_audio_dispose();
    return;
}
if (argument0)
{
    if (!cmv_audio_paused)
    {
        if (cmv_clear_voice != -1) audio_pause_sound(cmv_clear_voice);
        if (cmv_acquisition_voice != -1) audio_pause_sound(cmv_acquisition_voice);
        cmv_audio_paused = true;
    }
    return;
}
if (cmv_audio_paused)
{
    if (cmv_clear_voice != -1) audio_resume_sound(cmv_clear_voice);
    if (cmv_acquisition_voice != -1) audio_resume_sound(cmv_acquisition_voice);
    cmv_audio_paused = false;
}
if (serial_new)
{
    cmv_audio_serial = cmv_entry_serial;
    if (cmv_entry_event == 2 && !cmv_clear_started)
    {
        cmv_clear_started = true;
        cmv_clear_voice = audio_play_sound(snd_mm6_stage_clear, 12, false);
    }
    // Native acquisition sound is explicitly stopped before teleport, not
    // allowed to bleed into teleport/custom-screen music.
    if (cmv_entry_event == 5 && cmv_acquisition_voice != -1)
    {
        audio_stop_sound(cmv_acquisition_voice);
        cmv_acquisition_voice = -1;
    }
}
if (cmv_phase == 6 && cmv_acquisition_sound_requested && !cmv_acquisition_started)
{
    cmv_acquisition_started = true;
    cmv_acquisition_voice = audio_play_sound(snd_mm6_weapon_acquisition, 12, false);
}
