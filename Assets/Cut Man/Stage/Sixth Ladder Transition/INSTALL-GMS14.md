# Sixth ladder connection — GMS1.4.1760

Upgrade ONLY from the user-confirmed working **Fifth Ladder Transition** baseline. Adds originalpage11/room6 above page10's top-right ladder, upward handoff, and downward return. Preserve separated dispenser; no enemies/cutter spawning/death yet. Back up project first. Complete ALL replacements and coordinates before restarting, not just the tile script.

## 0. Matched update / resource prerequisites

Last accepted openingview wasY1200 with room1536x1440. This upgrade moves ALL prior content another240DOWN; new openingview **Y1440** and room1536x1680. Do not mix old camera/collision/blocks/features with new scenery. CameraCreate rejects old room dimensions, rather than silently hiding terrain. Do not move tile coordinates independently.

**No new resource names or artwork imports.** Existing Background bg_mm1_cutman_ladder_route_tileset (128x64,25tiles) and Sprite spr_mm1_super_cutter_dispenser (96x80,origin0,0) are unchanged. Copies are included only for recovery if missing; do not reimport/rename correct working assets. Background remains Background, not Sprite;16x16tiles/zerooffsets/separations, preservealpha/RemoveBackgroundOFF. Reference PNGs are for inspection, not room backgrounds.

## 1. Replace FIVE EXISTING scripts

Folder **Scripts > Cut Man > Stage > Ladder Route**, or keep your existing folder. Use matching entire.gml, same exact resource names, no duplicates:

1. scr_mm1_cutman_ladder_route_tiles
2. scr_mm1_cutman_ladder_route_collision
3. scr_mm1_cutman_ladder_route_blocks
4. scr_mm1_cutman_ladder_route_features
5. scr_mm1_cutman_scroll_start

Keep scr_mm1_cutman_route_busy, scr_mm1_cutman_scroll_finish, scr_mm1_cutman_scroll_dispose unchanged. PlayerStep/pauseBeginStep guards unchanged; no projectile/charge/arrival/HUD/audio edits.

**No stage Create changes.** Existing supplied code correctly calls tiles once, initialises music, then collision/blocks/features once. Keep all calls/music/async/Alarms/cleanup/unrelated code; do not replace wholeCreate or add duplicate calls. AllTWELVEblocks and building scripted, no manualinstances.

Features script must be replaced with geometry: dispenser moves864,368 -> **864,608**, remaining atsame screen-relative position in horizontal run nowY480. Still one separate non-solid object/sprite, not baked into tiles. No spawning/cutterAI installed.

## 2. Replace THREE EXISTING camera events

**Objects > Cut Man > Stage > Ladder Route > obj_mm1_cutman_camera**, or existing folder, sameONEinstance:

| Existing event | Matching entire file |
|---|---|
|Create|obj_mm1_cutman_camera_create.gml|
|Step > Begin Step|obj_mm1_cutman_camera_begin_step.gml|
|Step > End Step|obj_mm1_cutman_camera_end_step.gml|

Keep Other > Room End and Destroy unchanged. No normalStep/Draw. Invisible/no sprite/SolidOFF/nonpersistent. No secondcamera or lone assignment patched into olderBegin/EndStep. Existing helpers/cleanup/guards stayinstalled.

## 3. Room/view/player coordinates

**Rooms > Cut Man > Stage > rm_mm1_cutman_stage**:

- Width1536 unchanged; height **1440 ->1680**, speed60.
- Visible/enabled view0 room rectangle **X0,Y1440,W256,H240**, followNONE.
- Viewport **X0,Y0,W256,H240**, onlyview0visible. Keep256x240GUI/window/aspect/filtering/application surface settings.
- Cyan sky tiled horizontally AND vertically; Foreground/StretchOFF, speeds0. No scene panorama as background.
- EXISTING player keeps originalX. Correct startY is **original openingY+1440**. Original180 -> **Y1620** (was1380). If already1620, do not add another240. If custom creationcode overridesstart, correct that override instead of applyingboth. Do not move everycontroller.
- Keep existing one stage/music/arrival/HUD/pause/camera manager, no duplicates or editor-placed blocks/building.

| Section | World area | Camera |
|---|---|---|
|Opening pages0..3|X0..1023,Y1440..1679|X0..768,Y1440|
|First upper page4|X768..1023,Y1200..1439|X768,Y1200|
|Second upper page5|X768..1023,Y960..1199|X768,Y960|
|Third upper page6|X768..1023,Y720..959|X768,Y720|
|Horizontal stripe7..9|X768..1535,Y480..719|X768..1280,Y480|
|Fifth upper page10|X1280..1535,Y240..479|X1280,Y240|
|NEW page11/room6|X1280..1535,Y0..239|X1280,Y0|

1525sceneryplacements,73terrain solids,18ladder volumes,17tops,12separateblocks,onebuilding. Optional obj_stage_solid debugcount85 includes12block descendants. New nativepage11block atworld1312,Y128. All previous eleven simply translatedY+240. New seam ladderX1488/Y208/h96 spansY240, playercentre1496; no false seam platform. Earlier five seam ladders remain shifted/merged; no artificial tops atY240/480/720/960/1200/1440.

## 4. Restart and runtime checklist

