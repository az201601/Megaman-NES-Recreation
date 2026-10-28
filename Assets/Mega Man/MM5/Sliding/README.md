# MM5 sliding pose — import-only checkpoint

`spr_mm5_megaman_slide.png`: one transparent 32x40 frame, facing right, origin16,16.

Extracted from live original USA MM5 ROM OAM, CHR tiles and sprite palette after actual Down+A slide entry in the saved Napalm opening; not generated or traced artwork. `tools/rom-recovery/extract-slide-art.mjs` reproduces it. Eleven components: ten body tiles $25-$2E and face $2F. Separate trailing dust tile $53 is intentionally excluded. Three moving samples at updates2,5,10 produce identical pixel data, with no opaque clipping. Reference uses previous player X minus camera X and previous player Y to account for displayed OAM latency; face reference and component minimum also checked.

## GMS1.4.1760 import

1. Sprites > Mega Man > MM5: create group **Sliding**.
2. Create **spr_mm5_megaman_slide** in that group.
3. Load Sprite: select the PNG as a single image (not a strip).
4. Verify 32x40, one subimage, transparency preserved.
5. Set origin manually to X16,Y16. Do not Center, crop, trim or resize.
6. Keep default object sprite, Create/Step/Draw, collision masks and audio unchanged.

User has confirmed the five slide Create variables installed. Sprite import is next; slide movement is NOT installed. Normal sprite collisions cannot simply be substituted for the accepted explicit controller probes. MM5 shifts its native slide reference Y by2; the movement integration must handle that deliberately, not compensate by arbitrarily changing this sprite origin. Separate dust effects/audio remain a later check, not baked into the player pose.

## Approved Mesen colour update

User approved the Mesen0.9.9 default-palette standing preview. Current PNGs now use that palette; geometry, padding, frame layouts and origins are unchanged. Extraction tools retain the same palette. This is palette matching, not a direct Mesen capture. See `Assets/Palette Review/Mesen 0.9.9/MM5-PLAYER-IMPORT.md` for batch replacement instructions.
