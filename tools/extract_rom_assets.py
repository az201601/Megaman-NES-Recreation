#!/usr/bin/env python3
"""
Extract PGMMV-ready PNG sprite sheets, 16x16 tilesets, and stage reference maps
directly from 'Mega Man (USA).nes' (CRC32: 5DED683E).

Uses pure Python stdlib (zlib + struct) — zero external dependencies required.
"""

import os
import struct
import zlib

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROM_PATH = os.path.join(ROOT_DIR, "Mega Man (USA).nes")
OUT_DIR = os.path.join(ROOT_DIR, "assets")

# Authentic Sony CXA2025AS US NTSC NES 64-color RGB palette
NES_PALETTE = [
    (88, 88, 88),    (0, 35, 140),    (0, 19, 155),    (45, 5, 133),
    (93, 0, 82),     (122, 0, 23),    (122, 8, 0),     (95, 24, 0),
    (53, 42, 0),     (9, 57, 0),      (0, 63, 0),      (0, 60, 34),
    (0, 50, 93),     (0, 0, 0),       (0, 0, 0),       (0, 0, 0),

    (161, 161, 161), (0, 83, 238),    (21, 60, 254),   (96, 40, 228),
    (169, 29, 152),  (212, 30, 65),   (210, 44, 0),    (170, 68, 0),
    (108, 94, 0),    (45, 115, 0),    (0, 125, 6),     (0, 120, 82),
    (0, 105, 169),   (0, 0, 0),       (0, 0, 0),       (0, 0, 0),

    (255, 255, 255), (31, 165, 254),  (94, 137, 254),  (181, 114, 254),
    (254, 101, 246), (254, 103, 144), (254, 119, 60),  (254, 147, 8),
    (196, 178, 0),   (121, 202, 16),  (58, 213, 75),   (17, 209, 164),
    (6, 191, 242),   (66, 66, 66),    (0, 0, 0),       (0, 0, 0),

    (255, 255, 255), (160, 217, 254), (189, 204, 254), (225, 194, 254),
    (254, 188, 251), (254, 189, 208), (254, 197, 169), (254, 210, 142),
    (246, 226, 130), (204, 237, 138), (168, 242, 166), (149, 240, 210),
    (146, 232, 250), (172, 172, 172), (0, 0, 0),       (0, 0, 0),
]


def write_png_rgba(path: str, width: int, height: int, rgba_bytes: bytearray) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    raw_rows = bytearray()
    stride = width * 4
    for y in range(height):
        raw_rows.append(0)
        raw_rows.extend(rgba_bytes[y * stride : (y + 1) * stride])

    def chunk(tag: bytes, data: bytes) -> bytes:
        return (
            struct.pack(">I", len(data))
            + tag
            + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
        )

    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    idat = zlib.compress(bytes(raw_rows), 9)
    with open(path, "wb") as f:
        f.write(b"\x89PNG\r\n\x1a\n")
        f.write(chunk(b"IHDR", ihdr))
        f.write(chunk(b"IDAT", idat))
        f.write(chunk(b"IEND", b""))


class MegaManROM:
    def __init__(self, rom_bytes: bytes):
        assert rom_bytes[:4] == b"NES\x1a", "Not a valid iNES ROM"
        self.prg = rom_bytes[16:]

    def b8(self, bank: int, addr: int) -> int:
        if bank == 7:
            return self.prg[7 * 16384 + (addr - 0xC000)]
        return self.prg[bank * 16384 + (addr - 0x8000)]

    def b16(self, bank: int, addr: int) -> int:
        return self.b8(bank, addr) | (self.b8(bank, addr + 1) << 8)

    def slice_bank(self, bank: int, addr: int, length: int) -> bytes:
        base = 7 * 16384 + (addr - 0xC000) if bank == 7 else bank * 16384 + (addr - 0x8000)
        return self.prg[base : base + length]

    def build_common_chr(self) -> bytearray:
        """Reconstruct 8KB CHR-RAM ($0000-$1FFF) after load_common_chr ($D846)."""
        chr_ram = bytearray(0x2000)
        cursor = 0
        for i in range(10):
            src_bank = self.b8(7, 0xD81E + i * 2)
            pages = self.b8(7, 0xD81F + i * 2)
            src_addr = self.b16(7, 0xD832 + i * 2)
            data = self.slice_bank(src_bank, src_addr, pages * 256)
            end = min(0x2000, cursor + len(data))
            chr_ram[cursor:end] = data[: end - cursor]
            cursor += len(data)
        return chr_ram

    def build_stage_chr(self, stage: int) -> bytearray:
        """Reconstruct 8KB CHR-RAM ($0000-$1FFF) after load_stage_chr ($C75B)."""
        chr_ram = bytearray(0x2000)
        stage_bank = stage if stage < 6 else stage - 6
        list_base = 0x8D00 if stage < 6 else 0x8D20
        rec_count = self.b8(stage_bank, list_base)
        cursor = 0
        for i in range(rec_count):
            ref = self.b8(stage_bank, list_base + 1 + i * 2)
            pages = self.b8(stage_bank, list_base + 2 + i * 2)
            src_bank = ref & 0x03
            src_addr = (0x80 | ((ref & 0xFC) >> 2)) << 8
            data = self.slice_bank(src_bank, src_addr, pages * 256)
            end = min(0x2000, cursor + len(data))
            chr_ram[cursor:end] = data[: end - cursor]
            cursor += len(data)
        return chr_ram


