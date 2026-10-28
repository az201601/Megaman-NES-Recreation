# Hybrid recreation — player-system direction

## User requirements

- Keep the current MM1 title, stage select, Cut Man intro and Cut Man first-screen work.
- Use Mega Man 5 as the reference for the upcoming player/arrival system, with the exact scope of arrival versus general movement still to be confirmed.
- Later add MM5-style charged buster and sliding.
- Later replace the small/large health pickups and small/large weapon-energy pickups with MM5 artwork.
- Use MM5's post-hit invulnerability/hazard interaction rules rather than copying MM1's spike interaction. Verify the actual MM5 behaviour before implementation; do not assume all hazards respect ordinary damage invulnerability.
- Include required audio alongside each implemented feature; retain organised resource folders and game-specific asset prefixes.
- No score/points system.

## Reference availability

The initial check on 2026-10-28 found only MM1. After the user committed their upload, a second check found `Mega Man 5 (USA).nes` on GitHub main. Retrieved that file into the current working branch without switching branches or altering existing work. Validated the iNES header: 524304 bytes, mapper4 (MMC3). The reference is now available. Initial MM1/MM5 post-hit ROM measurements are recorded in `docs/post-hit-rom-observations.md`, with reproducible probes in `tools/rom-recovery/`. Ordinary body contact, recoil/facing, counter-steering and spike rules have been tested; an independently identified enemy-projectile replay and the full movement-state matrix remain outstanding.

## Current work / integration boundary

MM1 arrival graphics/audio under Assets/Mega Man/Arrival and Assets/Audio/Mega Man/Arrival are provisional reference work, not a completed or installed player controller. Keep those assets; do not delete them merely because the reference system changes. Do not integrate the provisional MM1 controller/arrival behavior while building the requested MM5 player system.

Keep working scene geometry and stage music unchanged. Geometry markers are not proof of MM5 player fit: revalidate collision extents, ladder alignment and exit behaviour against the new player reference. Super Arm blocks must remain removable object collision, not permanent terrain.

## Observation checklist with MM5 available

1. Arrival/READY presentation, timing, materialisation poses and audio; establish which presentation pieces the user wants to replace.
2. Walk acceleration/top speed/stopping/turning, jump trajectory, variable jump release, falling and landing.
3. Stable player collision dimensions and reference origin; roof edges, ceilings, ladder entry/exit and ladder tops.
4. Normal enemy/body/projectile contact during hurt flashing; knockback, recovery, flashing and invulnerability durations.
5. Spike contact with and without active hurt invulnerability, including falling onto spikes after knockback. Check pits and other instant-death cases separately rather than treating every hazard as normal damage.
6. Later: slide entry/duration/speed/mask, low-clearance exit and interrupted-slide behaviour.
7. Later: charge thresholds, charge visuals/audio, release projectile dimensions/damage/limits, and what damage/weapon changes do to the charge state.
8. Later: MM5 pickup sprites, animation frames, sizes and pickup sounds; do not silently change refill amounts merely because artwork changes.

MM1 enemy contact and spike contact need not share the same invulnerability rule. Describe observed rules, not an unverified claim that the original is broken. Implement a central damage/hazard decision path once measured so enemy damage and instant-death hazards cannot accidentally bypass or conflate the intended MM5 rules.
