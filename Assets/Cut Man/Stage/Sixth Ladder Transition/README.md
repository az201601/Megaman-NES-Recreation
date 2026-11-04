# Cut Man sixth connection + upper page11

ManualGMS1.4.1760 upgrade from user-confirmedFifth baseline. **New source package prepared; installation/runtime acceptance pending.**

- [ZIP download page](Downloads/mm1-cutman-sixth-ladder-transition-gms14.zip)
- [Matched resource/event/room installation](INSTALL-GMS14.md)

Adds originalpage11/room6 abovepage10.1536x1680world/openingY1440; priorupperpages4/5/6 atY1200/960/720, horizontalstripe7..9 atY480, page10Y240, newroomX1280/Y0.1525tiles/73terrain solids/18ladders/17tops/12scriptedblocks/onepreserveddispenser. Newblock1312,128; building864,608. Same25tileatlas/96x80sprite, recoverycopiesincludedonly. Fiveexisting scripts +threecameraevent replacements; no newresources/StageCreate/music/player/charge/pause/HUD/arrival edits. Exactroom/view/playercoordinatesin guide; do notapplypartialupdate. NextTOP-LEFToutgoingladderworld1320unconnected; no cutterspawning/enemies/combat/pickups/tanks/death/boss.

SixthUp126/Down95; fifthDown126 preserved, allpriorconnectionsunchanged. OriginalUptrigger49/scroll81..140/finish141/bookkeeping174/control175; Down-onlyfromUp184: trigger14/scroll46..105/finish106/bookkeeping108/control109. IndependentfreshUp123..125ignored/126..128accepted, freshDown92..94ignored/95..97accepted.960nativepage11tile+palettepairs againstoddnametable; nativekind2/page11blockrecorddecoded. Controlledpriorlead-ins +one-timepage10X216/Y40placement/reset/protection100 andneutralcacheframe, thenUp-only, noextraDownpatches. NOT naturalwhole-stage traversal, Mesenexecution/hardware or newcomprehensiveroutinebyteaudit. MM5normalphysics/art/climb/animation/edgepadding/charge/menu/fallingadaptationsretained; nativeentrysubpixelsinjectedforcomparison.

28source/modelchecks: actualGML ALL12busyframecases, independentfreshinputs, all6mergedseams/noartificialtops, acceptedlowercells/objects/featurestranslatedonly, oneunbakeddispenser,12blocks,1525actualtilecall/fullscenepixelreconstruction, prior900horizontalframes, coordinatebounds/oldheightrejection/charge/rearm/cleanup. JSenginemocks NOT GMScompiler/GPU/scheduler/async/with-descendantiteration/runtimecertification. Userchecklistrequired. Existingpit1184..1215nowY672..719mustbejumped; death/respawnnotimplemented/fallingmayrequirerestart.

## Reproduce

Toolsunder tools/rom-recovery, suppliedROM/npmdeps, ignored.work snapshots, noROMbundled:

1. PriorprobesregenerateFifth settledsnapshot.
2. probe-cutman-sixth-ladder.mjs: controlledoutgoingladderplacement, neutralcacheframe, Up-only.
3. probe-cutman-sixth-ladder-return.mjs: Down-only/pretrigger snapshot.
4. probe-cutman-sixth-scroll-ready.mjs / probe-cutman-sixth-down-ready.mjs: freshinputtests.
5. recover-cutman-sixth-upper-room.mjs: originalpage11/room6,960pairednametablechecks.
6. build-cutman-sixth-scroll.mjs: acceptedFifthgeometrybase; preservefeaturemarkers/translatebuilding; decode12thblock; exactexistingatlasmatch/newroomrender andentireoldscene+240pixelassertions; copyunchangedrecoveryart.
7. test-cutman-sixth-scroll.mjs:28actualsource/modelchecks; unchangedhelpers/cleanup/guardsreadfrompriorpackages.
8. package-cutman-sixth-scroll.py:14fileZIPbyteidentity +recoveryartidentity.

HistoricalFifth/Fourth/correctionpackagesremainintact. Keepfeaturescollection/cellmarkersin subsequentbuilders, translatefeaturepositionswithroute, do notre-bakebuildingorleaveoldY. Priorfifth/fourth/dispenser/pause16/UI/Blader1023update regressionspass; no newin-gameacceptanceclaimed.
