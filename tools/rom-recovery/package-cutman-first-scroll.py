"""Package manual GMS1.4 checkpoint, excluding ROMs/research traces."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root = Path(__file__).resolve().parents[2]
src = root / 'Assets/Cut Man/Stage/First Ladder Transition'
files = sorted(src.glob('*.gml')) + [src / n for n in (
    'INSTALL-GMS14.md', 'README.md',
    'cutman_ladder_route_reference.png', 'cutman_upper_room_reference.png')]
assert len(list(src.glob('*.gml'))) == 14
assert len(files) == 18
out = src / 'Downloads/mm1-cutman-first-ladder-transition-gms14.zip'
out.parent.mkdir(exist_ok=True)
with ZipFile(out, 'w', ZIP_DEFLATED) as z:
    for f in files:
        z.writestr(f.name, f.read_bytes())
with ZipFile(out) as z:
    assert len(z.namelist()) == len(files)
    for f in files:
        assert z.read(f.name) == f.read_bytes(), f.name
print('PASS ZIP18files:14GML +2guides +2referencePNGs; byte identity checked; no ROM/new atlas')
