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
