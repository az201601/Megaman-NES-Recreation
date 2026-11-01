# Octopus Battery / Suzy — original-ROM research checkpoint

**Research and recovered art only; not a gameplay installer.** The user accepted Flea as working (“very good.. it all works”), then authorized research of this next original enemy. Preserve installed Blader/Blaster/Super Cutter/Flea. This research directory itself changes no combat, camera, terrain, player, pause or audio resources. A subsequent additive gameplay package is now prepared separately at `Assets/Combat/MM5/Octopus Battery Checkpoint/`; use its INSTALL-GMS14.md rather than importing this research directory as an installer. User GMS compile/runtime acceptance is pending.

## Verified behavior

- Native type04 moves vertically, type21(hex)/33(decimal) horizontally. Original Cut Man records contain **16 total:6vertical,10horizontal**, on native pages9–12. First encounters after the Fleas: page9X72/Y168 andX104/Y104 vertical, thenX184/Y136 horizontal. Record indices21/22/23 are not instance slots; the first observed slots are16/18/19 in this controlled approach.
- Speed **2 pixels per enemy update**, along the assigned axis. No gravity, homing, proximity launch or Flea-style quarter-update skip. Walls/floors/ceilings define the endpoints; they are not an invented fixed chase distance. First vertical trace spansY167..185; first horizontalX2391..2489 in original world coordinates. These are measurements of these particular corridors, not universal hard-coded travel ranges.
- On endpoint contact with delay0, start closing and choose **63 or126 updates** using native RNGbit0. Timer begins decrementing on the next update; expiration reverses direction and starts opening. Both delays and multiple reversals occur naturally in both1000-update trials. Native movement/collision runs before this timer/state logic; the enemy keeps its intended axis velocity while pressing against the endpoint.
- Native animation byte: phase0=open,1=closing/half-eye,2=closed,3=opening/half-eye. Open/closed stable phases reset the low nibble; transitions run native low values0..8 before advancing/wrapping. The displayed transition thus includes9updates, not a guessed smooth fade. Movement starts away from the wall when reversed; it does not wait until the eye looks completely open.
- **Closed eyes do not block normal shots.** Eight controlled actual-collision trials (four animation phases for each movement type) all run original hit/damage code and reduce20HP→16. Do not reuse Blaster's closed-shell block, deflection or ding. Each projectile was created through native B, then relocated for a documented controlled overlap; these are not natural aiming recordings.
- Native20HP/basic damage4 means **five normal hits**. This threshold is derived from initialized HP/table plus measured normal impact/subtraction, not a recorded five-shot natural kill. Contact damage **4**, collision halfwidth/height **7/7**. MM5 charged damage will be a separate hybrid adaptation; MM1 has no charge shot.
- **No movement/endpoint sounds** were requested at C477 or opcode-qualified9003 in either1000-update movement trial. Original impact sounds observed during the separate impact experiments are not replacement audio deliverables; retain the user's approved MM6 successful-hit cue when integrating.
- Three native16×16 poses recovered: open, half, closed. Strip order0/1/2, phase-to-pose0/1/2/1, origin8,7. Each composed pose independently matches opaque native-render pixels. No invented eye art, procedural animation or recoloring.

## Evidence, controls and limits

`Reference/native-octopus-battery.json` contains supplied MM1USA SHA256,295checked ROM bytes. **286bytes exactly match pinned mm1base source**; three3-byte table-load instructions have different USA operands from the J-derived source. Those three USA instructions are separately asserted and annotated with sourceHex; they are not falsely counted as exact source matches. USA tables are FC06/FAB5/FB83 at these operand sites, not source FC3A/FAE9/FBB7. Pinned label source: TheRealQuantam/mm1base@9c1cb05bd1d63c176e1930053dda76bcb85cd977; modified source ROM is never executed.

Reproducible controlled firstFlea frame-boundary snapshot from probe-flea-gameplay.mjs; Right approach pins playerY36/verticalspeed0/protection100 until the original first vertical and horizontal spawns. Trials start at frame boundaries, before each first AI entry. Original enemy/terrain/RNG/spawn/sound code is unmodified. PlayerX=originalanchor−64/Y36/verticalspeed0/protection100 each update, neutral inputs. Two1000-update trials yield1999AI entries and1996consecutive model-checked transitions. Independent AI/timer/reversal/graphics model takes **recorded native wall-contact flags** as inputs: this is not an independent terrain solver, unassisted traversal, hardware proof or GMS implementation.

Eight separate impact trials begin from the same native snapshots. PlayerX follows enemyX−64 atY36/protected; original B creates a normal bullet. Only that bullet is relocated onto the enemy for its first eligible native TestShotHit pass, respecting alternating enemy-slot parity. No enemy HP/flags/state changes are injected. Actual native hit registration then generic damage subtraction runs, including closed-eye phases. Exclude these projectile controls from claims of natural aiming/combat or movement sound silence.

`Reference/native-octopus-battery-art.json` stores live OAM tile/attribute composition and RGBA hashes. Art recovered from the first horizontal snapshot so all3poses fit in the view (the first vertical's initial open rendering is clipped at the right edge). JSNES2.1.0 with Mesen0.9.9RGB conversion only, not Mesen.exe. Original symmetry/flipped quadrants preserved. No ROM/disassembly dump/emulator state distributed.

## Reproduce / next work

Requires supplied ROM, pinned bank5/bank7 source-label dumps, ignored fourth-ladder snapshot and `.work/flea-before-first-ai.json` regenerated by probe-flea-gameplay.mjs. Probe writes ignored `octopus-4-spawn.json` and `octopus-33-spawn.json`.

```sh
node tools/rom-recovery/probe-octopus-battery.mjs
node tools/rom-recovery/recover-octopus-battery-art.mjs
node tools/rom-recovery/test-octopus-battery-research.mjs
```

Subsequent source integration, mapped16records and manual ZIP/installer are now prepared under `Assets/Combat/MM5/Octopus Battery Checkpoint/`. Its tests separately document measured GML terrain/state matches and explicit project adaptations. **Prepared source/package is not GMS compilation or user-installed runtime acceptance.**
