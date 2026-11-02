// Boss/owner context. Idempotent; use for cancel, completion, Room End and Destroy.
// Never stop all sounds, accepted stage queues, UI or health-refill voices.
cmv_audio_closing = true;
if (cmv_clear_voice != -1) audio_stop_sound(cmv_clear_voice);
if (cmv_acquisition_voice != -1) audio_stop_sound(cmv_acquisition_voice);
if (cmv_screen_voice != -1) audio_stop_sound(cmv_screen_voice);
cmv_screen_voice = -1;
cmv_clear_voice = -1;
cmv_acquisition_voice = -1;
cmv_audio_paused = false;
