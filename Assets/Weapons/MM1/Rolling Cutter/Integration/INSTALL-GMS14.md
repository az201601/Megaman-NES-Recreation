# Equipped R.CUTTER — GMS1.4.1760 incremental installation

**Stop Run and back up the working project first.** Baseline:accepted Cut Man
victory/full teleport,unlock retained,F8 test removed. Do NOT reinstall the stage,
entrance,boss,victory screen,music or sounds. This update is not a GMX project.
Finish ALL steps before Run:the Scripts and resources reference each other.
Names are exact;no automatic suffixes,duplicate objects or room instances.

## 1. Import15 new sprites

Create-from-strip,horizontal,no offsets/separation. Preserve alpha/no smoothing,
background removal,cropping,trim,recentering or resizing. Set exact manual origins.
Resource folder:Sprites → Mega Man → MM5 → Rolling Cutter for player variants;
Sprites → Weapons → MM1 → Rolling Cutter for projectile;
Sprites → Mega Man → MM5 → HUD for energy meter.

| Resource | File | Cell | Frames | Origin |
|---|---|---:|---:|---:|
| `spr_mm5_cutter_player_idle` | `Art/spr_mm5_cutter_player_idle.png` | 32×32 | 1 | 16,16 |
| `spr_mm5_cutter_player_walk` | `Art/spr_mm5_cutter_player_walk_strip4.png` | 32×32 | 4 | 16,16 |
| `spr_mm5_cutter_player_air` | `Art/spr_mm5_cutter_player_air.png` | 32×40 | 1 | 16,16 |
| `spr_mm5_cutter_player_climb` | `Art/spr_mm5_cutter_player_climb_strip2.png` | 32×40 | 2 | 16,16 |
| `spr_mm5_cutter_player_ladder_top` | `Art/spr_mm5_cutter_player_ladder_top.png` | 32×40 | 1 | 16,16 |
| `spr_mm5_cutter_player_slide` | `Art/spr_mm5_cutter_player_slide.png` | 32×40 | 1 | 16,16 |
| `spr_mm5_cutter_player_idle_shoot` | `Art/spr_mm5_cutter_player_idle_shoot.png` | 40×40 | 1 | 16,16 |
| `spr_mm5_cutter_player_walk_shoot` | `Art/spr_mm5_cutter_player_walk_shoot_strip4.png` | 40×40 | 4 | 16,16 |
| `spr_mm5_cutter_player_air_shoot` | `Art/spr_mm5_cutter_player_air_shoot.png` | 40×40 | 1 | 16,16 |
| `spr_mm5_cutter_player_climb_shoot` | `Art/spr_mm5_cutter_player_climb_shoot.png` | 40×40 | 1 | 16,16 |
| `spr_mm5_cutter_player_ladder_top_shoot` | `Art/spr_mm5_cutter_player_ladder_top_shoot.png` | 40×40 | 1 | 16,16 |
| `spr_mm5_cutter_player_hurt` | `Art/spr_mm5_cutter_player_hurt_strip2.png` | 32×40 | 2 | 16,16 |
| `spr_mm5_cutter_player_arrival` | `Art/spr_mm5_cutter_player_arrival_strip5.png` | 32×48 | 5 | 16,16 |
| `spr_mm1_player_rolling_cutter` | `Art/spr_mm1_player_rolling_cutter_strip4.png` | 16×16 | 4 | 8,7 |
| `spr_mm5_cutter_energy_meter` | `Art/spr_mm5_cutter_energy_meter_strip29.png` | 8×56 | 29 | 0,0 |

## 2. Create11 new Scripts

Scripts → Weapons → MM1 → Rolling Cutter. Each Script resource uses the exact
filename without `.gml`;paste its complete matching file from `Scripts/`:

- `scr_mm1_player_cutter_aim`
- `scr_mm1_player_cutter_begin`
- `scr_mm1_player_cutter_contacts`
- `scr_mm1_player_cutter_hit`
- `scr_mm1_player_cutter_manage`
- `scr_mm1_player_cutter_motion`
- `scr_mm1_player_cutter_palette`
- `scr_mm1_player_cutter_refill_tick`
- `scr_mm1_player_cutter_step`
- `scr_mm1_player_cutter_try_fire`
- `scr_mm5_weapon_apply_selection`

## 3. Create one projectile object

Objects → Weapons → MM1 → Rolling Cutter → `obj_mm1_player_cutter`.
Sprite:<no sprite>;Parent:<no parent>;Mask:<same as sprite>;Visible:ON;
Solid:OFF;Persistent:OFF. Depth is set in Create. No room placement.

