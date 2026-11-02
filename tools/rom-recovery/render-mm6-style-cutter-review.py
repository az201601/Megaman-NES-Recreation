"""Approval-only GIF: existing custom design, native MM6 sequence/timing.
Requires probe-mm6-screen-timing.mjs and Pillow. Does not replace approved runtime.
"""
from pathlib import Path
from PIL import Image, ImageEnhance
import json, hashlib, sys
export_runtime = "--runtime-art" in sys.argv
ref_dir=Path(__file__).resolve().parent/".work/mm6-approved-raster"
if export_runtime:ref_dir.mkdir(parents=True,exist_ok=True)
root=Path(__file__).resolve().parents[2]
base=root/'Assets/Bosses/MM1/Cut Man/Victory'
work=root/'tools/rom-recovery/.work/mm6-victory'
timing=json.loads((work/'screen-linked-timing.json').read_text())
path=json.loads((base/'Reference/player-cutter-demo.json').read_text())['path']
frame=Image.open(base/'Screen/spr_mm1_weapon_get_frame.png').convert('RGBA')
portrait=Image.open(base/'Screen/spr_mm1_weapon_get_rolling_cutter_megaman.png').convert('RGBA')
idle=Image.open(base/'Screen/spr_mm5_cutter_demo_idle.png').convert('RGBA')
throw=Image.open(base/'Screen/spr_mm5_cutter_demo_throw.png').convert('RGBA')
cutter=Image.open(base/'Screen/spr_mm1_player_rolling_cutter_demo_strip2.png').convert('RGBA')
font=Image.open(root/'Assets/Mega Man/MM5/Pause Menu/Import Pack/Sprites/spr_mm5_pause_font_strip38.png').convert('RGBA')
alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .'
# Native linked stage0: text204..263(15 characters),hold90,portrait fade20,
# small-player preparation30,fade-in25,wait10,demonstration240,tail90,exitfade20.
# Our21-character text adds24 updates. No Beat part/password/score screens.
text_start=204
text_end=text_start+21*4
fade_start=text_end+90
small_start=fade_start+21
loop_start=small_start+30+25+10
loop_end=loop_start+240
end=loop_end+90+20
assert (text_end,fade_start,small_start,loop_start,loop_end,end)==(288,378,399,464,704,814)
# Verify observed native call boundaries, not just mnemonic-derived timings.
for age,pc in [(17,'bd76'),(42,'bd86'),(106,'bd93'),(204,'bdf0'),(264,'be06'),(354,'be0b'),(375,'be14'),(405,'be66'),(430,'be6f'),(440,'be74'),(680,'be9c')]:
 assert any(e.get('age')==age and e.get('pc')==pc for e in timing['events']), (age,pc)
def text(dst,txt,x,y,color):
 for i,ch in enumerate(txt):
  idx=alphabet.index(ch);glyph=font.crop((idx*8,0,idx*8+8,8));tint=Image.new('RGBA',(8,8),color+(255,));tint.putalpha(glyph.getchannel('A'));dst.alpha_composite(tint,(x+i*8,y))
def native_pose(age):
 age=age//2*2
 p=Image.open(work/f'screen-linked-{age}.png').convert('RGB')
 cx=timing['rows'][age]['x'];bg=p.getpixel((80,80));tile=p.crop((cx-32,72,cx+32,168)).convert('RGBA')
 data=[]
 for r,g,b,a in tile.getdata():
  if (r,g,b)==bg:data.append((0,0,0,0));continue
  # Preserve native pose/skin; only armor/cannon colour families adapted.
  if b>r*1.12 and b>=g:
   v=255 if g>=100 else (102 if b>=130 else 34);r=g=b=v
  elif r>100 and b>g*1.2 and b>60:r=g=b=173
  data.append((r,g,b,a))
 tile.putdata(data)
 return tile,cx,bg
