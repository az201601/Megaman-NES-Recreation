# Mega Man — step 01: standing visual (GMS 1.4.1760)

Extracted from supplied Mega Man 5 USA ROM using `tools/rom-recovery/extract-standing.mjs`, after generating the MM5 opening snapshot. 32x32 transparent PNG, one subimage, facing right. The nine player OAM components include the separate face palette; HUD and scenery are excluded. JSNES palette output, not a photograph of NES hardware.

This step establishes the sprite/reference origin and a visible player object only. **It does not install walking, jumping, damage, arrival, or a validated collision mask.** A separate stable collision representation will be established before physics. Do not treat transparent sprite bounds as an exact MM5 collision box.

## 1. Sprite resource

In the Sprites resource tree, create folders `Mega Man` > `MM5`.
Create `spr_mm5_megaman_idle` in `Sprites > Mega Man > MM5`.
Load `spr_mm5_megaman_idle.png` as one image (not a strip).
Set origin X=16, Y=16 manually. Preserve all 32x32 padding; do not crop, trim or resize.

## 2. Player object

In the Objects resource tree, create folders `Player` > `MM5`.
Create `obj_mm5_megaman` in `Objects > Player > MM5`.
Assign `spr_mm5_megaman_idle` as its sprite.
Visible: checked. Solid: unchecked. Persistent: unchecked. Depth: -10.
Leave parent unset; it is not a child of `obj_stage_solid`.

Add **Create > Execute Code**:

```gml
// Step 01: MM5 standing visual only. No physics or damage yet.
image_speed = 0;
image_index = 0;
image_xscale = 1;
image_yscale = 1;
image_angle = 0;
```

No Step, Draw, collision, keyboard or sound events yet. Default drawing is intentional.
Do not use built-in gravity, speed or hspeed/vspeed for this setup step.

## 3. Temporary stage preview

Open `rm_mm1_cutman_stage` > Objects tab.
Place exactly one `obj_mm5_megaman` at X=48, Y=180 as a temporary standing-on-the-floor preview location (not the final arrival spawn).
Set coordinates numerically if room snapping makes this awkward.
Do not replace the room controller, background, tiles, region markers or Super Arm blocks. Keep current music events unchanged.

Run the game and enter Cut Man's stage. Check the right-facing blue standing sprite appears at the floor, with a transparent background and crisp pixels. He should remain stationary and silent. This is a visual check only, not a floor-collision test; no physics exists yet.

Keep the sprite at its native size within the 256x240 room. Existing whole-window scaling should enlarge the game; do not enlarge this individual sprite.

## Next checkpoint

Once the visual is confirmed, measure/install the stable MM5 collision proxy and basic movement against the existing `obj_stage_solid` regions. Then walking/jumping animations and ladder behavior, followed by MM5 READY/arrival and required sounds. Charging, sliding, damage recovery and pickup artwork remain planned work; no score system will be added.
