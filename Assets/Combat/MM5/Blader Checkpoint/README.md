# Blader combat checkpoint — GMS 1.4 source/import package

**Source implementation complete for this checkpoint; local GameMaker compilation and playtesting are still required.** The repository contains manually imported GML/resources, not the user's editable GMX project. Nothing is automatically installed into that project. Follow `INSTALL-GMS14.md` on a backup.

## Included

- Nine original Cut Man Blader spawn records, translated into the accepted 3328×2160 multi-stripe stage, script-created as their anchors enter view. No manual enemy placements or fixed spawn timer.
- Original MM1 Blader art and fixed-point pursuit/dive movement. Original one-normal-hit kill threshold (logical HP1), normal/mid shots do1 damage, full charge3 and pierces this weak enemy. Contact damage3.
- MM5 hurt body/flash and initial three stars, facing-based recoil/counter-steering,27 hurt updates then60-count protection. Native renderer's PRE-decrement blink sampling. Ladder hits detach; slide hurt uses crouched terrain handling and returns to slide.
- Original MM5 explosion art, one byte-modulo50 drop decision per completed death; no drop on despawn or route cleanup. Full original five-outcome table including weapon energy and no-item outcomes.
- Health +2/+10 capped28, one bar and one native MM5 cue26 per four active updates. World, shots, hurt/protection, drops, camera and dust freeze; music/HUD stay alive. Final four-update wait is retained, including when the health cap truncates the amount. Full-health pickups are consumed silently.
- Extra life +1 spare life capped9, **MM5 cue24 once per collected extra life**, including at the cap. Not a repeated collision sound.
- Weapon-energy drops still appear and can be collected, but do nothing/play no refill sound while special weapons are deferred. No reroll into health, no Energy Balancer behavior yet.
- Approved MM6 cue35 for accepted normal/mid/full buster impacts. MM5 firing/charging/release and the accepted stage/music/pause layouts are unchanged.
- Safe health0 flow: hide player, stop charge and only the known stage music voice, play original MM5 death1D, original16 death vectors, then retry after the native300-update countdown. Spare lives exclude the current life.

## Explicit adaptations / scope boundaries

This is a hybrid MM1 enemy/MM5 player in rectangular GameMaker geometry, **not an end-to-end 1:1 NES emulator**.

- Drop **selection** is original and all256 byte outcomes are tested. The integrated RNG owner is GMS `irandom(255)`, preserving byte-modulo50 bias, **not** MM5's full carry-dependent RNG history. See the existing pickup report for nominal versus uniform-byte conditional probabilities.
- Original MM1 Blader fallback half-size8×8 maps to MM5 target collision flag0. Original CPU routines give strict combined body/pickup thresholds16×20 (16×13 sliding), shot thresholds11×10/14×14/16×20 for normal/mid/full. Integer centres, not sprite alpha masks. This mapping is explicitly hybrid, not a claim MM5 contains Blader.
- Terrain collision for hurt and pickups adapts the project's existing rectangular solids/one-way ladder tops. The source proof is not certification of every wall corner, slide tunnel or falling room seam in GMS.
- Combat has a defined project order after final player Step AND camera placement: existing enemy AI → shots → completed explosions/drop rolls → contact → pickups → timer sampling → new spawns. That avoids instance-ID ordering races; it is not a claim the two different NES engines share this scheduler.
- **Death/retry adaptation:** this checkpoint restarts at the Cut Man opening when spare lives remain. No-spares returns to the existing title and resets inventory for a new game. Original mid-stage checkpoints and a dedicated Game Over/Continue screen are not implemented or claimed. Test on a backup; no accepted stage coordinates are changed.
- Other enemies, dispenser spawning, active spikes and Cut Man boss combat remain deferred. No score, tank-use changes, special weapons or boss sequence are added.

## Drop selection used by this build

| Result | Byte remainder /50 | Inputs /256 | Chance with GMS uniform byte |
|---|---|---:|---:|
| Small health |3–7|28|10.9375%|
| Large health |8–9|10|3.90625%|
| Small weapon energy |10–13|20|7.8125%|
| Large weapon energy |0–1|12|4.6875%|
| Extra life |2|6|2.34375%|
| Nothing |14–49|180|70.3125%|

These preserve the original byte-modulo bias. The nominal50-bucket table is
10%/4%/8%/4%/2%/72%; a direct50-way random draw would **not** preserve that bias.
Actual original MM5 RNG history is not emulated by this GameMaker random owner.

## Tests and provenance

`test-blader-combat-integration.mjs` executes actual GML scripts/events using a limited syntax and mocked-engine adapter (407 assertions when packaged). Checks include camera ordering, all9 spawn coordinates, projectile inheritance guards, normal/mid/full damage and piercing, exactly-once death/drop/no-drop,27+60 hurt/protection, refill cadence/caps/freeze/own-voice replacement, extra-life cap/sound/once-only collection, deferred ammo, route cleanup, pickup expiry/blink and safe death destinations. **Not GMS compiler, Windows runner, GPU or async-audio validation.**

Independent existing kernel tests execute actual GML against1023 original Blader CPU entry/outcome pairs, all256 original drop-byte outcomes, six recoil inputs and eight refill/cap branches. ROM probes additionally verify30 original contact boundary cases and three shot shapes,12 controlled incoming-state hurt initializations, both native health freeze trials, original art/offsets and four isolated native MM5 sounds. Native artwork uses OAM/CHR/palettes with the project's Mesen colour adapter; every exported effect/body/star pose has an opaque-pixel render match. No redraw.

Primary evidence: `Reference/`, plus original Blader and MM5 pickup reports. The supplied USA ROMs are authoritative. Source navigation uses pinned MM1/mm5 disassemblies; their modified ROMs/executables are never run. In particular, MM1's J-source printed damage addressFEBD is wrong for USA: original USA operand readsFE89 and gives Blader contact3. Original enemy life20 and normal damage20 mean one hit, not20 normal shots.

## Reproduce

Prepare normal original-ROM stage snapshots as documented in `tools/rom-recovery/README.md`, then:

```sh
node tools/rom-recovery/probe-blader-combat.mjs
node tools/rom-recovery/mm5-hit.mjs
node tools/rom-recovery/probe-mm5-hurt-boundaries.mjs
node tools/rom-recovery/probe-mm5-health-freeze.mjs
node tools/rom-recovery/probe-mm5-combat-bounds.mjs
node tools/rom-recovery/recover-mm5-hurt-art.mjs
node tools/rom-recovery/recover-mm5-hurt-stars.mjs
node tools/rom-recovery/recover-mm5-combat-effects.mjs
node tools/rom-recovery/record-mm5-combat-sfx.mjs
node tools/rom-recovery/test-blader-combat-kernels.mjs
node tools/rom-recovery/test-blader-combat-research.mjs
node tools/rom-recovery/test-blader-combat-integration.mjs
python3 tools/rom-recovery/package-blader-combat.py
```

No ROM, disassembly dump, executable or generated emulator state is in the download. Full untrimmed sound takes remain in the repository for research; only selected trimmed WAVs are included in the import ZIP.
