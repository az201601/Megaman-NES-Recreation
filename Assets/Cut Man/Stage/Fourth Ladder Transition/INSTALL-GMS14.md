# Cut Man fourth ladder + three-screen upper run — GMS1.4.1760

Upgrade the user-accepted Third Ladder Transition (“working perfect as usual”). Adds the top-left outgoing ladder of page6 into original stripe pages7..9, its horizontal camera, and downward return. Entire next stripe included, NOT just its first screen. Back up project first. Source/model tested; NOT GameMaker-compiled/run here.

## 1. Import ONE Background resource

Folder **Backgrounds > Cut Man > Stage > Ladder Route**.

Name **bg_mm1_cutman_ladder_route_tileset**. Load matching **128x64 PNG**, as Background, NOT Sprite. Use as tile set ON;16x16tiles; offsets/separations0. Preserve alpha, Remove Background OFF, smoothing/interpolation OFF.25tiles: first13unchanged,12additional original decorative tiles needed by new stripe. No repainting/invented art. Keep old bg_mm1_cutman_opening_tileset for rollback; new tile script references the new atlas for ALL scenery.

Do not use either reference PNG as a room background. Cyan sky remains the only room background. No new sprites/audio imports.

## 2. Replace FOUR EXISTING scripts

Folder **Scripts > Cut Man > Stage > Ladder Route**, or keep current resource folders and exact names. Each resource gets matching entire.gml file:

- scr_mm1_cutman_ladder_route_tiles
- scr_mm1_cutman_ladder_route_collision
- scr_mm1_cutman_ladder_route_blocks
- scr_mm1_cutman_scroll_start

Do not create duplicate/suffixed scripts. Keep scr_mm1_cutman_route_busy, scr_mm1_cutman_scroll_finish, scr_mm1_cutman_scroll_dispose UNCHANGED. These remain required from accepted installation.

**No stage Create changes.** Existing three geometry calls stay once each. Preserve ALL stage music/async/Alarm/cleanup and unrelated code. Do not run old opening/first/second/third geometry in addition to replacements.

Block script now creates **TEN** separate obj_mm1_super_arm_block objects: accepted9shifted down240 plus original page8block atworldX1152,Y96. All scripted; no manual instances. Collision script excludes block footprints, no permanent solid behind removable blocks. No Super Arm pickup/throw mechanics yet.

## 3. Replace THREE EXISTING camera events

**Objects > Cut Man > Stage > Ladder Route > obj_mm1_cutman_camera**, or existing folder. One instance; no second camera.

| Event | Replace whole contents with |
|---|---|
|Create|obj_mm1_cutman_camera_create.gml|
|Step > Begin Step|obj_mm1_cutman_camera_begin_step.gml|
|Step > End Step|obj_mm1_cutman_camera_end_step.gml|

Keep Room End and Destroy unchanged. No ordinary Step/Draw. Invisible/no sprite, Solid unchecked, Persistent OFF.

Keep existing one-line route_busy guards at top of player ordinary Step and pause Begin Step, no duplicates/whole-event replacement. No player/charge/projectile/pause/arrival/HUD source edits.

## 4. Room and existing player start

**Rooms > Cut Man > Stage > rm_mm1_cutman_stage**:

- Width **1024 ->1536**, height **960 ->1200**, speed60.
- Visible view0 room rectangle **X0,Y960,W256,H240** (wasY720).
- Viewport stays **X0,Y0,W256,H240**, view0 only, follow NONE.
- Cyan sky tiled horizontally AND vertically, stretch/foreground OFF, speeds0. Do not stretch the view or use panorama as background.
- Move EXISTING player start another **240pixels DOWN from currently accepted position**, X unchanged. Example: original180 -> first420 -> second660 -> third900 -> **now1140**. Once only; if custom instance code overrides start, adjust it instead, not both.
- Leave existing stage/music/arrival/HUD/pause/camera managers as-is. No duplicates, no manual scenery/collision/blocks. Keep256x240GUI, application surface, window/aspect/filtering settings.

| Section | World rectangle | Camera |
|---|---|---|
|Opening pages0..3|X0..1023,Y960..1199|X0..768,Y960|
|First upper page4|X768..1023,Y720..959|X768,Y720|
|Second upper page5|X768..1023,Y480..719|X768,Y480|
|Third upper page6|X768..1023,Y240..479|X768,Y240|
|NEW stripe pages7..9|X768..1535,Y0..239|X768..1280,Y0|

Previous layout translated down240 only. Added right-hand world space does NOT widen previous routes: their player/camera limits stay unchanged. New stripe follows floor(playerX)-128, clamped768..1280; no smoothing. New shared ladder atworldX816 links top-left of page6 to bottom-left of page7. Earlier three ladder handoffs remain atX976. Four seams have merged ladder volumes, no artificial tops atY240/480/720/960.

