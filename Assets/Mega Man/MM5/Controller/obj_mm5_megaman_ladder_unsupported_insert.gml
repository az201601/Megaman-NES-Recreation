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
