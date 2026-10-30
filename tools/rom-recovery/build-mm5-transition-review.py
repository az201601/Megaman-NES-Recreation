# Builds reference GIFs from untouched native-size ROM frame captures.
from pathlib import Path
import sys,json
r=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(r/'tools/rom-recovery/.work/pydeps'))
from PIL import Image
work=r/'tools/rom-recovery/.work/mm5-menu-transitions';out=r/'docs/pause-menu-reference/transitions';out.mkdir(parents=True,exist_ok=True)
colours=json.loads((r/'tools/rom-recovery/palettes/mesen-0.9.9-default.json').read_text())['colors']
palette=Image.new('P',(1,1));rgb=[]
for c in colours:rgb.extend(bytes.fromhex(c))
palette.putpalette(rgb+[0]*(768-len(rgb)))
for mode in ['open','close']:
 # Holds at either side for inspection; only original captured frames inside transition.
 ids=[0]*30+list(range(1,45))+[120]*45
 frames=[]
 for i in ids:
  frame=Image.open(work/f'{mode}-{i:03d}.png').convert('RGB')
  p=frame.quantize(palette=palette,dither=Image.Dither.NONE)
  assert p.convert('RGB').tobytes()==frame.tobytes(),'No GIF colour approximation permitted'
  frames.append(p)
 durations=[10 if i%3==0 else 20 for i in range(len(frames))]
 frames[0].save(out/f'mm5-menu-{mode}-reference.gif',save_all=True,append_images=frames[1:],duration=durations,loop=0,optimize=False,disposal=1)
 # A few exact native keyframes for source audit, not all transient working captures.
 for i in [0,2,6,10,14,23,24,27,31,35]:
  (out/f'{mode}-{i:02d}.png').write_bytes((work/f'{mode}-{i:03d}.png').read_bytes())
(out/'native-transition-trace.json').write_bytes((work/'trace.json').read_bytes())
(out/'native-input-probes.json').write_bytes((work/'input-probes.json').read_bytes())
print('PASS: exact-palette native GIFs with endpoint holds,20keyframes,raw timing/input records')
