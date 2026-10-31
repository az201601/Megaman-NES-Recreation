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

## Complete untrimmed download

`snd_mm5_gate_open_complete_untrimmed.wav` is the **entire150-frame capture**:
2.496125seconds,479300bytes. This retains original queue latency, the complete
opening cue and all subsequent silence. Nothing at either end is trimmed.
There are no fades, volume edits, stretches or repeated/stitched effects.

The audible waveform is sample-identical to the earlier0.482333second WAV;
that earlier file removed only silence, not part of the door sound. The longer
file is provided to make the full onset/decay and recording boundaries available.
This is one original MM5 opening command, not opening-plus-closing.
