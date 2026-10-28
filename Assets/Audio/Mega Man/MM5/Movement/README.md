# MM5 landing sound

`snd_mm5_megaman_land.wav`: mono signed PCM16, 44100 Hz, 7339 samples (~0.1664 s). Source is the supplied Mega Man 5 USA ROM's ordinary landing SFX request $1B, recorded during a Napalm Man jump. No ordinary jump-launch request occurred in the observed runs.

Reproduce: `tools/rom-recovery/extract-landing.mjs`, after generating mm5-stage.json. It forwards the observed sound-driver slot X=0 noise-register writes into a separate JSNES APU; music slot X=40 writes are excluded. The export includes the observed queue-to-audibility delay, a small tail, fixed gain 2.5, and a 64-sample end fade. This is an isolated emulator render, not hardware capture. The separate renderer's noise phase is not guaranteed to equal the original music-running APU's phase.

GMS1.4 resource folder: Sounds > Mega Man > MM5 > Movement. Resource: snd_mm5_megaman_land. Play nonlooping once on a downward landing (already in the supplied Step event). Do not play at room creation or every supported update.

The current hybrid's MM1 stage music remains unchanged. This standalone sample does not emulate NES music-channel stealing; do not describe the combined GMS music/SFX mix as hardware-identical.
