// Original MM1 boss meter only. No score or duplicate player HUD.
if (global.mm5_pause_active) exit;
draw_sprite(spr_mm1_cutman_boss_meter, clamp(floor(boss_health), 0, 28), 40, 25);
