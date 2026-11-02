# Cut Man — connected combat + victory incremental update

**GameMaker Studio1.4.1760. Stop the runner and back up the project first.**
Apply this entire update before compiling. This is not a standalone project/GMZ
and is not installed or runtime-validated by the source tests.

## Baseline and preflight — do not reinstall the entrance

Start from the working full Cut Man stage with accepted E-Tank, entrance,
one-column closing shutter, wall flash and boss health fill installed. Earlier
combat/victory drafts were source-only; do not append a second copy if you have
manually tried them. Keep all accepted stage art, solids, ladders, camera events,
doors, flash object, HUD, music/charge managers and pause objects unchanged
except the specific replacements/hooks below.

Confirm the existing `rm_mm1_stage_select` room exists with that exact resource
name. This is the return destination. **If missing, stop rather than creating an
empty substitute.** Confirm `obj_mm5_pause_state` remains persistent and its
existing inventory initialization works. The existing `snd_mm6_enemy_hit`,
`spr_mm5_pause_font`, MM5 player/charge/hurt resources and existing scripts named
in `MANIFEST.json > preexistingScriptDependencies` must already exist.

Do not import previous review WAVs, custom compositions, MM6 weapon-get16,
scissors26 or any ROM/snapshot files. No boss-intro cadence/audio changes here.

## 1. Script resources — exact actions in the table below

For each **new** Script create the exact resource name listed, in its indicated
folder, and paste the complete matching `Scripts/<name>.gml`. Do not include
`.gml` in the resource name. These are Scripts, not object events.

For the five **replace** Scripts, select all existing code and replace it with
the supplied entire file. Preserve their existing resource names/locations:

- `scr_mm5_combat_end_frame`: sole world/shots/contact/animation order and lethal
  victory latch guards; preserves accepted E-Tank baseline.
- `scr_mm5_combat_shot_step`: boss28HP with normal/partial/full1/1/3 routing.
- `scr_mm5_combat_die`: accepted fall/death path plus boss/music shutdown.
- `scr_mm5_pause_open`: accepted entrance/pause code with victory guard first.
- `scr_mm5_pause_inventory_init`: accepted new-game/E-Tank reset plus Cut Man
  completion reset only on explicit new game; false stage-entry exit preserved.

Do not also paste old Victory/Hooks pause/inventory snippets: they are already
merged into these two full replacement files.

## 2. New sprites and approved sounds

Create the exact resources in the generated tables below. All PNGs preserve
alpha and padding: no crop, trim, resize, background removal or automatic centring.
For one-frame images use ordinary Load Sprite. For strips use Edit Sprite >
File > Create from Strip: number of images=listed frames, images per row=that
same count, cell width/height=listed cell, all offsets/separations0. Confirm the
result has exactly that many subimages. Set the listed origin manually.

Do not assign these sprites as player masks, stage scenery or room instances.
The existing boss's entrance sprite stays its default. Draw selects the combat
frames explicitly. Intro22 is a finite animation atlas, not another Step clock.

For all four Sounds: default audio group, uncompressed/non-streamed,
non-positional, default volume1, no independent playback event. Code owns
once-only playback and cleanup. `snd_mm5_weapon_get.wav` is the approved extended
15.392s original-level take. Do NOT normalize, boost, stretch or enable looping.
Cutter25 uses its approved source unchanged. Existing accepted hit/shot/charge
sounds remain as installed; do not multiply all sounds by2 again.

## 3. Existing boss object — exactly two replacements and two additions

`obj_mm1_cutman_boss` stays in Objects > MM1 > Bosses > Cut Man > Entrance.
Parent none; Visible ON, Solid OFF, Persistent OFF; default sprite remains
`spr_mm1_cutman_boss_entrance`; Create sets depth−8.

- **Create > Execute Code:** replace entire event with
  `Objects/obj_mm1_cutman_boss_create.gml`. It includes entrance fields and all
  combat/victory initialization; do not append init again or call init each Step.
