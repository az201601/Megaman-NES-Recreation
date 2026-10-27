# 01 — The 1:1 specification (ROM-verified numbers)

This is the answer-book. Every number below was read out of
`Mega Man (USA).nes` (CRC32 `5DED683E`) by cross-checking the compilable
disassembly at <https://github.com/TheRealQuantam/mm1dasm> (based on the
"MEGAMAN 1 NES ROM TECH DOC"), plus the movement notes at
<https://tasvideos.org/GameResources/NES/Rockman>. A machine-readable copy is
generated into `gfx/ROM_FACTS.txt` by the extractor.

You do not need to memorise this. Come back when something feels wrong.

---

## 1. The cartridge we are copying

| Property | Value |
| --- | --- |
| ROM | `Mega Man (USA).nes`, 131 088 bytes, CRC32 `5DED683E` |
| iNES header | `4E 45 53 1A 08 00 21 00` → 8 × 16 KiB PRG-ROM, **0 CHR-ROM** |
| Mapper | 2 (UNROM), vertical mirroring, NTSC |
| Graphics | Stored as raw 2bpp tiles inside PRG banks 0–3, copied into 8 KiB **CHR-RAM** by the routine `WriteChr` (CPU `$C75B`) |
| PPU `$2000` during play | `$10` → background pattern table at `$1000`, sprite pattern table at `$0000`, 8×8 sprites |
| Screen | 256 × 240 px, 60.0988 Hz (NTSC). 32 × 30 tiles of 8×8. |
| Level grid | 16 × 16 px "blocks" (2×2 hardware tiles). One camera screen = 16 × 15 blocks. |

**What this means for GameMaker:** use `room_speed = 60`, a `256 × 240` view,
and a `768 × 720` port (3×). Use 8×8 source tiles, but place level geometry on
a 16×16 grid. Do not use GameMaker's built-in physics — write the movement
yourself with the numbers below.

---

## 2. Player physics — pixels per NES frame

The ROM stores these in **8.8 fixed point** (one byte of whole pixels, one byte
of 1/256ths). GameMaker's floating point `x`/`y` can hold the same values, but
to be truly 1:1 we keep our own sub-pixel accumulator (see
`gml/obj_player__Step.gml`) so the character never appears at a half pixel.

| Constant | Hex in ROM | Value | Source |
| --- | --- | --- | --- |
| Walking speed (running state `$06`) | `$61` | **1.375** px/frame | `bank6.s`, table `L1863A`, index 8 → `$61` = 1 + `$60`/256 |
| Airborne / jumping speed | `$51` | **1.3125** px/frame | same table, index 7 |
| Slow step (first frame of walking) | `$20` | 0.125 px/frame | index 1 |
| Deceleration step | `$0004` | 0.015625 | `bank5.s`, `Table9DD9` |
| Jump initial Y velocity | `$04.DF` | **4.87109375** px/frame upward | `bank5.s` `$961E–$9628` |
| Gravity | `$40` / 256 | **0.25** px/frame² | `bank5.s` `$9C65`, `bank6.s` `$1ACE6` |
| Terminal falling speed | `$F4` = −12 | **12** px/frame | `bank5.s` `$9C74` (`CMP #$F4`) |
| Ladder climb speed | `$C0` | **0.75** px/frame | `bank5.s` `$15829` |
| Mega Buster pellet speed | `$04` | **4** px/frame | `bank5.s` `MegamanWeaponFireData`, "P" row |
| Pellet spawn offset | `$10` | 16 px in front, 0 px vertically | same table |
| Max pellets on screen | slots 2,3,4 | **3** | `bank5.s` `MegamanWeaponFire_P` |
| Fire delay | `$1F` | **31** frames | `bank5.s` `$1675C` |
| Invulnerability after damage | `$6F` | **111** frames | `bank5.s` `$1625E` |
| "READY" delay at stage start | `$C0` | **192** frames | `bank5.s` `$1513D` |

**Jump shape.** With `vsp = −4.87109375`, `gravity = 0.25`, the apex is about
47 px (≈ 3 tiles) after ~20 frames, and the whole jump lasts ~39 frames. That
matches the NES. Note the original jump is **fixed height** — holding A does not
make you go higher in MM1. Do not add a variable jump height.

