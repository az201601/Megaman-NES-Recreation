# Megaman-NES-Recreation (Pixel Game Maker MV)

Authentic recreation of **Mega Man (1987, NES)** built in **Pixel Game Maker MV (PGMMV)** with toggleable Quality-of-Life (QoL) upgrades (`L1`/`R1` live weapon cycling, native progress saving, zero sprite flicker/slowdown, and optional spike/skid toggles).

## Documentation, Extracted Assets & Tools

- **[Master Architecture, ROM-Verified Specs & Roadmap](docs/PGMMV_ARCHITECTURE_AND_ROADMAP.md)**  
  Complete Pixel Game Maker MV project blueprint:
  - Project settings (`256×240`, `16×16` tiles, `3×`/`4×` integer scaling), Object Groups, and Controls
  - Single-Scene-Per-Stage room architecture + `obj_CameraController` shaft & boss shutter transitions
  - Numbered Registry of all Common Switches (`001–027`) & Common Variables (`001–027`)
  - Exact NES → PGMMV physics conversion table (`Mega Man (USA).nes` `CRC32: 5DED683E`) + PGMMV parabolic jump fix
  - Resource Set armor palette-swapping system, 28-pip HUD, Weapon Sub-Screen, and 11×8 Boss Damage Database
- **`assets/` — PGMMV-Ready PNG Assets Extracted from `Mega Man (USA).nes`:**
  - `assets/sprites/megaman_set1_buster.png` .. `megaman_set8_magnet_beam.png` (`48×48` grid, Right & Left facing across all 8 weapon color sets)
  - `assets/sprites/buster_and_explosion_32x32.png` (`32×32` grid: Mega Buster pellet, starburst explosion, hurt sweat drops)
  - `assets/tilesets/cutman_tileset_16x16.png` (`16×16`-aligned stage tileset for Cut Man's stage)
  - `assets/maps/cutman_opening_screens.png` (Reference strip of Cut Man's opening stage screens)
- **[`tools/extract_rom_assets.py`](tools/extract_rom_assets.py)** — Pure-Python ROM asset extractor (`python3 tools/extract_rom_assets.py`).

## Milestone Tracker

- [x] **Milestone 0:** Full PGMMV Architecture & ROM-Verified Specification
- [ ] **Milestone 1:** Project Setup, Extracted PNG Assets & Test Sandbox
- [ ] **Milestone 2:** Mega Man Core Controller & Mega Buster
- [ ] **Milestone 3:** Camera Room System, Shutters, Checkpoints & Pickups
- [ ] **Milestone 4:** HUD, Start Weapon Sub-Screen & QoL Quick-Swap
- [ ] **Milestone 5:** First Vertical Slice — Cut Man's Stage (24 Screens) & Boss
- [ ] **Milestone 6:** All 7 Special Weapons + Magnet Beam & Boss Damage Database
- [ ] **Milestone 7:** Remaining 5 Robot Master Stages, Gimmicks & Stage Select
- [ ] **Milestone 8:** Wily Fortress (Stages 1–4), Final Bosses, Save/QoL Options & Ending
