# Cut Man E-Tank pickup + E refill — GMS1.4.1760

Requires accepted eight enemies/Screw final art, fixed large health, active spikes, Free Fall/Jumping Gates, real MM5 refill/audio and working stage pause controller. Back up your working project and **STOP the runner before installing**. Manual source patch, not a GMX import. Complete all steps before running: new-game inventory initialization defines the persistent collection flag.

## Approved rules

- ONE E-Tank atop the lone raised Super Arm block after the first cutter dispenser/before the middle outdoor pit: **world1168,1048, camera band960**. Existing block1152,1056/32×32;32px climb from nearby ledge1088. Normal jump reaches it; no Super Arm removal or terrain change.
- Carry **up to9 E-Tanks**. At9, the pickup stays there and makes no sound; collect after making room.
- Successful collection stores+1 E, no immediate healing/life award. Existing MM5 pause E count updates. Collected flag persists across life-loss room restarts and revisits; no death farming. Only explicit new-game/Game Over inventory reset clears it. Starting E/W/M stays0, lives02.
- E use: pause, select **E-Tank**, fresh **Start/Enter**. Consume exactly1 if health1–27 and E>0; fill fully to28, one bar/sound every4updates, including final wait. At full health/zero inventory/dead health0, consume nothing. Space/A on a tank does not use it. W/M remain unimplemented/unconsumed.
- During refill, stay in the menu and block navigation/closing/second use; world stays deactivated. After refill, cursor returns to Buster and menu stays open, as observed in MM5. Fresh Start/Enter or A/Space on Buster closes normally. Holding Start does not spend another tank or auto-close.
- No new sound import: native E pickup requests24hex, SAME cue as approved `snd_mm5_extra_life`. Playing that resource does NOT increment lives. E healing uses existing `snd_mm5_health_refill` and existing timing helper. No audio gain/music/charge changes.

## 1. ONE new Sprite

Folder **Sprites → Mega Man → MM5 → Pickups** (same as existing pickup sprites).

Create **`spr_mm5_pickup_e_tank`**:
1. Edit Sprite → File → Create from Strip → **`Art/spr_mm5_pickup_e_tank_strip2.png`**.
2. **Number of images2; Images per row2; Width16; Height16.** All cell/pixel offsets/separations0.
3. Confirm TWO16×16subimages (native palette phases), not one32×16image.
4. Green check; manually set **Origin X8,Y7**. Keep PNG transparency. No Centre/crop/resize/smoothing/Remove Background/repaint.

Do not use the pause-menu tank strip as world art or change any existing tank/pickup sprite. The enlarged Reference preview is NOT import art.

## 2. THREE new Scripts

Create scripts and paste WHOLE matching files from ZIP `Scripts/`:

**Scripts → Stages → MM1 → Cut Man → Pickups**:
- `scr_mm1_cutman_e_tank_spawn`

**Scripts → Mega Man → MM5 → Pause Menu → E-Tank**:
- `scr_mm5_pause_e_tank_use`
- `scr_mm5_pause_e_tank_tick`

Use these exact resource names. These are Scripts, not object events. Existing `scr_mm5_health_refill_tick` and `scr_mm5_combat_refill_sound` are reused unchanged; do not create duplicate/suffixed copies.

## 3. ONE new world object — Create + ordinary Draw ONLY

Folder **Objects → Stages → MM1 → Cut Man → Pickups**.

Create **`obj_mm1_cutman_e_tank`**:
1. Sprite `<no sprite>`; **Visible checked**, Solid unchecked, Persistent unchecked.
2. **Parent = existing `obj_mm5_pickup`**. Required for shared central collection/route cleanup; NOT a terrain parent.
3. **Create → Execute Code:** WHOLE `Objects/obj_mm1_cutman_e_tank_create.gml`.
4. **Ordinary Draw → Execute Code:** WHOLE `Objects/obj_mm1_cutman_e_tank_draw.gml`. Not Draw GUI/Begin/End.
5. No Step, Begin Step, End Step, Collision or Destroy events, no inherited-event action. Fields initialized explicitly. No manual room instance/generator object.

Keep the existing block/solids/feature scripts untouched. The new spawn script places the tank automatically.

## 4. APPEND ONCE to TWO existing Create events

### Combat manager

**Objects → Mega Man → MM5 → Combat → `obj_mm5_combat` → Create → Execute Code** (or its current folder).

At the bottom AFTER all eight-enemy/FreeFall/fixed-large-health initialization, append WHOLE **`Hooks/obj_mm5_combat_create_e_tank_append.gml`**, once. First assignment `cutman_e_tank_x = 1168;`. Keep ALL previous code. No global collected-flag reset here: that would permit farming on death.

### Stage pause controller (NOT the isolated UI-test object)

**Objects → Mega Man → MM5 → Pause Menu → Stage Controller → `obj_mm5_pause_menu` → Create → Execute Code**.

At the very bottom append WHOLE **`Hooks/obj_mm5_pause_menu_create_e_tank_append.gml`**, once. First assignment `menu_e_tank_refilling = false;`. Keep all existing resources/shader/list/surface/inventory initialization.

These are appends, NOT whole Create replacements. No changes to persistent `obj_mm5_pause_state`.

## 5. REPLACE FIVE complete existing Scripts

For each existing Script, select ALL code and paste the WHOLE matching file from ZIP `Scripts/`:

