# Basic buster sound — review only, not installed/approved yet

`snd_mm5_buster_shot_review.wav`: stereoPCM16,48000Hz,9242frames (0.1925416667s),37012bytes. Actual full-game APU output recorded with JSNES2.1.0 from supplied MM5 USA ROM; not synthesized, channel-isolated or a Mesen audio capture. User must listen before resource installation.

Reproduce `node tools/rom-recovery/record-buster-sfx.mjs` after stage snapshot/dependencies. Uses the same direct recording approach as the user-approved landing sound: queues original music-stop commandF0, waits150 frames, verifies last50 warmup frames have peak0; records40 frames, fresh B at10/released11. Exactly one sound request1Ahex (=26), no unrelated requests, player stays in standing state0. Raw31950-frame take remains regenerable in ignored .work/buster-shot-full-take.wav; request trace in .work/buster-direct-recording.json.

Review clip removes ONLY PCM-zero leading/trailing silence, retaining240frames (5ms) padding each side. Raw sample interval[9405,18647). No gain/normalization, filtering, mixing, resampling or waveform editing. PCM payload equality with the retained raw interval is asserted. This is a short shot, not a charge or slide sound.

No Sound resource or GML playback changes yet. Ask user to approve by hearing the review recording; do not silently replace approved landing audio or queue music behaviour.
