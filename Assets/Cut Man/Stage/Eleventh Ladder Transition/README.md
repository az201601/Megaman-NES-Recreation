# Cut Man eleventh connection — two-screen closed-gate approach

Manual **GMS1.4.1760** update from user-confirmed Tenth. New installation/runtime acceptance pending.

- [ZIP download page](Downloads/mm1-cutman-eleventh-ladder-transition-gms14.zip)
- [Complete installation and runtime checklist](INSTALL-GMS14.md)

Page17 bottom-left centre1832 descends to original **pages18–19**, with upward return. **Down126/Up95**. New stripeX1792–2303/Y720–959, cameraX1792–2048,Y720, player1800–2296. **Room width2048→2304 only**; height2160, startingview1920 and player2100 for original180 remain unchanged. No vertical geometry shift; all accepted positions/pixels outside the new stripe unchanged.

**2354tiles /106terrain solids /24ladders /24tops /17scriptedblocks /2dispensers /10spikes /1closed gate.** Four native page18 blocks added; old13 unchanged. Existing spikes still artwork-only and dispensers inert. Gate is a new32×64 Sprite `spr_mm1_cutman_boss_gate_closed` and Object `obj_mm1_cutman_boss_gate`, scripted at2272,816. Parent `obj_stage_solid`, explicit full sprite mask, static Create/depth999; no extra invisible collision. Gate remains **closed**, no opening/passage/boss room or AI yet. This endpoint obstruction is an adaptation, not certified native gate behaviour.

Existing Background atlas **must be updated**: still128×64 but28populated tiles (old25 preserved,3native gate-wall tiles appended). Do not mistake unchanged dimensions for unchanged image. Five script/threecameraevent replacements +newgateCreate; protocol1101 preserves explicit targets/version safeguard and rejects stale Tenth1001/Ninth901 starts. No Stage Create/music/async/player/menu/HUD/arrival/helper/guard edits. No extra geometry calls/manual objects.

**55 source/model checks pass**, all22 actual GML captured direction cases/fresh readiness, prior900+900 and new263 camera frames,11seams, unchanged accepted scene/positions/widened cyan void, old25atlas identity,2354actualtilecalls/fullpixelreconstruction with separate blocks/spikes/buildings/gate, gate artwork/mask assignment, repeated branch targets/timing, prior video/mismatch/post-unlock regressions, charge/rearm/cleanup. Not GMScompiler/GPU/scheduler/async/descendant/mask/collision runtime certification. Follow checklist; user confirmation required. Death/respawn, spike damage/MM5 invulnerability, enemies/cutter spawning/pickups/tank effects and boss work remain later tasks.

## Native source / reproduce

Supplied USA ROM, JSNES2.1.0, Mesen RGB mapping; not Mesen executable/hardware/natural whole-stage traversal/new comprehensive ASM audit. Inherited controlled lead-ins; one page17/X40/Y222 fraction/velocity/pose reset/protection100, neutral collision-cache frame, then original Down-only. Up-only fromDown184, no further patches. Down trigger14/scroll46–105/finish106/bookkeeping139/control140; fresh123–125 ignored/126–128 accepted. Up trigger50/scroll82–141/finish142/bookkeeping144/control145; fresh92–94 ignored/95–97 accepted. Original begin18/end19/order11.1920 live tile-ID+palette pairs validated; controlled263Right/A-once/Y36/velocity0/protection100 capture stops at camera maximum before gate operation. MM5 art/normal movement/climb/animation/edge padding/menu/charge/falling adaptations retained; native-entry subpixels injected for trace comparisons.

Four kind2 page18 records supply blocks1824,848/1856,848/1856,880/1888,880. Kind3 page19 X224/Y96→wrappedX0/Y160 supplies32×64 gate. Eight class0 gate cells and16block footprint cells excluded from scenery. Native512×240 art exactly reconstructed with objects; no duplicated scenery/permanent terrain behind them. Other class1 gate-wall scenery stays native tiles/terrain.

Tools under `tools/rom-recovery`, supplied ROM/npm deps/prior ignored `.work` snapshots required, noROM bundled:

1. Prior probes regenerate Tenth settled `after-continuation.json`.
2. `probe-cutman-eleventh-ladder.mjs`: controlled outgoing placement/Down/pre-trigger.
3. `probe-cutman-eleventh-ladder-return.mjs`: Up-only/pre-trigger.
4. `probe-cutman-eleventh-scroll-ready.mjs` / `probe-cutman-eleventh-down-ready.mjs`: independent95/126ready tests.
5. `recover-cutman-eleventh-stripe.mjs`: two pages1920pairedPPUchecks and263camera rows, no gate activation.
6. `build-cutman-eleventh-scroll.mjs`: accepted Tenth base unchanged; native block/gate records, sprite extraction/atlas append, full old/new pixel assertions, no object tile duplication. Camera GML tracked alongside geometry.
7. `test-cutman-eleventh-scroll.mjs`:55source/model checks, including pinned pre-repair video regression and older traces.
8. `package-cutman-eleventh-scroll.py`:17file ZIP,9GML/2guides/2references/4PNGs, byte identity/reused-art audits.

Preserve all object features/markers and closed-gate collision ownership in future builders. The next route step is gate opening/passage, not another outgoing ladder. Revert with Tenth matching scripts/events/atlas and width2048; no vertical rollback needed.
