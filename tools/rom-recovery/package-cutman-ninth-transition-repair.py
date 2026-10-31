from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import shutil
root = Path(__file__).resolve().parents[2]
base = root / 'Assets/Cut Man/Stage/Ninth Ladder Transition'
src = base.parent / 'Ninth Transition Repair'
src.mkdir(exist_ok=True)
names = ['scr_mm1_cutman_scroll_start.gml', 'obj_mm1_cutman_camera_create.gml',
         'obj_mm1_cutman_camera_begin_step.gml', 'obj_mm1_cutman_camera_end_step.gml']
for name in names:
    shutil.copyfile(base / name, src / name)
names.append('INSTALL-GMS14.md')
out = src / 'Downloads/mm1-cutman-ninth-transition-repair-gms14.zip'
out.parent.mkdir(exist_ok=True)
with ZipFile(out, 'w', ZIP_DEFLATED) as z:
    for name in names:
        z.writestr(name, (src / name).read_bytes())
with ZipFile(out) as z:
    assert set(z.namelist()) == set(names)
    for name in names:
        assert z.read(name) == (src / name).read_bytes()
    for name in names[:-1]:
        assert z.read(name) == (base / name).read_bytes()
assert b'route_start_version = 901;' in (src / names[0]).read_bytes()
assert b'route_start_version != 901' in (src / names[2]).read_bytes()
print('PASS repair ZIP: four matching canonical GML files + guide, byte identity, no geometry/assets/ROM')
