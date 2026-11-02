// Boss ordinary Draw context. Read-only; no contact/projectile/drop callbacks.
if (!cmv_fx_started || cmv_fx_count == 0) return;
var i, frame;
frame = 0;
if (cmv_fx_age > 0) frame = 1 + (floor((cmv_fx_age - 1) / 2) mod 5);
for (i = 0; i < 16; i += 1)
    if (cmv_fx_alive[i])
        draw_sprite(spr_mm6_boss_defeat, frame, floor(cmv_fx_x[i]), floor(cmv_fx_y[i]));
