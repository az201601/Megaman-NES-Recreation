"""Deterministic source-only GMS1.4 spike-hazard manual patch; no existing art/audio."""
from pathlib import Path
import hashlib,json,zipfile
root=Path(__file__).resolve().parents[2]
base=root/'Assets/Combat/MM5/Cut Man Spikes'
files={str(p.relative_to(base)):p for p in base.rglob('*') if p.is_file() and 'Downloads' not in p.relative_to(base).parts and p.name!='PACKAGE-MANIFEST.json'}
manifest={'scope':'Activate ten existing Cut Man spike objects with MM5 recoil/flashing guard and continuous expiry checks. One new script/one full latest fixed-health combat_end_frame replacement. Shared ordinary death, NOT pit wrapper. No new art/audio/objects/events/terrain/player/door/death-resource changes. Source/model checks, NOT installed GMS acceptance.','files':[{'path':name,'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for name,p in sorted(files.items())]}
(base/'PACKAGE-MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n');files['PACKAGE-MANIFEST.json']=base/'PACKAGE-MANIFEST.json'
out=base/'Downloads/mm1-cutman-spikes-gms14.zip';out.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED)as z:
 for name,p in sorted(files.items()):
  i=zipfile.ZipInfo(name,(2026,11,1,0,0,0));i.compress_type=zipfile.ZIP_DEFLATED;i.external_attr=0o100644<<16;z.writestr(i,p.read_bytes())
with zipfile.ZipFile(out)as z:
 assert z.testzip() is None and len(z.namelist())==len(files)
 for name,p in files.items():assert z.read(name)==p.read_bytes()
print('PASS',len(files),'files',out.stat().st_size,'bytes',hashlib.sha256(out.read_bytes()).hexdigest())
