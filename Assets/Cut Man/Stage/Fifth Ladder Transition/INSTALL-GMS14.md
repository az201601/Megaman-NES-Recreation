# Fifth ladder connection — GMS1.4.1760

Upgrade ONLY from the now user-confirmed **Fourth Coordinate Repair + dispenser separation** working baseline. Adds original page10/room3 above the FAR-RIGHT ladder of3screen stripe7..9, upward handoff and downward return. No enemies/combat/spawning/death yet. Back up project first and complete ALL replacements/settings before running.

## 0. Keep this a matched coordinate update

Previous blank terrain was a real camera/tile mismatch (VIEW720 with opening tiles intended forVIEW960), now confirmed repaired. This upgrade moves existing content another240DOWN, so new opening view is **Y1200**, not960. Replace ALL listed camera/geometry/feature resources, then room/player settings together. Do not fix just one view variable, translate tiles independently, or apply only the tiles script. Camera Create rejects wrong room dimensions.

No NEW resource names. Existing128x64 bg_mm1_cutman_ladder_route_tileset and96x80 spr_mm1_super_cutter_dispenser are reused, pixel-identical copies included only for recovery. If already correct, do not reimport or rename them. Background must remain a Background resource,16x16tile settings/zerooffsets, preserve alpha/RemoveBackgroundOFF; sprite origin0,0,oneframe. Do not import reference PNGs as room backgrounds.

## 1. Replace FIVE EXISTING scripts

Folder **Scripts > Cut Man > Stage > Ladder Route** (or your existing folder). Paste each matching ENTIRE.gml into same existing resource; no duplicate names/suffixes:

1. scr_mm1_cutman_ladder_route_tiles
2. scr_mm1_cutman_ladder_route_collision
3. scr_mm1_cutman_ladder_route_blocks
4. scr_mm1_cutman_ladder_route_features
5. scr_mm1_cutman_scroll_start

Keep scr_mm1_cutman_route_busy, scr_mm1_cutman_scroll_finish and scr_mm1_cutman_scroll_dispose UNCHANGED. No player ordinaryStep/pauseBeginStep guard changes. No projectile/charge manager, arrival/HUD or music edits.

**No stage Create changes.** User's existing code is correct: tiles once, existing music setup, collision/blocks/features once. Keep that code/order. Do not replace entire event or add more calls. Eleven blocks and one dispenser remain scripted; no manual room instances. Do not also run old opening/other checkpoint geometry scripts.

Features script is ESSENTIAL: building moves fromworld864,128 to **864,368**, staying atsame screen-relative position in horizontal run nowatY240. Artwork is still a separate obj_mm1_super_cutter_dispenser/sprite, with no duplicate tiles and no cutter spawning yet. Existing object Create/default Draw settings unchanged.

## 2. Replace THREE EXISTING camera events

**Objects > Cut Man > Stage > Ladder Route > obj_mm1_cutman_camera**, or existing folder. Same ONE instance, no sprite/invisible/SolidOFF/nonpersistent:

| Existing event | Entire matching file |
|---|---|
|Create|obj_mm1_cutman_camera_create.gml|
|Step > Begin Step|obj_mm1_cutman_camera_begin_step.gml|
|Step > End Step|obj_mm1_cutman_camera_end_step.gml|

Keep Other > Room End and Destroy unchanged. No normalStep/Draw. Do not leave an olderBegin/EndStep overriding new coordinates. No second camera.

## 3. Set room/view/player to exact new coordinates

**Rooms > Cut Man > Stage > rm_mm1_cutman_stage**:

- Width stays **1536**; height **1200 ->1440**; speed60.
- View0 enabled/visible, room rectangle **X0,Y1200,W256,H240**, followNONE.
- Viewport stays **X0,Y0,W256,H240**; only view0 visible. GUI256x240, window/aspect/filtering/application surface settings unchanged.
- Cyan sky tiled horizontally AND vertically, Foreground/StretchOFF, speeds0. Never use assembled scenery references as backgrounds.
- EXISTING player keeps originalX. Correct startY is **original openingY+1200**. If original180, set **Y1380** (was1140). If already1380, do not add another240. If custom instance/creation code overrides start, correct that instead, not both.
- Stage/music/HUD/pause/arrival/camera manager instances stay in place, no duplicates. All blocks/building scripted; don't manually move/add them.

| Section | World area | Camera |
|---|---|---|
|Opening pages0..3|X0..1023,Y1200..1439|X0..768,Y1200|
|First upper page4|X768..1023,Y960..1199|X768,Y960|
|Second upper page5|X768..1023,Y720..959|X768,Y720|
|Third upper page6|X768..1023,Y480..719|X768,Y480|
|Horizontal stripe7..9|X768..1535,Y240..479|X768..1280,Y240|
|NEW page10/room3|X1280..1535,Y0..239|X1280,Y0|

1343scenerytiles/68terrain solids/17ladder volumes/16tops/11separateblocks/onebuilding. Optional debug query obj_stage_solid count79 includes11block descendants. New original page10block isworld1376,Y160. Old ten and all earlier terrain simply translatedY+240. New shared ladderX1488/Y192/h112 merges acrossseamY240; playercentre1496. Previous four seam ladders preserved and shifted; no false top at any seam.

