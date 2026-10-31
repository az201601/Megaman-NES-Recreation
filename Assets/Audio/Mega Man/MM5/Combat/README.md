# Original MM5 combat/refill cues — research assets

- `snd_mm5_megaman_hurt.wav`: native command1C, identified at bank1C832C.
- `snd_mm5_health_refill.wav`: native command26, identified at bank1DAEEA and
  independently in both small/large original health collection traces.
- `*_complete_untrimmed.wav`: entire150-frame native-queue recording, retained
  for integrity/research. Use silence-trimmed files for eventual gameplay import.

Supplied USA ROM, JSNES2.1.0 full APU48kHz stereo16bit. F0 stop then150-frame warmup;
last50 warmup frames asserted exactly silent. Each take queues just one native cue,
asserts no unrelated native sound requests and captures150 frames until more than
one second of exact PCM silence follows. Trim only leading/trailing silence, retaining
10ms silent tail. Trimmed PCM is compared sample-for-sample with the complete take.
No normalization, filters, channel muting, fades, synthesis or stitched sounds.

Refill is **not one sound per pickup**: original native traces request26 for every
added bar, four updates apart, and hold the world through the final four-update wait.
Do not let multiple independent refill WAV voices overlap; restart only the refill
voice. The actual audio/controller connection remains unfinished. MM6 enemy-hit35
remains the approved impact cue, and MM5 firing/charging/release files are unchanged.

`recovery.json` records ROM byte spans, silence bounds, file durations and SHA256.
Reproduce with `node tools/rom-recovery/record-mm5-combat-sfx.mjs` after the normal
MM5 start/stage snapshot sequence. No GMS resource/event changes installed yet.
