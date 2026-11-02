// Boss/owner context. argument0 centre world X. Returns event1 exactly once.
// Caller must already latch defeat, disable boss/cutter/contact and lock controls.
// Event1: stop owned boss/charge voices, remove shots, begin boss defeat effects.
if (cmv_phase != 0) return 0;
cmv_center = argument0;
cmv_phase = 1;
cmv_timer = 0;
cmv_move = 0;
cmv_snap = false;
cmv_direction = 0;
return 1;
