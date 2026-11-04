// Pickup context. Rectangular terrain adaptation; original byte-drop art/countdown.
var remaining, step_y, next_y, bottom, floor_hit, probe, hit, radius;
pickup_age += 1;
if (pickup_age >= 255) { instance_destroy(); exit; }
if (x < view_xview[0] || x >= view_xview[0] + 256
    || y > view_yview[0] + 248 || y < view_yview[0] - 32)
{ instance_destroy(); exit; }
radius = 8;
if (pickup_kind == $75 || pickup_kind == $77) radius = 4;
pickup_vy = min(7, pickup_vy + 0.25);
remaining = pickup_vy;
while (remaining > 0)
{
    step_y = min(1, remaining);
    next_y = y + step_y;
    bottom = next_y;
    floor_hit = false;
    for (probe = -1; probe <= 1; probe += 1)
    {
        hit = collision_point(floor(x) + probe * (radius - 1), floor(next_y + radius),
            obj_stage_solid, false, true);
        if (hit == noone)
        {
            hit = collision_point(floor(x) + probe * (radius - 1), floor(next_y + radius),
                obj_stage_ladder_top, false, true);
            if (hit != noone && y + radius > hit.bbox_top) hit = noone;
        }
        if (hit != noone)
        {
            floor_hit = true;
            bottom = min(bottom, hit.bbox_top - radius);
        }
    }
    y = bottom;
    if (floor_hit) { pickup_vy = 0; break; }
    remaining -= step_y;
}
