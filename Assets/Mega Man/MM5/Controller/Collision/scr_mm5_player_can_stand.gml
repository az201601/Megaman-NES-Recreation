// Call from obj_mm5_megaman with its standing-reference X,Y.
// argument0: player X; argument1: player Y (normal feet_offset reference).
// Region-based standing-clearance adaptation, not NES metatile probe emulation.
// Exclude the supporting surface itself and ignore one-way ladder-top markers.
var stand_left, stand_right, stand_top, stand_bottom;

stand_left = floor(argument0) - 7;
stand_right = floor(argument0) + 7;
stand_top = floor(argument1 - head_offset);
stand_bottom = floor(argument1 + feet_offset) - 1;

return (collision_rectangle(
    stand_left, stand_top, stand_right, stand_bottom,
    obj_stage_solid, false, true
) == noone);
