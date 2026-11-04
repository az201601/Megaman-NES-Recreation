# Cut Man first upward ladder connection — GMS1.4.1760

**Upgrade the confirmed working four-screen opening run.** Adds original page4 above the far-right ladder, upward scrolling AND downward return. No enemies/combat/pickups yet. Blader sprite stays imported, no active Blader object. All stage scenery, invisible geometry and ALL NINE blocks now placed by scripts: user removed four old manual block instances.

Back up the project/room and affected events. Original-ROM/source/model checks pass; **not compiled or run in GameMaker here**. No editable GMX. Follow entire upgrade before restarting; do not mix old geometry with new room coordinates.

## What changes / what stays

Opening run is shifted DOWN240worldpixels, preserving its screen-relative layout. Upper single-screen room sits atworldX768,Y0; opening run atX0,Y240. Room grows1024x240 ->1024x480. Both viewports remain256x240. The shared ladder spansY208..303 across the seamY240; no false platform at the seam. Camera locksX768 during handoff. Native holds and60frame vertical scroll reproduced, rather than an instant room jump.

No new image imports: existing **bg_mm1_cutman_opening_tileset** is pixel-identical to required atlas (all13tiles reused). No new sprites/sounds/shaders. Existing player Draw/arrival/healthHUD/charge-audio/shot event code stays untouched. Two SMALL Step guards are added to existing player/pause events; do not replace those whole events.

## 1. Add SEVEN scripts

Folder **Scripts > Cut Man > Stage > First Ladder Transition**. Each exact named resource gets matching entire.gml file:

1. scr_mm1_cutman_ladder_route_tiles
2. scr_mm1_cutman_ladder_route_collision
3. scr_mm1_cutman_ladder_route_blocks
4. scr_mm1_cutman_route_busy
5. scr_mm1_cutman_scroll_start
6. scr_mm1_cutman_scroll_finish
7. scr_mm1_cutman_scroll_dispose

Keep older scripts/resources for rollback, but only ONE geometry setup runs in the room. Do not add old/new calls together.

## 2. Replace ONLY stage geometry calls

Object **Objects > Cut Man > Stage > obj_mm1_cutman_stage > Create**.

Replace these existing calls:
```
scr_mm1_cutman_opening_tiles();
scr_mm1_cutman_opening_collision();
scr_mm1_cutman_opening_blocks();
```
with:
```
scr_mm1_cutman_ladder_route_tiles();
scr_mm1_cutman_ladder_route_collision();
scr_mm1_cutman_ladder_route_blocks();
```

They need not be adjacent in your event: replace each in its current place. **Do not replace entire Create.** Keep ALL music buffers/queue/Alarm/async/cleanup and unrelated initialisation as-is. Keep any existing F2 region-debug code.

The new blocks script creates **all nine**, once per entry, including first four. No block instances should be editor-placed. It uses same obj_mm1_super_arm_block32x32sprite/mask/parent obj_stage_solid, preserving blocks as objects rather than tiles. Do not duplicate solids behind them. Future Super Arm pickup/throwing still not implemented.

| Script-created block X | New world Y |
|---:|---:|
|128|304|
|128|400|
|160|368|
|160|400|
|384|304|
|384|400|
|416|368|
|416|400|
|640|336|

## 3. Existing room settings and player start

**Rooms > Cut Man > Stage > rm_mm1_cutman_stage**:

- Width1024, **height480**, speed60.
- Keep existing cyan-only background at0,0. Horizontal tiling ON and now **vertical tiling ON**. Stretch OFF, Foreground OFF, speeds0. Do NOT use reference PNGs as room backgrounds.
- Views enabled, view0 visible only. View in room: **X0,Y240,W256,H240**.
- Viewport on screen: **X0,Y0,W256,H240**. NOT480high, NOT1024wide.
- Follow object NONE. Keep existing window enlargement/aspect and pixel filtering settings; GUI remains256x240; application surface enabled.
- Move the EXISTING **obj_mm5_megaman** room instance **exactly240pixels DOWN**, keeping X. Example: oldY180 becomes420. This is ONLY a coordinate change for existing player start, not a second player/arrival.
- If your player position is overridden by instance Creation Code or custom code, adjust that start Y instead; do not apply a runtime +240 on top of an already shifted coordinate. Standard supplied event snippets do not set player X/Y. Report any uncertainty before changing unrelated code.
- Existing HUD, pause menu, camera, stage/music and arrival manager remain room-placed as before; their instance positions are irrelevant. Do not add duplicates or move all controllers. Static stage content/blocks are entirely scripted.
- No four manual blocks to move—the user already removed them. Do not add them back.

