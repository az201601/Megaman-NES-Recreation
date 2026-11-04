from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
root=Path(__file__).resolve().parents[2]
src=root/'Assets/Cut Man/Stage/Opening Route'
files=list(src.glob('*.gml'))+[src/n for n in ['INSTALL-GMS14.md','bg_mm1_cutman_opening_tileset.png','cutman_opening_layout_reference.png','cutman_opening_scenery_reference.png','tile-placement.csv','block-placement.csv']]
assert len(files)==11
out=src/'Downloads/mm1-cutman-opening-route-gms14.zip';out.parent.mkdir(exist_ok=True)
with ZipFile(out,'w',ZIP_DEFLATED) as z:
 for f in files:z.writestr(f.name,f.read_bytes())
with ZipFile(out) as z:
 for f in files:assert z.read(f.name)==f.read_bytes()
print('PASS manual install ZIP11files:5GML,1guide,3PNGs,2CSV; byte identity checked')
