// Replace ONLY draw_self() in the existing player Draw event.
// Keep reference/debug drawing after this section unchanged.
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
    draw_self();
}