**Scripts → Mega Man → MM5 → Combat**:
1. `scr_mm5_combat_end_frame` — latest active-spikes/large-health/eight-enemy version plus final E spawn call.
2. `scr_mm5_combat_pickup_step` — adds E to the fixed-item exception; random drops unchanged.
3. `scr_mm5_combat_collect` — dedicated E branch BEFORE ordinary health/life/ammo collection; cap check BEFORE taking/removing it.

**Scripts → Mega Man → MM5 → Pause Menu → Stage Controller**:
4. `scr_mm5_pause_inventory_init` — same explicit-reset-only initializer, adds new-game-only `global.mm1_cutman_e_tank_taken = false;`. Do not put this assignment in stage/room/manager Create.
5. `scr_mm5_pause_restore` — retains exact-ID activation/fire/charge policy; commits the paid health refill after player activation and clears pause-owned refill state/voice.

These are Script resources, not events. Do not reinstall older checkpoints or append whole scripts under existing code.

## 6. REPLACE TWO existing pause events

Same **`obj_mm5_pause_menu`** as step4; NOT `obj_mm5_pause_menu_test`:
- **Step → ordinary Step → Execute Code:** select ALL, replace with WHOLE **`Objects/obj_mm5_pause_menu_step.gml`**.
- **Draw → Draw GUI → Execute Code:** select ALL, replace with WHOLE **`Objects/obj_mm5_pause_menu_draw_gui.gml`**.

Keep Begin Step, Create (except append), Destroy/Room End, pause open/dispose/draw-page/nav/transition scripts, shader, LUT and cached-stage ownership unchanged. No new pause phase/transition or activate_all calls.

## 7. Compile and installed checklist

1. Compile from a stopped/fresh runner. Unknown global collected flag means initializer replacement missing or old persistent runner retained; STOP/restart, do not add variable_global_exists. Unknown fields/script/sprite mean a step above is missing.
2. Reach the approved perch. Exactly one E-Tank sits on the block at1168,1048. Wait >5seconds: no fall/expiry/flicker countdown. Two-phase palette animation is intentional. Jump from neighbouring ledge without Super Arm to collect.
3. E inventory +1, pickup cue once, no health/lives/W/M change. Pause shows E01. Leave view and return: no tank. Lose a life/retry: carried E and collected flag remain; no tank respawn. Explicit new game resets all inventory and allows collection anew.
4. At E9, touching the pickup must leave it uncollected/silent. Use one carried tank while damaged, close pause; the available pickup can then add the ninth and become collected.
5. Damage Mega Man. Pause, navigate to E, press fresh Start/Enter. E decreases once; menu health refills to28 with one accepted sound per bar/four updates. No enemy/shot/camera/hurt/flash timer movement while frozen. Holding Start/directions/A must not spend more or close during refill.
6. After full refill+last wait, cursor is Buster, menu still open. Fresh Start or A closes with the accepted fade/sound. The frozen-stage HUD during closing and live HUD after return must show full health. Existing charge-release/rearm/held-charge policy must remain correct.
7. E at full health and empty E must do nothing silently. Space/A on E does not use it. W/M do not consume or pretend to heal. Health0/death cannot be revived with an E-Tank.
8. Test starting from1,27 and intermediate health. Check menu/life/weapon layout unchanged, no score/new text. Pause during ordinary health-pickup refill should not double-heal after E use.
9. Recheck fixed health1832,184, random drops, eight enemies/Screw art, spike recoil/flashing-expiry behaviour, pit/no-particle death and both walking/jumping doors. No corresponding art/terrain/player/death/audio/camera resources changed.
10. If window minimization loses a surface during E refill, existing safe-restore path completes the already-paid heal instead of wasting the tank; resumes exact frozen IDs only. No copied player/world events run while inactive. Report runtime issues by resource/event/line or menu phase.

## Implementation/evidence limits

`Reference/native-mm5-e-tank.json`: supplied original MM5ROM source spans confirm pickup24cue/cap9; two native E world palette phases opaque-render matched from a controlled common-pickup B6/animation72 fixture. Natural Start→Down→Start menu inputs with seeded HP/inventory verify full heal, four-update sounds, full/empty guard, held Start once, remains in menu (Buster selection visually checked). This is not natural fullstage pickup traversal or hardware/Mesen executable certification. Project intentionally leaves world pickup at cap, unlike native MM5 removing it. User-approved placement is custom, not an original MM1 tank location.

Pause refill animates a pause-owned health copy with the unchanged pure timing/audio helpers; player/world stay deactivated. On normal restore the paid full heal is committed AFTER exact-ID activation. This is a deliberate GMS freeze-safe adaptation, not native RAM ownership/tank persistence reproduction. Surface-loss/Room-End safe restore completes the paid benefit even if animation interrupted; no refund/double consume. Collected flag persists until explicit new game; later stage-exit/save-system policy is not added here.

Actual-GML model tests cover native art/effects, perch/cap/once/retry/newgame, world freeze using an inactive-player access trap, full/empty/held/A/W/M guards, cue cadence/last wait, restore/volatile-surface fallback/cachedHUD source and accepted-source preservation. Source/model/native checks **are not GMS1.4 compilation, GPU, deactivated-instance scheduler, audio or installed acceptance**. Please compile/playtest before calling this checkpoint accepted. No ROM/savestate/disassembly shipped.
