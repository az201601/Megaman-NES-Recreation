// Insert after ladder_moving is computed, before the bottom-exit block.
    if (ladder_vertical_input < 0 && y <= ladder_y_min)
    {
        var ladder_exit_top;

        ladder_exit_top = collision_point(
            floor(x), floor(y + feet_offset),
            obj_stage_ladder_top, false, true
        );

        if (ladder_exit_top != noone)
        {
            y = ladder_exit_top.bbox_top - feet_offset;
            on_ladder = false;
            ladder_instance = noone;
            ladder_moving = false;
            fall_speed = 0;
            grounded = true;
            walk_pause = 0;
            walk_previous_input = 0;

            sprite_index = spr_mm5_megaman_idle;
            image_speed = 0;
            image_index = 0;

            ladder_candidate = noone;
            ladder_top_candidate = ladder_exit_top;

            // Resume ordinary standing/walking on the following Step.
            exit;
        }
    }
