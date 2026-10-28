# MM5 grounded walking / normal wall-probe checkpoint

Reproduction: run `node tools/rom-recovery/walk-values.mjs` after generating mm5-stage.json. It asserts the supplied USA ROM's measured idle-to-right walking displacement: first update +1.296875 pixels, updates 2–6 stationary, updates 7–24 +1.296875. Four released-input updates do not displace the player. This is a grounded idle-start test, not a complete turning/airborne/slide matrix.

The probe intercepts original CPU entry $C5AA for player X=0. The normal right wall selector Y=0 maps through $C8E2 to a five-byte row at $C912: [2,8,247,9,11]. Left selector Y=1 maps to [2,248,247,9,11]. The first byte is the final sample index (2 means three samples); signed X offsets are +8/-8; signed starting Y is -9 with successive increments +9, +11. Thus the normal wall probes are (x +/-8, y-9), (x +/-8,y), (x +/-8,y+11). This is not an 8-pixel half-width rectangle used for all collisions: floor, ceiling, slide, ladders and object contacts have separate handling.

Next GMS1.4 resource: `Scripts > Mega Man > MM5 > Collision > scr_mm5_player_wall_blocked`.

```gml
// argument0: candidate player X
// argument1: candidate player Y
// argument2: direction (-1 left, +1 right)
var probe_x, probe_y, wall_dir;
wall_dir = sign(argument2);
if (wall_dir == 0) return false;
probe_x = floor(argument0) + wall_dir * 8;
probe_y = floor(argument1);
return (
    collision_point(probe_x, probe_y - 9,
                    obj_stage_solid, false, true) != noone
    || collision_point(probe_x, probe_y,
                       obj_stage_solid, false, true) != noone
    || collision_point(probe_x, probe_y + 11,
                       obj_stage_solid, false, true) != noone
);
```

This helper adapts the measured probe locations to this project's rectangle-region terrain. It does not port all NES metatile collision classes/resolution and is not called by the current falling-only Step event yet. It includes child objects such as Super Arm blocks through obj_stage_solid. Keep the user's confirmed vertical code and Draw diagnostics unchanged while creating the helper. No automatic sprite mask or Solid checkbox change is required.
