# Approved MM5 arrival sound — GMS1.4.1760

User confirmed "sound is correct" for mm5-arrival-review.wav. snd_mm5_megaman_arrival.wav is a byte-identical copy, no further processing. Full original APU, original F0 music stop, request2D at ground contact; no synthesized/channel-isolated replacement.48000Hz stereo PCM16,0.1853958333seconds, silence-only trim with5ms padding.

Create Sounds > Mega Man > MM5 > Arrival resource folder. Create Sound resource snd_mm5_megaman_arrival and load matching .wav. Use uncompressed/non-streamed, volume1, default audio group. One-shot; no loop/playback calls yet. Keep stage music, landing and buster sounds unchanged.

Resource checkpoint only: no player/room/event changes. READY and arrival Sprite import confirmation still pending; user confirmed sound, not Sprite installation. Combined startup controller not delivered/installed yet.

SHA256: ad246c9731a6bef859533a94800beb3f2e05a279526cba1ce516509fed2c8904