1. Stop/restart; do not resumeoldroomstate. If prior temporary GUI diagnostic remains, opening MUST read **VIEW0,1440 / ATLAS128x64**. Opening ledgeY1536 ->screen96, floorY1632 ->screen192; player/block/scenery align. Ifview1200/960/720 remains, stop and checkALLthreecameraevents/duplicateoverrides; don'tarbitrarilyshiftplayer/tiles. RemoveonlytemporaryDrawGUI/RoomStartdiagnostics after verification.
2. READY/arrival/music/HUD work. Repeat allFIVEpreviousconnectionsbothdirections, opening and horizontalrun. Earlier timingunchanged: first126up/down; second/third/fourth126up/95down; fifth126up/down. Pause/charge/viewrestore remaincorrect.
3. Traverse horizontalrunright/left (camera768..1280,Y480), dispenserstillonespriteat864,608, no duplicatebuilding or missingblocks. No cutterprojectiles expected yet. Oldelevenblocks remain objects, no terrainbehind them.
4. In page10upperroom(nowY240), reach actual top-right outgoingladder, playerworldX1496. ClimbUp:32hold/60scroll/33settled+1bookkeeping; controlage126. CameraXstays1280. No arrival/musicrestart/horizontal snap.
5. Explore newpage11terrain/ladders. Twelfthblock1312,128 under top-left ladder is separate object, not scenery. Do not invent solidbackground for gray class0art. Next outgoing ladder is **TOP-LEFT**, playerworldX1320: NOT connected yet; stop before climbing out.
6. Descend SAME newbottom-right sharedladder1496 to page10. **This return is the SHORT95update schedule**, unlike fifthconnection's126down.32hold/60scroll/2settled/bookkeeping1, normalinput95. View1280,Y240. Repeat, then return throughfifth into horizontalrun'sfarrightview1280,Y480 and earlierconnections. No drift/false ladderlip.
7. Pause before/after both newdirections and in newroom; Startbeforetriggerhaspriority, Start/A duringautomaticphase cannotpause/jump/move. Cache/HUD/fades restorecorrectsection, no snaptobottom/left.
8. Holdcharge throughnewhandoff, release/re-presswhilebusy, firebasic/mid/fullbeforecrossing. Preserveoldcontinuouscharge/ownvoice, cancelstalechargeonrelease, release-rearmnewhold, clearoutgoingshots. Freshready126up/95downfire allowed; musicuntouched.
9. Horizontalrun'sexistingbottomlessgapworldX1184..1215 nowatY672..719: jumpacross. Death/respawn stilldeferred; fallinginmayrequirerestart. No fakefloor/teleport. Validreturnopeningfallsremain MM5controlleradaptation, notindependentnativefallreplaycertification; horizontalpitmustnotwronglyreturnintonarrowpage6.
10. Restart/re-enterusingexistingmechanisms: no duplicategeometry/building, stalebusyflag or pausedvoice. Report exactcompilerresource/event/line or direction/section/screenshot. No claimallstage/enemies/combat/pickups/tanks/death/bossdone.

28source/modelchecks pass, previousregressions pass. ActualGMScompiler/GPU/scheduler/async/with-descendant iteration/collisionfit unavailablehere; userruntimeacceptancerequired.

## Original reference / adaptation boundary

SuppliedMM1USA/JSNES2.1.0/MesenRGBmapping, notMesenexecutable/hardware. Controlledpriorlead-ins retained (including earlier900RightpinsY36/velocity0/protection100); one-timeplacementonactualpage10ladderX216/Y40 withfraction/velocity/pose/protectionreset, neutraloriginalcache-refreshframe, thenoriginalUp-only. NOT naturalwhole-stage traversal/newcomprehensiveASMbyteaudit.

SixthUp trigger49/scroll81..140/finish141/bookkeeping174/normal175(age126). Down-only fromearlysettledUp184 withoutnewpatches: trigger14/scroll46..105/finish106/bookkeeping108/normal109(age95). IndependentfreshUp123..125ignored/126..128accepted; Down92..94ignored/95..97accepted.960nativepage11tileIDs ANDpalettepairs checked against oddnametable. Originalkind2activepage11X32/Y128 yields new32x32block. Rawnewupperrender exactlyreconstructed withseparateblock; entireprevious1536x1440scene identicalafter240translation, includingdispenserfeature. Existing25tileatlasunchanged.

ActualcameraGML vsnativecaptures everybusyframe ALL12cases; earlier900controlledhorizontalframes stillmatchwithY+240. MM5normalmovement/art/climb1.296875/9updateanimation/8pxedgepadding/charge/menu/fallingpolicies remainadaptations. Tracecomparisoninjectsnativeentrysubpixels; MM5entrynaturallydiffers. No exactMM1playerclaim.

## Rollback

Restore acceptedFifth'sFIVEscripts andTHREEcameraevents, roomheight1680->1440/viewY1440->1200/playerstartoriginal+1200(180->1380), width1536unchanged. Features864,368 and11blocks restoredbyFifthscripts; keepseparatedbuilding, don'trestoreoldtile-onlydepiction. StageCreate/music/assets/helpers/cleanup/guardsunchanged. Restart; nevermixcheckpointcoordinates.
