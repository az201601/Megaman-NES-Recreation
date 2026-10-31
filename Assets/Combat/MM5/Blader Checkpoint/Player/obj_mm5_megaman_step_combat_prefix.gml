scr_mm5_combat_begin();
// VERY TOP, above route/startup/charge/ladder/slide prefixes. Keep all old code below.
if (scr_mm5_combat_locked()) exit;
if (scr_mm1_cutman_route_busy()) exit;
if (mm5_hurt_left > 0)
{
    scr_mm5_player_hurt_step();
    exit;
}
