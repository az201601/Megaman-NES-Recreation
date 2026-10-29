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

## Second checkpoint: movement/slots and first asset/review batch

User requested proceeding. `charge-interactions.mjs`:16 additional original-ROM cases pass. Natural walking, jumping, wall-limited sliding; two explicitly initialized continuous-ladder class20 cases; eight explicitly controlled occupied-slot cases (clone initialized original basic-shot arrays into selected slots immediately before release). Allocation/charge/projectile routines remain unpatched. These are labelled controlled scenarios, not naturally created input histories. Raw rows/spawn writes/requests: ignored .work/charge-interactions.json.

### Movement and release

- Intermediate/full release while walking works; spawning sees already-moved playerX. Walk sample finalX131.890625 => spawn151, first post-update shot156. No inherited walking speed.
- Full release in natural jump at player147.5Y produces shot146Y, animation08 player; projectile stays at that height while player continues rising. Speed5.
- These cases directly hook original X/Y writes and assert charged spawn integerX+20/floorY-1, confirming the earlier inferred right offset. Left first-post-update positions remain covered by first sweep; don't confuse those with direct left write instrumentation.
- Continuing-ladder full/up and intermediate/down releases both remain attached and freeze climbing16 updates, resume1.296875 on17. The original press also pauses16; charging in between continues while normal ladder motion resumes. These probes do not cover top/bottom/drop endpoints.
- Entering slide freezes charge advancement, including the slide-to-standing update. In this stage the nearby wall ends slide early: entry50, state2 through68, return0 at69, charge48 unchanged throughout. Holding resumes charge at70 (49); release82 therefore emits intermediate (counter60), not full. No assumption of a full26-move open slide here.
- Releasing at60 during that slide leaves charge48 pending, no shot at60; after wall-end69, intermediate emits automatically at70 without another B press.
- Starting B hold at5 during a wall-limited slide started1 creates no ordinary press shot. After state returns0 at20, charge begins1 at21, reaches65 at85, releases intermediate at86. Holding through slide can therefore charge later even though original press could not fire. This supersedes earlier deliberately unimplemented slide-buffering assumptions, but does not certify every cancellation/exit priority.
- Later incidental sound2A occurs outside focused release window in two natural slide traces; raw trace retains it. It is not assigned as a charge or slide sound. Charge review recordings below reject all unrelated commands.

### Occupied-slot differences

Masks1/2/4 mean one occupied slot1/2/3;7 all three. Slots contain valid cloned basic shot atX200 with original routines still moving/cleaning it.

- Full release requires all three slots empty in these probes. Any single occupied slot rejects full emission, no21 sound or16pose; charge becomes1 (not an asserted universal clean0). Even after injected shots clear, no deferred full emission through20 subsequent updates.
- Intermediate release can share slots with existing basics: allocate highest free slot3, or2 if3 occupied.
- If all three occupied, intermediate release retains counter40 and does not refresh pose/play20. It automatically emits at56 after a slot has cleared, without another press. Native cleanup/gate order still applies. Thus a simple shared "count<3" gate is insufficient for full charged fire, and blocked intermediate/full charge cannot share one reset rule.

### Artwork prepared / import pending

`extract-charged-art.mjs` exports original rendered OAM/CHR components with pinned approved Mesen0.9.9 palette; NOT direct Mesen capture. Both native directions tested; every phase pixel-equal to mirrored opposite direction about actor reference. No generated imagery. Multiple palette components retained (including full phase2 palette0), component flips/priority retained, repeated phases identical, all opaque pixels fit. Capture uses pre-update actor reference to match OAM pipeline.

Sprites at Assets/Mega Man/MM5/Buster/Charging:

- spr_mm5_buster_mid_strip2.png:48x16,2 cells24x16, origin16,7;5/4 OAM components by phase.
- spr_mm5_buster_full_strip4.png:128x24,4 cells32x24, origin24,11;4/8/12/5 components.

Import under Sprites > Mega Man > MM5 > Buster > Charging as spr_mm5_buster_mid/full; origins manually as above, all strip offsets/separations0, no crop/resize. Keep existing basic projectile object and all player events unchanged. PNG canvas/alpha is not a damage hitbox. Player charge-colour variants not exported in this batch; no charging implementation installed.

### Actual audio sequences prepared / user hearing approval pending

`record-charge-sfx.mjs` records original full-game APU with approved originalF0 music-stop method,150 warmup updates, settled peak0; no muting/isolation/synthesis/effects. Two review sequences include ordinary press shot, charging, then intermediate/full release. Only PCM-zero edge silence trimmed with5ms padding, retained PCM exact assertion. Not isolated import-ready sounds; do not create Sound resources from these sequences. Need review plus separate final effects/loop-boundary measurements before integration.

- mid review:48000Hz stereoPCM16,44981 frames/0.9371041667s; requests frames10:1A,43:22,51:20; raw trim[9404,54385).
- full review:48000Hz stereoPCM16,84350 frames/1.7572916667s; requests10:1A,43:22,91:21; raw trim[9404,93754).

Capture180updates/143777 samples each, always state0, no unrelated sound requests. Full takes/traces ignored .work. Existing approved basic/landing sounds byte-untouched. Asset/review ZIP includes two sprite strips, two review WAVs and import/review guides; user import/hearing confirmation pending.

### Remaining scope after second checkpoint

Still no charged GML, damage/hitbox/enemy interactions, hurt/menu/weapon cancellation, all ladder/slide endpoints, rendered charge-colour variants or standalone charging audio loop/stop implementation. Source tests are not GMS runtime proof. Preserve accepted basic-buster/controller until small explicit integration checkpoint.

## Full projectile correction after user review

User reported weird white portions in full-charge strip. Original phase0 actually uses CHR65/66/67 in addition to68/69; previous68..79 filter omitted6 of10 components and24px-high canvas was too short for flash (-15..+16 relativeY). Corrected full extraction to65..79,32x32 cells/origin24,15,128x32 strip. Exact phase component counts10/8/12/5 asserted, not loose4..12. Other phases retain aligned padding. Native white flash/ring phases themselves preserved; they appear in original rendered output, not a palette error. Intermediate sprite/audio unchanged.

Added independent per-opaque-pixel comparison with original JSNES rendered framebuffer for every phase/direction, away from player and with projectile first in OAM to avoid real alternating8-sprites/scanline dropout. Every phase passes; repeated images, clipping and native opposite-direction reflection pass too. Updated import guide/ZIP. User must replace only full sprite's four subimages with32x32 cells and new origin24,15; runtime/import confirmation pending. No GML/controller changes.
