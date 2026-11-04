// Player context. Restart only this refill voice, never stop music/all sounds.
if (mm5_refill_voice != -1) audio_stop_sound(mm5_refill_voice);
mm5_refill_voice = audio_play_sound(snd_mm5_health_refill, 12, false);
