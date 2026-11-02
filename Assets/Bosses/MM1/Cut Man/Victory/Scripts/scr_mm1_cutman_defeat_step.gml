// Boss context. Shared active tick argument0; frozen argument1. Visuals only.
if (cmv_phase == 10) { cmv_fx_count = 0; return; }
if (argument1 || cmv_fx_tick == argument0) return;
cmv_fx_tick = argument0;
if (!cmv_fx_started) scr_mm1_cutman_defeat_start();
else cmv_fx_age += 1;
var i, live;
live = 0;
for (i = 0; i < 16; i += 1)
{
    if (!cmv_fx_alive[i]) continue;
    cmv_fx_x[i] += cmv_fx_vx[i] / 256;
    cmv_fx_y[i] += cmv_fx_vy[i] / 256;
    // Original native particle removal bounds, relative to this fixed boss view.
    if (cmv_fx_x[i] < 3076 || cmv_fx_x[i] >= 3328
        || cmv_fx_y[i] < 720 || cmv_fx_y[i] >= 968)
        cmv_fx_alive[i] = false;
    else live += 1;
}
cmv_fx_count = live;
