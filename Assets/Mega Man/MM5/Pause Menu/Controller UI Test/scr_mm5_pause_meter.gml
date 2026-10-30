// Script.0=value0..28,1=selected,2=x,3=y. Prototype fill drawing, not ROM empty-state proof.
var value, style;
value = clamp(floor(argument0), 0, 28);
style = 0;
if (argument1) style = 1;
if (value > 0)
{
    draw_sprite_part(spr_mm5_pause_meter_styles, style, 0, 0,
        value * 2, 8, argument2, argument3);
}
