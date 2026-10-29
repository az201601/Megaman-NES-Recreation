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

## Separate audio correction after user feedback

User objected to initial ordinary shot and charge+release bundled in both review sequences. Whole-action previews were not suitable isolated effects. Superseded combined previews (retained only as provenance), replaced main pack audio with3 separate clips and created audio-only pack. No controller/audio resource installation changes.

record-charge-effects.mjs: original full-game APU recording, F0 music stop/warm150/peak0, B at10; capture starts35 after ordinary press shot finished (all recorded35..39 samples asserted exactly zero). Charge-only natural hold through259, only captured sound22 at43, no release;171917samples/3.5816041667s. Excerpt, NOT seamless/import-ready loop; no end fade/artificial waveform editing.

Release-only takes explicitly preset charge RAM38 to40dec(mid)/80dec(full) immediately before B release40, while natural counter had reached29 and no22 had been requested. All three original slots clear. Original emission/projectile/sound-driver routines unpatched: correctA8/A9 projectile, counter0,16pose and exactly captured20/21 request. No preceding press/charge in retained audio. Full APU, no channel muting/isolation, synthesis, gain or resampling. Silence-only release trims with5ms padding, PCM interval equality asserted. Mid12216samples/0.2545s, full19564/0.4075833333s,48000 stereoPCM16. Controlled meter setup is disclosed, not claimed natural full hold history. Raw takes/traces ignored .work.

verify-charge-audio.mjs re-records natural original sequences + separate clips and verifies stop/replacement: mid original request51 silences charge pulse2 at52 (4004=30); full request91 takes over at93 (7D),silences100, no charge voice restarts. Successful release should therefore stop GMS charge handle before playing separate release, not layer both tracks. Natural steady charge register pattern repeats8updates from110,17 repeats assert; PCM loop seam not yet certified. User approval of separate clips pending; do not import new audio yet. Existing basic/landing audio and all GML unchanged. Blocked release/cancel audio still separate scope.

## Separate audio accepted; release-resource import checkpoint

User reviewed separate files and confirmed "seems good to me". Mark mid/full release recordings approved; charge-only preview audible character accepted, but no seamless-loop claim. Promoted mid/full WAVs byte-for-byte to canonical snd_mm5_buster_mid.wav/snd_mm5_buster_full.wav under Assets/Audio/Mega Man/MM5/Buster/Charging. Validated PCM headers/frame counts and equality with approved review, packaged two WAVs+import guide in Downloads/mm5-charged-release-sounds.zip. User import confirmation pending. Charging preview remains excluded from resource pack until intro/loop seam verification. No player/projectile GML or existing audio changed. Corrected full-charge sprite import not separately reconfirmed; do not infer it from audio approval.

## Release resources imported / charge-loop audition

User confirmed "done" after intermediate/full sound import instructions. Mark both release resources imported, preserve basic controller. Regenerated ignored dependencies/stage snapshot and separate original full-APU take; approved review/canonical WAVs byte-unchanged. prepare-charge-loop.mjs now prepares intro/loop audition. Native steady8-update register pattern verified17 cycles, but waveform phase not identical: first single-cycle candidate failed RMS guard and was not published. Wider search found roughly3-cycle PCM crop with128-sample stereo RMS37.9113,max460,adjacent seam jump6 (PCM16); engineering guards50/512/50 pass. Not bit-perfect/native-cycle certification. No waveform edits/fades/synthesis/channel isolation/resampling.

Intro raw[7804,111061):103257samples/2.1511875s; loop[111061,130251):19190samples/0.3997916667s,48000stereoPCM16. Intro-to-loop contiguous; preview exact intro+16 copies of loop,410297samples/8.5478541667s. Wave/header/concatenation/ZIP equality tests passed. Proposed sample-crop seam uses slight timing adjustment to native register cycle; needs USER listening approval, not yet imported. GitHub audio-only audition pack under Charging/Loop Review/Downloads. No GML/controller edits. Still need charge colour variants and safe intro/loop playback integration after hearing confirmation.

## Loop hearing accepted / standing colour resource preparation

User reported "very smooth" for loop audition. Retain exact proposed intro/loop pair; audio seam hearing accepted, GMS runtime playback not installed. Preparing charge colour artwork next, in small batches. extract-charge-idle.mjs outputs six32x32 standing cells (192x32 strip), origin16,16, separate resource spr_mm5_megaman_idle_charge under Sprites > Mega Man > MM5 > Buster > Charging > Player Colours. Colour-state selection, not automatic sequential animation.

Native body palette triples from original charge tables: base0F/2C/11; early05/2C/11,15/2C/11,25/2C/11; full rotations2C/11/0F and11/0F/2C. Only original palette0 components change; original face palette4 untouched. Default Mesen0.9.9 matching, not direct capture. Base image exact accepted-standing PNG, all alpha/face pixels invariant; all five colour variants exact independent natural held-charge OAM/palette matches36/56/68/84/86. Native blink at52 would use face9; open-eye comparison uses56 deliberately, not a missing-face filter. No GML changes, source checks passed. Standing colour import user confirmation pending. Other moving/shooting poses and audio queue integration remain next batches.

## Standing colour imported / walking-air colour batch

User confirms standing charge resource "imported". Prepared extract-charge-movement.mjs and two resource strips: walk24x32x32 (six banks of four poses), air6x32x40; origins16,16. Original moving OAM/CHR geometry and native ROM charge palette tables, Mesen-matched. Face palette4 preserved independently, not whole-image tint. Base bank exactly accepted movement art; alpha/face invariant across six banks; four walk phase checks and all-bank ascent/descent equality pass; no opaque clipping. These are component/palette compositions, not claims of individual natural charged-run capture of every moving-colour image. Pack contains only two new PNGs and import guide. User import pending; no player/projectile/controller/audio changes. Loop hearing approved, runtime queue still pending; ladder/slide/shooting colours remain next.
