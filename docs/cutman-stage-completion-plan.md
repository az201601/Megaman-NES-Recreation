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

## User runtime acceptance — second ladder connection

User installed/tested Second Ladder Transition and reports **“again, perfection itself”**. Both first and second connections, their upper rooms and downward returns are now accepted working baseline, superseding earlier pending second-checkpoint status. User approved continuing with third outgoing connection. Preserve stage connections-before-enemies order and all9scriptedblocks.

## Third ladder connection source checkpoint — runtime pending

Adds original page6/room29 above page5, third upward handoff and downward return.1024x960world, openingY720, pages4/5/6 atY480/240/0.899tiles/44terrain solids/13ladder volumes/12tops/9scriptedblocks, existing13tile atlas reused exactly. Four existing scripts and three camera event replacements; no new resource imports or stageCreate/music/player/pause/HUD/arrival changes. Room/view/playerstart shift another240 per manual guide; earlier packages intact for rollback. New room's NEXT outgoing ladder is top-left, not top-right; next connection remains undone.

Third Up original trigger25/scroll57..116/finish117/bookkeeping150/control151 (=age126); third Down trigger14/scroll46..105/finish106/bookkeeping108/control109 (=age95). Independent freshUp123..125ignored/126..128accepted, freshDown92..94ignored/95..97accepted.960new-room tile/palette checks against original even nametable pass. Controlled one-time page5 ladder placement X216,Y40/fraction/velocity/pose/protection reset, inheriting prior controlled lead-ins; then original Up-only. Down-only from early settled Up frame160, no further patches. Earlier lingering300frame exploratory return encountered native enemy interference; final trace intentionally takes settled snapshot160 before this contact, preserving on-ladder return. No natural whole-stage certification or new comprehensive disassembly byte audit.

17source/model checks pass: actual cameraGML every busy frame ALL SIX directions/cases vs original traces, accepted lower cells/blocks unchanged except240translation, three merged seam ladders/no false seam tops,899actual tile-call reference reconstruction, charge/rearm/cleanup/bounds and fresh ready95fire. Previous first/second/opening/pause-stage16/UI/Blader1023update regressions pass; ZIP byte audited. GMScompiler/GPU/scheduler/async/with-descendant iteration unavailable; third installation and user runtime acceptance pending. MM5 player/art/climb/edge-padding/falling returns remain adaptations. Next outgoing connection, enemies/combat, pickups/tank use, death/checkpoints/boss remain undone.

## User runtime acceptance — third ladder connection

User reports **“working perfect as usual”** after third package. All three upward connections/upper rooms/downward returns are installed and accepted working baseline, superseding earlier third-pending status. User approved continuing top-left outgoing ladder. No combat/death acceptance implied.

## Fourth connection + three-screen stripe — source ready, runtime pending

Original page6 top-left ladderX56 -> next stripebegin7/end9 (native order4), NOT a single room. Full new3page run and horizontal camera added; world1536x1200, openingY960, pages4/5/6 atY720/480/240, stripe7..9 atX768..1535/Y0. Earlier horizontal/player limits remain narrow despite larger room. Fourth up/down usesworldplayerX824 instead of earlier984. Up126/down95 preserved; originalfirstDown126. New block nativekind2/page8X128/Y96 -> world1152/Y96, allTENobjects scripted; no permanent solids or scenery behind block.1207tiles/60terrain solids/15ladders/14tops. New128x64/25tile Background atlas preserves first13indices and adds12native decorative tiles. Four script/three cameraevent replacements; no music/player/pause/HUD/arrival/stageCreate edits. Next outgoing top-right ladderworldX1496 NOT connected yet.

Fourth Up trigger49/scroll81..140/finish141/bookkeeping174/control175(age126); Down-only fromUp184: trigger14/scroll46..105/finish106/bookkeeping108/control109(age95). Fresh-input probes independently confirm timings. Controlled one-time page6X56/Y40 placement/reset/protection100 inherits controlled prior lead-ins; one neutral original frame refreshes old cached ladder centre before Up-only. Initial exploratory relocation without neutral refresh snapped to old ladder, discarded; final traces correctly remainX56. No extra patches on Down return. Not natural whole-stage traversal or new comprehensive disassembly byte audit.

2880tile IDs AND palettes validate all3native pages (initial7/8, streamed9). Additional controlled renderer traversal usesoneA to release original ladder thenRight, pinsY36/velocity0/protection100; cameraactualGML matches900originalframes. Scene+separate newblock equals decoded3page pixels.22source/model checks compare actualGML every busyframe ALL8directions/cases,4seams, oldlayouttranslation, all10blocks, stable13oldatlas tiles,1207tilecalls/reconstruction,900camera frames, charge/rearm/cleanup/bounds/pitguard. Original bottomless gapworldX1184..1215 must NOT wrongly return into narrow page6: handoff onlyatleftview768. Death/checkpoint/respawn deferred, falling in thispit mayrequire restart; guide saysjumpacross, no fakefloor/teleport. Fallingthroughleftopening remains MM5 adaptation/notnative-certified. Existing first/second/third/opening/pause16/UI/Blader1023regressions pass; ZIP audited. GMScompiler/GPU/scheduler/async/withiteration unavailable. User installation/runtime acceptance pending; enemies/combat/pickups/tanks/death/boss remain undone.

## Fourth-checkpoint feedback — dispenser sprite/object correction

User installed/inspected horizontal run and flagged start building as cutter dispenser that should be sprite/object, not scenery. Do NOT treat this as blanket runtime acceptance of Fourth checklist. Assistant acknowledged prior tile-only depiction and user approved correction before route extension. No active dispenser/cutters were implemented by Fourth package.

Focused Super Cutter Dispenser patch now extracts exact96x80native-decoded appearance atworld864,128 into spr_mm1_super_cutter_dispenser, no invented pixels. Removes30tile placements (1177remain), retains existing atlas unused building tiles; adds non-solid/no-parent visible obj_mm1_super_cutter_dispenser with Create depth999/frame0, default drawing, noAI. New scr_mm1_cutman_ladder_route_features creates it once; installation adds ONE call after existing3geometry calls in stageCreate, without replacing music/async. No manual instance. Room/player/view/camera/terrain/all10blocks/pause/HUD/arrival unchanged. Native class0 preserved; sprite/object doesn't invent a solid wall. Cutter spawning/AI/sprites/sounds/damage remain deferred to enemies/hazards, explicitly not claimed installed. Source/model whole1536x1200pixel reconstruction exact with actual1177tilecalls+10blocks+onebuilding; metadata terrain/world/atlas/objects unchanged, feature markers explicit. No GMSruntime/compilation available; new user installation acceptance pending. ZIP6files byte-audited, GitHub-only instructions.

Future route builders MUST use corrected Super Cutter Dispenser/geometry.json as base or apply its30tile exclusion, preserve/translate features collection and regenerate features placement script when shifting route. Building cells carry feature marker; do not re-bake building, drop its object or leave staleY when extending. Historical Fourth package/build/test unchanged for rollback; apply correction after original build on reproduction. Next far-right outgoing ladder still unconnected; source correction does not advance route or enemy behaviour.

## Dispenser patch runtime error — required Background asset

User reports stageCreate fatal tile_add(bg_mm1_cutman_ladder_route_tileset...) “not set before reading”. Identifier unresolved as a Background resource in installed project (missing/misnamed/wrong resource type), not evidence of camera or sprite error. Patch now includes unchanged128x64Fourth atlas PNG, guide step0 requires exact Background name/type and16x16tiles/zerooffset/RemoveBackgroundOFF. No workaround instance/global variable or old128x32atlas substitution. Seven-file ZIP byte audited, atlas equals Fourth source. Actual user fix/runtime confirmation pending. Building spawning remains deferred.

## Missing terrain diagnosis — screenshot proves mixed coordinates

User confirmed runtime missing scenery, tileset correct; posted stageCreate (correct calls/music preserved) and corrected tile script retaining prior terrain. GUI screenshot now shows **VIEW0,720 / ATLAS128x64**, with blocks/player visible but no scenery. Corrected tile script first opening tilesY1056 ->336below720view (outside240viewport). It requiresFourth cameraY960; source/script coordinates are mismatched, not evidence of deleted resources. Exact installed collision/block versions unknown, so do NOT fix onlyviewY or shift tile positions. Fourth Coordinate Repair bundles6byte-identicalFourth files: collision/blocks/scrollStart scripts + cameraCreate/BeginStep/EndStep. Keep corrected1177tile script/features, helpers/cleanup/stageCreate/music intact. Synchronise room1536x1200/view0Y960/playerstartoriginalY+960 (180->1140, not repeated+240ifalready1140). RemoveonlytemporaryGUI/RoomStartdiagnostics after verification. Ifviewstill720 searchotheroverrides/duplicatecamera, do notguess. Prior tests source-level; user repair/runtimeconfirmation pending. No route advancement/cutterAI.

## User runtime acceptance — corrected Fourth + dispenser baseline

After matched-coordinate repair user reports **“very good it all works now”**; assistant confirmed scenery/matchedcamera/layout/separatedbuilding asworkingbaseline and userapproved nextconnection. Supersedes earlierpendingFourth/dispenser/repair status. No cutterspawning/combat/death acceptance implied.

## Fifth connection source checkpoint — new installation/runtime pending

Originalpage9far-rightladder ->page10/room3singleupperroom. EntirecorrectedFourth contentY+240, world1536x1440/openingview1200, previoussinglesY960/720/480, horizontalstripeY240, newroomX1280/Y0. NewcameraX1280bothdirections, returntofar-right horizontalrun. AllTENnativebusyframecaseschecked. Up126andDown126: original fifthDown restores3screenstripe withlong33settled+1bookkeeping, not95. Uptrigger49/scroll81..140/finish141/bookkeeping174/control175; Down-onlyfromUp184trigger14/scroll46..105/finish106/bookkeeping139/control140. FreshUp/Down123..125ignored/126..128accepted independently.960nativepage10tile+palettepairs validated, originalactivekind2page10X96/Y160 yields11thblockworld1376/Y160. No naturalwhole-stage claim: controlledpriorlead-ins/900RightY36protection100 andpage9X216Y40placement/neutralcacheframe beforeoriginalUp; noextraDownpatches/newroutinebyteaudit.

