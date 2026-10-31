from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
src = Path(__file__).resolve().parents[2] / 'Assets/Cut Man/Stage/Super Cutter Dispenser'
files = sorted(src.glob('*.gml')) + [src / n for n in (
    'spr_mm1_super_cutter_dispenser.png', 'bg_mm1_cutman_ladder_route_tileset.png', 'INSTALL-GMS14.md', 'README.md')]
assert len(files) == 7
assert (src / 'bg_mm1_cutman_ladder_route_tileset.png').read_bytes() == (src.parent / 'Fourth Ladder Transition/bg_mm1_cutman_ladder_route_tileset.png').read_bytes()
out = src / 'Downloads/mm1-cutman-dispenser-separation-gms14.zip'
out.parent.mkdir(exist_ok=True)
with ZipFile(out, 'w', ZIP_DEFLATED) as z:
    for f in files:
        z.writestr(f.name, f.read_bytes())
with ZipFile(out) as z:
    assert len(z.namelist()) == 7
    for f in files:
        assert z.read(f.name) == f.read_bytes()
print('PASS ZIP7files:3GML/1sprite/1existing-atlas/2guides; source byte-identical; no ROM')
