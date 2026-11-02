"""Connected incremental source package for the accepted post-entrance baseline.
No ROMs/native snapshots/rejected music or earlier stage reinstallation included.
"""
from pathlib import Path
import json, hashlib, zipfile, shutil
ROOT=Path(__file__).resolve().parents[2]
BASE=ROOT/'Assets/Bosses/MM1/Cut Man';OUT=BASE/'Integration'
OUT.mkdir(exist_ok=True)
FILES={};scripts=[];sprites=[];sounds=[]
def put(dst,src):FILES[dst]=(ROOT/src).read_bytes() if isinstance(src,str) else src
for group in ['Combat','Victory']:
 for p in sorted((BASE/group/'Scripts').glob('*.gml')):
  put('Scripts/'+p.name,p.read_bytes());scripts.append({'name':p.stem,'action':'replace' if p.stem in ['scr_mm5_combat_end_frame','scr_mm5_combat_shot_step','scr_mm5_combat_die'] else 'new','folder':'Scripts > MM1 > Cut Man > '+group})
put('Scripts/scr_mm1_cutman_weapon_screen_present.gml',(BASE/'Victory/Screen/scr_mm1_cutman_weapon_screen_present.gml').read_bytes());scripts.append({'name':'scr_mm1_cutman_weapon_screen_present','action':'new','folder':'Scripts > MM1 > Cut Man > Victory'})
# Full replacements for the accepted pause and new-game inventory scripts.
pause=(BASE/'Entrance/Scripts/scr_mm5_pause_open.gml').read_bytes()
put('Scripts/scr_mm5_pause_open.gml',b'// Connected victory lock, before accepted pause-open body.\nif (scr_mm1_cutman_victory_busy()) exit;\n'+pause)
inv=(ROOT/'Assets/Combat/MM5/Cut Man E-Tank/Scripts/scr_mm5_pause_inventory_init.gml').read_bytes()
put('Scripts/scr_mm5_pause_inventory_init.gml',inv+b'\n// New-game only; accepted stage-entry false branch exits above.\nglobal.mm1_cutman_cleared = false;\n')
for n in ['scr_mm5_pause_open','scr_mm5_pause_inventory_init']:scripts.append({'name':n,'action':'replace','folder':'Keep existing resource location'})
for name in ['create','draw']:put(f'Objects/obj_mm1_cutman_boss_{name}.gml',(BASE/f'Combat/Objects/obj_mm1_cutman_boss_{name}.gml').read_bytes())
put('Objects/obj_mm1_cutman_boss_room_end_and_destroy.gml',(BASE/'Victory/Hooks/obj_mm1_cutman_boss_room_end_and_destroy.gml').read_bytes())
for p in sorted((BASE/'Victory/Screen/Objects').glob('*.gml')):put('Objects/'+p.name,p.read_bytes())
put('Player/obj_mm5_megaman_create_append.gml',(BASE/'Victory/Hooks/obj_mm5_megaman_create_victory_append.gml').read_bytes())
oldprefix=(ROOT/'Assets/Combat/MM5/Blader Checkpoint/Player/obj_mm5_megaman_step_combat_prefix.gml').read_text();assert oldprefix.count('scr_mm5_combat_begin();')==1
put('Player/obj_mm5_megaman_step_combat_prefix.gml',oldprefix.replace('scr_mm5_combat_begin();','scr_mm5_combat_begin();\nif (scr_mm1_cutman_victory_player_step()) exit;',1).encode())
draw=(ROOT/'Assets/Combat/MM5/Blader Checkpoint/Player/obj_mm5_megaman_draw_combat_replace_body.gml').read_text();assert draw.count('combat_draw = true;')==1
put('Player/obj_mm5_megaman_draw_character_block.gml',draw.replace('combat_draw = true;','combat_draw = true;\nif (scr_mm1_cutman_victory_player_draw()) combat_draw = false;',1).encode())
def sprite(name,file,cell,origin,count):
 p=BASE/file;put('Sprites/'+p.name,p.read_bytes());sprites.append({'name':name,'file':'Sprites/'+p.name,'cell':cell,'origin':origin,'frames':count,'folder':'Sprites > MM1 > Bosses > Cut Man > Combat' if 'combat' in name else 'Sprites > MM1 > Bosses > Cut Man > Victory','settings':'Preserve alpha/padding; no crop/resize/background removal; no collision use'})
