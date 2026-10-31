// Same normal wall probes; narrow post-slide overhead-overlap grace only.
// argument0: candidate X; argument1: candidate Y; argument2: direction.
var probe_x, probe_y, wall_dir, probe_index, probe_offset, hit_wall;
wall_dir = sign(argument2);
if (wall_dir == 0) return false;
probe_x = floor(argument0) + wall_dir * 8;
probe_y = floor(argument1);
for (probe_index = 0; probe_index < 3; probe_index += 1)
{
    probe_offset = -9;
    if (probe_index == 1) probe_offset = 0;
    if (probe_index == 2) probe_offset = 11;
    hit_wall = collision_point(probe_x, probe_y + probe_offset,
        obj_stage_solid, false, true);
    if (hit_wall != noone)
    {
        // Only ignore an upper probe ALREADY inside this same overhead solid.
        // Side/body/feet contacts and newly entered upper obstacles still block.
        if (slide_overhang_fall && !grounded && fall_speed >= 0
            && probe_offset == -9 && hit_wall.bbox_bottom < floor(argument1))
        {
            if (collision_point(
                floor(x) + wall_dir * 8, probe_y + probe_offset,
                obj_stage_solid, false, true
            ) == hit_wall)
                continue;
        }

        return true;
    }
}
return false;
