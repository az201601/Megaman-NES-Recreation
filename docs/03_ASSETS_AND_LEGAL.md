# 03 — Assets, the extractor, and the law

## 1. Where the graphics in `gfx/` came from

`Mega Man (USA).nes` has **no CHR-ROM**: its iNES header says
`08 00` → 8 × 16 KiB PRG-ROM, 0 × 8 KiB CHR-ROM. The NES PPU therefore gets
its tiles from **CHR-RAM**, which the game fills at run time by copying raw
2-bits-per-pixel tile data out of PRG banks 0–3. The routine is `WriteChr` at
CPU `$C75B` (see `bank7.s` in the disassembly).

`tools/extract_mm1_assets.py` reproduces that copy **without an emulator**:

1. It reads `RoomTileTable1` / `RoomTileTable2` at CPU `$8D00` / `$8D20` in the
   stage's own PRG bank (`stage % 6`). Each entry says
   "copy N 256-byte blocks from PRG bank B, block K into PPU VRAM". Source ROM
   offset = `(A & 3) * 0x4000 + (A >> 2) * 0x100`.
2. It rebuilds the 8 KiB CHR-RAM image for all 10 stages.
3. It parses the game's **metasprite tables** in PRG bank 6:
   * `MajObjFrameAddrs` `$8000` — 195 big-object frames
   * `MajObjFrameTableAddrs` `$8186` — per-state animation lists
   * `MinObjFrameAddrs` `$8650` / `$8750` — small-object frames
   * `MinObjFrameTableAddrs` `$8770` — small-object animation lists
   * `TileOffsTableAddrs` `$82AA` + `SpriteTileYOffs` `$833A`,
     `SpriteTileLeftXOffs` `$843A`, `SpriteTileRightXOffs` `$853A` — the
     x/y position of every 8×8 tile within a frame.
4. It composes each frame into a fixed **48×48** canvas with the NES object
   position at **(24,24)**, applies the tile H/V flip bits and the 4 sprite
   palettes, and writes a PNG.

That is why `gfx/megaman/P/stand_R_0.png` is not a redraw — it is the exact
pixels Capcom drew, in the exact positions, with the exact palette.

### What the folders contain

| Path | Contents |
| --- | --- |
| `gfx/megaman/P/` | Core player animations in the default Mega Buster palette. `<name>_L_<n>.png` / `_R_<n>.png` = one frame, facing left/right. `*_strip.png` = frames side by side. |
| `gfx/megaman/C,I,B,F,E,G,M/` | The same core animations in the 7 weapon colour variants (from `MegamanPalette`, bank7 `$D485`). |
| `gfx/megaman/FRAMES.txt` | Which ROM frame IDs and animation delays each animation uses. |
| `gfx/megaman/sheet_P.png` | Contact sheet of every default-palette player frame. |
| `gfx/objects/` | Buster pellet, explosions, small/large life and weapon capsules, bonus pearl, Met, Spine, plus 8 extra `major_frame_XX.png` frames. |
| `gfx/objects/sheet.png` | Contact sheet of the above. |
| `gfx/all_major_frames.png` | **All 195 big-object frames**, 12 per row, in hex frame-ID order. Use this to find the enemy or boss frame you want. |
| `gfx/sprites_common_128tiles.png` | The 128 shared sprite tiles (PPU `$0000`–`$07FF`), 4× zoom. |
| `gfx/chr_stageNN_*.png` | The reconstructed CHR-RAM for each of the 10 stages (512 tiles). |
| `gfx/chr_prgbankN.png` | Raw 8×8 tiles sitting in PRG banks 0–3. |
| `gfx/level_tiles_atlas.png` | The same raw tiles at 2× zoom, stacked, for browsing. |
| `gfx/nes_palette.png` | 64-colour NES palette swatch. |
| `gfx/palettes.txt` | Exact palette bytes per stage. |
| `gfx/ROM_FACTS.txt` | All ROM-verified numbers. |
| `gfx/placeholder/` | Four **original** 16×16 geometry tiles for collision (not from the ROM). |

### Re-run the extractors

```bash
python3 tools/extract_mm1_assets.py                 # regenerates gfx/
python3 tools/extract_mm1_assets.py --facts         # print the numbers only
python3 tools/make_placeholder_tiles.py            # regenerates gfx/placeholder/
```

No third-party packages. Works on Windows/macOS/Linux with Python 3.6+.

### Known limitation: stage background tiles