1343tiles/68solids/17ladders/16tops/11scriptedblocks. Existing25tileatlasunchanged; no newart. Buildingremainsonefeature864,368/96x80sprite, nobakedtiles, noAI. Builder usescorrectedSuperCutterDispenser/geometry.json; entireold1536x1200sceneexactaftertranslation andnewupperrawsceneexactwithseparateblock. EightGMLreplacements: FIVEexistingscripts(tiles/collision/blocks/features/scrollStart)+THREEcameraevents(Create/Begin/End). StageCreate/music/audio/async/player/pause/HUD/arrival/helpers/cleanup/guards unchanged. Roomheight1440/viewY1200/playerstartoriginal+1200(180->1380), exactmatchedset ratherthanblindmultiple+240. Guideexplicitlypreventsrepeat720/960coordinatebug. Existingatlas/spritecopiesincludedonlyforrecovery, nonewresourceimports. Nextnewupperoutgoingladderstillunconnected; enemies/combat/damage/pickups/tanks/death/boss deferred. Existingpitjumpwarningretained.

26source/modelcheckspass includingactualGMLALL10busyframecases, independentfreshprobes, all5seams, correctedoldgeometrytranslation, separatefeatureposition/no30tileduplicate,11blocks/1343actualtilecalls/fullscenepixels, existing900framehorizontalcamera/bounds/charge/rearm/cleanup andwrongoldroomheightrejection. ExistingFourth/dispenser/coordinatepackage/pause16/UI/Blader1023regressionspass.14fileZIPbyteaudited/artunchanged. GMScompiler/GPU/scheduler/withiteration/async/runtime not available; usernewinstallation/acceptancepending.

## User runtime acceptance — Fifth connection

User explicitly reports **“confirmed working”** forFifth; assistantrecordsnewupperroom/downwardreturn andelevenblocks/separateddispenser asworkingbaseline. Userapprovedsixthoutgoingconnection. SupersedespriorFifth-pendingstatus; no enemy/death/spawningacceptanceimplied.

## Sixth connection source checkpoint — new runtime pending

Originalpage10top-rightladder ->page11/room6singleupperroom. CorrectedFifthwholeworldY+240,1536x1680/openingview1440, pages4/5/6 Y1200/960/720, horizontalstripeY480, page10Y240, newpage11X1280/Y0. CameraX1280newdirections; Up126/Down95, earlierFifthDown126preserved. OriginalUp49/scroll81..140/finish141/bookkeeping174/control175; Down-onlyfromUp184:14/scroll46..105/finish106/bookkeeping108/control109. FreshUp123..125ignored/126..128accepted, freshDown92..94ignored/95..97accepted independently. Controlledpriorlead-ins (earlier900RightpinsY36/velocity0/protection100) inherited; one-timepage10X216/Y40reset/protection100/neutralcacheframe thenoriginalUp-only; noextraDownpatches. Notnaturalwhole-stage traversal/newroutinebyteaudit.960pairedtile/palettechecks validateoddnametablepage11/room6. Nativekind2page11X32/Y128 givesnewblockworld1312/Y128.

1525tiles/73terrain solids/18ladders/17tops/TWELVEscriptedblocks/onefeature. Existingatlas25tilesunchanged; no newart/resources. Buildingstillseparate864,608/frame96x80, no baked30tiles orAI. BuilderbaseacceptedFifthgeometry/features; allold1536x1440sceneexactafter240translation andnewuppernativeimageexactwithseparateblock. EIGHTGMLreplacements: FIVEexistingscripts(tiles/collision/blocks/features/scrollStart)+THREEcameraevents(Create/Begin/End). StageCreate/music/async/player/pause/HUD/arrival/helpers/cleanup/guardsunchanged. Roomheight1680/viewY1440/playerstartoriginal+1440(180->1620), exactmatchedset; priorblankterrainmismatchmustnotrecur. Existingatlas/spritecopiesonlyforrecovery. NextoutgoingTOP-LEFTladderworld1320NOTconnected; combat/spawning/pickups/tanks/death/bossdeferred; existingpit1184..1215nowY672..719 jumpwarningretained.

28source/modelcheckspass includingactualGMLall12busyframecases/freshinputtimings/sixseams/correctedlowergeometrytranslation/featureposition/no duplicateart/12objects/1525actualtilecalls+fullpixels/900horizontalframes/bounds/oldheightrejection/charge/rearm/cleanup. Fifth/Fourth/dispenser/pause16/UI/Blader1023regressionspass;14fileZIPbyteaudited/recoveryartidentical. GMScompiler/GPU/scheduler/withiteration/async unavailable; Sixth installation/useracceptancepending.

## User runtime acceptance — Sixth connection

User explicitly reports **“confirmed working”** forSixth; newupperpage11/downwardreturn/twelveblocks/separateddispenser retained asworkingbaseline. UserapprovednextTOP-LEFTconnection. SupersedesSixthpendingstatus; nocombat/death/spawningacceptanceimplied.

## Seventh connection source checkpoint — new runtime pending

Originalpage11leftladderX40 ->page12/room4singleupperroom, nativebegin12/end12/order7. AcceptedSixthworldtranslatedY+240,1536x1920/openingview1680, pages4/5/6 Y1440/1200/960, horizontalstripeY720, page10Y480/page11Y240/newpage12X1280Y0. Seventhsharedplayercentre1320, priorSixthbottom-right1496unchanged; cameraX1280newdirections. Up126/Down95: Uptrigger49/scroll81..140/finish141/bookkeeping174/control175; Down-onlyfromUp184trigger14/scroll46..105/finish106/bookkeeping108/control109. FreshUp123..125ignored/126..128accepted, Down92..94ignored/95..97accepted independently. Priorcontrolledlead-insinherited, one-timepage11X40/Y40reset/protection100/neutralcacheframebeforeoriginalUp; noextraDownpatches. Notnaturalwhole-stage traversal/newcomprehensivebyteaudit.960tileIDs+palettepairs validateevennametablepage12; originalkind2/page12X96/Y128 ->newblock1376/Y128.

1719tiles/79terrain solids/20ladders/19tops/THIRTEENscriptedblocks/onebuilding864,848, nobaked30tiles orAI. Existing25tileatlas/96x80spriteunchanged. BuilderbaseacceptedSixthgeometry/features; entireprior1536x1680sceneexactaftertranslation andnewupperrawimageexactwithseparateblock. Newseamladder1312/Y208/h160, nofalseY240lip; prior6seamspreserved. EIGHTGMLreplacements: FIVEexistingscripts(tiles/collision/blocks/features/scrollStart)+THREEcameraevents(Create/Begin/End); noStageCreate/music/async/player/pause/HUD/arrival/helpers/cleanup/guardchanges. Roomheight1920/viewY1680/playerstartoriginal+1680(180->1860), matchedsetpreventsrepeatmissingterrain. Recoveryartcopiesonly, nonewresources. NewnextoutgoingTOP-LEFTplayer1336unconnected; existingpit1184..1215Y912..959jumpwarningretained. Enemy/cutterAI/damage/pickups/tanks/death/bossdeferred.

31source/modelcheckspass: ALL14actualGMLbusyframecases/freshinputtimings/7seams/acceptedlowergeometrytranslation/separatefeatureposition/no duplicatedbuilding/13blocks/1719actualtilecalls+fullpixels/prior900horizontalframes/bounds/oldheightrejection/charge/rearm/cleanup/newleftseamnegativecases. Sixth/Fifth/Fourth/dispenser/pause16/UI/Blader1023regressionspass;14fileZIPbyteaudited/unchangedrecoveryart. GMScompiler/GPU/scheduler/withiteration/async unavailable, newSeventh installation/runtimeacceptancepending.

## User runtime acceptance — Seventh connection

User explicitly reports **“confirmed working”** for Seventh. Preserve all seven connections, upper page12, thirteen scripted blocks and separate dispenser as the accepted baseline. User approved continuation from page12's top-left ladder. No enemy/combat/death acceptance implied.

## Eighth connection — source complete, runtime pending

The original next section is **three-screen stripe13–15**, not a single upper room: begin13/end15/order8. Controlled entry on page12/X56/Y40, fraction/velocity/pose reset/protection100, one neutral cache-refresh frame, then original Up-only. Prior controlled lead-ins retained. Up trigger49/scroll81–140/finish141/bookkeeping174/control175 (126); Down-only fromUp184 without further patches trigger14/scroll46–105/finish106/bookkeeping108/control109 (95). Independent fresh Up123–125 ignored/126–128 accepted; Down92–94 ignored/95–97 accepted. Not natural whole-stage traversal/new comprehensive byte audit. All2880 tile-ID+palette pairs validated from live nametables, with separate900-frame controlled Right/A-once traversal pinningY36/velocity0/protection100 for camera/PPU verification only.

World becomes **2048×2160**, openingviewY1920/playerstart originalY+1920 (180→2100). Accepted lower scene movesY+240, stays pixel-identical across its1536×1920 extent; newly widened lower-right area stays empty cyan. Earlier camera/player horizontal bounds retained. First horizontal stripe7–9 nowY960, pages10/11/12 Y720/480/240. New stripe13–15 X1280–2047/Y0, cameraX1280–1792, player1288–2040. Eighth incoming/return centre1336; previous seventh return1320 preserved. Next outgoing is **bottom-right centre1992**, NOT connected; climbing/falling there must not teleport to page12. Only the new stripe's first-screen opening may return to page12. Future route must account for the next original connection descending rather than blindly continuing an upward-only index/origin formula.

**1969tiles/86terrain solids/21ladders/21tops/13blocks/2dispenser instances.** No originalkind2 block entries in13–15, all thirteen earlier blocks translated; most recent1376,368. Original first dispenser864,1088; repeated building in newstripe1376,128 reuses existing96×80 sprite/object. New thirty building cells excluded from scenery, sixty feature-marked cells across both; no duplicate tiles, solidity or cutter spawning. Existing25tile128×64atlas and sprite recovery copies byte-identical. Eight GML replacements: tiles/collision/blocks/features/scrollStart +cameraCreate/Begin/End. No new resources, StageCreate/music/async/alarms/player/pause/charge/HUD/arrival/helpers/cleanup/guards changes. Must apply roomwidth2048/height2160/viewY1920/playerstart together, not only tiles. Historical rollback package Seventh retained.

**36 source/model checks pass**, all16 actual GML busy-frame direction cases, independent fresh timing, both900-frame camera captures,8mergedseams/noartificialtops, lowergeometry/pixels+240/widenedcyanvoid,13scriptedblocks,1969actualtilecalls+fullpixelreconstruction,2spritebuildings/60markers, directional seam restrictions, wrongroomdimensions, bounds, charge/rearm/cleanup. Seventh/Sixth/Fifth/Fourth/dispenser/pause/UI/Blader regressions pass.14file ZIP source/content/art identity audited. GMScompiler/GPU/event scheduler/async/with-descendant runtime unavailable; Eighth installation and user runtime acceptance remain pending. Earlier pitX1184–1215 nowY1152–1199; next unconnected right-hand ladder/void may require restart. Enemies/cutterAI/damage/pickups/tanks/death/checkpoints/boss still deferred.