- **Draw > ordinary Draw > Execute Code:** replace entire event with
  `Objects/obj_mm1_cutman_boss_draw.gml`. Not Draw GUI.
- **Other > Room End > Execute Code:** add
  `Objects/obj_mm1_cutman_boss_room_end_and_destroy.gml`.
- **Destroy > Execute Code:** add the same cleanup file. Both calls are safe.
  If either event already has code, append the supplied cleanup once, retaining
  the existing body. Do not add music disposal to Draw.

Keep the existing boss **Draw GUI meter** unchanged. **No boss Step, Begin Step,
End Step, Alarm or Collision events. No separate Cutter object/Step.** The
accepted entrance still spawns this boss; do not place another boss in the room.

## 4. One new draw-only screen object

Objects > MM1 > Bosses > Cut Man > Victory:
create `obj_mm1_cutman_weapon_screen`. Sprite none; Parent none; Visible ON;
Solid OFF; Persistent OFF. No mask. Create sets depth−30000.

- **Create > Execute Code:** entire
  `Objects/obj_mm1_cutman_weapon_screen_create.gml`.
- **Draw > Draw GUI > Execute Code:** entire
  `Objects/obj_mm1_cutman_weapon_screen_draw_gui.gml`.

No ordinary Draw/Step/keyboard/Collision/Alarm events. Do not place it in a room.
The phase entry creates it once after teleport. Keep the project's existing
256x240 GUI/application-surface setup. Do not change Mesen, display settings,
views or accepted room coordinates to compensate for an incorrect import.

## 5. Existing MM5 player — three precise incremental changes

Use existing `obj_mm5_megaman`, not a new player object.

1. **Create:** append `Player/obj_mm5_megaman_create_append.gml` exactly once,
   after all existing player initialization. Do not replace the full Create.
2. **Step:** at its very top find the existing combat prefix beginning
   `scr_mm5_combat_begin();` and ending after the `mm5_hurt_left > 0` block
   that calls `scr_mm5_player_hurt_step(); exit;`. Replace **that prefix only**
   with `Player/obj_mm5_megaman_step_combat_prefix.gml`. Leave route/startup/
   charge/ladder/slide/main movement code below it unchanged. New order is
   combat begin → victory coordinator → existing lock/route/hurt guards.
   There must be only one victory coordinator call in the entire project.
3. **ordinary Draw:** retain the existing startup prefix and all trailing debug
   drawing. Replace only the current character block beginning
   `var combat_owner, combat_draw;` with
   `Player/obj_mm5_megaman_draw_character_block.gml`. This retains existing
   charge/hurt palette selection and adds the victory drawing guard immediately
   after `combat_draw = true;`. Do not exit the entire Draw event or replace HUD.

If these exact accepted anchors are missing, stop and compare against your
backup rather than guessing an insertion point or appending duplicate prefixes.

## 6. Leave camera, room, HUD and entrance alone

Do not add victory Step calls to camera/boss/screen. Existing camera End Step
already calls `scr_mm5_combat_end_frame` after final view placement; replacing
that Script connects the fight. Existing boss music owner disposes itself via
its established helper; do not use `audio_stop_all`.

No new room creation code, extra scenery/solids/shutter columns, editor blocks,
pickups, pause rows or E-Tank placement changes. Do not re-run old entrance packs.
No score, CLEAR POINTS, password or stage-clear item award is added.

## 7. Compile and validate as one update

Run a fresh new game, not a hot-resumed runner with missing Create fields.
Follow **ACCEPTANCE.md**. Source regressions and package validation are not a
substitute for GMS compilation, real pause/deactivation, GPU or queued audio.
If a compile error names a missing resource, verify exact spelling and the
manifest before editing unrelated accepted code. If runtime fails, report the
first error plus resource/event/phase; restore the backed-up project as a unit.

This update unlocks R.CUTTER and28 energy in the existing session inventory and
returns once to stage selection. The screen demo is fixed original-player
Cutter playback, not a new general equipped-Cutter gameplay controller. It does
not add disk saving or a new stage-select cleared-marker graphic.

