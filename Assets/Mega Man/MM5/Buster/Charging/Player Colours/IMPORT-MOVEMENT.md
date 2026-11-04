# Charge colours — walking / air import batch (GMS1.4.1760)

Standing charge sprite imported by user. Keep it; do not reimport or replace ordinary movement sprites. This batch adds two resources under existing Sprites > Mega Man > MM5 > Buster > Charging > Player Colours.

|Resource|PNG|Images/per row|Cell size|Origin|
|---|---|---|---|---|
|spr_mm5_megaman_walk_charge|spr_mm5_megaman_walk_charge_strip24.png|24 /24|32x32|16,16|
|spr_mm5_megaman_air_charge|spr_mm5_megaman_air_charge_strip6.png|6 /6|32x40|16,16|

Edit Sprite > File > Create from Strip. All offsets/separations0. No crop, resize or background-colour removal. AIR origin is16,16, NOT geometric Center16,20. Walk source768x32; air192x40.

Walk24 subimages are SIX colour banks of FOUR walking poses, not one24-frame walking animation. Bank0 frames0..3,bank1 frames4..7,...bank5 frames20..23. Air uses the same six colour banks as standing, one pose each. Later draw code will combine selected bank and movement frame. Do not assign to player, edit any Create/Step/Draw, or set automatic24-frame playback yet. No charging gameplay enabled by imports alone.

## Provenance / checks

Original live walking/airborne OAM/CHR components, six native charge-body-palette triples from original8F47/8F4F/8F57 tables. Only sprite palette0 components substituted; separate face palette4 preserved including its black pixels, not a whole-image RGB tint. Pinned approved Mesen0.9.9 colours, JSNES extraction not direct Mesen capture or generated art. Geometry/coordinate extraction matches accepted movement extractor.

extract-charge-movement.mjs asserts first bank equals accepted movement strips pixel-for-pixel; alpha and face pixels identical in all six banks; walking middle poses repeat and stride poses differ in every bank; ascent/descent images match across all banks; no opaque clipping. Colour combinations are composed from original components/native palette tables; this is not a claim that every moving-colour frame was individually captured during a natural charged run. Palette tables already independently checked against held-ROM charge in standing batch.

These checks are source/pixel checks, not GMS runtime validation. User import confirmation pending. Accepted basic firing/controller, projectile/audio files and standing charge strip unchanged. Ladder/slide/shooting colour batches and final sound queue/controller integration remain separate.
