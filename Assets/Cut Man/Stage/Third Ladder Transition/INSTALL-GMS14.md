# Cut Man third upward ladder connection — GMS1.4.1760

Upgrade ONLY after the accepted **Second Ladder Transition** installation. User confirmed it “perfection itself”. This package retains that connection and adds the NEXT top-right ladder, original page6/room29, and downward return. No enemies/combat yet. Back up your project first. Source/model tested, NOT GameMaker-compiled/run here.

## What to import

**No new resources, sprites, backgrounds, sounds or guards.** Reuse the existing13tile bg_mm1_cutman_opening_tileset. Seven GML files replace seven EXISTING script/event contents. Do not create resources with duplicate/suffixed names. Reference PNGs are for inspection, NOT room backgrounds. JSON is research data, NOT imported.

Existing script/camera resource folders may remain where you already organised them. Optionally move upgraded scripts under **Scripts > Cut Man > Stage > Ladder Route** and existing camera under **Objects > Cut Man > Stage > Ladder Route**, keeping exact resource names. This is a folder move only, not a second camera.

## 1. Replace FOUR existing script contents

Each resource below gets matching entire .gml file:

- scr_mm1_cutman_ladder_route_tiles
- scr_mm1_cutman_ladder_route_collision
- scr_mm1_cutman_ladder_route_blocks
- scr_mm1_cutman_scroll_start

Keep existing scr_mm1_cutman_route_busy, scr_mm1_cutman_scroll_finish and scr_mm1_cutman_scroll_dispose UNCHANGED. Those were installed with first package and retained in second.

**No stage Create changes.** Existing obj_mm1_cutman_stage Create still calls the same three ladder_route geometry scripts once per room entry. Do not add extra calls, old opening geometry, manual scenery/collision or manual blocks. All9blocks remain scripted, translated with the route. Keep stage music buffers/queue/Alarm/async/cleanup code untouched.

## 2. Replace THREE existing camera events

Existing **obj_mm1_cutman_camera**, one room instance:

| Existing event | Replace entire contents with |
|---|---|
|Create|obj_mm1_cutman_camera_create.gml|
|Step > Begin Step|obj_mm1_cutman_camera_begin_step.gml|
|Step > End Step|obj_mm1_cutman_camera_end_step.gml|

Keep **Other > Room End** and **Destroy** unchanged. No new event. No ordinary Step or Draw. Keep camera nonpersistent/invisible/no sprite/Solid unchecked.

Existing player ordinary Step and pause Begin Step already start with `if (scr_mm1_cutman_route_busy()) exit;` from accepted package: leave these in place, do not duplicate/replace whole events. No player physics/art, projectile, charge manager, pause, arrival or HUD source edits.

## 3. Room and existing player start

**Rooms > Cut Man > Stage > rm_mm1_cutman_stage**:

- Width stays1024, **height720 ->960**, speed60.
- View0 room rectangle **X0,Y720,W256,H240** (Y was480).
- Viewport stays **X0,Y0,W256,H240**, only view0 visible, follow NONE.
- Existing cyan-only background: horizontal AND vertical tiling ON, no stretching/foreground/speed; no reference image as background.
- Move EXISTING player start **240pixels further down from its CURRENT accepted position**, X unchanged. Example: original180 -> first420 -> second660 -> **now900**. Apply this increment only once. If start is overridden in instance/custom creation code, change its start Y instead, not both.
- Leave stage/music/arrival/pause/HUD/camera manager instances in place, no duplicates; controller positions irrelevant. No manually placed blocks to move or add.
- Keep256x240GUI, existing window enlargement/aspect/filtering/application surface settings.

World layout after upgrade:

| Section | World rectangle | Camera |
|---|---|---|
|Opening run, original pages0..3|X0..1023,Y720..959|X0..768,Y720|
|First upper room, original page4|X768..1023,Y480..719|X768,Y480|
|Second upper room, original page5|X768..1023,Y240..479|X768,Y240|
|NEW third upper room, original page6|X768..1023,Y0..239|X768,Y0|

All previous content shifted down240 without changing screen-relative layout. Three shared seam ladders merged acrossY720,Y480 andY240, no false one-way tops on seam lines. Terrain44solid regions,13ladder volumes,12ladder tops; all9separate Super Arm blocks remain objects. Optional debug count including block solid descendants is53, not44.899tile placements; existing atlas reused exactly. No block sprites baked into scenery.

## 4. Restart and test

Do not resume old room state; stop/restart.

