// Replace the existing bounded ladder movement section only.
ladder_y_before = y;

var ladder_target_y, ladder_up_blocked;
var ladder_next_y, ladder_hit_left, ladder_hit_right;

ladder_target_y = max(ladder_y_min,
    y + ladder_vertical_input * ladder_speed
);
ladder_up_blocked = false;

// Upward solid sweep. Ladder tops are deliberately NOT ceiling solids.
if (ladder_target_y < y)
{
    while (y > ladder_target_y)
    {
        ladder_next_y = max(ladder_target_y, y - 1);

        ladder_hit_left = collision_point(
            floor(x) - 7, floor(ladder_next_y - head_offset),
            obj_stage_solid, false, true
        );
        ladder_hit_right = collision_point(
            floor(x) + 7, floor(ladder_next_y - head_offset),
            obj_stage_solid, false, true
        );

        if (ladder_hit_left != noone || ladder_hit_right != noone)
        {
            if (ladder_hit_left != noone)
                ladder_next_y = max(ladder_next_y,
                    ladder_hit_left.bbox_bottom + 1 + head_offset);

            if (ladder_hit_right != noone)
                ladder_next_y = max(ladder_next_y,
                    ladder_hit_right.bbox_bottom + 1 + head_offset);

            y = ladder_next_y;
            ladder_up_blocked = true;
            break;
        }

        y = ladder_next_y;
    }
}
else
{
    // Downward obstacle handling is a separate checkpoint.
    y = ladder_target_y;
}

// A blocked Up command holds the climbing phase even on first contact.
ladder_moving = (y != ladder_y_before && !ladder_up_blocked);
