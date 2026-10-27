# 02 — Step by step: from empty project to Mega Man 1

**Prerequisite:** finish [`00_START_HERE.md`](00_START_HERE.md) (project, room,
one sprite, F5 works). Keep
[`01_THE_1_TO_1_SPEC.md`](01_THE_1_TO_1_SPEC.md) open in another tab.

Every step ends with **Test**. Do not move on until the test passes.

---

## Contents

| Step | You will have |
| --- | --- |
| 1 | Project + 256×240 room (done in 00_START_HERE) |
| 2 | All authentic sprites imported with correct origins and masks |
| 3 | All 9 scripts pasted in |
| 4 | All object names created (shells) |
| 5 | All object code pasted in |
| 6 | A playable first screen with real NES physics |
| 7 | Shooting, an enemy, explosions and pickups |
| 8 | HUD, health, lives, checkpoints, death |
| 9 | Multi-screen rooms, camera, ladders, pits, shutters |
| 10 | Weapons, energy, boss damage table, Cut Man fight |
| 11 | Stage select, all 6 stages + 4 Wily stages, game over |
| 12 | Sound, optional 1:1 hardware quirks, QoL toggles |
| 13 | Side-by-side verification against the ROM |

---

## STEP 2 — Import every sprite

### 2.1 How to create one sprite

1. Right-click **Sprites → Create Sprite**.
2. Name it (first column of the table).
3. **Load Sprite** → pick the PNG (second column).
4. Set **Origin** (third column).
5. **Modify Mask** → tick **Manual**, set the bounding box (fourth column).
   This is the *hitbox*, and the NES one is much smaller than the picture.
6. Close the window.

> **Multi-frame sprites.** For names marked `strip`, the PNG contains several
> 48×48 frames in a horizontal row. Either:
> * **Sprite Editor → File → Create from Strip** (choose the strip PNG,
>   number of images = frame count, image size 48×48, separation 0), **or**
> * the reliable beginner way: **Load Sprite** the `_0.png` file, then in
>   **Edit Sprite → Add from File** add `_1.png`, `_2.png`, … in order.
>
> Both produce identical results. The individual numbered PNGs are in the same
> folder as the strip, so you can always fall back to adding frames one by one.

### 2.2 The full sprite list

All player sprites come from `gfx/megaman/P/` (the default Mega Buster
palette). All others come from `gfx/objects/`, `gfx/placeholder/`.

