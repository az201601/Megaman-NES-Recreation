# GMS 1.4.1760 — MM5 pickup sprites only

This imports artwork, not working pickup objects. Do not place these manually in the room. Later gameplay integration will script their creation when eligible enemies die. No Create/Step/Draw event changes are needed for this art-only import.

## 1. Resource folder

Under **Sprites**, create folders **Mega Man → MM5 → Pickups**. Put all five resources below in that folder. Research JSON and the preview image are not GameMaker resources.

## 2. Import the strips

Create each named sprite, open **Edit Sprite → File → Create from Strip**, and select the matching file from `Recovered/`. Use one horizontal row, starting at (0,0), with zero separation/offset. Enter the dimensions and frame count below. Keep the PNG alpha; do not remove the black colour or use the preview sheet as a strip.

| Sprite resource | Strip file | Frame size | Frames | Origin X,Y |
|---|---|---:|---:|---:|
| `spr_mm5_pickup_small_health` | `spr_mm5_pickup_small_health_strip2.png` | 8×8 | 2 | 4,3 |
| `spr_mm5_pickup_large_health` | `spr_mm5_pickup_large_health_strip2.png` | 16×16 | 2 | 8,7 |
| `spr_mm5_pickup_small_weapon` | `spr_mm5_pickup_small_weapon_strip2.png` | 8×8 | 2 | 4,3 |
| `spr_mm5_pickup_large_weapon` | `spr_mm5_pickup_large_weapon_strip2.png` | 16×16 | 2 | 8,7 |
| `spr_mm5_pickup_extra_life` | `spr_mm5_pickup_extra_life_strip1.png` | 16×16 | 1 | 8,7 |

These origins preserve the original item centre after NES OAM Y+1. Do not click Centre afterwards. No smoothing, scaling or repainting. Verify each resource's subimages in the editor; the small-health dark phase is genuine opaque black art, not a missing extraction.

## 3. Leave gameplay integration for the combat/drop package

Do not enable automatic animation on a live pickup yet. Native colour phases share a global nine-update clock; a future controller should select the two subimages explicitly. Extra life stays on subimage 0. Sprite alpha bounds are **not** certified native collision masks, and automatic precise-mask collision would not reproduce the native pickup collision logic.

No pickup objects, scripts, events or room placements are supplied in this package. The native refill amounts and drop-selection details are documented in README.md. This import does not change the current player's health, lives, weapon energy or pause menu.