**Walking is faster than jumping.** 1.375 vs 1.3125. This is a real, documented
MM1/MM2 quirk ([TASVideos](https://tasvideos.org/GameResources/NES/Rockman)).
If your recreation gives the same speed in the air, it will feel wrong.

**Sub-pixels matter.** Because 1.375 is not a whole number, Mega Man advances
1, 2, 1, 1, 2… pixels on successive frames. Our accumulator reproduces that
exactly. Rounding every frame to `round(x + 1.375)` will produce a visibly
different rhythm.

---

## 3. Health, damage, lives

| Rule | Value |
| --- | --- |
| Player life meter | **28** units (`$1C`) |
| Boss life meter | **28** units |
| Weapon energy meter | **28** units per weapon |
| Small energy capsule | **+2** |
| Large energy capsule | **+10** |
| Spikes | instant death |
| Falling into a pit | instant death |
| Starting lives | 3 (game over → stage select continue) |

### Enemy contact damage (`EnemyHitTable`, bank7 `$FEBD`)

Indexed by object type. The first 26 values, for the enemies you meet first:

```
3, 1, 2, 3, 4, 1, 4, 4, 3, 10, 1, 1, 4, 1, 3, 3,
4, 4, 4, 3, 1, 3, 2, 1, 3, 4 …
```

So a Blader does 3, a Met 1, a Big Eye 10. The full 50-entry table is in
`gfx/ROM_FACTS.txt`.

---

## 4. Weapons — energy costs (bank5 `$A8D8`–`$A8E5`)

The ROM table `WeaponPowerConsumptionNominator` is authoritative:

| # | Weapon | Boss | Cost / use | Uses on a full 28 bar | Behaviour |
| --- | --- | --- | --- | --- | --- |
| 0 | Mega Buster | start | 0 | ∞ | 4 px/frame pellet, max 3 |
| 1 | Rolling Cutter | Cut Man | **1** | 28 | Boomerang arc, 1 on screen |
| 2 | Ice Slasher | Ice Man | **1** | 28 | Freezes most enemies ~3 s, 1 on screen |
| 3 | Hyper Bomb | Bomb Man | **2** | 14 | Bounces, timed blast |
| 4 | Fire Storm | Fire Man | **1** | 28 | Forward shot + 2 orbiting fireballs |
| 5 | Thunder Beam | Elec Man | **1** | 28 | 3 beams: forward, up, down; hits many times |
| 6 | Super Arm | Guts Man | **2** | 14 | Lift/throw special Guts blocks only |
| 7 | Magnet Beam | found in Elec Man stage | **2** | 14 | Create a temporary 8×8 platform |

`WeaponPowerConsumptionDenominator` is `1` for all seven — one unit is deducted
on every single shot. Note some fan wikis say Hyper Bomb costs 1; the ROM says
**2**. Trust the ROM.

### Weapon colour swaps (bank7 `$D485`, `MegamanPalette`)

Mega Man's sprite palette slot 1 and 2 change with the equipped weapon:

```
P = $2C,$11   C = $30,$00   I = $30,$12   B = $30,$19
F = $28,$16   E = $38,$00   G = $30,$17   M = $2C,$11
```

`gfx/megaman/<letter>/` contains every core animation already recoloured.
Base sprite palette 0 is: transparent, `$2C` cyan, `$11` blue, `$0F` black.

---

## 5. Boss damage table (bank7 `$FE22`, `WeaponDamageOnBoss`)

Columns: `P` Buster, `C` Cutter, `I` Ice, `B` Bomb, `F` Fire, `E` Elec,
`G` Super Arm, `M` Magnet Beam. `0` = completely immune.

| Boss | P | C | I | B | F | E | G | M |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Cut Man | 3 | 1 | 0 | 2 | 3 | 1 | **14** | 0 |
| Ice Man | 1 | 2 | 0 | 4 | 1 | **10** | 0 | 0 |
| Bomb Man | 2 | 2 | 0 | 1 | **4** | 2 | 0 | 0 |
| Fire Man | 2 | 2 | **4** | 1 | 1 | 1 | 0 | 0 |
| Elec Man | 1 | **10** | 0 | 2 | 1 | 1 | 4 | 0 |
| Guts Man | 2 | 1 | 0 | **10** | 2 | 1 | 1 | 0 |
| Yellow Devil | 2 | 2 | 0 | 0 | 2 | 4 | 0 | 0 |
| Wily Machine 2 | 1 | 1 | 0 | 2 | 2 | 2 | 0 | 0 |
| Wily Machine 4a | 1 | 1 | 1 | 1 | 4 | 1 | 1 | 0 |
| Wily Machine 4b | 1 | 1 | 0 | 1 | 1 | 1 | 1 | 0 |

Every boss has 28 HP, so Super Arm kills Cut Man in **2 hits** (14 + 14) while
the buster needs 10 hits (3 × 9 = 27, +1). This is why the table matters.

**Practical weakness order:**
Guts Man (buster) → Cut Man (Super Arm) → Elec Man (Rolling Cutter) →
Ice Man (Thunder Beam) → Fire Man (Ice Slasher) → Bomb Man (Fire Storm) →
Wily 1 → Wily 2 → Wily 3 → Wily 4.

The Copy Robot and CWU-01P rows are handled by other in-game tables; see the
disassembly if you want exact values.

### Boss AI is data-driven in the ROM

`bank5.s` contains per-boss strategy tables (e.g. `CutmanStrategyConsiderJumpingPeacefully`,
`CutmanStrategyJumpThenThrowAfterDelay`, `BombmanStrategyBackwardsJump`). Each
is a small state machine with frame delays. For a 1:1 fight, port the state
tables rather than inventing a pattern. Step 10 of the build guide shows the
structure using Cut Man.

---

## 6. Screen, camera, rooms

* One camera screen is exactly **256 × 240**.
* Horizontal scrolling only happens when you cross a screen boundary; the
  camera **snaps** between screens with a scripted pan. Vertical scrolling uses
  ladders/shafts with a similar pan. MM1 does **not** smoothly follow Mega Man
  within a screen.
* Screen boundaries are hard walls; enemies are spawned per screen from a
  screen-object table and are forgotten when you leave.
* The HUD is drawn with sprites on the left of the screen, **not** in a top
  status bar. Two 28-unit vertical-ish bars: life (left) and weapon energy.
* Boss doors are two shutters that close with a sound, then the boss appears.

For GameMaker: make each stage one room whose size is a multiple of 256×240
(e.g. 1024×480). `obj_camera` snaps `view_xview[0]` / `view_yview[0]` to
multiples of 256/240. See `gml/obj_camera__Step.gml`.

---

## 7. Fidelity toggles (things you can choose to include)

A "1:1" game can still be pleasant to play. These are the only places we
recommend a switch:

| Feature | NES behaviour | Recommended default |
| --- | --- | --- |
| Sprite flicker | PPU draws max 8 sprites per scanline; the rest flicker | Off (QoL), add as optional toggle at the end |
| Slowdown | Logic stalls when too many objects | Off |
| Refresh rate | 60.0988 Hz | `room_speed = 60` |
| Pixel aspect | NES pixels are slightly non-square (8:7 PAR) on a CRT | Square pixels (modern displays) |
| Weapon cycling | Only via the pause/sub-screen | Keep authentic; optionally add L/R quick-swap last |
| Save | Passwords did not exist in MM1 (they arrived in MM2) | Optional modern save, clearly labelled QoL |

Anything else that differs from sections 2–6 is a bug, not a design choice.

---

## 8. How to verify you are really 1:1

1. Open Mesen 2, load `Mega Man (USA).nes`.
2. Use **Debug → PPU Viewer** to see tiles/palettes and **Debug → Sprite Viewer**
   for OAM. Our `gfx/chr_stage00_*.png` should match what you see.
3. Use **frame advance** and the **RAM Watch** to check position/speed. Useful
   addresses from the disassembly (`globals.inc`):
   * `$0460` `ObjectPosScreen`, `$0480` `ObjectPosX`, `$04A0` `ObjectPosXfraction`
   * `$0600` `ObjectPosY`, `$0620` `ObjectPosYfraction`
   * `$0660` `ObjectYSpeedFraction`, `$0680` `ObjectYSpeed`
   * `$04C0` `ObjectXSpeed`, `$04E0` `ObjectXSpeedFraction`
   * `$06A0` `ObjectLifeMeter`, `$006A` `Meters` (life/weapon bars)
   * `$0400` `ObjectSpriteNum` — see the tech doc for the full animation list.
4. Record both games at 60 fps and compare: jump apex pixel, frames in the air,
   horizontal distance covered in 60 frames, frames between shots.

If your numbers differ, fix them before adding more content. That is the whole
point of doing a 1:1 recreation.

---

## 9. Sources

* `Mega Man (USA).nes` — CRC32 `5DED683E` (in this repository).
* [TheRealQuantam/mm1dasm](https://github.com/TheRealQuantam/mm1dasm) —
  compilable ca65 disassembly; constants quoted above come from `bank5.s`,
  `bank6.s`, `bank7.s`, `globals.inc`.
* [MEGAMAN 1 NES ROM TECH DOC](https://www.nesdev.org/megm1rom.txt) —
  original RAM map and animation-state documentation (credited by mm1dasm).
* [TASVideos: GameResources/NES/Rockman](https://tasvideos.org/GameResources/NES/Rockman) —
  1.375 walking / 1.3125 airborne, ladder and jump mechanics.
* [Mega Man 1 Damage Data Chart](https://megaman.fandom.com/wiki/Mega_Man_1_Damage_Data_Chart)
  and [GameFAQs damage chart by Zerr](https://gamefaqs.gamespot.com/nes/563441-mega-man/faqs/21496) —
  cross-check for the boss table (the ROM table is authoritative where they
  disagree).
* [Mesen 2](https://github.com/SourMesen/Mesen2) — emulator for verification.
