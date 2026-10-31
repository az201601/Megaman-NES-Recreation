// Draw bottom-up removal over the recovered native open-door background.
// Keep explicit full closed mask; camera owns player motion during passage.
if (gate_open_rows > 0)
{
    if (gate_first) draw_sprite(spr_mm1_cutman_boss_gate_open_backdrop, 0, x, y);
    else draw_sprite(spr_mm1_cutman_second_gate_open_backdrop, 0, x, y);
}
if (gate_open_rows < 4)
    draw_sprite_part(sprite_index, 0, 0, 0, sprite_get_width(sprite_index),
        64 - gate_open_rows * 16, x, y);
