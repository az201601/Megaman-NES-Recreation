# Complete Cut Man — active stage milestone plan

User requests finishing Cut Man before moving on to another stage. Work one installable/testable checkpoint at a time in GMS1.4.1760; no editable GMX in repo. Do not equate prepared sources/reference research with installation.

## Preserve installed baseline

MM1 title/select/Cut Man intro/first-screen stage and stage music. MM5 movement, jump, ladders, slide/trailing dust, basic/charged buster, READY/arrival, actual-health HUD and custom pause menu. User explicitly confirmed BOTH opening/closing pause transitions work and look right in-game. Starting02 spare lives, Buster only, tanks0. Unobtained weapons hidden/skipped. Music/charge ownership/freeze behaviour preserved. No score anywhere in recreated game.

The four-screen opening route/camera is installed and user-accepted. Screen01 and Opening Route packages remain historical snapshots. First Ladder Transition is the next prepared source package; its runtime acceptance is pending.

## Checkpoints

1. **Stage connections first (user-approved revised order)**: expand original layout/camera in manageable installable checkpoints. Opening four-screen run accepted. First upward ladder + upper page4 + downward return prepared; await runtime validation before next outgoing connection. Original scenery tiles with separate invisible solids/ladders and removable blocks; no invented connectivity.
2. **Opening enemy + player combat foundation after connections**: recover first Blader and original spawn trigger; graphics imported, AI model tested, active enemy not installed. Finish MM5 hurt/protection/recoil/interruption checks before damage integration. Earlier independent-projectile/full-state matrix incomplete; do not label finished.
3. **Stage enemy roster/hazards**: measure and implement each encountered type/behaviour, shots, drops and audio. No unsupported whole-stage fidelity claims; keep MM5 player damage/hazard rules (not MM1 spike exception).
4. **Pickups + one Cut Man E-Tank**: implement approved MM5-style health/weapon pickups, actual refill/consumption/limits and feedback before allowing tank consumption. Choose visible optional E route after layout inspection. Approved distribution elsewhere remains unchanged. No W/M/Balancer in Cut Man under current approved plan.
5. **Death/checkpoints/retry**: once real damage/hazards exist, implement lives/death/respawn/re-entry and music/arrival/inventory handling, preserving02 spare-life semantics. Exact rules still need reference/design decisions; do not silently invent resets or tank respawn/farming policy.
6. **Boss section**: recover approach, doors, arena and Cut Man behaviour, attacks/damage/audio, then fight and defeat progression/reward/return. No CLEAR POINTS/score. Boss-door/player interactions must accommodate MM5 controller.
7. **Complete-stage test**: start to finish, transitions/scrolling, enemies/respawns/drops, pickups, E-tank use, death/retry, ladders/slides/charge, pause at each phase, audio continuity, boss/reward/return. Runtime user checks required.

## Current progress

Opening encounter replay regenerated from supplied MM1 ROM, no RAM/ROM patches; first Blader reference captured at100/110 with original score rows excluded. Natural body contact lowers original HP28->25 at110 and25->22 at222 in specified input trace. These are encounter evidence, NOT a complete enemy implementation, native MM5 damage certification, collision mask or spawn timing. See cutman-stage-reference/README.md.

The original encounter checkpoint itself installed no enemy controller. Preserve the accepted opening route while advancing stage connections before combat. Exact E pickup location remains undecided. Do not ask for already supplied ROMs or rewrite approved UI/player art.

## Blader graphics/motion checkpoint

Recovered two native16x24 left-facing rotor frames,32x24strip. Sprite-only import guide under Assets/Enemies/MM1/Blader; no enemy object/combat installation yet.249 relevant original USA AI/helper bytes matched external disassembly labels; independent fixed-point model matches1023native AI updates across three movement branches,16attack entries/15reversals. Two rotor states change every3observed enemyupdates. Fourth idle branch produces no spawn in360updates.

**Placement prerequisite discovered:** first Right-branch Blader spawns worldX272,Y76 at update21; Right+jump reaches it at15. This is camera/progression dependent, not timer spawning. At discovery the Screen01-only room was256wide; opening route/camera expansion has since been accepted. Still decode the spawn trigger before adding an enemy; do not squeeze it into wrong spot to make isolated first-screen test seem complete. Exact original spawn trigger still to decode. Current work is stage connections; pending player combat checks follow that user-approved priority. Working pause transitions remain unchanged.

## Historical opening-route/camera source checkpoint (subsequently accepted below)

Blader sprite import explicitly confirmed by user. Now recovered original first horizontal stripe: pages0..3,1024x240, bounds0..768 for256x240view; next original handoff is upward ladder. New manual GMS1.4ZIP under Assets/Cut Man/Stage/Opening Route/Downloads.13tile128x32atlas,462placements,22static solids,6ladder regions,5internalone-way tops,9separate32x32SuperArmobjects. Historical package kept original4editorblocks and created5extensionblocks; superseded placement requirement below now createsALL9byscript. Original first-screen solid/ladder coverage tested exact; removed only old black framebuffer scanline0 in scenery, skycyan otherwisefirstscreenunchanged. Native4screencompositefullyreconstructedwith9spriteobjects, no enemy/score baked in.

