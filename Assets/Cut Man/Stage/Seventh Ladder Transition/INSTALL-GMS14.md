# Seventh ladder connection — GMS1.4.1760

Upgrade ONLY from user-confirmed working **Sixth Ladder Transition**. Adds originalpage12/room4 above page11's TOP-LEFT ladder, upward handoff and downward return. Preserves all six accepted connections, sprite-backed dispenser and scripted blocks. No enemies/cutter spawning/death yet. Back up project first and apply ALL replacements/settings before restarting.

## 0. Keep a matched coordinate update

Current accepted openingviewY1440/room1536x1680 becomes **viewY1680/room1536x1920**. All prior scenery, collision, blocks and dispenser move240DOWN together. Don't replace only tiles or patch one camera assignment; this caused the earlier720/960missing-scenery problem. CameraCreate rejects old room dimensions. Follow full guide.

No NEW resource names or images. Existing Background **bg_mm1_cutman_ladder_route_tileset**128x64/25tiles and Sprite **spr_mm1_super_cutter_dispenser**96x80/origin0,0 are reused unchanged. Recoverycopies included only if needed; don't reimport/rename correct resources. Background remains a Background (not Sprite),16x16tiles/zerooffsets/separations, preservealpha/RemoveBackgroundOFF. No reference panorama as background.

## 1. Replace FIVE existing scripts

Folder **Scripts > Cut Man > Stage > Ladder Route**, or existing folder, keeping exact names. Paste matching ENTIRE.gml, no duplicates/suffixes:

1. scr_mm1_cutman_ladder_route_tiles
2. scr_mm1_cutman_ladder_route_collision
3. scr_mm1_cutman_ladder_route_blocks
4. scr_mm1_cutman_ladder_route_features
5. scr_mm1_cutman_scroll_start

KEEP scr_mm1_cutman_route_busy, scr_mm1_cutman_scroll_finish, scr_mm1_cutman_scroll_dispose unchanged. Existing playerStep/pauseBeginStep guards unchanged. No buster/charge/HUD/arrival/audio edits.

**No stage Create changes.** Existing user code correctly calls tiles once, initialises music, then collision/blocks/features once. Keep it intact: no extra calls, old geometry scripts or code moved toStep. Preserve ALL music/async/Alarms/cleanup/unrelated initialization.

Features script must move with route: dispenser864,608 -> **864,848**, same screen-relative position in horizontal stripe nowY720. Still one non-solid separate sprite/object, no duplicated30building tiles, no cutter spawning. AllTHIRTEENblocks remain scripted; no manualbuilding/blockinstances.

## 2. Replace THREE existing camera events

**Objects > Cut Man > Stage > Ladder Route > obj_mm1_cutman_camera** (or current folder), sameONEinstance:

| Existing event | Matching entire file |
|---|---|
|Create|obj_mm1_cutman_camera_create.gml|
|Step > Begin Step|obj_mm1_cutman_camera_begin_step.gml|
|Step > End Step|obj_mm1_cutman_camera_end_step.gml|

Keep Other > Room End and Destroy unchanged. Invisible/no sprite/SolidOFF/nonpersistent; no normalStep/Draw, no secondcamera. Don't keep olderBegin/EndStep with newCreate. Helpers/cleanup/guards remain installed.

## 3. Set exact room/view/player coordinates

**Rooms > Cut Man > Stage > rm_mm1_cutman_stage**:

- Width1536unchanged, height **1680 ->1920**, speed60.
- View0 visible/enabled, roomrectangle **X0,Y1680,W256,H240**, followNONE.
- Viewport **X0,Y0,W256,H240**, onlyview0visible. Keep256x240GUI/window/aspect/filtering/application surface settings.
- Cyan-onlysky tiled horizontally AND vertically, Foreground/StretchOFF, speeds0. No referencePNG as roombackground.
- EXISTING player keeps originalX. Correct startY is **original openingY+1680**. Original180 -> **Y1860** (was1620). If already1860, don't add another240. If custom creationcode overridesstart, adjust that override instead of both. Don't move allcontrollers.
- Existing stage/music/arrival/HUD/pause/camera managers stay, no duplicateinstances. Allblocks/dispenser scripted, none manuallyplaced.

| Section | World area | Camera |
|---|---|---|
|Opening pages0..3|X0..1023,Y1680..1919|X0..768,Y1680|
|First upper page4|X768..1023,Y1440..1679|X768,Y1440|
|Second upper page5|X768..1023,Y1200..1439|X768,Y1200|
|Third upper page6|X768..1023,Y960..1199|X768,Y960|
|Horizontal stripe7..9|X768..1535,Y720..959|X768..1280,Y720|
|Fifth upper page10|X1280..1535,Y480..719|X1280,Y480|
|Sixth upper page11|X1280..1535,Y240..479|X1280,Y240|
|NEW page12/room4|X1280..1535,Y0..239|X1280,Y0|

1719sceneryplacements,79terrain solids,20ladder volumes,19tops,13blocks,onebuilding. Optional obj_stage_solid debugcount92 includes13block descendants. New nativepage12block **1376,128**; prior12translatedY+240. Newseam ladderX1312/Y208/h160 spansY240 into previouslongleftladder; playercentre1320. No false seamtop. All seven seam ladders merged, no artificial top atY240/480/720/960/1200/1440/1680.

