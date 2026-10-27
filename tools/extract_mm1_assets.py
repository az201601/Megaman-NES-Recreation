#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
extract_mm1_assets.py -- 1:1 graphics extractor for "Mega Man (USA).nes" (CRC32 5DED683E)

WHAT THIS DOES
--------------
The US Mega Man 1 cartridge has NO CHR-ROM (iNES header: 8 x 16 KiB PRG, 0 CHR).
Its graphics live as raw 2-bits-per-pixel NES tile data inside the first four
PRG banks, and the game copies them into the PPU's CHR-RAM at the start of
each stage (routine `WriteChr`, CPU $C75B, in the mm1dasm disassembly).

This script reproduces that copy in software, then walks the game's own
metasprite tables (bank 6, CPU $8000-$9FFF) to re-assemble the original
sprite frames -- including facing direction, tile flipping and palettes.

It writes PNGs that drop straight into GameMaker Studio 1.4.

USAGE
-----
    python3 tools/extract_mm1_assets.py                 # uses ../Mega Man (USA).nes, writes ../gfx
    python3 tools/extract_mm1_assets.py --rom PATH --out DIR
    python3 tools/extract_mm1_assets.py --facts         # print ROM-verified numbers only

Pure Python standard library. No Pillow, no numpy, no emulator needed.

