// argument0: player reference X
// argument1: player reference Y
// Call only when not rising. Ladder tops support from above, not as walls.
var support_x, support_y, support_index, support_offset;
support_y = floor(argument1 + feet_offset);

for (support_index = 0; support_index < 3; support_index += 1)
{
    support_offset = -7;
    if (support_index == 1) support_offset = 0;
    if (support_index == 2) support_offset = 7;
    support_x = floor(argument0) + support_offset;

    if (collision_point(
        support_x, support_y, obj_stage_solid, false, true
    ) != noone)
    {
        return true;
    }

    if (collision_point(
        support_x, support_y, obj_stage_ladder_top, false, true
    ) != noone)
    {
        return true;
    }
}

return false;
