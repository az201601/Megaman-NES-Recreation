// Boss/owner context. One active-update clock; no instance Step or Draw advancement.
// 0 tick,1 frozen(pause/refill),2 cancel(death/room abort),3 defeat FX finished,
// 4 player X,5 grounded,6 acquisition finished,7 teleport finished,8 screen finished.
// Returns one entry event; caller applies it synchronously ONCE, never in Draw.
// 2 clear music,3 walk start,4 acquisition,5 teleport,6 custom screen,7 reward/return,
// 8 cancelled. Event1 comes from start. No runtime assets or room IDs guessed here.
// Phase:0 idle,1 defeat,2 preclear,3 clear wait,4 walking,5 landing,
// 6 acquisition,7 teleport,8 screen,9 done,10 aborted.
var next_tick, frozen, cancelled, px;
next_tick = argument0;
frozen = argument1;
cancelled = argument2;
cmv_advanced = false;
cmv_move = 0;
cmv_snap = false;
if (cmv_phase == 0 || cmv_phase >= 9) return 0;
// Cancellation has priority even while frozen; terminal prevents late rewards.
if (cancelled)
{
    cmv_phase = 10;
    cmv_timer = 0;
    return 8;
}
if (frozen || cmv_tick == next_tick) return 0;
cmv_tick = next_tick;
cmv_advanced = true;
if (cmv_phase == 1)
{
    if (!argument3) return 0;
    cmv_phase = 2;
    cmv_timer = 240;
    return 0;
}
if (cmv_phase == 2 || cmv_phase == 3)
{
    cmv_timer -= 1;
    if (cmv_timer > 0) return 0;
    if (cmv_phase == 2)
    {
        cmv_phase = 3;
        cmv_timer = 240;
        return 2;
    }
    cmv_phase = 4;
    // Keep original MM6 crossing rule: exactly centred starts left then snaps.
    cmv_direction = 1;
    if (argument4 >= cmv_center) cmv_direction = -1;
    return 3;
}
if (cmv_phase == 4)
{
    px = argument4;
    if ((cmv_direction == 1 && px >= cmv_center)
        || (cmv_direction == -1 && px < cmv_center))
    {
        cmv_snap = true;
        cmv_phase = 5;
    }
    else
    {
        cmv_move = cmv_direction;
        return 0;
    }
}
if (cmv_phase == 5)
{
    // MM5 adaptation: use actual collision support, not MM6's absolute Y>=B4.
    // Vertical physics must continue under control lock until supported.
    if (!argument5) return 0;
    cmv_phase = 6;
    return 4;
}
if (cmv_phase == 6)
{
    if (!argument6) return 0;
    cmv_phase = 7;
    return 5;
}
if (cmv_phase == 7)
{
    if (!argument7) return 0;
    cmv_phase = 8;
    return 6;
}
if (cmv_phase == 8)
{
    if (!argument8) return 0;
    cmv_phase = 9;
    cmv_reward_requested = true;
    // Receiver grants Rolling Cutter/persists completion and returns to selection.
    // No E-Tank grant, score, password screen or native16 music is implied.
    return 7;
}
return 0;
