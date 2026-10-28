# Cut Man stage music

Resource: Sounds > Cut Man > Stage > `snd_mm1_cutman_stage`.

Import `snd_mm1_cutman_stage.wav` with GMS sound type **Compressed**, mono, 44100 Hz, volume1, pitch1, centre pan. It is a looping music-only track, not a one-shot intro. Use the new audio engine. Keep this independent from the boss intro audio. Event instructions are in the first-screen graphics README.

Captured from the supplied USA ROM with JSNES 2.1.0. Compared per-frame APU register-write sequences over 8000 stage frames: a steady-state 2304-frame music period repeats exactly across complete subsequent periods. The first pass contains arrival/teleport audio overrides, so this file uses the clean second pass at original confirmation-relative frames2720..5023, not the first pass. No player input or enemy-triggering movement was supplied during capture.

PCM master: mono16bit, 44100 Hz, 1690683 samples, duration38.337483 seconds. Fixed gain2.5 matches the prior captures; peak approximately0.816 without clipping. 64-sample endpoint ramps reduce file-loop clicks. This is an emulator-derived PCM playback approximation, not a cycle-exact live APU engine. Hardware/runner buffering and compressed-loop playback must still be checked on the user's GMS Windows build.

This asset is sufficient for the current static-screen test. Arrival/teleport, landing, shooting, damage and other gameplay sound effects must be prepared with their corresponding behaviours. Do not add a score or points display/sound. Channel stealing between gameplay sounds and music will require a later playback refinement; simply mixing gameplay effects over this full track is not claimed to be NES-exact.
