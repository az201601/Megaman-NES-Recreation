"""Bundle exact previously tested camera/geometry files for installed-coordinate repair."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root = Path(__file__).resolve().parents[2]
src = root / 'Assets/Cut Man/Stage/Fourth Coordinate Repair'
old = root / 'Assets/Cut Man/Stage/Fourth Ladder Transition'
files = sorted(src.glob('*.gml'))
assert len(files) == 6
for f in files:
    assert f.read_bytes() == (old / f.name).read_bytes(), f.name
assert 'view_yview[0] = 960;' in (src / 'obj_mm1_cutman_camera_create.gml').read_text()
assert 'room_height != 1200' in (src / 'obj_mm1_cutman_camera_create.gml').read_text()
assert 'room_width != 1536' in (src / 'obj_mm1_cutman_camera_create.gml').read_text()
assert (src / 'scr_mm1_cutman_ladder_route_blocks.gml').read_text().count('instance_create(') == 10
files += [src / 'INSTALL-GMS14.md']
out = src / 'Downloads/mm1-cutman-fourth-coordinate-repair-gms14.zip'
out.parent.mkdir(exist_ok=True)
with ZipFile(out, 'w', ZIP_DEFLATED) as z:
    for f in files:
        z.writestr(f.name, f.read_bytes())
with ZipFile(out) as z:
    assert len(z.namelist()) == 7
    for f in files:
        assert z.read(f.name) == f.read_bytes()
print('PASS6GML identical to Fourth tested sources, matched960view/1536x1200world/10blocks; ZIP7files byte-identical. NOT user runtime certification.')