LEGAL
-----
The output is derived from a copyrighted game ROM. Only run this against a ROM
you legally own, for personal study / private recreation. Do not redistribute
the ROM or the extracted graphics. See docs/03_ASSETS_AND_LEGAL.md.
"""

import argparse
import struct
import sys
import zlib
from pathlib import Path

# ----------------------------------------------------------------------------
# 0. Standard NTSC NES palette (2C02 approximation, FCEUX/Nestopia values).
#    Index = NES colour number $00-$3F. Values are (r,g,b).
# ----------------------------------------------------------------------------
NES_PALETTE = [
    (124,124,124),(0,0,252),(0,0,188),(68,40,188),(148,0,132),(168,0,32),(168,16,0),(136,20,0),
    (80,48,0),(0,120,0),(0,104,0),(0,88,0),(0,64,88),(0,0,0),(0,0,0),(0,0,0),
    (188,188,188),(0,120,248),(0,88,248),(104,68,252),(216,0,204),(228,0,88),(248,56,0),(228,92,16),
    (172,124,0),(0,184,0),(0,168,0),(0,168,68),(0,136,136),(0,0,0),(0,0,0),(0,0,0),
    (248,248,248),(60,188,252),(104,136,252),(152,120,248),(248,120,248),(248,88,152),(248,120,88),(252,160,68),
    (248,184,0),(184,248,24),(88,216,84),(88,248,152),(0,232,216),(120,120,120),(0,0,0),(0,0,0),
    (252,252,252),(164,228,252),(184,184,248),(216,184,248),(248,184,248),(248,164,192),(240,208,176),(252,224,168),
    (248,216,120),(216,248,120),(184,248,184),(184,248,216),(0,252,252),(248,216,248),(0,0,0),(0,0,0),
]

def nes(c):
    r,g,b = NES_PALETTE[c & 0x3F]
    return (r,g,b,255)

TRANSPARENT = (0,0,0,0)

# ----------------------------------------------------------------------------
# 1. Minimal PNG writer (RGBA, 8 bit, no dependencies)
# ----------------------------------------------------------------------------
def write_png(path, pixels):
    """pixels: list of rows; each row is a list of (r,g,b,a) tuples."""
    h = len(pixels)
    w = len(pixels[0]) if h else 0
    raw = bytearray()
    for row in pixels:
        raw.append(0)                       # filter type 0
        for px in row:
            raw.extend(px)
    def chunk(tag, data):
        c = struct.pack(">I", len(data)) + tag + data
        return c + struct.pack(">I", zlib.crc32(tag + data) & 0xffffffff)
    png = (b"\x89PNG\r\n\x1a\n"
           + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0))
           + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
           + chunk(b"IEND", b""))
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(png)

def blank(w, h, fill=TRANSPARENT):
    return [[fill for _ in range(w)] for _ in range(h)]

def tile_pixels(data, palette):
    """Decode one 16-byte NES 2bpp 8x8 tile -> 8 rows of RGBA pixels."""
    out = []
    for y in range(8):
        lo, hi = data[y], data[8+y]
        row = []
        for x in range(8):
            bit = 7 - x
            idx = ((lo >> bit) & 1) | (((hi >> bit) & 1) << 1)
            row.append(palette[idx])
        out.append(row)
    return out

def paste(dst, src, x0, y0):
    """Paste with clipping and alpha test (alpha==0 => skip)."""
    H, W = len(dst), len(dst[0])
    for y, row in enumerate(src):
        py = y0 + y
        if py < 0 or py >= H:
            continue
        for x, c in enumerate(row):
            px = x0 + x
            if 0 <= px < W and c[3]:
                dst[py][px] = c

def scale_pixels(src, s):
    out = []
    for row in src:
        r = []
        for c in row:
            r.extend([c]*s)
        for _ in range(s):
            out.append(list(r))
    return out

# ----------------------------------------------------------------------------
# 2. ROM access helpers
# ----------------------------------------------------------------------------
class ROM:
    def __init__(self, path):
        raw = Path(path).read_bytes()
        if raw[:4] != b"NES\x1a":
            raise SystemExit("Not an iNES ROM file: %s" % path)
        self.header = raw[:16]
        self.prg = raw[16:]
        self.crc32 = zlib.crc32(raw) & 0xffffffff
        if self.crc32 != 0x5DED683E:
            print("WARNING: CRC32=%08X (expected 5DED683E = Mega Man (USA))."
                  % self.crc32, file=sys.stderr)
        if self.header[4] != 8 or self.header[5] != 0:
            print("WARNING: expected 8 PRG banks / 0 CHR banks, got %d / %d"
                  % (self.header[4], self.header[5]), file=sys.stderr)
        # Bank 6 (CPU $8000-$BFFF) holds all metasprite tables.
        self.b6 = 6 * 0x4000

    def cpu(self, addr):
        """CPU address inside switched bank 6 -> ROM file offset."""
        return self.b6 + (addr - 0x8000)

    def byte(self, cpu_addr):
        return self.prg[self.cpu(cpu_addr)]

    def word(self, cpu_addr):
        return self.prg[self.cpu(cpu_addr)] | (self.prg[self.cpu(cpu_addr)+1] << 8)

    def raw(self, offset, length):
        return self.prg[offset:offset+length]

    def chr_for_stage(self, stage, table=1):
        """Re-implement WriteChr(): rebuild the 8 KiB CHR-RAM image of a stage.

        Stage data bank = stage % 6.  RoomTileTable1 lives at CPU $8D00,
        RoomTileTable2 at $8D20.  Each entry is (bank_and_block, n_256_byte_blocks).
        Source ROM offset = (A & 3)*0x4000 + (A >> 2)*0x100.
        """
        bank = stage if stage < 6 else stage - 6
        off = bank*0x4000 + (0xD00 if table == 1 else 0xD20)
        tab = self.prg[off:off+0x20]
        count = tab[0]
        chrdata = bytearray(0x2000)
        pos = 0
        entries = []
        for i in range(count):
            a, n = tab[1+2*i], tab[2+2*i]
            src = (a & 3)*0x4000 + ((a >> 2) << 8)
            entries.append((a, n, src))
            for b in range(n):
                if pos + 256 > len(chrdata):
                    break
                chrdata[pos:pos+256] = self.prg[src+b*256:src+b*256+256]
                pos += 256
        return chrdata, entries

    def sprite_palettes(self, stage, table=1):
        """The 4 sprite palettes (16 bytes at CPU $8CA0 / $8CD0 + 16)."""
        bank = stage if stage < 6 else stage - 6
        off = bank*0x4000 + (0xCA0 if table == 1 else 0xCD0) + 16
        cols = list(self.prg[off:off+16])
        return [[TRANSPARENT, nes(cols[4*i+1]), nes(cols[4*i+2]), nes(cols[4*i+3])]
                for i in range(4)]

# ----------------------------------------------------------------------------
# 3. Metasprite table parsing (bank 6)
# ----------------------------------------------------------------------------
# Offsets taken from the mm1dasm disassembly (bank6.s / bank7.s):
MAJ_FRAME_ADDRS      = 0x8000   # 195 pointers to frame definitions
MAJ_STATE_ADDRS      = 0x8186   # 146 pointers to per-state animation lists
MIN_FRAME_ADDRS      = 0x8650   # 128 pointers to small-object frames
MIN_FRAME_ADDRS_HI   = 0x8750   # +16 pointers (frame ids >= 0x80)
MIN_STATE_ADDRS      = 0x8770   # pointers to small-object animation lists
TILE_OFFS_ADDRS      = 0x82AA   # 69 pointers to shape-index lists
Y_OFFS               = 0x833A   # 256 signed y offsets
LEFT_X_OFFS          = 0x843A   # 256 signed x offsets (object facing left)
RIGHT_X_OFFS         = 0x853A   # 256 signed x offsets (object facing right)

def s8(v):
    return v - 256 if v > 127 else v

class Metasprites:
    def __init__(self, rom):
        self.r = rom
        self.yo = [s8(rom.byte(Y_OFFS+i)) for i in range(256)]
        self.lx = [s8(rom.byte(LEFT_X_OFFS+i)) for i in range(256)]
        self.rx = [s8(rom.byte(RIGHT_X_OFFS+i)) for i in range(256)]

    def _frame(self, ptr):
        if not (0x8000 <= ptr < 0xC000):
            return None
        r = self.r
        n = r.byte(ptr)
        shape_idx = r.byte(ptr+1)
        shape_ptr = r.word(TILE_OFFS_ADDRS + 2*shape_idx)
        pairs, shapes = [], []
        for k in range(n):
            pairs.append((r.byte(ptr+2+2*k), r.byte(ptr+3+2*k)))
            shapes.append(r.byte(shape_ptr+k))
        return list(zip(pairs, shapes))

    def major(self, frame_id):
        return self._frame(self.r.word(MAJ_FRAME_ADDRS + 2*frame_id))

    def minor(self, frame_id):
        base = MIN_FRAME_ADDRS if frame_id < 0x80 else MIN_FRAME_ADDRS_HI
        idx = frame_id if frame_id < 0x80 else frame_id - 0x80
        return self._frame(self.r.word(base + 2*idx))

    def state_frames(self, state_id, minor=False):
        """Return (frames_per_step, [frame_id, ...]) from a state's animation list."""
        r = self.r
        base = MIN_STATE_ADDRS if minor else MAJ_STATE_ADDRS
        p = r.word(base + 2*state_id)
        if not (0x8000 <= p < 0xC000):
            return 0, []
        head = r.byte(p)
        delay = head & 0x0F          # game frames each animation step lasts
        steps = (head >> 4) + 1      # number of animation steps
        return delay, [r.byte(p+1+i) for i in range(steps)]

    def compose(self, fx, chrdata, palettes, facing="L", canvas=48, origin=24,
                palette_override=None):
        """Compose a metasprite frame into a fixed canvas.

        The NES object position (0,0) maps to (origin,origin) on the canvas,
        so every frame of an animation lines up perfectly. Set the GameMaker
        sprite origin to (origin,origin).
        """
        if not fx:
            return blank(canvas, canvas)
        right = (facing == "R")
        xo = self.rx if right else self.lx
        pix = blank(canvas, canvas)
        for (tile, attr), sh in fx:
            lx, ly = xo[sh], self.yo[sh]
            pal = palettes[attr & 3] if palette_override is None else palette_override
            tp = tile_pixels(chrdata[tile*16:tile*16+16], pal)
            hflip = bool(attr & 0x40) ^ right
            vflip = bool(attr & 0x80)
            out = []
            for yy in range(8):
                row = []
                for xx in range(8):
                    row.append(tp[7-yy if vflip else yy][7-xx if hflip else xx])
                out.append(row)
            paste(pix, out, origin+lx, origin+ly)
        return pix

