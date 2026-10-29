// Stop only this manager's charge audio. Keep immutable PCM buffers for reuse.
if (charge_audio_voice != -1)
{
    audio_stop_sound(charge_audio_voice);
    charge_audio_voice = -1;
}
if (charge_audio_queue != -1)
{
    audio_free_play_queue(charge_audio_queue);
    charge_audio_queue = -1;
}
