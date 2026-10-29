# MM5 charge — first standing threshold/release checkpoint

## Status

User confirmed basic-buster integration "all working" and agreed to measuring charging next. Basic X-fire/controller is the accepted checkpoint. No charging GML, new sprites, sound resources or playback changes installed by this measurement pass. Preserve accepted movement/slide/dust/ladder/basic-shot behaviour.

Run `node tools/rom-recovery/charge-values.mjs` from repository root, with existing rom-recovery dependencies and .work/mm5-stage.json snapshot. Uses original supplied MM5 USA ROM via JSNES2.1.0, normal gravity/default weapon, natural stationary stage state. Not hardware/cycle certification or Mesen capture.33 cases /2954 recorded updates plus per-case30 neutral warmup updates; three cases explicitly set facing left as in previous standing-left tests. No charge/projectile routine patches. Raw full rows/births/palette traces/requests are ignored .work/charge-values.json, console .work/charge-log.txt.

## Exact input/update convention

Hold B beginning update1, through updateH inclusive; release before updateH+1. Fresh press produces the already accepted ordinary shot on update1. Charge byte RAM38 remains0 that first update, then advances from1 on update2. No extra automatic shots while held, including180-update hold. This counter is NOT the16-update shooting-pose timer33.

| Last held charge counter | H in these tests | Release result |
|---|---|---|
|0..15|1..16|No additional release projectile (sampled1,2,15,16)|
|16..39|17..40|Additional ordinary buster (boundary17 and40 tested)|
|40..79|41..80|Intermediate charged projectile (boundaries41 and80 tested)|
|80..85 cycling|81 and longer|Full charged projectile (81..86,180 tested)|

Times at60updates/sec: intermediate hold41 updates ~0.683s, full hold81 updates1.35s, then release emits on following update. These exact inclusive-hold conventions avoid misleadingly labelling this as simply "40/80 frames after key-down". The underlying counter thresholds are40/80. Additional ordinary release after17..40 held updates is significant: charging is not just an overlay on press-only firing. Subthreshold residual counter remains H-1 after release in these cases; emitted release resets it0. Do not blindly assert every release immediately clears native RAM38.

Hold81+ counter cycles80,81,82,83,84,85 rather than growing/saturating indefinitely. Cycle resets to80 on update87;180-update hold ends83. This drives palette cycling. Successful release resets shooting pose timer16; next16 updates count16..1, then0.

## Projectile motion, spawn and slots

Standing player reference128,180.5. Ordinary release uses accepted X offsets+16/-15 and floorY-1; speed1075/256=4.19921875. Intermediate/full release speed exactly5px/update, fixedY179. First post-creation-update X153/right or103/left, implying native charged spawn+20/-20 followed by one same-update5px motion. Unlike basic shot, charged spawn is symmetric. This pass asserts first post-update coordinates, motion and fixedY; direct per-write spawn instrumentation for charged shots remains a follow-up (do not confuse inferred pre-movement spawn with direct write capture).

Animation IDs: basic18hex, intermediateA8hex, fullA9hex. Intermediate allocates ordinary available slot3 in empty scenario; full uses slot1 when all original shots have left. Early ordinary release atH17..20 allocates slot2 because original slot3 is still active. This is NOT proof of full-charge limits/replacement priorities while other shots occupy slots. No claims about damage, enemy collision, terrain behaviour, width/hitboxes or exact scrolling cleanup.

## Audio requests (recording still to do)

- Fresh press/ordinary release:1Ahex (=26), already approved basic sound.
- Charging:22hex (=34), requested once on hold update34 when prior counter32 advances33. Not a full-charge threshold notification. No repeated22 request during180-update hold; this alone does not establish whether the APU sound loops internally.
- Intermediate release:20hex (=32).
- Full release:21hex (=33).

Request IDs/timing are measured, not reviewed WAVs. Record actual full-game output with original F0 music-stop method and no channel isolation/synthesis, then have user listen before importing new audio. Existing approved basic/landing recordings unchanged.

## Visual data and colour provenance

Per-update original palette shadow bytes611..613 and rendered JSNES sprite palette0..7 logged separately. Shadow tables at original player-bank addresses8F47/8F4F/8F57 independently read from ROM offset36010 mapping8000; all held-state palette triples assert against original routine's counter-dependent table selection. Base indices0F,2C,11. First changed shadow at hold35; first corresponding rendered palette change in this trace at36. Early charging alternates palette colour1 with05,15,25 at successive counter bands; full charge cycles the three body colours in three2-update phases. Keep shadow-write vs displayed timing separate (release baseline shadow181 /rendered182 in long case). These observations are not final GMS draw-phase timing.

Asset extraction must use pinned Mesen0.9.9 palette adapter, not JSNES packedBGR colours as RGB. Face components must be retained for every pose/stride, following the corrected basic-shot extractor tests. No new PNG batch exported yet.

## Assertions / remaining work

Assertions cover stable standing state, one initial shot/no held autofire, charge counter advancement/cycle, boundaries16/40/80, subthreshold residual vs successful reset, request timing/types, release animation/speed/facing/slots, final coordinates and fixedY,16-update release pose, ROM-table/shadow palette correspondence. All passed.

Still unmeasured: charging/releasing during walk/air/continuous ladder/slide and exit, full/mid active-shot allocation limits, charge retention/cancellation under damage/menu/weapon switch, APU duration/loop/stop semantics, projectile OAM dimensions/frame/origins and native hitboxes. Do not implement or claim these from the stationary sweep. Next: movement/slot interactions, then original projectile art and actual charge/release audio review in small batches. No user installation action at this checkpoint.
