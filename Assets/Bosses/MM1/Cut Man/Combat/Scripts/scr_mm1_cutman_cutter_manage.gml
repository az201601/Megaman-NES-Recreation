// Boss context: native DC9D..DD52 management BEFORE Cut Man strategy execution.
// Native-local integer cc_x/cc_y and cm_x/cm_y; movement happens elsewhere.
// One active world update, shared phase argument0. No independent projectile Step.
var phase, low_byte, high_byte;
phase = argument0;
cc_caught = false;
if (cm_cutter == 0) exit;
cm_fire = 18;
if (cm_cutter == 1)
{
    if (cc_y < 24 || cc_y >= 216 || cc_x < 24 || cc_x >= 232)
    {
        cm_cutter = 2;
        cc_face_right = !cc_face_right;
        // Original outbound reversal complements the high byte separately;
        // it does NOT propagate low-byte carry when the old low byte is zero.
        low_byte = cc_speed_y & 255;
        high_byte = floor(cc_speed_y / 256);
        cc_speed_y = (255 - high_byte) * 256 + ((256 - low_byte) mod 256);
        cc_base = 608;
    }
    exit;
}
if ((phase & 3) != 0) exit;
cc_face_right = cm_x >= cc_x;
cc_dx = abs(cm_x - cc_x);
cc_base = (cc_base + 4) mod 65536;
cc_upward = cc_y >= cm_y;
cc_dy_byte = (cc_y - cm_y + 256) mod 256;
scr_mm1_cutman_cutter_aim();
if (cc_dy_byte < 8 && cc_dx < 8)
{
    cc_caught = true;
    cm_cutter = 0;
    cm_fire = 0;
}
