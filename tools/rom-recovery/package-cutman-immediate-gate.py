from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root = Path(__file__).resolve().parents[2]
src = root / 'Assets/Cut Man/Stage/MM5 Immediate Opening'
base = src.parent / 'First Gate Passage'
files = [src / n for n in ('obj_mm1_cutman_camera_begin_step.gml', 'scr_mm1_cutman_gate_start.gml', 'INSTALL-GMS14.md')]
for f in files[:2]:
    assert f.read_bytes() == (base / f.name).read_bytes()
out = src / 'Downloads/mm1-cutman-mm5-immediate-opening-gms14.zip'
with ZipFile(out, 'w', ZIP_DEFLATED) as z:
    for f in files:
        z.writestr(f.name, f.read_bytes())
with ZipFile(out) as z:
    assert len(z.namelist()) == 3
    for f in files:
        assert z.read(f.name) == f.read_bytes()
print(f'PASS matched2GML+guide timing patch, {out.stat().st_size}bytes')