| Sprite name | PNG | Origin | Mask (left, right, top, bottom) |
| --- | --- | --- | --- |
| `spr_mm_stand_R` | `megaman/P/stand_R_0.png` | 24,24 | 18, 29, 13, 34 |
| `spr_mm_stand_L` | `megaman/P/stand_L_0.png` | 24,24 | 18, 29, 13, 34 |
| `spr_mm_shoot_R` | `megaman/P/stand_shoot_R_0.png` | 24,24 | 18, 29, 13, 34 |
| `spr_mm_shoot_L` | `megaman/P/stand_shoot_L_0.png` | 24,24 | 18, 29, 13, 34 |
| `spr_mm_run_R` | `megaman/P/run_R_strip.png` (4 frames) | 24,24 | 18, 29, 13, 34 |
| `spr_mm_run_L` | `megaman/P/run_L_strip.png` (4 frames) | 24,24 | 18, 29, 13, 34 |
| `spr_mm_runshoot_R` | `megaman/P/run_shoot_R_strip.png` (4) | 24,24 | 18, 29, 13, 34 |
| `spr_mm_runshoot_L` | `megaman/P/run_shoot_L_strip.png` (4) | 24,24 | 18, 29, 13, 34 |
| `spr_mm_jump_R` | `megaman/P/jump_R_0.png` | 24,24 | 18, 29, 13, 34 |
| `spr_mm_jump_L` | `megaman/P/jump_L_0.png` | 24,24 | 18, 29, 13, 34 |
| `spr_mm_jumpshoot_R` | `megaman/P/jump_shoot_R_0.png` | 24,24 | 18, 29, 13, 34 |
| `spr_mm_jumpshoot_L` | `megaman/P/jump_shoot_L_0.png` | 24,24 | 18, 29, 13, 34 |
| `spr_mm_climb_R` | `megaman/P/climb_R_strip.png` (2) | 24,24 | 18, 29, 13, 34 |
| `spr_mm_climb_L` | `megaman/P/climb_L_strip.png` (2) | 24,24 | 18, 29, 13, 34 |
| `spr_mm_hurt_R` | `megaman/P/hurt_R_strip.png` (4) | 24,24 | 18, 29, 13, 34 |
| `spr_mm_hurt_L` | `megaman/P/hurt_L_strip.png` (4) | 24,24 | 18, 29, 13, 34 |
| `spr_shot` | `objects/shot_L_0.png` | 24,24 | 20, 27, 20, 27 |
| `spr_explosion` | `objects/explosion_L_strip.png` (2) | 24,24 | automatic |
| `spr_met_R` | `objects/met_R_strip.png` (2) | 24,24 | 18, 29, 16, 34 |
| `spr_met_L` | `objects/met_L_strip.png` (2) | 24,24 | 18, 29, 16, 34 |
| `spr_pickup_life_small` | `objects/small_life_L_0.png` | 24,24 | 20, 27, 20, 27 |
| `spr_pickup_weapon_small` | `objects/small_weapon_L_0.png` | 24,24 | 20, 27, 20, 27 |
| `spr_pickup_life_large` | `objects/large_life_L_strip.png` (2) | 24,24 | 18, 29, 18, 30 |
| `spr_pickup_weapon_large` | `objects/large_weapon_L_strip.png` (2) | 24,24 | 18, 29, 18, 30 |
| `spr_boss_cutman` | `objects/major_frame_36.png` | 24,24 | 12, 35, 8, 40 |
| `spr_block` | `placeholder/solid_block_16x16.png` | 0,0 | 0, 15, 0, 15 |
| `spr_spike` | `placeholder/spikes_16x16.png` | 0,0 | 0, 15, 0, 15 |
| `spr_ladder` | `placeholder/ladder_16x16.png` | 0,0 | 0, 15, 0, 15 |
| `spr_death_zone` | `placeholder/death_zone_16x16.png` | 0,0 | 0, 15, 0, 15 |

> The 12×22 player mask is deliberately smaller than the 48×48 canvas. Check it
> live with **F2** (the debug box) after step 6.

**Test:** open any sprite — you should see the original 1987 pixel art, sharp,
with the origin crosshair in the middle.

---

## STEP 3 — Paste the 9 scripts

For each file in `gml/scripts/`, right-click **Scripts → Create Script**, name it
after the filename without `.gml` (e.g. `scr_mm_constants`), and paste the whole
file. Click the green ✓.

| File | What it does |
| --- | --- |
| `scr_mm_constants.gml` | Every ROM number + view setup + damage tables. Safe to call repeatedly. |
| `scr_mm_new_game.gml` | HP, lives, energy, score. Called once. |
| `scr_mm_weapon_damage.gml` | Looks up the 11×8 boss damage table. |
| `scr_mm_hurt_player.gml` | Damage, 111-frame mercy invincibility, knockback, death. |
| `scr_mm_hurt_enemy.gml` | Enemy HP + hit flash. |
| `scr_mm_spawn_shot.gml` | Buster pellet with the 3-shot cap. |
| `scr_mm_camera_snap.gml` | Snaps the view to a 256×240 screen. |
| `scr_mm_draw_bar.gml` | Draws a 28-pip HUD bar. |
| `scr_mm_set_sprite.gml` | Picks the correct facing sprite + ROM animation speed. |

**Why split constants from state?** If `scr_mm_new_game` were called by a new
enemy spawning, your HP would reset every time a Met appeared. Constants are
idempotent; game state is not. This is the single most common beginner bug.

**Test:** no test yet — scripts do nothing until called.

---

## STEP 4 — Create all object names (shells only)

> **Do this before pasting ANY object code.** GML refers to objects by name, and
> GameMaker will refuse to compile if a name is missing. Create all 17 objects
> now with only their names, parents and sprites. No events yet.

