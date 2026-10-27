// OBJECT: par_enemy  |  EVENT: Draw
if (flash > 0 && (flash div 2) mod 2 == 0) {
    draw_sprite_ext(sprite_index, image_index, x, y, image_xscale, image_yscale,
                    0, c_white, 1);
    draw_set_blend_mode(bm_add);
    draw_sprite_ext(sprite_index, image_index, x, y, image_xscale, image_yscale,
                    0, c_white, 0.8);
    draw_set_blend_mode(bm_normal);
} else draw_self();
