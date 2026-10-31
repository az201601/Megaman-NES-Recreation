from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root = Path(__file__).resolve().parents[2]
src = root / 'Assets/Cut Man/Stage/First Gate Passage'
audio = root / 'Assets/Audio/Mega Man/MM5/Stage/Gate/snd_mm5_gate_open_complete_untrimmed.wav'
files = sorted(src.glob('*.gml')) + [src / n for n in (
    'INSTALL-GMS14.md', 'README.md', 'cutman_first_gate_route_reference.png',
    'cutman_gate_corridor_reference.png', 'bg_mm1_cutman_ladder_route_tileset.png',
    'spr_mm1_cutman_boss_gate_open_backdrop.png', 'spr_mm1_cutman_second_gate_closed.png')] + [audio]
assert len(list(src.glob('*.gml'))) == 13
assert len(files) == 21
out = src / 'Downloads/mm1-cutman-first-gate-passage-gms14.zip'
out.parent.mkdir(exist_ok=True)
with ZipFile(out, 'w', ZIP_DEFLATED) as z:
    for f in files:
        z.writestr(f.name, f.read_bytes())
with ZipFile(out) as z:
    assert len(z.namelist()) == len(files)
    for f in files:
        assert z.read(f.name) == f.read_bytes(), f.name
print(f'PASS ZIP21files/13GML/2guides/2references/3PNGs/approved-complete-MM5-WAV; byte-identity; {out.stat().st_size} bytes; no ROM')
