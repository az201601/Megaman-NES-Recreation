"""Deterministic, source-linked GMS1.4 manual package. No ROM/runtime states."""
from pathlib import Path
import hashlib,json,zipfile
root=Path(__file__).resolve().parents[2]
base=root/'Assets/Combat/MM5/Blader Checkpoint'
files={str(p.relative_to(base)):p for p in base.rglob('*') if p.is_file() and 'Downloads' not in p.relative_to(base).parts and p.name!='PACKAGE-MANIFEST.json'}
files['Art/spr_mm1_blader_strip2.png']=root/'Assets/Enemies/MM1/Blader/spr_mm1_blader_strip2.png'
for kind,frames in [('small_health',2),('large_health',2),('small_weapon',2),('large_weapon',2),('extra_life',1)]:
 name=f'spr_mm5_pickup_{kind}_strip{frames}.png';files['Art/'+name]=root/'Assets/Pickups/MM5/Recovered'/name
for name in ['snd_mm5_health_refill','snd_mm5_megaman_hurt','snd_mm5_extra_life','snd_mm5_megaman_death']:
 files['Audio/'+name+'.wav']=root/'Assets/Audio/Mega Man/MM5/Combat'/f'{name}.wav'
files['Audio/snd_mm6_enemy_hit.wav']=root/'Assets/Audio/Mega Man/MM6/Combat/Enemy Hit/snd_mm6_enemy_hit.wav'
manifest={'scope':'Manual GMS1.4 combat source/resource package, not an installed GMX or runner build. Use INSTALL-GMS14.md. No ROM/untrimmed research audio/emulator snapshots.', 'files':[{'path':name,'source':str(p.relative_to(root)),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for name,p in sorted(files.items())]}
(base/'PACKAGE-MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n')
files['PACKAGE-MANIFEST.json']=base/'PACKAGE-MANIFEST.json'
out=base/'Downloads/mm1-blader-mm5-combat-health-pickups-gms14.zip';out.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:
 for name,p in sorted(files.items()):
  info=zipfile.ZipInfo(name,(2026,10,31,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o100644<<16;z.writestr(info,p.read_bytes())
with zipfile.ZipFile(out) as z:
 assert len(z.namelist())==len(files)
 for name,p in files.items():assert z.read(name)==p.read_bytes()
print('PASS package',len(files),'files',out.stat().st_size,'bytes SHA256',hashlib.sha256(out.read_bytes()).hexdigest())
