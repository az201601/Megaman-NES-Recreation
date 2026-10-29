// obj_mm5_hud > Create. Visible, nonpersistent, no sprite/parent, not Solid.
hud_player = noone;
depth = -10000;
// All Draw GUI coordinates use the project's NES logical canvas, not window pixels.
// This changes the global GUI coordinate size, not room/view/window dimensions.
display_set_gui_size(256, 240);
