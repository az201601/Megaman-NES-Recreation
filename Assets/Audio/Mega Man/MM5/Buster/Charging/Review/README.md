## Superseded after user review

User correctly noted these sequences include an unwanted ordinary press shot and combine charge with release. They were whole-action previews, NOT acceptable separate resource effects. Do not import or use them for the next review. Corrected Separate/ contains charge-only preview and mid/full-release-only clips, with explicit controlled-meter provenance. Successful release replaces/stops charging audio in original game; later GMS integration must not layer independent charge/release tracks. Original sequence files retained only as provenance.

# MM5 charge audio — review sequences only

User hearing approval PENDING. Do not import these as Sound resources: each contains an actual full press/charge/release sequence, including the already-approved ordinary shot at the beginning. This lets user hear charging and the original release interaction, without artificial channel isolation or cuts through sound.

| File | Frames at48000Hz stereoPCM16 | Duration |
|---|---|---|
|mm5-charge-mid-sequence-review.wav|44981|0.9371041667s|
|mm5-charge-full-sequence-review.wav|84350|1.7572916667s|

tools/rom-recovery/record-charge-sfx.mjs reproduces recordings using full original-game JSNES APU output. Original F0 music stop queued before150 warmup updates; settled output peak0. No APU channels muted, waveform synthesis, channel mixing/gain/normalization/filtering/resampling or splicing. Not a Mesen audio capture. Input B at capture frame10, release51/intermediate or91/full. Requests exactly[1A,22,20] or[1A,22,21], with22 at43. All recording frames stay standing state0. Capture180updates/143777sampleframes each.

Silence-only PCM-zero trim with5ms padding: mid raw[9404,54385), full[9404,93754). Retained payload equals original PCM interval exactly by assertion. Raw full captures and APU/request traces in ignored .work/charge-{mid,full}-full-take.wav and charge-{mid,full}-direct-recording.json. Original basic and landing WAVs untouched.

These sequences do not prove a standalone charge loop boundary, duration or GMS playback/stop mechanism. Need separate loop/one-shot integration measurements before installing new sound resources. User should review whether charge and both releases sound correct, then proceed to import-ready effects separately.
