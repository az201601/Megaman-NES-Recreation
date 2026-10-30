# Step3 — stage pause integration (GMS1.4.1760)

User confirmed UI-test code works. User approves02 spare lives (current life excluded), and native MM5 weapon confirm uses **Start OR A**, A also jump. Verified supplied ROM Start/A close initial Buster menu, B does not.

This checkpoint adds a NEW stage controller, using existing imported art/sounds and shared drawing helpers. **No existing player, HUD, arrival, movement, charge, tile or collision event is replaced.** Back up the GameMaker project first. Source model/static checks pass; this new controller has not been compiled/run in GameMaker here.

## What this implements / does not implement

- Enter=Start opens menu, only after READY/arrival finishes.
- Ordinary gameplay is frozen via a recorded list of currently ACTIVE instances, then the same IDs restored. Previously sleeping/deactivated instances are not globally activated.
- Reads player's actual `mm5_health` at opening. Because player is frozen, that snapshot is the current paused health, not a test value.
- Real persistent-in-run `global.mm5_lives` counter, initialized02. No death/game-over system exists yet, so lives are not decremented by this checkpoint.
- Real inventory state begins EMPTY except unlimited Buster. No test02/02/01 tanks, test14 energy or falsely owned upgrades copied into the stage. Locked weapon/upgrade icons stay grey. You can browse them, but can't equip unimplemented weapons.
- Only implemented M.BUSTER can be confirmed for gameplay. Enter OR Space(A) on Buster requests close. Same press cannot jump when stage resumes.
- Original music left running. Only the charge manager's own active charge voice is paused; that manager stays active to service async buffers. No global audio pause/stop.
- Tank Start-use rule retained, BUT actual tank refill/effects/consumption remains disabled until implemented. Even if positive counts are externally assigned, this code does NOT consume an item without providing its effect. Energy Balancer routing/other weapon behaviour not implemented. Starting02 lives is not02 tanks.

## 1. Shared helpers (already installed)

Keep the existing scripts, unchanged:

- scr_mm5_pause_text
- scr_mm5_pause_meter
- scr_mm5_pause_box

For organisation, you may move these existing resources from `Scripts > Mega Man > MM5 > Pause Menu > UI Test` into a new **Shared** folder. Moving folders does not change their names or code. Do NOT create duplicate script resources. The original UI test may keep using them.

## 2. Add5 NEW Scripts

Folder: **Scripts > Mega Man > MM5 > Pause Menu > Stage**.

Create each exact resource name and paste its matching entire.gml file:

1. scr_mm5_pause_inventory_init
2. scr_mm5_pause_open
3. scr_mm5_pause_restore
4. scr_mm5_pause_dispose
5. scr_mm5_pause_stage_move

Do not replace scr_mm5_pause_test_move; the stage uses its separately named navigation script. Existing charge scripts including scr_mm5_charge_audio_stop must remain installed (already required by your working charge system).

## 3. Add NEW stage object and6 events

Folder: **Objects > Mega Man > MM5 > Pause Menu > Stage**.

Create **obj_mm5_pause_menu**: no Sprite, Visible ON, Solid OFF, Persistent OFF. Create sets depth-20000.

| Object event | Paste file |
|---|---|
| Create | obj_mm5_pause_menu_create.gml |
| Step > BEGIN Step | obj_mm5_pause_menu_begin_step.gml |
| Step > Step | obj_mm5_pause_menu_step.gml |
| Draw > Draw GUI | obj_mm5_pause_menu_draw_gui.gml |
| Other > Room End | obj_mm5_pause_menu_room_end.gml |
| Destroy | obj_mm5_pause_menu_destroy.gml |

BEGIN Step must be its own event, not code appended to ordinary Step. No ordinary Draw, Room Start, Cleanup or GMS2 events. Do not copy Create into the player. Room End/Destroy both call idempotent cleanup to avoid list leaks/frozen instances.

## 4. Place ONE instance in the stage

Open existing **rm_mm1_cutman_stage**. Place ONE obj_mm5_pause_menu instance (position0,0 fine). No instance Creation Code.

- Do not place obj_mm5_pause_menu_test in this stage.
- Keep existing player, HUD, arrival/READY, stage tiles, collision, charge manager and all music setup unchanged.
- Leave new stage controller out of title, stage-select, intro and UI-test rooms.
- Restore normal first room (rm_mm1_title_screen) if test room is still first.
- If room editor exposes instance creation order, place the stage-menu controller before gameplay instances so its Begin Step gets first chance to freeze. It finds the player only at runtime; it doesn't require player to exist during Create.

## 5. Controls and release guard

- Fresh **Enter/Start** opens. Space/A does NOT open during gameplay; it remains Jump.
- Arrows navigate/repeat as confirmed UI test.
- **Enter OR Space/A on M.BUSTER** closes after release. Escape and X/B do NOT close the main menu; Escape-close belonged only to the isolated UI test.
- Enter OR Space on UPGRADES/WEAPONS buttons changes page (custom two-page navigation).
- Enter on tank currently does nothing at zero count. A-on-tank consumption is not assigned. Tank effect integration comes later.
- Locked weapons remain unavailable; navigate back to M.BUSTER to close.
- No unapproved close/confirm sound is added.

