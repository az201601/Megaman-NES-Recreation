# MM1 Stage Select Audio — GMS 1.4.1760

## Scope

Captured from the user-supplied USA ROM with JSNES 2.1.0, not generated or taken from a later remake. Title idle and title Start transition need no music or sound effects. Stage select needs music and a navigation effect. Boss confirmation/intro audio will be measured and added with that sequence, not triggered yet.

## Import resources

```
Sounds
└── Stage Select
    ├── Music
    │   ├── snd_mm1_stage_select_pulse
    │   └── snd_mm1_stage_select_triangle
    └── Effects
        └── snd_mm1_stage_select_move
```

- Import the two matching OGG files as **Compressed** sounds, not Uncompressed or Streamed. Keep them mono, at 44100 Hz, volume 1, pitch 1, centre pan. They must have identical settings and remain loaded together. Use the new audio engine.
- Import `snd_mm1_stage_select_move.wav` as **Uncompressed**, mono, 44100 Hz, volume 1, pitch 1, centre pan.
- `stage_select_music_reference.wav` is a listening reference only. Do NOT play it along with the two stems.
- `Sources/` holds lossless music stem masters, not additional resources to import.

The two compressed stems are for a looping audio sync group. `audio_play_in_sync_group` returns a group track order, NOT an ordinary voice ID. Gain changes below therefore target the sound asset, not that return value. The menu owns these sound assets while it is active and resets their gain when it leaves.

## Measurements and processing

- Music register pattern repeats after 256 emulated frames. Equal-length stems: 187854 samples at 44100 Hz, approximately 4.259728 seconds.
- First nonzero music note writes begin two emulated frames after stage-select graphics appear. Alarm 0 starts the group after a nominal two GMS-step delay; device buffering and room-event timing are not hardware-exact.
- Left/right navigation invokes an effect on both pulse channels; the triangle music continues. Up/down did not invoke this effect in the tested initial state.
- At the tested navigation boundary, both pulse channels are silenced for one frame, then the effect plays its two pitches before pulse music resumes. Captured replacement window: 13 emulated frames, 9540 samples (~0.216327 seconds). The WAV retains the initial silent frame.
- Stems retain the centred emulator mixer channel weights. The same fixed 2.5 gain is applied to music and effect. No independent peak normalisation.
- Music files have 64-sample (~1.45 ms) boundary ramps to reduce PCM loop clicks caused by non-repeating oscillator phase. Effect uses 32-sample endpoint ramps. OGG is lossy. These are practical playback assets, not a cycle/sample-exact APU implementation.
- Verified both OGG files decode to identical sample counts and rates; WAV headers and sample counts checked. GMS runtime has to be tested on the user's Windows project.

## Object changes

Object: Objects > Stage Select > obj_mm1_stage_select.

### Create — append to existing initialisation

```gml
music_sync_group = -1;
move_voice = -1;
pulse_restore_steps = 0;

// Nominal two-step delay before the first music note.
alarm[0] = 2;
```

### Alarm 0 — new event

```gml
audio_sound_gain(snd_mm1_stage_select_pulse, 1, 0);
audio_sound_gain(snd_mm1_stage_select_triangle, 1, 0);

music_sync_group = audio_create_sync_group(true);
audio_play_in_sync_group(music_sync_group, snd_mm1_stage_select_pulse);
audio_play_in_sync_group(music_sync_group, snd_mm1_stage_select_triangle);
audio_start_sync_group(music_sync_group);
```

### Step — replace existing event

```gml
// Restore pulse music without restarting its playback position.
if (pulse_restore_steps > 0)
{
    pulse_restore_steps -= 1;

    if (pulse_restore_steps == 0)
    {
        audio_sound_gain(snd_mm1_stage_select_pulse, 1, 0);
    }
}

selection_timer = (selection_timer + 1) mod 32;

if (selection_delay > 0)
{
    selection_delay -= 1;

    if (selection_delay == 0)
    {
        selected_boss += pending_move;

        if (selected_boss > 5) selected_boss = 0;
        if (selected_boss < 0) selected_boss = 5;

        selection_timer = 0;
        pending_move = 0;

        // Replace the pulse music, keeping triangle music running.
        audio_sound_gain(snd_mm1_stage_select_pulse, 0, 0);

        if (move_voice != -1)
        {
            audio_stop_sound(move_voice);
        }

        move_voice = audio_play_sound(snd_mm1_stage_select_move, 10, false);
        pulse_restore_steps = 13;
    }
}
else
{
    var move_input;
    move_input = keyboard_check_pressed(vk_right)
               - keyboard_check_pressed(vk_left);

    if (move_input != 0)
    {
        pending_move = move_input;
        selection_delay = 2;
    }
}
```

### Other > Room End — replace existing font-only cleanup

```gml
if (music_sync_group != -1)
{
    audio_stop_sync_group(music_sync_group);
    audio_destroy_sync_group(music_sync_group);
}

if (move_voice != -1)
{
    audio_stop_sound(move_voice);
}

audio_sound_gain(snd_mm1_stage_select_pulse, 1, 0);
audio_sound_gain(snd_mm1_stage_select_triangle, 1, 0);

font_delete(stage_select_font);
```

Keep the current Draw event unchanged. Keep the object non-persistent. No global audio-stop call is necessary. Do not add title sounds. Enter remains unimplemented on stage select until boss confirmation is built.

## Test checklist

1. Title idle, pressing Start and prompt flashing remain silent.
2. Stage-select music starts once and loops for at least 30 seconds without a pause/click.
3. Each accepted left/right move plays one effect. Holding the key does not repeat it.
4. The music's bass/triangle continues during a move while pulse music is replaced, then resumes in place.
5. Rapid alternating moves do not stack effects or leave pulse music muted.
6. On leaving the room later, menu music and its movement effect must stop.
