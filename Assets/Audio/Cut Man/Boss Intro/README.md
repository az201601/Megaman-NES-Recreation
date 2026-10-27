# Cut Man — Boss Intro Audio

## Resource

Folder: Sounds > Cut Man > Boss Intro

Name: `snd_mm1_cutman_boss_intro`

File: `snd_mm1_cutman_boss_intro.wav`

GMS 1.4 sound settings: Uncompressed, mono, 44100 Hz, volume 1, pitch 1, centre pan. Play ONCE, not looped. The capture contains the confirmation sweep and introduction music together. Do not layer a stage-select movement beep over it. Stage-select music must stop when entering the intro.

## Capture and removal of points-specific audio

Captured the supplied USA ROM with JSNES 2.1.0. The original score-tally sequence invokes sound ID 0x21 through the JSR at CPU address $B909 (bytes 20 77 C4), on the relevant switched ROM bank. During capture only, that specific call site was replaced with three NOP reads, guarded by the expected underlying bytes. This is a transient emulator read override, not a modification of the ROM on disk. It prevents points-tally sound calls without disabling the background music engine or changing the intro's timing.

Validation: compared against an otherwise identical unmodified capture. Samples before approximately 4.660748 seconds are identical (including the first four seconds); differences begin only when the points effect would start. The points feature is intentionally absent from the recreation, including its sound. The original early name/text reveal does not get an invented typing sound.

The exported interval corresponds to original rendered frames 3–401. It excludes the lingering stage-select note on frame2 and does not include Cut Man stage music. Room-entry alignment is to be handled by the upcoming GMS event code rather than claiming this capture alone provides hardware-exact audiovisual timing.

Format: mono PCM16, 44100 Hz, 292788 samples, duration 6.639184 seconds. Fixed gain 2.5, matching the stage-select capture's gain convention; peak approximately 0.793, no clipping. 64-sample endpoint ramps reduce file-boundary clicks. This is an emulator-derived playback asset, not a sample/cycle-exact APU implementation.

## Status

Audio file prepared and headers/sample count checked. GMS playback and its timing against the introduction animation still require testing in the user's Windows project. Do not trigger it from stage select until the Cut Man intro room is implemented.
