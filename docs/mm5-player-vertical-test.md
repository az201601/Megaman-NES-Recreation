# MM5 player checkpoint — vertical support and landing only

Prior user-confirmed setup: `spr_mm5_megaman_idle` origin (16,16), `obj_mm5_megaman`, temporary room position (48,180), feet_offset=12. Diagnostic feet marker is green on the floor, magenta above it. Existing room solids/blocks/music remain unchanged.

Normal-fall ROM probe `tools/rom-recovery/fall-values.mjs` asserts 40 updates after forcing normal airborne state in Napalm Man and resetting only position to open air each frame. Velocity starts at zero: displacement sequence 0, .25, .5, ... 7; stored downward velocity sequence .25, .5, .75, ... 7. Thus move first, add gravity .25 second, cap downward velocity at 7. This is a controlled RAM-position experiment, not a natural long fall; no engine code is patched. Run after mm5-start.mjs and mm5-stage.mjs.

Append to `Objects > Player > MM5 > obj_mm5_megaman > Create > Execute Code`:

```gml
fall_speed = 0;
fall_gravity = 0.25;
fall_speed_max = 7;
```

Replace the current `obj_mm5_megaman > Step > Step > Execute Code` with:

```gml
// Vertical support-point test only; full body collision comes later.
var remaining_y, step_y, hit_solid;

grounded = (collision_point(
    x, floor(y + feet_offset),
    obj_stage_solid, false, true
) != noone);

if (grounded)
{
    fall_speed = 0;
}
else
{
    // MM5 uses the current velocity before applying gravity.
    remaining_y = fall_speed;

    // Sweep at most one pixel at a time so thin surfaces aren't skipped.
    while (remaining_y > 0)
    {
        step_y = min(1, remaining_y);

        hit_solid = collision_point(
            x, floor(y + feet_offset + step_y),
            obj_stage_solid, false, true
        );

        if (hit_solid != noone)
        {
            // Only landing from above is supported by this checkpoint.
            y = hit_solid.bbox_top - feet_offset;
            fall_speed = 0;
            grounded = true;
            break;
        }
        else
        {
            y += step_y;
            remaining_y -= step_y;
        }
    }

    if (!grounded)
    {
        fall_speed = min(fall_speed + fall_gravity, fall_speed_max);
    }
}
```

Keep built-in gravity/speed at their default zero, Solid unchecked, and the diagnostic Draw event unchanged. No keyboard input, jump, full collision rectangle, ceiling or wall resolution, ladders, death boundary, or arrival is installed. This is deliberately the previous center-foot probe extended to downward movement, not a claim of complete MM5 terrain collision.

Test one instance at (48,180): stays stationary, marker green. Then start at (48,140): falls, marker becomes green, stops at Y180. Restore (48,180) after testing. Do not spawn inside terrain. No falling/landing sound is added at this checkpoint; audio behavior remains to be verified before assigning a sound.
