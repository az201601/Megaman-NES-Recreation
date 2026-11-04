"""Small additive GMS1.4 manual package. Never includes ROMs/audio/dumps/states."""
from pathlib import Path
import json,hashlib,re,zipfile,struct
ROOT=Path(__file__).resolve().parents[2]; B=ROOT/'Assets/Weapons/MM1/Rolling Cutter'; I=B/'Integration'; I.mkdir(exist_ok=True)
sha=lambda b:hashlib.sha256(b).hexdigest()
records=json.loads((B/'Reference/equipped-palette.json').read_text())['sprites']
sprites=[dict(name=r['name'],file=r['file'],cell=r['cell'],frames=r['frames'],origin=r['origin']) for r in records]
sprites += [dict(name='spr_mm1_player_rolling_cutter',file='Art/spr_mm1_player_rolling_cutter_strip4.png',cell=[16,16],frames=4,origin=[8,7]),dict(name='spr_mm5_cutter_energy_meter',file='Art/spr_mm5_cutter_energy_meter_strip29.png',cell=[8,56],frames=29,origin=[0,0])]
new=sorted(p.stem for p in (B/'Scripts').glob('*.gml'))
replacements=sorted(p.stem for p in (B/'Adapters').glob('scr_*.gml') if 'append' not in p.stem)
files={}
for d in ['Art','Scripts','Objects','Reference']:
 for p in sorted((B/d).iterdir()):
  if p.is_file():files[str(p.relative_to(B))]=p.read_bytes()
for p in sorted((B/'Adapters').glob('*.gml')):
 if p.name=='scr_mm5_pause_inventory_init_equipment_append.gml':continue
 files[str(p.relative_to(B))]=p.read_bytes()
for p in ['README.md','Integration/INSTALL-GMS14.md','Integration/ACCEPTANCE.md']:
 files[p]= (B/p).read_bytes()
assert len(new)==11 and len(replacements)==11 and len(sprites)==15
allscript={p.stem for p in (ROOT/'Assets').rglob('scr_*.gml')}
for path,data in files.items():
 assert not any(x in path for x in ['.nes','.wav','.work','node_modules'])
 if not path.endswith('.gml'):continue
 s=data.decode();assert not re.search(r'\breturn\s*;',s),path
 assert not re.search(r'\b(variable_(?:global|local|instance)_exists|function|array_create)\s*\(',s),path
 for name in re.findall(r'\b(scr_\w+)\s*\(',s):assert name in allscript,(path,name)
for s in sprites:
 b=files[s['file']];assert struct.unpack('>II',b[16:24])==(s['cell'][0]*s['frames'],s['cell'][1]),s
# Critical source bridges and accepted Buster body preserved;event edits stay bounded.
original=(ROOT/'Assets/Mega Man/MM5/Buster/Charging/Controller/scr_mm5_player_try_buster.gml').read_bytes();assert files['Adapters/scr_mm5_player_try_buster.gml'].endswith(original)
assert files['Adapters/scr_mm5_combat_begin.gml'].count(b'scr_mm5_pause_e_tank_commit')==1
assert b'global.mm1_cutman_e_tank_taken = false;' in files['Adapters/scr_mm5_pause_inventory_init.gml']
assert b'global.mm1_cutman_cleared = false;' in files['Adapters/scr_mm5_pause_inventory_init.gml']
assert b'global.mm5_equipped_weapon = 0;' in files['Adapters/scr_mm5_pause_inventory_init.gml']
assert b'scr_mm1_cutman_victory_player_draw' not in files['Adapters/obj_mm5_megaman_draw_character_block.gml'] # Keep user's EXISTING outer guard,do not duplicate.
manifest={'status':'Incremental source package. GMS1.4 compilation/installed acceptance pending.','baseline':'User-accepted Cut Man victory/full teleport,F8 removed,e4de8b8.','newScripts':new,'replaceScripts':replacements,'sprites':sprites,'files':[{'path':p,'bytes':len(b),'sha256':sha(b)}for p,b in sorted(files.items())]}
manifestBytes=(json.dumps(manifest,indent=2)+'\n').encode();(I/'MANIFEST.json').write_bytes(manifestBytes);files['Integration/MANIFEST.json']=manifestBytes
out=I/'mm1-equipped-rolling-cutter-gms14.zip'
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED)as z:
 for p,b in sorted(files.items()):
  info=zipfile.ZipInfo(p,(2026,11,4,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;z.writestr(info,b)
with zipfile.ZipFile(out)as z:
 assert z.testzip()is None
 for p,b in files.items():assert z.read(p)==b
print('PASS package:',len(files),'files,15 sprites,11 new/11 replacement Scripts;GMS1.4 source guards,exact byte hashes,ZIP integrity. NOT GameMaker compiler/runtime.',out.stat().st_size,'bytes',sha(out.read_bytes()))
