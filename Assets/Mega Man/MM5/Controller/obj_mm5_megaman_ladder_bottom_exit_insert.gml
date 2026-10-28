// Insert inside the attached-climbing block, immediately after:
// ladder_moving = (y != ladder_y_before);

    if (ladder_vertical_input > 0 && y >= ladder_y_max)
    {
        var ladder_bottom_supported;

        ladder_bottom_supported = (
            collision_point(
                floor(x) - 7, floor(y + feet_offset),
                obj_stage_solid, false, true
            ) != noone
            || collision_point(
                floor(x), floor(y + feet_offset),
                obj_stage_solid, false, true
            ) != noone
            || collision_point(
                floor(x) + 7, floor(y + feet_offset),
                obj_stage_solid, false, true
            ) != noone
        );

        if (ladder_bottom_supported)
        {
            on_ladder = false;
            ladder_instance = noone;
            ladder_moving = false;
            fall_speed = 0;
            grounded = true;

            sprite_index = spr_mm5_megaman_idle;
            image_speed = 0;
            image_index = 0;

            // Do not run ordinary jumping/physics again in the exit update.
            // Normal movement resumes on the next Step.
            exit;
        }
    }
