"""Deterministic additive GMS1.4 Flying Shell checkpoint; accepted scenery/audio preserved."""
from pathlib import Path
import hashlib,json,zipfile
root=Path(__file__).resolve().parents[2]
base=root/'Assets/Combat/MM5/Flying Shell Checkpoint'
files={str(p.relative_to(base)):p for p in base.rglob('*') if p.is_file() and 'Downloads' not in p.relative_to(base).parts and p.name!='PACKAGE-MANIFEST.json'}
files.update({
 'Art/spr_mm1_flying_shell_strip2.png':root/'Assets/Enemies/MM1/Flying Shell/spr_mm1_flying_shell_strip2.png',
 'Reference/native-flying-shell.json':root/'Assets/Enemies/MM1/Flying Shell/Reference/native-flying-shell.json',
 'Reference/native-flying-shell-art.json':root/'Assets/Enemies/MM1/Flying Shell/Reference/native-flying-shell-art.json',
 'Art/spr_mm1_flying_shell_bullet.png':root/'Assets/Enemies/MM1/Flying Shell/spr_mm1_flying_shell_bullet.png',
 'Reference/native-flying-shell-bullet-art.json':root/'Assets/Enemies/MM1/Flying Shell/Reference/native-flying-shell-bullet-art.json',
 'Audio/snd_mm1_flying_shell_fire.wav':root/'Assets/Audio/Mega Man/MM1/Flying Shell/mm1-flying-shell-native-burst-balanced.wav',
 'Reference/native-burst-audio.json':root/'Assets/Audio/Mega Man/MM1/Flying Shell/recovery.json',
})
manifest={'scope':'Additive Flying Shell manual installer after accepted Blader/Blaster/Super Cutter/Flea/Octopus Battery combat. User GMS import/compile/runtime pending. New native burst sound awaits approval. No ROM/savestates/old-audio/scenery replacements.', 'files':[{'path':name,'source':str(p.relative_to(root)),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}for name,p in sorted(files.items())]}
(base/'PACKAGE-MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n');files['PACKAGE-MANIFEST.json']=base/'PACKAGE-MANIFEST.json'
out=base/'Downloads/mm1-flying-shell-combat-gms14.zip';out.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED)as z:
 for name,p in sorted(files.items()):
  i=zipfile.ZipInfo(name,(2026,11,1,0,0,0));i.compress_type=zipfile.ZIP_DEFLATED;i.external_attr=0o100644<<16;z.writestr(i,p.read_bytes())
with zipfile.ZipFile(out)as z:
 assert z.testzip() is None and len(z.namelist())==len(files)
 for name,p in files.items():assert z.read(name)==p.read_bytes()
print('PASS',len(files),'files',out.stat().st_size,'bytes',hashlib.sha256(out.read_bytes()).hexdigest())
