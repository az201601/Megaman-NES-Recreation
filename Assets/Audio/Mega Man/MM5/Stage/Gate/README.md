# MM5 gate-opening cue

`snd_mm5_gate_open.wav`: original MM5 USA sound command **$25**, full native APU
output recorded by JSNES at48kHz/stereo/16-bit PCM. Duration0.482333s,92652bytes.
No channels muted, no normalization, no synthesized replacement, no preceding shot.
Music is stopped through the native F0 queue command; the pre-capture tail is exactly
silent. Only leading/trailing quantized PCM silence is trimmed, retaining10ms tail.

This is a controlled native sound-queue extraction, **not** a natural MM5 gate
playthrough. Gate identity is supported by the verified gate-before-horizontal-scroll
caller and opening/paired-shutter byte spans in `recovery.json`.

User explicitly selected MM5's cue while retaining MM1's gate layout and passage.
The WAV is ready; gameplay playback integration and installation instructions are
still pending. Do not replace the accepted charge/audio manager or add this sound to
its PCM buffers. No new gate GML package is available in this research checkpoint.