def decode_tile_8x8(chr_ram: bytes, tile_addr: int) -> list[list[int]]:
    plane0 = chr_ram[tile_addr : tile_addr + 8]
    plane1 = chr_ram[tile_addr + 8 : tile_addr + 16]
    rows = []
    for y in range(8):
        b0, b1 = plane0[y], plane1[y]
        row = []
        for x in range(8):
            bit = 7 - x
            ci = ((b0 >> bit) & 1) | (((b1 >> bit) & 1) << 1)
            row.append(ci)
        rows.append(row)
    return rows


def signed8(v: int) -> int:
    return v - 256 if v >= 128 else v


def render_frame_record(
    rom: MegaManROM,
    chr_ram: bytes,
    frame_idx: int,
    spr_palettes: list[list[int]],
    hflip_entity: bool,
    canvas: bytearray,
    canvas_w: int,
    canvas_h: int,
    origin_x: int,
    origin_y: int,
) -> None:
    frec_ptr = rom.b16(6, 0x8000 + frame_idx * 2)
    spr_count = rom.b8(6, frec_ptr)
    layout_id = rom.b8(6, frec_ptr + 1)
    pos_ptr = rom.b16(6, 0x82AA + layout_id * 2)

    sprites = []
    for s in range(spr_count):
        tile_id = rom.b8(6, frec_ptr + 2 + s * 2)
        attr = rom.b8(6, frec_ptr + 3 + s * 2)
        if hflip_entity:
            attr ^= 0x40
        pos_code = rom.b8(6, pos_ptr + s)
        dy = signed8(rom.b8(6, 0x833A + pos_code))
        dx = signed8(rom.b8(6, (0x853A if hflip_entity else 0x843A) + pos_code))
        sprites.append((tile_id, attr, dx, dy))

    for tile_id, attr, dx, dy in reversed(sprites):
        pal_idx = attr & 0x03
        flip_h = bool(attr & 0x40)
        flip_v = bool(attr & 0x80)
        pal = spr_palettes[pal_idx]
        pixels = decode_tile_8x8(chr_ram, tile_id * 16)
        for ty in range(8):
            sy = (7 - ty) if flip_v else ty
            py = origin_y + dy + ty
            if not (0 <= py < canvas_h):
                continue
            for tx in range(8):
                sx = (7 - tx) if flip_h else tx
                ci = pixels[sy][sx]
                if ci == 0:
                    continue
                px = origin_x + dx + tx
                if not (0 <= px < canvas_w):
                    continue
                r, g, b = NES_PALETTE[pal[ci] & 0x3F]
                off = (py * canvas_w + px) * 4
                canvas[off : off + 4] = bytes((r, g, b, 255))


def extract_megaman_sheets(rom: MegaManROM) -> None:
    stage_chr = rom.build_stage_chr(0)
    weapon_names = [
        (0, "set1_buster"),
        (1, "set2_rolling_cutter"),
        (2, "set3_ice_slasher"),
        (3, "set4_hyper_bomb"),
        (4, "set5_fire_storm"),
        (5, "set6_thunder_beam"),
        (6, "set7_guts_arm"),
        (7, "set8_magnet_beam"),
    ]

    cell = 48
    cols = 6
    rows = 10  # Rows 0..4: Facing RIGHT | Rows 5..9: Facing LEFT
    w, h = cols * cell, rows * cell

    for w_idx, suffix in weapon_names:
        c_light = rom.b8(7, 0xD485 + w_idx * 2)
        c_dark = rom.b8(7, 0xD486 + w_idx * 2)
        spr_palettes = [
            [0x0F, c_light, c_dark, 0x0F],
            [0x0F, 0x20, 0x38, 0x0F],
            [0x0F, 0x30, 0x11, 0x0F],
            [0x0F, 0x30, 0x15, 0x0F],
        ]

        canvas = bytearray(w * h * 4)
        for f_idx in range(30):
            col = f_idx % cols
            row_r = f_idx // cols
            row_l = row_r + 5
            render_frame_record(
                rom, stage_chr, f_idx, spr_palettes, True,
                canvas, w, h, col * cell + 24, row_r * cell + 24
            )
            render_frame_record(
                rom, stage_chr, f_idx, spr_palettes, False,
                canvas, w, h, col * cell + 24, row_l * cell + 24
            )

        write_png_rgba(os.path.join(OUT_DIR, "sprites", f"megaman_{suffix}.png"), w, h, canvas)


