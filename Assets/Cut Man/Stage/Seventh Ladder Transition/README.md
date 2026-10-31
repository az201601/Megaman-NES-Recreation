# Cut Man seventh connection + upper page12

ManualGMS1.4.1760 upgrade from user-confirmedSixth baseline. **New source package prepared; installation/runtime acceptance pending.**

- [ZIP download page](Downloads/mm1-cutman-seventh-ladder-transition-gms14.zip)
- [Exact matched-resource installation](INSTALL-GMS14.md)

Adds originalpage12/room4 abovepage11TOP-LEFT ladder.1536x1920world/openingY1680, pages4/5/6 Y1440/1200/960, horizontalstripeY720, pages10/11 Y480/240, newroomX1280/Y0.1719tiles/79terrain solids/20ladders/19tops/13scriptedblocks/onepreserveddispenser864,848. Newblock1376,128. Existingatlas25tiles/sprite96x80unchanged, copiesonlyforrecovery. Fiveexistingscript+threecameraeventreplacements; no newresource names, StageCreate/music/player/charge/pause/HUD/arrival changes. Completeexactcoordinateset, notpartialtileupdate.

SeventhUp126/Down95, allsixearlierconnectionsretained (includingfifthlong126Down). Incomingplayercentre1320; nextoutgoingupperleft1336NOTconnected. OriginalUptrigger49/scroll81..140/finish141/bookkeeping174/control175; Down-onlyfromUp184trigger14/scroll46..105/finish106/bookkeeping108/control109. IndependentfreshUp123..125ignored/126..128accepted, Down92..94ignored/95..97accepted.960nativepage12tile+palettepairs validatedagainstevennametable; kind2page12blockdecoded. Controlledpriorlead-ins/placementpage11X40Y40/reset/protection100/neutralcacheframe beforeUp, noextraDownpatches. Notnaturalwhole-stage traversal, Mesenexecution/hardware ornewwhole-routinebyteaudit. MM5art/normalphysics/climb/animation/edgepadding/charge/menu/fallingadaptationsretained; native-entrysubpixelsinjectedforcomparison.

31source/modelchecks cover ALL14actualGMLbusyframecases, freshinputs, sevenmergedseams/noartificialtops, priorlowercells/blocks/featurestranslatedonly,13blocks, no bakedbuilding,1719actualtilecalls/fullscenepixels, prior900horizontalframes, matchedcoordinates/bounds, directionalleftseamvspriorrightreturn, charge/rearm/cleanup. JSmocks NOT GMScompiler/GPU/scheduler/async/withiteration/runtimecertification. Userchecklistrequired. Existingpit1184..1215nowY912..959mustbejumped; death/respawnnotimplemented/fallmayrequirerestart. No cutterspawning/enemies/combat/pickups/tank/death/boss installed.

## Reproduce

Toolsunder tools/rom-recovery; suppliedROM/npmdeps/priorignored.work snapshots, noROMbundled:

1. PriorprobesregenerateSixth settledsnapshot.
2. probe-cutman-seventh-ladder.mjs: leftladdercontrolledplacement, neutralcacheframe, originalUp.
3. probe-cutman-seventh-ladder-return.mjs: Down-only/pretriggersnapshot.
4. probe-cutman-seventh-scroll-ready.mjs / probe-cutman-seventh-down-ready.mjs: freshinputtests.
5. recover-cutman-seventh-upper-room.mjs: page12/room4,960pairednametablechecks.
6. build-cutman-seventh-scroll.mjs: acceptedSixthgeometrybase/features,13thblock, exactexistingatlasmatch/newupperrawpixels, entireprior1536x1680scene+240pixelassertion, unchangedrecoveryartcopies.
7. test-cutman-seventh-scroll.mjs:31actualsource/modelchecks, priorunchangedcleanup/guardsreadasinstalled.
8. package-cutman-seventh-scroll.py:14fileZIPbyteidentity/recoveryartidentity.

Preservefeaturescollection/cellmarkersandtranslatefeaturepositionsinfuturebuilders; neverre-bakebuildingorleaveoldY. HistoricalSixth/Fifth/Fourth/dispenser/repairpackagesretainedforrollback. PriorSixth/Fifth/Fourth/dispenser/pause16/UI/Blader1023regressionspass. No newin-gameacceptanceclaimed.
