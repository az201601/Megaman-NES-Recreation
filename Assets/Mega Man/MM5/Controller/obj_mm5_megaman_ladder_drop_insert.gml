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
