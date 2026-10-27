# `gml/` — copy-paste GameMaker Language code (Studio 1.4.1760)

This folder is the **entire code of the playable vertical slice**. Nothing here
is a library to import; each file is the body of one script or one object event.

## How to read a filename

```
gml/scripts/scr_mm_init.gml          -> Scripts  -> Create Script "scr_mm_init"
gml/objects/obj_player__Step.gml     -> Objects  -> obj_player -> Add Event -> Step -> Step
gml/objects/obj_game__Alarm0.gml     -> Objects  -> obj_game   -> Add Event -> Alarm -> Alarm 0
```

The first comment line of every file repeats its object and event. When an
event needs an **Execute Code** action, drag that action in from the *control*
tab of the Actions panel, paste the file, and click ✓.

> **Before pasting any of it**, create all 17 object names and all 30 sprites
> listed in `docs/02_STEP_BY_STEP.md` (steps 2 and 4). GML is compiled as a
> whole: one missing name stops everything.

---

## Scripts (`gml/scripts/`)

| File | Called from | Purpose |
| --- | --- | --- |
| `scr_mm_constants.gml` | every Create event | ROM-verified constants, view setup, damage/cost/contact tables. Idempotent. |
| `scr_mm_new_game.gml` | `obj_game` Create only | HP, lives, energy, score, unlocked weapons. Call once. |
| `scr_mm_weapon_damage.gml` | `obj_boss` collision | Returns `global.mm_dmg[boss*8 + weapon]`. |
| `scr_mm_hurt_player.gml` | hazards, enemies, boss shot | 111-frame invincibility, 0.5625 knockback, death. |
| `scr_mm_hurt_enemy.gml` | `par_enemy` collision | HP, flash, death, score. |
| `scr_mm_spawn_shot.gml` | `obj_player` Step | Buster pellet, 3-shot cap, 4 px/frame. |
| `scr_mm_camera_snap.gml` | `obj_camera` Step | Snap view to a whole 256×240 screen. |
| `scr_mm_draw_bar.gml` | `obj_hud` Draw | 28-pip NES energy bar. |
| `scr_mm_set_sprite.gml` | `obj_player` Step | Facing sprite + ROM animation speed. |

## Objects (`gml/objects/`)

| Object | Parent | Events provided |
| --- | --- | --- |
| `obj_game` | — | Create, Step, Alarm 0, Draw |
| `obj_hud` | — | Create, Draw |
| `obj_camera` | — | Create, Step |
| `par_solid` | — | *(no code — collision parent)* |
| `obj_block` | `par_solid` | Create |
| `obj_spike` | — | Create, Collision `obj_player` |
| `obj_death_zone` | — | Create, Collision `obj_player` |
| `obj_ladder` | — | Create |
| `obj_player` | — | Create, Step, Draw, Collision `par_enemy` |
| `par_enemy` | — | Create, Step, Draw, Collision `obj_shot`, Destroy |
| `obj_met` | `par_enemy` | Create, Step |
| `obj_shot` | — | Create, Step, Collision `par_solid` |
| `obj_explosion` | — | Create, Other → Animation End |
| `obj_pickup` | — | Create, Step, Collision `obj_player` |
| `obj_boss` | — | Create, Step, Collision `obj_shot`, Destroy |
| `obj_boss_shot` | — | Create, Step, Collision `obj_player` |
| `obj_shutter` | — | Create, Step, Draw |

## Controls used by the code

| Key | NES button | Action |
| --- | --- | --- |
| ← → | D-pad | Walk |
| ↑ ↓ | D-pad | Climb ladders |
| `X` | A | Jump |
| `Z` | B | Fire |
| Enter | Start | Pause / weapon sub-screen (step 10) |
| F1 | — | Reset (debug) |
| F2 | — | Show collision boxes (debug, hold) |
| F3 | — | Cycle test weapon (debug) |

## Design notes for when you extend this

* **Never** store mutable game state in `scr_mm_constants`. It runs whenever an
  object is created.
* Movement uses `xfrac` / `yfrac` accumulators so 1.375 px/frame produces the
  NES's 1-2-1-2 pixel rhythm. Do not round `x` / `y` directly.
* Collision uses `place_meeting` with parents (`par_solid`, `par_enemy`), not
  GameMaker's `solid` flag. Do not tick "Solid" on any object — it causes
  double-collision bugs in 1.4.
* `global.mm_dmg` is a flat array, not 2D, because boss damage is read by one
  tiny function and 1.4's 2D arrays are slower.
* Boss AI in `obj_boss__Step.gml` is a **starter**. A 1:1 fight requires
  porting the `CutmanStrategy*` / `BombmanStrategy*` state tables from
  `bank5.s` of `TheRealQuantam/mm1dasm`.

All constants are documented in `docs/01_THE_1_TO_1_SPEC.md`.
