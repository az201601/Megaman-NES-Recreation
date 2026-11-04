"""Deterministic GMS1.4 boss entrance manual patch; native sprites/music/effects; no ROM."""
from pathlib import Path
import hashlib,json,zipfile
root=Path(__file__).resolve().parents[2]
base=root/'Assets/Bosses/MM1/Cut Man/Entrance'
files={str(p.relative_to(base)):p for p in base.rglob('*') if p.is_file() and 'Downloads' not in p.relative_to(base).parts and p.name!='PACKAGE-MANIFEST.json'}
manifest={'scope':'Cut Man boss-room ENTRANCE ONLY: native delayed incoming closing/appearance/scissors/meter28/music/control303. Original opening/geometry/MM5 player/E preserved. Combat AI/contact/damage/defeat/reward NOT implemented. Manual GMS1.4 resources/events. Source/model/native checks, NOT installed acceptance.','files':[{'path':name,'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for name,p in sorted(files.items())]}
(base/'PACKAGE-MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n');files['PACKAGE-MANIFEST.json']=base/'PACKAGE-MANIFEST.json'
out=base/'Downloads/mm1-cutman-boss-entrance-gms14.zip';out.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED)as z:
 for name,p in sorted(files.items()):
  i=zipfile.ZipInfo(name,(2026,11,2,0,0,0));i.compress_type=zipfile.ZIP_DEFLATED;i.external_attr=0o100644<<16;z.writestr(i,p.read_bytes())
with zipfile.ZipFile(out)as z:
 assert z.testzip() is None and len(z.namelist())==len(files)
 for name,p in files.items():assert z.read(name)==p.read_bytes()
print('PASS',len(files),'files',out.stat().st_size,'bytes',hashlib.sha256(out.read_bytes()).hexdigest())
