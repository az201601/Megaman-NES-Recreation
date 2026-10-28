# Cut Man stage music — corrected opening and loop

## What was wrong

The earlier export incorrectly started at confirmation-relative ROM frame2720. That is late in the repeating section, not the original musical opening. It omitted the one-time opening phrase and entered the cycle at the wrong point. A repeated APU write pattern alone did not establish the correct song start. The previous file/instructions are superseded.

A fresh JSNES2.1.0 trace of the supplied USA ROM shows:

- Stage music command5 is requested at frame413.
- First audible-note register writes occur at416.
- One-time opening occupies416..607 (192 emulated frames).
- Repeating section starts608; its next passes start2912 and5216 (2304 frames apart).
- Pulse1 sequence pointer returns from $A066 to $9F3E at planning frames2911 and5215, matching its first arrival there at607. The following audio frames form the loop-entry boundaries.
- The old start2720 is 2112 frames into the repeating section, i.e. its final192 frames rather than its beginning.

The music-only recapture suppresses sound requests32 and248 at the sound-request routine during the player's arrival, without changing the music command. These transient emulator hooks do not modify the ROM on disk. Sound effects will be captured separately with their gameplay behaviour. All five emulator channels are explicitly centred before capture; this avoids averaging its default artificial stereo panning through a nonlinear mixer.

## Files

- `snd_mm1_cutman_stage_intro.wav`: one-time opening, mono PCM16,44100 Hz,140890 samples,3.194785 seconds.
- `snd_mm1_cutman_stage.wav`: corrected main-loop entry, mono PCM16,44100 Hz,1690684 samples,38.337506 seconds. Replaces the old wrongly phased file.
- `cutman_stage_corrected_reference.wav`: opening followed by one main cycle, for audition only. Do not loop this whole reference: the opening should not repeat.
- `Playback/mm1_cutman_stage_intro.pcm` and `Playback/mm1_cutman_stage_loop.pcm`: headerless little-endian PCM16 copies for GMS1.4 queued playback.
- `PLAYBACK-GMS14.md`: exact replacement object events and Included Files setup.

Shared fixed gain2.5; maximum peak <0.748, no clipping. 64-sample ramps at the opening's start and main loop's endpoints reduce PCM seam clicks. No independent normalisation, tempo change or pitch shift. This remains emulator-derived audio, not a hardware/cycle-exact NES APU implementation. The waveform also includes emulator filtering and small seam treatment.

## Playback correction is required

Replacing only the old WAV does not restore the opening. The correct arrangement is: opening ONCE, then main section repeatedly. Do not use a room Alarm to estimate the opening's duration: the 60-step room clock is not the audio sample clock.

The accompanying guide queues opening + main + main as raw PCM, then replenishes the main buffer in the Async Audio Playback event. This prevents the introductory phrase from repeating and avoids a frame-timed intro-to-loop handoff. Existing imported Sound resources may remain as organised source/audition resources, but the stage object must not also play them while the queue is active.

## Validation / limitations

- Verified the driver pointer loop-back and note-write differences between the old and correct starts.
- Verified WAV/PCM bytes match, all formats/rates, raw byte sizes, headroom and sample counts.
- Queued reference data is the opening followed by main cycles at exact sample boundaries.
- GMS1.4 compilation, runner output and its async queue handling have NOT been executed in this sandbox. Test on the user's Windows project. A correct sample queue does not assert bit-identical hardware output or frame-exact scene alignment.

Original scoring remains excluded. Gameplay effects/channel stealing are separate future work; do not label mixed effects over the full music file as an exact NES channel emulation.
