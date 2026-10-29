# Charge colours — standing sprite, first small batch

User approved charge-loop audition ("very smooth"). Intro/loop pair retained unchanged; not installed yet. This batch imports only standing charge-colour artwork, no player/projectile/controller events or sound playback changes.

## Import

Sprites > Mega Man > MM5 > Buster > Charging: create group Player Colours.
Create spr_mm5_megaman_idle_charge.
Edit Sprite > File > Create from Strip: spr_mm5_megaman_idle_charge_strip6.png.

-6 images,6 per row.
-Cell width32,height32.
-All offsets/separation0.
-Manual origin16,16.

Verify exactly6 subimages. No crop, resize, background removal or automatic animation. Do not assign it as player default sprite or modify Draw yet. Existing standing sprite remains intact.

## Meaning / evidence

192x32 strip, six32x32 cells. NOT a six-frame animation played in sequence; later Draw code selects colour state from measured charge counter. Subimages:0 base,1/2/3 early-charge tint states,4/5 full-charge colour rotations (full third state is base0). ROM native body palette indices:

0:0F,2C,11
1:05,2C,11
2:15,2C,11
3:25,2C,11
4:2C,11,0F
5:11,0F,2C

Original nine standing OAM components, separate face palette4 unchanged, only body palette0 changed via original ROM charge colour tables8F47/8F4F/8F57; colour-matched with pinned approved Mesen0.9.9 palette. JSNES extraction, not direct Mesen capture/AI-generated imagery/global RGB tint. Don't recolour face black merely because it matches body black RGB.

Checks in extract-charge-idle.mjs: base variant equals accepted standing PNG pixel-for-pixel; alpha/geometry/origin consistent; every final face pixel identical across variants; native ROM palette-table values asserted. Independently compare five recoloured outputs with naturally held-charge idle OAM/palette poses at updates36/56/68/84/86; exact RGBA equality. Update52 contains native blink face9, so use56 to compare current accepted open-eye art rather than silently dropping face9 or claiming blink implemented. No opaque clipping.

Walking/air/ladder/shooting charge variants and runtime selection/playback integration remain separate batches. Existing charge projectiles, approved audio and basic X-fire unchanged. User import pending.

## Standing installed; next movement batch

User confirmed standing charge resource imported. See IMPORT-MOVEMENT.md and Downloads/mm5-charge-walk-air.zip for walking24 cells32x32 and airborne6 cells32x40, both origins16,16. No event changes; do not animate walk as one24-frame loop. Movement colour import pending.
