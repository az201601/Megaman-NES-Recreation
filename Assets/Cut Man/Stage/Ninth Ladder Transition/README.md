# Cut Man ninth connection — right-hand descent and return

Manual **GMS1.4.1760** update from user-confirmed Eighth. Installation/runtime acceptance pending.

- [GitHub ZIP download page](Downloads/mm1-cutman-ninth-ladder-transition-gms14.zip)
- [Complete matched installation and test checklist](INSTALL-GMS14.md)

Connects the bottom-right ladder of pages13–15 to original page16/room9 and back upward. **No coordinate shift:** world2048×2160, starting viewY1920, original180 player starts2100, all accepted geometry/blocks/buildings stay fixed. New roomX1792–2047/Y240–479, camera1792,240; player1800–2040. Incoming centre1992. Next bottom outgoing centre1896 remains unconnected: do not descend out there yet.

Ninth **Down126/Up126**; older eighth left returnX1336 still95. Camera selects explicit route targets so right descent goes to9, upward return to8, left return to7. Both horizontal runs/earlier transitions preserved.2076tiles/95terrain solids/23ladders/23tops/13blocks/2dispensers. No new blocks/buildings/resources, atlas25tiles128×64 and96×80 sprite unchanged. Five script/three camera event replacements. No Stage Create/music/player/menu/HUD/arrival/helper/guard edits. No new240 shift to room/view/player.

**43 source/model checks pass**:18 actual GML captured busy-frame direction cases, fresh timings, both earlier900-frame horizontal cameras,9 merged seams, identical accepted cell/object/feature coordinates and outside-room pixels,2076 actual tile calls/full reference reconstruction,13blocks/2spritebuildings/60markers, repeated down/up/old-left branch selection, bounds, charge/rearm/cleanup. Not GMS compiler/GPU/scheduler/async/with-descendant runtime certification. Follow checklist; enemies/cutter spawning/damage/pickups/tanks/death/checkpoints/boss work still deferred. Existing pit1152–1199 atX1184–1215 must be jumped; unbuilt exits/falls may need restart.

## Native provenance and reproduction

Supplied USA ROM, JSNES2.1.0, Mesen RGB mapping, not Mesen executable/hardware/natural whole-stage traversal/new comprehensive ASM audit. Inherited controlled lead-ins plus Right900/A-once/Y36/velocity0/protection100 traversal to page15; one placement atX200/Y222, fraction/velocity/pose reset/protection100, neutral cache-refresh frame, original Down-only. Down trigger14/scroll46–105/finish106/bookkeeping139/control140. Up-only from Down184, no further patches: trigger43/scroll75–134/finish135/bookkeeping168/control169. Up capture stops184 before later enemy contact. Fresh presses123–125 ignored/126–128 accepted independently both ways.960 live tile-ID+palette pairs validate page16/room9. MM5 movement/art/climb/animation/edge padding/menu/charge/fall adaptations retained; native entry subpixels injected in comparisons.

Tools under `tools/rom-recovery`, supplied ROM/npm dependencies and ignored prior `.work` snapshots required. No ROM bundled:

1. Prior probes regenerate Eighth `after-continuation.json`.
2. `probe-cutman-ninth-ladder.mjs`: controlled right traverse/outgoing placement, original Down and pre-trigger snapshot.
3. `probe-cutman-ninth-ladder-return.mjs`: Up-only/pre-trigger snapshot, no extra patches.
4. `probe-cutman-ninth-scroll-ready.mjs` / `probe-cutman-ninth-down-ready.mjs`: fresh acceptance probes.
5. `recover-cutman-ninth-room.mjs`: page16/room9,960 paired nametable checks.
6. `build-cutman-ninth-scroll.mjs`: accepted Eighth base without shifts, new room, native/existing-scene pixel assertions, reused recovery art.
7. `test-cutman-ninth-scroll.mjs`:43 actual source/model checks, including old direction/camera captures.
8. `package-cutman-ninth-scroll.py`:14-file ZIP byte/art identity audit.

Preserve both dispenser features and sixty markers in future builders. Do not re-bake buildings, change accepted coordinates unnecessarily, or infer route targets from vertical direction: this route now descends. Historical Eighth package is the matched rollback, with identical room/view/player settings.


## Video-reported camera reset / matched-code safeguard

See [Ninth Transition Repair](../Ninth%20Transition%20Repair/INSTALL-GMS14.md) for the small four-code-resource repair bundle. The repository video shows a scroll followed by a camera reset/player disappearance. A reproduced mixed Eighth-start/Ninth-camera case leaves target0 and causes this reset. Current canonical sources include a per-call901 handshake to reject an older start script with a named error instead of silently resetting. All four camera/start replacements must match; no geometry/coordinate changes. New source checks cover this mixed-version regression and correct post-unlock arrival. Actual installed GML has not been supplied; runtime confirmation remains pending.
