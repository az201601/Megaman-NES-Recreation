"""Trim silence only from the direct recording approved by the user.
Run after record-jump-sfx.mjs. No gain, resampling, fades, or channel conversion.
"""
import hashlib
from pathlib import Path
import struct
import sys
import wave

root = Path(__file__).resolve().parents[2]
source = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('/home/user/mm5-jump-game-audio-no-music.wav')
target = root / 'Assets/Audio/Mega Man/MM5/Movement/snd_mm5_megaman_land.wav'
with wave.open(str(source), 'rb') as w:
    channels, width, rate = w.getnchannels(), w.getsampwidth(), w.getframerate()
    assert (channels, width, rate) == (2, 2, 48000)
    pcm = w.readframes(w.getnframes())
values = struct.unpack('<' + 'h' * (len(pcm) // 2), pcm)
active = [i for i in range(len(values) // channels)
          if any(values[i * channels + c] != 0 for c in range(channels))]
assert active, 'Source recording is silent'
padding = rate // 200  # 5 ms of unchanged source silence at each end.
start = max(0, active[0] - padding)
end = min(len(values) // channels, active[-1] + 1 + padding)
trimmed = pcm[start * channels * width:end * channels * width]
target.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(target), 'wb') as w:
    w.setnchannels(channels)
    w.setsampwidth(width)
    w.setframerate(rate)
    w.writeframes(trimmed)
with wave.open(str(target), 'rb') as w:
    assert w.readframes(w.getnframes()) == trimmed
print(f'Source SHA256: {hashlib.sha256(source.read_bytes()).hexdigest()}')
print(f'Copied source frames [{start}, {end}): {len(trimmed) // 4} frames, {(end-start)/rate:.6f}s')
print('PCM bytes match source slice exactly; no volume, pitch, channel, or fade changes.')
