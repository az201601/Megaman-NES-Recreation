# 04 — Troubleshooting & FAQ

Nine times out of ten the problem is a misspelled resource name or a missing
mask. Work through this page top to bottom.

---

## 1. GameMaker will not compile

### `Unknown variable hsp` / `Variable obj_player.x(100000, -1) not set before reading it`

You forgot the **Create** event of that object, or you pasted it into the wrong
object. Every variable used in a Step/Draw event must be given a starting value
in Create. Check `gml/objects/obj_player__Create.gml`.

### `Unknown object identifier: par_solid` (or any other name)

GameMaker compiles all code at once. If one object name does not exist yet,
nothing compiles. Create **all 17 object names first** (step 4 of the build
guide) before pasting any event code.

Common misspellings: `par_enemy` vs `par_enemie`, `obj_boss_shot` vs
`obj_bossshot`, `spr_mm_stand_R` vs `spr_mm_stand_r`.

### `Unknown function or variable: scr_mm_constants`

The script does not exist or is spelled differently. Scripts are case
sensitive in practice — copy the name from `gml/scripts/`.

### `Unexpected syntax error` on a line with `?` `:`

GMS 1.4 supports the ternary operator `a ? b : c`. If your build rejects it,
replace it with an `if/else`. Example from `obj_player__Step.gml`:

```gml
// state = (fire_anim > 0) ? global.MM_ST_SHOOT : global.MM_ST_STAND;
if (fire_anim > 0) state = global.MM_ST_SHOOT; else state = global.MM_ST_STAND;
```

### `Assignment of a value to an array index out of bounds`

You are reading `global.mm_energy[global.mm_weapon]` while `global.mm_weapon`
is outside 0…7. It is clamped in `obj_hud__Draw.gml`; make sure you pasted that
file and that `scr_mm_new_game` ran (it creates the arrays).

### `Cannot find sprite` / blank screen

A sprite was renamed or not loaded. Open the object and check the Sprite
drop-down. Also check the sprite's **origin** — an origin of (0,0) on a 48×48
player sprite puts Mega Man 24 px off.

---

## 2. The game runs but looks wrong

### Everything is blurry / colours bleed

* Global Game Settings → Windows → **uncheck "Interpolate colors between
  pixels"**.
* Use an integer scale (100%, 200%, 300%). Never 250%.
* `scr_mm_constants` also calls `texture_set_interpolation(false)`.

### The window is the wrong size

Room Views tab: view in room W/H = 256/240, port on screen W/H = 768/720.
Global Game Settings scaling = Fixed 300%. Both must agree.

### Mega Man is drawn in the wrong place

The player PNGs are 48×48 with the NES object position at (24,24). Set every
player sprite origin to 24,24. The NES positions characters at their **centre**,
not their feet.

### Mega Man falls through the floor

1. `obj_block` must have parent `par_solid`.
2. `spr_block` must be 16×16 with a **full** manual mask (0,15,0,15).
3. The blocks must actually overlap the player's mask — check with **F2**.
4. `obj_block` must not have `visible = false` set; visibility does not affect
   collision but a missing sprite does (no mask).

### Mega Man cannot jump

* `keyboard_check_pressed(ord('X'))` — note the capital X. Change the key in
  `obj_player__Step.gml` if you prefer, e.g. `vk_space`.
* `on_ground` is only true when `place_meeting(x, y+1, par_solid)` is true.
  If your floor is 1 px below the feet, it is true. If the mask is wrong, it is
  never true. F2 will show you.

### He jumps too high / too low

The ROM values are `vsp = -4.87109375`, `gravity = 0.25`, terminal `12`.
If you changed any of them in `scr_mm_constants.gml`, change them back. Do not
add variable jump height — MM1 has a fixed jump.

### He walks at a constant 1 or 2 px/frame (no sub-pixel rhythm)

Make sure you kept the `xfrac` / `yfrac` accumulator code exactly. If you
replaced it with `x += hsp;` you lose the 1-2-1-2 pixel cadence.

### Shooting does nothing

* `Z` is `ord('Z')`. Try the F3 debug key to confirm the game is receiving
  input.
* `instance_number(obj_shot) >= 3` silently blocks a new shot — the ROM limit.
* `obj_shot` must have the `spr_shot` sprite with an 8×8 mask, otherwise the
  pellet has no collision box but should still be visible.

### Shots pass through enemies

`par_enemy` needs the **Collision → obj_shot** event
(`par_enemy__Collision_obj_shot.gml`). Also confirm `obj_met`'s parent is
`par_enemy`.

### The HUD is not visible

`obj_hud` is created by `obj_game` at (0,0) with `depth = -1000`. Its Draw event
uses `view_xview[0]` / `view_yview[0]`, so it follows the camera. If you placed
it manually too, you may have two copies — harmless. If `obj_game` was not
placed in the room, nothing spawns the HUD.

### Boss takes 1 damage from everything

You are probably not calling `scr_mm_weapon_damage`. Check
`obj_boss__Collision_obj_shot.gml`. Also make sure `scr_mm_constants` ran —
`global.mm_dmg[]` lives there.

---

## 3. Emulator verification problems

### Mesen won't load the ROM

