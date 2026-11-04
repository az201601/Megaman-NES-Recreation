// Asynchronous > Audio Playback. GameMaker owns async_load; never destroy it.
if (boss_audio_closing || boss_music_queue == -1) exit;
if (ds_map_find_value(async_load, "queue_id") != boss_music_queue) exit;
if (ds_map_find_value(async_load, "queue_shutdown") != 0) exit;
if (ds_map_find_value(async_load, "buffer_id") == boss_loop_buffer)
    audio_queue_sound(boss_music_queue, boss_loop_buffer, 0, buffer_get_size(boss_loop_buffer));
