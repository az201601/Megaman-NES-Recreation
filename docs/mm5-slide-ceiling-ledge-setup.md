# Combined slide/ceiling/ledge correction — GMS1.4.1760

## Scope / status

User approved proceeding after ROM measurement contradicted crouched-fall fallback. This checkpoint changes only support-loss release and a scoped existing-overhead probe grace. Low-ceiling grounded slide extension is unchanged. Current standing-reference Y/feet12, tested ordinary movement, Draw, assets and audio remain unchanged. It follows the measured end-slide/normal-air decision, NOT native frame-perfect Y restoration, early fall velocities or local metatile horizontal correction. See mm5-slide-ceiling-ledge-observations.md. User installation and combined-case runtime validation pending.

## Install

Back up the project. Files are supplied via GitHub in mm5-slide-overhang-fix.zip under Assets/Mega Man/MM5/Controller/Downloads.

1. Objects > Player > MM5 > obj_mm5_megaman > Create > Execute Code: append `slide_overhang_fall = false;`. Do not replace existing variables.
2. Scripts > Mega Man > MM5 > scr_mm5_player_slide_step: replace entire script with same-named updated GML.
3. Scripts > Mega Man > MM5 > Collision: replace entire scr_mm5_player_wall_blocked and scr_mm5_player_wall_limit with supplied GML. Do not change scr_mm5_player_can_stand or scr_mm5_player_supported.
4. Player Step > Step > Execute Code: insert the exact contents of obj_mm5_megaman_step_slide_overhang_reset_insert.gml immediately before `// VISUAL SELECTION`. Existing complete Step source is synchronized as reference; do not append that entire file. No other Step edits. No Draw changes.

The flag is set only by an unsupported slide whose tall body overlaps terrain. Only the upper normal wall probe (-9) can be ignored, and only when already inside that SAME overhead solid at the current X and the solid ends above reference Y. New upper contacts, middle/feet probes and body walls still block. The helper guard requires not-grounded and non-rising. Flag clears on landing/clearance/rising or next slide entry. It is not general invulnerability/noclip and does not skip floor collision. Normal helper results with flag false match pre-change sources over regression grid.

## Temporary room test

Ensure older temporary obstacles are removed. Rooms > Cut Man > Stage > rm_mm1_cutman_stage:
- One temporary obj_stage_solid at16,160. ONLY its instance Creation Code: image_xscale=4;image_yscale=1 (64x16 platform).
- Another at48,128. ONLY its instance Creation Code: image_xscale=4;image_yscale=1 (64x16 overhanging roof).
- Existing player room instance at32,148.
- Keep floor192, permanent roofs, ladders and Super Arm objects unchanged. F2 displays temporary geometry.

Slide right from platform, release Down/Space and directional input: on loss of support switch to air pose, stop automatic slide-speed X movement, fall to original floor and play one ordinary landing sound. May overlap roof visually briefly during normal-air transition as in measured ROM; must not remain slide-pose until full headroom.

Repeat with Right held: normal airborne movement (walk_speed1.296875), no global-bbox sideways ejection/teleport. Repeat with Left after release: likewise no teleport; actual platform side may legitimately limit retreat. Normal walls must remain solid. No upward bounce and no automatic re-slide after landing.

Afterward delete ONLY both temporary instances and restore player48,180. Regression-check open-floor slide, open-ledge fall, normal jumping/walls, grounded low tunnel, and full ladders. No claim of runtime success until user reports it.

## Local checks

slide-ceiling-ledge.mjs passes four original-ROM controlled-terrain cases. slide-gml-model.mjs executes actual slide GML, ordinary-physics Step tail, standing/support and both wall helpers with mocked GMS APIs; verifies neutral/Left/Right combined falls, no sideways ejection, safe landing at180, exactly one land sound, grace lifetime, preserved side/new-upper collision, normal helper equivalence with grace disabled and all prior basic slide/tunnel/open-ledge assertions. Not a GMS compiler or runtime substitute.
