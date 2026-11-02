// Future connected install: append ONCE after the accepted Cut Man E-Tank flag
// in scr_mm5_pause_inventory_init. Its false/stage-entry branch exits above this.
// Reset ONLY on explicit new game, never on room entry, death or victory.
if (!argument0) exit;
global.mm1_cutman_cleared = false;
