# Cut Man third ladder connection + return

Manual GMS1.4.1760 upgrade from user-accepted Second Ladder Transition. **Prepared sources; new installation/runtime acceptance pending.**

- [ZIP download page](Downloads/mm1-cutman-third-ladder-transition-gms14.zip)
- [Exact resource/event/room installation guide](INSTALL-GMS14.md)

Adds original page6/room29 above page5.1024x960world, openingY720, pages4/5/6 atY480/240/0.899tiles,44solid rectangles,13ladders,12tops,9scriptedblocks. Existing13tile atlas reused byte-for-pixel; no art/sound imports. Four existing script replacements and three camera event replacements; no stageCreate/player/guards/pause/HUD/arrival changes. Top-left outgoing ladder remains UNCONNECTED.

## Original evidence and boundaries

Original MM1 USA in JSNES2.1.0, not Mesen execution/hardware. Controlled one-time placement on actual page5 outgoing ladder X216,Y40, fractions/velocity reset and protection100, then original Up-only. Inherits controlled first/second lead-ins; not natural whole-stage traversal. Third Up trigger25, scroll57..116, finish117, bookkeeping150, first accepted input151(age126). Third Down-only from Up frame160 (early settled state, avoids lingering into incidental native enemy contact): trigger14, scroll46..105, finish106, bookkeeping108, normal input109(age95), no further patches.

Independent freshUp123..125ignored/126..128accepted; freshDown92..94ignored/95..97accepted.960tile IDs and corresponding palettes validated against even native nametable for page6. No comprehensive new routine byte-audit claim. Ordinary movement/art/climb/animation/edge-padding remain MM5 adaptations. Falling return is inherited controller adaptation, not independently native replay-certified.

All six actual cameraGML trajectories compare every busy frame with original captures.17source/model checks include accepted lower-layout preservation except240translation, three merged seam ladders,899actual tile-call reconstruction, all9blocks, charge release/rearm/cleanup, bounds and fresh ready95fire. Tests use JS engine mocks; NOT GMScompiler/GPU/scheduler/with-descendant iteration/async runtime certification. User checklist required. Previous first/second connections retained and checked; no enemies/combat/damage/pickups/tank use/death/boss/score added.

## Reproduce

Tools under tools/rom-recovery, supplied ROM already present, `npm ci` there. Inputs/work products under ignored.work, no ROM bundled:

1. Prior first/second recovery probes regenerate settled snapshots (see prior package READMEs).
2. probe-cutman-third-ladder.mjs: controlled Up, before-trigger and settled frame160 snapshots.
3. probe-cutman-third-ladder-return.mjs: Down-only trace and pretrigger snapshot.
4. probe-cutman-third-scroll-ready.mjs / probe-cutman-third-down-ready.mjs: independent fresh-input probes.
5. recover-cutman-third-upper-room.mjs: native960tile/palette validation and upper cell/raw image decode.
6. build-cutman-third-scroll.mjs: translate accepted content, match new art exactly to existing atlas, geometry/blocks/scripts/reference build.
7. test-cutman-third-scroll.mjs:17source/model checks; uses unchanged prior helper/cleanup sources as installed project does.
8. package-cutman-third-scroll.py: ZIP/source byte-identity audit. Research JSON/PNGs are not imported resources.

Historical packages remain intact for rollback. Regressions: first and second scroll tools, opening route, pause-stage16/UI, Blader1023update model. User has accepted BOTH prior connections; this third checkpoint still needs installation/runtime feedback.
