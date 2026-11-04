# Eighth connection and second horizontal section — GMS1.4.1760

Upgrade from the user-confirmed **Seventh Ladder Transition** only. Back up the project first. This adds the upward connection from page12's top-left ladder to original pages13–15, the complete three-screen scenery/collision, and the return through the incoming ladder. The next bottom-right outgoing ladder remains unconnected.

**Apply all five scripts, all three camera events, AND the room/view/player settings together.** Do not install only the scenery. This update changes both room width and height.

## 1. Existing resources — no new imports required

Keep these exact resources and their existing resource folders:

- Background `bg_mm1_cutman_ladder_route_tileset`: **128×64**, 25 tiles. Background, not Sprite; 16×16 tiles, offsets/separations0. Do not remove background colours.
- Sprite `spr_mm1_super_cutter_dispenser`: **96×80**, origin0,0.
- Object `obj_mm1_super_cutter_dispenser`: existing static artwork object, no parent, non-solid, depth999 in Create. No spawning yet. We reuse it for a **second scripted instance**, not a second resource.
- Existing invisible solid/ladder/top objects, Super Arm block, camera, player and pause resources.

The ZIP contains unchanged atlas/sprite recovery copies only. Do not rename/reimport working resources or import either reference panorama as a room background. Keep the cyan-only sky tiled on both axes.

## 2. Replace FIVE existing scripts

In **Scripts > Cut Man > Stage > Ladder Route**, or your current equivalent folder, replace the entire contents of each existing resource with its matching `.gml`:

1. `scr_mm1_cutman_ladder_route_tiles`
2. `scr_mm1_cutman_ladder_route_collision`
3. `scr_mm1_cutman_ladder_route_blocks`
4. **`scr_mm1_cutman_ladder_route_features`**
5. `scr_mm1_cutman_scroll_start`

Do not create suffixed duplicate scripts. Features is essential: the old dispenser moves from864,848 to **864,1088**, and the new one is **1376,128**. Both are separate sprite/objects, with no duplicate building scenery. All **thirteen** existing blocks move down240; no new block is added in pages13–15. None should be manually placed.

**Do not change stage Create or music.** Keep the existing verified once-per-entry tile/collision/block/feature calls, audio initialization, async handlers, alarms and cleanup intact. Do not add a second feature call or call geometry in Step.

Keep these unchanged: `scr_mm1_cutman_route_busy`, `scr_mm1_cutman_scroll_finish`, `scr_mm1_cutman_scroll_dispose`, existing player Step and pause Begin Step guards, player movement/charge/arrival/HUD/menu/audio.

## 3. Replace THREE camera events

In **Objects > Cut Man > Stage > Ladder Route > `obj_mm1_cutman_camera`**, or its existing folder:

| Existing event | Entire replacement file |
|---|---|
| Create | `obj_mm1_cutman_camera_create.gml` |
| Step > Begin Step | `obj_mm1_cutman_camera_begin_step.gml` |
| Step > End Step | `obj_mm1_cutman_camera_end_step.gml` |

Keep Other > Room End and Destroy unchanged. Keep exactly one invisible, non-solid, nonpersistent camera instance, no Sprite, no normal Step or Draw. Do not mix older camera events with this package.

## 4. Room, starting view and player — matched settings

In **Rooms > Cut Man > Stage > `rm_mm1_cutman_stage`**:

| Setting | Required value |
|---|---|
| Room width | **1536 →2048** |
| Room height | **1920 →2160** |
| Speed | 60 |
| View0 visible/enabled | Yes; other views off |
| View0 room rectangle | **X0,Y1920,W256,H240** |
| View0 follow object | None |
| Viewport | X0,Y0,W256,H240 |
| Existing player's startX | Unchanged |
| Existing player's startY | **Original openingY+1920**; original180 → **2100**, previously1860 |

Only add240 once to the accepted start position. If custom creation code overrides the start, update that override instead of adding the shift twice. Do not move manager instances. Keep application-surface/GUI/window scaling/aspect/filtering settings unchanged. Sky: cyan only, tile horizontally and vertically, speeds0, no foreground/stretch/reference-image background.

| Section | World area | Camera |
|---|---|---|
| Opening pages0–3 | X0–1023,Y1920–2159 | X0–768,Y1920 |
| First upper page4 | X768–1023,Y1680–1919 | X768,Y1680 |
| Second upper page5 | X768–1023,Y1440–1679 | X768,Y1440 |
| Third upper page6 | X768–1023,Y1200–1439 | X768,Y1200 |
| First horizontal pages7–9 | X768–1535,Y960–1199 | X768–1280,Y960 |
| Fifth upper page10 | X1280–1535,Y720–959 | X1280,Y720 |
| Sixth upper page11 | X1280–1535,Y480–719 | X1280,Y480 |
| Seventh upper page12 | X1280–1535,Y240–479 | X1280,Y240 |
| **NEW horizontal pages13–15** | **X1280–2047,Y0–239** | **X1280–1792,Y0** |

The lower sections **do not gain wider camera/player bounds** merely because the room is wider. Newly added lower-right space stays empty cyan; do not fill it with extra floors.

Geometry: **1969 scenery tiles,86 terrain solids,21 ladders,21 tops,13 scripted blocks,2 scripted dispenser instances**. A debug count for `obj_stage_solid` includes thirteen block descendants:99, not86.

## 5. Restart and verify

