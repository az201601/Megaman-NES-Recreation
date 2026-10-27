# Mega Man 1 — 1:1 recreation in GameMaker: Studio 1.4.1760

A complete beginner's build guide, a ROM-verified specification, working GML
code, and an asset extractor for an authentic, screen-for-screen recreation of
**Mega Man (NES, 1987)** in **GameMaker: Studio 1.4.1760**.

> **Read this first:** a true 1:1 recreation is a big project (the original has
> 6 Robot Master stages, 4 Wily stages, 8 weapons, ~50 enemy types, ~15 bosses).
> It is not one afternoon of work. This repository turns it into a numbered
> checklist where **each step ends with something you can run and see**.
> Start at [`docs/00_START_HERE.md`](docs/00_START_HERE.md).

---

## What is in this repository

| Path | What it is |
| --- | --- |
| `Mega Man (USA).nes` | The reference ROM (CRC32 `5DED683E`). Used for measurements and art extraction only. |
| [`docs/00_START_HERE.md`](docs/00_START_HERE.md) | Setup, IDE tour, your first blank game. **Start here.** |
| [`docs/01_THE_1_TO_1_SPEC.md`](docs/01_THE_1_TO_1_SPEC.md) | The exact numbers: physics, damage, weapons, screen layout — read from the ROM. |
| [`docs/02_STEP_BY_STEP.md`](docs/02_STEP_BY_STEP.md) | The build plan: 13 numbered steps from empty project to full game. |
| [`docs/03_ASSETS_AND_LEGAL.md`](docs/03_ASSETS_AND_LEGAL.md) | How the graphics were extracted, how to import them, copyright notes. |
| [`docs/04_TROUBLESHOOTING.md`](docs/04_TROUBLESHOOTING.md) | "It doesn't work" fixes, GMS 1.4 quirks, how to measure with an emulator. |
| [`gml/`](gml/) | Copy-paste-ready GameMaker Language code: every script and every object event. |
| [`gfx/`](gfx/) | 400+ authentic PNGs extracted from the ROM and ready for the GMS sprite editor. |
| [`tools/extract_mm1_assets.py`](tools/extract_mm1_assets.py) | Pure-Python extractor that regenerates `gfx/` from the ROM. No dependencies. |

---

## The 30-second version

1. Install GameMaker: Studio 1.4.1760 (Windows). You must already own/have it —
   it is discontinued and is no longer distributed by YoYo Games.
2. `python3 tools/extract_mm1_assets.py` → creates `gfx/` (already generated
   here, so you can skip this if the folder is present).
3. Open `docs/00_START_HERE.md` and do steps 1–4. In about 30 minutes you will
   have the real Mega Man sprite standing on real NES tiles at 256×240.
4. Keep going through `docs/02_STEP_BY_STEP.md`, pasting code from `gml/`.

---

## What "1:1" means here (and what it does not)

We match the things you can actually **measure**:

* 256×240 resolution, 16×16 level grid, 8×8 hardware tiles, 60 Hz logic.
* ROM-verified movement: walk **1.375 px/frame**, air **1.3125**, jump
  **4.87109375** with gravity **0.25**, terminal fall **12**, buster shots at
  **4 px/frame**, max **3** on screen, **111** invulnerability frames.
* 28-unit life and weapon meters, the original 11×8 boss damage table, exact
  weapon energy costs, original enemy contact-damage table.
* The original sprite frames, animation timings, palettes and weapon colour
  swaps, extracted from your ROM rather than redrawn.
* Screen-by-screen camera, ladders, spikes, shutters, pickups, checkpoints.

We deliberately leave out things that only exist because of 1987 hardware:
sprite scanline flicker, slowdown from too many objects, and the NES's 60.0988 Hz
(not 60.0000 Hz) refresh. `docs/01_THE_1_TO_1_SPEC.md` explains how to add them
back as optional toggles once the game is finished.

Level **maps** are not auto-converted: the original stores screens as compressed
tile-square assemblies. Step 9 shows the two ways to reproduce them (emulator
capture + a tile editor, or parsing the ROM map data with the linked
disassembly). Everything else — the code, the numbers, the art — is here.

---

## Legal

Mega Man is © Capcom. This repository contains a ROM for private study and
generated graphics derived from it. Only use assets from a ROM you own; do not
redistribute the ROM or ripped graphics. See
[`docs/03_ASSETS_AND_LEGAL.md`](docs/03_ASSETS_AND_LEGAL.md).
