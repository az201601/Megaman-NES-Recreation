// MM5 player checkpoint: walk, jump and rectangular-terrain collision.
// Requires the Create variables and two wall scripts listed in README-jumping.md.
// Space = jump. Arrow keys = move. No slide, ladders or arrival yet.

var walk_input, walk_amount;
var horizontal_left, horizontal_step, horizontal_sign;
var remaining_y, step_y, vertical_sign, next_y;
var probe_count, probe_index, probe_offset, probe_x, probe_y;
var hit_solid, hit_any, resolved_y, ceiling_hit, landed_this_step;

// Support uses the measured normal-floor probes: X -7, 0, +7; Y +12.
grounded = false;
if (fall_speed >= 0)
{
    grounded = (
        collision_point(floor(x) - 7, floor(y + feet_offset),
                        obj_stage_solid, false, true) != noone
        || collision_point(floor(x), floor(y + feet_offset),
                           obj_stage_solid, false, true) != noone
        || collision_point(floor(x) + 7, floor(y + feet_offset),
                           obj_stage_solid, false, true) != noone
    );
}

// HORIZONTAL MOVEMENT
walk_input = keyboard_check(vk_right) - keyboard_check(vk_left);
walk_amount = walk_input * walk_speed;

if (walk_input == 0)
{
    walk_pause = 0;
}
else
{
    image_xscale = walk_input;
    if (!grounded)
    {
        walk_pause = 0;
    }
    else if (walk_previous_input == 0)
    {
        walk_pause = 5;
    }
    else if (walk_pause > 0)
    {
        walk_pause -= 1;
        walk_amount = 0;
    }
}
walk_previous_input = walk_input;
horizontal_left = abs(walk_amount);
horizontal_sign = sign(walk_amount);

while (horizontal_left > 0)
{
    horizontal_step = min(1, horizontal_left);
    if (scr_mm5_player_wall_blocked(
        x + horizontal_sign * horizontal_step, y, horizontal_sign
    ))
    {
        x = scr_mm5_player_wall_limit(
            x + horizontal_sign * horizontal_step, y, horizontal_sign
        );
        break;
    }
    x += horizontal_sign * horizontal_step;
    horizontal_left -= horizontal_step;
}

// Temporary fixed-room left boundary, retained from the earlier checkpoint.
if (x < 8) x = 8;

// Recheck support AFTER horizontal movement.
grounded = false;
if (fall_speed >= 0)
{
    grounded = (
        collision_point(floor(x) - 7, floor(y + feet_offset),
                        obj_stage_solid, false, true) != noone
        || collision_point(floor(x), floor(y + feet_offset),
                           obj_stage_solid, false, true) != noone
        || collision_point(floor(x) + 7, floor(y + feet_offset),
                           obj_stage_solid, false, true) != noone
    );
}

if (grounded)
{
    fall_speed = 0;
    if (keyboard_check_pressed(vk_space))
    {
        fall_speed = -jump_speed;
        grounded = false;
        walk_pause = 0;
    }
}

// VERTICAL MOVEMENT
landed_this_step = false;
ceiling_hit = false;

if (!grounded)
{
    remaining_y = abs(fall_speed);
    vertical_sign = sign(fall_speed);

    while (remaining_y > 0)
    {
        step_y = min(1, remaining_y);
        next_y = y + vertical_sign * step_y;
        resolved_y = next_y;
        hit_any = false;

        if (vertical_sign > 0)
        {
            probe_count = 3;
            probe_y = floor(next_y + feet_offset);
        }
        else
        {
            probe_count = 2;
            probe_y = floor(next_y - head_offset);
        }

        for (probe_index = 0; probe_index < probe_count; probe_index += 1)
        {
            probe_offset = -7;
            if (vertical_sign > 0)
            {
                if (probe_index == 1) probe_offset = 0;
                if (probe_index == 2) probe_offset = 7;
            }
            else
            {
                if (probe_index == 1) probe_offset = 7;
            }

            probe_x = floor(x) + probe_offset;
            hit_solid = collision_point(
                probe_x, probe_y, obj_stage_solid, false, true
            );

            if (hit_solid != noone)
            {
                hit_any = true;
                if (vertical_sign > 0)
                {
                    resolved_y = min(resolved_y,
                                     hit_solid.bbox_top - feet_offset);
                }
                else
                {
                    resolved_y = max(resolved_y,
                                     hit_solid.bbox_bottom + 1 + head_offset);
                }
            }
        }

        if (hit_any)
        {
            y = resolved_y;
            if (vertical_sign > 0)
            {
                fall_speed = 0;
                grounded = true;
                landed_this_step = true;
            }
            else
            {
                // MM5's normal ceiling path resets vertical speed downward to 1.
                fall_speed = 1;
                ceiling_hit = true;
            }
            break;
        }

        y = next_y;
        remaining_y -= step_y;
    }

    if (!grounded && !ceiling_hit)
    {
        // Move first, then apply gravity.
        fall_speed = min(fall_speed + fall_gravity, fall_speed_max);
    }

    // MM5 release cut occurs AFTER that update's upward movement.
    if (!keyboard_check(vk_space) && fall_speed < 0)
    {
        fall_speed = 0;
    }
}

// Landing audio intentionally disabled pending review of the replacement.
// Keep landed_this_step for animation and future verified audio playback.
