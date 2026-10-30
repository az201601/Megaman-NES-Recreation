"""Generate a power-of-two nearest-NES palette fade LUT; no invented alpha fade."""
from pathlib import Path
import json,sys,math
root=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(root/'tools/rom-recovery/.work/pydeps'))
from PIL import Image
palette=json.loads((root/'tools/rom-recovery/palettes/mesen-0.9.9-default.json').read_text())['colors']
rgb=[tuple(bytes.fromhex(c)) for c in palette]
def faded(i,dim):
 for _ in range(dim):i=i-16 if i>=16 else 15
 return rgb[i]
def cell(c):
 r,g,b=[math.floor(v/255*15+0.5) for v in c]
 return r+16*g+256*b
# Quantized-cell centres: non-native RGB chooses nearest original NES colour.
indices=[min(range(64),key=lambda i:sum((rgb[i][j]-(((k>>(4*j))&15)*17))**2 for j in range(3))) for k in range(4096)]
# Anchor actual native colours; shared cells permitted only with identical fade paths.
anchors={}
for i,c in enumerate(rgb):
 if c==(0,0,0):continue
 if i==48:continue # White alias deliberately specified separately below.
 k=cell(c)
 if k in anchors:assert all(faded(i,d)==faded(anchors[k],d) for d in range(1,5)),(i,anchors[k])
 anchors[k]=i
for k,i in anchors.items():indices[k]=i
im=Image.new('RGBA',(64,512))
for white30 in range(2):
 for dim in range(1,5):
  for k,i in enumerate(indices):
   if i==32 and white30:i=48
   im.putpixel((k%64,(white30*4+dim-1)*64+k//64),(*faded(i,dim),255))
# Every exact source RGB -> its proper index fade, except explicitly selectable white alias.
for i,c in enumerate(rgb):
 for d in range(1,5):
  k=cell(c);w=int(i==48)
  assert im.getpixel((k%64,(w*4+d-1)*64+k//64))[:3]==faded(i,d),(i,d)
out=root/'Assets/Mega Man/MM5/Pause Menu/Stage Controller/Transition Resources';out.mkdir(exist_ok=True)
im.save(out/'spr_mm5_pause_fade_lut.png')
(out/'palette-policy.json').write_text(json.dumps({'source':'Pinned Mesen0.9.9 palette','size':[64,512],'layout':'8 slices64x64; white20 dims1..4 then white30 dims1..4; key=r4+16*g4+256*b4','rgbQuantization':'floor(channel/255*15+0.5)','nativeColours':'All64 source indices verified for every dim, white alias selected explicitly. Black aliases share black. Non-NES colours use nearest palette at cell centre.','stageWhite':'20 canonical, matching known MM5 player/HUD. Flattened scene cannot distinguish20vs30.','menuWhite':'20 default(font/frame);30 selected weapon/tank/upgrade icons (custom convention, not original-layout pixel equivalence).','palette':palette},indent=2)+'\n')
print('PASS64NESindices x4fade levels including explicit20/30white; LUT64x512')
