# Cut Man fifth upward connection and downward return

Manual GMS1.4.1760 upgrade from user-confirmed correctedFourth/dispenser baseline. **New source package prepared; user runtime acceptance pending.**

- [ZIP download page](Downloads/mm1-cutman-fifth-ladder-transition-gms14.zip)
- [Matched-resource installation guide](INSTALL-GMS14.md)

Adds originalpage10/room3 above far-right of3screen stripe7..9.1536x1440world, openingY1200, previoussinglesY960/720/480, horizontalstripeY240, newroomX1280/Y0. CameraX1280bothnewdirections; return restoresfar-right run, notleft. Up126/down126 (longer native stripe restore), earlier2/3/4down95preserved.1343tiles/68solidregions/17ladders/16tops/11scriptedblocks/onepreserveddispenserfeature. Newblock1376,160; building864,368. No newresourcenames/art/audio, fiveexisting script +threecameraevent replacements. Existingatlas/spritecopies included onlyforrecovery. StageCreate/music/player/pause/HUD/arrival/charge code unchanged.

Prior blankterrain diagnosis VIEW720 vs960 fixed and useraccepted “very good it all works now”. New upgrade intentionally movesALLexistingworldY+240 and openingview1200; complete matchedupdate +Create roomchecks prevent repeating mismatch. Do notapplyonlytileScript. Keep separatebuilding, never re-bake its30tiles. No cutterspawning yet, nextupperoutgoing ladder/enemies/combat/damage/pickups/tanks/death/boss remain undone. Jump existingpit1184..1215; norespawnimplemented.

## Evidence and reproduce

SuppliedMM1USA/JSNES2.1.0, MesenRGBmapping notMesenexecution. Controlledpriorlead-ins +900Rightframes withY36/velocity0/protection100, thenone-timepage9ladderX216/Y40 placement/reset, neutralcache-refreshframe, originalUp-only; NOT naturalwhole-stage traversal. Uptrigger49/scroll81..140/finish141/bookkeeping174/control175(age126). Down-only fromUp184: trigger14/scroll46..105/finish106/bookkeeping139/control140(age126), noadditionalpatches. IndependentfreshUp/Down123..125ignored/126..128accepted.960native tile+palettepairs validated; nativeactive blockrecorddecoded. No newlyclaimedwhole-routinebyteaudit.

Tools/rom-recovery order, suppliedROM/priorignored.work snapshots/npmdependencies:

1. Priorprobes regenerateFourth settledsnapshot.
2. probe-cutman-fifth-ladder.mjs (controlledhorizontalrenderertraverse +ladderplacement/Up).
3. probe-cutman-fifth-ladder-return.mjs (Down-only/pretrigger snapshot).
4. probe-cutman-fifth-scroll-ready.mjs / probe-cutman-fifth-down-ready.mjs (independentfreshinput).
5. recover-cutman-fifth-upper-room.mjs (page10/room3, evennametable960comparisons).
6. build-cutman-fifth-scroll.mjs (baseCORRECTED SuperCutterDispenser/geometry.json; translatefeatures/oldgeometry; reuse25tileatlas; decode11thblock; assertnewnativepixelmatch andoldfullsceneunchangedexcepttranslation).
7. test-cutman-fifth-scroll.mjs (26source/modelchecks actualGML allTENbusyframecases;126newreturn; featureposition/no bakedtiles;11blocks/1343tilecalls/fullscene reconstruction; prior900horizontalframes; bounds/coordinatechecks/charge/cleanup).
8. package-cutman-fifth-scroll.py (14fileZIP byteidentity andunchangedrecoveryartaudit).

JSenginemocks NOT GMScompiler/GPU/scheduler/async/withiterationcertification. MM5art/normalphysics/climb/animation/edgepadding/falling remainadaptations; noexactMM1playerclaim. Native-entrysubpixelsinjectedfortracecomparison. Userchecklistrequired. Sourcegeometry includesfeatures collection andcellfeaturemarkers; futurebuildersmusttranslatefeatureswithroute. Historicalpackageskeptforrollback; do notrestorebakedbuildingversion.
