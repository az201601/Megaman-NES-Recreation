# Complete Cut Man — active stage milestone plan

User requests finishing Cut Man before moving on to another stage. Work one installable/testable checkpoint at a time in GMS1.4.1760; no editable GMX in repo. Do not equate prepared sources/reference research with installation.

## Preserve installed baseline

MM1 title/select/Cut Man intro/first-screen stage and stage music. MM5 movement, jump, ladders, slide/trailing dust, basic/charged buster, READY/arrival, actual-health HUD and custom pause menu. User explicitly confirmed BOTH opening/closing pause transitions work and look right in-game. Starting02 spare lives, Buster only, tanks0. Unobtained weapons hidden/skipped. Music/charge ownership/freeze behaviour preserved. No score anywhere in recreated game.

Only Screen01 scenery/layout exists in stage asset folder; its old static-only README describes its own original checkpoint, NOT all later installed player systems. Remaining route, camera/scrolling and transitions are not delivered by that tiles script.

## Checkpoints

1. **Opening enemy + player combat foundation**: inspect original first Blader; recover animation, movement/attack, collision/shot response, destruction and associated audio before installing. In parallel finish relevant MM5 hurt/protection/recoil/interruption checks, then connect actual health display. Earlier independent-projectile/full-state matrix incomplete; do not label finished. Start here rather than manufacture every remaining room without combat.
2. **Remaining stage route**: audit original whole Cut Man route and room connectivity; recover native scenery tiles and placements, separate invisible solids/ladders, transitions/camera and object spawn data. Do not invent screen count, camera rules or placements. Sky alone is background; terrain scenery is tiles. Enemies/player/spikes/doors/removable Super Arm blocks are objects/sprites. Expand/test in manageable sections with MM5 player fit.
3. **Stage enemy roster/hazards**: measure and implement each encountered type/behaviour, shots, drops and audio. No unsupported whole-stage fidelity claims; keep MM5 player damage/hazard rules (not MM1 spike exception).
4. **Pickups + one Cut Man E-Tank**: implement approved MM5-style health/weapon pickups, actual refill/consumption/limits and feedback before allowing tank consumption. Choose visible optional E route after layout inspection. Approved distribution elsewhere remains unchanged. No W/M/Balancer in Cut Man under current approved plan.
5. **Death/checkpoints/retry**: once real damage/hazards exist, implement lives/death/respawn/re-entry and music/arrival/inventory handling, preserving02 spare-life semantics. Exact rules still need reference/design decisions; do not silently invent resets or tank respawn/farming policy.
6. **Boss section**: recover approach, doors, arena and Cut Man behaviour, attacks/damage/audio, then fight and defeat progression/reward/return. No CLEAR POINTS/score. Boss-door/player interactions must accommodate MM5 controller.
7. **Complete-stage test**: start to finish, transitions/scrolling, enemies/respawns/drops, pickups, E-tank use, death/retry, ladders/slides/charge, pause at each phase, audio continuity, boss/reward/return. Runtime user checks required.

## Current progress

Opening encounter replay regenerated from supplied MM1 ROM, no RAM/ROM patches; first Blader reference captured at100/110 with original score rows excluded. Natural body contact lowers original HP28->25 at110 and25->22 at222 in specified input trace. These are encounter evidence, NOT a complete enemy implementation, native MM5 damage certification, collision mask or spawn timing. See cutman-stage-reference/README.md.

No new GameMaker resource installation in this research checkpoint. Existing project must stay playable while next enemy/combat package is prepared. Exact E pickup location remains undecided. Do not ask for already supplied ROMs or rewrite approved UI/player art.

## Blader graphics/motion checkpoint

Recovered two native16x24 left-facing rotor frames,32x24strip. Sprite-only import guide under Assets/Enemies/MM1/Blader; no enemy object/combat installation yet.249 relevant original USA AI/helper bytes matched external disassembly labels; independent fixed-point model matches1023native AI updates across three movement branches,16attack entries/15reversals. Two rotor states change every3observed enemyupdates. Fourth idle branch produces no spawn in360updates.

**Placement prerequisite discovered:** first Right-branch Blader spawns worldX272,Y76 at update21; Right+jump reaches it at15. This is camera/progression dependent, not timer spawning. Existing Screen01-only room is256wide, so expand route/camera before placing the first enemy; do not squeeze it into wrong spot to make isolated first-screen test seem complete. Exact original spawn trigger still to decode. Current next work includes that route/camera foundation alongside pending player combat checks. Working pause transitions remain unchanged.

## Opening-route/camera source checkpoint (installation/runtime pending)

Blader sprite import explicitly confirmed by user. Now recovered original first horizontal stripe: pages0..3,1024x240, bounds0..768 for256x240view; next original handoff is upward ladder. New manual GMS1.4ZIP under Assets/Cut Man/Stage/Opening Route/Downloads.13tile128x32atlas,462placements,22static solids,6ladder regions,5internalone-way tops,9separate32x32SuperArmobjects. Keep original4editorblocks; extension script creates5only. Original first-screen solid/ladder coverage tested exact; removed only old black framebuffer scanline0 in scenery, skycyan otherwisefirstscreenunchanged. Native4screencompositefullyreconstructedwith9spriteobjects, no enemy/score baked in.

Native tile/attribute checks:1920tileIDs+1920paletteentries atbootpages0/1;1920morepairs viaoriginalscrollrenderer forpages2/3 with CONTROLLED Y36/protection100 traversal. Not natural collision/playthrough certification. Camera actualGML simplecenterfloorplayerX-128clamp0..768 matches1620frames across3naturalbranchesand1controlled. OriginalMM5player/arrival/HUD/charge/pause/audio unchanged; basic/chargedparentalreadyview-awareculling. User mustcheckruntimeeventorder, view/window, shotedge and pause snapshot while scrolling.

Install upgrades EXISTINGroom width1024height240speed60,cyanbackground horizontaltiling,visibleview0logical256x240viewport256x240followNone; one new invisiblecameraCreate+EndStep; new3scripts replacingONLYoldtiles/collisioncalls inexistingstageCreateandaddingextensionblockscall. No musicCreateoverwrite. Clear guide details/freshrestart/rollback. Stage source/model and pause/UI regression checks PASS, GMScompiler/runtime not available. **No upperladder handoff yet; do not climb out until next checkpoint. No enemycombat/damage/death/pickups/tank implementation.** Awaituserinstallation/confirmation before claiming complete/playable stage.
