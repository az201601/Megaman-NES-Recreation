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
