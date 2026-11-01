// Camera context. Gate cutscene alone owns airborne Y; never call player Step twice.
// Preserve approved MM5 jump velocity/gravity/cap; ignore the opening gate's closed mask.
var remaining_y, part_y, proposed_y, resolved_y, probe, hit, ceiling_hit, floor_y;
floor_y = 880 - camera_player.feet_offset;
ceiling_hit = false;
if (route_gate_fall_speed < 0)
{
    remaining_y = -route_gate_fall_speed;
    while (remaining_y > 0)
    {
        part_y = min(1, remaining_y);
        proposed_y = route_entry_y - part_y;
        resolved_y = proposed_y;
        for (probe = -1; probe <= 1; probe += 2)
        {
            hit = collision_point(floor(camera_player.x) + probe * 7,
                floor(proposed_y) - camera_player.head_offset,
                obj_stage_solid, false, true);
            if (hit != noone && hit != route_gate)
            {
                resolved_y = max(resolved_y, hit.bbox_bottom + 1 + camera_player.head_offset);
                ceiling_hit = true;
            }
        }
        route_entry_y = resolved_y;
        // Match the accepted MM5 controller ceiling reset; no gravity on that hit tick.
        if (ceiling_hit) { route_gate_fall_speed = 1; break; }
        remaining_y -= part_y;
    }
}
else route_entry_y = min(floor_y, route_entry_y + route_gate_fall_speed);
if (!ceiling_hit) route_gate_fall_speed = min(camera_player.fall_speed_max,
    route_gate_fall_speed + camera_player.fall_gravity);
if (route_entry_y >= floor_y && route_gate_fall_speed >= 0)
{
    route_entry_y = floor_y;
    route_gate_fall_speed = 0;
    route_gate_entry_air = false;
    camera_player.grounded = true;
}
camera_player.y = route_entry_y;
