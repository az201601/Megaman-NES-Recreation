# MM5 pause-menu sounds — GMS1.4.1760

User chooses original Mega Man5 audio for BOTH opening the pause menu and moving its selection cursor. Recovered from supplied USA ROM, actual Start/Right inputs and original game sound driver, full APU. Not synthesized and not isolated-channel replacement audio. Rendered through JSNES2.1.0, not a claim of Mesen playback/hardware recording.

## Resource import checkpoint

Create resource folders: **Sounds > Mega Man > MM5 > Pause Menu**.

| Sound resource name | Import WAV | Purpose |
| --- | --- | --- |
| snd_mm5_menu_open | snd_mm5_menu_open.wav | Fresh Start opens menu, one-shot |
| snd_mm5_menu_cursor | snd_mm5_menu_cursor.wav | Selection actually changes, one-shot |

Both WAVs48000Hz stereo PCM16, uncompressed/non-streamed, volume1, default audio group. Do not loop them. Preserve original level; no normalization/fades. Open0.3571458333s; cursor0.2636666667s. GitHub file pages: choose raw/download to save WAVs; do not import the HTML page.

No existing sound objects, room events or player events need replacing for this resource checkpoint. These assets do not by themselves make the menu interactive.

## Event wiring reserved for upcoming pause controller

These are GMS1.4-compatible calls, to be placed in the eventual controller, NOT pasted into existing player Step or Draw events now:

- Opening transition (closed -> open), once: `audio_play_sound(snd_mm5_menu_open, 0, false);`
- Successful cursor move: `audio_stop_sound(snd_mm5_menu_cursor); audio_play_sound(snd_mm5_menu_cursor, 0, false);`

Stop/retrigger only this cursor effect on rapid moves, rather than stacking overlapping instances. Do not play on every held-key update, in Draw/Draw GUI, or when selection does not change. Controller must handle fresh press/repeat timing separately. No duplicate call when opening initializes selection. Whether page switching also counts as a movement/confirmation is not decided here. No closing, cancel, tank-use or confirm sound assigned by this checkpoint.

**Do not stop stage music using these scripts' capture procedure.** F0 was used only to obtain uncontaminated recordings, not as an instruction for game integration. Existing stage music and other SFX remain untouched. GMS/menu controls/pause/music behaviour have not been implemented or runtime-tested by this audio work.

## Verification / reproduction

- Sound queue slotsDA/DC..E3: original F0 music-stop command, 150-frame warm-up; final50 frames exactly silent.
- Open: fresh Start requests29hex at captureframe10; no other commands in150-frame take.
- Cursor: actual Start opens menu; its29 sound is allowed to finish, then another150 frames of silence, then fresh Right requests27hex once. Buster icon verified byte/pixel-equivalent to recovered original unselected Buster after movement, proving actual selection changed. No29/opening audio in cursor take.
- Full stereo APU output, PCM16 conversion, no clipping; only PCM-zero silence removed, retained5ms silent margin each side. Output PCM exactly equals source slice. Individual JSON manifests contain requests, peak, trim and timing.

Rebuild (ignored.work snapshots regenerate if absent):

```
npm ci --prefix tools/rom-recovery
mkdir -p tools/rom-recovery/.work
node tools/rom-recovery/mm5-start.mjs
node tools/rom-recovery/mm5-stage.mjs
node tools/rom-recovery/record-menu-open.mjs
node tools/rom-recovery/record-menu-cursor.mjs
```

## Original weapon-confirm/close sound added

User requests native MM5 weapon-confirm sound. New snd_mm5_menu_close.wav:48kHz stereoPCM16,0.5757291667s, original command28hex from freshStart and freshA on Buster. Both inputs recorded independently with byte-identical WAVs. No opening/cursor/music tail; only silence trimmed5ms each side. Source recorder record-menu-close.mjs accepts START or A; both recovery JSON records included. Import as snd_mm5_menu_close in same Sounds folder, uncompressed/nonstreamed, volume1/default group/no loop. StageStep requests once on accepted weapon confirmation; not on cursor/page/empty-tank input. No global music stop in gameplay. This supersedes earlier statement that no close/confirm sound is assigned.
