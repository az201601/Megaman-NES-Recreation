// Replace only the attached-ladder block in Step with this checkpoint.
if (on_ladder)
{
    var ladder_vertical_input;
    var ladder_y_min, ladder_y_max, ladder_y_before;

    x = (
        ladder_instance.bbox_left
        + ladder_instance.bbox_right
        + 1
    ) / 2;

    fall_speed = 0;
    grounded = false;
    walk_pause = 0;
    walk_previous_input = 0;
    anim_walk_frame = 0;
    anim_walk_timer = 0;

    // Up = negative Y; Down = positive Y.
    ladder_vertical_input = keyboard_check(vk_down)
                          - keyboard_check(vk_up);

    // Temporary endpoint bounds: stay attached at both ends.
    ladder_y_min = ladder_instance.bbox_top - feet_offset;
    ladder_y_max = ladder_instance.bbox_bottom + 1 - feet_offset;

    ladder_y_before = y;
    y = max(ladder_y_min, min(
        y + ladder_vertical_input * ladder_speed,
        ladder_y_max
    ));
    ladder_moving = (y != ladder_y_before);

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

    // Temporary artwork; ladder poses are not installed yet.
    sprite_index = spr_mm5_megaman_idle;
    image_speed = 0;
    image_index = 0;

    ladder_candidate = ladder_instance;
    ladder_top_candidate = collision_point(
        floor(x), floor(y + feet_offset),
        obj_stage_ladder_top, false, true
    );

    // Keep normal walking, gravity, jumping and animation selection suspended.
    exit;
}