Right-click **Objects → Create Object**. In the Object Properties set **Name**,
**Sprite** and **Parent** from the table.

| Object | Parent | Sprite |
| --- | --- | --- |
| `obj_game` | *(none)* | *(none)* |
| `obj_hud` | *(none)* | *(none)* |
| `obj_camera` | *(none)* | *(none)* |
| `par_solid` | *(none)* | *(none)* |
| `obj_block` | `par_solid` | `spr_block` |
| `obj_spike` | *(none)* | `spr_spike` |
| `obj_death_zone` | *(none)* | `spr_death_zone` |
| `obj_ladder` | *(none)* | `spr_ladder` |
| `obj_player` | *(none)* | `spr_mm_stand_R` |
| `par_enemy` | *(none)* | *(none)* |
| `obj_met` | `par_enemy` | `spr_met_L` |
| `obj_shot` | *(none)* | `spr_shot` |
| `obj_explosion` | *(none)* | `spr_explosion` |
| `obj_pickup` | *(none)* | *(none)* |
| `obj_boss` | *(none)* | `spr_boss_cutman` |
| `obj_boss_shot` | *(none)* | `spr_shot` |
| `obj_shutter` | *(none)* | *(none)* |

> `par_solid` and `par_enemy` are **parents**. Their children inherit events and
> are found by `place_meeting(x, y, par_solid)` and collisions with
> `par_enemy`. That is why one collision event handles every wall and every
> enemy.

**Test:** you can now type `par_solid` in a code editor without an error.

---

## STEP 5 — Paste all the object code

For each file in `gml/objects/`:

* filename = `OBJECT__EVENT.gml`
* open that object, click **Add Event**, pick the event from the file's first
  comment line, drag in **Execute Code** (control tab) and paste the contents.

Example: `obj_player__Step.gml` → object `obj_player` → **Add Event → Step →
Step**. `par_enemy__Draw.gml` → **Add Event → Draw → Draw**.
`obj_explosion__AnimationEnd.gml` → **Add Event → Other → Animation End**.
`obj_game__Alarm0.gml` → **Add Event → Alarm → Alarm 0**.
Collision files → **Add Event → Collision → \<named object\>**.

### Full event map

| Object | Create | Step | Draw | Collision(s) | Other |
| --- | --- | --- | --- | --- | --- |
| `obj_game` | ✓ | ✓ | ✓ | — | Alarm 0 |
| `obj_hud` | ✓ | — | ✓ | — | — |
| `obj_camera` | ✓ | ✓ | — | — | — |
| `obj_block` | ✓ | — | — | — | — |
| `obj_spike` | ✓ | — | — | `obj_player` | — |
| `obj_death_zone` | ✓ | — | — | `obj_player` | — |
| `obj_ladder` | ✓ | — | — | — | — |
| `obj_player` | ✓ | ✓ | ✓ | `par_enemy` | — |
| `par_enemy` | ✓ | ✓ | ✓ | `obj_shot` | Destroy |
| `obj_met` | ✓ | ✓ | — | — | — |
| `obj_shot` | ✓ | ✓ | — | `par_solid` | — |
| `obj_explosion` | ✓ | — | — | — | Animation End |
| `obj_pickup` | ✓ | ✓ | — | `obj_player` | — |
| `obj_boss` | ✓ | ✓ | — | `obj_shot` | Destroy |
| `obj_boss_shot` | ✓ | ✓ | — | `obj_player` | — |
| `obj_shutter` | ✓ | ✓ | ✓ | — | — |

