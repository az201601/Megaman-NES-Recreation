// Actual PLAYER weapon manager, MM1 USA bank5:A393..A464. Not Cut Man AI.
// Projectile context. Caller supplies integer target coordinates in pc_target_x/y.
// Age/spawn/physics/contacts/audio are owned by the future sole combat coordinator.
if (!pc_active) exit;
if (pc_phase < 42)
{
    pc_phase += 1;
    pc_speed_y = (pc_speed_y - 26 + 65536) mod 65536;
    exit;
}
if (pc_phase == 42)
{
    pc_return_base = 640;
    pc_phase = 43;
}
pc_right = pc_target_x >= floor(pc_x);
pc_dx = abs(pc_target_x - floor(pc_x)) mod 256;
pc_return_base = (pc_return_base + 8) mod 65536;
pc_dy_byte = (floor(pc_y) - pc_target_y + 256) mod 256;
pc_upward = floor(pc_y) >= pc_target_y;
pc_base = pc_return_base;
scr_mm1_player_cutter_aim();
// Aim normalizes the byte-distance exactly as native F8C6; catch uses that
// adjusted byte, NOT a floating-point radius/distance or Euclidean speed.
if (pc_dy_byte < 12 && pc_dx < 12)
{
    pc_active = false;
    pc_caught = true;
    exit;
}
if (pc_turn_accel > 0)
{
    pc_turn_accel -= 32;
    pc_speed_y = (pc_speed_y - pc_turn_accel + 65536) mod 65536;
}
