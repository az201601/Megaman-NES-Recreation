// SCRIPT: scr_mm_draw_bar(x, bottom_y, value, max_value, colour)
// Draws the 28-pip vertical energy bar used on the NES HUD.
var bx, by, v, mv, col, i;
bx = argument0; by = argument1; v = argument2; mv = argument3; col = argument4;
for (i = 0; i < mv; i += 1) {
    if (i < v) draw_set_color(col); else draw_set_color(c_black);
    draw_rectangle(bx, by - i*3, bx + 8, by - i*3 + 1, false);
    draw_set_color(c_white);
    draw_rectangle(bx, by - i*3, bx + 8, by - i*3, false);
}
