# Flea combat checkpoint — additive after accepted Super Cutter

Manual GMS1.4.1760 package: one original two-pose sprite, one Create+Draw object, five new scripts, one manager Create append, two full central-script replacements. All accepted Blader/Blaster/Super Cutter lines remain; no camera/player/scenery/terrain/menu/audio replacement. No manual room actors.

## Original behavior and deliberate adaptations

Original evidence under `Assets/Enemies/MM1/Flea/Reference/` is included unchanged:215supplied-MM1USA source bytes,2708native AI-entry states across five controlled600-update trials,48hop initializations/both native RNG choices,45landings,499asserted airborne skipped updates; two original opaque-pixel native-render-matched poses. See the enemy research README/probes for controls and limitations; these are not natural stage traversal or GMS/hardware proof.

Original20HP/basic20 becomes hybrid1HP. Normal/mid/full kill, MM5 fullcharge pierces weak targets, approved MM6 successful-hit35 and existing MM5 explosion/one-drop pipeline reused. Native contact2, target halfsize8/8; spring art does not change numeric collision. Original three page8 records map to `(1080,1144)`, `(1112,1112)`, `(1144,1080)`, band960.

Native upward/horizontal speeds:1248/256 and304/256, or1024/256 and768/256. RNG bit0 chooses; re-face at launch only. Gravity64/256 after unobstructed movement, maximum fall12. Initial delay1, then15ground updates after descending landing. Airborne movement/gravity skip shared phase&3==0; grounded waits do not skip. Native terrain contact sets downward speed192/256 for both floor and ceiling, but only descending airborne landing starts the wait. Floor contact during the standing wait does not reset15 every frame.

GMS adaptations are explicit: inherited invisible `obj_stage_solid` rectangles (including removable blocks) and one-way `obj_stage_ladder_top` floors, swept up to1pixel per probe with three8×8-body probes. This is **not a port of the full native MM1 metatile solver or exact edge-geometry certification**. Supports/ceilings/walls/removal fixtures and the actual accepted three spawn supports are tested. Native MM1 collision-edge traces are not presented as fully matched. No terrain/art replacements are needed.

The existing central scheduler retains new-spawn wait-one-update and route cleanup. Shared active `combat_tick` is used as the airborne phase: it freezes during accepted pause/refill/death ownership, rather than introducing a separate actor Step/global real-time clock. Global NES/GMS absolute phase alignment is not claimed. Hop RNG uses one `irandom(255)` byte at each launch and bit0, not original MM1 RNG-history replication. Drops retain accepted independent MM5 mapping/uniform-byte adaptation.

No jump/landing audio is added. The original shared Flea/BigEye AI's cue29 branch is for BigEye/type09 only; native type02trial sound issues were empty. Approved loud effects, charge streams and music0.85 stay untouched.

## Tests and installation status

`test-flea-integration.mjs` runs actual scripts/events through the limited JS/engine adapter. Matches1369native unobstructed transitions,614native grounded transitions and498consecutive recorded skipped transitions (remaining native collision-edge transitions deliberately excluded), including position, velocity, ground/air state and timers. Separate geometry fixtures cover wall stops/ceiling rebound/floor-and-cap landing15/removal; accepted support rectangles are tested at all three anchors. Shared skip phase, spawning/rearm/no duplicates, normal/mid/full kills/weak piercing, killed-before-contact, contact2/slide/protection, one drop, born/route/offscreen/freeze/deflection and built-in-local declaration guards pass.

Base407combat checks and accepted Blaster840state and SuperCutter245state suites pass with the Flea overlay. These are **NOT GMS compiler/runtime/GPU/event-scheduler/audio certification**. Follow INSTALL-GMS14.md, compile and playtest; user-installed acceptance is pending. No editable GMX project is in this repository, so this package does not pretend to modify the installed project automatically.

```sh
node tools/rom-recovery/test-flea-research.mjs
node tools/rom-recovery/test-flea-integration.mjs
FLEA_OVERLAY=1 node tools/rom-recovery/test-super-cutter-integration.mjs
FLEA_OVERLAY=1 node tools/rom-recovery/test-blaster-integration.mjs
python tools/rom-recovery/package-flea-combat.py
```

ZIP includes resource instructions, exact art, GML and non-ROM evidence; no ROM/save-state/disassembly/executable/audio/unused scenery. Manifest+ZIP byte/CRC equality checked. Later enemies, spikes, weapon effects/tanks/upgrades, checkpoint refinements and boss remain outside scope.
