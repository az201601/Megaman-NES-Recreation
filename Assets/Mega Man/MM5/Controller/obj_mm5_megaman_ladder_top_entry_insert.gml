// Insert before the Up-to-grab block, after the missing-ladder check.
// Down enters only while grounded on a top marker, not while falling.
if (!on_ladder
    && grounded
    && fall_speed == 0
    && keyboard_check(vk_down)
    && !keyboard_check(vk_up))
{
    var ladder_entry_top, ladder_entry_region;

    ladder_entry_top = collision_point(
        floor(x), floor(y + feet_offset),
        obj_stage_ladder_top, false, true
    );

    if (ladder_entry_top != noone)
    {
        ladder_entry_region = collision_point(
            floor(x), ladder_entry_top.bbox_top,
            obj_stage_ladder, false, true
        );

        if (ladder_entry_region != noone)
        {
            on_ladder = true;
            ladder_instance = ladder_entry_region;
            y = ladder_entry_top.bbox_top - feet_offset;
            fall_speed = 0;
            grounded = false;
        }
    }
}
