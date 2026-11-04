# Approved charged release sounds — GMS1.4.1760 import

User reviewed separate charge/mid/full clips and confirmed "seems good to me". Release WAVs here are byte-identical copies of the approved release-only recordings; no ordinary-shot sound or charging sound included. Source/controlled-meter recording provenance remains in Review/Separate/README.md. No processing or metadata changes on promotion.

## Resources

Sounds > Mega Man > MM5 > Buster: create group Charging.

Create snd_mm5_buster_mid and load snd_mm5_buster_mid.wav.
Create snd_mm5_buster_full and load snd_mm5_buster_full.wav.

Use uncompressed/non-streamed audio if selecting compression; volume1, default audio group. One-shot sounds; do not loop or add playback calls yet. Keep existing approved snd_mm5_buster_shot and landing sound unchanged.

This is resource import only. Do not edit obj_mm5_buster_shot or any player Create/Step/Draw event. Charge implementation is not installed yet; accepted basic X firing remains intact.

## Charging audio status

Charge-only preview sound is also accepted for its audible character, but its end is an excerpt boundary, not a verified seamless loop. Do NOT import/repeat mm5-charge-only-preview.wav as a charging loop. Final intro/loop preparation and playback stop/cancel integration are separate checkpoints. Approval of preview is not proof of loop correctness. Successful release must replace/stop charging playback, not layer independent sampled charge and release tracks.

## Exact audio

- Intermediate:48000Hz stereoPCM16,12216 sampleframes,0.2545s.
- Full:48000Hz stereoPCM16,19564 sampleframes,0.4075833333s.

User import confirmation pending. No charged firing functionality enabled by these imports alone.
