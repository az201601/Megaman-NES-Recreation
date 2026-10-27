#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
make_placeholder_tiles.py -- simple 16x16 geometry sprites for your first room.

These are ORIGINAL placeholder drawings (not ripped from the ROM). They give
GameMaker a solid collision mask on day one. Replace them later with real
16x16 blocks made from gfx/level_tiles_atlas.png (see docs/03_ASSETS_AND_LEGAL.md).

Run:  python3 tools/make_placeholder_tiles.py
Out:  gfx/placeholder/*.png
Pure Python standard library.
"""
import struct
import zlib
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "gfx" / "placeholder"

T = (0, 0, 0, 0)          # transparent
K = (16, 16, 24, 255)     # near-black outline
B = (0, 104, 176, 255)    # brick blue
L = (0, 184, 224, 255)    # highlight
D = (0, 60, 112, 255)     # shadow
Y = (248, 200, 64, 255)   # ladder yellow
W = (248, 248, 248, 255)  # white
G = (140, 140, 160, 255)  # grey


def write_png(path, pixels):
    h, w = len(pixels), len(pixels[0])
    raw = bytearray()
    for row in pixels:
        raw.append(0)
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


def blank(w=16, h=16, fill=T):
    return [[fill for _ in range(w)] for _ in range(h)]


def rect(p, x0, y0, x1, y1, c):
    for y in range(y0, y1+1):
        for x in range(x0, x1+1):
            if 0 <= x < len(p[0]) and 0 <= y < len(p):
                p[y][x] = c


def solid_block():
    p = blank()
    rect(p, 0, 0, 15, 15, B)
    rect(p, 0, 0, 15, 1, L)          # top highlight
    rect(p, 0, 0, 1, 15, L)         # left highlight
    rect(p, 0, 15, 15, 15, D)       # bottom shadow
    rect(p, 15, 0, 15, 15, D)       # right shadow
    rect(p, 0, 7, 15, 7, K)         # mortar line
    rect(p, 7, 0, 7, 6, K)          # vertical mortar (top half)
    rect(p, 3, 8, 3, 14, K)         # vertical mortar (bottom half)
    rect(p, 11, 8, 11, 14, K)
    return p


def spikes():
    p = blank()
    # four 4px-wide white triangles pointing up, black outline
    for i in range(4):
        x = i*4
        for yy in range(8):
            half = 3 - yy//2
            for xx in range(-half, half+1):
                px = x + 1 + xx
                if 0 <= px < 16:
                    p[14-yy][px] = W if 0 < yy < 7 else K
    return p


def ladder():
    p = blank()
    rect(p, 2, 0, 3, 15, Y)
    rect(p, 12, 0, 13, 15, Y)
    for y in (2, 6, 10, 14):
        rect(p, 3, y, 12, y+1, Y)
    return p


def death_zone():
    # Invisible in game (obj_death_zone sets visible=false), but a visible
    # magenta tile in the ROOM EDITOR makes it easy to place.
    p = blank(fill=(255, 0, 255, 90))
    rect(p, 0, 0, 15, 15, (255, 0, 255, 90))
    return p


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    items = {
        "solid_block_16x16.png": solid_block(),
        "spikes_16x16.png": spikes(),
        "ladder_16x16.png": ladder(),
        "death_zone_16x16.png": death_zone(),
    }
    for name, pix in items.items():
        write_png(OUT/name, pix)
    (OUT/"README.txt").write_text(
        "Original 16x16 placeholder tiles for GameMaker collision masks.\n"
        "solid_block -> spr_block (par_solid child, origin 0,0, full mask)\n"
        "spikes      -> spr_spike (origin 0,0, full mask)\n"
        "ladder      -> spr_ladder (origin 0,0, full mask)\n"
        "death_zone  -> spr_death_zone (origin 0,0, full mask, instance invisible)\n"
        "Replace with real MM1 16x16 blocks from gfx/level_tiles_atlas.png.\n",
        encoding="utf-8")
    print("Wrote %d placeholder PNGs to %s" % (len(items), OUT))


if __name__ == "__main__":
    main()
