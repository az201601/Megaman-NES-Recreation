// OBJECT: obj_game  |  EVENT: Draw
// Drawn on top of everything (depth = -10000) using view coordinates.
var vx, vy;
vx = view_xview[0]; vy = view_yview[0];

if (global.mm_message_timer > 0) {
    draw_set_color(c_black);
    draw_rectangle(vx+48, vy+100, vx+208, vy+140, false);
    draw_set_color(c_white);
    draw_text(vx+64, vy+116, global.mm_message);
}
if (global.mm_ready_timer > 0) {
    draw_set_color(c_white);
    draw_text(vx+104, vy+112, "READY");
}
if (global.mm_paused) {
    draw_set_alpha(0.6); draw_set_color(c_black);
    draw_rectangle(vx, vy, vx+256, vy+240, false);
    draw_set_alpha(1); draw_set_color(c_white);
    draw_text(vx+104, vy+112, "PAUSED");
    draw_text(vx+56, vy+132, "ENTER = resume");
}