## 4. Restart and test in order

1. Stop/restart. If retaining previous temporary GUI diagnostic, opening MUST show **VIEW0,1200 / ATLAS128x64**. Opening ledgeworldY1296 appears atscreenY96 and floorY1392 atscreenY192; player/blocks/terrain align. RemoveonlytemporaryGUI/RoomStartpopup diagnostics after verification. If view is960/720, stop: another older event/camera is still active; do not arbitrarily move tiles/player.
2. Check READY/arrival/music/HUD and earlier opening gameplay. Repeat ALL FOUR accepted ladder connections both ways. They should look unchanged on screen: first126up/down, second/third/fourth126up/95down.
3. Walk right through existing upper horizontal run and back: camera still follows/clamps768..1280, nowY240. Dispenser still present as one non-solid sprite/object atsame screen-relative location; all ten original blocks remain, no duplicate image. No cutter projectiles yet.
4. At run's FAR-RIGHT top ladder, climbUp (playerworldX1496). New handoff holds32updates, scrolls60, settles33+bookkeeping1; controlage126. CameraXstays1280, not768; no horizontal snap to start of run, no arrival replay or music restart.
5. Explore new upper platforms/ladders with MM5 movement. Find11thblock1376,160, separate object not scenery; floor collision unchanged if later removed. New top-right outgoing ladder is NOT connected yet: stop before climbing out there.
6. Descend SAME bottom-right new shared ladder1496 into horizontal run's FAR-RIGHT end. **This downward return uses126updates**, unlike previous95short returns, matching original longer stripe restore. Return viewX1280/Y240; notleft768. Repeat, then traverse runleft and return through earlier connections.
7. Pause before/after each new direction, new room and mid/ends of run; restore correct view, HUD/fade/audio/charge. Start/A during automatic handoff cannot pause/jump/move; Start before trigger retains pause priority.
8. Hold existing charge through handoff; release/re-press during it; fire basic/mid/full before crossing. Own voice/counter pauses/resumes continuoushold; released charge cancelled, newhold release-rearmed, old projectiles cleared. Fresh ready126fire allowed both newdirections. Stage music untouched.
9. Existing horizontalrun bottomless gapworldX1184..1215 nowatY432..479: jump across. **Death/respawn still deferred**, falling in mayrequire restart. No invented floor or teleport. Falls through valid return openings remain MM5controller adaptations, not independently original falling replay-certified. New narrow upperroom fall returns into correct far-right stripe end; old horizontalpit mustnot return into narrow page6.
10. Restart/re-enter stage using existing mechanisms, no duplicate geometry/building, stale busyflag or paused voice. Report resource/event/line for compilation or screenshot/direction/section for runtime. Do not claim whole-stage completion; new next outgoing ladder, enemies/combat/damage/pickups/tanks/death/boss remain undone.

GameMaker compiler/GPU/scheduler/async/with-descendant iteration unavailable here.26source/model checks and prior regressions pass, but actual runtime acceptance remains yours.

## Original evidence / adaptation boundary

Supplied MM1 USA/JSNES2.1.0/MesenRGBmapping, NOT Mesen executable/hardware. Inherits prior controlled lead-ins; traverses stripe7..9 with oneA detach thenRight900frames while pinningY36/velocity0/protection100. One-time placement on actualpage9 ladderX216/Y40 with state reset, one neutral original frame refreshes cachedladder centre, then originalUp-only. NOT natural whole-stage traversal or comprehensive new routine byte audit.

Fifth Up trigger49,scroll81..140,finish141,bookkeeping174,first normal175(age126). Down-only fromearlysettledUp184 without extra patches: trigger14,scroll46..105,finish106,bookkeeping139,first normal140(age126). Independent one-frame Up AND Down probes123..125ignored/126..128accepted.960newroom tile IDs AND palettes match actualevennametablepage10; activekind2/page10X96,Y160 record yields32x32newblock. Entire new upperrender reconstructed exactly with separateblock. Entire prior1536x1200reference matches after240translation, including dispenser as sprite. Existing atlas reused exactly, no newart.

Actual cameraGML compares every busyframe ALL TEN up/down captured cases; prior900frame horizontal trace stillmatches withY+240. MM5normal movement/art/ladder1.296875/animation9updates/8pxedgepadding and customcharge/menu/falling policies remain adaptations. Comparisons inject nativecaptured entry subpixels; MM5entriesnaturallydiffer. Final fractionalclear/carry/phases measured, not copied blindly.

## Rollback

Restore last accepted corrected Fourth coordinate files and dispenser-corrected tile/features scripts, NOT old tile-only building version. Roomheight1440->1200, viewY1200->960, playerstartoriginalY+960 (180->1140), onlyonce. Width1536unchanged, atlas/sprites/StageCreate/music/helpers/RoomEnd/Destroy/guards unchanged. Previousblockscriptcreates10, featureposition864,128. Restart; never mix newtiles witholdcamera/collision.
