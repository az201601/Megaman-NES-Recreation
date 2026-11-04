E-Tank regression correction for equipped-Cutter installation through Step94.
Stop Run. Replace ENTIRE existing resource contents from the matching file:
1. Script scr_mm5_combat_collect <- Adapters/scr_mm5_combat_collect.gml
2. Script scr_mm5_pause_restore <- Adapters/scr_mm5_pause_restore.gml
3. obj_mm5_pause_menu > Draw > Draw GUI <- Adapters/obj_mm5_pause_menu_draw_gui.gml
No other resources/sprites/sounds/events need reinstallation.

Cause: the weapon-update collector was based on the older pre-E-Tank collector;
it omitted the fixed E-Tank transaction. Restore/Draw also omitted accepted E hooks.
Collection uses the SAME Script in M.BUSTER and R.CUTTER modes. This correction
restores the accepted collection branch byte-for-byte:award one E-Tank,cap9,
leave at cap,persist taken across death,no immediate heal,no farming. Also restores
the paid-heal commit/reset and health overlay during pause close while retaining
new weapon/equipment/energy behaviour.160 actual-GML E-Tank cases pass in both
modes;existing Cutter combat and equipment source suites pass. NOT installed
GameMaker acceptance.

Fresh Run from title: reach the tank with fewer than9 E-Tanks and not already taken
in this run. Check disappears/count+1,then pause E use and health refill. If a failed
collection already removed it in the previous test,stopping/restarting the runner
is required to begin a clean run. No F8 or inventory-grant cheat is included.
