// Enemy context. argument0=endpoint contact,1=choice byte; native state model.
var blocked, choice_byte, phase;
blocked = argument0;
choice_byte = argument1;
if (battery_timer > 0)
{
    battery_timer -= 1;
    if (battery_timer == 0)
    {
        battery_state = 48;
        battery_travel = -battery_travel;
    }
}
else if (blocked)
{
    battery_state = 16;
    battery_timer = 63;
    if ((choice_byte & 1) != 0) battery_timer = 126;
}
if ((battery_state & 16) == 0) battery_state = battery_state & 240;
// Native draws the phase before the graphics low-nibble increment.
phase = floor(battery_state / 16);
battery_draw_pose = phase;
if (phase == 3) battery_draw_pose = 1;
if ((battery_state & 15) < 8) battery_state += 1;
else if ((battery_state & 240) < 48) battery_state = (battery_state & 240) + 16;
else battery_state = 0;
