// Nonpersistent camera for ONLY the first original horizontal stripe (pages0..3).
// No sprite, Visible OFF, Solid OFF. Existing player/HUD/arrival events unchanged.
camera_player = noone;
if (room_width != 1024 || room_height != 240 || room_speed != 60)
    show_error("Cut Man opening route requires room1024x240, speed60.", true);
if (!view_enabled || !view_visible[0] || view_wview[0] != 256 || view_hview[0] != 240)
    show_error("Cut Man opening camera: enable visible view0, view256x240.", true);
// No engine object-follow competing with our measured centre/clamp rule.
view_object[0] = noone;
view_xview[0] = 0;
view_yview[0] = 0;
