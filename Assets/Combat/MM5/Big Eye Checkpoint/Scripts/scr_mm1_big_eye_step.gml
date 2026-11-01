// Big Eye context: playerX, shared active-update phase, native-choice RNG byte.
// Rectangular terrain adaptation uses existing invisible solids, not artwork.
var target_x, phase, random_byte, was_falling, step_amount, remaining_move;
var proposed, hit, probe, blocked, limit_pos, did_land;
target_x = argument0;
phase = argument1;
random_byte = argument2;
if (big_eye_airborne && (phase & 3) == 0) exit;
if (!big_eye_airborne)
{
    big_eye_timer -= 1;
    if (big_eye_timer == 0)
    {
        big_eye_facing = 1;
        if (floor(target_x) < floor(x)) big_eye_facing = -1;
        big_eye_vx = 308 / 256;
        big_eye_vy = -849 / 256;
        if ((random_byte & 1) != 0) { big_eye_vx = 209 / 256; big_eye_vy = -1254 / 256; }
        big_eye_airborne = true;
    }
}
// Sweep up to one pixel per probe to prevent tunnelling into walls/ceilings.
remaining_move = big_eye_vx;
while (remaining_move > 0)
{
    step_amount = min(1, remaining_move);
    proposed = x + big_eye_facing * step_amount;
    blocked = false;
    limit_pos = proposed;
    for (probe = -2; probe <= 2; probe += 1)
    {
        hit = collision_point(floor(proposed) + big_eye_facing * 12,
            floor(y) + floor(probe * 19 / 2), obj_stage_solid, false, true);
        if (hit != noone)
        {
            blocked = true;
            if (big_eye_facing > 0) limit_pos = min(limit_pos, hit.bbox_left - 12);
            else limit_pos = max(limit_pos, hit.bbox_right + 1 + 12);
        }
    }
    x = limit_pos;
    if (blocked) break;
    remaining_move -= step_amount;
}
was_falling = big_eye_vy > 0;
did_land = false;
blocked = false;
remaining_move = abs(big_eye_vy);
while (remaining_move > 0)
{
    step_amount = min(1, remaining_move);
    proposed = y + sign(big_eye_vy) * step_amount;
    limit_pos = proposed;
    for (probe = -1; probe <= 1; probe += 1)
    {
        hit = collision_point(floor(x) + probe * 11,
            floor(proposed) + sign(big_eye_vy) * 20, obj_stage_solid, false, true);
        // Ladder caps are one-way floors, never walls or ceilings.
        if (hit == noone && was_falling)
        {
            hit = collision_point(floor(x) + probe * 11,
                floor(proposed) + 20, obj_stage_ladder_top, false, true);
            if (hit != noone && y + 20 > hit.bbox_top) hit = noone;
        }
        if (hit != noone)
        {
            blocked = true;
            if (was_falling) limit_pos = min(limit_pos, hit.bbox_top - 20);
            else limit_pos = max(limit_pos, hit.bbox_bottom + 1 + 20);
        }
    }
    y = limit_pos;
    if (blocked)
    {
        big_eye_vy = 192 / 256;
        did_land = was_falling;
        break;
    }
    remaining_move -= step_amount;
}
if (!blocked) big_eye_vy = min(12, big_eye_vy + 64 / 256);
if (did_land && big_eye_airborne)
{
    big_eye_timer = 15;
    big_eye_vx = 0;
    big_eye_airborne = false;
    audio_play_sound(snd_mm1_big_eye_land, 10, false);
}
