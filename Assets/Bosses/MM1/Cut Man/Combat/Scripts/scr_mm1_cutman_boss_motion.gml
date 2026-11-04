// MM1 motion adapted to existing invisible project solids. Boss context.
// x/y world positions; cm_x/cm_y integer native-local positions (3072,720 origin).
// Unsigned native16 velocities, positive Y means UP. Horizontal travel locked.
// Swept rectangle8x12 prevents tunnelling; native NES point probes are NOT claimed
// identical to this project's rectangle collision at corners/overhangs.
var remaining_move, step_amount, proposed, limit_pos, hit, probe, blocked;
var move_sign, signed_y, vertical_blocked, sample_y;
scr_mm1_cutman_boss_face();
cm_wall = 0;
remaining_move = cm_speed_x / 256;
move_sign = -1;
if (cm_move_right) move_sign = 1;
while (remaining_move > 0)
{
    step_amount = min(1, remaining_move);
    proposed = x + move_sign * step_amount;
    limit_pos = proposed;
    blocked = false;
    for (probe = -1; probe <= 1; probe += 1)
    {
        hit = collision_point(floor(proposed) + move_sign * 8,
            floor(y) + probe * 11, obj_stage_solid, false, true);
        if (hit != noone)
        {
            blocked = true;
            if (move_sign > 0) limit_pos = min(limit_pos, hit.bbox_left - 8);
            else limit_pos = max(limit_pos, hit.bbox_right + 1 + 8);
        }
    }
    x = limit_pos;
    if (blocked) { cm_wall = 1; break; }
    remaining_move -= step_amount;
}
signed_y = cm_speed_y;
if (signed_y >= 32768) signed_y -= 65536;
move_sign = -sign(signed_y);
remaining_move = abs(signed_y) / 256;
vertical_blocked = false;
while (remaining_move > 0)
{
    step_amount = min(1, remaining_move);
    proposed = y + move_sign * step_amount;
    limit_pos = proposed;
    blocked = false;
    sample_y = floor(proposed) + move_sign * 12;
    for (probe = -1; probe <= 1; probe += 1)
    {
        hit = collision_point(floor(x) + probe * 7, sample_y,
            obj_stage_solid, false, true);
        if (hit != noone)
        {
            blocked = true;
            if (move_sign > 0) limit_pos = min(limit_pos, hit.bbox_top - 12);
            else limit_pos = max(limit_pos, hit.bbox_bottom + 1 + 12);
        }
    }
    y = limit_pos;
    if (blocked) { vertical_blocked = true; break; }
    remaining_move -= step_amount;
}
if (vertical_blocked) cm_speed_y = 65344;
else cm_speed_y = (max(-3072, signed_y - 64) + 65536) mod 65536;
cm_x = floor(x) - 3072;
cm_y = floor(y) - 720;
return vertical_blocked;
