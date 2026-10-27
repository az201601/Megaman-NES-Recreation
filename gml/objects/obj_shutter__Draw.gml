// OBJECT: obj_shutter  |  EVENT: Draw
var i, h;
h = floor(48 * shut);
draw_set_color(c_gray);
if (side < 0) draw_rectangle(x, y, x+15, y+h, false);
else          draw_rectangle(x, y+48-h, x+15, y+48, false);
draw_set_color(c_white);
