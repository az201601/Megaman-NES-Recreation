from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root = Path(__file__).resolve().parents[2]
src = root / 'Assets/Cut Man/Stage/Tenth Ladder Transition'
assert (src / 'bg_mm1_cutman_ladder_route_tileset.png').read_bytes() == (src.parent / 'Ninth Ladder Transition/bg_mm1_cutman_ladder_route_tileset.png').read_bytes()
assert (src / 'spr_mm1_super_cutter_dispenser.png').read_bytes() == (src.parent / 'Ninth Ladder Transition/spr_mm1_super_cutter_dispenser.png').read_bytes()
files = sorted(src.glob('*.gml')) + [src / n for n in (
    'INSTALL-GMS14.md', 'README.md', 'cutman_tenth_route_reference.png',
    'cutman_tenth_lower_reference.png', 'bg_mm1_cutman_ladder_route_tileset.png',
    'spr_mm1_super_cutter_dispenser.png', 'spr_mm1_cutman_spike.png')]
assert len(list(src.glob('*.gml'))) == 9
assert len(files) == 16
out = src / 'Downloads/mm1-cutman-tenth-ladder-transition-gms14.zip'
out.parent.mkdir(exist_ok=True)
with ZipFile(out, 'w', ZIP_DEFLATED) as z:
    for f in files:
        z.writestr(f.name, f.read_bytes())
with ZipFile(out) as z:
    assert len(z.namelist()) == len(files)
    for f in files:
        assert z.read(f.name) == f.read_bytes(), f.name
print('PASS ZIP16files:9GML/2guides/2references/3PNGs (two unchanged recovery, one native spike), byte identity; no ROM')
