"""Deterministic additive GMS1.4 Screw Bomber checkpoint; accepted scenery/audio preserved."""
from pathlib import Path
import hashlib,json,zipfile
root=Path(__file__).resolve().parents[2]
base=root/'Assets/Combat/MM5/Screw Bomber Checkpoint'
files={str(p.relative_to(base)):p for p in base.rglob('*') if p.is_file() and 'Downloads' not in p.relative_to(base).parts and p.name!='PACKAGE-MANIFEST.json'}
files.update({
 'Art/spr_mm1_screw_bomber_floor_strip5.png':root/'Assets/Enemies/MM1/Screw Bomber/spr_mm1_screw_bomber_floor_strip5.png',
 'Art/spr_mm1_screw_bomber_ceiling_strip5.png':root/'Assets/Enemies/MM1/Screw Bomber/spr_mm1_screw_bomber_ceiling_strip5.png',
 **{'Reference/'+name:root/'Assets/Enemies/MM1/Screw Bomber/Reference'/name for name in ['native-screw-bomber-source.json','native-screw-bomber-gameplay.json','native-screw-bomber-art.json']},
})
manifest={'scope':'Additive Screw Bomber manual installer after seven accepted enemies and Free Fall. Preserve latest jumping/walking gates. Reuse existing Blaster bullet/art/fire cue. GMS1.4compile/installed acceptance pending. No ROM/states/disassembly/oldaudio/terrain/room/camera/player/death replacements.', 'files':[{'path':name,'source':str(p.relative_to(root)),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}for name,p in sorted(files.items())]}
(base/'PACKAGE-MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n');files['PACKAGE-MANIFEST.json']=base/'PACKAGE-MANIFEST.json'
out=base/'Downloads/mm1-screw-bomber-combat-gms14.zip';out.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED)as z:
 for name,p in sorted(files.items()):
  i=zipfile.ZipInfo(name,(2026,11,1,0,0,0));i.compress_type=zipfile.ZIP_DEFLATED;i.external_attr=0o100644<<16;z.writestr(i,p.read_bytes())
with zipfile.ZipFile(out)as z:
 assert z.testzip() is None and len(z.namelist())==len(files)
 for name,p in files.items():assert z.read(name)==p.read_bytes()
print('PASS',len(files),'files',out.stat().st_size,'bytes',hashlib.sha256(out.read_bytes()).hexdigest())
