// Shared native F8C6 arithmetic, independently tested for PLAYER Cutter.
// Native F8C6/F94C arithmetic, with native scratch4F=0 contract.
// pc_dx absolute byte distance; pc_dy_byte subtraction result; pc_upward carry.
// pc_base unsigned16 major-axis speed. Outputs unsigned16 speed fields.
// Do NOT replace with normalized-vector or floating point slope aiming.
var major_distance, minor_distance, denominator, quotient, minor_speed;
if (!pc_upward) pc_dy_byte = pc_dy_byte ^ 255;
major_distance = max(pc_dx, pc_dy_byte);
minor_distance = min(pc_dx, pc_dy_byte);
denominator = pc_base & 65280;
quotient = 65535;
if (denominator != 0) quotient = floor(major_distance * 65536 / denominator) mod 65536;
denominator = quotient & 65280;
minor_speed = 65535;
if (denominator != 0) minor_speed = floor(minor_distance * 65536 / denominator) mod 65536;
pc_speed_x = pc_base;
pc_speed_y = minor_speed;
if (pc_dx < pc_dy_byte) { pc_speed_x = minor_speed; pc_speed_y = pc_base; }
if (!pc_upward) pc_speed_y = (65536 - pc_speed_y) mod 65536;