<!-- GENERATED RESOURCE TABLES -->

## Exact Script table

| Resource | Action | Folder |
|---|---|---|
| `scr_mm1_cutman_animation_header` | new | Scripts > MM1 > Cut Man > Combat |
| `scr_mm1_cutman_animation_sprite` | new | Scripts > MM1 > Cut Man > Combat |
| `scr_mm1_cutman_boss_animate` | new | Scripts > MM1 > Cut Man > Combat |
| `scr_mm1_cutman_boss_contact` | new | Scripts > MM1 > Cut Man > Combat |
| `scr_mm1_cutman_boss_decide` | new | Scripts > MM1 > Cut Man > Combat |
| `scr_mm1_cutman_boss_face` | new | Scripts > MM1 > Cut Man > Combat |
| `scr_mm1_cutman_boss_hit` | new | Scripts > MM1 > Cut Man > Combat |
| `scr_mm1_cutman_boss_motion` | new | Scripts > MM1 > Cut Man > Combat |
| `scr_mm1_cutman_boss_post_frame` | new | Scripts > MM1 > Cut Man > Combat |
| `scr_mm1_cutman_boss_stop_combat` | new | Scripts > MM1 > Cut Man > Combat |
| `scr_mm1_cutman_boss_world_step` | new | Scripts > MM1 > Cut Man > Combat |
| `scr_mm1_cutman_cutter_aim` | new | Scripts > MM1 > Cut Man > Combat |
| `scr_mm1_cutman_cutter_manage` | new | Scripts > MM1 > Cut Man > Combat |
| `scr_mm1_cutman_cutter_move` | new | Scripts > MM1 > Cut Man > Combat |
| `scr_mm1_cutman_cutter_throw` | new | Scripts > MM1 > Cut Man > Combat |
| `scr_mm5_combat_die` | replace | Scripts > MM1 > Cut Man > Combat |
| `scr_mm5_combat_end_frame` | replace | Scripts > MM1 > Cut Man > Combat |
| `scr_mm5_combat_shot_step` | replace | Scripts > MM1 > Cut Man > Combat |
| `scr_mm1_cutman_defeat_draw` | new | Scripts > MM1 > Cut Man > Victory |
| `scr_mm1_cutman_defeat_start` | new | Scripts > MM1 > Cut Man > Victory |
| `scr_mm1_cutman_defeat_step` | new | Scripts > MM1 > Cut Man > Victory |
| `scr_mm1_cutman_victory_anim_data` | new | Scripts > MM1 > Cut Man > Victory |
| `scr_mm1_cutman_victory_anim_draw` | new | Scripts > MM1 > Cut Man > Victory |
| `scr_mm1_cutman_victory_anim_enter` | new | Scripts > MM1 > Cut Man > Victory |
| `scr_mm1_cutman_victory_anim_step` | new | Scripts > MM1 > Cut Man > Victory |
| `scr_mm1_cutman_victory_audio_dispose` | new | Scripts > MM1 > Cut Man > Victory |
| `scr_mm1_cutman_victory_audio_step` | new | Scripts > MM1 > Cut Man > Victory |
| `scr_mm1_cutman_victory_busy` | new | Scripts > MM1 > Cut Man > Victory |
| `scr_mm1_cutman_victory_handoff` | new | Scripts > MM1 > Cut Man > Victory |
| `scr_mm1_cutman_victory_init` | new | Scripts > MM1 > Cut Man > Victory |
| `scr_mm1_cutman_victory_player_begin` | new | Scripts > MM1 > Cut Man > Victory |
| `scr_mm1_cutman_victory_player_draw` | new | Scripts > MM1 > Cut Man > Victory |
| `scr_mm1_cutman_victory_player_move` | new | Scripts > MM1 > Cut Man > Victory |
| `scr_mm1_cutman_victory_player_step` | new | Scripts > MM1 > Cut Man > Victory |
| `scr_mm1_cutman_victory_player_tick` | new | Scripts > MM1 > Cut Man > Victory |
| `scr_mm1_cutman_victory_reward_return` | new | Scripts > MM1 > Cut Man > Victory |
| `scr_mm1_cutman_victory_start` | new | Scripts > MM1 > Cut Man > Victory |
| `scr_mm1_cutman_victory_step` | new | Scripts > MM1 > Cut Man > Victory |
| `scr_mm1_cutman_weapon_demo_sample` | new | Scripts > MM1 > Cut Man > Victory |
| `scr_mm1_cutman_weapon_demo_step` | new | Scripts > MM1 > Cut Man > Victory |
| `scr_mm1_cutman_weapon_screen_enter` | new | Scripts > MM1 > Cut Man > Victory |
| `scr_mm1_cutman_weapon_screen_intro` | new | Scripts > MM1 > Cut Man > Victory |
| `scr_mm1_cutman_weapon_screen_step` | new | Scripts > MM1 > Cut Man > Victory |
| `scr_mm1_cutman_weapon_screen_present` | new | Scripts > MM1 > Cut Man > Victory |
| `scr_mm5_pause_open` | replace | Keep existing resource location |
| `scr_mm5_pause_inventory_init` | replace | Keep existing resource location |