A close request keeps the menu visible/frozen until Enter/Space and all held navigation keys are released. Fire newly pressed while in the menu must also be released. This intentionally prevents a held menu input from moving/jumping/shooting immediately in the stage.

Charge policy for this checkpoint (not a claim about native pause timing):

- If X was already held before pausing and stays held continuously, old charge meter/voice are preserved and resume; releasing X afterward fires normally.
- If that original X hold is RELEASED while menu is open, queued charge is cancelled on resume, preventing a stale release shot. Only charge voice/queue is stopped, not stage music.
- Pressing/repressing X within the menu cannot start a new charge or shot on resume. Release it to finish closing.
- Charge manager must be the accepted asynchronous queue manager, NOT still have the temporary F6 TEST Step that starts/restarts audio independently. Report if that test event still exists before using this integration.

## 6. Run these checks in order

1. Enter Cut Man normally. Press/hold Enter during READY/arrival: must NOT open or buffer a menu. After arrival, release and press fresh Enter: opens once with MM5 sound.
2. Header health matches current gameplay HUD. Lives02. Buster full/unlimited; other weapons0/unowned; all tanks00; Energy Balancer shows NOT OBTAINED. No sample03/14/02/02/01 inventory carried over.
3. Standing: pause, wait, navigate, select M.BUSTER, press Enter and release. Position/physics resume normally; HUD returns, no duplicate UI. Reopen several times: no progressive slowdown or repeated sounds.
4. Close with Space/A. Hold it briefly: menu stays pending until release. On release there must be NO new jump. Press Space again afterward: normal jump works.
5. Pause mid-jump, sliding, and climbing a ladder independently. Position, animation timers, bullets/dust and relevant gameplay must stay frozen. Resume continues state instead of falling/moving behind menu. No extra projectiles or ladder drop from closing A.
6. Hold an arrow and request close: menu remains until arrow released; no stage movement leaks through the close press. Blocked cursor edge must not make sound.
7. Normal charge: hold X into full charge, keep X held, open/close menu with Enter. Charge audio pauses while open, resumes without a second intro when returning. Release X in stage: one appropriate shot.
8. Separate charge case: charge, open menu, RELEASE X in menu, confirm Buster. No stale shot on return; charge sound stops. A fresh X press and subsequent charging still work normally.
9. New X pressed in menu must not shoot when closing. Ensure stage music continues while paused and isn't restarted/stopped on close. Check repeated charge/pause cycles for queue stutters/errors (async runtime test essential).
10. Verify upgrades page navigation/description, return and Buster close. Test inventory is not consumed and unimplemented weapons cannot be falsely equipped.
11. Restart/leave stage through your existing flow after closing; ensure no duplicate controller or stuck inactive player. If you already have a sleeping/offscreen-instance system, verify those remain asleep after pause.

Stop on the first error and report exact event/script/line, or which check fails. This code is new, despite prior UI success; GameMaker scheduling/deactivation/async behaviour cannot be certified by source models.

## Lives, new-game reset and future state

`global.mm5_lives` counts spare lives, starts02 once per application session and survives stage-room recreation. Stage Create calls scr_mm5_pause_inventory_init(false), preserving existing inventory/lives. Future death handling must decrement it; no death exception invented here.

When a real New Game/reset flow is added, call `scr_mm5_pause_inventory_init(true);` ONCE from that new-game event. Do not call true from every stage Create: that would erase progress. No title/room code is patched automatically by this package, so in-process New Game reset is not wired yet.

New globals for future genuine pickup/weapon systems: mm5_pause_owned[0..10], mm5_pause_energy[0..10], mm5_pause_tanks[0..2], mm5_energy_balancer_owned. These are initial state storage, not implemented weapon/tank/upgrade mechanics. Index order matches imported weapon/tank strip manifest. Do not manually mark weapons owned expecting this checkpoint to implement their attacks.

## Safety / limitations

The controller deactivates other currently active instances; future systems that MUST service async work while paused need explicit exceptions (current charge manager already handled). Any extra custom streaming music manager should be reported before integration. It intentionally never calls instance_activate_all/deactivate_all, global audio stop/pause, or room_goto.

If an inactive instance was already sleeping before menu opens, it is not in the saved list and remains inactive on restore. Direct saved IDs are activated without pre-filtering instance_exists (inactive instances return false there). Room End/Destroy restore/dispose tracking defensively; externally forced room changes while paused still require runtime checking if your project adds such a flow.

Source/manifests/credits remain **Sprites by KindlyPatrick** for supplied-sheet weapon art. No credits screen is implemented here. No change to score (game has none), damage/invulnerability, enemies, movement physics or imported art/audio.
