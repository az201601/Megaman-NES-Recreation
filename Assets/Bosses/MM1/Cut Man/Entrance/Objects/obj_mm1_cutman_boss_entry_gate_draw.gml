// Incoming boss-room shutter, NOT either existing doorway at2272/3056.
if (gate_open_rows > 0) draw_sprite(spr_mm1_cutman_boss_entry_backdrop, 0, x, y);
if (gate_open_rows < 4)
    draw_sprite_part(sprite_index, 0, 0, 0, sprite_get_width(sprite_index),
        64 - gate_open_rows * 16, x, y);