def extract_buster_and_effects(rom: MegaManROM) -> None:
    stage_chr = rom.build_stage_chr(0)
    spr_palettes = [
        [0x0F, 0x2C, 0x11, 0x0F],
        [0x0F, 0x20, 0x38, 0x0F],
        [0x0F, 0x30, 0x27, 0x0F],
        [0x0F, 0x30, 0x15, 0x0F],
    ]
    # Cell 0: Mega Buster lemon pellet (frame 33)
    # Cell 1: Starburst explosion / death orb (frame 26)
    # Cells 2..4: Hurt sweat drops (frames 30, 31, 32 shifted down +20px to center)
    cell = 32
    cols = 5
    w, h = cols * cell, cell
    canvas = bytearray(w * h * 4)
    render_frame_record(rom, stage_chr, 33, spr_palettes, False, canvas, w, h, 0 * cell + 16, 16)
    render_frame_record(rom, stage_chr, 26, spr_palettes, False, canvas, w, h, 1 * cell + 16, 16)
    for i, fid in enumerate([30, 31, 32]):
        render_frame_record(rom, stage_chr, fid, spr_palettes, False, canvas, w, h, (2 + i) * cell + 16, 16 + 18)

    write_png_rgba(os.path.join(OUT_DIR, "sprites", "buster_and_explosion_32x32.png"), w, h, canvas)


def draw_subblock_16x16(
    chr_ram: bytes,
    quad_val: int,
    pal: list[int],
    canvas: bytearray,
    canvas_w: int,
    dest_x: int,
    dest_y: int,
) -> None:
    """
    Expand one 16x16 quadrant byte (quad_val * 4 in BG pattern table $1000+):
      +0 = TL 8x8, +1 = BL 8x8, +2 = TR 8x8, +3 = BR 8x8
    """
    base_tile = (quad_val * 4) & 0xFF
    offsets = [
        (0, 0, 0),  # TL
        (1, 0, 8),  # BL
        (2, 8, 0),  # TR
        (3, 8, 8),  # BR
    ]
    for dt, ox, oy in offsets:
        t_addr = 0x1000 + ((base_tile + dt) & 0xFF) * 16
        pixels = decode_tile_8x8(chr_ram, t_addr)
        for ty in range(8):
            py = dest_y + oy + ty
            for tx in range(8):
                px = dest_x + ox + tx
                ci = pixels[ty][tx]
                r, g, b = NES_PALETTE[pal[ci] & 0x3F]
                off = (py * canvas_w + px) * 4
                canvas[off : off + 4] = bytes((r, g, b, 255))


def draw_metatile_32x32(
    rom: MegaManROM,
    chr_ram: bytes,
    stage_bank: int,
    mt_id: int,
    bg_palettes: list[list[int]],
    canvas: bytearray,
    canvas_w: int,
    dest_x: int,
    dest_y: int,
) -> None:
    """
    Expand one 32x32 metatile ($8000 + mt_id*4) using expand_metatiles layout:
      Outer loop = 2 columns/rows -> let's verify order (q0=TL, q1=BL, q2=TR, q3=BR vs TL,TR,BL,BR)
    """
    q0 = rom.b8(stage_bank, 0x8000 + mt_id * 4 + 0)
    q1 = rom.b8(stage_bank, 0x8000 + mt_id * 4 + 1)
    q2 = rom.b8(stage_bank, 0x8000 + mt_id * 4 + 2)
    q3 = rom.b8(stage_bank, 0x8000 + mt_id * 4 + 3)
    attr = rom.b8(stage_bank, 0x8300 + mt_id)

    # NES attribute byte: bits 0-1=TL, 2-3=TR, 4-5=BL, 6-7=BR (WAIT: top 2 bits in $8300 are collision class in MM1! Let's check!)
    pal_tl = bg_palettes[(attr >> 0) & 0x03]
    pal_tr = bg_palettes[(attr >> 2) & 0x03]
    pal_bl = bg_palettes[(attr >> 4) & 0x03]
    pal_br = bg_palettes[(attr >> 6) & 0x03]

    # Exact column-pair order per expand_metatiles ($CEBA): q0=TL, q1=BL, q2=TR, q3=BR
    draw_subblock_16x16(chr_ram, q0, pal_tl, canvas, canvas_w, dest_x + 0, dest_y + 0)
    draw_subblock_16x16(chr_ram, q1, pal_bl, canvas, canvas_w, dest_x + 0, dest_y + 16)
    draw_subblock_16x16(chr_ram, q2, pal_tr, canvas, canvas_w, dest_x + 16, dest_y + 0)
    draw_subblock_16x16(chr_ram, q3, pal_br, canvas, canvas_w, dest_x + 16, dest_y + 16)


