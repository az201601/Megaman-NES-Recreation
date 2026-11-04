"""Deterministic additive GMS1.4 Big Eye checkpoint; accepted scenery/audio preserved."""
from pathlib import Path
import hashlib,json,zipfile
root=Path(__file__).resolve().parents[2]
base=root/'Assets/Combat/MM5/Big Eye Checkpoint'
files={str(p.relative_to(base)):p for p in base.rglob('*') if p.is_file() and 'Downloads' not in p.relative_to(base).parts and p.name!='PACKAGE-MANIFEST.json'}
files.update({
 'Art/spr_mm1_big_eye_strip2.png':root/'Assets/Enemies/MM1/Big Eye/spr_mm1_big_eye_strip2.png',
 'Reference/native-big-eye-gameplay.json':root/'Assets/Enemies/MM1/Big Eye/Reference/native-big-eye-gameplay.json',
 'Reference/native-big-eye-art.json':root/'Assets/Enemies/MM1/Big Eye/Reference/native-big-eye-art.json',
 'Audio/snd_mm1_big_eye_land.wav':root/'Assets/Audio/Mega Man/MM1/Big Eye/mm1-big-eye-land-balanced.wav',
 'Reference/native-landing-audio.json':root/'Assets/Audio/Mega Man/MM1/Big Eye/recovery.json',
})
manifest={'scope':'Additive Big Eye manual installer after accepted Blader/Blaster/Super Cutter/Flea/Octopus Battery/Flying Shell combat. User GMS import/compile/runtime pending. New native landing sound awaits approval. No ROM/savestates/old-audio/scenery replacements.', 'files':[{'path':name,'source':str(p.relative_to(root)),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}for name,p in sorted(files.items())]}
(base/'PACKAGE-MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n');files['PACKAGE-MANIFEST.json']=base/'PACKAGE-MANIFEST.json'
out=base/'Downloads/mm1-big-eye-combat-gms14.zip';out.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED)as z:
 for name,p in sorted(files.items()):
  i=zipfile.ZipInfo(name,(2026,11,1,0,0,0));i.compress_type=zipfile.ZIP_DEFLATED;i.external_attr=0o100644<<16;z.writestr(i,p.read_bytes())
with zipfile.ZipFile(out)as z:
 assert z.testzip() is None and len(z.namelist())==len(files)
 for name,p in files.items():assert z.read(name)==p.read_bytes()
print('PASS',len(files),'files',out.stat().st_size,'bytes',hashlib.sha256(out.read_bytes()).hexdigest())
