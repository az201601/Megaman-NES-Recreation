from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root = Path(__file__).resolve().parents[2]
src = root / 'Assets/Cut Man/Stage/Second Gate Passage'
prior = src.parent / 'First Gate Passage'
assert (src/'bg_mm1_cutman_ladder_route_tileset.png').read_bytes() == (prior/'bg_mm1_cutman_ladder_route_tileset.png').read_bytes()
files = sorted(src.glob('*.gml')) + [src/n for n in ('README.md','INSTALL-GMS14.md','cutman_boss_room_reference.png','cutman_second_gate_route_reference.png','bg_mm1_cutman_ladder_route_tileset.png','spr_mm1_cutman_second_gate_open_backdrop.png')]
assert len(list(src.glob('*.gml'))) == 13
assert len(files) == 19
out = src/'Downloads/mm1-cutman-second-gate-passage-gms14.zip'
out.parent.mkdir(exist_ok=True)
with ZipFile(out,'w',ZIP_DEFLATED) as z:
    for f in files:
        z.writestr(f.name,f.read_bytes())
with ZipFile(out) as z:
    assert len(z.namelist()) == 19
    for f in files:
        assert z.read(f.name) == f.read_bytes()
print(f'PASS ZIP19files/13GML/2guides/2references/2PNGs, byte identity, atlas unchanged; {out.stat().st_size} bytes; no ROM')
