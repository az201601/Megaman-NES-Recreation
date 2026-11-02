// Boss/owner context. GMS1.4.1760. Call ONCE in Create, not every final hit.
// Source subsystem only; player/audio/art/screen bridges must be connected first.
cmv_phase = 0;
cmv_timer = 0;
cmv_tick = -1;
cmv_advanced = false;
cmv_move = 0;
cmv_snap = false;
cmv_center = 3200;
cmv_direction = 0;
cmv_reward_requested = false;