Native tile/attribute checks:1920tileIDs+1920paletteentries atbootpages0/1;1920morepairs viaoriginalscrollrenderer forpages2/3 with CONTROLLED Y36/protection100 traversal. Not natural collision/playthrough certification. Camera actualGML simplecenterfloorplayerX-128clamp0..768 matches1620frames across3naturalbranchesand1controlled. OriginalMM5player/arrival/HUD/charge/pause/audio unchanged; basic/chargedparentalreadyview-awareculling. User mustcheckruntimeeventorder, view/window, shotedge and pause snapshot while scrolling.

Install upgrades EXISTINGroom width1024height240speed60,cyanbackground horizontaltiling,visibleview0logical256x240viewport256x240followNone; one new invisiblecameraCreate+EndStep; new3scripts replacingONLYoldtiles/collisioncalls inexistingstageCreateandaddingextensionblockscall. No musicCreateoverwrite. Clear guide details/freshrestart/rollback. Stage source/model and pause/UI regression checks PASS, GMScompiler/runtime not available. **No upperladder handoff yet; do not climb out until next checkpoint. No enemycombat/damage/death/pickups/tank implementation.** Awaituserinstallation/confirmation before claiming complete/playable stage.

## User runtime acceptance — opening route/camera

After installing the four-screen opening route and camera package, user reports: **"working very well"**. Treat the installed opening-route/camera update as the working baseline. This is overall runtime acceptance, not a separate claim that every individual checklist case was independently reported. Preserve existing player, music, HUD and pause systems. Next route checkpoint is the original upward ladder handoff at the far right into the next section; no vertical handoff, enemies/combat, pickups or whole-stage completion is implied by acceptance of this opening run.

## Updated placement requirement — user removed manual blocks

User explicitly removed the four original editor-placed Super Arm/Guts block instances and requests script placement for all stage scenery and blocks going forward. Next installation must create ALL NINE opening-run blocks, including the first four, once per room entry; never assume four manual instances still exist. First Ladder Transition builder and block script updated to this requirement. Blocks remain separate obj_mm1_super_arm_block instances (with inherited collision), NOT scenery tiles. Preserve stage music/async audio and other unrelated stage-object code when replacing geometry setup calls. Do not instruct moving four now-deleted editor blocks. The old guide is historical, not current placement guidance. New guide rollback instead adds four creation calls to old block script so no manual instances are required. New ladder-transition package prepared for delivery; user installation/runtime acceptance pending.


## First ladder transition source checkpoint — runtime pending

First Ladder Transition package adds measured up/down handoff, upper originalpage4/room28, combined1024x480geometry, existing atlas reuse, all9scriptedblocks. Seven scripts; cameraCreate/EndStep replacements plusBeginStep/RoomEnd/Destroy; two prefix guards on playerStep/pauseBeginStep. Existing stageCreate ONLY three geometry calls change; music/async retained. Room height480/viewY240/playerstartY+240; no manual block placement.

11source/model checks pass, including actual cameraGML vs native up/down every busyframe, source tile/geometry reconstruction, charge release/rearm/cleanup. Native freshUp probes correct prior interpretation: busyages0..125, normalcontrol126 (32hold/60scroll/33settled/1bookkeeping). Captured original Up lead-in controlled; Down-only return unpatched from settled state; no natural whole-stage certification. MM5 art/climb/normalphysics preserved adaptations; falling-return adaptation not native-certified. Regressions: opening, pause16/UI, Blader1023update model pass. ZIP byte-audited. GMScompiler/GPU/scheduler/async actualruntime NOT available; user checklist remains required. Next upper outgoing connection/enemies/combat/death/tanks/boss remain undone.

## User runtime acceptance — first ladder connection

User installed/tested first upward ladder, upper page4 and downward return. Clarified typo to **“couldnt be more perfect”**. Treat First Ladder Transition as installed and runtime-accepted working baseline, superseding earlier pending status above. Not a separately reported exhaustive checklist certification. Preserve it while adding subsequent connections; enemies/combat remain after connections.

## Second ladder connection source checkpoint — runtime pending

Adds next original page5/room31 above page4 with up/down handoff. World1024x720, all accepted content translated240; bottom cameraY480, page4Y240, page5Y0. All9blocks remain script-created.710placements/34terrain solids/11ladders/10tops, existing13tile atlas reused. Four existing script replacements and three existing camera event replacements; no new resources, guards, stageCreate/music, player/HUD/arrival/pause edits. Room/playerstart shift another240 per new installation guide. Historical package unchanged for rollback.

Second Up original trigger25/scroll57..116/finish117/bookkeeping150/freshcontrol151 (age126). Second Down trigger32/scroll64..123/finish124/bookkeeping126/control127 (age95). New return has2settled updates92..93 rather than33; independent freshDown probes92..94ignored/95..97accepted. First handoff both directions remains126.960new-room tile/palette comparisons against actual odd nametable pass. Controlled one-time outgoing-ladder placement X216,Y40 inherits first probe's controlled lead-in; original Up-only then Down-only, NOT natural whole-stage traversal. No newly claimed comprehensive routine byte audit.

15source/model checks pass including actual GML every busy frame all four cases, preserved accepted lower cells/blocks except translation, both seam ladders, short-return/freshfire95, cleanup/charge and actual710tile reference reconstruction. Original first-scroll/opening/pause-stage16/pauseUI/Blader1023update regressions pass. ZIP byte-audited. GMScompiler/GPU/scheduler/async/with-descendant loop runtime unavailable; new installation/user acceptance pending. MM5 normal movement/art/climb/edge-padding and falling returns remain adaptations. Next outgoing ladder/page6, enemies/combat, pickups/tanks, death/checkpoints, boss and completion remain undone.
