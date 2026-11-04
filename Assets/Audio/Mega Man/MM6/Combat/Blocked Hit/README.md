# MM6 blocked-hit ding — revised Blaster review

User requested MM6's deflection ding instead of the rejected MM1 closed-shell cue.

`mm6-blocked-hit-balanced-review.wav` is the original MM6USA cue27hex at accepted2xSFX gain,0.095042s,48kHzstereoPCM16. It is NOT cue35 (the already approved successful-enemy-hit sound). That existing file is unchanged.

Identity evidence: original projectile bounce routine negates horizontal speed, sets upwardspeedFC, toggles facing and writes27 to the nativeDC sound mailbox. These instruction spans are byte-checked against the supplied original ROM. Source labels only: refreshing-lemonade/megaman6-disassembly f0763c46fad2bbcb45e4b8a2f759a10ee3c7c421 bank38_3F.asm. Not a claim of a naturally traced armored-enemy encounter.

Recording uses the same fullAPU/defaultstereo/native-mailbox method as accepted35 audio: F0stop, uncaptured35 settling cue,150warmupdates(last50 exactzero), one27 cue,150captureupdates. Trim only leading/trailing zero PCM, keep10ms tail. Review is exactly2x the original-amplitude `mm6-blocked-hit-raw.wav` at every sample. No ramps, filters, normalization, channel muting or synthesized tones. Peak0.3125, no individual clipping. Source/PCM bounds/hashes/verified instructions in recovery.json.

**User approved this MM6 ding. Keep it unchanged.** Blaster firing approval and complete gameplay integration remain pending; do not import or edit gameplay until the complete installer is ready.