MM1 swaps extra tile banks into CHR-RAM **during play** (the "object type `$FF`"
records in the disassembly, `SetupEnemyGraphicsPointer` / `LoadEnemyGraphics`).
A static dump at stage start therefore does not contain every background tile
for every screen. The raw tiles are all present in `chr_prgbankN.png` and
`level_tiles_atlas.png`; browse those next to a Mesen screenshot to identify
them. To automate it fully, parse the `$FF` object records and the TSA
(tile-square assembly) tables from `bank4.s`/`bank5.s` — see step 9B of the
build guide.

---

## 2. Importing into GameMaker: Studio 1.4

1. **Sprites → Create Sprite** → name → **Load Sprite** → PNG.
2. Set **Origin** to **(24,24)** for every 48×48 frame; **(0,0)** for the
   16×16 placeholder tiles.
3. **Modify Mask → Manual** and set the bounding box from
   [`02_STEP_BY_STEP.md`](02_STEP_BY_STEP.md) §2.2. The picture is 48×48 but
   the hitbox is only 12×22 — this is how the NES collision worked.
4. For animations, either **Edit Sprite → Add from File** and add
   `name_0.png`, `name_1.png`, … in order, or **File → Create from Strip** on
   the `*_strip.png` (image size 48×48, separation 0).
5. Uncheck **"Interpolate colors between pixels"** in Global Game Settings,
   and use an integer scale (3×). Otherwise authentic art will look blurry.
6. Never use GameMaker's "Smooth edges" / anti-aliasing options on these PNGs.

### Replacing placeholder geometry with real tiles

* Open `gfx/level_tiles_atlas.png` (2× zoom, 8×8 source tiles).
* Find the tile that matches your emulator screenshot.
* Combine four 8×8 tiles into one 16×16 PNG in any pixel editor (or extend
  `tools/extract_mm1_assets.py` with the ROM's TSA table).
* Load that PNG as a new sprite, set origin (0,0), full 16×16 mask, and make a
  new object that is a child of `par_solid`.

---

## 3. Palette / colour notes

The NES has 4 sprite palettes of 4 colours; colour 0 is always transparent.
For stage-bank 0, the ROM's sprite palettes are:

```
pal 0:  --   $2C (cyan)   $11 (blue)   $0F (black)   <- Mega Man
pal 1:  --   $20 (white)  $38 (peach)  $0F (black)
pal 2:  --   $30 (white)  $11 (blue)   $0F (black)
pal 3:  --   $30 (white)  $15 (red)    $0F (black)
```

Some small objects (capsules, Mets) use palettes that the game **swaps
dynamically** per room. `gfx/objects/` uses the static stage-0 palette set, so
a few sprites may need a recolour to match a particular screen. Use
`gfx/nes_palette.png` and `gfx/palettes.txt` to get exact RGB values.

---

## 4. Legal and ethical notes (please read)

* **Mega Man, its characters, music, level design and artwork are © Capcom.**
  This project is a private, educational recreation.
* The ROM in this repository and everything in `gfx/` is derived from that
  copyrighted work. **Only use a ROM you legally own**, for personal study.
* **Do not redistribute** the ROM, the extracted PNGs, ripped music, or a
  compiled game containing them. Keep the repository private, or replace all
  extracted art with your own original drawings before sharing.
* If you ever want to publish your recreation, the safe path is:
  1. draw your own sprites (use `gfx/` only as a size/layout reference),
  2. compose your own music,
  3. give it a different name,
  4. delete the ROM and `gfx/` from the public repository.
* GameMaker: Studio 1.4.1760 is discontinued. Use a legally obtained copy;
  do not download cracked installers. If you no longer have it, you can still
  read all the GML here — the syntax is documented, and converting it to a
  modern GameMaker version is a separate task.

---

## 5. Credits for the reverse-engineering data

* [TheRealQuantam/mm1dasm](https://github.com/TheRealQuantam/mm1dasm) —
  compilable ca65 disassembly, based on the *MEGAMAN 1 NES ROM TECH DOC*
  (mirror at <https://www.nesdev.org/megm1rom.txt>). All ROM offsets, frame
  tables, damage tables and physics constants in this repository were verified
  against it by reading `bank5.s`, `bank6.s`, `bank7.s` and `globals.inc`.
* [TASVideos NES Rockman game resources](https://tasvideos.org/GameResources/NES/Rockman) —
  walking/airborne speed and ladder mechanics.
* [Mesen 2](https://github.com/SourMesen/Mesen2) — recommended emulator for
  verification (PPU viewer, sprite viewer, frame advance, RAM watch).
