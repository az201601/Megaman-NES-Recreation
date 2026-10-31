# MM6 successful enemy-hit sound — audio checkpoint

User requested MM6's impact sound for normal AND charged buster shots in the MM1/
MM5 hybrid. Existing MM5 firing, charging and release sounds stay unchanged.

## Downloads

- **`snd_mm6_enemy_hit_complete_untrimmed.wav`**: entire150-frame capture,
  2.496292seconds,48kHz/stereo/16bitPCM, including original onset latency and silence
  after the complete cue. No cuts, fades, normalization or repeated/stitched sounds.
- `snd_mm6_enemy_hit.wav`: identical audible samples; removes only leading/trailing
  quantized PCM silence, with10ms silent tail.0.403063seconds. No audible portion cut.

The longer duration is mostly silence, not a stretched sound. This checkpoint is
for reviewing/importing the sound; **no Blader gameplay/combat code is installed**.

## Identity verified in original MM6 USA ROM

Sound command **$35** is queued in accepted enemy-damage handlers immediately before
HP subtraction. Four relevant supplied-ROM byte spans match the disassembly at
refreshing-lemonade/megaman6-disassembly commit
`f0763c46fad2bbcb45e4b8a2f759a10ee3c7c421`, `bank38_3F.asm`.

Natural boot and stage entry, then Right/periodic fresh B and jump inputs, produce
normal hits with pending11hex (17decimal)/damage1 and command35. An independent natural branch
holds B fromframe1 and releases at120: a fully charged hit at126 has pending13hex,
damage3, enemy storedHP5, followed by storedHP2 at147; it requests the same35 cue.
Evidence JSON files
retain the numeric values as decimal. No shot power, player position or enemy HP
patches are used in these identity traces. Some later command35 events in the
trace have zero damage from a different interaction; do not label every event a
successful buster hit. The positive-damage cases above are the chosen evidence.

MM6 also queues35 on lethal damage paths; it is not claimed to be exclusive to
nonlethal hits. It is not identified from a guess at sound numbers or an unrelated
wall bounce. Blader shot response and death behaviour still need integration.

## Isolated recording method

Original MM6 ROM +JSNES2.1.0 full APU output. A stage snapshot with neutral inputs;
native `$DC` mailbox `$F0` stops music. JSNES retains a constant DC residual after
that stop in this state. Rather than filtering/subtracting or muting channels,
an **uncaptured** original35 cue is allowed to finish. Its native channel release
settles the output.150frames of preparation includes50final frames of **exact zero**
samples. Only then is35 queued again and the complete150-frame recording started.

The preparation cue is NOT in either downloadable WAV. The captured take contains
only one consumed command35, no music/firing/charging, and more than one second of
exact PCM silence after the effect finishes. No APU channel isolation, driver patch,
volume processing or invented sound. This is controlled isolated extraction, NOT
live-hit audio; independent natural hit traces establish its identity.

## Optional resource import — no playback code yet

Folder **Sounds > MM6 > Combat > Enemy Hits**.
Create exactly **`snd_mm6_enemy_hit`** and import the complete untrimmed WAV (or the
sample-identical silence-trimmed copy for shorter resource duration).
Use a normal built-in effect, uncompressed/in-memory, Default audio group, stereo,
48kHz, volume1, no loop/pitch changes. No Included Files or charge PCM buffers.
Do NOT change the accepted audio manager, music, firing/charge sounds, queue,
Async Audio Playback event or alarms. Merely importing this does not connect hits.

## Reproducibility

Tools under `tools/rom-recovery/`:
- `probe-mm6-enemy-hit.mjs`: natural normal-shot evidence and stage snapshot.
- `probe-mm6-charged-hit.mjs`: five natural held-B/release timing branches.
- `record-mm6-enemy-hit-sfx.mjs`: byte checks, native stop/preparation, isolated WAVs.
- `test-mm6-enemy-hit-sfx.mjs`: evidence, bytes, silence and PCM/SHA integrity checks.

Use the supplied local ROM; no ROM/snapshot is distributed. This audio checkpoint
makes no GMS compiler/runtime, Blader spawning, damage/recoil or combat claim.
