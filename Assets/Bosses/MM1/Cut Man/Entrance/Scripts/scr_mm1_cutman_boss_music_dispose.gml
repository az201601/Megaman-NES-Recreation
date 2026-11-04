// Audio-only object context. Idempotent Room End/Destroy. Queue freed BEFORE buffers.
boss_audio_closing = true;
if (boss_music_queue != -1)
{
    audio_free_play_queue(boss_music_queue);
    boss_music_queue = -1;
}
if (boss_intro_buffer != -1) { buffer_delete(boss_intro_buffer); boss_intro_buffer = -1; }
if (boss_loop_buffer != -1) { buffer_delete(boss_loop_buffer); boss_loop_buffer = -1; }
boss_music_voice = -1;
