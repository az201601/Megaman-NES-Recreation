// OBJECT: obj_shot  |  EVENT: Step -> Step
if (global.mm_paused) exit;
x += hsp;                                   // ROM: 4 px/frame, no acceleration
// NES pellets die when they leave the visible screen, not just the room.
if (x < view_xview[0]-16 || x > view_xview[0]+272
 || y < view_yview[0]-16 || y > view_yview[0]+256) instance_destroy();
