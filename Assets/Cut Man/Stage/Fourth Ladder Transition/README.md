# Cut Man fourth ladder + three-screen upper stripe

Manual GMS1.4.1760 upgrade from user-accepted Third Ladder Transition. **New package source-ready; user installation/runtime acceptance pending.**

- [ZIP download page](Downloads/mm1-cutman-fourth-ladder-transition-gms14.zip)
- [Exact folders/resources/events/room guide](INSTALL-GMS14.md)

Original stripe pages7..9 follows page6's top-left ladder. Full3screenrun plus horizontal camera and downward return; not another guessed single screen. World1536x1200, openingY960, single upper pages4/5/6 atY720/480/240, new stripeX768..1535/Y0.1207tiles,60terrain solids,15ladders,14tops,10scriptedblocks (original9+native page8block). New128x64Background atlas25tiles, first13unchanged plus12native decorative tiles;7replacement GML files. No music/player/charge/pause/arrival/HUD/stageCreate edits. Next outgoing ladder atworldX1496topright remains unconnected.

**Native bottomless gap worldX1184..1215: jump across. Death/checkpoints not implemented; falling may require restart. No fake floor/teleport inserted.** Leftmost return opening is separate. See guide for full runtime checklist and rollback.

## Evidence

Supplied original MM1 USA/JSNES2.1.0/MesenRGBmapping, not Mesen execution. Controlled prior lead-ins, one-time page6X56/Y40 placement/reset/protection100; neutral original frame refreshes relocated ladder cache, then original Up-only. Up trigger49/scroll81..140/finish141/bookkeeping174/control175(age126). Down-only from early settled Up frame184, no further patches: trigger14/scroll46..105/finish106/bookkeeping108/control109(age95). Independent fresh probes confirm126up/95down. Not natural whole-stage traversal.

Native order4 begins7/ends9.2880tile IDs and palettes checked against original nametables7/8/streamed9. Additional controlled renderer traversal: one A to leave ladder then Right, pinsY36/velocity0/protection100; actual camera source vs900original frames exact after coordinate translation. Native kind2active page8X128/Y96 -> new separate blockworld1152/Y96. Actual scenery + sprite reproduces entire decoded3page image. No whole-routine disassembly byte-audit claim. MM5 art/climb/physics/animation/edge-padding/charge/pause retained adaptations; falling-entry not independently replay-certified.

22source/model checks: all8actual cameraGML busyframe traces, fresh probes, all4seam ladders/no fake tops, accepted lower cells/objects translated only,10scriptedblocks, first13atlas tiles preserved,1207actual tile-call reconstruction, new900frame camera trace, charge/rearm/cleanup/bounds, and no incorrect pit-to-narrow-room teleport. JS mocks NOT GMScompiler/GPU/scheduler/async/with-descendant iteration certification. Previous first/second/third/opening/pause-stage16/UI/Blader1023update regressions pass. No enemies/combat/pickups/tank use/death/boss/score implemented.

## Reproduce

Tools under tools/rom-recovery, supplied ROM, npm dependencies; ignored.work products, no ROM bundled:

1. Prior probes regenerate third settled snapshot.
2. probe-cutman-fourth-ladder.mjs: controlled left-ladder placement, neutral cache refresh, original Up trace/snapshots.
3. probe-cutman-fourth-ladder-return.mjs: Down-only trace/pretrigger snapshot.
4. probe-cutman-fourth-scroll-ready.mjs / probe-cutman-fourth-down-ready.mjs: independent fresh-input tests.
5. recover-cutman-fourth-stripe.mjs: native all3page PPU validation, controlled Right camera trace, raw image/cells.
6. build-cutman-fourth-scroll.mjs: decode new active block, extend atlas with stable old indices, build fullgeometry/scripts/references, assert scenery+sprite equals raw stripe.
7. test-cutman-fourth-scroll.mjs:22source/model checks, unchanged cleanup/guards from accepted prior sources.
8. package-cutman-fourth-scroll.py: ZIP source byte identity, no research JSON/ROM bundled.

Prior packages kept intact for rollback. User confirmed first3connections; this fourth update still requires installation/runtime testing.