## User runtime acceptance — Eighth connection

User explicitly reports **“confirmed working”** for Eighth: second three-screen horizontal section, eighth upward/left-hand return, thirteen scripted blocks and both separate dispensers are the accepted baseline. User approved continuing at the bottom-right outgoing ladder. No enemy/combat/death acceptance implied.

## Ninth descending branch — source complete, runtime pending

Original page15 bottom-right X200 leads DOWN to **page16/room9**, begin16/end16/order9. Original camera3840→4096, adapted1792 fixed both ways. This is a descending branch, not the earlier left return to page12. Controlled prior lead-ins retained, Right900/A-once/Y36/velocity0/protection100 renderer traverse to page15, one placementX200/Y222/fraction/velocity/pose reset/protection100, neutral cache frame, then original Down-only. Down trigger14/scroll46–105/finish106/bookkeeping139/normal140: **126**, independently fresh123–125 ignored/126–128 accepted. Up-only fromDown184, no further patches: trigger43/scroll75–134/finish135/bookkeeping168/normal169: **126**, fresh123–125 ignored/126–128 accepted. Up trace stops184 before later enemy contact can corrupt reference. Not natural whole-stage traversal/Mesen executable/hardware/new comprehensive ASM audit.960 live tile-ID+palette pairs validate page16; no nativekind2 blocks there.

**NO coordinate shift or room change.** World2048×2160, openingviewY1920, playeroriginalY+1920 (180→2100), all accepted cells/objects/features retain exact positions. NewroomX1792–2047/Y240–479, camera1792,240, player1800–2040. Native incoming centre1992, merged ladderX1984/Y192/h96 acrossY240, no false seam lip. Next bottom outgoing centre1896/Y448–479 remains unconnected; do not descend out there. **2076tiles/95terrain solids/23ladders/23tops/13blocks/2dispensers**, previous dispensers864,1088 and1376,128 unchanged, sixty feature markers retained, no spawning/extra sprites/blocks. Same25tile128×64atlas/96×80sprite, byte-identical recovery art. Full accepted scene pixels unchanged outside new previously-empty room; new256×240 image exact.

Camera now initializes/sets **route_target_section**: eighth-right Down→9, ninth Up→8, old eighth-left Down→7. Busy motion still follows vertical direction; arrival assigns explicit target, not route_section-=direction. Origin for9 is240, EndStep locks1792/240; newDown8→9 overridesready95 with measured126, old left8→7 remains95. Correct seam/view/fall guards isolate newbranch; ninth unconnected lower exit and middle voids do not invent returns. Repeated9down/up thenoldleftreturn tested. EIGHTGML matched replacements (fiveexisting scripts+threecameraevents), no newresources, StageCreate/music/async/alarms/player/menu/HUD/arrival/helpers/cleanup/guards changes. Existing room/view/player settings stay, DO NOT add240 again.

**40 source/model checks pass**, ALL18actualGMLbusyframecases/freshinputtiming/bothprior900framecamera captures/9mergedseams/acceptedcoordinates+outside-roompixels/2076actualtilecalls/fullreference/13blocks/2spritebuildings/60markers/branchselection+repetition/bounds/charge/rearm/cleanup. Eighth/Seventh/Sixth/Fifth/Fourth/dispenser/pause16/UI/Blader1023 regressions pass.14file ZIP source/art identity audited, noROM. GMScompiler/GPU/event scheduler/async/with-descendant runtime unavailable: Ninth installation/user acceptance pending. Existing pit1184–1215/Y1152–1199 and unbuilt exits may require restart; enemies/cutterAI/damage/pickups/tanks/death/checkpoints/boss still later tasks. Rollback Eighth's matched8GML, with identical room/view/player coordinates.

## Video report — Ninth matched-code repair, runtime pending

Fetched user commitf702835 (`bug`) and fast-forwarded the same session branch; video `2026-10-31 14-13-20.mp4`,19.63s/60fps. The upward scroll reaches an upper room around13–14s, then view snaps back to lower room/player disappears around15s. This is NOT ninth runtime acceptance. No installed GMX/GML supplied, so exact installed versions remain unconfirmed.

Reproduced the failure using actual pre-repair Ninth Begin Step/Create with actual Eighth scroll_start: target initialized0 never updated by older start, arrival assigns section0, EndStep resetsview1920 whileplayerY1909 lies above it. Matched Ninth start chooses correct first target1. New canonical Ninth Create initializes route_start_version0; current start sets901 per call; BeginStep resets0 before each of three trigger call sites and requires901 afterward, raising a named whole-script replacement error instead of silently consuming stale target0. Native timing/geometry/positions/route targets unchanged. This addresses matched-code installation risk rather than claiming a confirmed fault in the user's unseen installed script.

`Ninth Transition Repair` bundles FOUR entire existing code replacements (scroll_start +cameraCreate/Begin/End), guide,5fileZIP; no tile/collision/block/feature/asset/helper/music/player/menu edits. Canonical Ninth full ZIP refreshed with same guarded sources/docs. **No coordinate changes:**2048×2160/view1920/player2100 if original180; do not add240 again. Thirteen scripted blocks, two separate dispensers, ninth room1792,240, nextbottomX1896unconnected remain.43source/model checks pass, including captured18cases, actual old mixed-version reproduction, per-call mismatch detection despite a stale901 value, proper matched first arrival across120 post-unlock neutral frames. Earlier native timings/charge/cleanup/branch tests retained. ZIP byte identity checked. User must fully replace exact named script (not append/suffixed import), allthreecameraevents, stop/restart and repeat recorded handoff, thenright9branchandoldleft95return. ActualGMSruntimeconfirmation pending; no Tenth/enemies/combat advance.

## User acceptance — Ninth camera repair

User reports **“okay its working now”** after the video-reported camera reset repair. Preserve explicit route targets and per-call handshake as the accepted baseline; do not restore mixed older start/camera code. User approved the next bottom-ladder connection. No damage/death/hazard implementation acceptance implied.

## Tenth connection — source complete, runtime pending

Original page16 bottom ladderX104 leads DOWN to **page17/room10**, begin17/end17/order10. Inherits controlled prior lead-ins; one-timepage16/X104/Y222 fraction/velocity/pose reset/protection100, neutral cache frame, then original Down-only. No new horizontal renderer traverse; Up-only fromDown184 without further patches. Down trigger14/scroll46–105/finish106/bookkeeping139/normal140: **126**. Up trigger50/scroll82–141/finish142/bookkeeping144/normal145: **95**, the first short Up in this route. Independent fresh Down123–125 ignored/126–128 accepted, fresh Up92–94 ignored/95–97 accepted. Initial copied Up123–128 probes naturally all accepted; corrected to92–97 before timing claims.960 live tile-ID+palette pairs validate page17. No nativekind2 blocks here. Not natural whole-stage traversal/Mesen executable/hardware/new comprehensive ASM audit.

**No coordinate shift.** World2048×2160/view1920/playeroriginal+1920 (180→2100) unchanged; newroomX1792–2047/Y480–719/camera1792,480/player1800–2040. Incoming centre1896, merged ladderX1888/Y448/h64 crossesY480 with no false lip. Next bottom-left outgoing centre1832/Y688–719 unconnected. Entire accepted scene outside newroom remains pixel-identical, all earlier cell/object/feature positions unchanged. Explicit targets9Down→10 and10Up→9; origins240/480, fixed1792 both directions. Down126/default, Up10 override95. Repeated10Down126/Up95→9Up126→old8left95 tested. **Per-call handshake bumped1001** in Begin/start; repaired Ninth901 start now rejected by Tenth rather than silently selecting wrong target/origin/timing. Historical Ninth repair kept intact as rollback.

**2196tiles/102terrain solids/24ladders/24tops/13blocks/2dispensers/10spike objects.** New nativeclass3/raw196/palette1 spikes: two at2000/2016,Y528 and eight1920–2032 step16,Y688. Recovered one16×16 transparent sprite `spr_mm1_cutman_spike`, new non-solid/no-parent artwork object `obj_mm1_cutman_spike`, Create depth999/frame0 only. Sky converted to alpha, ten-cell pixel identity verified, no repaint. All ten feature-marked cells excluded from scenery; no terrain solidity added forclass3. **Spikes are visual objects only; damage/death/invulnerability semantics remain deferred**, no MM1 instant-kill exception guessed. Native platforms/greenfloor below remain separateclass1. Both dispensers864,1088/1376,128 and60markers retained;13blocks unchanged. Existingatlas25tiles128×64 and96×80dispenser recovery images byte-identical.

Manual install: first create Sprite/Object under MM1/CutMan/Stage/Hazards, paste new object's Create; then fiveexisting scripts +threecameraevents, keeping exact resource names and updated1001 start. **No StageCreate/music/async/alarms/player/pause/charge/HUD/arrival/helpers/cleanup/guards changes, no extra feature calls/manual instances.** Room/view/player stayfixed; do not add240. ZIP16files:9GML/2guides/2references/3PNGs, byte/art audit passes; noROM. Missing new object identifier avoided by documented resource-first order.

**48 source/model checks pass**, ALL20nativeactualGMLbusyframecases/freshinputs/bothprior900framecameras/10seams/acceptedpositions+outside-roompixels/2196actualtilecalls+13blocks+2buildings+10spikes/fullscene/nativeSPIKEart/markercounts/repeatedtargets+timings/post-unlockvideo+mixedscriptguards/charge/rearm/cleanup. Ninth43/Eighth36/Seventh31/Sixth28/Fifth26/Fourth22/dispenser/pause16/UI/Blader1023 regressions pass. GMScompiler/GPU/scheduler/async/with-descendant/runtime collision fit unavailable: Tenth installation/user acceptance pending. Existing horizontalpit1184–1215/Y1152–1199 and unbuilt exits may require restart. Enemies/cutter spawning/damage/pickups/tanks/death/checkpoints/boss remain later tasks.

## User runtime acceptance — Tenth connection

User explicitly reports **“confirmed working”** for Tenth. Preserve ten connections, repaired explicit-target/versioned camera,13scripted blocks,2dispensers and10spike artwork objects as accepted baseline. User approved continuing at bottom-left outgoing ladder. Spike damage/death/invulnerability remains deferred, not accepted as implemented.

