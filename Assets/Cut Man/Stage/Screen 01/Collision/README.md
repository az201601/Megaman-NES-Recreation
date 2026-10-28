# Cut Man screen 01 — collision and ladder setup

This pass creates geometry/markers only; it does not implement a player controller, automatic physics, READY, arrival or new sound effects. Leave the user's working queued stage music unchanged. Data is in native room coordinates.

## ROM observations

Observed the supplied USA ROM using JSNES2.1.0. Booted through title, Cut Man intro and arrival, then used controlled position probes plus directional inputs. Position probes restore an idle-floor emulator snapshot and explicitly relocate the player; they are collision tests, not recordings of a natural playthrough. Some probes retained subpixel movement and changed X by one pixel; exact collision tolerances and player mask extents are not established by these tests.

- Fall probes over ordinary roof portions settle with player reference Y84; floor gap x208 settles at Y180. These are consistent with support surfaces Y96 and192, respectively.
- Over the upper Super Arm block, player reference Y52 is consistent with its top Y64.
- Climbing at x88 from floor Y180 reaches reference Y84 at the roof. Sampled steady climb changes12 pixels per16frames, but final ladder exit has its own transition. Do not directly turn that into a finished player controller.
- Climbing at x168 from the upper-right block support (reference Y116) reaches roof reference Y84. The right ladder is only32pixels tall; the left is96pixels tall.
- Fall probes at both ladder tops can settle on the roof level. Tops need special passable ladder logic, not a full solid blocking the climb.
- Moving right at floor level from x112 stops at reference X120 at the block's left edge X128. Moving left from x200 is stopped at X200 by the block's right edge X192. Blocks themselves must supply collision and later be removable.
- Beige walls, windows and vents are scenery, not full building-shaped solids.

The roof rectangles below use the visible16pixel metatile band thickness. Top support levels and gaps were probed; exhaustive underside/edge tolerance and ladder-entry tests remain for the player pass. These markers are a starting geometry model, not a claim of cycle-exact player collision.

## Resources

```
Sprites > Stage Objects > Collision
    spr_stage_region_mask
Objects > Stage Collision
    obj_stage_solid
    obj_stage_ladder
    obj_stage_ladder_top
Scripts > Cut Man > Stage > Screen 01
    scr_mm1_cutman_screen01_collision
```

`Assets/Stage Objects/Collision/spr_stage_region_mask.png` is a fully opaque16x16 square. Import as one sprite, origin0,0, and explicitly use a full-image rectangular collision mask (left0,right15,top0,bottom15; precise collision off). Do not remove its white background colour.

Create three objects above, each with that mask sprite, Visible unchecked, Solid unchecked, Persistent unchecked, no events. They are queryable geometric regions; unchecking Solid is intentional because the future player controller resolves collisions explicitly.

Create the named script using the complete accompanying GML file. It creates5 ordinary terrain solids,2 ladder volumes and2 special ladder tops. It does NOT create the four Super Arm blocks and does not change visual tiles. Call once per room entry; do not manually duplicate regions in the room.

## Static rectangles

| Type | X | Y | Width | Height |
|---|---:|---:|---:|---:|
|Solid floor|0|192|256|48|
|Solid roof|0|96|80|16|
|Solid roof|96|96|64|16|
|Solid roof|176|96|16|16|
|Solid roof|224|96|32|16|
|Left ladder|80|96|16|96|
|Right ladder|160|96|16|32|
|Left ladder top|80|96|16|1|
|Right ladder top|160|96|16|1|

## Existing Super Arm object

Objects > Stage Objects > Super Arm > `obj_mm1_super_arm_block`: set Parent to `obj_stage_solid`, retaining its own32x32 sprite, Visible checked, Solid unchecked, Persistent unchecked, depth0. Set its own sprite's rectangular full-image mask to0..31 inclusive. Parent has no events, so no debug drawing/initialisation will be inherited. The existing four instances supply their own geometry and are not covered by permanent invisible rectangles. Later player collision queries against the parent include these child objects.

## Stage-controller additions (do not replace working audio code)

Objects > Cut Man > Stage > `obj_mm1_cutman_stage`.

Append to existing Create:

```gml
scr_mm1_cutman_screen01_collision();
show_stage_regions = false;
```

Step event (create if absent; otherwise append):

```gml
if (keyboard_check_pressed(vk_f2))
{
    show_stage_regions = !show_stage_regions;
}
```

Draw event (create if absent; preserve any unrelated existing drawing):

```gml
if (show_stage_regions)
{
    draw_set_alpha(0.35);
    draw_set_color(c_lime);

    with (obj_stage_solid)
    {
        draw_rectangle(bbox_left, bbox_top, bbox_right, bbox_bottom, false);
    }

    draw_set_color(c_yellow);

    with (obj_stage_ladder)
    {
        draw_rectangle(bbox_left, bbox_top, bbox_right, bbox_bottom, false);
    }

    draw_set_alpha(1);
    draw_set_color(c_aqua);

    with (obj_stage_ladder_top)
    {
        draw_line(bbox_left, bbox_top, bbox_right, bbox_top);
    }

    draw_set_alpha(1);
    draw_set_color(c_white);
}
```

Set controller depth to-100 so its diagnostic Draw event is in front of block objects at depth0 and visual tiles at depth1000. Normal room background stays behind both. Invisible geometry objects need not be made visible: the controller draws their bounding boxes explicitly.

## Test

- Run stage: scenery and music unchanged, no normal overlay.
- F2: green over the floor, roof segments and the four blocks; yellow on two ladders; cyan lines at the ladder tops.
- Left ladder should reach the floor; right should end on top of the upper-right block.
- No permanent green rectangles across the full beige building walls or the roof gap x192..223.
- F2 again hides overlay.

Visual overlay and script still require GMS1.4 runtime validation. Until a player controller exists, there is no movement/collision response to test and no new gameplay audio to add. The1-pixel top marker is an implementation device, not a sprite/region observed literally in the original ROM.
