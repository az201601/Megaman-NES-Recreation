// Boss context; called ONLY from player Draw replacement. Read-only.
if (!cmv_anim_started || cmv_phase < 6 || cmv_phase > 7) return;
var first_cell, cell_count, i, packed_cell, draw_x, draw_y;
first_cell = cmv_anim_offset[cmv_anim_age];
cell_count = cmv_anim_count[cmv_anim_age];
draw_x = floor(cmv_anim_x) - 128;
draw_y = floor(cmv_anim_y) - 180;
for (i = 0; i < cell_count; i += 1)
{
    packed_cell = cmv_anim_cell[first_cell + i];
    draw_sprite(spr_mm6_inroom_victory_tiles, (packed_cell >> 16) & 255,
        draw_x + ((packed_cell >> 8) & 255), draw_y + (packed_cell & 255));
}
