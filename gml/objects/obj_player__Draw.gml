// OBJECT: obj_player  |  EVENT: Draw
// Hold F2 to see the collision box. This is the fastest way to debug physics.
draw_self();
if (keyboard_check(vk_f2)) {
    draw_set_color(c_red);
    draw_rectangle(bbox_left, bbox_top, bbox_right, bbox_bottom, true);
    draw_set_color(c_white);
}