## Eleventh connection — source complete, runtime pending

Originalpage17/X40 bottom-left leads DOWN to **two-screen stripe18–19**, begin18/end19/order11. Inherited controlled lead-ins; one placementX40/Y222/fraction/velocity/pose reset/protection100, neutral original collision-cache frame, then Down-only. Up-only fromDown184 without further patches. Down trigger14/scroll46–105/finish106/bookkeeping139/normal140:126, fresh123–125 ignored/126–128 accepted. Up trigger50/scroll82–141/finish142/bookkeeping144/normal145:95, fresh92–94 ignored/95–97 accepted.1920live tile-ID+palette pairs validate both pages. Separate controlledRight/A-once/Y36/velocity0/protection100 traversal stopped after263frames at first camera maximum (originalX4992/camera4864), before gate operation. Not natural whole-stage traversal/Mesen executable/hardware/new comprehensive ASM byte audit.

**Width changes2048→2304 only. Height2160/view1920/playeroriginal+1920 (180→2100) unchanged, NO vertical shift.** NewstripeX1792–2303/Y720–959, cameraX1792–2048/Y720/player1800–2296. Older room/camera horizontal bounds unchanged; newly widened space elsewhere stays cyan. Shared incoming centre1832, ladderX1824/Y688/h96 crossingY720, no false lip. Explicit targets10Down→11,11Up→10; origin720/480, fixed1792 duringhandoff. Start/Begin protocol1101 rejects stale Tenth1001/Ninth901; video repair/post-unlock guards preserved. Next route step is **closed boss gate opening/passage**, not another ladder; gate operation/room beyond/AI deferred.

**2354tiles/106terrain solids/24ladders/24tops/17blocks/2dispensers/10spikes/1closed gate**. Four nativekind2 page18 blocks1824,848/1856,848/1856,880/1888,880, allscripted with old13unchanged,16footprintcells excluded from tiles/permanent terrain. Originalkind3 page19 X224/Y96→wrappedX0/Y160 gives32×64 closed gate at2272,816. New Sprite `spr_mm1_cutman_boss_gate_closed`/Object `obj_mm1_cutman_boss_gate`, origin0,0/fullrectangle mask, VisibleON/SolidOFF/Parentobj_stage_solid, Create depth999/frame0/explicitmask_index. Static closed endpoint blocker only, not native gate-operation claim;8class0artcells replaced by sprite, no duplicate tiles/permanent terrain. Source/model mask mock seeded enginefield mask_index after initial JSwith missing-field assignment failed; actual GML assignment already present/correct, now model tests it explicitly. User must confirm parent/mask blocking in GMS.

Existing atlas now **28tiles**, still128×64: old25pixels/indices exact,3native gate-wall tiles appended. **Mandatory existing Background image update despite unchanged dimensions.** Two new gate resources must be created before compiling feature script. Dispenser/spike PNGbytes unchanged; ten spikefeatures and60dispensermarkers retained, damage/spawning stilldisabled. Gatefeaturescriptaddsoneinstance; no manualplacements or StageCreate changes. EightexistingGML replacements+newgateCreate; no StageCreate/music/async/alarms/player/pause/HUD/arrival/helpers/cleanup/guardchanges. Complete matched8GML/atlas/roomwidth/newresources, no extra featurecalls. Native512×240 stripe exactwithfourblocks+gate, whole accepted2048×2160pixels preserved outside newroom; widenedvoidcyan.

**55source/modelchecks pass**, all22nativeactualGMLbusyframecases/freshinputs/900+900+263horizontalframes/11seams/acceptedpositions+outside-stripepixels/widenedvoid/old25atlasidentity/2354actualtilecalls/fullobjects+scene/gateart+maskassignment/17blocks/13features/repeatedtargets+timings/mixed-start/video/post-unlock/charge/rearm/cleanup. Tenth48/Ninth43/Eighth36/Seventh31/Sixth28/Fifth26/Fourth22/dispenser/pause16/UI/Blader1023regressions pass.17file ZIP9GML+2guides+2references+4PNGs byteaudited, reusedspritesunchanged, newatlasmandatory, noROM. Actual GMScompiler/GPU/scheduler/async/descendant/mask/collision unavailable: Eleventh installation/runtimeconfirmation pending. Spike damage, enemies/cutterAI, pickups/tanks, death/checkpoints, gatepassage/boss/reward/returnremainlater. RollbackTenth8GML/atlas/width2048; no vertical rollback.

## User runtime acceptance — Eleventh; first entrance gate active

User accepted the Eleventh connection in-game. Keep its atlas, two-screen approach,
upward return,17 scripted blocks, two dispensers, ten art-only spikes and closed gate.
The subsequent audio-buffer and missing-gate issues were resolved by the user during
installation; no speculative repair is needed or published.

Current approved task: first entrance gate opening and automatic passage into the
three-screen corridor20–22. **Use MM5's opening sound, not MM1's.** Preserve MM1
layout and native movement/timing; finish the route before enemies/combat.

Research checkpoint: native first entrance timing and return boundary measured,
2880 corridor tile-ID/palette pairs validated; MM1 opening/delay byte spans verified.
MM5 command25 verified at the opening routine and recorded as isolated full APU WAV
under `Assets/Audio/Mega Man/MM5/Stage/Gate/`. Details and traces are in
`Assets/Cut Man/Stage/First Gate Research/`. No first-gate closing call observed;
page20's left boundary is collision-only, not an additional visible shutter.

**Gate-passage GML implementation, resource/room install guide, model tests and ZIP
remain unfinished.** No replacement installation is ready at this checkpoint;
accepted Eleventh code remains untouched. No runtime acceptance claimed for the new
passage, and no enemy/combat/damage/pickup/tank/death/boss work is included.

## First entrance gate passage — source complete, runtime pending

User approved the complete, untrimmed MM5 opening WAV (6c3ec06), then authorized
integration. New canonical package: `Assets/Cut Man/Stage/First Gate Passage/`.
This supersedes the preceding research-only unfinished status; **installation and
user runtime confirmation still pending**, not a claim that Cut Man is complete.

MM1 first entrance opens bottom-up at ages33/39/45/51, approved MM5 cue once at32,
camera+4/player+1 over64 steps56..119, stand119, commitsection12 at152/control153.
No first-gate close animation/cue is invented. MM5 grounded/standing contact and
quarter-pixel entry snap2264→2264.25/Y880−feet_offset are adaptations; no native
midair/slide entry claim. X2328.25 at exit; normal MM5 movement/cadence retained.
Full approved2.496125s WAV imported as built-in `snd_mm5_gate_open`, not PCM buffers.
Camera RoomEnd/Destroy stop only their own voice then call the existing disposer.

Room width2304→3072 only; height2160, opening viewY1920/player2100 unchanged.
All accepted positions/scene pixels preserved. New corridor20–22 X2304..3071/Y720,
camera2304..2816/Y720, original collision-only return boundary2304,816/16×64.
Closed second gate3056,816/16×64 is a scripted instance of existing gate Object,
separate sprite/mask; opening it/boss room deferred. First gate custom normal Draw
crops four16px strips over recovered native backdrop, closed mask stays behind the
return boundary. No duplicated visible shutter/scenery gate, no manual placements.
Totals3070tiles/109terrain+boundary solids/24ladders/24tops/17blocks/2dispensers/
10art-only spikes/2gates. Atlas29tiles128×64, old28 exact; update mandatory.

Manual install:2newSprites+1Sound+1Script; five existing Scripts, five Camera events,
gateCreate+newnormalDraw.13GML files,21file ZIP incl2guides/2references/3PNGs and
approved complete WAV, byte identity audited. Version1201 rejects stale1101; old
ladder targets/timings preserved. Shared finish/dispose/query and player/pause/charge/
HUD/arrival/audio manager/music/StageCreate/async/alarms unchanged.

35 source/model checks PASS: all22 native ladder busy trajectories, complete gate
busy sequence and fresh release, charge/rearm, stale scripts, idempotent owned-only
teardown, exact geometry/feature/block/tile GML, accepted scene identity, native
corridor reconstruction, old atlas indices, actual MM5 wall probes for return and
second gate. Builder checks PPU pixels at first/second/fully-open phases. Research
checks+Eleventh55/Tenth48/Ninth43/Eighth36/Seventh31/Sixth28/Fifth26/Fourth22/
dispenser/pause16/UI regressions PASS. Not GMS compiler/GPU/scheduler/parent-mask/
async certification; user must test installation and confirm. Enemies/cutter spawning,
spike damage/invulnerability/death, pickups/tank effects/checkpoints, second gate/
boss/reward/return remain later work.

## Approved MM5-style immediate opening — source complete, runtime pending

User reports the missing backdrop resource error resolved and gate passage working,
but initial wait felt long. Repository video2026-10-31 16-26-46.mp4 was inspected;
opening observed around0.55–0.58s after contact, consistent with the old32-frame hold.
User requested shorter response, then asked to check MM5 before choosing a delay.
Original MM5 controlled opening-routine probe verifies sound/first edit in entry
frame, three edits4frames apart, return after12 waits; not a natural contact trace.
User then approved MM5 opening following the explicit proposal to remove the initial
wait while retaining MM1 four-part artwork and passage speed.

Applied: sound and first removed strip in trigger age0, remaining strips6/12/18,
scroll24..87 at unchanged camera4/player1, stand87, commit120, control121. No guessed
0.15s wait. This is MM5-style immediate response, NOT a claim of the full MM5 three-
edit/12-frame animation on MM1's taller gate. Approved complete WAV unchanged.

Canonical First Gate Passage refreshed; `MM5 Immediate Opening/` patch includes just
cameraBeginStep +gate-startScript +guide (3file ZIP). Both must be replaced together
because sound ownership moved from age32 BeginStep to gate-start. No other resources,
room, geometry, gateDraw/backdrop, player/charge/menu/audio manager edits.1201 ladder
handshake unchanged; earlier directions preserved.35source/model checks PASS,
including immediate first strip/single sound, shifted path, control121/rearm, cleanup
and22 native ladder busy trajectories. Actual in-game confirmation still pending.

## Second gate passage and empty boss room — source complete, runtime pending

User advanced with “okay next” after the immediate-first-gate patch. New canonical
package `Assets/Cut Man/Stage/Second Gate Passage/` adds the second opening/scroll
and original page23 scenery/collision/two scripted Super Arm blocks, NOT boss AI.