1. Stop and restart, not resume old room state. Camera Create rejects old dimensions. If retaining the earlier temporary GUI diagnostic, opening must read **VIEW0,1920 / ATLAS128x64**. The opening ledge is worldY2016/screen96; floorY2112/screen192; original180 player startsY2100. If old viewY1680/1440/1200/960/720 appears, check all three camera replacements/duplicate overrides, not isolated tile offsets. Remove only temporary diagnostic code after checking.
2. Check READY, arrival, music, HUD, pause and all seven confirmed connections both ways. Up remains126 throughout; Down first/fifth126, second/third/fourth/sixth/seventh95. The first horizontal run remains cameraX768–1280,Y960; its dispenser is864,1088, still separate and not duplicated.
3. From page12 (nowY240), climb the **top-left outgoing ladder**, player centre **X1336**. Do not confuse this with page12's lower return atX1320. The eighth handoff takes126 updates, with cameraX1280 throughout the vertical scroll. No horizontal snap, arrival restart or music restart.
4. Explore the complete new horizontal section. Camera follows X1280–1792 atY0, player bounds1288–2040. Platforms and terrain follow the original three pages, not one repeated screen. The new dispenser is1376,128, a non-solid static sprite/object. Both dispensers are inert: no cutter spawning yet. All thirteen blocks remain objects in earlier sections; the most recent block is now1376,368.
5. Return to the incoming **bottom-left ladder**, centre **X1336** in the new section's first screen. Descend:95 updates, cameraX1280,Y240, returning to page12. Repeat both directions and travel back through the earlier seven connections.
6. **The new section's bottom-right ladder, centreX1992, is the NEXT outgoing connection, not a return shortcut. It is not connected yet. Stop before descending out there.** Its top isY192. Descending/falling on the right must not teleport to page12. No invented floor/teleport has been added beneath it; death/respawn is still deferred, so leaving the built route may require restart.
7. Pause before/after either new transition, near the new dispenser and at the far-right screen. Cached scene, HUD, fades and camera must restore correctly. Fresh Start before a trigger has priority. Start/A during the automatic handoff must not pause, jump or move the player.
8. Test charge held before the handoff, release/re-press while busy, and basic/mid/full shots before entry. An old continuous charge resumes its own voice; releasing cancels stale charge; a new busy-period hold is release-rearmed. Fresh fire on ready126/up or95/down is allowed. Outgoing shots clear, stage music remains untouched.
9. The earlier horizontal pit atX1184–1215 is nowY1152–1199. Jump across; falling may require restart. It must not teleport into narrow page6. Similarly, the new wide section only returns to page12 through its left opening, never from the far-right outgoing ladder/void. Falling return behaviour is a retained MM5 controller adaptation, not independently native-fall-certified.
10. Restart/re-enter with your existing mechanisms: no duplicated geometry/buildings, stale busy flag or paused voice. If something fails, send resource/event/line for compile errors or direction/section/screenshot for alignment problems.

**36 source/model checks pass; actual GameMaker compilation, GPU rendering, event scheduler, async audio, descendant iteration and collision fit still require your runtime confirmation.** No enemies/combat/damage/pickups/tank effects/death/boss completion is claimed.

## Native reference and adaptation limits

Supplied MM1 USA ROM, JSNES2.1.0 and Mesen RGB mapping; not execution of the Mesen executable or hardware. The inherited controlled lead-ins include the earlier rightward traversal. For this connection only, the player is placed once at actual page12/X56/Y40 with fraction/velocity/pose reset and protection100; a neutral original frame refreshes ladder collision cache, then original Up-only input runs. This is not natural whole-stage traversal or a new comprehensive ASM byte audit.

- Up: trigger49, scrolling81–140, finish141, bookkeeping174, normal control175: age126.
- Down-only from settled Up184, no additional RAM/ROM patches: trigger14, scrolling46–105, finish106, bookkeeping108, control109: age95.
- Fresh Up presses123–125 ignored,126–128 accepted; fresh Down92–94 ignored,95–97 accepted independently. Stripe flags alone do not establish input readiness.
- Original begin13/end15/order8; all **2880 tile-ID and palette pairs** validated against live nametables. A separate900-frame controlled Right traversal pinsY36/velocity0/protection100 and uses A once to detach. It verifies camera/PPU behaviour, not walk/jump traversal or enemies.
- No kind2 block entries in original pages13–15. New dispenser artwork matches the existing sprite exactly. Thirty building cells excluded from new scenery; sixty feature-marked cells across both dispensers. Rendering original building scenery as our sprite/object is an authorized adaptation, not an original NES sprite claim.
- Full accepted1536×1920 scene is pixel-identical after a240Y shift; the widened lower-right area stays cyan. Full new768×240 stripe matches decoded native art, including the separate building. Existing25-tile atlas and sprite recovery copies are byte-identical.
- Actual camera GML matches every busy frame in all sixteen captured direction cases, both900-frame horizontal camera captures, boundaries, merged seams, coordinate contract, charge/rearm and cleanup in source/model tests. Native entry subpixels are injected for comparison; MM5 real-entry positions differ. Existing MM5 artwork, normal physics,1.296875 ladder speed,9-update climb cadence,8px edge padding, charge/menu and fall policies remain adaptations.

## Rollback to accepted Seventh

Restore Seventh's five scripts and three camera events as a set. Room width2048→1536, height2160→1920, starting viewY1920→1680, player start originalY+1680 (180→1860). Seventh features restore one dispenser864,848; thirteen blocks remain. Existing sprite/object resources, helpers, guards, Stage Create and music are unchanged. Restart. Never mix checkpoint coordinates or restore baked building tiles.
