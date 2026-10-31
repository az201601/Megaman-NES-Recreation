// Asynchronous > Audio Playback, NOT Audio Recording / Playback Ended.
if (!charge_audio_closing && charge_audio_queue != -1)
{
    if (ds_map_find_value(async_load, "queue_id") == charge_audio_queue
        && ds_map_find_value(async_load, "queue_shutdown") == 0)
    {
        if (ds_map_find_value(async_load, "buffer_id") == charge_audio_loop)
        {
            audio_queue_sound(charge_audio_queue, charge_audio_loop, 0,
                buffer_get_size(charge_audio_loop));
        }
    }
}
// GameMaker owns async_load; never destroy it.
