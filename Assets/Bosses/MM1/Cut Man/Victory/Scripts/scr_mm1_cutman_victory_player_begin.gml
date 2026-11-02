// PLAYER context. One-shot handoff; player Create append must be installed first.
// Caller stops charge/boss audio and removes projectiles using established owners.
if (mm5_victory_locked) return false;
mm5_victory_locked = true;
mm5_victory_tick = -1;
buster_charge = 0;
buster_pose_timer = 0;
buster_slide_at_start = false;
mm5_hurt_left = 0;
mm5_blink_sample = 0;
mm5_invulnerable = 0;
on_ladder = false;
ladder_instance = noone;
ladder_moving = false;
walk_pause = 0;
walk_previous_input = 0;
anim_walk_frame = 0;
anim_walk_timer = 0;
// Do NOT reset fall_speed/Y/grounded: an airborne last hit must finish physically.
// Sliding is cleared in movement only when the full standing body fits.
return true;
