"""Package manual GMS1.4 sources/resources; verify ZIP identity. No compiled project claim."""
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
root=Path(__file__).resolve().parents[2]
stage=root/'Assets/Mega Man/MM5/Pause Menu/Stage Controller'
files={str(p.relative_to(stage)):p for p in sorted(stage.rglob('*')) if p.is_file()}
files['snd_mm5_menu_close.wav']=root/'Assets/Audio/Mega Man/MM5/Pause Menu/snd_mm5_menu_close.wav'
assert sum(k.endswith('.gml') for k in files)==14
out=stage.parent/'Downloads/mm5-pause-stage-controller-gms14.zip'
with ZipFile(out,'w',ZIP_DEFLATED) as z:
 for name,path in files.items():z.writestr(name,path.read_bytes())
with ZipFile(out) as z:
 assert set(z.namelist())==set(files)
 for name,path in files.items():assert z.read(name)==path.read_bytes(),name
print(f'PASS package{len(files)}entries;14GML + guide + shader2tabs/LUT/policy + originalcloseWAV; byte-identity verified')
