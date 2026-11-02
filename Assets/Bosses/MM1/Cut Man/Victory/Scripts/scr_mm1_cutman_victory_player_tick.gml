// PLAYER context. argument0 shared active tick,1 frozen,2 direction.
// Only phases1..5 (defeat/waits/walk/landing) use this helper.
// Acquisition and teleport have their own animator, not ordinary gravity twice.
if (!mm5_victory_locked || argument1 || mm5_victory_tick == argument0) return false;
mm5_victory_tick = argument0;
return scr_mm1_cutman_victory_player_move(argument2);