sprite('spr_mm1_cutman_combat','Combat/Art/spr_mm1_cutman_combat_strip34.png',[48,64],[24,32],34)
sprite('spr_mm6_boss_defeat','Victory/Art/spr_mm6_boss_defeat_strip6.png',[32,32],[16,16],6)
sprite('spr_mm6_inroom_victory_tiles','Victory/Art/spr_mm6_inroom_victory_tiles_strip62.png',[8,8],[0,0],62)
for name,cell,count in [('spr_mm1_weapon_get_frame',[256,240],1),('spr_mm1_weapon_get_rolling_cutter_megaman',[64,96],1),('spr_mm1_cutter_screen_intro_strip22',[256,240],22),('spr_mm5_cutter_demo_idle',[32,32],1),('spr_mm5_cutter_demo_throw',[40,40],1),('spr_mm5_cutter_demo_idle_left',[32,32],1),('spr_mm5_cutter_demo_throw_left',[40,40],1),('spr_mm1_player_rolling_cutter_demo_left_strip2',[16,16],2)]:sprite(name,'Victory/Screen/'+name+'.png',cell,[0,0],count)
for name,file in [('snd_mm1_cutman_rolling_cutter_throw','Combat/Audio/Approved/snd_mm1_cutman_rolling_cutter_throw.wav'),('snd_mm6_stage_clear','Victory/Audio/Approved/snd_mm6_stage_clear.wav'),('snd_mm6_weapon_acquisition','Victory/Audio/Approved/snd_mm6_weapon_acquisition_review_excerpt.wav'),('snd_mm5_weapon_get','Victory/Audio/Approved/snd_mm5_weapon_get.wav'),('snd_mm6_megaman_teleport_out','Victory/Audio/Approved/snd_mm6_megaman_teleport_out.wav')]:
 p=BASE/file;put('Sounds/'+name+'.wav',p.read_bytes());sounds.append({'name':name,'file':'Sounds/'+name+'.wav','volume':1,'loop':False,'folder':'Sounds > MM1 > Bosses > Cut Man > '+('Combat' if 'throw' in name else 'Victory'),'settings':'Default audio group, uncompressed/non-streamed, non-positional; no independent playback events'})
# Static dependency inventory: require every referenced scr_* to be packaged or
# backed by an existing baseline source file (never invent an absent helper).
import re
all_names={p.stem for p in (ROOT/'Assets').rglob('*.gml')};provided={Path(k).stem for k in FILES if k.startswith('Scripts/')};called=set()
for k,v in FILES.items():
 if k.endswith('.gml'):called.update(re.findall(r'\b(scr_\w+)\s*\(',v.decode()))
missing=called-provided-all_names
assert not missing,missing
baseline=sorted(called-provided)
manifest={'format':1,'status':'Connected incremental source package; GMS1.4.1760 compile/playtest NOT executed. Back up and apply as one update; validate acceptance checklist.','baseline':'Accepted full Cut Man level with E-Tank, post-E entrance, one-column shutter and flashing-wall fix installed; no earlier combat/victory drafts installed.','scripts':scripts,'sprites':sprites,'sounds':sounds,'preexistingScriptDependencies':baseline,'requiredExistingResources':['obj_mm5_megaman','obj_mm5_combat','obj_mm5_pause_state','obj_mm1_cutman_camera','obj_mm1_cutman_boss','obj_mm1_cutman_boss_music','spr_mm1_cutman_boss_entrance','spr_mm5_pause_font','snd_mm6_enemy_hit','rm_mm1_stage_select'],'newObjects':['obj_mm1_cutman_weapon_screen'],'files':[{'path':k,'bytes':len(v),'sha256':hashlib.sha256(v).hexdigest()} for k,v in sorted(FILES.items())],'limitations':['No actual GMS installation/compiler/runtime available in this repository (no .project.gmx).','Rolling Cutter screen demonstration uses fixed native player playback; general equipped-weapon gameplay AI is not part of this package.','Cutter ownership/energy and Cut Man completion persist in the accepted session state, not a new disk-save system.','Existing stage-select room must exist as rm_mm1_stage_select; do not create an empty substitute room.','Stage-select cleared-marker art is not added.']}
# Guide maintained alongside builder, packaged identically.
guide=(OUT/'INSTALL-GMS14.md').read_text().split('<!-- GENERATED RESOURCE TABLES -->')[0]+'<!-- GENERATED RESOURCE TABLES -->\n\n'
guide+='## Exact Script table\n\n| Resource | Action | Folder |\n|---|---|---|\n'
for r in scripts:guide+=f"| `{r['name']}` | {r['action']} | {r['folder']} |\n"
guide+='\n## Exact Sprite table\n\n| Resource | PNG | Frames | Cell | Origin |\n|---|---|---:|---|---|\n'
for r in sprites:guide+=f"| `{r['name']}` | `{r['file']}` | {r['frames']} | {r['cell'][0]}x{r['cell'][1]} | {r['origin'][0]},{r['origin'][1]} |\n"
guide+='\nSprites use the Combat/Victory folders recorded per-resource in MANIFEST.json.\n\n## Exact Sound table\n\n| Resource | WAV | Folder |\n|---|---|---|\n'
for r in sounds:guide+=f"| `{r['name']}` | `{r['file']}` | {r['folder']} |\n"
(OUT/'INSTALL-GMS14.md').write_text(guide)
put('INSTALL-GMS14.md',guide.encode())
put('ACCEPTANCE.md',(OUT/'ACCEPTANCE.md').read_bytes())
manifest['files']=[{'path':k,'bytes':len(v),'sha256':hashlib.sha256(v).hexdigest()} for k,v in sorted(FILES.items())]
put('MANIFEST.json',(json.dumps(manifest,indent=2)+'\n').encode())
(OUT/'MANIFEST.json').write_bytes(FILES['MANIFEST.json'])
with zipfile.ZipFile(OUT/'mm1-cutman-connected-combat-victory-gms14.zip','w',zipfile.ZIP_DEFLATED) as z:
 for name,data in sorted(FILES.items()):
  info=zipfile.ZipInfo(name,(2026,11,2,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;z.writestr(info,data)
print('Package:',len(FILES),'files;',len(scripts),'scripts;',len(sprites),'sprites;',len(sounds),'sounds;',len(baseline),'existing script dependencies')
