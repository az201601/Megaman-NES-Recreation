// Replace ONLY the existing if(sliding)...else draw_self() visual block.
// Keep all existing debug drawing AFTER this block. Do not append a second draw.
if (sliding)
{
    draw_sprite_ext(
        sprite_index, image_index, x, y + 2,
        image_xscale, image_yscale, image_angle,
        image_blend, image_alpha
    );
}
else
{
    var buster_draw_sprite, buster_draw_frame;
    buster_draw_sprite = sprite_index;
    buster_draw_frame = image_index;
    if (buster_pose_timer > 0)
    {
        if (sprite_index == spr_mm5_megaman_idle)
        {
            buster_draw_sprite = spr_mm5_megaman_idle_shoot;
            buster_draw_frame = 0;
        }
        else if (sprite_index == spr_mm5_megaman_walk)
        {
            buster_draw_sprite = spr_mm5_megaman_walk_shoot;
        }
        else if (sprite_index == spr_mm5_megaman_air)
        {
            buster_draw_sprite = spr_mm5_megaman_air_shoot;
            buster_draw_frame = 0;
        }
        else if (sprite_index == spr_mm5_megaman_climb)
        {
            buster_draw_sprite = spr_mm5_megaman_climb_shoot;
            buster_draw_frame = 0;
        }
    }
    draw_sprite_ext(
        buster_draw_sprite, buster_draw_frame, x, y,
        image_xscale, image_yscale, image_angle,
        image_blend, image_alpha
    );
}
