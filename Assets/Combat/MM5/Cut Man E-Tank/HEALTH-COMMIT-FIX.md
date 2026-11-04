# E-Tank animation succeeds but gameplay health reverts — minimal fix

STOP runner. Existing E-Tank installation required. No sprite/audio/object/event/room reinstallation.

1. **Scripts → Mega Man → MM5 → Pause Menu → E-Tank**: create NEW Script **scr_mm5_pause_e_tank_commit**; paste entire matching Scripts/scr_mm5_pause_e_tank_commit.gml.
2. **Scripts → Mega Man → MM5 → Pause Menu → Stage Controller → scr_mm5_pause_restore**: replace ALL code with matching Scripts/scr_mm5_pause_restore.gml. Do not append.
3. **Scripts → Mega Man → MM5 → Combat → scr_mm5_combat_begin**: replace ALL code with matching Scripts/scr_mm5_combat_begin.gml. Do not append. This retains death/retry/ordinary refill/route logic; adds pending paid-heal handoff BEFORE frame-once guard.

These are three Script resources, not camera/object events. No Create appends repeated. Keep earlier E Step/DrawGUI/helper replacements. Ensure scr_mm5_pause_inventory_init is the E version from the earlier missing-global fix; run from stopped fresh game.

The old restore attempted activation, checked instance_exists immediately, then unconditionally cleared the paid-heal flag. If activation was not visible to that check, the player's heal was discarded. New restore retains the flag until the SAME player is active. Shared combat Begin Step retries before its frame-once guard, health/refill/death/hazard processing; first active-player handoff applies28, cancels old pickup-refill remainder and clears the flag once. Never activate player early during menu/refill. Not a second tank consumption, no recurring invincibility/heal.

Test damaged health → E use → menu28 → close → LIVE HUD28 → reopen menu28. Take another hit after closing: damage must remain (no repeated heal); tank count decreases exactly1. Repeat with heldStart,1HP/27HP, ordinary pickup refill, and pause-close with held/released fire. Fullhealth/empty E/W/M unchanged. Native/source-model tests pass, including deferred-activation mock; GMS installed confirmation pending.

Supersedes earlier claims that an immediate activation/exists check was enough. Room-End teardown that destroys/replaces the player/controller is not certified to transfer a pending paid heal to a replacement instance; this fix deliberately targets only the exact original player.
