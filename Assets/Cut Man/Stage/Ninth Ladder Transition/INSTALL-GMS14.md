# Ninth connection — GMS1.4.1760

Upgrade only from the user-confirmed **Eighth Ladder Transition**. Back up the project first.

This connects the **bottom-right ladder of pages13–15** to original **page16/room9**, and adds its upward return. It is a descending branch, separate from the earlier bottom-left return to page12.

## 1. Do NOT shift the room or player again

In **Rooms > Cut Man > Stage > `rm_mm1_cutman_stage`**, keep the accepted Eighth settings exactly:

| Setting | Keep |
|---|---|
| Room width × height | **2048×2160** |
| Speed | 60 |
| Starting view0 rectangle | **X0,Y1920,W256,H240** |
| Viewport | X0,Y0,W256,H240 |
| View0 follow | None; only view0 enabled/visible |
| Player startingX | Unchanged |
| Player startingY | **Original openingY+1920**; original180 means **2100** |

**Do not add another240 to the player, room height, starting view or existing geometry.** The new room occupies previously empty space at **X1792–2047,Y240–479**. All accepted scenery, blocks, buildings and camera positions remain where they were.

Keep the cyan sky tiled horizontally and vertically; existing GUI/window/application-surface/aspect/filtering settings unchanged. Do not use the reference panoramas as room backgrounds.

## 2. Replace FIVE existing scripts

In **Scripts > Cut Man > Stage > Ladder Route**, or the existing equivalent folder, replace each entire existing resource with its matching `.gml` file:

1. `scr_mm1_cutman_ladder_route_tiles`
2. `scr_mm1_cutman_ladder_route_collision`
3. `scr_mm1_cutman_ladder_route_blocks`
4. `scr_mm1_cutman_ladder_route_features`
5. `scr_mm1_cutman_scroll_start`

No duplicate/suffixed scripts. Block/feature positions are unchanged; matching copies are included for a complete checkpoint. All **thirteen blocks** remain scripted, and the two dispensers remain **864,1088** and **1376,128**. No new blocks or buildings in page16. No cutter spawning yet.

**Do not replace or edit stage Create/music.** Keep its verified once-per-entry tiles/collision/blocks/features calls, music, buffers, queue, async handlers, alarms and unrelated initialization intact. No additional geometry calls or manual room-editor blocks/buildings.

Keep `scr_mm1_cutman_route_busy`, `scr_mm1_cutman_scroll_finish`, `scr_mm1_cutman_scroll_dispose`, player Step/pause Begin Step guards, player movement/charge/audio/HUD/arrival/menu unchanged.

## 3. Replace THREE camera events

**Objects > Cut Man > Stage > Ladder Route > `obj_mm1_cutman_camera`**, or its current folder:

| Existing event | Entire replacement file |
|---|---|
| Create | `obj_mm1_cutman_camera_create.gml` |
| Step > Begin Step | `obj_mm1_cutman_camera_begin_step.gml` |
| Step > End Step | `obj_mm1_cutman_camera_end_step.gml` |

Keep Other > Room End and Destroy unchanged. One camera instance only, invisible/no sprite, non-solid, nonpersistent, no normal Step/Draw.

**All three events AND scroll_start must match.** The camera now selects an explicit target section rather than assuming every down scroll decrements the route index. This preserves the left return while the right descent enters the new room.

## 4. No new resources or artwork imports

Keep the existing exact names/folders:

- Background `bg_mm1_cutman_ladder_route_tileset`:128×64,25tiles; Background not Sprite,16×16 tiles, offsets/separations0, preserve colours/alpha.
- Sprite `spr_mm1_super_cutter_dispenser`:96×80, origin0,0; existing non-solid static object at depth999.
- Invisible solid/ladder/top and Super Arm block objects, player, camera and pause resources.

Atlas/sprite recovery PNGs are byte-identical to Eighth. Do not reimport/rename working resources. The new gray machinery panel is original noninteractive scenery, not another cutter dispenser.

## 5. Restart and verify

