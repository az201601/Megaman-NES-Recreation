// Called AFTER player manager, once per active shared tick. No terrain gravity.
// Whole-world adapter/collision integration pending. Retain 1/256px fractions.
var vertical_speed;
if (!pc_active) exit;
if (pc_right) pc_x += pc_speed_x / 256;
else pc_x -= pc_speed_x / 256;
vertical_speed = pc_speed_y;
if (vertical_speed >= 32768) vertical_speed -= 65536;
pc_y -= vertical_speed / 256;