**Test:** press F5. It should compile with no errors (the room is still empty,
so you'll see your background colour). If you get `"Unknown variable"` or
`"Unknown object"`, check spelling against the tables above.

---

## STEP 6 — Build the first screen and run the physics

Open your room (`room0`). In the **Settings** tab set **Width 256, Height 240,
Speed 60**. In the **Objects** tab:

1. Select `obj_block` and click along the bottom row (y = 224) from x = 0 to
   x = 240 — one 16×16 block every 16 px. Hold **Shift** while clicking to
   place many.
2. Add a small platform of 4 blocks around x = 96…144, y = 160.
3. Place one `obj_ladder` at x = 64, y = 176, 192, 208 (three stacked).
4. Place `obj_spike` at x = 176, y = 208 (one tile), and put an
   `obj_death_zone` at the bottom of any gap.
5. Place **one** `obj_game` anywhere (top-left is fine).
6. Place **one** `obj_player` at about x = 40, y = 180.
7. `obj_hud` and `obj_camera` are created automatically by `obj_game` — do
   **not** place them by hand.

**Controls:** ← → walk, **X** jump (NES A), **Z** shoot (NES B),
**Enter** pause, **F1** reset, **F2** hitbox, **F3** cycle test weapon.

**Test — the 1:1 checklist:**

* Mega Man stands on the blocks, not inside them.
* He walks smoothly with a subtle 1-2-1-2 pixel rhythm (sub-pixels working).
* A jump rises about **47 pixels** (≈3 blocks) and lasts ~39 frames.
* Holding a direction while jumping moves him slightly *slower* than walking.
* F2 shows a 12×22 red box, not a 48×48 one.
* F5 window is crisp — no blurry pixels.

**If it broke:**

* He falls through the floor → `obj_block`'s parent must be `par_solid`, and
  `spr_block` must have a full 16×16 mask.
* He can't jump → `X` is `ord('X')`; check your keyboard layout, or change the
  key in `obj_player__Step.gml`.
* Everything is blurry → uncheck "Interpolate colors between pixels" in Global
  Game Settings.
* `"Variable global.mm_paused is not set"` → you skipped step 3 or misspelled
  `scr_mm_new_game`.

---

## STEP 7 — Shooting, an enemy, explosions, pickups

All the code is already in place from step 5. You only place instances now.

1. Place 2–3 `obj_met` on the platform and on the ground.
2. Place a couple of `obj_pickup` instances. Each has a variable `kind`.
   To set it: in the room editor, hold **Ctrl** and click an instance (or
   right-click → **Creation Code**), then write `kind = 0;` (0 small life,
   1 small weapon, 2 large life, 3 large weapon).
3. F5. Tap **Z** to fire. You can only have **3 pellets on screen**.
4. Shoot a Met: it flashes, explodes, and sometimes drops a capsule.
5. Walk into a Met: you lose HP, blink for 111 frames, and get knocked back.

**Why the Met dies in one hit:** MM1's `WeaponDamageP` table gives ordinary
enemies 1 HP. The 28 HP value is for *bosses* — a very common mix-up.

**Test:** shoot a Met → explosion → capsule → HP bar increases. Touch spikes →
death → explosion → respawn after ~1.5 s with one fewer life.

---

## STEP 8 — HUD, health, lives, checkpoints

`obj_hud__Draw.gml` already draws the two 28-pip bars, score and lives at the
left of the screen (that is where the NES put them). `obj_game__Alarm0.gml`
already handles death and respawn.

**Checkpoints (do this now):** MM1 restarts you at the last screen boundary,
not at the level start. Add a tiny object `obj_checkpoint` with:

* Create: `active = false;`
* Collision with `obj_player`:
  ```gml
  if (!active) {
      active = true;
      global.mm_checkpoint_x = x;
      global.mm_checkpoint_y = y;
  }
  ```
* In `obj_game__Alarm0.gml`, replace `room_restart();` with:
  ```gml
  room_restart();
  with (obj_player) { x = global.mm_checkpoint_x; y = global.mm_checkpoint_y; }
  ```
  (`room_restart()` recreates the instances, then `with` moves the player.)

**Test:** die after touching a checkpoint → you respawn there, with full HP and
one fewer life.

---

## STEP 9 — Multi-screen rooms, camera, ladders, pits, shutters

### 9.1 Make the room bigger

Cut Man's stage is a chain of ~24 screens. In GMS 1.4, make **one room per
stage** and set its size to a multiple of the screen:

* horizontal section: `Width = 256 * N`, `Height = 240`
* vertical shaft: `Width = 256`, `Height = 240 * M`
* both: `Width = 256 * N`, `Height = 240 * M`

`obj_camera__Step.gml` snaps `view_xview[0]` / `view_yview[0]` to those
multiples automatically. **Do not** set "Object following" in the Views tab —
our camera owns the view.

### 9.2 Reproduce the actual level maps

Two options; start with A.

**A. Emulator capture + tile editor (beginner).**
1. In Mesen, load the ROM, enter Cut Man's stage.
2. Use **Debug → PPU Viewer** and **Screenshot** to capture each 256×240
   screen. Save them to `reference/cutman_screen_00.png`, etc.
3. In GameMaker, view the screenshot and place `obj_block` / `obj_spike` /
   `obj_ladder` instances on the 16×16 grid until your room matches.
4. Replace `spr_block` with real art: open `gfx/level_tiles_atlas.png`, find a
   matching 8×8 tile, and build a 16×16 PNG (2×2 tiles) in any pixel editor.
   Load it into a new sprite and use it for a new `obj_block_gfx` child of
   `par_solid`.

**B. Decode the ROM map data (advanced).**
The disassembly documents `RoomLayoutLoadRoomNum`, `RoomBlockData`,
`RoomTileTable1/2` and the "TSA" (tile-square assembly) 32×32-pixel blocks.
Write a Python parser (like `tools/extract_mm1_assets.py`) that walks those
tables and emits a CSV of block indices per screen; then a GML room-builder
reads the CSV at game start with `instance_create`. This is Milestone 7 of the
roadmap and is the only way to get every screen pixel-exact without manual
work.

### 9.3 Shutters

Place two `obj_shutter` instances at the boss door. Set `side = -1` on the left
one and `side = +1` on the right one (use the instance's **Creation Code**).
They close when `global.mm_boss_active` becomes true and open when the boss
dies.

**Test:** walking right across a 256-pixel boundary makes the view jump exactly
one screen. Everything drawn on screen stays pixel-aligned.

---

## STEP 10 — Weapons, energy and the Cut Man fight

### 10.1 Weapon switching (authentic version)

MM1 has no quick-swap: you press **Start** to open the weapon sub-screen.
Create `obj_subscreen` (a paused overlay) with:

* Create: `sel = global.mm_weapon;`
* Step: ←/→ changes `sel` among unlocked weapons; **Enter** sets
  `global.mm_weapon = sel` and closes.
* Draw: draw the 8 weapon names from `global.mm_weapon_name[]` and their
  28-unit bars from `global.mm_energy[]`, greyed out if
  `global.mm_unlocked[i] == 0`.

`obj_game__Step.gml` already has an **F3** debug cycle so you can test weapons
before building the sub-screen.

### 10.2 Weapon colour swaps

`gfx/megaman/C/`, `I/`, `B/`, `F/`, `E/`, `G/`, `M/` contain the same core
animations recoloured with the ROM's `MegamanPalette` pairs. To use them,
duplicate your 12 player sprites, load the corresponding PNGs, and extend
`scr_mm_set_sprite.gml` with a `switch (global.mm_weapon)` that picks the
right set. Keep this for last — it is pure cosmetics but very satisfying.

### 10.3 The boss

Place one `obj_boss` in the last screen. Its Create sets `boss_id = 0`
(Cut Man) and `hp = 28`. Its collision event calls:

```gml
d = scr_mm_weapon_damage(boss_id, other.weapon);
```

That is the ROM's `WeaponDamageOnBoss` table. Fire the buster: 3 damage per
shot (10 shots). Defeat Guts Man first with the buster to unlock Super Arm,
then Cut Man dies in **2 hits** (14 + 14). This exact asymmetry is the heart of
Mega Man 1's design — do not "balance" it.

`obj_boss__Step.gml` is a deliberately simple 3-phase pattern (wait → jump →
throw). For true 1:1 behaviour, port the strategy tables in `bank5.s` of the
disassembly (`CutmanStrategy*` etc.): each is a list of phases with frame
delays, and the boss's Y velocity uses the same 0.25 gravity.

**Test:** buster takes 10 hits; Super Arm takes 2; Ice Slasher does **0**
damage. If those numbers don't match, your damage table is wrong.

---

## STEP 11 — The whole game

Create one room per stage and a `rm_stage_select` room:

| Room | Content |
| --- | --- |
| `rm_stage_select` | 6 Robot Master portraits in a 3×2 grid. Defeated ones are greyed out. |
| `rm_cutman`, `rm_iceman`, `rm_bombman`, `rm_fireman`, `rm_elecman`, `rm_gutsman` | ~24 screens each, one boss, one weapon pickup |
| `rm_wily1` … `rm_wily4` | Yellow Devil, Copy Robot/CWU-01P, Wily Machine 1, Wily Machine 2 + ending |

Game flow to implement:

1. **Stage start:** show "READY" for 192 frames (`global.mm_ready_timer`),
   teleport animation, then enable input. `obj_game__Draw.gml` already draws it.
2. **Boss defeat:** `obj_boss__Collision_obj_shot.gml` sets
   `global.mm_unlocked[boss_id+1]`, shows "WEAPON GET" and returns you to the
   stage select.
3. **Game over:** replace `game_restart()` in `obj_game__Alarm0.gml` with
   `room_goto(rm_stage_select);` and reset `global.mm_lives = 3`.
4. **Magnet Beam:** it is *found in a room*, not won from a boss (Elec Man
   stage). Create `obj_magnet_beam_pickup` that sets `global.mm_unlocked[7]`.
5. **Special weapon projectiles:** the ROM's `MegamanWeaponFireData` table
   (bank5 `$A999`) gives the initial X/Y speed, fraction and spawn offset of
   every projectile. Port each row into its own child of `obj_shot`.
6. **Gimmicks:** Guts blocks, Ice Slasher freezing, Fire Storm's orbiting
   shield, Thunder Beam's 3-way shot, moving lifts, falling platforms,
   disappearing blocks, conveyor belts in Wily 4.

Work in this order: **one stage completely finished before starting the next**.
A half-built stage teaches you nothing; a finished one gives you a template.

---

## STEP 12 — Sound, hardware quirks, QoL

* **Sound:** extract the original music/SFX from the ROM with an emulator's
  NSF/WAV export, or compose your own. In GMS 1.4 add them as **Sounds** and
  call `audio_play_sound(snd_shot, 1, false)` from `scr_mm_spawn_shot`.
* **Optional 1:1 quirks** (add only at the very end, behind a global toggle):
  * hide sprites when more than 8 share a scanline (`flicker`);
  * drop `room_speed` to 30 for one frame when `instance_count > 40`;
  * optional 8:7 pixel-aspect stretch for CRT authenticity.
* **Optional QoL** (clearly labelled, off by default for a 1:1 run):
  * L/R weapon quick-swap, save progress with `ini_open()` / `ini_write_real()`,
    disable flicker/slowdown, spike-damage instead of instant death,
    "no skid" toggle.

---

## STEP 13 — Verify against the real game

Follow the verification recipe in
[`01_THE_1_TO_1_SPEC.md`](01_THE_1_TO_1_SPEC.md) §8. In short:

1. Record 60 fps footage of the ROM and of your game doing the same input.
2. Compare jump apex (should be ~47 px), airtime (~39 frames), horizontal
   distance over 60 frames (~82 px walking), frames between buster shots,
   pellet speed (4 px/frame), boss HP bar after one shot.
3. Fix differences **before** adding more content.

Then work through the milestone tracker in [`../README.md`](../README.md).

---

## Shortcut: the one-sentence summary of each step

1. 256×240 room, 60 fps, 3× scale, no interpolation.
2. Import `gfx/` sprites, origin (24,24), 12×22 mask.
3. Paste 9 scripts.
4. Create all 18 object **names** first.
5. Paste all object events.
6. Place blocks + player → authentic physics.
7. Place Mets + pickups → shooting and damage.
8. HUD, lives, checkpoints.
9. Bigger rooms, screen-snap camera, real level maps.
10. Weapons + damage table + boss.
11. Ten more rooms + stage select + game over.
12. Sound and optional quirks.
13. Measure, compare, correct.
