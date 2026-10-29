# Charge colours — climbing, ladder top and slide (GMS1.4.1760)

User confirmed walking/air charge resources imported. Keep existing resources/events unchanged. Add three sprites under existing Sprites > Mega Man > MM5 > Buster > Charging > Player Colours.

|Resource|Source PNG|Images / per row|
|---|---|---|
|spr_mm5_megaman_climb_charge|spr_mm5_megaman_climb_charge_strip12.png|12 /12|
|spr_mm5_megaman_ladder_top_charge|spr_mm5_megaman_ladder_top_charge_strip6.png|6 /6|
|spr_mm5_megaman_slide_charge|spr_mm5_megaman_slide_charge_strip6.png|6 /6|

All use Edit Sprite > File > Create from Strip,32x40 cells, all offsets/separations0, manual origin16,16. DO NOT Center16,20. Do not crop/resize/remove background colour. Climb sheet384x40; top/slide192x40. Verify12/6/6 subimages respectively.

Climb is six colour banks each containing two climbing poses:0..1 base,2..3 bank1,...10..11 bank5. Top/slide each contain six colour states, NOT sequential automatic animations. Later code will select bank plus pose. Keep player's ordinary sprite assignments and Create/Step/Draw unchanged; do not edit slide+2 Draw offset or dust. No sound/event/room changes. These resources alone do not implement charging or enable ladder-top firing.

## Provenance and tests

extract-charge-ladder-slide.mjs uses same original ROM OAM/CHR poses/geometry as accepted ladder and slide extractors. Ladder state/class20 result initialization is explicit controlled setup, not natural endpoint validation. Slide enters naturally; exact11 components excludes separate dust tile53. Native six body-palette bank triples from charge ROM tables applied ONLY to body palette0. Separate slide face palette4 preserved. Non-shooting climb/top are back-facing original art and have no separate face component; none is invented. Pinned approved Mesen0.9.9 colours, JSNES extraction not direct Mesen capture or image generation.

Checks: every base-bank row equals accepted sprites; alpha/face unchanged across colour banks; no opaque clipping; two climbing phases differ and repeat after cycle; top pose equal over three samples; slide equal over three samples in every bank; dust absent. Colours are compositions of original components and independently verified native palette tables, not individual natural charged-run captures of every variant. No GMS runtime validation implied.

Colour state freezes while sliding per measured charge-counter behaviour; these six variants preserve a charge already held on slide entry. They do not imply charge advances during slide. User import confirmation pending. Shooting colour variants/audio queue/controller integration remain separate.