frames=[];throw_ages=[];catch_ages=[];active=None
intro_frames=[];intro_indices=[]
for age in range(end+1):
 canvas=frame.copy()
 if age<17:canvas=Image.new('RGBA',(256,240),(0,0,0,255))
 elif age<42:canvas=ImageEnhance.Brightness(canvas).enhance(min(1,((age-17)//5+1)/5))
 if 17<=age<164:
  tile,cx,bg=native_pose(age)
  # MM6's whole-screen palette flash, applied to our custom colours.
  if 114<=age<164:
   amount=max(bg)/255
   canvas=Image.blend(canvas,Image.new('RGBA',canvas.size,(255,255,255,255)),amount)
  canvas.alpha_composite(tile,(cx-32,72))
 elif 164<=age<small_start:
  # Original source moves the large figure right2px/update for40 updates.
  cx=min(208,128+2*(age-163))
  p=portrait
  if age>=fade_start:p=ImageEnhance.Brightness(p).enhance(max(0,1-((age-fade_start)//5+1)/4))
  canvas.alpha_composite(p,(cx-32,72))
 chars=max(0,min(21,(age-text_start)//4+1)) if age>=text_start else 0
 text(canvas,'YOU GOT'[:min(7,chars)],24,88,(100,176,255))
 text(canvas,'ROLLING CUTTER'[:max(0,chars-7)],24,112,(255,255,255))
 if age>=17:text(canvas,'WEAPON ACQUIRED',68,210,(100,176,255))
 # MM6 replaces the large figure with a small demonstrator. Custom right-pane
 # placement shifted down24px so a leftward Cutter never obscures our title.
 if small_start+30<=age<loop_end:
  if age>=loop_start:
   remaining=240-(age-loop_start)
   if ((remaining+0x24)&63)==0 and active is None:
    active=age;throw_ages.append(age)
  sample=path[age-active] if active is not None and age-active<=71 else None
  if sample and sample['nativeCatch']:catch_ages.append(age);active=None;sample=None
  actor=throw if active is not None and age-active<15 else idle
  actor=actor.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
  ax=208-(actor.width-16)
  if age<small_start+55:
   actor=ImageEnhance.Brightness(actor).enhance(min(1,((age-small_start-30)//5+1)/5))
  canvas.alpha_composite(actor,(ax,128))
  if sample and sample['pose']>=0:
   cell=cutter.crop((sample['pose']*16,0,sample['pose']*16+16,16)).transpose(Image.Transpose.FLIP_LEFT_RIGHT)
   canvas.alpha_composite(cell,(208-sample['dx']-8,144+sample['dy']-7))
 if age>=loop_end+90:
  canvas=ImageEnhance.Brightness(canvas).enhance(max(0,1-((age-loop_end-90)//5+1)/4))
 if age<164 and age%2==0:
  key=canvas.tobytes()
  found=next((i for i,p in enumerate(intro_frames) if p.tobytes()==key),None)
  if found is None:found=len(intro_frames);intro_frames.append(canvas.copy())
  intro_indices.append(found)
 if export_runtime and age%2==0:canvas.save(ref_dir/f"{age//2:03d}.png")
 if age%2==0 or age==end:frames.append(canvas.convert('RGB').resize((768,720),Image.Resampling.NEAREST))
assert throw_ages==[484,612],throw_ages
assert catch_ages==[555,683],catch_ages
out=base/'Screen/custom-rolling-cutter-mm6-sequence-review.gif'
# Alternating30/40ms preserves60Hz elapsed time at GIF centisecond resolution.
durations=[30 if i%3!=2 else 40 for i in range(len(frames))];durations[-1]=900
frames[0].save(out,save_all=True,append_images=frames[1:],duration=durations,loop=0,optimize=False)
report={'status':'Approval-only preview; user requested MM6 animation/sequence with existing custom look. Not installed and not yet approved. Previous runtime unchanged.', 'gif':out.name,'sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'nativeReference':'Continuous MM6 stage0 centre-acquisition/teleport/weapon-screen trace; controlled handoff only before acquisition, no post-handoff game RAM/ROM patches. tools/rom-recovery/probe-mm6-screen-timing.mjs','sequence':{'nativeAssemblyAndFlash':[17,164],'slideRight2pxPerUpdate':[164,204],'typingStart':text_start,'typingEndExclusive':text_end,'letterInterval':4,'portraitFadeStart':fade_start,'largePortraitReplaced':small_start,'demoLoop':[loop_start,loop_end],'attemptsEvery':64,'actualThrows':throw_ages,'nativeCatches':catch_ages,'end':end},'adaptations':['Blue/steel custom frame and approved font/text/grey-white Cutter armour retained.','Original native pre-flash portrait animation geometry extracted from continuous rendered frames; armour families recoloured grey/white.','ROLLING CUTTER14 vs B.ATTACK8 adds6 characters/24updates.','Custom palette fade approximates native luminance transitions; not native palette-bit-exact.','MM6 replaces large portrait with small demonstrator; right-pane small actor lowered24px to keep leftward Cutter below custom name text.','MM6 stage0 shot-phase24hex and240-update loop; native Cutter busy-lock rejects intervening64-update attempts until catch.','No Beat part reward,password or score;90-update tail and20-update exitfade retained.','GIF silent; native MM5 music/original-volume and approved player25 sound are unchanged production requirements.','Approval GIF only; not actual updated GML runtime or final package.']}
approval=base/'Screen/mm6-sequence-approval.json'
if approval.exists():
 approved=json.loads(approval.read_text());assert approved['sha256']==report['sha256'];report['status']='Approved preview; MM6 runtime sequence integration in progress, GMS runtime acceptance pending.';report['userConfirmation']=approved['userConfirmation']
(base/'Reference/mm6-sequence-review.json').write_text(json.dumps(report,indent=2)+'\n')
print(out, out.stat().st_size,'bytes',len(frames),'frames',throw_ages,catch_ages)

import sys
if '--runtime-art' in sys.argv:
 strip=Image.new('RGBA',(256*len(intro_frames),240))
 for i,p in enumerate(intro_frames):strip.paste(p,(i*256,0))
 name=f'spr_mm1_cutter_screen_intro_strip{len(intro_frames)}'
 strip.save(base/'Screen'/f'{name}.png')
 g='// Generated from the exact approved review renderer. Two-update samples.\ncmv_screen_intro = 0;\nswitch (floor(cmv_screen_age / 2))\n{\n'
 for i,k in enumerate(intro_indices):g+=f'    case {i}: cmv_screen_intro = {k}; break;\n'
 (base/'Scripts/scr_mm1_cutman_weapon_screen_intro.gml').write_text(g+'}\n')
 (base/'Reference/mm6-screen-runtime-art.json').write_text(json.dumps({'sprite':name,'frames':len(intro_frames),'cell':[256,240],'origin':[0,0],'indices':intro_indices,'sha256':hashlib.sha256((base/'Screen'/f'{name}.png').read_bytes()).hexdigest(),'method':'Deduplicated initial0..163 two-update rasters from the approved review generator; character assembly/flash only, no audio or clocks. After164 the runtime draws individual sprites, original font and native Cutter samples.'},indent=2)+'\n')
 print('Runtime intro',name,len(intro_frames))