## 4. Restart and test

1. Stop/restart, notresumeoldroomstate. If retaining previous temporaryGUI diagnostic, opening MUST read **VIEW0,1680 / ATLAS128x64**. OpeningledgeY1776 ->screen96, floorY1872 ->screen192; player/block/terrain align. Ifview1440/1200/960/720, stop and checkALLthreecameraevents/duplicateoverrides, don'tshiftindividualtiles/player. RemoveonlytemporaryDrawGUI/RoomStartdiagnostics afterverification.
2. READY/arrival/music/HUD work. Repeat allSIXpreviousconnectionsbothdirections and horizontalrun. Timingunchanged: first126up/down; second/third/fourth126up/95down; fifth126up/down; sixth126up/95down. Pause/charge/viewrestore unchanged.
3. Horizontalrun stillcamera768..1280,Y720, dispenseronesprite864,848, all12previousblocksobjects. No cutterprojectiles expected yet; no duplicatebuilding or terrainbehindblocks.
4. In page11(nowY240), climb actual TOP-LEFT outgoingladder (playerworldX1320). New upwardhand-off holds32,scrolls60,settles33+bookkeeping1, control126. CameraX1280throughout, no snaptoleft/runstart, no arrival/musicrestart. Previouspage11BOTTOM-RIGHT returnstilluses1496; don'tconfusethese two differentladdercentres.
5. Explore newpage12platforms/ladders. Thirteenthblock1376,128 is separateobject, not scenery or permanentterrain. Next outgoingladder is TOP-LEFT atplayerworldX1336 (different fromincoming1320), NOT connected yet. Stop before climbing outthere.
6. Descend SAME newbottom-left sharedladder1320 to page11. Short95update return, view1280,Y240; no horizontal drift or false seamplatform. Returnthroughprevioussixth'sbottom-right1496ladder, thenfifth/horizontalrun/earlierconnections. Repeat several times.
7. Pause before/after bothnewdirections and innewroom; cachedscene/HUD/fades restorecorrectview. Startbeforetriggerhaspriority; Start/A whileautomatic cannotpause/jump/move. No background/musicreset.
8. Holdexistingcharge throughhandoff, release/re-pressduringbusy, firebasic/mid/fullbeforecrossing. Resumeoldcontinuouscharge/ownvoice, cancelstalechargeonrelease, release-rearmnewhold, clearoutgoingshots. Freshready126up/95downfire allowed; stage musicuntouched.
9. Existinghorizontalrun bottomlessgapworldX1184..1215 nowY912..959: jumpacross. Death/respawnstilldeferred; fallingmayrequirerestart. No inventedfloor/teleport. Falls throughvalidreturnopenings remainMM5controlleradaptation, not independentlynativefallreplaycertified; horizontalpitmustnotreturnintonarrowpage6.
10. Restart/re-enterusingexistingmechanisms: no duplicategeometry/building, stale busyflag or pausedvoice. Report compilerresource/event/line or direction/section/screenshot. No whole-stage/enemy/combat/pickup/tank/death/boss completionclaim.

31source/modelchecks pass, priorregressions pass. ActualGMScompiler/GPU/scheduler/async/with-descendantiteration/collisionfit unavailablehere; runtimeconfirmation remainsrequired.

## Original reference / adaptation limits

SuppliedMM1USA/JSNES2.1.0/MesenRGBmapping, notMesenexecutable/hardware. Controlledpriorlead-ins retained (includingearlier900RightpinsY36/velocity0/protection100); one-timeplacementpage11leftladderX40/Y40, fraction/velocity/pose/protectionreset, neutraloriginalcache-refreshframe, thenoriginalUp-only. NOT naturalwhole-stage traversal ornewcomprehensiveASMbyteaudit.

SeventhUp trigger49/scroll81..140/finish141/bookkeeping174/normal175(age126). Down-onlyfromearlysettledUp184 withoutnewpatches: trigger14/scroll46..105/finish106/bookkeeping108/normal109(age95). FreshUp123..125ignored/126..128accepted; freshDown92..94ignored/95..97accepted independently.960nativepage12tileIDs ANDpalettepairs checked againstevennametable. Originalkind2activepage12X96/Y128 givesnew32x32block. Newupperrawimage exactlyreconstructed withseparateblock, entireprevious1536x1680scene identicalafter240translation includingdispenserfeature. Existing25tileatlasunchanged.

ActualcameraGML vsnativecaptures everybusyframe ALL14cases; prior900controlledhorizontalframesstillmatchwithY+240. MM5normalphysics/art/climb1.296875/9updateanimation/8pxedgepadding/charge/menu/falling policies remainadaptations. Capturednativeentrysubpixelsinjectedfortracecomparison; MM5entriesnaturallydiffer. No exactMM1playerclaim.

## Rollback

Restore acceptedSixth'sFIVEscripts/THREEcameraevents; roomheight1920->1680/viewY1680->1440/playerstartoriginal+1440(180->1620), width1536unchanged. Features864,608 and12blocks restoredbySixth scripts. Keepseparatedbuilding, don'trestoretile-onlydepiction. StageCreate/music/assets/helpers/cleanup/guardsunchanged. Restart, nevermixcheckpointcoordinates.
