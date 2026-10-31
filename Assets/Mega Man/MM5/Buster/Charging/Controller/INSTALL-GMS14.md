# Charging controller integration — GMS1.4.1760

User confirmed charge manager F6 playback/stop/restart all work with no errors. Player-colour resources, release sounds, charged child objects and approved PCM queue are installed. This checkpoint connects X charging. Subsequent user report: controller works with no errors; ladder-top addition has separate pending acceptance. Source/mock checks pass; NEW controller runtime acceptance still pending.

Back up current player Create/Draw and scr_mm5_player_try_buster before changes. Do not replace whole Create/Step/Draw events.

## 1 Remove temporary audio test

obj_mm5_charge_audio > Step > Step: DELETE the temporary F6 test event/code (obj_mm5_charge_audio_step_TEST_ONLY.gml). It stops audio whenever F6 is not held and would fight real X charging. Keep manager Create, Asynchronous Audio Playback, Room End, Destroy, Game End unchanged. No new room instances or PCM/Sound imports.

## 2 Append charge initialization

Existing obj_mm5_megaman > Create > Execute Code: APPEND obj_mm5_megaman_create_charge_append.gml. Keep basic buster initialization and manager creation already installed. This adds buster_charge=0 only. Stop/restart game for clean initialization.

## 3 Replace existing firing script

Scripts > Mega Man > MM5 > Buster > scr_mm5_player_try_buster: REPLACE entire contents with Charging/Controller/scr_mm5_player_try_buster.gml. Same resource name, not a second script.

Keep BOTH existing player Step call sites unchanged: one inside attached ladder before vertical displacement; one after normal movement/collision before VISUAL SELECTION. Keep top-Step timer/slide-at-start prefix unchanged. Do NOT append another firing/charge update to Step/EndStep: helper owns charge update once in whichever existing branch runs. Preserve ladder input freeze hook and all slide/overhang/dust/controller code.

## 4 New palette selection script

Scripts > Mega Man > MM5 > Buster > Charging: create scr_mm5_player_charge_colour. Paste matching .gml into Script editor directly (no GMS2 function wrapper). Choose British spelling colour exactly as provided.

## 5 Import ladder-top shooting sprite / replace ONLY character drawing block

Updated pack includes spr_mm5_megaman_ladder_top_shoot_charge_strip6.png. BEFORE new Draw code, create Sprite spr_mm5_megaman_ladder_top_shoot_charge in Sprites > Mega Man > MM5 > Buster > Charging > Player Colours. Edit Sprite > File > Create from Strip:6 images/6 per row,40x40 cells,all offsets/separations0; manual origin16,16 (not Center20,20). Existing non-shooting ladder_top_charge sprite stays. This addition removes old lip firing guard based on controlled native tests; see Charging/Ladder Top/INSTALL-GMS14.md for evidence/limits and already-installed users' small delta.

obj_mm5_megaman > Draw: replace existing buster character visual block (the previously installed if(sliding){...}else{...} from obj_mm5_megaman_draw_buster_replace.gml) with obj_mm5_megaman_draw_charge_replace.gml.

KEEP debug/reference drawing after that block. Don't append another player draw or delete the whole Draw event. New block draws palette-bank sprites but never changes sprite_index or masks. Existing slide visual+2 offset retained. Walk bank index=bank*4+pose; climb=bank*2+pose; static and shooting-static=bank; walk-shoot=bank*4+pose. All origins already installed.

## 6 Test in order

Stop/restart game, same normal-gravity test room. For native-window comparisons use existing256px-wide view0 or256px room; don't silently change camera/room setup. Existing projectile cleanup uses view0 or room bounds. A wider room with views disabled can keep the initial shot alive beyond full-charge threshold and legitimately reject full release. Report room/view setup if full won't emit; do not remove the all-clear gate to compensate.

