# MM5 movement artwork — import checkpoint

The user has confirmed walking, wall-edge resolution, jumping/short-jump control, ceiling contact, and landing with the approved sound in GMS 1.4.1760. This artwork checkpoint does not change those mechanics.

## Extracted files

- `spr_mm5_megaman_walk_strip4.png`: 128x32 strip, four 32x32 cells in loop order: stride A, middle, stride B, middle. The repeated middle cell is deliberate. The normal measured loop advances once per seven game updates after idle-start handling. Do not include the idle pose in this loop.
- `spr_mm5_megaman_air.png`: one 32x40 cell. The tested non-shooting rise and descent use the same artwork.
- Both face right and use **origin X16,Y16**. Retain alpha and padding. The existing standing sprite remains unchanged.

The airborne visible pixel bounds relative to the player reference are X -13..12, Y -11..18. A 32-high canvas with origin Y16 would clip the feet. The extra bottom padding in the 40-high cell prevents this; do NOT recenter its origin to Y20. Different sprite dimensions do not change the manually coded world-space collision probes. No automatic sprite-mask collision is introduced.

## Extraction / checks

Run `node tools/rom-recovery/extract-movement.mjs` after generating mm5-stage.json using the existing setup tools. Uses the supplied USA ROM, JSNES 2.1.0 OAM and currently mapped CHR pixels, including the separate face palette. Transparent pixels remain transparent; no stage/HUD pixels are copied. Checks enforce no clipping, repeated middle walk pose equality, distinct stride poses, and ascent/descent image equality. The walking test stays in an early screen region where the HUD and enemies cannot overlap the selected player OAM cluster. Pixel palette is emulator output, not hardware color calibration.

## Step 1 — airborne sprite only

1. In **Sprites > Mega Man > MM5**, create `spr_mm5_megaman_air`.
2. Load `spr_mm5_megaman_air.png` as one image, not a strip.
3. Confirm **32x40**, one subimage, transparency, facing right.
4. Set the origin manually to **X16,Y16**. Do not click Center, trim or resize.
5. Save. Do not assign it as the player object's default sprite and do not change any events yet. No in-game visual change is expected until animation selection is installed.

## Next steps (not installed)

Import the walk strip as four 32x32 subimages, each with origin 16,16, then connect visual selection and integer frame timing to the existing controller. Preserve image_xscale facing and image_speed=0. The diagnostic Draw event must keep draw_self(). No animation selection, startup-pose gating or final frame timing code has been added by this checkpoint.

## Approved Mesen colour update

User approved the Mesen0.9.9 default-palette standing preview. Current PNGs now use that palette; geometry, padding, frame layouts and origins are unchanged. Extraction tools retain the same palette. This is palette matching, not a direct Mesen capture. See `Assets/Palette Review/Mesen 0.9.9/MM5-PLAYER-IMPORT.md` for batch replacement instructions.
