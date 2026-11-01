"""Deterministic minimal add-on for accepted boss entrance. No other reinstall."""
from pathlib import Path
import hashlib,json,zipfile
base=Path(__file__).resolve().parents[2]/'Assets/Bosses/MM1/Cut Man/Entrance'
names=['FLASH-INSTALL-GMS14.md','Art/spr_mm1_cutman_boss_room_flash.png','Objects/obj_mm1_cutman_boss_room_flash_create.gml','Objects/obj_mm1_cutman_boss_room_flash_draw.gml','Scripts/scr_mm1_cutman_boss_entrance_start.gml','Reference/native-room-flash.json']
files={n:(base/n).read_bytes() for n in names}
manifest={'scope':'Missing native grey-wall palette2 flash only. Add1sprite/1object(Create+ordinaryDraw); replace1existingentrance-startScript. Preserve accepted one-column shutter, entrance timing, E/pause/audio. NOT installed GMS acceptance.','files':[{'path':n,'bytes':len(p),'sha256':hashlib.sha256(p).hexdigest()}for n,p in sorted(files.items())]}
files['FLASH-PACKAGE-MANIFEST.json']=(json.dumps(manifest,indent=2)+'\n').encode()
out=base/'Downloads/mm1-cutman-room-flash-fix-gms14.zip';out.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED)as z:
 for n,p in sorted(files.items()):
  i=zipfile.ZipInfo(n,(2026,11,2,0,0,0));i.compress_type=zipfile.ZIP_DEFLATED;i.external_attr=0o100644<<16;z.writestr(i,p)
with zipfile.ZipFile(out)as z:
 assert z.testzip() is None
 for n,p in files.items():assert z.read(n)==p
print('PASS',len(files),'files',out.stat().st_size,'bytes',hashlib.sha256(out.read_bytes()).hexdigest())
