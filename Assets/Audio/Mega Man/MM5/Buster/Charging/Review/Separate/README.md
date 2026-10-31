# Separate charge / release audio reviews — approval pending

These replace the unsuitable combined sequence previews. No ordinary-shot sound is present in any of these three files. No GMS playback changes; do NOT import until user hearing approval and final resource instructions.

| File | Contents |48000Hz stereoPCM16 frames|Duration|
|---|---|---|---|
|mm5-charge-only-preview.wav|Charging only; natural held-input excerpt, no release|171917|3.5816041667s|
|mm5-mid-release-only-review.wav|Intermediate release only, no prior charging sound|12216|0.2545s|
|mm5-full-release-only-review.wav|Full release only, no prior charging sound|19564|0.4075833333s|

## Source / recording

Actual original-game JSNES full APU output, supplied MM5 ROM, default weapon, F0 music stop through original command queue;150 warmup updates and settled peak0. No synthesis, muting/APU-channel isolation, normalization, resampling, filtering or sound layering. Not a Mesen audio capture.

Charge clip: original natural B press at10, keep holding through259. Ordinary press shot plays earlier in emulator but capture starts35, after it finishes. Initial recorded35..39 output is asserted entirely zero; one captured request22hex at43, no1A/20/21. Ends while effect is still running: an honest preview excerpt, NOT a seamless or import-ready loop. Only leading PCM-zero silence trimmed; end is recording boundary. Native steady register pattern repeats every8updates from110, verified17 repetitions; waveform-loop seam still needs separate work.

Release clips: **controlled meter preset**, not a natural full-duration charge. Original B press at10; capture starts35 after original press shot has ended. At40, while charge byte is still29 (below charge sound threshold), set ONLY player charge RAM38 to decimal40/intermediate (=28hex) or decimal80/full (=50hex), then release B. Original emission/projectile/sound-driver routines run unchanged and produce real intermediate/full projectiles,16pose, counter reset and sound20hex/21hex. No charge sound22 ever requested in these release takes. No precomputed sound-command queue injection for effects, no patched sound routines. This controlled setup intentionally avoids recording any preceding charge effect; do not call it an unmodified natural hold history.

Only silence removed from release edges, keeping5ms padding. PCM payload equality with raw interval asserted; capture is real gameplay full APU, not a mixed/extracted individual channel. Raw takes/traces ignored .work/charge-effect-{charge,mid,full}-raw.wav and charge-effect-{charge,mid,full}.json. Reproduce record-charge-effects.mjs; run verify-charge-audio.mjs for regeneration plus independent natural transition checks.

## Correct playback model

Natural earlier complete sequences verify successful release replaces/stops original charging voice, not two independent tracks layering indefinitely. Intermediate request51 -> pulse2 silence4004=30 at52; full request91 -> release voice4004=7D at93, silence at100, with no return to old charging voice. These are captured driver updates, not exact GMS scheduling instructions. Later GMS integration should stop its charging playback handle before beginning the selected release sound, rather than bake press/charge/release together or play both sampled tracks concurrently.

Existing approved ordinary shot/landing audio, corrected projectile sprites and current working controller are untouched. Review only; charge loop/cancel/blocked-release audio semantics still not certified.

## Subsequent user approval

User confirmed these separate reviews "seems good to me". Approval pending notes above are historical. Release-only files promoted byte-for-byte to Charging/snd_mm5_buster_mid.wav and snd_mm5_buster_full.wav with separate import instructions. Charge-only preview character accepted, but excerpt still is NOT a verified loop/import-ready sound. Release resource import confirmation and charging implementation remain pending.
