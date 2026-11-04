> **Rejected/superseded preview:** user rejected both initial cues. Use `Review V2/` for the live MM1 firing recapture and `Assets/Audio/Mega Man/MM6/Combat/Blocked Hit/` for the requested MM6 ding. Do not install the old review ZIP.

# MM1 Blaster fire and closed-shell ding — review

Original supplied MM1 USA ROM, JSNES2.1.0 full APU. This is an audio-review checkpoint, **not installed Blaster gameplay**.

| Purpose | Original command | Balanced preview | Duration |
|---|---|---|---|
| Each cannon bullet firing |15hex|`Review/snd_mm1_blaster_fire_balanced.wav`|0.132896s|
| Buster blocked by closed shell |1Dhex|`Review/snd_mm1_blaster_blocked_balanced.wav`|0.085458s|

Both are48kHz/stereo/PCM16. Channel positions are centered, matching the established MM1 music capture. Review audio uses2x sample-amplitude gain (+6.0206dB), matching the accepted gameplay-volume adjustment; no per-effect normalization/compression/limiting. Peaks0.48157/0.49615, no individual clipping. Playback over music/other effects still requires runner testing.

## Evidence

- `Assets/Enemies/MM1/Blaster/Reference/native-blaster-assets.json` records actual firing15 requests from the native AI and driver receipt.
- A real B-button shot at the closed cannon invokes its native blocked-hit helper and changes the queued generic hit request to1D. Enemy HP remains20. The open-state trial allows a normal shot to kill it. Player positioning/protection are controlled; hit flags/enemy HP are not patched.
- Isolated recording is a separate controlled native-driver cue invocation, not a natural encounter recording. Fresh original-game boot replaces pre-capture scene sound requests with original FF stop commands before init. FF/FE queue startup and150warmupupdates yield exactly zero PCM before each cue. One cue is then queued at the native dispatch; all original APU channels are retained. No guessed waveform or synthesis.
- The root `snd_mm1_*.wav` files are exact trimmed raw capture slices at original amplitude, **not intended for import over the accepted louder mix**. Raw full takes are ignored scratch files.

## Small export-tail treatment

JSNES's integer DC-blocking filter settles to a constant+1023PCM tail for the ding (the fire cue settles tozero). The raw ding retains that exact captured tail. The balanced review copy ramps **only the final10ms of that already-constant tail** tozero to avoid a file-end click. The original audible effect is not faded or time-stretched. This numerical/export treatment is disclosed rather than calling the ding file silence-only trimmed. All samples before that tail are exactly raw×2.

`recovery.json` records exact sample bounds, lengths, hashes, commands, peaks and tail treatment. User audition approval pending. Do not create resources or alter game code yet; the later complete Blaster installer will supply exact resource names and event hookups. Do not use the raw source WAVs in place of the balanced previews.