Controlled original-USA probe inherits prior lead-ins,466frame Right/A-once corridor
renderer traverse pinsY148/velocity0/protection100, one page22X216/Y148 reset plus
neutral cache refresh, then original Right420. Trigger20/open52/strips53,59,65,71/
scroll76..139/type2commit172. Second player differs from first:63 steps11/16px,
then native incoming-boundary resolution to5912.5625; adapted world3096.5625.
Camera+4 each of64frames. Native closingD092 only355, after Cut Man entrance,
not immediately after scrolling. No fake empty-room close timer or boss music/health
fill introduced. Native boss-intro control lock is deferred with that whole sequence.

Approved immediate sound/first strip age0 retained for BOTH gates; remaining strips
6/12/18, scroll24..87, stand87/commit120/control121. Second ready121 is explicitly an
empty-room adaptation, not a full native boss-intro timing claim. MM5 floorY868 and
normal movement preserved. First gate path unchanged. Approved complete WAV reused.

Width3072→3328 only, height2160/openviewY1920/playeropening unchanged. New page23
X3072..3327/Y720..959, camera3072,720, normal player3096..3304 with native right wall.
Native collision-only left boundary3072,816/16×64. Two new blocks3104,880 and3136,880
bring total19; both excluded from permanent terrain/scenery.3302tiles/115terrain+
boundary solids/24ladders/24tops/19blocks/2dispensers/10visualspikes/2gates. All old
positions/3072×2160scene pixels unchanged. Atlas29tiles128×64 byte-identical; no
mandatory image replacement. New16×64second-open-backdrop sprite and gateDraw select
native second-door background, not first gate cyan. No extra visible left shutter.

Manual install1newSprite, sixexistingScripts/fiveCameraevents/gateCreate+Draw full
matched13GML set; new1301 start/camera/gate safeguard rejects1201. StageCreate/shared
finish/dispose/query/player/charge/pause/HUD/arrival/audio-manager/music/async/alarms
unchanged. Existing features script unchanged; no manual placements/extra calls.
19file ZIP13GML/2guides/2references/2PNGs byte-identity checked, noROM.

34 actual-GML source/model checks PASS:22ladder busy directions +bothgate paths,
immediate/single cue/second slower movement/final boundary, input restrictions,
charge/rearm/freshfire, stale-script error, owned/idempotentcleanup, actual tiles/
regions/blocks, native scene reconstruction/acceptedscene identity/unchangedatlas,
MM5 support on original left ledge and bossroom bounds/backdrop selection.960live
bossroom tile-ID/palette pairs verified; builder checks native PPU first/second/full
opening pixels. Priorfirst35/Eleventh55/Tenth48/Ninth43/Eighth36/Seventh31/Sixth28/
Fifth26/Fourth22/dispenser/pause16/UI regressions pass. Not GMS compiler/GPU/
scheduler/mask runtime certification; actual installation/confirmation pending.
Enemies/cutter spawning/spike damage/damage/invulnerability/death/pickups/tank effects/
checkpoints, Cut Man entrance+closing+boss music/health fill/fight/reward/return remain
future work. No complete-Cut-Man-stage claim.

## Blader combat active; MM6 enemy-hit cue audio checkpoint

User confirmed both gate passages/boss-room layout “perfect”, then approved Blader
as the first stage enemy, with MM5-style damage/recoil/protection and buster combat.
Keep route/second-gate update984bc4d as accepted baseline. User then specifically
requested **MM6's successful enemy-hit sound for normal AND charged buster shots**;
MM5 firing/charging/release sounds stay unchanged.

MM6 command35 identified by supplied-ROM byte checks and independent natural hits:
normal pending11hex/damage1; held-B release120 branch hits126 with pending13hex/
damage3/HP5, next evidenceHP2. Same35 cue. No HP/charge/position patches in identity
traces. Full isolated APU take extracted to `Assets/Audio/Mega Man/MM6/Combat/Enemy
Hit/`, complete untrimmed2.496292s and sample-identical silence-trimmed0.403063s WAVs.
NativeF0 stop has constant JSNES DC residual; an uncaptured native35 preparation
finishes and final50frames exact silence is asserted before captured35. No filtering,
muting channels or preceding preparation cue in the downloadable take. Four USA
byte spans, single consumed captured command and WAV hash/silence tests PASS.
Blader1023update/16attack/15reversal research regression still PASS unchanged.

**This is an audio checkpoint, NOT completed Blader gameplay.** No enemy Object,
spawner, shot-hit/damage logic or player hurt controller installed yet. Blader spawn
threshold/tables, contact/shot hitboxes/HP/death, MM5 damage state boundary matrix,
hurt art/audio and safe pause/charge integration still need work before delivery.
Resource import for the chosen MM6 cue may precede the Blader gameplay package;
accepted stage/music/player/audio-manager code remains untouched.

MM6 enemy-hit cue approved by user (“very good”), with explicit request to remove
extra silence. Use **`snd_mm6_enemy_hit.wav`**,0.403063s, for gameplay, NOT the2.496s
untrimmed research take. All audible PCM samples retained; only silence removed,
with10ms silent tail. Verification compares exact PCM slice to original full take.

### MM5 random drops / original pickup art checkpoint

User requested original MM5 enemy drop selection and small/large health,
small/large weapon energy and extra-life sprites. Recovered/tested at
`Assets/Pickups/MM5/`: five original-size sprite strips and native render/effect
traces. Nominal50bucket rates: smallhealth10%,largehealth4%,smallweapon8%,
largeweapon4%,life2%,none72%. Original byte modulo50 biases these; report includes
all256 controlled CPU results and explicitly distinguishes uniform-byte math
from unproven actual RNG frequencies. Native collection trials confirm +2/+10
health, +2/+10 selected-weapon energy, +1life. Four energy pickups have two palette
phases at9updates/phase; life is static. Tests and import guide delivered.
**Art/research only, no pickup/drop/combat integration yet.** Fixed stage pickups,
Eddie and the approved tank distribution stay separate. Resume Blader/combat work
after this checkpoint; do not claim that enemy damage/drop gameplay is installed.

### Blader combat implementation in progress — foundation, not install-ready

User authorized combined Blader/contact damage/buster+charge hits/death/MM5 drop
checkpoint, then added working +2/+10 health pickup refill with original MM5 sound,
incremental timing and freeze. Weapon-energy effects explicitly deferred (keep
those outcomes in the drop table), extra lives +1/max9 planned.

New original-USA proofs at `Assets/Combat/MM5/Blader Checkpoint/`: nine native
Blader records/firstcameraX17 trigger, one-normal-shot kill threshold (MM1 internal
20life/20normal damage), contact3, two original32x40 hurt/flash poses, MM5 hurt1C
and refill26 recordings. Twelve controlled incoming-state hurt initializations
confirm27hurtupdates; slide returns2, ladder detaches to0; no fresh-fire shot or
charge during hurt. Native +2/+10 collection traces show per-bar26 at4updates and
world/charge/seconditem lifetime frozen through final wait (resume10/42).
Actual GMS1.4 movement/drop/recoil/refill kernels tested against1023original AI
outcomes,256original drop-byte outcomes,6recoil inputs and8refill/cap branches.

**Not a completed combat package.** Remaining object/event wiring, native precise
shot/contact/pickup boundary coverage, original death/drop effects and hurt stars,
safe player death flow, terrain integration, pause/refill/route scheduling and
resource installer/runtime acceptance are tracked in the checkpoint README.
No existing player/stage/pause/shot event has been changed. No importZIP yet.

### Blader combined combat import package — source complete, GMS acceptance pending

Supersedes the foundation-only status above. `Assets/Combat/MM5/Blader Checkpoint/`
now includes four scripted actor/manager Objects, nine original MM1 spawn records
translated into accepted lower/upper stripes, original MM5 explosion/hurt stars,
normal/mid/full collision/damage (full pierces weak Blader), contact3 and27+60
hurt/protection, once-only native byte-modulo drop selection, pickup lifetime/blink,
working +2/+10 health refill with4-update bar/cue/world lock, and sparelife+1/max9
with native MM5 extra-life24 sound once. Weapon energy still deferred. Approved
MM6 successful-hit35 and MM5 firing/charge/release remain unchanged.

Deterministic combat pass belongs to CAMERA EndStep after accepted camera-update
helper (copied byte-identical), not an order-dependent manager EndStep. Shared Begin
latch avoids ID-order/two-tick refill races; pause restore rearms it. Exact-ID menu
freeze remains owned by approved pause code. Protection/pickup blink uses native bit1;
player samples before decrement. Stage feature script creates manager once; no manual
enemy/pickup/manager placement, no geometry/music/stage Create replacements.

Native30contact edge/3shot threshold proofs plus stars/explosion rendered-pixel
matches and death vectors added. MM5 sound24extra-life and1Ddeath extracted through
native queues/fullAPU with silence-only trims; full research takes retained.
407actual-GML source/mock checks PASS, prior1023AI/256drops/MM6audio tests PASS.
This is NOT GMS compiler/runtime/Windows/async-audio acceptance. Installer, in-game
checklist and deterministic self-contained ZIP provided; user installation pending.

Explicit project adaptations: GMS uniform byte RNG (native selector, NOT complete
MM5 RNG history), rectangular terrain/hybrid8x8 target mapping/scheduler, death
retry from Cut Man OPENING if spare life remains; zero spares returns existing title
and new-game inventory. Native checkpoint placement/GameOverContinue UI deferred.
No tank-use changes, other enemy/dispenser/spike AI or boss combat added.

## Blaster combat package prepared (2026-11-01)

User accepted live Blader combat and louder effects/music0.85, then directed original enemy order: Blaster before cutter dispensers. Approved audio is final full-tail live MM1 firing take with exact-zero padding trimmed (`Assets/Audio/Mega Man/MM1/Blaster/Approved/snd_mm1_blaster_fire.wav`), and MM6 blocked-hit27 (`Assets/Audio/Mega Man/MM6/Combat/Blocked Hit/mm6-blocked-hit-balanced-review.wav`). Old firing/blocked previews rejected. Retain existing approved loud MM6 successful-hit35.

Prepared `Assets/Combat/MM5/Blaster Checkpoint/`: additive manual guide/ZIP,2sprites/2approvedsounds/2newobjects/5newscripts/2existing-script replacements/2Create appends. Original11records mapped across opening/three ladder-screen groups. Four native variants/cycle/velocities; body1/bullet2 and same MM5 damage/refill/pause/drop ownership. Closed all-shot bounce and exposed charge handling explicitly hybrid adaptations; normal one-hit threshold native. No manual placements or new Step passes/camera/music/pause/player event edits. Native2396AI transitions/1689projectile moves checked; mocked840native state matches and existing407Blader checks pass with/without overlay. **Package delivery/source tests are not user installation/GMS runtime acceptance.** Local compile/playtest pending; preserve backup and complete installer checklist.

