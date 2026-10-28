// LADDER MOVEMENT — region-based entry, climbing, drop and supported endpoints.
// Insert at the very TOP of the existing Step event, before normal physics.
// Up grabs; Up/Down climb; fresh neutral-vertical Space drops. Supported bottom/top exits and Down entry are installed.
var ladder_grab_candidate;

if (on_ladder)
{
    if (!instance_exists(ladder_instance))
    {
        on_ladder = false;
        ladder_instance = noone;
    }
}

// Insert before the Up-to-grab block, after the missing-ladder check.
// Down enters only while grounded on a top marker, not while falling.
if (!on_ladder
    && !sliding
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
            anim_climb_frame = 0;
            anim_climb_timer = 0;
            y = ladder_entry_top.bbox_top - feet_offset;
            fall_speed = 0;
            grounded = false;
        }
    }
}

if (!on_ladder && !sliding && keyboard_check(vk_up))
{
    ladder_grab_candidate = collision_point(
        floor(x), floor(y), obj_stage_ladder, false, true
    );

    if (ladder_grab_candidate == noone)
    {
        ladder_grab_candidate = collision_point(
            floor(x), floor(y) - 11,
            obj_stage_ladder, false, true
        );
    }

    if (ladder_grab_candidate != noone)
    {
        on_ladder = true;
        ladder_instance = ladder_grab_candidate;
        anim_climb_frame = 0;
        anim_climb_timer = 0;
    }
}

// Insert AFTER the Up-to-grab block and BEFORE the attached-climbing block.
// Fresh Space releases only when neither Up nor Down is held.
if (on_ladder
    && keyboard_check_pressed(vk_space)
    && !keyboard_check(vk_up)
    && !keyboard_check(vk_down))
{
    on_ladder = false;
    ladder_instance = noone;
    ladder_moving = false;

    // Release into a fall, NOT an upward jump.
    fall_speed = 1;
    grounded = false;
    walk_pause = 0;
    walk_previous_input = 0;
    anim_walk_frame = 0;
    anim_walk_timer = 0;

    sprite_index = spr_mm5_megaman_air;
    image_speed = 0;
    image_index = 0;

    // The ROM release update does not displace Y.
    // Resume ordinary movement/gravity on the following Step.
    exit;
}

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

    // Top bound and supported-bottom reference; unsupported descent is unbounded.
    ladder_y_min = ladder_instance.bbox_top - feet_offset;
    ladder_y_max = ladder_instance.bbox_bottom + 1 - feet_offset;

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

    // A blocked Up command holds the climbing phase even on first contact.
    ladder_moving = (y != ladder_y_before && !ladder_up_blocked);

    // Insert after ladder_moving is calculated, BEFORE the top/bottom exit checks.
    // The upper body probe is the last one to leave the ladder's lower edge.
    if (floor(y) - 11 > ladder_instance.bbox_bottom)
    {
        on_ladder = false;
        ladder_instance = noone;
        ladder_moving = false;
        grounded = false;
        fall_speed = 1;

        sprite_index = spr_mm5_megaman_air;
        image_speed = 0;
        image_index = 0;

        ladder_candidate = noone;
        ladder_top_candidate = noone;

        // Climbing already moved this update. Gravity resumes next Step.
        exit;
    }

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

    // Replace only the temporary standing-art section inside attached climbing.
    // Keep this BEFORE its diagnostic updates and final exit.
    image_speed = 0;

    // Functional lip-band selection for the current rectangular ladder regions.
    // This does not add a delay or alter the working entry/exit movement.
    if (y < ladder_instance.bbox_top)
    {
        sprite_index = spr_mm5_megaman_ladder_top;
        image_index = 0;
    }
    else
    {
        sprite_index = spr_mm5_megaman_climb;
        image_index = anim_climb_frame;
    }

    if (ladder_moving)
    {
        anim_climb_timer += 1;
        if (anim_climb_timer >= 9)
        {
            anim_climb_timer = 0;
            anim_climb_frame = (anim_climb_frame + 1) mod 2;
        }
    }
    else
    {
        // Hold the pose. ROM neutral input resets cadence rather than
        // preserving a partially elapsed interval (renderer ends at one).
        anim_climb_timer = 1;
    }

    ladder_candidate = ladder_instance;
    ladder_top_candidate = collision_point(
        floor(x), floor(y + feet_offset),
        obj_stage_ladder_top, false, true
    );

    // Keep normal walking, gravity, jumping and animation selection suspended.
    exit;
}

// MM5 player checkpoint: walk, jump and rectangular-terrain collision.
// Requires the Create variables and two wall scripts listed in README-jumping.md.
// Space = jump; Down + fresh Space = slide; arrow keys = move. Arrival pending.

var walk_input, walk_amount;
var horizontal_left, horizontal_step, horizontal_sign;
var remaining_y, step_y, vertical_sign, next_y;
var probe_count, probe_index, probe_offset, probe_x, probe_y;
var hit_solid, hit_any, resolved_y, ceiling_hit, landed_this_step;

// Support uses the measured normal-floor probes: X -7, 0, +7; Y +12.
grounded = false;
if (fall_speed >= 0)
{
    grounded = scr_mm5_player_supported(x, y);
}

// Slide handles its own movement/visuals; ordinary walking is skipped.
if (scr_mm5_player_slide_step()) exit;

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
    grounded = scr_mm5_player_supported(x, y);
}

if (grounded)
{
    fall_speed = 0;
    if (keyboard_check_pressed(vk_space) && !keyboard_check(vk_down))
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

    // MM5 release cut occurs AFTER that update's upward movement.
    if (!keyboard_check(vk_space) && fall_speed < 0)
    {
        fall_speed = 0;
    }
}

// Approved direct-game recording: play once on each downward landing.
if (landed_this_step)
{
    audio_play_sound(snd_mm5_megaman_land, 1, false);
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

// LADDER DETECTION ONLY — does not attach, align or move the player.
ladder_candidate = collision_point(
    floor(x), floor(y), obj_stage_ladder, false, true
);

if (ladder_candidate == noone)
{
    ladder_candidate = collision_point(
        floor(x), floor(y) - 11, obj_stage_ladder, false, true
    );
}

ladder_top_candidate = collision_point(
    floor(x), floor(y + feet_offset),
    obj_stage_ladder_top, false, true
);
