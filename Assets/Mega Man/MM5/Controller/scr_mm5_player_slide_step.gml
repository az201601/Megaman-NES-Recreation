// Call AFTER the initial ordinary support check, BEFORE horizontal walking.
// Returns true when this update has been handled; caller must exit.
// Standing-reference Y stays fixed; Draw offsets only the slide artwork by +2.
// Rectangle geometry is an adaptation, not a complete NES metatile engine.
var ss_input, ss_remaining, ss_amount, ss_next_x;
var ss_blocked, ss_probe, ss_px;

if (!sliding)
{
    if (!grounded || !keyboard_check(vk_down)
        || !keyboard_check_pressed(vk_space)) return false;

    // Require room for the wider, shorter body before entering.
    if (x < 14 || collision_rectangle(
        floor(x) - 14, floor(y - 3),
        floor(x) + 14, floor(y + feet_offset) - 1,
        obj_stage_solid, false, true
    ) != noone) return false;

    // Spawn at the pre-movement standing reference; no continuous emitter.
    if (!instance_exists(obj_mm5_slide_dust))
    {
        instance_create(x - 12, y + 7, obj_mm5_slide_dust);
    }

    slide_overhang_fall = false;
    sliding = true;
    slide_timer = slide_duration;
    slide_direction = sign(image_xscale);
    if (slide_direction == 0) slide_direction = 1;
    ss_input = keyboard_check(vk_right) - keyboard_check(vk_left);
    if (ss_input != 0) slide_direction = ss_input;
    fall_speed = 0;
}
else
{
    // Wider slide support; top markers remain one-way supports.
    grounded = false;
    for (ss_probe = 0; ss_probe < 3; ss_probe += 1)
    {
        ss_px = floor(x) + (ss_probe - 1) * 14;
        if (collision_point(ss_px, floor(y + feet_offset),
                obj_stage_solid, false, true) != noone
            || collision_point(ss_px, floor(y + feet_offset),
                obj_stage_ladder_top, false, true) != noone)
            grounded = true;
    }

    // Jump cancellation rejoins the existing jump controller this update.
    if (grounded && keyboard_check_pressed(vk_space)
        && !keyboard_check(vk_down)
        && scr_mm5_player_can_stand(x, y))
    {
        sliding = false;
        slide_timer = 0;
        fall_speed = 0;
        walk_pause = 0;
        walk_previous_input = 0;
        return false;
    }

    ss_input = keyboard_check(vk_right) - keyboard_check(vk_left);
    if (ss_input != 0 && ss_input != slide_direction)
    {
        slide_direction = ss_input;
        slide_timer = 0;
    }
}

image_xscale = slide_direction;
walk_pause = 0;
walk_previous_input = 0;
anim_walk_frame = 0;
anim_walk_timer = 0;
ss_blocked = false;
ss_remaining = slide_speed;

while (ss_remaining > 0)
{
    ss_amount = min(1, ss_remaining);
    ss_next_x = x + slide_direction * ss_amount;
    if (ss_next_x < 14 || collision_rectangle(
        floor(ss_next_x) - 14, floor(y - 3),
        floor(ss_next_x) + 14, floor(y + feet_offset) - 1,
        obj_stage_solid, false, true
    ) != noone)
    {
        ss_blocked = true;
        break;
    }
    x = ss_next_x;
    ss_remaining -= ss_amount;
}

if (ss_blocked) slide_timer = 0;
else slide_timer = max(0, slide_timer - 1);

// Recheck the wider feet after sliding sideways.
grounded = false;
for (ss_probe = 0; ss_probe < 3; ss_probe += 1)
{
    ss_px = floor(x) + (ss_probe - 1) * 14;
    if (collision_point(ss_px, floor(y + feet_offset),
            obj_stage_solid, false, true) != noone
        || collision_point(ss_px, floor(y + feet_offset),
            obj_stage_ladder_top, false, true) != noone)
        grounded = true;
}

// Support loss ends the slide even if an overhang blocks standing clearance.
// Preserve the accepted standing-reference air handoff; do not move Y twice.
if (!grounded)
{
    slide_overhang_fall = !scr_mm5_player_can_stand(x, y);
    sliding = false;
    slide_timer = 0;
    fall_speed = max(1, fall_speed);
    sprite_index = spr_mm5_megaman_air;
    image_speed = 0;
    image_index = 0;
    return true;
}

fall_speed = 0;
// Grounded tunnel behaviour remains unchanged.
if (slide_timer <= 0 && scr_mm5_player_can_stand(x, y))
{
    sliding = false;
    slide_timer = 0;
    sprite_index = spr_mm5_megaman_idle;
    image_speed = 0;
    image_index = 0;
    return true;
}

sprite_index = spr_mm5_megaman_slide;
image_speed = 0;
image_index = 0;
return true;