## Blaster accepted; Super Cutter package prepared (2026-11-01)

User confirmed Blaster **“very good, everything working”**, superseding the pending-installation status above, then authorized Super Cutter next. Preserve that installed baseline and accepted audio.

`Assets/Combat/MM5/Super Cutter Checkpoint/` now provides an additive GMS1.4 manual ZIP/installer: one original two-pose16×32 flying-cutter sprite, one Create+Draw object, four new scripts, one manager Create append and two central-script replacements. The two existing buildings, their coordinates and all scene/camera/player/menu/audio resources are unchanged. No new firing sound: none issued in nine controlled original-ROM trials. Native source **187 bytes verified**, strict horizontal distance<80,32-update launch cadence, distance-scaled fixed aim, original ballistic movement/gravity,10-update two-pose jaw cycle, contact4, native20HP/basic4 (five normal hits). MM5 charge adaptation normalizes to5HP/1normal-or-mid/3full; full pierces only pre-hitHP<4. Existing approved MM6 successful-hit cue/explosion/one-MM5-drop system reused.

Five first-cutter lifetimes yield245original pre-AI states matched by actual GML through limited mock adapter; original movement assertions cover240deltas. Both native poses independently match opaque native-render pixels. Base407combat and Blaster840native-state tests still pass with cutter overlay, gate34/pause16source checks pass. This is **source delivery, not GMS compilation or installed/runtime acceptance**. Detailed incremental resource/folder/object/event/replacement boundaries and gameplay checklist are in INSTALL-GMS14.md. Wait for user installation/confirmation before advancing enemy roster; spikes, tanks/weapon effects/upgrades/checkpoint refinements and boss remain separate future work.

## Super Cutter accepted; Flea research checkpoint (2026-11-01)

User confirmed corrected Super Cutter package **“works very well”** after fixing the GMS1.4 built-in `direction` local redeclaration. Preserve Blader/Blaster/Super Cutter as installed working baseline. User then authorized research of the next original enemy; stage records establish **Flea/type02** immediately after the first dispenser, three page8 records.

Research/art only now prepared under `Assets/Enemies/MM1/Flea/`:215supplied-ROM sourcebytes checked, five600-update controlled trials/2708native entries,48hop initializations with both RNG choices,45landings and499airborne skipped-update assertions. Flea is1normal hit/contact2; jumps face the player at launch, native speed choices(1.1875X/4.875up) or(3X/4up), air movement skips clock&3==0, landing wait15, no issued jump/landing sound in trials. Two original native-render-matched grounded/extended-spring poses in16×24commoncells/origin8,7. Anchors1080/1112/1144 atY1144/1112/1080 in band960. No Flea gameplay integration/installer/installed acceptance claimed yet. Need original terrain-aware floor/ceiling behavior and shared skip phase preserved in later additive implementation; no simple guessed jump parabola. Working combat/scenery/camera/audio unchanged.

## Flea additive gameplay package prepared (2026-11-01)

User authorized “proceed” after original Flea research. `Assets/Combat/MM5/Flea Checkpoint/` now contains the manual GMS1.4 installer/ZIP: one2pose16×24sprite/origin8,7, oneCreate+Drawobject, five new scripts, one manager Create append, two complete central-script replacements. Accepted central-script lines preserved verbatim outside additive calls; no camera/player/scenery/collision/menu/audio rewrites. Three native page8 anchors mapped as researched, one-normal/mid/full kill/fullcharge weak piercing, native contact2,15ground wait, both hop vectors, shared quarter-update air skip and existing MM5 hit/explosion/one-drop/refill/death ownership. No new jump/landing sounds.

Actual GML via limited engine adapter matches1369native unobstructed transitions/614grounded transitions/498consecutive skipped transitions. Native wall/ceiling/floor edge solver is deliberately not claimed fully matched: rectangular inherited invisible-solid sweeps and one-way ladder caps are explicit GMS terrain adaptations, with boundary/removal and actual accepted3spawn-support fixtures tested separately. Hop byte RNG and shared activecombat_tick phase likewise adaptations, not original absolute NES/RNG-history identity. Base407checks, Blaster840states and SuperCutter245states pass under Flea overlay; gate34/pause16source regressions pass. Built-in-local declaration guard includes the earlier rejected `direction` name. Deterministic ZIP16files/CRC/exact bytes/SHA256 manifest checked.

**Prepared source/package, not installed acceptance**: user must follow exact resource folders, object settings/Create+Draw events, append-once and whole-script replacement instructions, compile and test. Preserve accepted backup; do not advance to the next enemy as installed until runtime feedback. No ROM/states/disassembly/executables or audio replacements in download.

## Flea accepted; Octopus Battery research checkpoint (2026-11-01)

User confirmed Flea **“very good.. it all works”**. Treat Blader/Blaster/Super Cutter/Flea as accepted installed combat baseline. User authorized research of next original enemy, **Octopus Battery/Suzy**: native04vertical/21hex-horizontal. Research/art only now at `Assets/Enemies/MM1/Octopus Battery/`; no gameplay/install package or modifications to working combat yet.

Original16records (6vertical/10horizontal) follow Fleas across pages9–12. Two1000-update controlled native trials/1999AI entries/1996state transitions verify2pixel/update axis travel, original wall-defined endpoints, RNG63/126wait, reversal/opening/closing graphics. No movement sound issued at C477/opcode-qualified9003. Important: **all four animation phases remain vulnerable**, including closed eye—eight actual native controlled-projectile collision/damage trials show20->16; do not add Blaster-style closed ding/deflection. Native5normal-hit threshold/contact4/halfsize7. Three16×16 native-render-matched poses recovered, origin8,7.295ROMbytes checked,286exact source matches plus3explicit annotated USA operand differences; no whole-source/terrain/GMS/hardware fidelity claim. Next is map all16anchors and additive implementation with precise installer, not installed merely because research passed.

## Octopus Battery additive implementation prepared (2026-11-01)

User explicitly requested implementation after original research. `Assets/Combat/MM5/Octopus Battery Checkpoint/` now supplies manual GMS1.4 source/ZIP: one3pose16×16sprite/origin8,7, oneCreate+Drawobject for both axes, six new scripts, one manager Create append and two full central-script replacements. Original16records mapped from page9/band960 and pages10/11/12/bands720/480/240, baseX1280. No new actor Step events/manual instances or camera/player/scene/terrain/menu/audio replacements. All accepted central lines remain outside additive calls. Native5normal-hit threshold normalized5HP, MM5normal/mid1/full3 and pre-hitHP<4piercing; closed eyes always vulnerable, contact4/numeric7halfsize, existing hit/explosion/drop/refill/death ownership.

Actual GML state and full terrain+state scripts match1996consecutive native transitions each for first vertical/horizontal encounters using accepted geometry (not just observed wall flags). All16anchors have1000step continuous terrain sojourn tests, both endpoint waits, allphase damage/normal-mid-full/consumption/pierce, body/slide bounds and drop/cleanup/freeze/born/deflected-shot/oneway/removal/rearm/built-in-local guards. Base407and accepted Flea/SuperCutter/Blaster suites pass under Octopus overlay; gate34/pause16source regressions pass. Rectangular solids/one-way caps, native-to-project coordinates/spawn scheduling and uniform-byte endpoint RNG are explicit adaptations, not full native tileclass/RNGhistory/hardware/GMS identity.

Deterministic18file ZIP has CRC/byte equality/SHA256manifest; no ROM/states/disassembly/audio replacements. Exact folders/resource/object settings/Create+Draw events and append-once/whole-script boundaries are documented. **Implementation/package prepared; local GMS compilation and user-installed acceptance pending.** Do not advance roster as installed without feedback; preserve working combat backup.

## Octopus Battery accepted; Flying Shell research checkpoint (2026-11-01)

User confirmed Octopus Battery **“confirmed working”**, then authorized Flying Shell/Shellgun research. Preserve all five installed enemy types as accepted baseline. Research/art only now under `Assets/Enemies/MM1/Flying Shell/`; no gameplay/installer/audio replacements yet.

Two original type0Arecords page16/17X248/Y128 map to projectX2040/Y368/608, bands240/480. They repeat at the screen edge after leaving view; killed copies create invisible replacements (counter72, controlled same-frame double-decrement yields activation70subsequent emulatorframes later). Native1.125left flight,56moving/32stationary update cycle; open/stop at56, eight-way burst72, close/resume88. Actual closed normal overlap blocks/HPunchanged/native1Dqueue; open normal overlap becomes1Bdeath explosion, originalHP20/basic20onehit threshold. Body1/half8×9, bullets2/half1×1.413source bytes checked; two1000-update traces,1984active-cycle transitions/1038bullet deltas/20bursts. Native firing produces8requests AND8driver15dispatches perburst, not deduplicated; same command as accepted Blaster but waveform equivalence/appropriate burst capture still pending—do not blindly stack8WAVs or overwrite approved audio. Original closed/open poses independently native-render matched into17×24commoncells/origin8,11, preserving1pxmiddle-pair offset. Source/research checks pass, no GMS implementation or runtime claim. Next work includes native full-APU burst comparison and additive installer preserving accepted ownership.

## Flying Shell implementation/native burst prepared (2026-11-01)

User authorized proceeding after research. `Assets/Combat/MM5/Flying Shell Checkpoint/` now provides additive GMS1.4 manual installer/ZIP: two native sprites (body17×24/origin8,11and salmon bullet8×8/origin4,3), one new native full-APU burst sound, bodyCreate+Draw/no parent, bulletCreate+Draw/parent **existing obj_mm1_blaster_bullet**, five new scripts, one managerCreateappend and two full central replacements. Child inheritance shares accepted bullet motion/contact2/cleanup, overrides palette without changing earlier Blaster magenta. No actor Step passes/manualinstances/camera/player/terrain/menu/old-audio changes. All accepted central lines/init preserved outside additive calls.

Native active-cycle1984state and1038bullet-delta matches; both repeating anchors,8vectors, pre-update closed-block/openonehitkill with MM5normal/mid/full/weakpierce, established MM6ding/deflection/hit, no-kill fractional reentry and observed70subsequent-update postkill replacement, body1/bullet2/slide/drop/freeze/cleanup/source/builtin guards pass via limited adapter. Base407and all five prior enemy suites pass under Shell overlay; gate34/pause16source checks pass. Native hidden-placeholder/order/randomfraction effects are explicit central-manager adaptations, not full scheduler/GMS/hardware identity. New projectile GUI parent must be set manually; source tests do not prove installed inheritance.

