// Called once per ACTIVE world update, never from Draw/Draw GUI.
// argument0: native frame-table header selected using pose + (fire >> 4)
// BEFORE decrementing cm_fire. Frame lookup uses cm_animation_frame BEFORE advance.
var packed_header, dwell, last_frame;
packed_header = argument0;
cm_animation_frame = floor(cm_anim / 16);
cm_draw_hurt = (cm_blink & 2) != 0;
if (cm_blink > 0) cm_blink -= 1;
if (cm_sleep != 0) exit;
if (cm_fire != 0)
{
    if ((cm_fire & 15) == 1) cm_fire = 0;
    else cm_fire = (cm_fire + 255) mod 256;
}
dwell = packed_header & 15;
last_frame = packed_header & 240;
if ((cm_anim & 15) < dwell) cm_anim += 1;
else if ((cm_anim & 240) < last_frame) cm_anim = (cm_anim & 240) + 16;
else cm_anim = 0;
