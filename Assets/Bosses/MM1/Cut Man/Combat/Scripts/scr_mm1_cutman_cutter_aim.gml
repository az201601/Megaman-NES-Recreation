// Native F8C6/F94C arithmetic, with native scratch4F=0 contract.
// cc_dx absolute byte distance; cc_dy_byte subtraction result; cc_upward carry.
// cc_base unsigned16 major-axis speed. Outputs unsigned16 speed fields.
// Do NOT replace with normalized-vector or floating point slope aiming.
var major_distance, minor_distance, denominator, quotient, minor_speed;
if (!cc_upward) cc_dy_byte = cc_dy_byte ^ 255;
major_distance = max(cc_dx, cc_dy_byte);
minor_distance = min(cc_dx, cc_dy_byte);
denominator = cc_base & 65280;
quotient = 65535;
if (denominator != 0) quotient = floor(major_distance * 65536 / denominator) mod 65536;
denominator = quotient & 65280;
minor_speed = 65535;
if (denominator != 0) minor_speed = floor(minor_distance * 65536 / denominator) mod 65536;
cc_speed_x = cc_base;
cc_speed_y = minor_speed;
if (cc_dx < cc_dy_byte) { cc_speed_x = minor_speed; cc_speed_y = cc_base; }
if (!cc_upward) cc_speed_y = (65536 - cc_speed_y) mod 65536;
