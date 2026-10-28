# Cut Man Stage — Screen 01: static layout

Prepared from the supplied USA ROM in JSNES 2.1.0 with sprite rendering disabled for the capture. The emulator's `clipToTvSize` option is disabled and left-background rendering is enabled, so TV-cropping borders are not baked into the assets. READY, Mega Man, the health meter and original score are not part of these assets. In particular, do not add the original score to this recreation.

## Separation

- `bg_mm1_cutman_screen01_background.png`: 256 x 240 opaque image containing only solid cyan sky; all building walls are tiles. This is the bottom room background.
- `bg_mm1_cutman_screen01_tileset.png`: 128 x 32 RGBA atlas containing 11 unique 16 x 16 visual tiles (five unused cells). Includes a reusable beige wall-fill tile, wall/decor combinations, railings, ladders, brickwork, windows and vents. Only cyan sky pixels are transparent; wall colours are carried by the tiles themselves. Some tiles are composites of adjacent decorative/terrain details; this atlas is scoped to the first screen, not claimed as a complete reusable stage-wide tile catalogue.
- `cutman_screen01_layout_reference.png`: assembled reference, not a room background to import.
- `tile-placement.csv`: all 123 visual tile placements with source and room coordinates.
- `scr_mm1_cutman_screen01_tiles.gml`: automatically places those visual tiles at depth 1000. Call once per room entry, not every Step or Draw.

Validation: background + scenery tiles + four Super Arm block sprites reconstruct the sprite-free, uncropped source frame with zero differing RGBA pixels. Images are native resolution, without resampling. Palette is the emulator's RGB output.

## Resource folders

```
Backgrounds > Cut Man > Stage
    bg_mm1_cutman_screen01_background
    bg_mm1_cutman_screen01_tileset
Scripts > Cut Man > Stage > Screen 01
    scr_mm1_cutman_screen01_tiles
Objects > Cut Man > Stage
    obj_mm1_cutman_stage
Rooms > Cut Man > Stage
    rm_mm1_cutman_stage
Sounds > Cut Man > Stage
    snd_mm1_cutman_stage
```

## Import

Both PNG assets are GMS 1.4 **Background resources**, not Sprites. Import the background normally, preserving all 256 x 240 pixels. Import the atlas with Use as tile set enabled, tile width/height 16, offsets 0, separations 0. Preserve PNG alpha; do not remove a corner/background colour or crop the image. Keep pixel interpolation off.

Create the script resource with the exact name above and copy the complete supplied GML file into it. The code uses GMS 1.4 `tile_add` with the Background atlas and a depth of 1000. It does not provide collision or ladder behaviour.

Create `rm_mm1_cutman_stage` at 256 x 240, speed60, views disabled. Room Backgrounds: choose bottom background, Visible when room starts on, Foreground off, position0,0, horizontal/vertical tiling off, Stretch off, speed0. Keep room background-colour clearing enabled. The image fills the room.

Create non-persistent `obj_mm1_cutman_stage`, sprite <no sprite>. Place one instance in the stage room, with empty instance Creation Code.

### Stage audio and Create/Alarm/Room End events (updated)

The original single-file looping audio instructions are superseded. That export omitted the song's one-time opening and started at the wrong phrase. Follow `Assets/Audio/Cut Man/Stage/PLAYBACK-GMS14.md` for the replacement Create, Alarm0, Async Audio Playback and Room End events. The replacement Create event retains `scr_mm1_cutman_screen01_tiles();` so visual tile placement is unchanged.

Add the two supplied PCM files as Included Files and use the queued opening/main playback path. Do not also play the Sound resource directly, and do not loop the combined reference recording.

No Draw or Step event is needed yet. Runtime-created visual tiles are room-owned; do not also manually place the same tiles in the editor. They appear when running, not as editor-placed tiles. The CSV and reference are provided if editor placement is preferred instead.

## Connect the existing intro

In Objects > Cut Man > Boss Intro > obj_mm1_cutman_boss_intro, append to the bottom of its existing Step event:

```gml
if (intro_frame >= 414)
{
    room_goto(rm_mm1_cutman_stage);
    exit;
}
```

Retain its existing timer, sound handling and Room End cleanup.

## Current scope / next pass

This is a static scene and stage-music test only. No player, READY sequence, HUD, collision, ladders, enemies, spikes, boss doors or Guts blocks are implemented by these visual tiles. Invisible collision solids and ladder detection will be added separately based on behaviour measurements. Flat beige walls and windows are scenery, not automatic solid terrain. The tile placement script must not be treated as collision data.

The next gameplay pass should measure and implement Mega Man's arrival, movement/collision, and ladder behaviour with their required audio. Extend beyond this first screen only after validating it.

## Cleaner background / tile separation update

The bottom background is now cyan-only. Beige building silhouettes have been removed from that image and represented in the tileset, including a reusable solid wall-fill tile. The final layout reference is intentionally unchanged. Tile coordinates inside the atlas have changed: replace BOTH PNG resources and the ENTIRE placement script together. Do not mix the old atlas or old CSV/script with the new versions. All resource names, image dimensions, 16 x 16 import settings, depths, room coordinates and audio setup stay unchanged.

Previous wall-separation validation (before the Super Arm correction): 14 unique tiles, 135 placements, 128 x 32 atlas, 256 x 240 single-colour background. That earlier wall-only separation preserved the complete reference; the Super Arm correction below supersedes its tile placements. Runtime GMS validation remains on the user's local project.

## Super Arm block correction (current setup)

The four green 32 x 32 Super Arm blocks were incorrectly included as scenery. They are now removed from the tile atlas and visual tile script. The current atlas has 11 unique tiles; the current script has 123 placements. Atlas remains128 x32; tile size remains16 x16. Replace atlas and the entire script together.

Shared sprite: `Assets/Stage Objects/Super Arm/spr_mm1_super_arm_block.png` (32 x32, origin0,0). Create `obj_mm1_super_arm_block` using that sprite and place four instances according to `object-placement.csv`: (128,64), (128,160), (160,128), (160,160). Do not add automatic instance creation to the tile script if placing these manually. See the shared sprite README for object setup and current behaviour limitations.

`cutman_screen01_scenery_reference.png` shows the scenery without those objects. `cutman_screen01_layout_reference.png` remains the complete intended scene including the blocks. Where a block covers a building wall, the underlying scenery now contains wall-fill tiles; other block locations reveal sky if their object is removed.

Validation: background + scenery tiles matches the scenery reference exactly. Compositing the four block sprites at the listed positions then matches the complete reference exactly. Player collision, lifting, throwing, breaking and their audio are not implemented in this asset correction.

## Approved Mesen palette update (colour only)

Current PNGs use the approved Mesen0.9.9 default2C02 palette rather than the original JSNES RGB output. This is palette matching, not direct Mesen capture. Pixel geometry, alpha, atlas layout and object separation are unchanged. For THIS update reload only the images; do NOT replace tile scripts or recreate objects/rooms/collision. Earlier geometry/import setup notes above are historical; completed player, block collision and ladders remain installed. See `Assets/Palette Review/Mesen 0.9.9/MM1-CUTMAN-STAGE-IMPORT.md`. Compositing123 tiles over sky matches scenery and adding four separate block sprites matches the full layout exactly.
