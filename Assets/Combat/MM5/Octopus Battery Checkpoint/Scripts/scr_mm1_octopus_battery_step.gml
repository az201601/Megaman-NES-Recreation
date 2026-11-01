// Enemy context: move first, then wait/reverse/animate. No gravity or homing.
// Numeric7px half-extent and native center-line probes against accepted terrain.
var remaining_move, step_amount, proposed, hit, blocked, choice_byte;
remaining_move = 2;
blocked = false;
while (remaining_move > 0)
{
    step_amount = min(1, remaining_move);
    if (battery_vertical)
    {
        proposed = y + battery_travel * step_amount;
        hit = collision_point(floor(x), floor(proposed) + battery_travel * 7,
            obj_stage_solid, false, true);
        // One-way ladder caps support downward movement only.
        if (hit == noone && battery_travel > 0)
        {
            hit = collision_point(floor(x), floor(proposed) + 7,
                obj_stage_ladder_top, false, true);
            if (hit != noone && y + 7 > hit.bbox_top) hit = noone;
        }
        if (hit != noone)
        {
            blocked = true;
            if (battery_travel > 0) y = hit.bbox_top - 7;
            else y = hit.bbox_bottom + 1 + 7;
        }
        else y = proposed;
    }
    else
    {
        proposed = x + battery_travel * step_amount;
        hit = collision_point(floor(proposed) + battery_travel * 7, floor(y),
            obj_stage_solid, false, true);
        if (hit != noone)
        {
            blocked = true;
            if (battery_travel > 0) x = hit.bbox_left - 7;
            else x = hit.bbox_right + 1 + 7;
        }
        else x = proposed;
    }
    if (blocked) break;
    remaining_move -= step_amount;
}
choice_byte = 0;
if (blocked && battery_timer == 0) choice_byte = irandom(255);
scr_mm1_octopus_battery_state(blocked, choice_byte);
