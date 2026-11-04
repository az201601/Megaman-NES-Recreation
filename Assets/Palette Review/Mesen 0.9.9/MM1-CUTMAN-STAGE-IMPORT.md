# Cut Man first screen — approved Mesen colours

User has installed the stage-select recolours and confirmed the introduction installed and tested. This batch updates the sky-only background, scenery atlas, separate Super Arm block sprite and two reference compositions to the approved Mesen0.9.9 default2C02 palette. These are palette-matched assets, not direct Mesen captures. The original pixel positions, alpha, atlas cells, tile placement, dimensions and object placement are unchanged. No GML, collision masks, audio or timing changes.

Back up the GMS project. Replace images in these EXISTING resources:

1. **Backgrounds > Cut Man > Stage > bg_mm1_cutman_screen01_background**: Load Background from the same-named PNG. Keep256x240, opaque cyan-only image. This is still the bottom sky background, not building walls. Leave room background assignment/position/tiling/visibility unchanged.
2. **Backgrounds > Cut Man > Stage > bg_mm1_cutman_screen01_tileset**: Load Background from the same-named PNG. Keep128x32 canvas and existing Use as tile set settings:16x16 tiles, horizontal/vertical offsets0, horizontal/vertical separations0. Preserve PNG transparency; no background-colour removal, cropping or scaling. This is a Background resource, NOT a sprite. Do not change scr_mm1_cutman_screen01_tiles or its123 placements: this batch changes colours only, not the atlas layout.
3. **Sprites > Stage Objects > Super Arm > spr_mm1_super_arm_block**: Load Sprite from matching PNG. Exactly one32x32 subimage, origin0,0. Retain full opaque black outline/background and full rectangular0..31 collision mask (precise off). Do not change obj_mm1_super_arm_block's parent obj_stage_solid, events, instance placements, depth or Solid flag. Blocks remain separate objects; NEVER add them to scenery tiles.

Do not import cutman_screen01_layout_reference.png or cutman_screen01_scenery_reference.png as room backgrounds; they are assembled references and excluded from the ZIP. No Create/Step/Draw changes, tile script replacement, room recreation, collision-region edits or audio changes are needed. Other old README instructions to replace atlas AND placement script referred to earlier geometry revisions, not this colour-only update.

Validation: migrate-mm1-mesen-colours.mjs rejects unknown/ambiguous source colours and asserts expected dimensions/every alpha position/uniform sky. verify-mesen-stage.mjs confirms sky +123 tiles matches scenery reference with zero differing RGBA pixels; adding four separate block sprites matches full layout with zero differences. PNGs remain at native resolution. GMS user runtime test pending.

After reload, enter Cut Man stage and check cyan sky, beige walls/decorations, ladder art and green blocks against Mesen's default colours. Check walking/jumping/sliding/ladder controls and collision remain as accepted, plus queued stage music. Preserve existing player sprites/origins: these instructions do not change MM5 resources.
