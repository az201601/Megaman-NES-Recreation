# MM5 landing sound — user-approved direct recording

Use `snd_mm5_megaman_land.wav`, now sourced from the music-free direct-game recording the user identified as correct. The earlier independently rendered and isolated review candidates were rejected; do not use those.

## Format / exact trim

- Stereo PCM16, 48000 Hz; 6937 sample frames (~0.144521 seconds).
- Source recording SHA256: `e4c7a4d9fe3b1b6b6f2c6f08296e09571132ed086ffc4cbcc1f070e87cc9a90f`.
- Source sample frames `[41351, 48288)` copied byte-for-byte, retaining 5 ms silence before the first and after the last nonzero sample.
- No gain boost, normalization, resampling, pitch change, fade, channel isolation, or fresh APU renderer.
- Surrounding silence is trimmed; the original sound-queue delay is not retained as artificial leading silence. Playback is triggered once on the landing event.

## Reproduce

In `tools/rom-recovery`, install pinned dependencies and generate the Napalm Man opening snapshot with `mm5-start.mjs`, then `mm5-stage.mjs`. Run `node record-jump-sfx.mjs`. It queues the game's stop command $F0, waits for silence, performs a jump, and records the original full APU output. It asserts the music-stop tail is silent and exactly one landing request $1B occurs. It writes `/home/user/mm5-jump-game-audio-no-music.wav`.

Then run `python tools/rom-recovery/trim-approved-landing.py` from the repository root (or supply another recording path as its argument). It verifies that the output PCM exactly equals the selected source slice. Identical reproduction assumes the same ROM, pinned emulator, and generated snapshot sequence. This is emulator output accepted by the user, not a claim of hardware/cycle-perfect recording.

## GMS 1.4.1760 installation

1. Resource folder: **Sounds > Mega Man > MM5 > Movement**.
2. Open the existing **snd_mm5_megaman_land** sound resource and load this replacement WAV. If the resource was never created, create it with that exact name in that folder. Do not create a second copy with a different name. Keep default volume.
3. **Objects > Player > MM5 > obj_mm5_megaman > Step > Step > Execute Code**: ensure the following block exists once at the bottom, outside the movement loops:

```gml
if (landed_this_step)
{
    audio_play_sound(snd_mm5_megaman_land, 1, false);
}
```

If the block was commented out, uncomment it; do not add a second block. Current repository Step source includes it. No other movement, collision, Create or Draw changes are required.

Test one jump and landing, hold jump after landing to check no repeated bounce/sound, and stand still to check silence. Existing Cut Man stage music is unchanged. The hybrid playback does not reproduce NES music-channel stealing.
