# Charge colours — final player-art batch (GMS1.4.1760)

User confirms climb/ladder-top/slide charge sprites imported. This batch adds four shooting-colour resources under existing Sprites > Mega Man > MM5 > Buster > Charging > Player Colours. Keep all earlier sprites and player/projectile events intact.

|Resource|Source PNG|Images / per row|
|---|---|---|
|spr_mm5_megaman_idle_shoot_charge|spr_mm5_megaman_idle_shoot_charge_strip6.png|6 /6|
|spr_mm5_megaman_walk_shoot_charge|spr_mm5_megaman_walk_shoot_charge_strip24.png|24 /24|
|spr_mm5_megaman_air_shoot_charge|spr_mm5_megaman_air_shoot_charge_strip6.png|6 /6|
|spr_mm5_megaman_climb_shoot_charge|spr_mm5_megaman_climb_shoot_charge_strip6.png|6 /6|

Edit Sprite > File > Create from Strip. ALL FOUR:40x40 cells, offsets/separations0, manual origin16,16. Do NOT Center20,20 or use32px movement cells. Width preserves extended cannon; no crop/resize/background removal. Walk sheet960x40, other sheets240x40.

Six colour banks match previous charge strips. Walk has four pose frames per bank (base0..3,bank1=4..7,...bank5=20..23). Others one pose per bank. These are palette/pose banks, not automatic24/6-frame animation loops. No Draw/player/sound changes yet; do not replace ordinary default sprite or basic-projectile sprite.

## Source and verification

extract-charge-shooting.mjs reuses original live OAM/CHR selection, pose sampling and settled controlled-ladder setup of CORRECTED basic shooting extractor. Retains face tile08 idle,2F airborne,24 ladder, and38 walking stride phase2 (other walk phases08). Asserts exactly one face component with expected tile in every capture. Ladder setup/class20 is explicitly controlled, not natural endpoint validation. Shooting animation02/08/0B checks retained, walking05 phase checks retained.

Only body palette0 substituted from original charge ROM tables; face palette4 unchanged, including black pixels. Pinned Mesen0.9.9 appearance, JSNES extraction not direct Mesen capture/AI art/global tint. Six-bank palette composition of original components, NOT individual natural charged-run captures of every image.

Checks: every base frame equals corrected accepted shooting PNGs; alpha and final face pixels invariant across all six colour banks; walking middle poses repeat and strides differ in every bank; static idle/air/climb sample pairs equal in every bank; all opaque pixels fit40x40; prior missing-face bug explicitly guarded. Existing normal/shooting sprites unchanged. User import pending. This completes currently used player-pose colour asset preparation; final GMS charge/audio queue/controller integration and user runtime tests remain separate.
