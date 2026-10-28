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
