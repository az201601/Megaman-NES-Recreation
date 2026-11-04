# Super Arm block — shared interactive stage object

`spr_mm1_super_arm_block.png` is one 32 x 32 frame extracted from the supplied first-screen reference. All four first-screen blocks use identical artwork. Preserve its black outline; do not automatically remove its corner/background colour. Origin (0,0); no cropping or scaling.

## GMS 1.4 resource folders

```
Sprites > Stage Objects > Super Arm
    spr_mm1_super_arm_block
Objects > Stage Objects > Super Arm
    obj_mm1_super_arm_block
```

Create the sprite using the matching PNG. Create a non-persistent object using that sprite, Visible enabled, Solid unchecked for now, depth0 (in front of scenery tiles at depth1000). No events are needed to display it. Leave its instance Creation Code empty. Set its future collision mask explicitly when player collision is implemented; do not rely on GameMaker's Solid checkbox to implement behaviour.

In Rooms > Cut Man > Stage > rm_mm1_cutman_stage place FOUR instances with top-left coordinates:

| X | Y |
|---|---|
|128|64|
|128|160|
|160|128|
|160|160|

Use the revised scenery tileset and entire revised tile-placement script together. The blocks must NOT also be present as room tiles. No automatic block instance creation is included in the tile script.

This corrects the visual/resource separation only. Collision, Super Arm eligibility, pickup, carrying, throwing, destruction and associated sound effects remain to be implemented and measured with player/weapon behaviour. No new audio event is appropriate merely for displaying a stationary block. The stage music setup is unchanged.

All four full 32 x 32 sprites are opaque artwork in the current source; the black areas are real block artwork, not transparency placeholders. Do not use background-colour removal.

## Approved Mesen palette update (colour only)

Current PNGs use the approved Mesen0.9.9 default2C02 palette rather than the original JSNES RGB output. This is palette matching, not direct Mesen capture. Pixel geometry, alpha, atlas layout and object separation are unchanged. For THIS update reload only the images; do NOT replace tile scripts or recreate objects/rooms/collision. Earlier geometry/import setup notes above are historical; completed player, block collision and ladders remain installed. See `Assets/Palette Review/Mesen 0.9.9/MM1-CUTMAN-STAGE-IMPORT.md`. Compositing123 tiles over sky matches scenery and adding four separate block sprites matches the full layout exactly.
