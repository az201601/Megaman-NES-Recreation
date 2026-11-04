# MM5 slide-start dust — sprite import checkpoint

`spr_mm5_slide_dust_strip3.png`:24x8 transparent strip, three8x8 cells, origin0,0. Approved Mesen0.9.9 default colours. Extracted from actual original-ROM OAM/CHR/palette data in the Napalm opening, not generated imagery or a direct Mesen runtime capture. Reproduce with `node tools/rom-recovery/extract-slide-dust.mjs` after dependencies/mm5-stage snapshot setup.

## ROM observations / assertions

Actual grounded Down+A entry, no state/terrain injection. Cases: right, left, cancellation followed by a second slide within the effect lifetime. Entity slot5 is initialized once at entry (RAM0305=1), animation17hex, world anchor remains the original player X and original standingY+2. One OAM component, palette offset4, CHR tiles53/54/55hex. Its displayed top-left is original standingX-12, standingY+7. Left/right sample pixels are identical, including original OAM flips: do NOT automatically mirror this effect with the player.

Phase RAM changes to1 at update9,2 at18,3/deactivated at27. Active end-of-update samples1..26, none27 onward. Displayed OAM trails CPU selection: first sampled displayed dust at update2, phase0 through9, phase1 at10..18, phase2 at19..27. Do not equate these with a guarantee of identical GMS event/draw phase; implementation should explicitly manage lifetime instead of leaving automatic animation looping. Three extracted poses at updates2/11/20 distinct; right/left/restart images equal. World position remains fixed after player moves or cancels. Quick re-slide at update7 while dust slot occupied does not create/reset the puff (one birth total). No continuous trail or repeated emitters. No sound to add.

## GMS1.4 import only

Sprites > Mega Man > MM5 > Sliding: create group **Dust**, then sprite **spr_mm5_slide_dust**. Edit Sprite > File > Create from Strip: select PNG,3 images,3 per row,8x8 cells, offsets/separations0. Exactly3 subimages, manually origin0,0. Preserve transparency, do not remove background colour/crop/resize. This is deliberately NOT player origin16,16.

Do not assign this sprite to obj_mm5_megaman or alter existing sprites, Create/Step/Draw, physics, collision or audio. Object/hook installation is a later checkpoint, pending user import confirmation. Proposed resource is a separate non-colliding obj_mm5_slide_dust with stationary world position, one-shot animation and no sound; integrate only on successful slide entry, suppress while another puff exists, independent of later slide cancellation.

## Object/hook installation checkpoint

User confirmed dust sprite imported. Create **Objects > Effects > MM5 > Sliding > obj_mm5_slide_dust**, assign spr_mm5_slide_dust. Visible on, Solid off, Persistent off, Parent none. Do NOT place instances in a room. Add Create/Execute Code from obj_mm5_slide_dust_create.gml and Step/Step/Execute Code from obj_mm5_slide_dust_step.gml. No Draw, collision or audio events: default sprite drawing suffices. Depth-9 puts it behind the current player depth-10; this fixed layering is a GMS presentation adaptation, not reproduction of NES OAM rotation priority.

Inside Scripts > Mega Man > MM5 > scr_mm5_player_slide_step, insert slide_start_dust_insert.gml immediately ABOVE the consecutive slide_overhang_fall=false / sliding=true assignments. This is after grounded/fresh input and body-clearance checks and before any horizontal displacement. The complete canonical slide script includes the hook; do not install it twice. No player Create/Step/Draw changes are required.

GMS one-shot uses age0 at creation, phase floor(age/9), destruction at age27. Nominal three9-update poses; GMS instance-event/draw scheduling is not claimed to match NES OAM display latency exactly. It is stationary, never automatically mirrored, and independent of player exit/cancel/direction changes. Existing active effect prevents another spawn/reset, but expiry permits a fresh puff on a later slide. No sound added.

Actual GML-subset tests validate3x9 phases, expiry, fixed coordinates/facing/depth, successful pre-movement spawn, no blocked/continuous spawn, suppression on quick restart, later re-spawn, no sound and all prior slide/wall/ledge regression checks. This is not a GMS compiler/runtime; local user validation pending. Test both directions, early cancel, quick re-slide, waiting for expiry and new-room cleanup; accepted player motion must remain unchanged.
