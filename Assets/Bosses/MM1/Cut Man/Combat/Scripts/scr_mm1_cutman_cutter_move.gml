// Boss-owned cutter motion, once AFTER boss decision/throw for this active update.
// Original no-terrain-collision projectile02: unsigned16 fixed-point coordinates,
// independent X facing, upward-positive signed Y. No gravity or wall collision.
// argument0 is original pose69 packed animation header from verified art table.
var travel_sign, packed_header, dwell, last_frame;
if (cm_cutter == 0) exit;
travel_sign = -1;
if (cc_face_right) travel_sign = 1;
cc_x_fp = (cc_x_fp + travel_sign * cc_speed_x + 65536) mod 65536;
cc_y_fp = (cc_y_fp - cc_speed_y + 65536) mod 65536;
cc_x = floor(cc_x_fp / 256);
cc_y = floor(cc_y_fp / 256);
// Render chooses old counter, then advances native dwell/frame nibble.
cc_draw_frame = floor(cc_anim / 16);
packed_header = argument0;
dwell = packed_header & 15;
last_frame = packed_header & 240;
if ((cc_anim & 15) < dwell) cc_anim += 1;
else if ((cc_anim & 240) < last_frame) cc_anim = (cc_anim & 240) + 16;
else cc_anim = 0;