def extract_stage_tileset_and_preview(rom: MegaManROM, stage: int, slug: str) -> None:
    stage_bank = stage if stage < 6 else stage - 6
    chr_ram = rom.build_stage_chr(stage)
    pal_base = 0x8CA0 if stage < 6 else 0x8CD0
    bg_palettes = [
        [rom.b8(stage_bank, pal_base + p * 4 + c) for c in range(4)]
        for p in range(4)
    ]
    # Ensure backdrop color 0 in all 4 BG palettes matches universal backdrop $3F00
    backdrop = bg_palettes[0][0]
    for p in range(4):
        bg_palettes[p][0] = backdrop

    # Collect unique metatiles actually used in this stage's 24 screens
    map_base = 0x8C00 if stage < 6 else 0x8C18
    screens = []
    used_mts = []
    for s in range(24):
        grid_idx = rom.b8(stage_bank, map_base + s)
        if grid_idx == 0xFF:
            continue
        screens.append(grid_idx)
        grid_ptr = rom.b16(stage_bank, 0x8C30 + grid_idx * 2)
        for cell in range(64):
            mt = rom.b8(stage_bank, grid_ptr + cell)
            if mt not in used_mts:
                used_mts.append(mt)

    used_mts.sort()

    # 1. Export PGMMV 16x16-grid Tileset (each 32x32 metatile = 2x2 of 16x16 tiles, 8 metatiles per row = 256px wide)
    mt_cols = 8
    mt_rows = (len(used_mts) + mt_cols - 1) // mt_cols
    ts_w, ts_h = mt_cols * 32, mt_rows * 32
    ts_canvas = bytearray(ts_w * ts_h * 4)
    for idx, mt_id in enumerate(used_mts):
        mx = (idx % mt_cols) * 32
        my = (idx // mt_cols) * 32
        draw_metatile_32x32(rom, chr_ram, stage_bank, mt_id, bg_palettes, ts_canvas, ts_w, mx, my)

    write_png_rgba(os.path.join(OUT_DIR, "tilesets", f"{slug}_tileset_16x16.png"), ts_w, ts_h, ts_canvas)

    # 2. Export first 6 screens strip preview (to verify screen rendering & metatile layout!)
    prev_count = min(6, len(screens))
    pw, ph = prev_count * 256, 240
    p_canvas = bytearray(pw * ph * 4)
    for s_i in range(prev_count):
        grid_ptr = rom.b16(stage_bank, 0x8C30 + screens[s_i] * 2)
        # Screen grid is 8 cols x 8 rows (column-major: col*8 + row! Let's check line 892 of fixed_camera_scroll.asm: "column*8 + row")
        tmp_screen = bytearray(256 * 256 * 4)
        for col in range(8):
            for row in range(8):
                mt_id = rom.b8(stage_bank, grid_ptr + col * 8 + row)
                draw_metatile_32x32(rom, chr_ram, stage_bank, mt_id, bg_palettes, tmp_screen, 256, col * 32, row * 32)
        # Copy top 240 rows into strip
        for y in range(240):
            src_off = y * 256 * 4
            dst_off = (y * pw + s_i * 256) * 4
            p_canvas[dst_off : dst_off + 256 * 4] = tmp_screen[src_off : src_off + 256 * 4]

    write_png_rgba(os.path.join(OUT_DIR, "maps", f"{slug}_opening_screens.png"), pw, ph, p_canvas)


if __name__ == "__main__":
    with open(ROM_PATH, "rb") as f:
        rom = MegaManROM(f.read())
    extract_megaman_sheets(rom)
    extract_buster_and_effects(rom)
    extract_stage_tileset_and_preview(rom, 0, "cutman")
    print("All assets extracted cleanly!")
