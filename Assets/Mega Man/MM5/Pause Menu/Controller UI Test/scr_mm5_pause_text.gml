// Script. argument0=text,1=x,2=y,3=colour. Original38-cell sprite alphabet.
var text_value, text_x, text_y, text_colour, alphabet, glyph, i;
text_value = string(argument0);
text_x = argument1;
text_y = argument2;
text_colour = argument3;
// White glyph PNG uses254 green. Compensate cyan tint so output stays176, not175.
if (text_colour == make_color_rgb(100, 176, 255)) text_colour = make_color_rgb(100, 177, 255);
alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .";
for (i = 1; i <= string_length(text_value); i += 1)
{
    glyph = string_pos(string_char_at(text_value, i), alphabet) - 1;
    if (glyph >= 0)
    {
        draw_sprite_ext(spr_mm5_pause_font, glyph, text_x + (i - 1) * 8,
            text_y, 1, 1, 0, text_colour, 1);
    }
}