1. Stop and restart. Opening remains **VIEW0,1920 / ATLAS128x64** if using the earlier temporary diagnostic. Player2100 for original180; ledge2016/screen96, floor2112/screen192. No opening alignment change is expected. Remove only temporary diagnostics after verification.
2. Recheck READY/arrival/music/HUD/menu and all eight confirmed connections both ways. First/fifth Down126; second/third/fourth/sixth/seventh/eighth left return95; all existing Up126. Both horizontal runs retain their accepted camera ranges and Y values.
3. Travel across the upper three-screen run (pages13–15): cameraX1280–1792,Y0. At its **bottom-right ladder**, player centre **X1992**, descend. This is now the ninth connection: **126 updates**, not95. Camera staysX1792 during the vertical scroll and finishes at **X1792,Y240**. No left snap, teleport to page12, arrival restart or music restart.
4. Explore page16: player horizontal bounds1800–2040, fixed camera1792,240. Incoming ladder is top-right atX1992; its volume merges acrossY240 into the old outgoing ladder (X1984,Y192,height96), with no false lip atY240. The gray panel and platforms should align; no new blocks/buildings/enemies are expected.
5. Climb that same **top-right incoming ladder** to return:126 updates, view1792,0 in the upper run's right screen. Repeat down/up several times. Walk left across the run and descend its **bottom-left ladderX1336**: this still returns to page12/view1280,240 in95 updates. Neither branch should replace the other or retain the wrong timing after repeated use.
6. The new room's **bottom ladder, player centreX1896**, is the NEXT outgoing connection and remains unconnected. It starts atworldY448 and ends480. **Stop before descending out there.** No automatic return, invented floor or death/respawn handling has been installed beneath it; leaving the built route may require restart.
7. Pause before/after the new transitions and inside page16. Cached scene/HUD/fades restore the correct right-hand view. Start before a trigger has priority; Start/A during automatic motion must not pause, jump or move the player.
8. Test basic/mid/full shots before entry, existing charge held across transitions, release/re-press during busy, and fresh fire atready126. Outgoing shots clear; old continuous charge resumes its own voice, releasing cancels stale charge, a new busy-period hold is release-rearmed. Music remains untouched. The older left return still allows fresh fire atready95.
9. Existing first horizontal pitX1184–1215,Y1152–1199 must still be jumped. Falling there or in unbuilt areas may require restart. A fall through the new valid right opening may follow the descending branch, but middle voids must not teleport to another section. Falling returns remain MM5 controller adaptations, not independent original fall replays.
10. Restart/re-enter using existing mechanisms: no duplicate geometry/buildings, stale busy state or paused voice. Report resource/event/line for compile errors, or section/direction/screenshot for alignment/camera problems.

**2076 scenery tiles,95 terrain solids,23 ladders,23 tops,13 scripted blocks,2 scripted dispensers.** Optional `obj_stage_solid` debugcount108 includes13 block descendants. Existing eight seams remain; the ninth is the right-hand seam atY240/X1984, distinct from the earlier left seam atY240/X1328.

**43 source/model checks pass**, including all18 captured direction cases, both earlier900-frame camera captures, independent ready timings, unchanged accepted scene/positions, repeated branch selection, bounds/seams, charge/rearm and cleanup. Actual GMS1.4 compilation/GPU/event scheduling/async audio/descendant iteration/collision fit still require your confirmation. No enemy/cutter AI, damage, pickups/tank effects, death/checkpoints or boss completion claimed.

## Original reference / adaptation limits

Supplied MM1 USA ROM, JSNES2.1.0, Mesen RGB mapping; not Mesen executable/hardware or a new comprehensive ASM byte audit. Inherits controlled prior lead-ins. A separate Right900/A-once traversal pinsY36/velocity0/protection100 to stream to page15, followed by one placement at actual outgoing ladderpage15/X200/Y222, fraction/velocity/pose reset/protection100, one neutral collision-cache refresh, then original Down-only. This is not natural whole-stage traversal.

- Ninth Down: trigger14, scroll46–105, finish106, bookkeeping139, normal140: age126. Original begin16/end16/order9 after completion, camera3840→4096.
- Up-only from Down184, with no further RAM/ROM patches: trigger43, scroll75–134, finish135, bookkeeping168, normal169: age126. Capture stops184, before later enemy contact can corrupt this reference. Camera4096→3840.
- Independent fresh Up and Down presses123–125 ignored,126–128 accepted. Readiness is not inferred from room flags alone.
-960 live nametable tile-ID and palette pairs validate page16/room9. No native kind2 blocks on page16. Existing25-tile atlas sufficient; entire new256×240 image exactly reconstructs from the scenery. All pixels outside the new room remain identical to Eighth; all accepted cells/objects/features retain coordinates.
- MM5 art/normal physics/climb1.296875/9-update cadence/8px edge padding/charge/menu/fall policies remain adaptations. Native entry subpixels are injected for busy-frame comparisons; real MM5 entry positions differ.

## Rollback

Restore Eighth's five scripts and three camera events together, then restart. **Room2048×2160, viewY1920 and player start2100 for original180 stay unchanged.** This removes page16 and restores the right outgoing ladder as unconnected. Both dispensers/thirteen blocks retain their accepted positions. No Stage Create/music/assets/helpers/guards changes.


## Video-reported camera reset / matched-code safeguard

See [Ninth Transition Repair](../Ninth%20Transition%20Repair/INSTALL-GMS14.md) for the small four-code-resource repair bundle. The repository video shows a scroll followed by a camera reset/player disappearance. A reproduced mixed Eighth-start/Ninth-camera case leaves target0 and causes this reset. Current canonical sources include a per-call901 handshake to reject an older start script with a named error instead of silently resetting. All four camera/start replacements must match; no geometry/coordinate changes. New source checks cover this mixed-version regression and correct post-unlock arrival. Actual installed GML has not been supplied; runtime confirmation remains pending.
