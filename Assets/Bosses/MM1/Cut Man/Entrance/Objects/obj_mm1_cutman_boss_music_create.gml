// Invisible audio-only instance; NO Step/Draw, nonpersistent. Native opening once + loop.
boss_audio_closing = false;
boss_music_queue = -1;
boss_music_voice = -1;
boss_intro_buffer = buffer_load(working_directory + "mm1_cutman_boss_intro.pcm");
boss_loop_buffer = buffer_load(working_directory + "mm1_cutman_boss_loop.pcm");
if (boss_intro_buffer == -1 || boss_loop_buffer == -1)
{
    scr_mm1_cutman_boss_music_dispose();
    show_error("Missing boss PCM Included Files. Export both at working-directory root.", true);
    exit;
}
boss_music_queue = audio_create_play_queue(buffer_s16, 48000, audio_mono);
if (boss_music_queue == -1)
{
    scr_mm1_cutman_boss_music_dispose();
    show_error("Could not allocate Cut Man boss music queue.", true);
    exit;
}
audio_queue_sound(boss_music_queue, boss_intro_buffer, 0, buffer_get_size(boss_intro_buffer));
audio_queue_sound(boss_music_queue, boss_loop_buffer, 0, buffer_get_size(boss_loop_buffer));
audio_queue_sound(boss_music_queue, boss_loop_buffer, 0, buffer_get_size(boss_loop_buffer));
boss_music_voice = audio_play_sound(boss_music_queue, 1, false);
