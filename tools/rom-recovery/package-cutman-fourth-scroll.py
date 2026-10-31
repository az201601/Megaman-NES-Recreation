"""Manual GMS1.4 incremental upgrade; exclude ROMs/research data."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
src = Path(__file__).resolve().parents[2] / 'Assets/Cut Man/Stage/Fourth Ladder Transition'
files = sorted(src.glob('*.gml')) + [src / n for n in (
    'INSTALL-GMS14.md', 'README.md', 'cutman_fourth_route_reference.png',
    'cutman_fourth_upper_reference.png', 'bg_mm1_cutman_ladder_route_tileset.png')]
assert len(files) == 12
out = src / 'Downloads/mm1-cutman-fourth-ladder-transition-gms14.zip'
out.parent.mkdir(exist_ok=True)
with ZipFile(out, 'w', ZIP_DEFLATED) as z:
    for f in files:
        z.writestr(f.name, f.read_bytes())
with ZipFile(out) as z:
    assert len(z.namelist()) == len(files)
    for f in files:
        assert z.read(f.name) == f.read_bytes(), f.name
print('PASS ZIP12files:7GML/2guides/2references/1atlas, byte identical, no ROM;1atlas import')
