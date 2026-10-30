from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
src = Path(__file__).resolve().parents[2] / 'Assets/Cut Man/Stage/Super Cutter Dispenser'
files = sorted(src.glob('*.gml')) + [src / n for n in (
    'spr_mm1_super_cutter_dispenser.png', 'INSTALL-GMS14.md', 'README.md')]
assert len(files) == 6
out = src / 'Downloads/mm1-cutman-dispenser-separation-gms14.zip'
out.parent.mkdir(exist_ok=True)
with ZipFile(out, 'w', ZIP_DEFLATED) as z:
    for f in files:
        z.writestr(f.name, f.read_bytes())
with ZipFile(out) as z:
    assert len(z.namelist()) == 6
    for f in files:
        assert z.read(f.name) == f.read_bytes()
print('PASS ZIP6files:3GML/1sprite/2guides; source byte-identical; no ROM')
