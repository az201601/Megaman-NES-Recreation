# Fourth-route coordinate synchronisation — GMS1.4.1760

## Confirmed mismatch

User screenshot shows runtime VIEW0,720 and ATLAS128x64. Installed dispenser-corrected tile script places first opening terrain atY1056..1184; with720view this begins336px below screen top, outside240px viewport. Correct view isY960. Atlas dimensions resolve correctly; missing asset is no longer the reported error. This evidence identifies incompatible camera/terrain coordinates, NOT deleted resources. Exact installed collision/block versions cannot be read from screenshot; update together rather than only move camera.

Six GML files here are unchanged, byte-identical copies from Fourth Ladder Transition. No new gameplay logic, resource names, images, music or geometry introduced. Applies after user has corrected tile script/atlas and dispenser object/features installed. Back up affected events/room first.

## 1. Replace THREE existing script contents

Folder **Scripts > Cut Man > Stage > Ladder Route** (or your existing resource folder). Do NOT create duplicate/suffixed resources. Use entire matching file:

- scr_mm1_cutman_ladder_route_collision
- scr_mm1_cutman_ladder_route_blocks
- scr_mm1_cutman_scroll_start

KEEP current dispenser-corrected scr_mm1_cutman_ladder_route_tiles (1177placements) and scr_mm1_cutman_ladder_route_features. Do not revert tiles to older1207placement script; that re-bakes building. Keep helper/finish/dispose unchanged. Stage Create supplied by user is correct: one tiles call, collision/blocks/features once, audio code untouched. Do not replace stage Create, move calls into Step, or add additional geometry calls.

## 2. Replace THREE existing camera events

**Objects > Cut Man > Stage > Ladder Route > obj_mm1_cutman_camera** (or existing folder). One instance only:

| Existing event | Entire matching file |
|---|---|
|Create|obj_mm1_cutman_camera_create.gml|
|Step > Begin Step|obj_mm1_cutman_camera_begin_step.gml|
|Step > End Step|obj_mm1_cutman_camera_end_step.gml|

Keep Room End/Destroy unchanged, no ordinary Step/Draw. Leave player/pause guards, charge/HUD/arrival and other events unchanged. Do not edit a lone viewY assignment in older camera: old room checks, section bases and trigger thresholds must be updated together. New Create checks1536x1200room and60Hz.

## 3. Synchronise room/player coordinates ONCE

**Rooms > Cut Man > Stage > rm_mm1_cutman_stage**:

- Roomwidth1536, roomheight1200, speed60.
- View0 enabled/visible, room rectangle X0,Y960,W256,H240, followNONE.
- Viewport X0,Y0,W256,H240; only view0 visible. Do not enlarge logical view.
- Keep cyan sky tiled horizontally AND vertically; stretch/foregroundOFF, speeds0. Existing window/GUI settings unchanged.
- EXISTING player instance: keep original X. Correct start Y is **original opening start Y+960**. For originalY180, set **Y1140**. If currently900, this is +240; if already1140, DO NOT add another240. If custom instance/room creation code overrides start Y, correct that override instead of applying both. Do not move every instance or adjust controller physics.
- Keep one existing camera/stage/music/HUD/pause/arrival manager. No manually placed blocks or building; scripts create all10blocks and one dispenser.

Matched section bases: opening960, firstupper720, secondupper480, thirdupper240, new3screenrun0. Upperrun worldX768..1535; previous single rooms remainX768..1023. First opening platform Y1056 maps to screenY96, floorY1152 maps to screenY192. First block top-left128,1024 maps to screen128,64.

## 4. Remove ONLY temporary diagnostics and restart

Remove temporary draw_background/blackpanel/VIEW/ATLAS code previously appended to stage Draw GUI; keep any pre-existing event code. Remove temporary show_message code added to Room Start, if any; keep unrelated code. You may keep VIEW/ATLAS panel for one verification run first: opening must show VIEW0,960 and ATLAS128x64; remove it afterward. No stage visibility changes are required.

Stop/restart, do not continue old room state. At opening, player/ten scripted blocks/scenery/invisible collision must align. Check READY/arrival and music/HUD. Repeat all4ladder connections both ways, horizontal run camera, pause/charge. Shared building should remain sprite at864,128; no duplicate tiles, no cutter spawning yet. Far-right next outgoing ladder remains unconnected. Jump bottomless gap1184..1215; death/respawn still not implemented.

If view remains720 after replacing ALL3camera events, search project for `view_yview[0]` and send matching code: another event/duplicate camera may override it. Do not guess another +240 or translate tiles back upward. If view960 and scenery still absent, send new screenshot; coordinate mismatch is then fixed and remaining rendering issue needs separate diagnosis.

## Evidence/limits

Six source files exactly match already tested Fourth package, whose actual cameraGML matched all8native up/down trajectories and900controlled horizontal frames. Corrected1177tiles+10blocks+building reconstruct accepted whole-scene reference pixel-for-pixel in source/model test. These are not GMScompiler/GPU/runtime certification. User screenshot proves current720view, not the exact installed source of every resource. New repair requires runtime confirmation; no claim issue already resolved on user machine.
