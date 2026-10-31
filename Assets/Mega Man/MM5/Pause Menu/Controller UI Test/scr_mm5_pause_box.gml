// Script.0=x,1=y,2=width,3=height,4=colour. Rounded1px outline.
var bx, by, bw, bh;
bx = argument0; by = argument1; bw = argument2; bh = argument3;
draw_set_color(argument4);
draw_line(bx + 2, by, bx + bw - 3, by);
draw_line(bx + 2, by + bh - 1, bx + bw - 3, by + bh - 1);
draw_line(bx, by + 2, bx, by + bh - 3);
draw_line(bx + bw - 1, by + 2, bx + bw - 1, by + bh - 3);
draw_point(bx + 1, by + 1);
draw_point(bx + bw - 2, by + 1);
draw_point(bx + 1, by + bh - 2);
draw_point(bx + bw - 2, by + bh - 2);
draw_set_color(c_white);
