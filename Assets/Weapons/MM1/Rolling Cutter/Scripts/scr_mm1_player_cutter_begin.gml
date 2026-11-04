// Projectile context. Caller validated ownership/energy/busy/input and sets
// pc_target_x/y(integer player origin) and pc_right(firing direction).
// Native player launch table:A999+14*9 = sprite5B,sy0200,sx0200,Y-4,X+12.
pc_x = pc_target_x + 12;
if (!pc_right) pc_x = pc_target_x - 12;
pc_y = pc_target_y - 4;
pc_speed_x = 512;
pc_speed_y = 512;
pc_turn_accel = 640;
pc_return_base = 0;
pc_phase = 0;
pc_active = true;
pc_caught = false;
