// PLAYER context. argument0 forced walk direction (-1,0,+1).
// Called once by victory active-update owner, NEVER alongside ordinary player Step.
// Preserves accepted MM5 wall/support/subpixel vertical probes and gravity order.
// No keyboard/jump/slide/fire calls. No fixed Y/floor tween. Current jump momentum
// survives the lethal handoff (explicit adaptation, not held-key emulation).
var walk_input, walk_amount;
var horizontal_left, horizontal_step, horizontal_sign;
var remaining_y, step_y, vertical_sign, next_y;
var probe_count, probe_index, probe_offset, probe_x, probe_y;
var hit_solid, hit_any, resolved_y, ceiling_hit, landed_this_step;

// A blocked short-body slide cannot be forced upright through an overhang.
// Boss arena has no such overhang; hold safely if room geometry changes later.
if (sliding)
{
    if (!scr_mm5_player_can_stand(x, y)) return false;
    sliding = false;
    slide_timer = 0;
}
grounded = false;
if (fall_speed >= 0) grounded = scr_mm5_player_supported(x, y);
// HORIZONTAL MOVEMENT
walk_input = sign(argument0);
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

grounded = false;
if (fall_speed >= 0) grounded = scr_mm5_player_supported(x, y);
if (grounded) fall_speed = 0;
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

            // Ladder tops are one-way: catch only downward crossings.
            if (vertical_sign > 0 && hit_solid == noone)
            {
                var crossed_ladder_top;
                crossed_ladder_top = collision_point(
                    probe_x, probe_y,
                    obj_stage_ladder_top, false, true
                );

                if (crossed_ladder_top != noone)
                {
                    if (y + feet_offset <= crossed_ladder_top.bbox_top
                        && next_y + feet_offset >= crossed_ladder_top.bbox_top)
                    {
                        hit_solid = crossed_ladder_top;
                    }
                }
            }

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

}
// VISUAL SELECTION — after movement, collision and landing audio.
// These changes do not move the player or alter collision probes.
image_speed = 0;

if (!grounded)
{
    sprite_index = spr_mm5_megaman_air;
    image_index = 0;
    anim_walk_frame = 0;
    anim_walk_timer = 0;
}
else if (walk_input == 0)
{
    sprite_index = spr_mm5_megaman_idle;
    image_index = 0;
    anim_walk_frame = 0;
    anim_walk_timer = 0;
}
else if (walk_pause > 0 || walk_amount == 0)
{
    // Retain the standing pose throughout grounded startup.
    sprite_index = spr_mm5_megaman_idle;
    image_index = 0;
    anim_walk_frame = 0;
    anim_walk_timer = 0;
}
else
{
    sprite_index = spr_mm5_megaman_walk;
    image_index = anim_walk_frame;

    // Four-frame loop; each frame lasts seven game updates.
    anim_walk_timer += 1;
    if (anim_walk_timer >= 7)
    {
        anim_walk_timer = 0;
        anim_walk_frame = (anim_walk_frame + 1) mod 4;
    }
}

return true;