Existing arrival Room Start reads the shifted player target and current viewY240, so READY/beam/materialisation stay at original screen-relative positions. No arrival edits.

## 4. Upgrade EXISTING camera object (do not create second one)

Object **Objects > Cut Man > Stage > Opening Route > obj_mm1_cutman_camera**. Keep one instance in room; no sprite, Visible OFF, Solid OFF, Persistent OFF, Parent none. You may move its resource folder to First Ladder Transition without renaming it.

| Event | Action/file |
|---|---|
|Create|REPLACE contents with obj_mm1_cutman_camera_create.gml|
|Step > Begin Step|ADD event; paste obj_mm1_cutman_camera_begin_step.gml|
|Step > End Step|REPLACE contents with obj_mm1_cutman_camera_end_step.gml|
|Other > Room End|ADD event; paste obj_mm1_cutman_camera_room_end.gml|
|Destroy|ADD event; paste obj_mm1_cutman_camera_destroy.gml|

Each has ONE Execute Code action. No normal Step/Draw/DrawGUI event. RoomEnd/Destroy clean up only the camera's voice list/paused charge ownership. No activation_all/deactivation_all and no global audio stop/pause.

## 5. Add ONE-LINE guard to TWO existing events

### Player ordinary Step

**obj_mm5_megaman > Step > Step**, at the VERY TOP, before startup/charge/ladder/slide code:
```
if (scr_mm1_cutman_route_busy()) exit;
```

Keep ALL existing event code below it. Matching prefix file: obj_mm5_megaman_step_route_prefix.gml. This is a prefix, NOT a replacement Step event. Do not add it to Draw or player Create.

### Pause menu Begin Step

**obj_mm5_pause_menu > Step > Begin Step**, at VERY TOP before its current code:
```
if (scr_mm1_cutman_route_busy()) exit;
```

Keep ALL existing code below. Matching prefix file: obj_mm5_pause_menu_begin_step_route_prefix.gml. Do NOT replace the whole event. Menu cannot open in automatic room handoff; fresh Start before a handoff retains pause priority. Outside this stage, helper safely returnsfalse if camera absent; no new global initialization.

## 6. Restart and test

Stop/restart, not resume old saved room state.

1. Stage entry: READY, beam, materialisation on original screen, music normal; player stands on floor, not upper void. If arrival says unsupported/below-view error, first check player +240/startY and geometry calls—not player physics.
2. Opening run looks/plays as before. Walk/jump/slide/climb both ways. All9blocks present, first4not missing/duplicated. Optional F2:27terrain solids +9block children =36instances queried as obj_stage_solid;8ladder volumes;7one-way tops. No duplicate old geometry calls.
3. Climb far-right ladder: short hold at lip, upward scroll, short settled hold, then control returns in upper room. Player stays aligned with ladder, no jump/fall or arrival replay. Original HUD stays fixed on screen; it must not scroll with scenery. Music continuous; no invented transition sound.
4. The shared seam is not a ladder top: continue Up into upper room and exit normally at its actual lip. Explore upper platforms/left ladder using existing MM5 movement.
5. Descend SAME bottom-right ladder to return to opening run. Downward scroll/holds run, then resume attached at original ladder. Repeat several times. Last upper room's top-right ladder leads to NEXT unimplemented section: stop before climbing out there. This is not whole-stage completion.
6. Try Start/A/arrows during auto handoff: no pause/normal movement/jump while busy. Start BEFORE trigger still opens approved pause menu. After handoff, pause in upper and lower rooms; stepped fades/HUD/charge/music must remain correct and closing must not reset view to lower room.
7. Hold pre-existing charge X through handoff: charge counter and its own voice pause, then resume (music untouched). Release X while busy: no stale charged shot on return. New/re-pressed fire during busy is release-rearmed without delaying transition; fresh fire exactly on ready126 is allowed. Test again with both directions. Already paused charge voices must not be forcibly resumed by this camera.
8. Fire a basic/mid/full projectile before crossing: original MM1 handoff clears outgoing shots; all three existing types are removed at entry through shared projectile parent. No edits to projectile events or charge-release sound. No hidden old-room shots should consume shot slots after crossing.
9. Test pause on shared ladder before trigger, resume, then cross. Test repeated room restart and exiting stage using existing routes; no stuck busy flag/paused voice/list leak or duplicate scenery. Future enemy AI/death not certified by this checkpoint.
10. Falling through the open return passage also hands back to lower room rather than leaving player offscreen. This is a rectangular-MM5-controller adaptation, NOT independently replay-certified MM1 falling-entry fidelity. Ordinary ladder up/down are the measured reference cases.

