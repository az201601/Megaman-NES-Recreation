// SCRIPT: scr_mm_camera_snap(target_x, target_y)
// MM1 does NOT smooth-follow. The view snaps to whole 256x240 screens.
var sx, sy, mx, my;
sx = floor(argument0 / 256) * 256;
sy = floor(argument1 / 240) * 240;
mx = room_width  - 256; if (mx < 0) mx = 0;
my = room_height - 240; if (my < 0) my = 0;
if (sx < 0) sx = 0; if (sx > mx) sx = mx;
if (sy < 0) sy = 0; if (sy > my) sy = my;
view_xview[0] = sx;
view_yview[0] = sy;
