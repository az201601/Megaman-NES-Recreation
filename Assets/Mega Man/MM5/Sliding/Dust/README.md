# MM5 slide-start dust — sprite import checkpoint

`spr_mm5_slide_dust_strip3.png`:24x8 transparent strip, three8x8 cells, origin0,0. Approved Mesen0.9.9 default colours. Extracted from actual original-ROM OAM/CHR/palette data in the Napalm opening, not generated imagery or a direct Mesen runtime capture. Reproduce with `node tools/rom-recovery/extract-slide-dust.mjs` after dependencies/mm5-stage snapshot setup.

## ROM observations / assertions

Actual grounded Down+A entry, no state/terrain injection. Cases: right, left, cancellation followed by a second slide within the effect lifetime. Entity slot5 is initialized once at entry (RAM0305=1), animation17hex, world anchor remains the original player X and original standingY+2. One OAM component, palette offset4, CHR tiles53/54/55hex. Its displayed top-left is original standingX-12, standingY+7. Left/right sample pixels are identical, including original OAM flips: do NOT automatically mirror this effect with the player.

Phase RAM changes to1 at update9,2 at18,3/deactivated at27. Active end-of-update samples1..26, none27 onward. Displayed OAM trails CPU selection: first sampled displayed dust at update2, phase0 through9, phase1 at10..18, phase2 at19..27. Do not equate these with a guarantee of identical GMS event/draw phase; implementation should explicitly manage lifetime instead of leaving automatic animation looping. Three extracted poses at updates2/11/20 distinct; right/left/restart images equal. World position remains fixed after player moves or cancels. Quick re-slide at update7 while dust slot occupied does not create/reset the puff (one birth total). No continuous trail or repeated emitters. No sound to add.

## GMS1.4 import only

Sprites > Mega Man > MM5 > Sliding: create group **Dust**, then sprite **spr_mm5_slide_dust**. Edit Sprite > File > Create from Strip: select PNG,3 images,3 per row,8x8 cells, offsets/separations0. Exactly3 subimages, manually origin0,0. Preserve transparency, do not remove background colour/crop/resize. This is deliberately NOT player origin16,16.

Do not assign this sprite to obj_mm5_megaman or alter existing sprites, Create/Step/Draw, physics, collision or audio. Object/hook installation is a later checkpoint, pending user import confirmation. Proposed resource is a separate non-colliding obj_mm5_slide_dust with stationary world position, one-shot animation and no sound; integrate only on successful slide entry, suppress while another puff exists, independent of later slide cancellation.