1. READY/arrival on original opening floor, cameraY720, music/HUD correct. Traverse opening run and verify all9blocks; no missing original four or duplicates.
2. Repeat BOTH accepted connections in both directions. First connection stays126both ways; second stays126up/95down. Pause in all accepted sections: stage snapshot/fades/HUD/view restore correctly.
3. In SECOND upper room (page5), reach its actual top-right outgoing ladder. Climb Up into NEW room: original32update hold,60scroll,33settled+1bookkeeping; first normal control126. No second READY/arrival, no jump off ladder, no invented sound/music restart.
4. In NEW room, climb/exit actual ladder lips and traverse platforms/other ladders with MM5 controller. New terrain is original decoded page6, not guessed. Next TOP-LEFT outgoing ladder is NOT connected yet: do not climb out through top of new room.
5. Descend new room's bottom-right shared ladder into SECOND upper room. **This return is intentionally quicker AFTER the60scroll**: settleages92..93, bookkeeping94, first normal input95. Upward still126. Previous second-to-first return stays95; first-room-to-opening return stays126. Do not “fix” quicker return to126.
6. Repeat all three connections in both directions, including leaving/reattaching ladder at real lips. Check no phantom platform atY240/Y480/Y720, no offscreen camera or positional drift. Both previous upper rooms and all opening content should be unchanged on screen.
7. Test Start/A during handoff (no normal pause/jump), Start before trigger and after return (approved pause works), pause on each side of each connection, then resume and cross. Menu must restore correct section, not force camera to bottom.
8. Hold pre-existing charge through both directions, release/re-press fire during hold, and fire basic/mid/full before crossing. Preserve old continuous charge/own voice, cancel stale released charge, release-rearm newly held fire, clear outgoing projectile descendants, keep stage music continuous. First fresh fire on ready95 must work on new downward return; previous second downward return also uses95; upward connections and first downward return use126.
9. Test falling through open return passages, keeping in mind this remains a MM5-controller adaptation rather than independent native falling replay certification. New downward fall uses same95unlock, retaining incoming fall_speed. Enemies/damage/death not integrated, so no such certification.
10. Restart/leave/re-enter stage through existing mechanisms and check no duplicate geometry, stuck busy state or paused charge voice. Report exact resource/event/line for compiler errors and direction/section/video for runtime issues.

Actual GameMaker scheduler/GPU/viewport/collision/async/with-descendant iteration cannot be certified by JS mocks; your runtime testing remains required. No whole-stage completion claim.

## Reference measurements / scope

Original supplied MM1 USA in JSNES2.1.0, Mesen RGB palette mapping, not execution of Mesen/hardware. Inherits first transition's controlled lead-in; one-time places original player on actual page5 outgoing ladder atlocalX216,Y40, resets fractions/velocity/pose/protection, then Up-only original code. NOT natural traversal of intervening platforms or unpatched whole-stage playthrough. Return Down-only from early settled state at Up frame160 with no additional patches; choosing this earlier snapshot avoids incidental native enemy contact after lingering. No enemy behaviour is installed by this package.

Third Up: trigger25, scroll57..116, finish117, bookkeeping150, freshUp accepted151 (=age126). New downward return: trigger14, scroll46..105, finish106, bookkeeping108, freshDown accepted109 (=age95). Independent one-frame probes: Up123..125ignored/126..128accepted, Down92..94ignored/95..97accepted. Original target upper page6 uses the even nametable;960tile IDs AND palette entries independently match decoded terrain. No newly claimed whole-routine disassembly byte audit.

32outgoing updates and60scroll retained for both; new down has2settled updates rather than33 (same short return as previous second connection). Camera/player carry matches actual native per-frame trace for captured entry coordinates. In stacked world scroll uses65/256worldpx per update (959/256screenpx compensated against4px camera); final fraction is cleared. Up camera has NES1px offset at first scroll sample; down begins0offset. Origin-relative equations preserve first two connections while adding another.

Normal movement/ladder1.296875 and sprites/9update climb animation remain MM5 adaptations, not original MM1player. Entry positions depend on MM5 climb steps; native-source model injects captured entry subpixels for exact trace comparison.8px horizontal bounds adapt existing controller probes. Charge/menu/falling policies inherited from accepted hybrid integration, not exact MM1 combat behaviour. No enemies, pickups/E-Tank, death/checkpoints, boss, score or next connection.

## Rollback to accepted SECOND ladder package

Restore its four matching scripts and cameraCreate/BeginStep/EndStep from your backup or previous GitHub package. Keep Finish/Dispose/helper/RoomEnd/Destroy and two prefix guards unchanged. Roomheight960->720, viewY720->480, playerstartYminus240 once. Cyan background stays tiled both axes; three stage geometry calls unchanged. All9blocks remain scripted. Restart. Do not mix newly shifted scripts with old room/player coordinates.
