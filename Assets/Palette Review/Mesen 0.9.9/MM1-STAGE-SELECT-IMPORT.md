# MM1 stage-select colour replacement

User confirmed all MM5 player colour replacements installed. Next batch is the MM1 stage-select screen. All RGB changes use the approved pinned Mesen0.9.9 default palette. Dimensions, opaque positions, alpha, frame order and resource names are unchanged. The solid blue edge-to-edge background remains borderless. Portrait backdrops stay opaque. Animation, controls, text positions and queued audio are unchanged.

Audit found title_screen.png and sprite_font_strip.png already use only target Mesen palette colours, so they are byte-for-byte unchanged and need no reload. Collision region masks are excluded from artwork migration. MM1 Cut Man intro/stage/objects and unused arrival graphics were audited but are not converted in this batch.

## GMS1.4 import

Back up the project. Use EXISTING sprite resources:

- Sprites > Stage Select > spr_mm1_stage_select_background: Load Sprite from spr_mm1_stage_select_background.png; one256x240 subimage, origin0,0.
- Sprites > Stage Select > Portraits: reload each matching spr_mm1_stage_select_bombman/cutman/elecman/fireman/gutsman/iceman PNG; one32x32 subimage each, origin0,0. Do not remove background colour.
- Sprites > Stage Select > spr_mm1_stage_select_frame: Edit Sprite > File > Create from Strip, spr_mm1_stage_select_frame_strip2.png;2 images,2 per row,48x48 cells, all offsets/separations0. Replace old subimages, don't append; exactly2 images afterward. Origin0,0.

All eight Stage Select resources use origin0,0, NOT player origin16,16. Preserve resource names, masks, transparency, padding and object events. Don't import the repository's assembled stage_select_preview.png as a sprite; it is reference only and is omitted from the ZIP.

The palette-matched preview is reference artwork, not a fresh Mesen capture. Some menu text colours may be supplied by the user's Draw code rather than PNGs; that code is not in the repository. If text tints don't match after this batch, inspect that event before changing RGB values. No unverified code edits or font normalization are included here.

Check selection frame blinking, all portraits, blue edges, music and transition into Cut Man's intro. Subsequent batches update the intro and stage scenery/objects; they will retain previous colours temporarily.

## Reproduce

`node tools/rom-recovery/migrate-mm1-mesen-colours.mjs` uses pinned original images at4acf61c and strict unambiguous RGB conversion. Validates expected sizes, every alpha position, title/font target membership and uniform edge-to-edge background. No nearest-colour guessing and no controller/timing changes.
