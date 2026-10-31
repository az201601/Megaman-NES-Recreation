# Revised Blaster firing review — actual encounter

The user rejected the first isolated/center-panned15 preview and original MM1 ding. They requested a firing recapture and MM6's blocked-hit ding instead. **Do not install the earlier review ZIP or either old sound.**

This revision records the actual first Blaster's native AI creating all four bullets in the supplied MM1 USA ROM. Only Cut Man music requests05 are changed to originalFF stop before playback, so the stage music never starts. Stage-select/boss-intro/arrival sounds are allowed to run and finish. PlayerY36, vertical speed/fraction0 and protection100 are controlled, with Right toX760 then released. No shot/sound commands are injected for the recorded effects. This is a controlled encounter, not an unassisted playthrough.

Default JSNES stereo matches our accepted MM5/MM6 SFX captures (the rejected take had centered channels). The new first-shot waveform is different from that rejected take; the earlier source command15 was correct, but identifying a command alone did not establish acceptable recorded output. No claim that one factor alone explains the audible difference.

- `mm1-blaster-fire-live-balanced.wav`: complete first real firing cue,0.190917s including its brief lead-in and10ms silent tail.
- `mm1-blaster-four-shot-burst-live-balanced.wav`: actual four-shot sequence,2.807458s, not repeated/stiched copies. For reference only, not a sound resource to play for each shot.
- `mm1-blaster-fire-live-raw.wav`: original-amplitude capture slice, not the louder gameplay mix.

48kHz/stereoPCM16; preview gain2x (+6.0206dB), no fade/filter/normalization/channel isolation/pitch/time changes. Both tails settle to exactzero. `recovery.json` records originalROM hash, real AI requests and driver dispatch/sample indices, PCM lengths and output hashes. User approval pending.

MM6's new ding review is under `Assets/Audio/Mega Man/MM6/Combat/Blocked Hit/`. Existing approved35 successful-hit audio and all installed game code remain unchanged. This revision is audition only; no resource import or installation until approval.
