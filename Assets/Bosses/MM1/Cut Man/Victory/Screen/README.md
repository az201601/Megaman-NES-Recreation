# Custom Rolling Cutter weapon-get screen — first visual draft

Not appearance-approved, installed, animated or complete. No partial installer.

This is the **reveal/name-card state**, not the later weapon demonstration.
Native logical size256x240, with a4x nearest-neighbour review image. Adaptation:

- MM6 pipe/window frame art, rearranged into shorter top/bottom bands and recoloured
  blue/steel. Custom inset Cut Man/weapon-acquired nameplates. This palette/layout
  is custom, not asserted to be original MM6 colours or timing.
- Original MM6 large Mega Man from a controlled original award scene. The figure
  is background-rendered, NOT an OAM actor: native rendered64x96 region at176,72
  isolated against the original black backdrop.1632 nonblack pixels preserved and
  individually checked against native rendering. Black backdrop becomes alpha.
  No generated/repainted character pixels; the native blue reveal pose is retained.
- Accepted original38-cell MM5 sprite alphabet, including white/cyan tint correction.
  No new font, invented letters, antialiasing or interpolated scaling.
- Accepted selected Rolling Cutter menu icon; **Sprites by KindlyPatrick**.
- YOU GOT / ROLLING CUTTER, with R.CUTTER card. No score/CLEAR POINTS.
- Approved original-volume MM5 weapon-get music remains the audio plan. This Draw
  does not start/modify any audio, and does not grant inventory or complete phases.

## Files and future resource boundaries

`spr_mm1_weapon_get_frame.png`:256x240, one image, origin0,0.
Future folder `Sprites > MM1 > Cut Man > Weapon Get`.
`spr_mm6_weapon_get_megaman.png`:64x96, one image, origin0,0.
Future folder `Sprites > MM6 > Weapon Get`.
Reuse existing `spr_mm5_pause_font` and `spr_mm1_menu_rolling_cutter_selected`.
`single scr_mm1_cutman_weapon_screen_draw.gml`: eventual resource under
`Scripts > MM1 > Cut Man > Weapon Get`, read-only256x240 GUI renderer.
The final screen GUI owner must render after stage/HUD; no hook is installed yet.

`layout.json` gives exact source hashes, coordinates, colour mapping and limits.
`custom-rolling-cutter-screen-preview.png`: native-size review.
`custom-rolling-cutter-screen-preview-4x.png`: crisp4x review, NOT an import sprite.

Reproduce with supplied ROM and ignored native scene snapshots:
```
node tools/rom-recovery/probe-mm6-weapon-award.mjs
node tools/rom-recovery/build-cutman-weapon-screen.mjs
node tools/rom-recovery/test-cutman-weapon-screen-design.mjs
```
The test executes this actual GML Draw plus the accepted actual MM5 font script
through a PNG raster harness, and checks every pixel against the review image.
This is not GMS compilation/GPU/appearance acceptance.

Remaining after visual approval: animated reveal/typing, native-MM6-style demo
adapted to actual Rolling Cutter, music lifetime/full-cycle handling at approved
original volume, once-only screen completion/return, complete installation package.
Do not set screenDone on a timer to bypass the unfinished demonstration.
