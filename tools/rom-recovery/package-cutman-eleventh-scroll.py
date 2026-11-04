from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root = Path(__file__).resolve().parents[2]
src = root / 'Assets/Cut Man/Stage/Eleventh Ladder Transition'
old = src.parent / 'Tenth Ladder Transition'
for name in ['spr_mm1_super_cutter_dispenser.png', 'spr_mm1_cutman_spike.png']:
    assert (src / name).read_bytes() == (old / name).read_bytes()
assert (src / 'bg_mm1_cutman_ladder_route_tileset.png').read_bytes() != (old / 'bg_mm1_cutman_ladder_route_tileset.png').read_bytes()
files = sorted(src.glob('*.gml')) + [src / n for n in (
    'INSTALL-GMS14.md', 'README.md', 'cutman_eleventh_route_reference.png',
    'cutman_eleventh_lower_reference.png', 'bg_mm1_cutman_ladder_route_tileset.png',
    'spr_mm1_super_cutter_dispenser.png', 'spr_mm1_cutman_spike.png',
    'spr_mm1_cutman_boss_gate_closed.png')]
assert len(list(src.glob('*.gml'))) == 9
assert len(files) == 17
out = src / 'Downloads/mm1-cutman-eleventh-ladder-transition-gms14.zip'
out.parent.mkdir(exist_ok=True)
with ZipFile(out, 'w', ZIP_DEFLATED) as z:
    for f in files:
        z.writestr(f.name, f.read_bytes())
with ZipFile(out) as z:
    assert len(z.namelist()) == len(files)
    for f in files:
        assert z.read(f.name) == f.read_bytes(), f.name
print('PASS ZIP17files:9GML/2guides/2references/4PNGs, byte identity, old sprites unchanged/new atlas mandatory; no ROM')
