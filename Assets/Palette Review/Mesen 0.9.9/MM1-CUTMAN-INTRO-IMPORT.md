# Cut Man introduction — Mesen colour replacement

User confirmed the stage-select colour replacements installed. This batch palette-matches the two Cut Man intro strips and reference preview to approved Mesen0.9.9 default2C02 colours. Not a direct Mesen capture. Expected dimensions and every alpha value unchanged; conversion rejects unknown/ambiguous RGB. Animation frame order, transparent padding, backgrounds' opaque edge-to-edge fill and intentional lack of points text remain intact. No GML event, audio or timing changes.

Back up the project first. Reload EXISTING sprites under Sprites > Cut Man > Boss Intro:

1. spr_mm1_cutman_boss_intro: Edit Sprite > File > Create from Strip; select spr_mm1_cutman_boss_intro_strip3.png;3 images,3 per row,32x32 cells, all offsets/separations0. Replace rather than append. Exactly3 subimages: jump, standA, standB. Origin0,0.
2. spr_mm1_cutman_boss_intro_background: same strip import, spr_mm1_cutman_boss_intro_background_strip2.png;2 images,2 per row,256x240 cells, all offsets/separations0. Replace rather than append. Exactly2 subimages: normal, flash. Origin0,0. Keep both backgrounds fully opaque; don't remove background colour.

Do not crop/resize, change collision masks, rename resources or create new objects. Leave obj_mm1_cutman_boss_intro events, name reveal, stage transitions and existing audio unchanged. No points/score text should be added. The reference preview is updated in the repository but is NOT a sprite to import and is not in the ZIP.

Test Cut Man selection through the jumping/standing poses, background flashes, name reveal, music and stage entry. Intro implementation is already installed; old historical README implementation notes are not instructions to recreate it. Stage scenery and Super Arm block still have previous colours until the next batch. No GMS runtime available in the workspace; user confirmation pending.
