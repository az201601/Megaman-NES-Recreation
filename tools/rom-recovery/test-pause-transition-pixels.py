"""Software mirror of actual shader LUT against captured original pixels; not GPU/GMS test."""
from pathlib import Path
import sys,json
root=Path(__file__).resolve().parents[2];sys.path.insert(0,str(root/'tools/rom-recovery/.work/pydeps'))
from PIL import Image
work=root/'tools/rom-recovery/.work/mm5-menu-transitions'
lut=Image.open(root/'Assets/Mega Man/MM5/Pause Menu/Stage Controller/Transition Resources/spr_mm5_pause_fade_lut.png').convert('RGB')
def fade(c,d,w=0):
 r,g,b=[int(v/255*15+0.5) for v in c];key=r+16*g+256*b
 return lut.getpixel((key%64,(d-1+w*4)*64+key//64))
for phase in ['open','close']:
 src=list(Image.open(work/f'{phase}-000.png').convert('RGB').getdata())
 first=list(Image.open(work/f'{phase}-002.png').convert('RGB').getdata())
 # Native menu uses both white20 and30. Labels derived from first step only,
 # then second/third steps independently verified with SAME labels.
 white30=[int(c==(255,254,255) and f==(255,254,255)) for c,f in zip(src,first)]
 for d,frame in [(1,2),(2,6),(3,10),(4,14)]:
  native=list(Image.open(work/f'{phase}-{frame:03}.png').convert('RGB').getdata())
  rendered=[fade(c,d,w) for c,w in zip(src,white30)]
  wrong=sum(a!=b for a,b in zip(rendered,native))
  assert wrong==0,(phase,d,wrong)
 print(f'PASS {phase}: LUT reproduces original outgoing frames2/6/10/14 pixel-for-pixel, labeled white aliases; NOT GMS GPU execution')
for phase,start in [('open',24),('close',23)]:
 src=list(Image.open(work/f'{phase}-035.png').convert('RGB').getdata())
 light=list(Image.open(work/f'{phase}-031.png').convert('RGB').getdata())
 white30=[int(c==(255,254,255) and f==(255,254,255)) for c,f in zip(src,light)]
 for d,frame in [(3,start),(2,27),(1,31)]:
  native=list(Image.open(work/f'{phase}-{frame:03}.png').convert('RGB').getdata())
  assert sum(fade(c,d,w)!=n for c,w,n in zip(src,white30,native))==0,(phase,d)
 print(f'PASS {phase}: original incoming palette pixels at{start}/27/31 reproduced')
