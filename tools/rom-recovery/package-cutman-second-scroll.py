"""Manual GMS1.4 incremental upgrade; exclude ROMs/research data."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
src = Path(__file__).resolve().parents[2] / 'Assets/Cut Man/Stage/Second Ladder Transition'
files = sorted(src.glob('*.gml')) + [src / n for n in (
    'INSTALL-GMS14.md', 'README.md', 'cutman_second_route_reference.png',
    'cutman_second_upper_reference.png')]
assert len(files) == 11
out = src / 'Downloads/mm1-cutman-second-ladder-transition-gms14.zip'
out.parent.mkdir(exist_ok=True)
with ZipFile(out, 'w', ZIP_DEFLATED) as z:
    for f in files:
        z.writestr(f.name, f.read_bytes())
with ZipFile(out) as z:
    assert len(z.namelist()) == len(files)
    for f in files:
        assert z.read(f.name) == f.read_bytes(), f.name
print('PASS ZIP11files:7GML/2guides/2references, byte identical, no ROM/art import')