# ----------------------------------------------------------------------------
# 4. Player animation definitions (state ids from the disassembly)
# ----------------------------------------------------------------------------
# These are the "ObjectSpriteNum" values used by Mega Man himself.
PLAYER_STATES = {
    "stand":       0x00,
    "stand_shoot": 0x01,
    "rock":        0x02,
    "walk_start":  0x03,
    "run":         0x06,
    "run_shoot":   0x07,
    "jump":        0x09,
    "jump_shoot":  0x0A,
    "land":        0x0F,
    "hurt":        0x12,
    "stun":        0x13,
    "transform":   0x14,
    "climb":       0x15,
    "climb_shoot": 0x16,
    "damage":      0x19,
    "ready":       0x31,
}

# Colour pairs from bank7 `MegamanPalette` at $D485:
# (sprite palette entry 1, entry 2) for each acquired weapon.
WEAPON_PALETTES = {
    "P": (0x2C, 0x11),   # Mega Buster  - blue / cyan
    "C": (0x30, 0x00),   # Rolling Cutter
    "I": (0x30, 0x12),   # Ice Slasher
    "B": (0x30, 0x19),   # Hyper Bomb
    "F": (0x28, 0x16),   # Fire Storm
    "E": (0x38, 0x00),   # Thunder Beam
    "G": (0x30, 0x17),   # Super Arm
    "M": (0x2C, 0x11),   # Magnet Beam
}

