# Charged projectile sprite batch — GMS1.4.1760

Original MM5 ROM live OAM/CHR pixels, matched to approved Mesen0.9.9 default2C02 palette using mesen-palette.mjs. JSNES extraction, NOT a direct Mesen capture or AI-generated art. Reproduce with tools/rom-recovery/extract-charged-art.mjs. Source references RAM shot position before frame because OAM is one actor update behind.

## Import (no controller/object changes yet)

Under Sprites > Mega Man > MM5 > Buster create group **Charging**. Create these resources:

| Resource | Source PNG | Strip settings | Manual origin |
|---|---|---|---|
|spr_mm5_buster_mid|spr_mm5_buster_mid_strip2.png|2 images,2 per row,24x16 cells|16,7|
|spr_mm5_buster_full|spr_mm5_buster_full_strip4.png|4 images,4 per row,32x32 cells|24,15|

Edit Sprite > File > Create from Strip. All offsets/separations0. Verify2 or4 subimages respectively. Preserve alpha/padding; no cropping/resizing/background removal. Do NOT click Center. Origins intentionally differ from geometric centres and existing8x8 basic shot. Both PNGs face right; original-ROM left/right reflection was checked pixel-for-pixel around the RAM reference.

Keep existing obj_mm5_buster_shot assigned to its basic sprite. Do not change its Create/End Step or any player event yet. These imports alone do not enable charging.

## Checks / timing

Two intermediate phases (5/4 components); four full phases (10/8/12/5 components). Every expected phase captured and repeated identically; all opaque pixels fit. Full projectile includes BOTH native sprite palettes0 and4, not just its white face-colour palette. Original horizontal/vertical component flips and OAM priority retained. Native left samples mirrored against each right phase pixel-for-pixel. Transparent canvas retains origin even in smaller phases.

Medium output48x16; full128x32. Displayed OAM samples: intermediate phase0 at ages2..5,1 at6..10,0 again11..13; full0 at2..3,1 at4..6,2 at7..9,3 at10..12,0 again13. Phase0 begins before its first sampled display; do not mistake OAM lag for a shortened GMS lifecycle. Actual GMS animation/event integration is separate. No hitbox/collision/damage information inferred from alpha.

Audio files in the review pack are full press/charge/release sequences, NOT installable isolated effects. Listen externally and approve before new Sound imports. Existing basic/landing sounds remain unchanged.

## Corrected full-charge extraction after user review

User reported broken white portions. Previous CHR filter started at68hex and missed full phase0 components65/66/67; its24px-high canvas also excluded top/bottom of the native flash. This was an extraction error, not permission to remove the original flash. Restored ALL10 native phase0 components and expanded full cells to32x32 with origin24,15. Width/subimage count unchanged. Other phases retain padding aligned to the same actor reference.

White flash/ring phases themselves are present in the ROM; don't recolour them to blue or delete them. Every phase now independently matches the ROM's rendered framebuffer at every opaque pixel when the shot is clear of the player and first in OAM (avoids alternating NES scanline sprite-limit losses). Repeated phases and native left/right reflection also pass. Full PNG/ZIP updated; intermediate PNG and audio unchanged.

Replace only spr_mm5_buster_full's FOUR subimages using32x32 cells,4 per row, all offsets/separation0. Recheck manual origin24,15 (changed from previous24,11). No player/object/event edits. Earlier32x24 instruction is superseded.