Verify the file: `python3 tools/extract_mm1_assets.py --facts` prints the
CRC32. It must be `5DED683E` for `Mega Man (USA).nes`. If yours differs, you
have a different revision (PAL/Japanese/PRG1) and the offsets in
`tools/extract_mm1_assets.py` will not match.

### RAM addresses don't change when I move

Some emulators use different RAM naming. In Mesen's Memory Viewer look at CPU
memory `$0480` (X position low byte) and `$0600` (Y position). The full list is
in `01_THE_1_TO_1_SPEC.md` §8. Values are 8.8 fixed point: `$0480` is whole
pixels, `$04A0` is the 1/256 fraction.

### My jump height differs by 2–3 pixels

That is expected while you tune. Frame advance one step at a time and note the
Y value at the apex. The ROM apex is ~47 px. Common causes:

* gravity applied before position vs after (order matters by 1 frame),
* using `round()` on `y` each frame,
* `room_speed` not 60.

---

## 4. GMS 1.4-specific gotchas

| Gotcha | Fix |
| --- | --- |
| `var` declared in the middle of a code block | Move all `var` lines to the top of the event. All files in `gml/` already do this. |
| `image_speed` semantics | In 1.4 it is "frames advanced per Step". `1/6` = one new frame every 6 steps. |
| `draw_self()` in a Draw event | Required if you add a custom Draw event, otherwise the sprite disappears. |
| `place_meeting` with a parent | Works in 1.4 — children count as the parent. |
| `Other → Animation End` | It is under Add Event → Other, not Draw. |
| `instance_create()` returns an id | That is why `scr_mm_spawn_shot` can set `s.hsp` right after creating the shot. |
| `global.` arrays | 2D arrays work, but our tables are deliberately **flat 1D** (`mm_dmg[boss*8 + weapon]`) — simpler and faster in 1.4. |
| `mod` and `div` | Both are valid GML keywords, not `%` or `//`. |
| `ord('Z')` | Returns the keycode of a character; use capital letters. |
| Windows-only IDE | 1.4's IDE is Windows (a Mac IDE existed but exports were limited). Use a Windows machine or VM. |
| Rooms are not saved until you close them | Ctrl+S saves the project; still close room windows before running. |
| `persistent = true` at runtime | Works, but a persistent `obj_game` is duplicated if you also place it in every room. Place it once only, or add `if (instance_number(obj_game) > 1) instance_destroy();` to its Create event. |

---

## 5. FAQ

**Q: I cannot find a legal copy of GameMaker: Studio 1.4.1760. What now?**
A: YoYo Games discontinued 1.4 and no longer hosts the installer. Legitimate
options: an installer you already archived, an old Steam key / Humble Bundle
purchase, or a licensed copy from your institution. Everything in this repo is
plain text — the GML is still readable and can be ported to a current
GameMaker, but the instructions and APIs here target 1.4 specifically. Never
use a cracked installer.

**Q: Can I use GameMaker Studio 2 / GameMaker 2023 instead?**
A: Not with these files unchanged. GMS 2 replaced `instance_create` with
`instance_create_layer`/`depth`, views with cameras, `image_speed` semantics
changed, `view_xview[0]` was removed, and `audio_*` replaced `sound_*`. The
spec (`docs/01`) is engine-independent — you can port it, but that is a
different project.

**Q: Do I need Python?**
A: No, unless you want to regenerate `gfx/`. It is already generated. To
re-run: `python3 tools/extract_mm1_assets.py`. On Windows, install Python from
python.org and run `py tools\extract_mm1_assets.py`.

**Q: Why is Mega Man's hitbox 12×22 and not the size of the sprite?**
A: The NES used a small collision box so Mega Man could squeeze between
16-pixel gaps without appearing to clip. You can fine-tune it with **F2** and
an emulator comparison.

**Q: Why does the player move slower in the air?**
A: It is a real MM1/MM2 quirk: 1.3125 px/frame airborne versus 1.375 walking.
It is in the ROM's `L1863A` speed table. Don't "fix" it.

**Q: The weapon energy bar is empty for the Mega Buster.**
A: Correct — the buster costs 0 and has no meter. The HUD shows the meter of
the *currently selected* weapon.

**Q: Where do I get the music?**
A: Record it from your own ROM using an emulator's WAV/NSF export, or compose
your own. Do not download MP3s of the soundtrack.

**Q: The boss's sprite looks like a strange robot, not Cut Man.**
A: `spr_boss_cutman` uses `gfx/objects/major_frame_36.png`, one of the ROM's
big-object frames. Browse `gfx/all_major_frames.png` (12 frames per row, hex
order) to find a better Cut Man frame, then point the sprite at that
`major_frame_XX.png`. Some frames need a different palette — see
`docs/03_ASSETS_AND_LEGAL.md` §3.

**Q: How long will this take?**
A: Steps 1–7 (a playable screen) = a weekend for a complete beginner.
A single finished stage = a few weeks. All 10 stages = months. That is normal;
the milestone tracker in the README exists so you always have a next step.

**Q: Something else is broken. What should I send?**
A: The exact GameMaker error text, the object + event name, the line number,
and which step of `docs/02_STEP_BY_STEP.md` you are on. Nine times out of ten
that is enough to spot the typo.