# Small-object states (ObjectType) that are useful for a first playable stage.
OBJECT_STATES = {
    "shot":              0x1A,   # major frame 0x21 (buster pellet)
    "explosion":         0x1B,   # major frames 0x22/0x24
    "bonus_pearl":       0x3C,   # minor
    "small_weapon":      0x3D,   # minor
    "small_life":        0x3E,   # minor
    "large_weapon":      0x3F,   # minor
    "large_life":        0x40,   # minor
    "met":               0x01,   # minor
    "spine":             0x03,   # minor
}

MAJOR_OBJECT_FRAMES = [0x21, 0x22, 0x24, 0x1E, 0x2F, 0x36, 0x55, 0x5B]

# Only these states get all 8 weapon-colour variants. Everything else gets
# the default Mega Buster palette, which keeps the output folder manageable.
CORE_STATES = ("stand", "stand_shoot", "run", "run_shoot",
               "jump", "jump_shoot", "climb", "hurt")
MAX_FRAMES_PER_STATE = 6

ROM_FACTS = """\
Mega Man (USA) -- ROM-verified numbers for a 1:1 recreation
=========================================================
Source: "Mega Man (USA).nes", size 131088 bytes, CRC32 5DED683E.
iNES header: 8 x 16 KiB PRG-ROM, 0 CHR-ROM (CHR-RAM), mapper 2 (UNROM),
vertical mirroring, NTSC. Verified against TheRealQuantam/mm1dasm.

VIDEO
  256 x 240 pixels, 60.0988 Hz NTSC. In GameMaker use room_speed = 60 and a
  256x240 view scaled by an integer (3x = 768x720).
  PPU $2000 = $10 during play: BG pattern table $1000, SPR pattern table $0000,
  8x8 sprites. Tiles are 8x8; stage "screens" are 256x240 (32x30 tiles).

PLAYER PHYSICS (pixels per NES frame, 8.8 fixed point in the ROM)
  Walking speed        = 1 + $60/256 = 1.375        (bank6 L1863A, Y=8)
  Airborne speed       = 1 + $50/256 = 1.3125       (bank6 L1863A, Y=7)
  Deceleration step    = $04/256     = 0.015625     (bank5 Table9DD9)
  Jump initial Y speed = 4 + $DF/256 = 4.87109375 up (bank5 $961E-$9628)
  Gravity              = $40/256     = 0.25 /f^2    (bank5 $9C65 / bank6 $1ACE6)
  Terminal fall speed  = 12 px/frame               (bank5 $9C74 CMP #$F4 = -12)
  Ladder climb speed   = $C0/256     = 0.75 (the disassembly comment says 0xC0)
  Mega Buster shot     = 4 px/frame, spawned 16 px in front, 0 px up
                         (bank5 MegamanWeaponFireData, entry "P")
  Max shots on screen  = 3 (object slots 2,3,4 - bank5 MegamanWeaponFire_P)
  Fire delay           = $1F = 31 frames
  Damage invulnerability = $6F = 111 frames        (bank5 $1625E)
  "READY" delay        = $C0 = 192 frames          (bank5 $1513D)

HEALTH / WEAPONS
  Player life meter    = 28 units ($1C)
  Boss life meter      = 28 units
  Weapon energy meter  = 28 units per weapon
  Energy cost / use    (bank5 $A8D8-A8E5, C,I,B,F,E,G,M):
      Rolling Cutter 1, Ice Slasher 1, Hyper Bomb 2, Fire Storm 1,
      Thunder Beam 1, Super Arm 2, Magnet Beam 2
  Small capsule = +2, large capsule = +10
  Spikes = instant death

BOSS DAMAGE TABLE (bank7 $FE22, WeaponDamageOnBoss)
  Columns: P=Mega Buster, C=Rolling Cutter, I=Ice Slasher, B=Hyper Bomb,
           F=Fire Storm, E=Thunder Beam, G=Super Arm, M=Magnet Beam
  Cut Man    3  1  0  2  3  1 14  0
  Ice Man    1  2  0  4  1 10  0  0
  Bomb Man   2  2  0  1  4  2  0  0
  Fire Man   2  2  4  1  1  1  0  0
  Elec Man   1 10  0  2  1  1  4  0
  Guts Man   2  1  0 10  2  1  1  0
  Yellow Devil (stone giant) 2 2 0 0 2 4 0 0
  Wily Machine 2               1 1 0 2 2 2 0 0
  Wily Machine 4a              1 1 1 1 4 1 1 0
  Wily Machine 4b              1 1 0 1 1 1 1 0
  (A 0 means "no damage". Copy Robot / CWU-01P use other rows in-game.)

WEAKNESS ORDER (practical boss order)
  Guts Man (buster) -> Cut Man (Super Arm) -> Elec Man (Rolling Cutter)
  -> Ice Man (Thunder Beam) -> Fire Man (Ice Slasher)
  -> Bomb Man (Fire Storm) -> Wily stages.

ENEMY CONTACT DAMAGE (bank7 $FEBD, EnemyHitTable, indexed by ObjectType)
  3,1,2,3,4,1,4,4,3,10,1,1,4,1,3,3,4,4,4,3,1,3,2,1,
  3,4,2,1,4,3,3,3,3,4,1,1,4,4,1,4,3,3,3,3,0,2,2,0,0,2

SPRITE PALETTES (bank5 $8CA0 + 16, stage 0)
  Palette 0 (Mega Man): transparent, $2C (cyan), $11 (blue), $0F (black)
  Palette 1:            transparent, $20 (white), $38 (peach), $0F
  Palette 2:            transparent, $30 (white), $11 (blue), $0F
  Palette 3:            transparent, $30 (white), $15 (red), $0F
  Weapon palette swaps (bank7 $D485): see WEAPON_PALETTES in this script.

GRAPHICS LOCATIONS
  Common sprite tiles = PRG bank 0, CPU $9000 -> ROM offset 0x1000,
  2048 bytes = 128 tiles. Loaded first into PPU $0000 by every stage.
  Per-stage CHR image = follow RoomTileTable1 at CPU $8D00 / Table2 at $8D20
  in the stage's own PRG bank (stage % 6). Each entry copies 256-byte blocks.
  Metasprite tables   = PRG bank 6 (CPU $8000-$9FFF).
"""

