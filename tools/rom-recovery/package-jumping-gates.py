"""Deterministic minimal GMS1.4 jumping gate entry patch."""
from pathlib import Path
import json,hashlib,zipfile
root=Path(__file__).resolve().parents[2];base=root/'Assets/Cut Man/Stage/Jumping Gate Entry'
files={p.name:p for p in base.iterdir() if p.is_file() and p.name!='PACKAGE-MANIFEST.json'}
manifest={'scope':'Jumping entry at both gates after accepted Free Fall Correction; one new script/two full replacements; no art/audio/room/enemy changes. GMS compile/installed playtest pending.', 'files':[{'path':n,'source':str(p.relative_to(root)),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}for n,p in sorted(files.items())]}
(base/'PACKAGE-MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n');files['PACKAGE-MANIFEST.json']=base/'PACKAGE-MANIFEST.json'
out=base/'Downloads/mm1-cutman-jumping-gates-gms14.zip';out.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED)as z:
 for name,p in sorted(files.items()):
  i=zipfile.ZipInfo(name,(2026,11,1,0,0,0));i.compress_type=zipfile.ZIP_DEFLATED;i.external_attr=0o100644<<16;z.writestr(i,p.read_bytes())
with zipfile.ZipFile(out)as z:
 assert z.testzip()is None and len(z.namelist())==len(files)
 for n,p in files.items():assert z.read(n)==p.read_bytes()
print('PASS',len(files),'files',out.stat().st_size,'bytes',hashlib.sha256(out.read_bytes()).hexdigest())
