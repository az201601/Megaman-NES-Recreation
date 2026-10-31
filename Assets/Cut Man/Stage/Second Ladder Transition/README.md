# Cut Man second ladder connection + return

Incremental manual GMS1.4.1760 upgrade from user-accepted First Ladder Transition. **Source ready; user installation/runtime acceptance pending.**

- [Download ZIP](Downloads/mm1-cutman-second-ladder-transition-gms14.zip)
- [Installation guide: exact existing resources/events/settings](INSTALL-GMS14.md)

Adds original page5/room31 above page4. World1024x720, opening atY480, first upper roomY240, new roomY0.710tiles,34solid rectangles,11ladders,10tops,9scriptedblocks. Same13tile atlas, no graphics/audio imports. Seven replacement GML files, zero new resources, no stageCreate/player/pause changes. Previous helper/cleanup/guards remain installed.

Original-ROM evidence: Up trigger25/scroll57..116/finish117/control151 (age126); Down trigger32/scroll64..123/finish124/control127 (age95). Independent fresh Up/Down probes verify unlock ages, not inferred from stripe flags. Return has2settled frames, not first connection's33. Previous connection remains126both directions.960native tile+palette pairs validate new room via odd nametable. Controlled ladder placement and prior controlled lead-in, NOT natural whole-stage traversal. MM5 art/climb/controller retained adaptations; falling entry not independent native replay certified.

Tools under tools/rom-recovery, in order:

1. mm1-hurtwalk.mjs and probe-cutman-first-ladder-scroll.mjs regenerate prerequisite snapshots (supplied ROM, ignored.work, npm dependencies).
2. probe-cutman-second-ladder.mjs (one-time controlled placement + Up original execution).
3. probe-cutman-second-ladder-return.mjs (Down-only, no further patches).
4. probe-cutman-second-scroll-ready.mjs and probe-cutman-second-down-ready.mjs (independent fresh-input probes).
5. recover-cutman-second-upper-room.mjs (native960tile/palette comparisons, raw art/cells).
6. build-cutman-second-scroll.mjs (translated accepted geometry, upper art matched to existing atlas, merged seam ladders, script/reference build).
7. test-cutman-second-scroll.mjs (15source/model checks, actual camera GML every busy frame both connections/both directions, short return/charge/bounds/geometry/710tile reconstruction). Falls back to accepted prior unchanged helper source in tests, as installed project does.
8. package-cutman-second-scroll.py (ZIP byte identity).

Regression tools: test-cutman-first-scroll.mjs, test-cutman-opening-package.mjs, test-pause-stage.mjs, test-pause-ui.mjs, test-cutman-blader.mjs. No ROM bundled. Reference PNGs/data are NOT GameMaker imports.

Tests use JS engine mocks, not GMS compiler/GPU/scheduler/async/with-loop certification. User runtime checklist in installation guide. Next outgoing ladder, enemies/combat, pickups/tank consumption, death/checkpoints/boss/reward remain undone. No score. Keep accepted baseline music/charge/HUD/pause/arrival systems.