# ----------------------------------------------------------------------------
# 5. Sheet helpers
# ----------------------------------------------------------------------------
def tile_sheet(chrdata_or_rom, offset, ntiles, palette, cols=16, scale=1,
               bg=(24,24,32,255)):
    rows = (ntiles + cols - 1)//cols
    s = scale
    W, H = cols*8*s, rows*8*s
    out = blank(W, H, bg)
    for t in range(ntiles):
        data = chrdata_or_rom[offset+t*16:offset+t*16+16]
        if len(data) < 16:
            break
        tp = tile_pixels(data, palette)
        if s > 1:
            tp = scale_pixels(tp, s)
        paste(out, tp, (t % cols)*8*s, (t // cols)*8*s)
    return out

def contact_sheet(images, cols, cw, ch, bg=(24,24,32,255)):
    rows = (len(images)+cols-1)//cols
    out = blank(cols*cw, rows*ch, bg)
    for i, (name, pix) in enumerate(images):
        px = (i % cols)*cw + (cw-len(pix[0]))//2
        py = (i // cols)*ch + (ch-len(pix))//2
        paste(out, pix, px, py)
    return out

# ----------------------------------------------------------------------------
# 6. Main
# ----------------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    here = Path(__file__).resolve().parent
    ap.add_argument("--rom", default=str(here.parent / "Mega Man (USA).nes"))
    ap.add_argument("--out", default=str(here.parent / "gfx"))
    ap.add_argument("--facts", action="store_true", help="print ROM facts and exit")
    args = ap.parse_args()

    if args.facts:
        print(ROM_FACTS)
        return

    rom = ROM(args.rom)
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    ms = Metasprites(rom)
    print("ROM: %s  CRC32=%08X" % (args.rom, rom.crc32))

    # ---- raw tile banks -----------------------------------------------------
    neutral = [TRANSPARENT, (60,60,80,255), (120,140,200,255), (248,248,248,255)]
    for bank in range(4):
        img = tile_sheet(rom.prg, bank*0x4000, 1024, neutral, cols=32, scale=1)
        write_png(out / ("chr_prgbank%d.png" % bank), img)
    print("  wrote chr_prgbank0..3.png (raw 8x8 tiles)")

    # ---- reconstructed CHR-RAM for each stage -------------------------------
    stage_chr = {}
    stage_names = ["cutman_like", "iceman_like", "bombman_like",
                   "fireman_like", "elecman_like", "gutsman_like",
                   "wily1", "wily2", "wily3", "wily4"]
    for st in range(10):
        table = 1 if st < 6 else 2
        ch, entries = rom.chr_for_stage(st, table)
        stage_chr[st] = ch
        img = tile_sheet(ch, 0, 512, neutral, cols=16, scale=1)
        write_png(out / ("chr_stage%02d_%s.png" % (st, stage_names[st])), img)
    print("  wrote chr_stage00..09_*.png (reconstructed PPU CHR-RAM)")

    # ---- level tile atlas (raw PRG banks 0-3 stacked, 2x zoom) --------------
    # NOTE: MM1 swaps extra tile banks in at run time (the "object type $FF"
    # records in the disassembly), so a static CHR dump cannot show every
    # stage tile. The raw PRG banks DO contain all of them; browse this atlas
    # next to an emulator screenshot to find the tiles you need.
    atlas_rows = []
    for bank in range(4):
        atlas_rows.append(scale_pixels(
            tile_sheet(rom.prg, bank*0x4000, 1024, neutral, cols=32, scale=1), 2))
    atlas = blank(512, 512*4, (24,24,32,255))
    for i, part in enumerate(atlas_rows):
        paste(atlas, part, 0, i*512)
    write_png(out / "level_tiles_atlas.png", atlas)
    print("  wrote level_tiles_atlas.png (raw PRG banks 0-3, 2x)")

    # Stage 0 = first stage in the stage-select data bank. Use it for all
    # small-object sprites, and Cut Man's own bank for his stage.
    ch0 = stage_chr[0]
    pals0 = rom.sprite_palettes(0, 1)
    # Authentic Mega Man palette (overrides palette 0 for player frames).
    player_pal = [TRANSPARENT, nes(0x2C), nes(0x11), nes(0x0F)]

    # ---- common sprite tiles, enlarged for easy inspection ------------------
    img = tile_sheet(ch0, 0, 128,
                     [TRANSPARENT, nes(0x2C), nes(0x11), nes(0x0F)],
                     cols=16, scale=4)
    write_png(out / "sprites_common_128tiles.png", img)

    # ---- player frames ------------------------------------------------------
    play_dir = out / "megaman"
    play_dir.mkdir(parents=True, exist_ok=True)
    sheet_imgs = []
    state_summary = []

    def trim(fids):
        """Drop consecutive duplicates and cap the length (a state like
        'stand' repeats the same frame 10 times just as a blink timer)."""
        out = []
        for f in fids[:MAX_FRAMES_PER_STATE]:
            if not out or out[-1] != f:
                out.append(f)
        return out

    for weapon, (c1, c2) in WEAPON_PALETTES.items():
        wpal = [TRANSPARENT, nes(c1), nes(c2), nes(0x0F)]
        wdir = play_dir / weapon
        wdir.mkdir(parents=True, exist_ok=True)
        for name, state in PLAYER_STATES.items():
            if weapon != "P" and name not in CORE_STATES:
                continue                       # only P gets the extra states
            delay, fids = ms.state_frames(state)
            fids = trim(fids)
            for facing in ("L", "R"):
                frames = []
                for i, fid in enumerate(fids):
                    fx = ms.major(fid)
                    pix = ms.compose(fx, ch0, pals0, facing=facing,
                                     canvas=48, origin=24,
                                     palette_override=wpal if (fx and all(a < 4 for (t,a),s in fx)) else None)
                    frames.append(pix)
                    write_png(wdir / ("%s_%s_%d.png" % (name, facing, i)), pix)
                # horizontal strip for GM:S "Create from Strip"
                if len(frames) > 1:
                    strip = blank(48*len(frames), 48)
                    for i, p in enumerate(frames):
                        paste(strip, p, i*48, 0)
                    write_png(wdir / ("%s_%s_strip.png" % (name, facing,)), strip)
                if weapon == "P":
                    for i, p in enumerate(frames):
                        sheet_imgs.append(("%s_%s_%d" % (name, facing, i), scale_pixels(p, 2)))
            if weapon == "P":
                state_summary.append("%-12s state=$%02X  frames=%s  delay=%d f/step"
                                     % (name, state, ",".join("$%02X" % f for f in fids), delay))

    (play_dir / "FRAMES.txt").write_text(
        "Mega Man animation frames, extracted from the ROM.\n"
        "Canvas 48x48; set the GameMaker sprite origin to (24,24).\n"
        "L = facing left, R = facing right. *_strip.png = frames side by side.\n"
        "Consecutive duplicate frames were collapsed; 'delay' is the ROM's\n"
        "frame count per animation step (use it for image_speed: 60/delay/60).\n"
        "Folder P = default palette. Folders C,I,B,F,E,G,M contain the\n"
        "weapon colour swaps for the core animations only.\n\n"
        + "\n".join(state_summary) + "\n", encoding="utf-8")

    write_png(play_dir / "sheet_P.png",
              contact_sheet(sheet_imgs, cols=8, cw=100, ch=100))
    print("  wrote megaman/P..M/*.png (8 weapon palettes x 2 facings)")

    # ---- small objects / enemies -------------------------------------------
    obj_dir = out / "objects"
    obj_dir.mkdir(parents=True, exist_ok=True)
    obj_imgs = []
    for name, state in OBJECT_STATES.items():
        minor = not (name in ("shot", "explosion"))
        delay, fids = ms.state_frames(state, minor=minor)
        fids = trim(fids)
        # Shots/pickups are symmetrical; only enemies need both facings.
        facings = ("L", "R") if name in ("met", "spine") else ("L",)
        for facing in facings:
            frames = []
            for i, fid in enumerate(fids):
                fx = ms.minor(fid) if minor else ms.major(fid)
                pix = ms.compose(fx, ch0, pals0, facing=facing,
                                 canvas=48, origin=24)
                frames.append(pix)
                write_png(obj_dir / ("%s_%s_%d.png" % (name, facing, i)), pix)
                if facing == "L":
                    obj_imgs.append(("%s_%d" % (name, i), scale_pixels(pix, 2)))
            if len(frames) > 1:
                strip = blank(48*len(frames), 48)
                for i, p in enumerate(frames):
                    paste(strip, p, i*48, 0)
                write_png(obj_dir / ("%s_%s_strip.png" % (name, facing)), strip)
    for fid in MAJOR_OBJECT_FRAMES:
        fx = ms.major(fid)
        pix = ms.compose(fx, ch0, pals0, facing="L", canvas=48, origin=24)
        write_png(obj_dir / ("major_frame_%02X.png" % fid), pix)
    write_png(obj_dir / "sheet.png", contact_sheet(obj_imgs, cols=8, cw=100, ch=100))
    print("  wrote objects/*.png")

    # ---- every major metasprite frame, for reference -----------------------
    all_imgs = []
    for fid in range(0xC3):
        fx = ms.major(fid)
        if not fx:
            continue
        pix = ms.compose(fx, ch0, pals0, facing="L", canvas=48, origin=24)
        all_imgs.append(("$%02X" % fid, pix))
    write_png(out / "all_major_frames.png",
              contact_sheet(all_imgs, cols=12, cw=50, ch=50))
    (out / "all_major_frames.txt").write_text(
        "all_major_frames.png: 12 frames per row, frame id in hex, left to right.\n"
        "Frame ids are indices into MajObjFrameAddrs (bank 6, CPU $8000).\n"
        "Use gfx/all_major_frames.png to find the frame you want, then add its\n"
        "hex id to OBJECT_STATES / MAJOR_OBJECT_FRAMES in this script.\n",
        encoding="utf-8")

    # ---- palette swatches & text -------------------------------------------
    sw = blank(16*16, 4*16)
    for i in range(64):
        c = nes(i)
        for y in range(16):
            for x in range(16):
                sw[(i//16)*16+y][(i%16)*16+x] = c
    write_png(out / "nes_palette.png", sw)

    pal_txt = ["NES / MM1 palettes used by the generated PNGs", ""]
    for st in range(6):
        p = rom.sprite_palettes(st, 1)
        pal_txt.append("Stage bank %d sprite palettes (raw NES colour bytes):" % st)
        bank = st*0x4000 + 0xCA0 + 16
        pal_txt.append("  " + " ".join("$%02X" % b for b in rom.prg[bank:bank+16]))
        pal_txt.append("")
    pal_txt.append("Mega Man weapon palette pairs (palette slot 1, slot 2):")
    for k, v in WEAPON_PALETTES.items():
        pal_txt.append("  %s : $%02X, $%02X" % (k, v[0], v[1]))
    (out / "palettes.txt").write_text("\n".join(pal_txt)+"\n", encoding="utf-8")
    (out / "ROM_FACTS.txt").write_text(ROM_FACTS, encoding="utf-8")

    (out / "README.txt").write_text("""\
Generated by tools/extract_mm1_assets.py from "Mega Man (USA).nes".
Do not edit by hand -- re-run the script instead.

  all_major_frames.png   every big-object sprite frame (12 per row, hex order)
  sprites_common_128tiles.png  the 128 shared sprite tiles (Mega Man, shots...)
  chr_stageNN_*.png      reconstructed PPU CHR-RAM for each stage (512 tiles)
  chr_prgbankN.png       raw 8x8 tiles sitting in PRG banks 0-3
  nes_palette.png        64-colour NES palette swatch
  palettes.txt           exact palette bytes used by the game
  ROM_FACTS.txt          ROM-verified physics / damage / weapon numbers

  megaman/<WEAPON>/      ready-to-import player frames, 48x48, origin (24,24)
      <name>_L_<n>.png   one animation frame, facing left
      <name>_R_<n>.png   one animation frame, facing right
      <name>_L_strip.png frames side by side (GM:S "Create from Strip")
      P = default Mega Buster colours. C/I/B/F/E/G/M = the 7 weapon swaps.

  objects/               shots, explosions, pickups, Met, Spine (48x48, origin 24,24)
  objects/sheet.png      contact sheet of all of them
  level_tiles_atlas.png  all raw 8x8 tiles from PRG banks 0-3, 2x zoom.
                         MM1 swaps tile banks at runtime, so browse this next
                         to an emulator screenshot to find stage tiles.
  placeholder/           ORIGINAL 16x16 geometry tiles (not from the ROM),
                         made by tools/make_placeholder_tiles.py.

Derived from a copyrighted ROM: personal-use only, do not redistribute.
""", encoding="utf-8")

    print("\nDone. Wrote %d PNG files to %s" % (len(list(out.rglob("*.png"))), out))
    print("Next: open docs/00_START_HERE.md")

if __name__ == "__main__":
    main()
