// Rectangular-terrain wall resolution using the current MM5 wall probes.
// argument0: candidate player X
// argument1: candidate player Y
// argument2: movement direction (-1 left, +1 right)
// Returns the resolved X. Does not move the player itself.

var wall_dir, probe_x, probe_y, probe_index, probe_offset;
var hit_wall, resolved_x;

wall_dir = sign(argument2);
resolved_x = argument0;

if (wall_dir == 0)
{
    return resolved_x;
}

probe_x = floor(argument0) + wall_dir * 8;
probe_y = floor(argument1);

for (probe_index = 0; probe_index < 3; probe_index += 1)
{
    probe_offset = -9;
    if (probe_index == 1) probe_offset = 0;
    if (probe_index == 2) probe_offset = 11;

    hit_wall = collision_point(
        probe_x, probe_y + probe_offset,
        obj_stage_solid, false, true
    );

    if (hit_wall != noone)
    {
        if (wall_dir > 0)
        {
            resolved_x = min(resolved_x, hit_wall.bbox_left - 8);
        }
        else
        {
            // bbox_right is inclusive: +1 gives the outer surface.
            resolved_x = max(resolved_x, hit_wall.bbox_right + 1 + 8);
        }
    }
}

return resolved_x;
