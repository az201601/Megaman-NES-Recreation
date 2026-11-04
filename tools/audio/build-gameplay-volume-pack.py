"""Volume-only listening checkpoint; never overwrites source audio."""
from pathlib import Path
import array, hashlib, io, json, math, wave, zipfile
ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'Assets/Audio/Gameplay Volume Balance'
GAIN = 2

def digest(b): return hashlib.sha256(b).hexdigest()
def stats(a):
    return {'peak': max(map(abs, a))/32768, 'rms': math.sqrt(sum(x*x for x in a)/len(a))/32768}

def build():
    sources = []
    for game in ('MM5', 'MM6'):
        for p in sorted((ROOT / 'Assets/Audio/Mega Man' / game).rglob('snd_*.wav')):
            if 'review' not in p.name.lower() and 'complete_untrimmed' not in p.name:
                sources.append(p)
    charge = ROOT / 'Assets/Audio/Mega Man/MM5/Buster/Charging/Playback'
    sources += [charge / 'mm5_charge_intro.pcm', charge / 'mm5_charge_loop.pcm']
    files, records = {}, []
    for p in sources:
        original = p.read_bytes()
        if p.suffix == '.wav':
            with wave.open(io.BytesIO(original), 'rb') as w:
                params = w.getparams()
                assert params.sampwidth == 2 and params.comptype == 'NONE'
                raw = w.readframes(params.nframes)
        else: raw = original
        samples = array.array('h', raw)
        assert samples.itemsize == 2
        # The build environment is little-endian, as are the PCM source files.
        import sys
        assert sys.byteorder == 'little'
        result = array.array('h', (x * GAIN for x in samples))
        assert max(map(abs,result)) < 32767
        assert all(b == a * GAIN for a,b in zip(samples,result))
        if p.suffix == '.wav':
            stream = io.BytesIO()
            with wave.open(stream,'wb') as w:
                w.setparams(params); w.writeframes(result.tobytes())
            data = stream.getvalue()
            with wave.open(io.BytesIO(data),'rb') as w:
                assert w.getparams() == params
                assert w.readframes(params.nframes) == result.tobytes()
        else: data = result.tobytes()
        name = ('Sounds/' if p.suffix == '.wav' else 'Included Files/') + p.name
        assert name not in files
        files[name] = data
        records.append({'source':str(p.relative_to(ROOT)), 'output':name,
                        'source_sha256':digest(original), 'output_sha256':digest(data),
                        'samples':len(samples),'before':stats(samples),'after':stats(result)})
        assert p.read_bytes() == original
    manifest = {'gain': GAIN, 'gain_db':20*math.log10(GAIN),
                'scope':'MM5/MM6 current gameplay effects and charge PCM; original files unchanged',
                'files':records}
    OUT.mkdir(parents=True,exist_ok=True)
    text = json.dumps(manifest,indent=2)+'\n'
    (OUT/'measurements.json').write_text(text)
    files['measurements.json'] = text.encode()
    files['INSTALL-GMS14.md'] = (OUT/'INSTALL-GMS14.md').read_bytes()
    target = OUT/'Downloads/mm-gameplay-volume-balance-gms14.zip'
    target.parent.mkdir(exist_ok=True)
    with zipfile.ZipFile(target,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
        for name,data in sorted(files.items()):
            entry=zipfile.ZipInfo(name,(2026,11,1,0,0,0)); entry.compress_type=zipfile.ZIP_DEFLATED
            entry.external_attr=0o644<<16; z.writestr(entry,data)
    with zipfile.ZipFile(target) as z:
        assert z.testzip() is None
        assert all(z.read(name)==data for name,data in files.items())
    print(f'PASS: {len(records)} audio files, exact 2x samples, unchanged lengths/formats, no individual clipping.')
    print(f'{target.relative_to(ROOT)}: {target.stat().st_size} bytes SHA256 {digest(target.read_bytes())}')

if __name__ == '__main__': build()
