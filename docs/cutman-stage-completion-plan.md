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
