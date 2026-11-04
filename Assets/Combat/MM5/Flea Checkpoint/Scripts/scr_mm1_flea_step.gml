// Flea context: playerX, shared active-update phase, native-choice RNG byte.
// Rectangular terrain adaptation uses existing invisible solids, not artwork.
var target_x, phase, random_byte, was_falling, step_amount, remaining_move;
var proposed, hit, probe, blocked, limit_pos, did_land;
target_x = argument0;
phase = argument1;
random_byte = argument2;
if (flea_airborne && (phase & 3) == 0) exit;
if (!flea_airborne)
{
    flea_timer -= 1;
    if (flea_timer == 0)
    {
        flea_facing = 1;
        if (floor(target_x) < floor(x)) flea_facing = -1;
        flea_vx = 304 / 256;
        flea_vy = -1248 / 256;
        if ((random_byte & 1) != 0) { flea_vx = 3; flea_vy = -4; }
        flea_airborne = true;
    }
}
// Sweep up to one pixel per probe to prevent tunnelling into walls/ceilings.
remaining_move = flea_vx;
while (remaining_move > 0)
{
    step_amount = min(1, remaining_move);
    proposed = x + flea_facing * step_amount;
    blocked = false;
    limit_pos = proposed;
    for (probe = -1; probe <= 1; probe += 1)
    {
        hit = collision_point(floor(proposed) + flea_facing * 8,
            floor(y) + probe * 7, obj_stage_solid, false, true);
        if (hit != noone)
        {
            blocked = true;
            if (flea_facing > 0) limit_pos = min(limit_pos, hit.bbox_left - 8);
            else limit_pos = max(limit_pos, hit.bbox_right + 1 + 8);
        }
    }
    x = limit_pos;
    if (blocked) break;
    remaining_move -= step_amount;
}
was_falling = flea_vy > 0;
did_land = false;
blocked = false;
remaining_move = abs(flea_vy);
while (remaining_move > 0)
{
    step_amount = min(1, remaining_move);
    proposed = y + sign(flea_vy) * step_amount;
    limit_pos = proposed;
    for (probe = -1; probe <= 1; probe += 1)
    {
        hit = collision_point(floor(x) + probe * 7,
            floor(proposed) + sign(flea_vy) * 8, obj_stage_solid, false, true);
        // Ladder caps are one-way floors, never walls or ceilings.
        if (hit == noone && was_falling)
        {
            hit = collision_point(floor(x) + probe * 7,
                floor(proposed) + 8, obj_stage_ladder_top, false, true);
            if (hit != noone && y + 8 > hit.bbox_top) hit = noone;
        }
        if (hit != noone)
        {
            blocked = true;
            if (was_falling) limit_pos = min(limit_pos, hit.bbox_top - 8);
            else limit_pos = max(limit_pos, hit.bbox_bottom + 1 + 8);
        }
    }
    y = limit_pos;
    if (blocked)
    {
        flea_vy = 192 / 256;
        did_land = was_falling;
        break;
    }
    remaining_move -= step_amount;
}
if (!blocked) flea_vy = min(12, flea_vy + 64 / 256);
if (did_land && flea_airborne)
{
    flea_timer = 15;
    flea_vx = 0;
    flea_airborne = false;
}