`compare-flying-shell-audio.mjs` captures real unchanged8native15dispatch burst from normally initialized snapshot/fullAPU after nativeFFmusic stop. Labelled1requestcontrol is not exactPCM-identical (6568vs6592active frames), not a perceptual or historicalBlaster waveform claim. Deliver actual8dispatch take as one WAV perburst, exact2×gain/silence-only2mslead+10mstrail,7144frames/48kstereoPCM16. Accepted Blaster/MM6/MM5/charge/music untouched. Fulltail audit retained in repo, excluded from importZIP. **New sound still requires user listening/runtime approval.**

Deterministic22file ZIP/CRC/byteequality/manifest verified; no ROM/states/disassembly/fulltail/old-audio/scenery replacement. Exact resource folders, sprite origins, objectsettings/Create+Draw, critical bullet-parent selection, sound import, appendonce and whole-script boundaries documented. **Prepared source/package, not GMS compilation or installed-runtime/newaudio acceptance.** Await user confirmation; preserve accepted backup before installation.

## Flying Shell accepted; Big Eye initial research (2026-11-01)

User identified Shell burst cue as Blaster's firing effect; same native$15command, sample differences do not establish a distinct sound. Reusing accepted Blaster cue once perburst was discussed; no source replacement was installed/published afterward. User then explicitly reported **“works perfectly”** and authorized **“moving on”**. Treat Blader/Blaster/Super Cutter/Flea/Octopus Battery/Flying Shell as accepted runtime baseline; do not silently revise working Shell/audio.

Next original record44/page18/type09 is **Big Eye**, anchor2016,892/band720 before first gate. Initial research only at `Assets/Enemies/MM1/Big Eye/`:219exactUSAbytes,1347native AI entries across five600video-update controlled trials,25jumps/both native speed choices,20landings issuing29hexonce each,236live quarterclock skip assertions. Ground wait15; native HP20/basicdamage1/contact10/halfsize12×20. Record44 must not be mistaken for enemy slot44; actual object slot located independently. Rightward trials leave after49entries; no3000AI-entry/fullterrain/natural-playthrough claim. No working combat/audio/player/camera/scenery changes. Next recover native art/landing audio and movement-model/terrain/charge adaptation before additive GMS1.4 package; Big Eye is not installed/accepted yet.

## Big Eye native resources/additive implementation prepared (2026-11-01)

User authorized “proceed please”. `Assets/Combat/MM5/Big Eye Checkpoint/` now supplies detailed GMS1.4manual installer/ZIP: one32×48two-pose sprite/origin12,27, oneCreate+Drawparentless object, five new scripts, managerCreateappendonce, two whole central replacements, one new landing sound. All accepted central lines preserved outside additive calls/loop; camera/player/terrain/blocks/gates/pause/oldaudio untouched. Six accepted enemies remain baseline.

Both native poses OAM/CHR/palette recovered and opaque-pixel render matched independently. FullAPU native29hex landing captured after initialized-music/nativeFFstop, one actualrequest/one driverdispatch across whole capture; after landing only fixture holds grounded slot16wait255 to exclude second landing from full tail. 48kstereoPCM16/exact2×gain/silence-only2mslead+10mstrail trim8652frames; fulltail54953frames retained outsideZIP. No channel muting/fades/synth/pitch/filter; **new sound listening approval pending**.

Actual GML via limited engine adapter matches721native free/350ground/236skip transitions, with accepted actual anchor support and rectangular floor/wall/ceiling/oneway boundary fixtures. Native terrain-edge solver is not claimed fully matched. Native20HP/basic1/contact10/half12×20; MM5normal/mid1/full3 and pre-hitHP<4weakpierce adaptation:20normal/mid or7fullhits. Ground wait15/both speedchoices/shared quarterclockskip; one landing cue only airborne->ground. Tests cover hit/contact/slide/bounds/killbeforecontact/drop/freeze/routecleanup/spawnrearm/nativeart/audioexacttrim/hash/preservedcentral/builtinlocals. Base407and all six prior enemy suites pass under BigEye overlay, gate34/pause16source checks pass.

Deterministic package/CRC/exactcopies/manifest verified. NoROM/states/disassembly/fulltail/oldaudio/scene replacement. **Prepared source/package, not GMS compiler/runtime or installed/user acceptance.** User must back up, follow exact folders/events/replacement boundaries, compile/playtest and approve new sound. Big Eye not yet accepted.

## Big Eye accepted; MM5 free-fall/pit correction prepared (2026-11-01)

User confirmed Big Eye **“confirmed working”**. All seven enemies and their audio are accepted baseline. User paused Screw Bomber to request non-ladder falls into actual connected lower screens, otherwise pit death; independently requested MM5 verification and no explosion on pits versus normal spike/health death, then explicitly authorized **“lets implement it”**.

`docs/mm5-fall-reference/` records original supplied-MM5 controlled trials/95exactUSAbytes: non-ladder/no-button lower connection60×4camera and−3.5screenY, retained fall; fullHP/invulnerability0+60 pit state7/F0musicstop+1Ddeathcue/300counter/life2→1; lethal spike-class and real lethal-contact handlers create16particles, pit creates0. Spike fixture substitutes one terrain-query classification, not natural spike traversal. No generalized full spike matrix claim.

`Assets/Cut Man/Stage/Free Fall Correction/` now provides GMS1.4manual installer/ZIP. Four new scripts, cameraCreateappend, combatCreateappend, full cameraBeginStep/managerordinaryDraw/dieScript replacements. No new art/audio/objects/roominstances, no geometry/player/enemy/gate/EndStep-owner replacements. The native-death-equivalent visual flag preserves ordinary16particle death and suppresses only pits; direct pit wrapper bypasses hurt/protection, keeps accepted sound/countdown/lives/retry. Native health RAM staying28 and native checkpoint/GameOver placement are NOT reproduced: shared project death empties HUDhealth and preserves existing opening/title retry adaptation.

5934worldXsamples against independent14room rectangles/11nonseam connectedfalls/every60native verticalcamera+player sample/alignmentframe/releaseupdate62/retainedfall/Start/refill/hurt/charge/sourcepreservedgate+ladder body pass. Wide section4 onlyleft768..1023 has lower room; gap1184..1215 is a pit. Section8 has left1280..1535→7 andright1792..2047→9; middle1536..1791 pit. Horizontal camera interpolation is a project-layout adaptation, never playerXteleport. Ladder timing remains unchanged; freefall no32-update ladderhold. Pit actualGML tests fullHP/protection0+60/onecue/noDrawparticles/300timer/one-life/zero-sparetitle; ordinary lethaldamage still16particles. Base407/all7enemy suites pass with FALL_OVERLAY; gate34/pause16source checks pass. Builtin/obsolete-variable guards and die/drawline preservation checked.

Deterministic14file ZIP/CRC/exactbytes/manifest verified; no ROM/states/disassembly/art/audio/geometry replacement. **Prepared package, not GMS compiler/scheduler/runtime or user-installed acceptance.** Exact folders/events/appendonce/whole replacement boundaries are in INSTALL-GMS14.md; back up first. Current Cut Man spikes remain art-only; future lethal spike collision must call ordinary death, not pit wrapper. Screw Bomber remains paused until correction acceptance.

## Accepted Free Fall Correction; jumping gates next (2026-11-01)

User confirmed the Free Fall Correction **“its working”**. Commitf37fc1c is now accepted baseline alongside all seven enemies through Big Eye. Non-ladder downward sections/pits are no longer pending preparation. Screw Bomber remains paused until this gate correction is installed/accepted.

User then reported neither boss gate opens when jumped into; inspected accepted code and confirmed grounded/zero-fall-speed/floor-only trigger. User explicitly requested airborne entry for BOTH. New **Jumping Gate Entry** package retains approved walking timing/X/camera/audio, FreeFall/pit/ladder body and existing combat ownership. One new camera-owned air-step helper + complete gate-start and cameraBeginStep replacements; no new art/audio/object/room/Create/EndStep changes. Trigger preserves airborneY/velocity, then carries MM5 gravity/cap arc to accepted floor, uses real ceiling sweeps and ignores only currently opening gate mask. Not a claim of independently native-ROM-matched airborne gate choreography.

1476per-update/eligibility checks plus ceiling/charge/cleanup/sourceidentity/new-Begin11connectedfalls+6pits pass. Exact accepted non-gate BeginStep reconstruction verified. Package/source checks are NOT GMS1.4compile or installed scheduler/animation/playtest acceptance. See Assets/Cut Man/Stage/Jumping Gate Entry/INSTALL-GMS14.md; user playtest of both jumping doors remains pending. Do not proceed to Screw before this correction is accepted.

## Screw paused again: gate opening-speed investigation (2026-11-01)

User authorized resuming Screw Bomber, then interrupted before delivery to reconsider gate opening speed. Local Screw implementation/reference/package drafts exist, but are NOT published/installed/accepted and must remain paused. User clarified passage/scroll/closing scope is fine; only opening feels fast, then requested MM5 comparison and further investigation. No8-frame cadence suggestion was installed. Do not infer separate jumping-gate runtime acceptance from moving on.

`docs/mm5-gate-contact-reference/` now records four actual MM5 boundary-triggered gates (both Napalm doors, two fractional approaches), after an explicitly controlled native room-render lead-in. Right-only measurement, no opening-call redirect/forced gateflags/per-frame pins. New result: geometric sideprobe/door-tile crossing→native boundary trigger6–7walkingupdates→first visible edit1update later. Native editbuild0/4/8→PPU+actualdisplay1/5/9; openerreturns/scrollstarts12. Current project triggers earlier at solidface/center−8 and edits0/6/12/18/scroll24. Position-based onset, NOT native6–7frame delaytimer.54USAinstruction/tablebytes+PPU/display/event/sourcehash checks pass. No gameplay source/geometry/audio changed or new installer delivered; user decision on any opening adjustment pending. Screw remains paused.

## User keeps doors as-is; Screw Bomber checkpoint prepared for installation (2026-11-01)

User explicitly decided **“never mind its fine as it is.. we will do screw bomber”** after the MM5 contact investigation. Keep existing opening trigger/cadence/audio, walking/jumping entry and accepted freefall/pit code unchanged. No proposed8-frame cadence or later-trigger geometry is applied. Screw work resumes; this is not a new claim that every gate checklist case was individually tested.

