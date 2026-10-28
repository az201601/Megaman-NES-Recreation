# Landing audio comparison — please review before installation

- `mm5_original_mix_landing_reference.wav`: approximately one second of original emulator playback, including stage music and a normal Napalm Man jump landing. Landing occurs about 0.42 seconds into the clip; its sound follows the game's queue delay. No sound-register writes were intercepted or suppressed.
- `snd_mm5_megaman_land_review.wav`: approximately 0.166 seconds of the same run's original noise-channel output during the landing SFX. Other channels are excluded only at the output mixer, not by changing their registers or running a fresh APU. The clip includes the queue delay, excludes music's return to the noise channel, and has short edge fades. No gain boost or normalization is applied.

Both WAVs are mono PCM16 at **48000 Hz**, matching the sample rate restored from the emulator snapshot. The reference is a JSNES render of the supplied ROM, not a hardware recording. Noise-channel isolation is not identical to subtracting a sound out of the NES nonlinear full mix.

Reproduce: install pinned dependencies in tools/rom-recovery, generate mm5-start.mjs then mm5-stage.mjs, and run review-landing.mjs. Its tests assert identical noise-channel state at all 75 observed frames and identical noise-register writes between full playback and the isolated-output run. These checks demonstrate preservation of the running channel, not subjective correctness of the candidate.

Do not install or re-enable the candidate until the user confirms its sound. The old asset was removed and the controller's playback block disabled. The landing event itself remains available for later approved audio and animation. Existing MM1 stage music and gameplay physics have not changed.
