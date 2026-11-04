# Cut Man: first upward connection and return

Manual upgrade for the accepted four-screen opening run in GMS1.4.1760. **Prepared/tested as sources, not yet user-installed/runtime-accepted.**

- [Download ZIP](Downloads/mm1-cutman-first-ladder-transition-gms14.zip)
- [Installation: folders, resources, events, room settings, tests and rollback](INSTALL-GMS14.md)

Scope: original page4 upper room above far-right ladder, upward automatic handoff, downward return. Opening run translated toY240 in1024x480room; view stays256x240. Seven scripts, five camera event files, two prefix snippets. All9Super Arm blocks created by script, including4formerly manual. Existing tileset reused, no artwork/audio imports. Keep existing music/async code, player systems, arrival/HUD and pause integration.

Reference PNGs show geometry, not importable room backgrounds. geometry.json and native-*.json are research/testing data, not GameMaker resources. Next outgoing ladder, enemies/combat, pickups/tank use, death, boss and rewards remain unimplemented.

## Evidence / reproduction

Using already supplied MM1 ROM and JSNES2.1.0 (not execution of Mesen), tools/rom-recovery:

1. probe-cutman-first-ladder-scroll.mjs: controlled entry + original Up trace; saves pretrigger/settled snapshots.
2. probe-cutman-first-ladder-return.mjs: Down-only original return from settled upper state.
3. probe-cutman-scroll-ready.mjs: independently fresh Up atages123..128 proves control unlock126, not125.
4. recover-cutman-upper-room.mjs: upper page4/room28 terrain decode,960tile/palette comparisons against native nametable.
5. build-cutman-first-scroll.mjs:590tiles,27solid rectangles,8ladder volumes,7tops and9blocks; validates existing13tile atlas identical; no new atlas export.
6. test-cutman-first-scroll.mjs:11checks including actual camera GML trajectories vs native up/down traces every busy frame, charge/rearm/cleanup, source geometry and actual tile-call reconstruction.
7. package-cutman-first-scroll.py: ZIP contents/source byte-identity audit.

Transient research inputs live in ignored.work and supplied ROM location used by tools; not shipped. Reproduction needs prior opening recovery/snapshots/dependencies. No ROM included. Modified external mm1base disassembly labels assist research; trace evidence is original USA execution. No newly asserted comprehensive disassembly byte audit. Native trace lead-in is controlled, NOT natural whole-stage traversal.

Schedule:32hold +60scroll +33posthold +1bookkeeping; busyages0..125, control126. MM5 ordinary climb speed/art/cadence remain adaptations. Captured native entry positions injected into actual camera source for trace comparisons; MM5 entry subpixel differences naturally produce different final anchors. Falling return is controller adaptation, not independent native replay certification. JS engine mocks are NOT GameMaker compiler/GPU/scheduler/with-iteration/async certification. See installation guide for runtime checklist and limits.

Regressions passed: accepted opening route/camera model, pause-stage16checks, isolated pauseUI and Blader1023update model. These do not replace user runtime testing. No score/CLEARPOINTS added.
