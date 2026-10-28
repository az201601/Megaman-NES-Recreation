# GMS 1.4 — corrected Cut Man stage playback

Keep folders/resources for the stage unchanged. Update ONLY the audio setup in Objects > Cut Man > Stage > `obj_mm1_cutman_stage`. Keep that object non-persistent, with one room instance. Do not change the working tiles, background, block objects or intro connection.

## 1. Add the runtime files

Under **Included Files**, add these two files from the pack's Playback directory:

- `mm1_cutman_stage_intro.pcm`
- `mm1_cutman_stage_loop.pcm`

Set them to export for Windows to the game's working directory/root, with exactly these filenames (not inside a runtime Playback subdirectory). Do not import .pcm files as Sound resources. They are raw mono signed16 little-endian samples at44100 Hz, without WAV headers. Keep the source files under Assets/Audio/Cut Man/Stage/Playback in the repository.

The two WAV masters may be imported/updated as `snd_mm1_cutman_stage_intro` and `snd_mm1_cutman_stage` under Sounds > Cut Man > Stage for organisation/audition. The queue below does not use those Sound resources. Do not leave the old audio_play_sound(snd_mm1_cutman_stage,...) call active, or music will play twice.

Use the new audio engine. This guide uses buffer and audio-play-queue APIs, not a frame-timed Alarm to switch between phrases.

## 2. Replace the Create event

Retain any other independently added stage gameplay initialisation if applicable. For the current static scene the full event is:

```gml
// Existing scenery setup: keep it running once.
scr_mm1_cutman_screen01_tiles();

stage_music_queue = -1;
stage_music_voice = -1;
stage_audio_closing = false;

stage_intro_buffer = buffer_load(
    working_directory + "mm1_cutman_stage_intro.pcm"
);
stage_loop_buffer = buffer_load(
    working_directory + "mm1_cutman_stage_loop.pcm"
);

if (stage_intro_buffer == -1 || stage_loop_buffer == -1)
{
    show_error("Cut Man music PCM files are missing from Included Files / the game working directory.", true);
    exit;
}

// Preserve the existing nominal stage-entry delay.
alarm[0] = 2;
```

## 3. Replace Alarm 0

```gml
stage_music_queue = audio_create_play_queue(
    buffer_s16,
    44100,
    audio_mono
);

// Opening once, then two main cycles queued ahead.
audio_queue_sound(
    stage_music_queue,
    stage_intro_buffer,
    0,
    buffer_get_size(stage_intro_buffer)
);

audio_queue_sound(
    stage_music_queue,
    stage_loop_buffer,
    0,
    buffer_get_size(stage_loop_buffer)
);

audio_queue_sound(
    stage_music_queue,
    stage_loop_buffer,
    0,
    buffer_get_size(stage_loop_buffer)
);

// Queue refill handles repetition; do not loop the whole queue.
stage_music_voice = audio_play_sound(stage_music_queue, 1, false);
```

## 4. Add Asynchronous > Audio Playback

This is **Audio Playback**, not Audio Recording or a modern Audio Playback Ended event.

```gml
if (!stage_audio_closing && stage_music_queue != -1)
{
    if (ds_map_find_value(async_load, "queue_id") == stage_music_queue
        && ds_map_find_value(async_load, "queue_shutdown") == 0)
    {
        if (ds_map_find_value(async_load, "buffer_id") == stage_loop_buffer)
        {
            // Keep another complete cycle queued ahead.
            // Buffers are immutable while in the queue.
            audio_queue_sound(
                stage_music_queue,
                stage_loop_buffer,
                0,
                buffer_get_size(stage_loop_buffer)
            );
        }
    }
}
```

Do not delete async_load: GameMaker owns that map.

## 5. Replace Other > Room End

```gml
stage_audio_closing = true;
alarm[0] = -1;

// Free the queue BEFORE deleting the data it reads.
if (stage_music_queue != -1)
{
    audio_free_play_queue(stage_music_queue);
    stage_music_queue = -1;
}

if (stage_intro_buffer != -1)
{
    buffer_delete(stage_intro_buffer);
    stage_intro_buffer = -1;
}

if (stage_loop_buffer != -1)
{
    buffer_delete(stage_loop_buffer);
    stage_loop_buffer = -1;
}

stage_music_voice = -1;
```

No Step-event audio timer is needed. Remove/replace the old music-only Alarm0 and Room End code rather than keeping both playback paths.

## 6. Test

1. Restart the game from the title and enter Cut Man's stage.
2. Compare its first phrase against `cutman_stage_corrected_reference.wav`.
3. Listen across the opening-to-main transition at ~3.195 seconds.
4. Listen through at least100 seconds. The opening must play once only; subsequent main cycles must continue without a restart of the opening, pause or doubled music.
5. When room exits are added, confirm that leaving the stage stops audio and re-entry starts at the opening again.

These exact GMS1.4 events still need Windows runner verification. Source capture and file-level checks were performed in the repository; the editable GMS project is not present here.

## API references

Audio queue APIs use raw sample format/rate/channel parameters, and the playback event returns queue_id, buffer_id and queue_shutdown. Free a play queue before deleting its buffers. Current reference pages (not a claim that this sandbox executed GMS1.4):

- https://manual.gamemaker.io/monthly/en/GameMaker_Language/GML_Reference/Asset_Management/Audio/Audio_Buffers/audio_create_play_queue.htm
- https://manual.gamemaker.io/monthly/en/GameMaker_Language/GML_Reference/Asset_Management/Audio/Audio_Buffers/audio_queue_sound.htm
- https://manual.gamemaker.io/monthly/en/GameMaker_Language/GML_Reference/Asset_Management/Audio/Audio_Buffers/audio_free_play_queue.htm
