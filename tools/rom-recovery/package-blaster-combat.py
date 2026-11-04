"""Deterministic additive GMS1.4 Blaster checkpoint; original audio/gameplay sources preserved."""
from pathlib import Path
import hashlib,json,zipfile
root=Path(__file__).resolve().parents[2]
base=root/'Assets/Combat/MM5/Blaster Checkpoint'
files={str(p.relative_to(base)):p for p in base.rglob('*') if p.is_file() and 'Downloads' not in p.relative_to(base).parts and p.name!='PACKAGE-MANIFEST.json'}
files.update({
 'Art/spr_mm1_blaster_strip4.png':root/'Assets/Enemies/MM1/Blaster/spr_mm1_blaster_strip4.png',
 'Art/spr_mm1_blaster_bullet.png':root/'Assets/Enemies/MM1/Blaster/spr_mm1_blaster_bullet.png',
 'Audio/snd_mm1_blaster_fire.wav':root/'Assets/Audio/Mega Man/MM1/Blaster/Approved/snd_mm1_blaster_fire.wav',
 'Audio/snd_mm6_blocked_hit.wav':root/'Assets/Audio/Mega Man/MM6/Combat/Blocked Hit/mm6-blocked-hit-balanced-review.wav',
 'Reference/native-blaster-gameplay.json':root/'Assets/Enemies/MM1/Blaster/Reference/native-blaster-gameplay.json',
 'Reference/fire-trim.json':root/'Assets/Audio/Mega Man/MM1/Blaster/Approved/trim.json',
 'Reference/mm6-ding-recovery.json':root/'Assets/Audio/Mega Man/MM6/Combat/Blocked Hit/recovery.json',
})
manifest={'scope':'Additive Blaster manual installer for accepted Blader combat and louder audio. User GMS import/compile/runtime pending. No ROM/savestates/untrimmed previews. Original quiet/rejected audio excluded.', 'files':[{'path':name,'source':str(p.relative_to(root)),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}for name,p in sorted(files.items())]}
(base/'PACKAGE-MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n');files['PACKAGE-MANIFEST.json']=base/'PACKAGE-MANIFEST.json'
out=base/'Downloads/mm1-blaster-combat-gms14.zip';out.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED)as z:
 for name,p in sorted(files.items()):
  i=zipfile.ZipInfo(name,(2026,11,1,0,0,0));i.compress_type=zipfile.ZIP_DEFLATED;i.external_attr=0o100644<<16;z.writestr(i,p.read_bytes())
with zipfile.ZipFile(out)as z:
 assert z.testzip() is None and len(z.namelist())==len(files)
 for name,p in files.items():assert z.read(name)==p.read_bytes()
print('PASS',len(files),'files',out.stat().st_size,'bytes',hashlib.sha256(out.read_bytes()).hexdigest())
