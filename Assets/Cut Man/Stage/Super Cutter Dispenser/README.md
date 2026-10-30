# Separate Super Cutter building from scenery

User requested interactive dispenser building be sprite/object rather than scenery. Focused correction after Fourth Ladder Transition, not enemy implementation.

- [ZIP download](Downloads/mm1-cutman-dispenser-separation-gms14.zip)
- [Exact resource/folder/event installation](INSTALL-GMS14.md)

One96x80sprite, one visible non-solid/no-parent object (Create depth999/frame0), one features placement script; replace existing tile script and add one stageCreate call, preserving music. Buildingworld864,128.30duplicate tiles removed,1177remaining; ten separate blocks/collision/camera/room/player/pause unchanged. Existing atlas retained; unchanged128x64Fourth atlas PNG now included for missing/misnamed Background recovery (see guide step0). No manual object placement. No cutter spawning yet; dedicated cutter behaviour/sprites/projectiles/damage deferred to hazard pass.

Original artwork copied pixel-for-pixel from previous native-decoded reference; converts previously background-rendered artwork to sprite as authorised, no claim entire building was a native OAM sprite. Building cells are class0; no invented terrain solidity. Model executes actual tile/features/Create source, reconstructs whole1536x1200reference using1177tiles+10blocks+onebuilding, exact pixels. No GMScompiler/GPU/scheduler/runtime certification. Fresh user acceptance pending.

Reproduction: `node tools/rom-recovery/build-cutman-dispenser-separation.mjs`, then `node tools/rom-recovery/test-cutman-dispenser-separation.mjs`, then `python tools/rom-recovery/package-cutman-dispenser-separation.py`. No ROM or transient inputs needed: published Fourth data/atlas/reference used. Historical Fourth package remains intact for rollback. If rebuilding from original Fourth tool, apply this correction AFTER it.

**Future route extension:** use this folder's geometry.json as corrected base, or apply its30tile exclusion explicitly. Preserve `features` collection and cells'feature markers. When shifting the route, translate existing feature positions together with scenery and generate updated features script. Do not silently copy old Fourth placements and re-bake building into tiles, omit its object or leave sprite at stale worldY. geometry/separation JSON are research metadata, not GameMaker imports. Fourth original-source tests remain historical baseline; correction test accounts for sprite substitution.
