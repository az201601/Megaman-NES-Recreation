"""Deterministic additive GMS1.4 Octopus Battery checkpoint; accepted scenery/audio preserved."""
from pathlib import Path
import hashlib,json,zipfile
root=Path(__file__).resolve().parents[2]
base=root/'Assets/Combat/MM5/Octopus Battery Checkpoint'
files={str(p.relative_to(base)):p for p in base.rglob('*') if p.is_file() and 'Downloads' not in p.relative_to(base).parts and p.name!='PACKAGE-MANIFEST.json'}
files.update({
 'Art/spr_mm1_octopus_battery_strip3.png':root/'Assets/Enemies/MM1/Octopus Battery/spr_mm1_octopus_battery_strip3.png',
 'Reference/native-octopus-battery.json':root/'Assets/Enemies/MM1/Octopus Battery/Reference/native-octopus-battery.json',
 'Reference/native-octopus-battery-art.json':root/'Assets/Enemies/MM1/Octopus Battery/Reference/native-octopus-battery-art.json',
})
manifest={'scope':'Additive Octopus Battery manual installer after accepted Blader/Blaster/Super Cutter/Flea combat. User GMS import/compile/runtime pending. No ROM/savestates/audio/building replacements.', 'files':[{'path':name,'source':str(p.relative_to(root)),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}for name,p in sorted(files.items())]}
(base/'PACKAGE-MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n');files['PACKAGE-MANIFEST.json']=base/'PACKAGE-MANIFEST.json'
out=base/'Downloads/mm1-octopus-battery-combat-gms14.zip';out.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED)as z:
 for name,p in sorted(files.items()):
  i=zipfile.ZipInfo(name,(2026,11,1,0,0,0));i.compress_type=zipfile.ZIP_DEFLATED;i.external_attr=0o100644<<16;z.writestr(i,p.read_bytes())
with zipfile.ZipFile(out)as z:
 assert z.testzip() is None and len(z.namelist())==len(files)
 for name,p in files.items():assert z.read(name)==p.read_bytes()
print('PASS',len(files),'files',out.stat().st_size,'bytes',hashlib.sha256(out.read_bytes()).hexdigest())