1. Quick X tap: one ordinary shot/sound. Rapid taps still max3; no charge sound on a quick tap.
2. Hold X: initial ordinary shot once, colours begin flashing, rising charge sound starts once then loops smoothly. Continuing hold must not auto-fire. F6 should no longer control audio.
3. Intermediate: hold about0.8seconds then release: intermediate projectile/its approved release sound; charging audio stops before release, no sampled layering. Speed5, two animation phases.
4. Full: hold at least1.5seconds then release, after initial ordinary shot left view: large four-phase full projectile and approved full release, colours return normal. Both directions. Native initial white flash/ring frames are intentional.
5. Release after a shorter17..40-update hold (~0.28..0.67seconds) can produce an ADDITIONAL ordinary shot. This is measured native release behaviour, not unwanted sound baked into release clip. One successful emission -> one selected shot sound,16-update firing pose (not cooldown).
6. Walk/jump/turn while holding, release in air: movement/face/alignment stays correct, shot retains direction and height. No collision-mask changes.
7. On ordinary ladder body, charge then release while Up/Down held: release pauses climb16 updates then resumes. Initial press also retains accepted16 pause. Ladder endpoints/drop priority still outside certified scope.
8. Enter slide while charged: charge counter/colour state freezes, no slide shot/sound, dust unchanged. Held charge resumes after slide. Releasing during slide can leave a pending release that fires after slide ends; don't add a release-only fresh-input gate. All accepted tunnels/ledge/ceiling cancellations remain intact.
9. Restart/leave room while charging: no lingering sound/errors; existing stage music and landing unaffected.

Report first error exactly (event/script and line) or first behavioural mismatch before further changes. Do not claim final runtime pass from source tests.

## Allocation and source limits

Original freshly tested4 re-press cases confirm both intermediate/full projectiles block fresh basics. Intermediate/lower releases may coexist with BASIC shots, not another charged shot, and wait if no slot. Full neutral release requires all three slots empty; rejected full drops counter1 without emission/reset16. Controlled original full-rejection audio proof shows charge voice can KEEP RUNNING after failed release through179; source preserves this rare native oddity until next successful shot/restart. This is not an accidental duplicate loop. Charge-start request at counter32 retriggers intro if already active. Successful shot stops charge queue before release sound, never global audio.

Fresh presses also retain existing charged level if a previously blocked release left charge; new controlled mid-pending/repress case at56 emits intermediate, not ordinary. Don't blindly zero charge on every key event. Holding increments from update AFTER fresh press;80..85 wraps80. Counter thresholds16/40/80; inclusive hold41/81 then release gives mid/full. All these are original-ROM observations for stated cases, not certified all inputs.

New helper/Draw tests execute actual GML subset vs33 original standing traces,9 controlled occupancy cases (including new pending repress),4 charged re-press traces,7 movement/slide reference replays; combined actual normal and ladder Step paths tested with mocks. All counters/poses/shot coordinates/types/request order/palette shadow bank agree in tested traces. Child projectile and audio queue/source regressions pass. Mock descendant counting/with-context APIs do NOT replace actual GMS runtime validation. Palette selection follows post-update RAM palette state; native PPU/OAM pipeline/driver latency is not reproduced cycle-exactly.

No terrain/enemy damage/hitboxes, hurt/pause/menu/weapon charge resets or all ladder/slide endpoint priorities implemented/certified here. Existing slide-at-start guard remains. Ladder lip firing guard removed by subsequent measured top-shooting checkpoint; rectangular entry/exit geometry unchanged, not native-complete. Graphics preserve face/padding; PCM samples unchanged and intro/loop playback previously user-tested. No generic claim of complete1:1 NES engine.

## Rollback

Restore prior basic scr_mm5_player_try_buster and prior character drawing block from backups, then restart game. New charge initialization may remain unused; do not alter movement scripts. Keep F6 test removed unless deliberately returning to queue audition. Manager cleanup stops outstanding audio at game/room end.
