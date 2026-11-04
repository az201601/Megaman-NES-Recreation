from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root = Path(__file__).resolve().parents[2]
src = root / 'Assets/Cut Man/Stage/Eighth Ladder Transition'
assert (src / 'bg_mm1_cutman_ladder_route_tileset.png').read_bytes() == (src.parent / 'Seventh Ladder Transition/bg_mm1_cutman_ladder_route_tileset.png').read_bytes()
assert (src / 'spr_mm1_super_cutter_dispenser.png').read_bytes() == (src.parent / 'Seventh Ladder Transition/spr_mm1_super_cutter_dispenser.png').read_bytes()
files = sorted(src.glob('*.gml')) + [src / n for n in (
    'INSTALL-GMS14.md', 'README.md', 'cutman_eighth_route_reference.png',
    'cutman_eighth_upper_reference.png', 'bg_mm1_cutman_ladder_route_tileset.png',
    'spr_mm1_super_cutter_dispenser.png')]
assert len(list(src.glob('*.gml'))) == 8
assert len(files) == 14
out = src / 'Downloads/mm1-cutman-eighth-ladder-transition-gms14.zip'
out.parent.mkdir(exist_ok=True)
with ZipFile(out, 'w', ZIP_DEFLATED) as z:
    for f in files:
        z.writestr(f.name, f.read_bytes())
with ZipFile(out) as z:
    assert len(z.namelist()) == len(files)
    for f in files:
        assert z.read(f.name) == f.read_bytes(), f.name
print('PASS ZIP14files:8GML/2guides/2references/2unchanged-recoveryPNGs, byte identity; no ROM')