Report exact compiler resource/event/line, screenshot or short video. No GMS runtime available here; actual event scheduling, Draw behaviour, viewport scaling, collision fit and async audio require user testing.

## Measured schedule and adaptation boundary

Original MM1 USA in JSNES2.1.0, Mesen0.9.9 RGB mapping, NOT Mesen executable/hardware. Controlled lead-in moves through first run with Y/protection pinned, then one-time places player at actual page3 ladder; Up-only original code thereafter. Return Down-only from resulting state, no extra patches. Not a natural whole-stage run. Original upper page4's960tile IDs/palettes match completed original-scroll nametable.

Trigger =age0. Outgoing hold0..31(32updates), scroll32..91(60), incoming settled hold92..124(33), bookkeeping125; independent one-frame Up probes123/124/125ignored,126/127/128accepted. First normal player control age126, about2.1sec from entry at60Hz. The holds reflect original PPU loading rather than an invented pause.

Upward camera coordinates in our stacked world: hold240, scroll239/235/.../3, then0. Downward: hold0, scroll0/4/.../236, then240. Original player carry uses959/256screenpixels/update during scroll, equivalent65/256worldpixels/update apart from NES camera-wrap offsets and final fraction clear. Actual GML camera/carried-Y agrees with every original busy frame for the captured native entry coordinates.

Hybrid adaptation: normal movement/climb speed and sprites remain MM5. During moving60updates, established MM5 climbing art alternates every9updates rather than adopting MM1 art/cadence. Trigger predicts boundary using existing ladder_speed/buster pause; exact entry subpixel and final anchor vary with MM5 climb speed. Upper8px horizontal padding adapts existing MM5 probes, not original MM1 pixel bounds. Falling return, all fresh fire/jump combinations and arbitrary interruption matrix not ROM-certified. Do not call this an exact-MM1-player implementation.

No picture imports needed: byte-identical existing13tile atlas reused;590scripted placements +9separate block sprites reconstruct reference. Lower opening scene/collision coverage translated240, otherwise preserved; seam ladder merged acrossY240 with no artificial platform. Upper section has no new Super Arm blocks. All9opening blocks scripted per latest user instruction. No enemies, score, health pickups, E-Tank, death/checkpoints, boss or next upper connection installed.

Player/pause guards are only new references outside camera/geometry resources. Camera does not deactivate objects, so DrawGUI health and music/charge async callbacks remain serviced. Own playing charge voice paused/restored with ownership checks; old held charge preserved, release cancels stale charge. Existing pause controller still owns its ordinary freeze/restore behaviour. Future enemy implementation must participate in handoff clearing/gating before claiming enemy integration.

## Rollback

Restore previous camera Create/EndStep; remove added camera BeginStep/RoomEnd/Destroy events. Remove ONLY the newly added player/pause one-line guards. Restore room1024x240, viewY0, player startYminus240, background vertical tilingOFF. Restore previous three opening-route geometry calls. Because original four manual blocks are gone, ALSO add these four lines once to the old scr_mm1_cutman_opening_blocks (which already creates five extension blocks):
```
instance_create(128, 64, obj_mm1_super_arm_block);
instance_create(128, 160, obj_mm1_super_arm_block);
instance_create(160, 128, obj_mm1_super_arm_block);
instance_create(160, 160, obj_mm1_super_arm_block);
```
Then all9remain scripted even on rollback. Do not run new shifted block script alongside old unshifted geometry. Keep baseline music/arrival/HUD/player/pause code intact. Restart after rollback.
