// Run in obj_mm5_charge_audio context, not directly in player context.
if (charge_audio_closing || charge_audio_queue != -1) return false;
charge_audio_queue = audio_create_play_queue(buffer_s16, 48000, audio_stereo);
if (charge_audio_queue == -1) return false;
// Intro once; two steady cycles queued ahead. Do NOT loop the whole queue.
audio_queue_sound(charge_audio_queue, charge_audio_intro, 0, buffer_get_size(charge_audio_intro));
audio_queue_sound(charge_audio_queue, charge_audio_loop, 0, buffer_get_size(charge_audio_loop));
audio_queue_sound(charge_audio_queue, charge_audio_loop, 0, buffer_get_size(charge_audio_loop));
charge_audio_voice = audio_play_sound(charge_audio_queue, 1, false);
if (charge_audio_voice == -1)
{
    audio_free_play_queue(charge_audio_queue);
    charge_audio_queue = -1;
    return false;
}
return true;