`Assets/Combat/MM5/Screw Bomber Checkpoint/` supplies the focused GMS1.4manual package: two native16×16/five-frame sprites/origin8,7, one parentless Create+Drawobject, five new scripts, one managerCreateappend, two whole central replacements. Three original corridor records45–47 map floor2520,880/ceiling2760,816/floor2896,880. Reuse existing Blaster bullet/art/approved firecue; no new sound or bullet object, no camera/player/terrain/room/death/pit/oldenemy/audio changes. All accepted central lines retained outside additive Screw hooks/shot loop.

230USA source bytes verified; ten600update native controlled trials/6000AI-animation entries,41five-shot fans,11321shared2Dbullet movement pairs. Ten native OAM/CHR/palette poses render-matched; four real three-B-press kills include CLOSED bodies (HP20→13→6→death, no block/deflection). Native floorbody1/ceilingbody2/bullet2; strict80px proximity, emergence/retraction8, twofans32updates apart, randomcooldown32/63/125/native seedmod3. MM5adaptation normalized3HP/normal-mid1/full3/weakfullpierce and existing hurt/drop/central birth/spawn/clock/RNG ownership, not native global pool/RNG or independent MM5charged-Screw certification. Existing Blaster bullet tile6A/palette3 RGBA exactly matches both fixtures; same native15cue reused ONCE perfan, not five stacked WAVs or newly invented effect.

ActualGML native/state/vector/256cooldown/born/contact/slide/protection/damage/killbeforecontact/drop/freeze/rearm/cleanup/art/geometry/sourcepreservation/builtin guards pass. Base407/all7prior enemy suites under Screw+FreeFall overlays, freefall/pit/jumpinggate/pause regressions pass. Deterministic18file ZIP/CRC/exactcopies/manifest verified. **Prepared/delivered source package, not GMS1.4compiler/runner/GPU/audio/installed acceptance.** Exact resource folders/objectsettings/Create+Draw/appendonce/whole-script boundaries are in INSTALL-GMS14.md. Await user compile/playtest; no boss implementation or whole-stage completion claim.

## Screw Bomber artwork correction (2026-11-01)

User rejected the delivered sprites as scrambled/not Screw Bomber and authorized correction. Root cause: type05/16 substitutions at opening-area X824 retained opening-area CHR/palette. Old opaque-pixel comparisons against that same fixture did NOT establish art identity; those claims/ten hashes and bullet-RGBA-equivalence claim above are superseded. AI/damage observations remain explicitly separate controlled tests.

Rewritten recover-screw-bomber-art.mjs fresh-boots the supplied USA ROM, discloses a single page20/C219 death-handler setup shortcut, runs the original checkpoint reload, and walks to all THREE original corridor spawns. No forced types/CHR/palette/objects; protection100 only. Fifteen native-render-matched poses, second floor exact equality, original pattern bytes verified in ROM. Correct corridor palette3 = 30/26/0F. Dedicated salmon/white bullet sprite and child object inherit accepted Blaster movement/contact/cleanup without changing its magenta sprite. Only Screw step's spawned object name changes; body AI/timing/audio/central scripts unchanged.

Corrected full installer plus a minimal sprite-correction ZIP/guide: replace two body sprites, add bullet sprite/child Create+Draw, replace only Screw step. Existing installs must NOT repeat manager append/central replacements. Keep doors/freefall/pits/player/terrain/audio/seven accepted enemies untouched. Source/emulator/model checks are not GMS compile or user acceptance; awaiting installed feedback.

## Screw Bomber working; first-frame-only artwork follow-up

User: **“it works”**, but both floor/ceiling first frames need correction. Keep accepted working behaviour. The prior corrected extraction used a narrow Y window that captured C3/C4 lower cells of a transitional emerging pose after object Y restored, misclassifying it as closed. Recovery now broadens selection and requires exact complete tile sets; closed must be BC/CF, not just any two cells. Settled alignment + opaque-pixel native-render comparison retained; all three corridor encounters rerun. Only two index0 RGBA hashes change; all eight other poses and bullet unchanged. Dedicated three-file FIRST-FRAME-FIX sprites-only ZIP/guide; full and earlier correction ZIPs refreshed. No GML/resource settings/gameplay/door/audio changes. Await user visual acceptance; compilation/playtest of the preceding correction was user-confirmed working.

## Screw Bomber final sprites accepted; fixed large health prepared

User accepted first-frame fix **“okay perfect”**, then requested placing the large health powerup in its original location. Eight enemy behaviours and Screw's final art are now user-accepted. Doors remain untouched.

`Assets/Combat/MM5/Cut Man Large Health/`: original record38/page15 X40/Y184/type40hex independently read from supplied ROM; top stripe native13→project1280/band0 maps **world1832,184**, on existing ledgeY192, before next downward route. Native type40 flags02/zero speed/no temporary flag10,600controlled stationary/no-expiry updates, original +10 collection verified. This uses an opening-area type substitution only for lifetime/collection (no art extraction/natural traversal claim). Existing accepted MM5 large-health sprite/kind74/+10/cap28/incremental refill/freeze/audio reused.

One script, one Create-only child of obj_mm5_pickup/inherited Draw, managerCreateappend, two whole script replacements (latest Screw combat_end_frame plus rearm/spawn lines; original random-drop pickup_step plus fixed-object early exit). Static placement/no255update lifetime; no regeneration while anchor remains visible; leave view/band/route to rearm is explicit project spawn policy, not exact NES global slot-reuse persistence. No collect/refill/shot/player/camera/gate/terrain/room/death/enemy/art/audio change. Source/model native/geometry/1000update/viewedges/once/borneguard/refill/cap/fullhealth/slide/hurt/route/randomdrop/source-preservation tests pass. Package/CRC/manifest verified; **GMScompile and installed fixed-health acceptance pending**. Boss/spike/E-tank work not included.

## Fixed large health accepted; spike functionality / invincibility fix prepared

User accepted health placement **“perfect!”**, then requested spikes and fixing the vanilla after-hit invincibility bug. Preserve MM5 protection, not MM1's spike exception. New `Assets/Combat/MM5/Cut Man Spikes/`: one new hazard script + one full latest fixed-health/eight-enemy combat_end_frame replacement. Existing ten separate16×16spike objects/positions/solid-underlay/art remain unchanged; no new events, parent, managerCreate, player/camera/gate/health/death/audio changes.

Supplied MM5USA freshboot controlled terrain-queryF0classifications/60exactinstructionbytes verify initialflash0/1/2/60→continuous-contact death1/2/3/61; isolated native state6guard skips three samples, release→death4. Every lethal branch16particles/one1Dcue. Original guard/marker/dispatch/death/audio code unpatched, playerY/speed pinned to exclude pits, state6trial deliberately isolates guard; not natural spike traversal/geometry or fullrecoil simulation. Independent existing recoil27→flash60 remains unchanged.

ActualGML checks every active update, after entity contacts/before health collection; protects mm5_hurt_left>0 OR mm5_invulnerable>0. No permanent touched/safe/enter-only latch; stationary expiry becomes lethal immediately. Calls ordinary shared die, not pit wrapper; resetpitflag/16particles/onecue/musicstop/one-life/retry retained. Explicit project-rectangle hazard envelope: full tile16×16; player standing±7/head_offset10/inclusivefeet12; slide±14/top−3/feet12. Native guard semantics verified, not exact native corner-by-corner collision-probe certification.

8580actualGML integer/subpixel/body-boundary cases, all10anchors, expiry0/1/2/60/27hurt→60flash/no-reentry/contacts/refillpriority/drawparticles/audio/retry/startup/refill/route/inactive guards and exact fixed-health baseline preservation pass. Source/model/native evidence is not GMScompiler/runner/installed acceptance. Await user compilation and invincibility-expiry playtest. Boss/tank/weapon/checkpoint work not included.

## Spikes accepted; Cut Man E-Tank location approved

User confirmed active spikes **“works perfectly”**. Then reviewed approved tank distribution and accepted Cut Man's proposed perch: atop the lone Super Arm block at1152,1056 (32×32), proposed E centre1168,1048/band960, after first cutter dispenser before small pit. Visible optional32px climb from neighbouring ledge1088, no Super Arm required, no geometry change. Inventory capacity and collected-tank death/revisit persistence still require decisions; location acceptance does not authorize silent farming/reset policy or enabling consumption. Existing global.mm5_pause_tanks[0] is E inventory; menu Start intentionally refuses consumption pending refill integration.

## Cut Man E-Tank + pause use/refill source package prepared

Follow-up user approvals: capacity9/leave world pickup if full, retain inventory+collected status across death/retry, implement actual E consumption/full refill now. One custom perch1168,1048/band960 on existing block1152,1056; no geometry/door/enemy/player/death/audio changes. Native MM5 supplied-ROM probe confirms E animation72/two complete render-matched16×16palette phases/cap9/pickup24 same as accepted extra-life resource. Native Start→Down→Start with seeded HP/inventory verifies heal to28/cue26every4updates, full-health/empty guard, heldStart once, staysmenu/Buster selection. Controlled native itemB6 fixture; no natural fullstage collection claim. Native full-cap removal deliberately replaced with approved leave-full policy.

`Assets/Combat/MM5/Cut Man E-Tank/` ships art, new pickup child Create/Draw, three scripts, two manager/menu Create appends, five whole script replacements, pause Step+DrawGUI replacements, exact GMS1.4 guide/manifest/deterministic ZIP. No new audio imports. Collected flag reset only explicit new-game/Game Over inventory initializer, persists room retry/revisits. No immediate collection heal. Start E consumes once only if health1..27/E>0, uses existing refill/audio helper on menu-owned copy while all exact frozen world IDs remain inactive. Final wait then Buster/staymenu; normal restore activates exact IDs then commits fullheal. Surface-loss/Room-End fallback completes paid benefit; cached-stage HUD overdraw during close. Full/empty/dead/A/W/M untouched, W/M still deferred. Existing charge/BeginStep/fade/ownership policy preserved.

New source/model test passes native hashes/approved perch/1000stationary updates/cap/once/persistence/newgame/input/cadence/finalwait/inactive-player trap/restore/fallback/HUD/source preservation. Eight-enemy/407baseline,8580spike boundaries, fixedhealth/freefall/pits/1476jumpinggate regressions pass with E overlay where supported; standalone accepted pause UI/transition checks also pass. Flea/Cutter random-drop tests now specifically count requested kind75 instead of treating the newly visible fixed E as another random drop. No gameplay adjustment for those tests. Native probe and deterministic package/CRC/manifest checks pass. **No GMS compiler/runtime available; source is ready, installed compile/playtest acceptance PENDING.** Boss/weapon/checkpoint/other tank effects remain future work.
