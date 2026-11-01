// Cutter context. Original fixed-point velocities, then gravity; no terrain mask.
x += super_vx;
y += super_vy;
super_vy = min(12, super_vy + 64 / 256);
super_age += 1;
