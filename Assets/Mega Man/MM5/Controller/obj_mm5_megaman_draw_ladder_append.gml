// Append AFTER the existing Draw code. Retain draw_self().
if (debug_ladder_detection)
{
    var ladder_debug_colour, ladder_debug_alpha;
    ladder_debug_colour = draw_get_color();
    ladder_debug_alpha = draw_get_alpha();

    // GMS 1.4: use the default font; draw_get_font() is unavailable.
    draw_set_font(-1);
    draw_set_alpha(1);
    draw_set_color(c_aqua);

    if (ladder_top_candidate != noone)
    {
        draw_text(x - 12, y - 28, "TOP");
    }
    else if (ladder_candidate != noone)
    {
        draw_text(x - 20, y - 28, "LADDER");
    }

    draw_set_color(ladder_debug_colour);
    draw_set_alpha(ladder_debug_alpha);
}
