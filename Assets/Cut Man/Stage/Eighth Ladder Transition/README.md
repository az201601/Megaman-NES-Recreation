# Cut Man eighth connection and second horizontal section

Manual **GMS1.4.1760** upgrade from the user-confirmed Seventh baseline. New installation/runtime confirmation pending.

- [ZIP download page](Downloads/mm1-cutman-eighth-ladder-transition-gms14.zip)
- [Complete matched installation steps and test checklist](INSTALL-GMS14.md)

Connects page12's top-left ladder to original **pages13–15**, a three-screen horizontal section, and back through its incoming ladder. World **2048×2160**, opening viewY1920, original180 player startY2100. Prior scene translates down240 unchanged. New stripeX1280–2047/Y0, cameraX1280–1792. Lower camera bounds remain unchanged apart from Y offsets.

**1969 tiles /86 terrain solids /21 ladders /21 tops /13 scripted blocks /2 dispenser instances.** No extra blocks in this stripe. Existing building moves to864,1088; new repeat at1376,128 reuses the same96×80 sprite/object. No duplicate building tiles or spawning. Both60 marked feature cells retained. Atlas128×64/25tiles unchanged, recovery art copies byte-identical. Five script and three camera event replacements, no new resource names or Stage Create/music/player/menu/HUD/arrival/helper/guard changes.

Eighth timing **Up126 /Down95**, old timings retained. Incoming centre1336, next **bottom-right outgoing centre1992 unconnected**. New rightmost ladder/void cannot teleport back to the left incoming room. Do not descend out there yet; death/respawn deferred. Earlier pit1184–1215 nowY1152–1199 still must be jumped. Enemy/cutter AI, damage, pickups/tank effects, death/checkpoints and boss work remain later tasks.

**36 source/model checks pass**, all16 actual GML busy-frame direction cases, fresh readiness, both900-frame controlled horizontal camera captures,8 merged seams, old lower scene translation/widened void,13 scripted blocks,1969 actual tile calls/full reference reconstruction,2 separate buildings/60 feature markers, bounds/coordinate contract/charge/rearm/cleanup. Not a GameMaker compiler/GPU/scheduler/async/with-descendant runtime certification. Follow the installation checklist; don't mix coordinates.

## Native provenance and reproduction

Supplied USA ROM /JSNES2.1.0 /Mesen RGB mapping, not Mesen executable or hardware. Inherited controlled prior lead-ins; once-only page12/X56/Y40 reset/protection100, neutral collision-cache refresh, original Up-only thereafter. Up trigger49/scroll81–140/finish141/bookkeeping174/control175, fresh presses123–125 ignored/126–128 accepted. Down-only fromUp184 without additional patches: trigger14/scroll46–105/finish106/bookkeeping108/control109; fresh92–94 ignored/95–97 accepted. Not natural whole-stage traversal/new comprehensive ASM audit.

Original begin13/end15/order8;2880 tile-ID+palette pairs validated from live nametables. Another controlled Right900/A-once traversal pinsY36/velocity0/protection100 to verify camera/PPU, not actual walk/jump/enemy behaviour. MM5 normal movement/art/charge/menu/climb/animation/edge padding/falling policies remain adaptations; native entry subpixels injected for trace comparisons.

Tools under `tools/rom-recovery`, supplied ROM and ignored prior `.work` snapshots required; no ROM bundled:

1. Prior probes regenerate Seventh's settled `after-continuation.json`.
2. `probe-cutman-eighth-ladder.mjs`: actual outgoing left-ladder controlled entry/original Up.
3. `probe-cutman-eighth-ladder-return.mjs`: Down-only and pre-trigger snapshot.
4. `probe-cutman-eighth-scroll-ready.mjs` and `probe-cutman-eighth-down-ready.mjs`: independent fresh-input acceptance.
5. `recover-cutman-eighth-stripe.mjs`: decode all13–15,2880 nametable pairs,900-frame camera capture.
6. `build-cutman-eighth-scroll.mjs`: accepted Seventh base, second separate building, full old/new pixel assertions, widened lower-right void/geometry, unchanged recovery-art copies.
7. `test-cutman-eighth-scroll.mjs`:36 source/model checks, including earlier direction/camera regressions.
8. `package-cutman-eighth-scroll.py`:14-file ZIP byte/content and unchanged-art audits.

Preserve both feature positions/markers in future builders. Do not re-bake either dispenser or restore stale feature coordinates. Historical Seventh and earlier packages remain for matched rollback.
