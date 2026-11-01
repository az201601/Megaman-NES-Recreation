// Independently recovered ceiling strip preserves native flips/closed8px offset.
var art;
art = spr_mm1_screw_bomber_floor;
if (screw_ceiling) art = spr_mm1_screw_bomber_ceiling;
draw_sprite(art, screw_draw_pose, floor(x), floor(y));