- Create:complete `Objects/obj_mm1_player_cutter_create.gml`.
- Draw → Draw:complete `Objects/obj_mm1_player_cutter_draw.gml`.
- Destroy:complete `Objects/obj_mm1_player_cutter_destroy_and_room_end.gml`.
- Other → Room End:SAME complete destroy-and-room-end file.
- NO Step,Begin Step,End Step,Alarm,Collision or inherited events.

## 4. Replace11 existing Scripts completely

Keep the existing resource names/folders. Replace each whole body using the same
name under `Adapters/`,NOT similarly named older stage checkpoints:

- `scr_mm1_cutman_boss_hit` ← `Adapters/scr_mm1_cutman_boss_hit.gml`
- `scr_mm1_cutman_victory_handoff` ← `Adapters/scr_mm1_cutman_victory_handoff.gml`
- `scr_mm5_combat_begin` ← `Adapters/scr_mm5_combat_begin.gml`
- `scr_mm5_combat_collect` ← `Adapters/scr_mm5_combat_collect.gml`
- `scr_mm5_combat_die` ← `Adapters/scr_mm5_combat_die.gml`
- `scr_mm5_combat_end_frame` ← `Adapters/scr_mm5_combat_end_frame.gml`
- `scr_mm5_pause_inventory_init` ← `Adapters/scr_mm5_pause_inventory_init.gml`
- `scr_mm5_pause_dispose` ← `Adapters/scr_mm5_pause_dispose.gml`
- `scr_mm5_pause_open` ← `Adapters/scr_mm5_pause_open.gml`
- `scr_mm5_pause_restore` ← `Adapters/scr_mm5_pause_restore.gml`
- `scr_mm5_player_try_buster` ← `Adapters/scr_mm5_player_try_buster.gml`

Full inventory replacement already includes the accepted E-Tank and Cut-cleared
flags plus the new equipped slot. Do NOT append those flags a second time.
`Adapters/scr_mm5_pause_inventory_init_equipment_append.gml` is an old staging
note and is intentionally NOT packaged. Do not use it instead of the full file.

## 5. Existing events — exact bounded edits

1. `obj_mm5_combat` → Create:APPEND ONCE
   `Adapters/obj_mm5_combat_create_equipment_append.gml` after existing code.
   Keep all stage spawn arrays/boss fields and original Create body.
2. `obj_mm5_pause_menu` → Step → Step:REPLACE WHOLE event with
   `Adapters/obj_mm5_pause_menu_step.gml` (accepted E refill retained).
3. Same pause object → Draw → Draw GUI:REPLACE WHOLE event with
   `Adapters/obj_mm5_pause_menu_draw_gui.gml` (energy added to frozen snapshot).
4. `obj_mm5_hud` → Draw → Draw GUI:REPLACE WHOLE event with
   `Adapters/obj_mm5_hud_draw_gui.gml` (health unchanged,energy added).
5. `obj_mm5_stage_start` → Draw → Draw:REPLACE WHOLE event with
   `Adapters/obj_mm5_stage_start_draw.gml` (arrival palette only;READY unchanged).
6. `obj_mm5_megaman` → Draw → Draw:replace ONLY the existing character block
   beginning `var combat_owner, combat_draw;` through its closing character
   drawing brace,before reference/debug drawing. Use
   `Adapters/obj_mm5_megaman_draw_character_block.gml`.
   KEEP the existing startup prefix,KEEP the accepted outer victory prefix
   `if (scr_mm1_cutman_victory_player_draw()) exit;`,and KEEP debug drawing after.
   Do not replace the entire event or duplicate those guards.

No player Step/Create replacement,no camera/controller event replacement,no room
editor changes. Existing camera calls the now-updated shared End Frame Script.
Existing MM5 charge/normal/ladder call sites route through the updated firing Script.

## 6. Fresh Run,then incremental runtime checks

Stop/restart the runner (not a live state containing pre-update persistent fields).
First compile and check M.BUSTER/arrival/charge/menu/E-Tank before testing Cutter.
Use the normal saved project/stage flow;no F8/test key is reintroduced here.
Then use `Integration/ACCEPTANCE.md`. Compilation/event/deactivation/audio tests
must happen in the user's GMS runner;source tests do not certify those outcomes.

## Evidence and deliberate adaptations

Original PLAYER flight,energy1,enemy-damage tables,8×8 Cutter hitbox and four-pose
art are ROM researched. Current world clipping and one-hit-per-contiguous-overlap
policy are explicit hybrid adapters,not a claimed full MM1 enemy-hit-state port.
Cutter survives hits and ignores closed armour/terrain. Existing approved throw25,
hit,refill sounds are reused;no new audio resource/import or listening approval.
Existing victory demo/resources remain untouched.
