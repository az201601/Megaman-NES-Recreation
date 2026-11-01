"""Deterministic focused GMS1.4 free-fall/pit correction, no ROM or old resources."""
from pathlib import Path
import json,hashlib,zipfile
root=Path(__file__).resolve().parents[2];base=root/'Assets/Cut Man/Stage/Free Fall Correction'
files={p.name:p for p in base.iterdir() if p.is_file() and p.name!='PACKAGE-MANIFEST.json'}
for name in ['native-mm5-falls.json','native-mm5-death-effects.json']:
 files['Reference/'+name]=root/'docs/mm5-fall-reference'/name
manifest={'scope':'Free-fall lower connections/pit-only no-particle death; requires accepted Second Gate+seven enemies. Manual GMS1.4 install/compile/runtime pending. No ROM/states/art/audio/geometry/enemy replacements.', 'files':[{'path':n,'source':str(p.relative_to(root)),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}for n,p in sorted(files.items())]}
(base/'PACKAGE-MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n');files['PACKAGE-MANIFEST.json']=base/'PACKAGE-MANIFEST.json'
out=base/'Downloads/mm1-cutman-free-fall-correction-gms14.zip';out.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED)as z:
 for name,p in sorted(files.items()):
  info=zipfile.ZipInfo(name,(2026,11,1,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o100644<<16;z.writestr(info,p.read_bytes())
with zipfile.ZipFile(out)as z:
 assert z.testzip()is None and len(z.namelist())==len(files)
 for name,p in files.items():assert z.read(name)==p.read_bytes()
print('PASS',len(files),'files',out.stat().st_size,'bytes',hashlib.sha256(out.read_bytes()).hexdigest())