1207scenery placements,60terrain solids,15ladder volumes,14ladder tops,10separate blocks. Optional debug solid count including block descendants70, not60. Decorative metal building is non-solid artwork where original class0, not a guessed collision wall.

## 5. Restart and test

Stop/restart; do not resume old room state.

1. READY/arrival on opening floor, cameraY960; music/HUD correct. Traverse all accepted content,9original blocks present, no duplicates. Repeat previous THREE connections both ways. First stays126up/down; second and third stay126up/95down.
2. Reach page6 top-left outgoing ladder (localX56, worldX824playercentre). Climb Up: hold32,scroll60,settled33/bookkeeping1, normalcontrol126. New scene begins at its leftmost screen, shared ladder aligned; no arrival replay/music restart.
3. Traverse NEW three-screen run rightward and back. Camera clamps atX768left and1280right; no exposed cyan void beyond geometry, wrong-room clamping or black borders. Decorative metal artwork should look correct without blocking class0space. New block atX1152,Y96 is an object, not baked into background; total10blocks.
4. There is an original **32px-wide bottomless gap atworldX1184..1215**. Jump over it. **Death/checkpoint/respawn are not implemented yet.** Do not deliberately fall in for this checkpoint: player may leave playable terrain and require restart. No invisible floor, magic teleport or incorrect downward handoff was added. Pit death is future death/hazard work, not stage-connection behaviour. Other actual return opening at left edge is different.
5. Return left and descend shared ladder (playerX824) to page6. Downward normal control95, as previous short returns. Repeat, then return through all three older connections. No ladder drift/false seam lip.
6. New stripe's next outgoing ladder is **top-right of its far-right screen**, playerworldX1496. It is NOT connected yet; stop before climbing out there. This package is not whole-stage completion.
7. Pause before/after all connections and at both new camera limits/mid-scroll. Approved transitions/HUD/cache restore correct view and section; no snap to bottom/left. Start/A during automatic handoff cannot move/jump/open pause. Start before trigger still has pause priority.
8. Hold old charge through new handoff, release/re-press during it, fire basic/mid/full before crossing. Own charge voice/counter pause and continuous hold resume, release cancels stale charge, newly held fire release-rearms, old shots clear through projectile parent, music remains continuous. Fresh ready126up/95down fire allowed.
9. Falling through LEFT return opening while view is atX768 uses inherited MM5 adaptation; not independent native falling-entry certification. Falling elsewhere along wide stripe must NOT teleport into narrow page6. Pit/death handling deferred as above.
10. Restart/leave/re-enter using existing mechanisms: no duplicate geometry, stale busy flag or paused voice. Report compiler resource/event/line, or section/direction/video for runtime differences.

Actual GameMaker compiler/GPU/scheduler/async/with-descendant iteration and collision fit remain user-runtime checks. No enemies/combat/damage/pickups/E-Tank/death/boss installed. All stage objects stay separate from scenery.

## Original evidence / limits

Supplied MM1 USA in JSNES2.1.0, Mesen RGB mapping, NOT Mesen executable/hardware. Inherits prior controlled lead-ins, one-time player placement page6/localX56,Y40 with fraction/velocity/pose reset/protection100. One neutral original frame refreshes original collision/ladder cache at relocated X, avoiding stale previous ladder centre. Then Up-only original execution. No scroll-code/ROM patches. This is NOT natural whole-stage traversal.

Up trigger49, scroll81..140, finish141, bookkeeping174, first accepted player input175 (=age126). Down-only from early settled Up frame184, no additional patches: trigger14,scroll46..105,finish106,bookkeeping108,normal109 (=age95). Independent fresh-input probes confirm Up123..125ignored/126..128accepted and Down92..94ignored/95..97accepted. All prior connections compared against native traces again.

Original stripe bookkeeping confirmsbegin7/end9, not a guessed single room.2880tile IDs AND palettes checked across all3pages: initial native nametables7/8, then streamed9. Additional renderer/camera traversal uses one A to detach, Right-only, pinsY36/velocity0/protection100 each frame to inspect uploads; not natural playthrough. Actual camera EndStep matches900captured original frames after coordinate translation. Original type2active record page8 X128,Y96..X160,Y128 yields the new32x32block; scenery plus separate sprite reproduces all decoded stripe pixels exactly.

MM5 normal movement/art/climb1.296875/9update animation/8pxedgepadding and charge/pause policies remain adaptations. Trace-source comparisons inject captured native entry subpixels; MM5 entries can differ naturally. Falling returns not certified original behaviour; pit death deferred, not disguised as a connection. No new comprehensive disassembly byte-audit claim.

## Rollback to accepted THIRD package

Restore its four matching scripts and cameraCreate/BeginStep/EndStep. Restore room1024x960, viewY720, playerstartYminus240 once. Keep helper/finish/dispose, RoomEnd/Destroy, two guards and stageCreate/music untouched. New atlas can remain unused; previous tile script references old atlas. Old block script creates9again, no manual blocks. Restart; do not mix coordinates/scripts from two packages.
