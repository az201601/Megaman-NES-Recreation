# MM5 ladder artwork — import checkpoint

The user confirmed the project's climbing, hold, drop combinations, bottom exit, one-way ladder-top support, Up exit and Down entry work cleanly. This checkpoint adds artwork only; the existing physics are not modified.

## Assets

- `spr_mm5_megaman_climb_strip2.png`: 64x40 horizontal strip, two 32x40 cells, alternating climb poses.
- `spr_mm5_megaman_ladder_top.png`: single 32x40 top-of-ladder pose selected by the ROM when upper/middle ladder samples are empty but the lower sample remains ladder.
- Both use **origin X16,Y16**, matching the established player reference, not the geometric center of the taller canvas. Preserve transparent padding; do not trim, recenter, or resize.

## Provenance / limitations

`tools/rom-recovery/extract-ladder-art.mjs` runs the original USA ROM's player handler in controlled climbing state 3. It supplies continuous ladder class $20 at original terrain-result writes; the top-art branch supplies only the lower sample. This is a synthetic classification setup, not a naturally reached ladder-top transition. It uses actual OAM, active CHR pixels and palette output; no generated imagery or background pixels are used.

The two climbing phases repeat and change after nine active updates in this test. Releasing vertical input holds the frame and repeatedly resets the cadence counter in the player handler; the later animation update leaves it at 1 in end-of-frame snapshots. Tests verify this, phase repetition, distinct poses, top-pose equality across the sampled phases, and no clipped opaque pixels.

These observations establish the selected artwork and controlled cadence, not full native top-entry/exit timing. The current GMS top movement is a working rectangle-region adaptation, so selecting the top pose near the lip must be described as an adaptation unless further measured. Existing controller still uses temporary standing art while attached; this commit does not connect these sprites.

## Step 1 — climb sprite

1. Folder **Sprites > Mega Man > MM5 > Ladders** (create Ladders group).
2. Create **spr_mm5_megaman_climb**.
3. Open **Edit Sprite > File > Create from Strip**, selecting spr_mm5_megaman_climb_strip2.png.
4. Number of images 2; images per row 2; image width 32; image height 40; offsets and separation 0.
5. Return to Sprite Properties. Set origin manually X16,Y16; do not use Center (which would incorrectly select Y20).
6. Save. Do not assign it to the player object's default sprite or change events yet.

Next: import the single top pose, then connect visual selection inside the attached-ladder block before its early exit. Normal movement's animation code is intentionally skipped while attached. Keep the working physics unchanged.

## Subsequent integration checkpoint

User has now imported both resources. The controller source connects climb/top selection inside the attached branch; see docs/mm5-player-ladder-animation-setup.md for the exact Create and Step changes. The original import-only notes above are historical. Functional ladder movement is unchanged; user animation validation remains pending.
