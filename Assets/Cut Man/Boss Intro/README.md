# Cut Man — Boss Intro graphics

Native-resolution graphics prepared from the supplied USA ROM using JSNES 2.1.0. No smoothing or resampling. Emulator palette values are not a unique hardware NES palette. Backgrounds extend edge-to-edge to match the recreation's current presentation. No points text is baked into any asset.

## GMS folders and resources

```
Sprites
└── Cut Man
    └── Boss Intro
        ├── spr_mm1_cutman_boss_intro
        └── spr_mm1_cutman_boss_intro_background
```

### spr_mm1_cutman_boss_intro_strip3.png

Create resource `spr_mm1_cutman_boss_intro`. Sprite Editor > File > Create from Strip:

- Number of images: 3
- Images per row: 3
- Image width / height: 32 / 32
- Both offsets: 0
- Both separations: 0
- Origin: (0,0)

Subimage 0: jumping pose. Subimage 1: standing pose A. Subimage 2: standing pose B. Transparent pixels are intentional. Preserve all 32 x 32 cells; do not trim. The animation is controlled explicitly in code later, not with automatic image_speed.

These are extracted from normal-palette frames 10, 73 and 77. Standing poses draw at (80,97). Jumping top-left positions are recorded in `docs/cutman-intro-jump.csv` for rendered frames 2–65. The source ROM is not modified on disk.

### spr_mm1_cutman_boss_intro_background_strip2.png

Create resource `spr_mm1_cutman_boss_intro_background`. Sprite Editor > File > Create from Strip:

- Number of images: 2
- Images per row: 2
- Image width / height: 256 / 240
- Both offsets: 0
- Both separations: 0
- Origin: (0,0)

Subimage 0: blue field / dark blue band. Subimage 1: white field / near-white band. Draw at (0,0). Dark band covers Y=80..143. Keep backgrounds opaque: do NOT remove background colour.

### cutman_boss_intro_preview.png

Reference only, not a sprite to import. Shows the normal background, standing pose, and fully revealed name without points information. The actual sequence will animate and reveal its name using the shared font.

## Related audio

Import `Assets/Audio/Cut Man/Boss Intro/snd_mm1_cutman_boss_intro.wav` as described in that directory's README. Do not add a generic navigation beep to confirmation; the intro capture includes the confirmation sweep.

## Current implementation status

Import assets first. The user's current stage-select code is not changed yet. The next instructions must create `obj_mm1_cutman_boss_intro` and `rm_mm1_cutman_boss_intro` in Objects/Rooms > Cut Man > Boss Intro, then implement Cut Man-only confirmation and the measured intro sequence with its audio. No score variables, points display, or points sound should be added.
