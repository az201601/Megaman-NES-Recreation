else if (ladder_target_y > y)
{
    var ladder_floor_hit, ladder_floor_probe, ladder_floor_x;
    var ladder_floor_solid, ladder_floor_y;

    while (y < ladder_target_y)
    {
        ladder_next_y = min(ladder_target_y, y + 1);
        ladder_floor_hit = false;
        ladder_floor_y = ladder_next_y;

        // Same three feet probes as ordinary downward collision.
        // Exclude ladder-top markers so descending through them still works.
        for (ladder_floor_probe = 0; ladder_floor_probe < 3;
             ladder_floor_probe += 1)
        {
            ladder_floor_x = floor(x) - 7;
            if (ladder_floor_probe == 1) ladder_floor_x = floor(x);
            if (ladder_floor_probe == 2) ladder_floor_x = floor(x) + 7;

            ladder_floor_solid = collision_point(
                ladder_floor_x, floor(ladder_next_y + feet_offset),
                obj_stage_solid, false, true
            );

            if (ladder_floor_solid != noone)
            {
                ladder_floor_hit = true;
                ladder_floor_y = min(ladder_floor_y,
                    ladder_floor_solid.bbox_top - feet_offset);
            }
        }

        if (ladder_floor_hit)
        {
            y = ladder_floor_y;
            on_ladder = false;
            ladder_instance = noone;
            ladder_moving = false;
            fall_speed = 0;
            grounded = true;
            walk_pause = 0;
            walk_previous_input = 0;
            anim_walk_frame = 0;
            anim_walk_timer = 0;

            sprite_index = spr_mm5_megaman_idle;
            image_speed = 0;
            image_index = 0;

            ladder_candidate = noone;
            ladder_top_candidate = noone;

            // Normal controls resume next Step; no second physics pass here.
            exit;
        }

        y = ladder_next_y;
    }
}
else
{
    // No vertical input: preserve the attached hold.
    y = ladder_target_y;
}
