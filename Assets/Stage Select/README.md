# Mega Man 1 — Stage Select Assets

Prepared from the user-supplied USA ROM, observed with JSNES 2.1.0. Native resolution, no resampling. Palette RGB is that emulator's output, not an assertion of a unique hardware NES palette. All portraits remained unchanged over 180 observed idle frames.

## Files and GMS resource folders

```
Sprites
├── Fonts
│   └── spr_mm1_font                  (existing resource)
└── Stage Select
    ├── spr_mm1_stage_select_background
    ├── spr_mm1_stage_select_frame
    └── Portraits
        ├── spr_mm1_stage_select_cutman
        ├── spr_mm1_stage_select_gutsman
        ├── spr_mm1_stage_select_elecman
        ├── spr_mm1_stage_select_iceman
        ├── spr_mm1_stage_select_fireman
        └── spr_mm1_stage_select_bombman
```

- Background: `spr_mm1_stage_select_background.png`, 256 x 240. Solid blue edge-to-edge; the emulator-captured black margins have been removed at the user's request. Import as one sprite, origin (0,0).
- Frame: `spr_mm1_stage_select_frame_strip2.png`, 96 x 48. Import as TWO 48 x 48 subimages, origin (0,0). Subimage 0 = normal; subimage 1 = highlighted. Transparent centre allows the portrait to be drawn separately. Frame colours and clipped corners are preserved.
- Portraits: six files under `Portraits/`, each 32 x 32, one subimage, origin (0,0). Yellow portrait backdrops are intentional and opaque. Do not remove the background.
- `stage_select_preview.png`: assembled reference only, NOT a gameplay sprite to import. Initial Cut Man highlight phase. The interior matches the sampled emulator image; the former black outer margins are now blue to match the corrected background.

For all imports: keep original dimensions; no trimming, smoothing, scaling or automatic background-colour removal. Preserve PNG alpha. Disable texture interpolation in the game settings.

## GMS 1.4 frame-strip import

Create `spr_mm1_stage_select_frame` in Sprites > Stage Select. Open Edit Sprite > File > Create from Strip, choose the strip PNG, then enter:

- Number of images: 2
- Images per row: 2
- Image width / height: 48 / 48
- Horizontal / vertical offset: 0 / 0
- Horizontal / vertical separation: 0 / 0

Keep both frames at 48 x 48 even though their opaque bounds are smaller. Do not crop them.

## Native drawing coordinates

Draw the background at (0,0). Coordinates assume top-left origins. Draw portraits and frames separately (either order works with these frame cutouts).

| Boss | Portrait X,Y | Frame X,Y | Name X,Y |
|---|---|---|---|
| Cut Man | 80,32 | 72,24 | 72,72 |
| Guts Man | 144,32 | 136,24 | 136,72 |
| Elec Man | 48,96 | 40,88 | 40,136 |
| Ice Man | 176,96 | 168,88 | 168,136 |
| Fire Man | 80,160 | 72,152 | 72,200 |
| Bomb Man | 144,160 | 136,152 | 136,200 |

Label strings: CUTMAN, GUTSMAN, ELECMAN, ICEMAN, FIREMAN, BOMBMAN.

Centre text cell origins:

| String | X,Y |
|---|---|
| SELECT | 104,96 |
| STAGE | 104,104 |
| PRESS | 104,120 |
| START | 104,128 |

In the sampled highlight phase, Cut Man's name is white and the other names are light cyan (RGB 176,255,255). Centre text is white. Selection implementation must handle both frame and name colour changes; exact blink phase remains a separate timing check. Existing font source pixels are near-white (255,254,255), so literal colour-exact tinting will require normalising that font source to pure white if desired; preview uses the existing glyph shapes with emulator text colours.

## Next implementation step

Import and verify the two frame subimages and six portraits before replacing the temporary stage-select drawing code. Do not add scoring resources: the recreation intentionally has no points system. Preserve the modular assets rather than flattening the preview into the final menu.

## Approved Mesen palette migration

Current PNGs now use the user-approved Mesen0.9.9 default2C02 palette, rather than the original JSNES RGB palette described above. Pixels, frame arrangement and alpha are unchanged, including the borderless solid-blue background. The old RGB text-colour observations above are historical, not new target tint values. See `Assets/Palette Review/Mesen 0.9.9/MM1-STAGE-SELECT-IMPORT.md`. Actual Draw-code tint adjustment remains separate; no controller, audio or timing changes.
