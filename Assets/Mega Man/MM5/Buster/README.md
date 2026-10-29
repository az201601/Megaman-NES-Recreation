# MM5 basic-buster artwork — import preparation

Original ROM OAM/CHR/palette pixels, colour-matched to approved Mesen0.9.9 default palette via mesen-palette.mjs. Extraction runtime is JSNES2.1.0, NOT Mesen capture or generated art. `node tools/rom-recovery/extract-buster-art.mjs` reproduces this batch from mm5-stage.json.

| File | Canvas/frame arrangement | GMS resource | Origin |
|---|---|---|---|
| spr_mm5_buster_shot.png | single8x8 | spr_mm5_buster_shot | **4,3** |
| spr_mm5_megaman_idle_shoot.png | single40x40 | spr_mm5_megaman_idle_shoot |16,16|
| spr_mm5_megaman_air_shoot.png | single40x40 | spr_mm5_megaman_air_shoot |16,16|
| spr_mm5_megaman_climb_shoot.png | single40x40 | spr_mm5_megaman_climb_shoot |16,16|
| spr_mm5_megaman_walk_shoot_strip4.png |160x40, four40x40 cells|spr_mm5_megaman_walk_shoot|16,16|

The shooting canvases are wider than existing movement sprites because the extended cannon would clip on a32px-wide canvas. Preserve padding and the specified origin, not geometric Center. Projectile origin4,3 comes from measured sprite top-left relative to its ROM RAM reference (-4,-3); do not assume Center4,4. Importing it does not establish a collision hitbox.

Checks: original8x8 sprite mode; projectile tile40hex/palette offset4, correct X/Y offset; normal shooting body components exclude projectile/HUD; all opaque pixels fit. Idle/air/climb samples4/13 equal, walking four phases present, middle phases1/3 equal and stride phases0/2 distinct. Ladder artwork uses the same explicitly initialized continuous-ladder class20 test as other ladder work; not a natural endpoint encounter. No sprite generated from images or approximated from screenshots.

## Current user step

Sprites > Mega Man > MM5: create **Buster** group and **spr_mm5_buster_shot**. Load Sprite from matching PNG as one8x8 subimage; origin manually4,3; preserve alpha/padding, no crop/resize/background-colour removal. Do not create a projectile object, change player events or assign this as default player sprite. Other four shooting resources are prepared but import/integration instructions follow in separate checkpoints.

Shot audio is separately in Assets/Audio/Mega Man/MM5/Buster/Review and awaits user's hearing approval. Do not install or call it yet. No GMS firing implementation at this artwork checkpoint; preserve existing tested movement.

## Subsequent approved-resource checkpoint

Projectile sprite imported and sound approved by user. Canonical audio is now Assets/Audio/Mega Man/MM5/Buster/snd_mm5_buster_shot.wav, byte-identical to review. See IMPORT-SHOOTING-RESOURCES.md and Downloads/mm5-shooting-resources.zip for remaining sprite/sound imports. Older pending-approval notes above are historical. No GMS firing implementation yet.
