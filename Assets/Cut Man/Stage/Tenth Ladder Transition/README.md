# Cut Man tenth connection — page17 and upward return

Manual **GMS1.4.1760** upgrade from the confirmed Ninth connection + camera repair. Installation/runtime acceptance pending.

- [ZIP download page](Downloads/mm1-cutman-tenth-ladder-transition-gms14.zip)
- [Complete resource/event installation and test checklist](INSTALL-GMS14.md)

Connects page16's bottom ladderX1896 to original page17/room10, and back. New roomX1792–2047/Y480–719, camera1792,480, player1800–2040. **Down126 /Up95**, independently measured; earlier directions retain their timings. Next bottom-left outgoingX1832 remains unconnected. No coordinate shift: room2048×2160, openingview1920/player2100 for original180, all accepted scenery/blocks/buildings fixed.

**2196tiles /102terrain solids /24ladders /24tops /13blocks /2dispensers /10spike objects.** Spikes recovered from native class3 as one16×16 transparent Sprite `spr_mm1_cutman_spike`, scripted non-solid artwork Object `obj_mm1_cutman_spike` with Create only. **No spike damage/death yet.** Native terrain beneath stays separate; spikes are not baked into scenery. Two on upper platform2000/2016,Y528; eight along floor1920–2032,Y688. New Sprite/Object must be created before updated feature-script compilation.

Five existing scripts +three camera events +new spike Create event. Retains explicit targets and video-repair safeguards; version1001 rejects older Ninth901 starts instead of silently resetting tosection0 or using wrong origin/timing. No Stage Create/music/async/player/charge/menu/HUD/arrival/helpers/guards edits. Existing atlas25tiles128×64 and dispenser96×80 recovery copies unchanged.

**48 source/model checks pass**:20 actual GML native direction captures/fresh inputs, both earlier900-frame camera captures,10 merged seams, old accepted positions/outside-room pixels,2196 actual tile calls+13blocks+2buildings+10spikes/full reference, native spike pixels, post-unlock video regression/mismatch detection, repeated10Down126/Up95→9Up126→oldleft95, charge/rearm/cleanup. Not GMS compiler/GPU/scheduler/async/descendant runtime certification. Existing pit/unconnected exits may require restart; enemies/cutter spawning/damage/pickups/tanks/death/checkpoints/boss remain deferred.

## Original reference and reproduction

Supplied USA ROM, JSNES2.1.0, Mesen RGB mapping; not Mesen executable/hardware/natural whole-stage traversal/new comprehensive ASM audit. Inherited controlled lead-ins; once-only page16/X104/Y222 fraction/velocity/pose reset/protection100, neutral collision-cache frame, then original Down-only. Up-only fromDown184 without extra patches. Down trigger14/scroll46–105/finish106/bookkeeping139/control140, fresh123–125 ignored/126–128 accepted. Up trigger50/scroll82–141/finish142/bookkeeping144/control145, fresh92–94 ignored/95–97 accepted.960 live tile-ID+palette pairs validate page17/room10. Native class3/raw196/palette1 ten spike cells share identical art; cyan converted to alpha without repainting. MM5 normal physics/art/climb/animation/edge padding/menu/charge/fall adaptations retained; native entry subpixels injected for trace comparisons.

Tools under `tools/rom-recovery`; supplied ROM/npm dependencies and ignored prior `.work` snapshots required, no ROM bundled:

1. Prior probes regenerate Ninth settled `after-continuation.json`.
2. `probe-cutman-tenth-ladder.mjs`: controlled outgoing placement, Down/pre-trigger snapshot.
3. `probe-cutman-tenth-ladder-return.mjs`: Up-only/pre-trigger snapshot.
4. `probe-cutman-tenth-scroll-ready.mjs` / `probe-cutman-tenth-down-ready.mjs`: independent fresh input at correct ages95/126.
5. `recover-cutman-tenth-room.mjs`: page17,960 paired live nametable checks.
6. `build-cutman-tenth-scroll.mjs`: unchanged accepted Ninth geometry/features, new room, sprite extraction/ten-cell identity, no spike tiles, pixel assertions, unchanged recovery art. Camera sources are tracked alongside generated geometry scripts.
7. `test-cutman-tenth-scroll.mjs`:48 source/model checks, includes historical video case from pinned1cf4f20 GML and older captured directions/cameras.
8. `package-cutman-tenth-scroll.py`:16file ZIP,9GML/2guides/2references/3PNGs, source/art identity audit.

Future builders must retain two dispenser features/60markers AND ten spike features/markers, not re-bake either kind or lose scripted placements. Preserve confirmed camera repair and correct target/origin/timing per direction. Rollback uses repaired Ninth matching8GML with identical room/view/player settings.
