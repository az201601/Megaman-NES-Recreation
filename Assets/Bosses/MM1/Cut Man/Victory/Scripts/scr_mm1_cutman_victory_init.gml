// Boss/owner context. GMS1.4.1760. Call ONCE in Create, not every final hit.
// Source subsystem only; player/audio/art/screen bridges must be connected first.
cmv_phase = 0;
cmv_timer = 0;
cmv_tick = -1;
cmv_advanced = false;
cmv_move = 0;
cmv_snap = false;
cmv_center = 3200;
cmv_direction = 0;
cmv_reward_requested = false;
// Serialized phase entries; animation/audio receiver must acknowledge completion.
cmv_entry_event = 0;
cmv_entry_serial = 0;
cmv_defeat_done = false;
cmv_acquisition_done = false;
cmv_teleport_done = false;
cmv_screen_done = false;
// Owned finite victory audio. Separate from accepted boss/stage PCM owners.
cmv_audio_serial = -1;
cmv_audio_closing = false;
cmv_audio_paused = false;
cmv_clear_started = false;
cmv_acquisition_started = false;
cmv_acquisition_sound_requested = false;
cmv_clear_voice = -1;
cmv_acquisition_voice = -1;
// Boss defeat particles remain visual after body disappearance is acknowledged.
cmv_fx_started = false;
cmv_fx_count = 0;
cmv_fx_age = 0;
cmv_fx_tick = -1;
