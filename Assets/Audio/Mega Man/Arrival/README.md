# Mega Man arrival effect

Resource: Sounds > Mega Man > Arrival > `snd_mm1_megaman_arrival`.

Import WAV as Uncompressed, mono44100Hz, volume1,pitch1,centre pan. One-shot. Do not loop. No READY beep or invented extra landing sound is included.

Captured from the supplied USA ROM with JSNES2.1.0. During this capture only, sound command5 (stage music) is suppressed by returning from the sound-request entry at CPU $C477 when that request is received. Other commands and the game/arrival timeline continue. The ROM file on disk is not modified. All five emulator channels are explicitly centred. The earlier introduction audio stops before the arrival; silent pre-effect samples were checked.

The arrival requests sound32 at confirmation-relative frame614. The sound engine produces audible output from617; the sound is associated with materialisation, not a new beep when READY first appears. Export includes617..630, preserving the natural decay. Each output sample has the same fixed gain2.5 used for the corrected stage capture.32sample endpoint ramps reduce file-boundary clicks.

WAV: mono signed16bit,44100Hz,10273samples,0.232948seconds, peak approximately0.448, no clipping. These are file-level checks, not a successful GMS runtime test.

Do not bake the effect into the reusable music loop. Also do not assume summing it over full mixed music reproduces original channel stealing. The current stage queue is deliberately left unchanged in this asset pass; original channel replacement and audiovisual alignment must be addressed when implementing the arrival playback, rather than silently claiming fidelity with a generic overlay.

Graphics, import settings and measured timeline are in `Assets/Mega Man/Arrival/README.md` and `arrival-timeline.csv`. The recreation intentionally omits score/points visuals and sounds.
