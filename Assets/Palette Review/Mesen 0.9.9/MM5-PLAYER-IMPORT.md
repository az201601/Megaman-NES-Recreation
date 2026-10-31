# Approved Mesen palette — MM5 player batch

User approved the standing preview. All six canonical MM5 player PNGs now use the pinned Mesen0.9.9 default 2C02/no-emphasis colours. The four player extraction scripts now use mesen-palette.mjs so future exports retain those colours. These are JSNES/ROM-derived pixels with Mesen palette matching, not direct Mesen captures. No controller, physics, audio, Draw or timing code changed.

The ZIP contains the six canonical PNGs with unchanged filenames and this guide. Back up the GMS project first. Replace images in EXISTING resources, not new objects/resources. All origins remain manually X16,Y16. Preserve transparent padding and collision-mask settings.

| Folder under Sprites > Mega Man > MM5 | Existing resource | File | Import |
|---|---|---|---|
| Standing (existing idle location) | spr_mm5_megaman_idle | spr_mm5_megaman_idle.png | Already approved/imported; one32x32 frame |
| Movement | spr_mm5_megaman_walk | spr_mm5_megaman_walk_strip4.png | Edit Sprite > File > Create from Strip:4 images,4 per row,32x32,offset/separation0; replace old frames, do not append |
| Movement | spr_mm5_megaman_air | spr_mm5_megaman_air.png | Load Sprite, one32x40 frame |
| Ladders | spr_mm5_megaman_climb | spr_mm5_megaman_climb_strip2.png | Edit Sprite > File > Create from Strip:2 images,2 per row,32x40,offset/separation0; replace old frames, do not append |
| Ladders | spr_mm5_megaman_ladder_top | spr_mm5_megaman_ladder_top.png | Load Sprite, one32x40 frame |
| Sliding | spr_mm5_megaman_slide | spr_mm5_megaman_slide.png | Load Sprite, one32x40 frame |

Use the existing idle folder if yours predates the Standing folder. Check origin16,16 after EVERY reload (Center would give incorrect Y20 on40px canvases). Don't change object default sprite references, Create/Step/Draw, collision masks, music or sounds. Strip image counts must be exactly4 walk and2 climb, not accumulated duplicates.

Validation: conversion rejects unknown/ambiguous source RGB; dimensions and every alpha position preserved. Regenerated all six via live-ROM extractors; decoded pixels exactly equal their colour-only migrations. Walk cadence/ladder assertions and no-clipping tests passed. No GMS runtime available here; user should check walking, jump/fall, ladders and sliding retain their tested behaviour and now share standing's approved colours.

Other artwork (MM1 title/select/intro/scenery/objects) is not converted yet; it will be audited next, preserving intentional design changes rather than blindly recolouring arbitrary RGB art.
