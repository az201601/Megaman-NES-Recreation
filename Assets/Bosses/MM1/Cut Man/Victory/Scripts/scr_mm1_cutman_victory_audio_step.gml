// Boss/owner context, called by sole player victory coordinator. argument0 frozen.
// Finite approved WAV sources,including confirmed MM5 weapon-get at original level.
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
        if (cmv_screen_voice != -1) audio_pause_sound(cmv_screen_voice);
        if (cmv_demo_voice != -1) audio_pause_sound(cmv_demo_voice);
        if (cmv_teleport_voice != -1) audio_pause_sound(cmv_teleport_voice);
        cmv_audio_paused = true;
    }
    return;
}
if (cmv_audio_paused)
{
    if (cmv_clear_voice != -1) audio_resume_sound(cmv_clear_voice);
    if (cmv_acquisition_voice != -1) audio_resume_sound(cmv_acquisition_voice);
    if (cmv_screen_voice != -1) audio_resume_sound(cmv_screen_voice);
    if (cmv_demo_voice != -1) audio_resume_sound(cmv_demo_voice);
    if (cmv_teleport_voice != -1) audio_resume_sound(cmv_teleport_voice);
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
    if (cmv_entry_event == 6 && cmv_screen_started && !cmv_screen_music_started)
    {
        cmv_screen_music_started = true;
        if (cmv_clear_voice != -1) audio_stop_sound(cmv_clear_voice);
        cmv_clear_voice = -1;
        // Approved original native output level. Default gain1,NOT2x/normalized.
        // Finite scene excerpt,NOT a verified seamless loop. Never replay on Draw.
        cmv_screen_voice = audio_play_sound(snd_mm5_weapon_get, 12, false);
    }
    // Native acquisition sound is explicitly stopped before teleport, not
    // allowed to bleed into teleport/custom-screen music.
    if (cmv_entry_event == 5 && cmv_acquisition_voice != -1)
    {
        audio_stop_sound(cmv_acquisition_voice);
        cmv_acquisition_voice = -1;
    }
}
// Native F0 is before descent/landing, not delayed until teleport entry.
if (cmv_acquisition_sound_ended && cmv_acquisition_voice != -1)
{
    audio_stop_sound(cmv_acquisition_voice);
    cmv_acquisition_voice = -1;
}
if (cmv_phase == 6 && cmv_acquisition_sound_requested
    && !cmv_acquisition_sound_ended && !cmv_acquisition_started)
{
    cmv_acquisition_started = true;
    cmv_acquisition_voice = audio_play_sound(snd_mm6_weapon_acquisition, 12, false);
}
// Approved native player Cutter sound25, once per actual demo throw.
if (cmv_phase == 8 && cmv_demo_audio_serial != cmv_demo_throw_serial)
{
    cmv_demo_audio_serial = cmv_demo_throw_serial;
    if (cmv_demo_voice != -1) audio_stop_sound(cmv_demo_voice);
    cmv_demo_voice = audio_play_sound(snd_mm1_cutman_rolling_cutter_throw, 11, false);
}
// Native departure1359 is one update after phase7 entry1358. Retain full tail;
// do NOT reproduce native F0 at1399 that cut the first review short.
if (cmv_phase == 7 && cmv_anim_age >= 283 && cmv_teleport_voice == -1)
    cmv_teleport_voice = audio_play_sound(snd_mm6_megaman_teleport_out, 12, false);
