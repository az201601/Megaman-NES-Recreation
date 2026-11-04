# Combined READY + arrival controller — GMS1.4.1760

User confirms READY/arrival sprites and approved arrival sound imported. This checkpoint connects BOTH, not an arrival-only shortcut. Source/mock checks pass; NEW combined controller runtime acceptance pending.

Back up player Create/Step/Draw and test room before editing. All files here are event code, NOT new Scripts. Keep all existing movement, ladder/slide, buster/charge and audio-manager code; only three tiny player insertions.

## 1 Player Create append

obj_mm5_megaman > Create > existing Execute Code: APPEND obj_mm5_megaman_create_startup_append.gml. This initializes mm5_startup_active=false. Do not replace Create. Room Start later locks it after all room Creates have completed.

## 2 Player Step prefix

obj_mm5_megaman > Step > Step > existing Execute Code: paste obj_mm5_megaman_step_startup_prefix.gml at VERY FIRST lines, BEFORE buster_slide_at_start=sliding and timer decrement, ladder capture, movement etc. Keep everything else after it. Do not put this in End Step or call it as a Script; its exit must exit the actual player event before movement/input/charge updates.

## 3 Player Draw prefix

obj_mm5_megaman > Draw > existing Execute Code: paste obj_mm5_megaman_draw_startup_prefix.gml at VERY FIRST lines, BEFORE var charge_bank... and all debug drawings. Keep everything else after it; do not replace drawing block again. This suppresses player AND debug visuals only during startup; they resume afterward. No collision-sprite or visibility-property mutation.

## 4 New manager object

Create Objects > Mega Man > MM5 > Arrival resource folder. New Object EXACT name obj_mm5_stage_start. Sprite:<no sprite>; Visible CHECKED; Solid UNCHECKED; Persistent UNCHECKED; no parent. Create sets depth-10. Add these events, each one Execute Code action with matching entire file:

|Event|File|
|Create|obj_mm5_stage_start_create.gml|
|Other > Room Start|obj_mm5_stage_start_room_start.gml|
|Step > BEGIN Step|obj_mm5_stage_start_begin_step.gml|
|Step > END Step|obj_mm5_stage_start_end_step.gml|
|Draw > Draw|obj_mm5_stage_start_draw.gml|
|Other > Room End|obj_mm5_stage_start_cleanup.gml|
|Destroy|obj_mm5_stage_start_cleanup.gml (same code again)|

NO ordinary Step event. No new Script resource, timer or Alarm needed. Don't modify obj_mm5_charge_audio or stage-music manager.

## 5 Place in gameplay test room

Use current normal-gravity gameplay test room with ONE existing obj_mm5_megaman and known flat support, NOT title/select/Robot Master intro. Put exactly ONE obj_mm5_stage_start instance at0,0 (manager position irrelevant). Do NOT add another player. Existing music object remains; this code doesn't play/change/stop stage music.

The player's X/Y AFTER its Create finishes are the FINAL arrival position; the player itself stays there while hidden/locked. Beam uses that X and comes from gameplay view top (view0 if active, otherwise room top0). Existing player Create may override room-editor placement; don't guess spawn from object icon. Use existing supported floor spawn (e.g.referenceY180/180.5 with floor at192 and feet_offset12). No startup code teleports the collision body or scans for a different floor. A helpful fatal error intentionally rejects unsupported/ladder/slide spawn, zero/multiple players/managers, or target above view. Report it and current player Create/spawn if encountered rather than disabling checks.

For first comparison use existing256x240 logical room/view, static camera. READY native anchor128,128 relative to view top-left. No room-speed edits: accepted controller/measurements assume60updates/sec. Moving cameras, persistent players/managers, respawn-in-place or room scaling are NOT configured by this checkpoint. Stage entry integration uses same single manager in final gameplay room later; no goto-room/title/intro flow changes here.

## 6 Runtime tests in order

Stop/restart game for all new Create code.

1. Neutral: stage+music appear; player/debug hidden; original READY flashes6updates visible/6blank over90updates (~1.5s). Beam descends; approved sound once at ground contact; materialization; normal player appears. No sound invented for READY/beam start, no extra landing/shot. Whole startup for floor target180.5 is119logic updates (~1.98s), ordinary control starts120.
2. After return: walk, jump, slide, basic/mid/full shooting, ladder body/top all still work. Stage music never stops for this one-shot SFX.
3. Restart and HOLD Right early: no move during READY/beam/effects, walking starts only after completion. Restart and HOLD Space early: no buffered jump; release/repress afterward jumps. Fresh Space after startup should jump immediately.
4. HOLD X early: no shot/charge sound/colour during startup. After control returns, held X begins charge without initial basic (native behaviour); release/repress X for a fresh ordinary shot. Fresh X after startup emits as normal. Release X during startup should not emit later from phantom retained charge.
5. Restart/leave room mid-READY/mid-beam/mid-arrival sound: no lingering SFX or locked persistent state; sound cleanup stops ONLY its own arrival voice, not stage/other sounds. Re-enter/restart: sequence runs once again. If existing room transition isn't available, don't invent a test key; report only what was actually tested.

Confirm first neutral visual/audio/handoff pass before further changes. Report exact error/event/line if any. Do not mark installed runtime complete from these source tests.

## Timing / implementation limits

Original natural Napalm state08 READY90 interval; beam starts8 speed then increments.25 BEFORE each move (first8.25); source models90 READY,17 free beam moves+18th ground snap for target180.5, ground pose0, materialization1..3/4..6/7..9/10 -> phases1/2/3/4 then unlock after11th. End Step unlock is deliberate: prevents instance-order-dependent one-frame premature input, next ordinary player Step controls. BEGIN Step handles timeline before any player's ordinary Step; Room Start after every Create makes instance creation order irrelevant.

Player never moved by manager, not using normal fall cap7. Beam clamps to final spawn Y; native arrival subpixel ground wobble is not reproduced (integer art anchor agrees for captured floor). Depth/camera/floor/spawn positioning are GMS adaptations, not native loading implementation. Render uses current logical phase, not hardware's one-update PPU/OAM latency; no cycle-exact first-pixel claim. Native phase4 effect repeats3 before idle; imported strip retains that observed repeat. READY art and all arrival samples unchanged. No menu/weapon/hurt system added.

arrival-input.mjs12 independently structured-cloned original snapshots: Right/Space(originalA)/X(originalB)/Down press early573, transition690, first-control691. All leave X/Y/charge/pose untouched through690; Right moves691, fresh A/B only691 jumps/fires, early held B starts meter1 without ordinary shot. Initial exploratory probe accidentally reused mutable snapshot/controller arrays; corrected with structuredClone and button reset before assertions. Kept only corrected output. Normal player source model matches all12 handoffs, READY cadence, beam/phase count, one sound and idempotent own-voice cleanup; translated view and alternative target-height source checks pass. Existing charged/basic/slide/queue regressions pass. No native other-floor/ledge/platform/enemy/held-input matrix beyond stated cases or actual GMS compiler/runtime validation claimed.

## Rollback

Remove manager instance from test room. Remove the two player Step/Draw prefix guards; Create field can remain unused. Restart game. Restore backups if needed. Don't delete approved sprites/sound, movement scripts or managers. No changes to old provisional MM1 arrival assets.