## Exact Sprite table

| Resource | PNG | Frames | Cell | Origin |
|---|---|---:|---|---|
| `spr_mm1_cutman_combat` | `Sprites/spr_mm1_cutman_combat_strip34.png` | 34 | 48x64 | 24,32 |
| `spr_mm6_boss_defeat` | `Sprites/spr_mm6_boss_defeat_strip6.png` | 6 | 32x32 | 16,16 |
| `spr_mm6_inroom_victory_tiles` | `Sprites/spr_mm6_inroom_victory_tiles_strip62.png` | 62 | 8x8 | 0,0 |
| `spr_mm1_weapon_get_frame` | `Sprites/spr_mm1_weapon_get_frame.png` | 1 | 256x240 | 0,0 |
| `spr_mm1_weapon_get_rolling_cutter_megaman` | `Sprites/spr_mm1_weapon_get_rolling_cutter_megaman.png` | 1 | 64x96 | 0,0 |
| `spr_mm1_cutter_screen_intro_strip22` | `Sprites/spr_mm1_cutter_screen_intro_strip22.png` | 22 | 256x240 | 0,0 |
| `spr_mm5_cutter_demo_idle` | `Sprites/spr_mm5_cutter_demo_idle.png` | 1 | 32x32 | 0,0 |
| `spr_mm5_cutter_demo_throw` | `Sprites/spr_mm5_cutter_demo_throw.png` | 1 | 40x40 | 0,0 |
| `spr_mm5_cutter_demo_idle_left` | `Sprites/spr_mm5_cutter_demo_idle_left.png` | 1 | 32x32 | 0,0 |
| `spr_mm5_cutter_demo_throw_left` | `Sprites/spr_mm5_cutter_demo_throw_left.png` | 1 | 40x40 | 0,0 |
| `spr_mm1_player_rolling_cutter_demo_left_strip2` | `Sprites/spr_mm1_player_rolling_cutter_demo_left_strip2.png` | 2 | 16x16 | 0,0 |

Sprites use the Combat/Victory folders recorded per-resource in MANIFEST.json.

## Exact Sound table

| Resource | WAV | Folder |
|---|---|---|
| `snd_mm1_cutman_rolling_cutter_throw` | `Sounds/snd_mm1_cutman_rolling_cutter_throw.wav` | Sounds > MM1 > Bosses > Cut Man > Combat |
| `snd_mm6_stage_clear` | `Sounds/snd_mm6_stage_clear.wav` | Sounds > MM1 > Bosses > Cut Man > Victory |
| `snd_mm6_weapon_acquisition` | `Sounds/snd_mm6_weapon_acquisition.wav` | Sounds > MM1 > Bosses > Cut Man > Victory |
| `snd_mm5_weapon_get` | `Sounds/snd_mm5_weapon_get.wav` | Sounds > MM1 > Bosses > Cut Man > Victory |
