# MM5 landing audio — correction / review pending

The previous `snd_mm5_megaman_land.wav` was rejected by the user as the wrong sound and has been removed. Do not reimport it or restore its playback block. The shipped Step-event checkpoint now leaves landing audio disabled; movement and collision are unchanged.

The historical `tools/rom-recovery/extract-landing.mjs` forwarded selected writes to a fresh APU, which did not preserve the running game's noise-generator state, and boosted the gain 2.5x. Its event-timing assertions did not establish audible correctness. That extractor is now disabled to prevent regenerating the rejected asset.

## Review files

See `Review/README.md`. The new candidate uses the original running game's noise channel instead, alongside an original full-mix reference. These are comparison files, **not yet an approved replacement**. No subjective listening or hardware-identical claim is made by the code checks.
