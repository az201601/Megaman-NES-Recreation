# Blaster gameplay checkpoint

Additive manual GMS1.4.1760 package building on accepted Blader combat and accepted louder audio. **Source/resource package ready; user import/compilation/gameplay acceptance pending.** Read INSTALL-GMS14.md; do not overwrite current resources from older packages.

- Original11 cannon records mapped to accepted stage stripes; four type/facing/stagger variants modeled.
- Original four-shot cycle,32-update separation, default velocities556/256 and783/256 horizontally with signed vertical556/256 and104/256; original body1/bullet2 contact amounts and shell2×8/bullet1×1 half extents.
- Approved silence-trimmed live MM1 firing cue and approved MM6 blocked-hit ding, both already at accepted2x gain. Existing loud MM6 successful-hit sound is reused, not replaced.
- Closed hits block/deflect without damage/drop; exposed cannon dies to normal/mid/full; full pierces. Existing MM5 explosion/drop/pickup/hurt/refill/pause/death machinery reused.
- Same camera-End-Step combat owner; no new actor Step or manager End Step. No manual room placement. Only two existing script replacements and two Create appends; no player/camera/route/music/pause edits.

Native evidence: `Assets/Enemies/MM1/Blaster/Reference/native-blaster-gameplay.json`.600updates×4 controlled variants;2396successive AI transitions and1689 successive projectile-position deltas match independent model. Variant defaults are read from bank6, NOT bank5 (identical CPU addresses map different data). OriginalAI143bytes independently matched suppliedUSA earlier. Enemy hull/damage tables are originalUSA fixedbank, not guessed from artwork.

Actual-GML mocked integration matches840recorded variant states and tests paths/hits/deflection/drop/contact/slideedges/spawns/freeze/cleanup. Existing407Blader checks pass both with and without overlay. These are not GMS compiler/Windows runner/GPU/event/audio certification. Detailed local checklist and adaptations are in installer. No spike damage, dispenser spawning, new checkpoint UI, E-tank or Cut Man fight is included.
