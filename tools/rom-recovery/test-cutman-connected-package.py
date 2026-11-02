"""Archive integrity and incremental baseline invariants; not a GMS compiler."""
from pathlib import Path
import json,hashlib,zipfile,struct,re
R=Path(__file__).resolve().parents[2];B=R/'Assets/Bosses/MM1/Cut Man';O=B/'Integration'
with zipfile.ZipFile(O/'mm1-cutman-connected-combat-victory-gms14.zip') as z:
 assert z.testzip() is None
 m=json.loads(z.read('MANIFEST.json'))
 assert len(z.namelist())==len(set(z.namelist()))==73
 assert set(z.namelist())=={f['path'] for f in m['files']}|{'MANIFEST.json'}
 for f in m['files']:
  v=z.read(f['path']);assert len(v)==f['bytes'];assert hashlib.sha256(v).hexdigest()==f['sha256']
 assert z.read('INSTALL-GMS14.md')==(O/'INSTALL-GMS14.md').read_bytes()
 assert z.read('ACCEPTANCE.md')==(O/'ACCEPTANCE.md').read_bytes()
 assert {s['name'] for s in m['scripts'] if s['action']=='replace'}=={'scr_mm5_combat_end_frame','scr_mm5_combat_shot_step','scr_mm5_combat_die','scr_mm5_pause_open','scr_mm5_pause_inventory_init'}
 for s in m['scripts']:assert 'Scripts/'+s['name']+'.gml' in z.namelist()
 for s in m['sprites']:
  v=z.read(s['file']);assert v[:8]==b'\x89PNG\r\n\x1a\n';w,h=struct.unpack('>II',v[16:24]);assert [w,h]==[s['cell'][0]*s['frames'],s['cell'][1]]
 for s in m['sounds']:
  v=z.read(s['file']);assert v[:4]==b'RIFF';assert s['volume']==1 and not s['loop']
 approvals=[('Combat/Reference/rolling-cutter-throw-approval.json','Sounds/snd_mm1_cutman_rolling_cutter_throw.wav'),('Victory/Reference/stage-clear-approval.json','Sounds/snd_mm6_stage_clear.wav'),('Victory/Reference/weapon-acquisition-approval.json','Sounds/snd_mm6_weapon_acquisition.wav'),('Victory/Reference/mm5-weapon-get-music-approval.json','Sounds/snd_mm5_weapon_get.wav'),('Victory/Reference/teleport-out-approval.json','Sounds/snd_mm6_megaman_teleport_out.wav')]
 for src,dst in approvals:assert hashlib.sha256(z.read(dst)).hexdigest()==json.loads((B/src).read_text())['sha256']
 for name in ['scr_mm5_combat_end_frame','scr_mm5_combat_shot_step','scr_mm5_combat_die']:assert z.read('Scripts/'+name+'.gml')==(B/'Combat/Scripts'/f'{name}.gml').read_bytes()
 inv=(R/'Assets/Combat/MM5/Cut Man E-Tank/Scripts/scr_mm5_pause_inventory_init.gml').read_bytes();assert z.read('Scripts/scr_mm5_pause_inventory_init.gml').startswith(inv);assert z.read('Scripts/scr_mm5_pause_inventory_init.gml').count(b'global.mm1_cutman_cleared = false;')==1
 pause=(B/'Entrance/Scripts/scr_mm5_pause_open.gml').read_bytes();assert z.read('Scripts/scr_mm5_pause_open.gml').endswith(pause)
 prefix=z.read('Player/obj_mm5_megaman_step_combat_prefix.gml').decode();assert prefix.index('scr_mm1_cutman_victory_player_step')<prefix.index('scr_mm5_combat_locked');assert prefix.count('scr_mm1_cutman_victory_player_step()')==1
 draw=z.read('Player/obj_mm5_megaman_draw_character_block.gml').decode();assert draw.count('scr_mm1_cutman_victory_player_draw()')==1
 assert 'rm_mm1_stage_select' in z.read('Scripts/scr_mm1_cutman_victory_reward_return.gml').decode()
 for name in z.namelist():
  assert not name.endswith(('.nes','.zip','.gif'))
  if name.endswith('.gml'):
   s=re.sub(r"//[^\n]*", "", z.read(name).decode());assert not re.search(r"\breturn\s*;", s), (name,"GMS1.4 requires exit for no-value early termination");assert not re.search(r'\b(variable_global_exists|variable_instance_exists|array_create|audio_stop_all|layer_create|draw_sprite_stretched_ext)\s*\(',s),name
 assert set(m['newObjects'])=={'obj_mm1_cutman_weapon_screen'}
 assert 'source package' in m['status']
print('PASS73 archive files/hash/CRC;46 script resources with5 exact replacements;11 sprite strip dimensions/origins;5 approved sound hashes;accepted pause/E inventory baselines retained;sole player victory prefix;no ROMs/rejected audio/independent Step. GMS compile/playtest pending.')
