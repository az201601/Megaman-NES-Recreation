# Cut Man boss-room entrance — GMS1.4.1760

**Entrance-only checkpoint.** Requires your working Cut Man stage with eight enemies, final Screw sprites, fixed health, spikes, jumping doors, working stage pause and the latest E-Tank HEALTH-COMMIT-FIX. Back up your project and STOP the runner. Manual resources/code, not a GMX import. Complete ALL steps before compiling.

This replaces only the second door's temporary empty-room control return. Opening art/cue/cadence, walking/jumping entry and scrolling remain unchanged. At its age120 room commit, music changes and control stays held for the researched entrance. New INCOMING shutter closes at world3072,816, not the old outgoing doorway3056,816. No terrain/room/editor changes.

## Start here: fresh installation after working E-Tanks

Use this guide from step1 if you have installed NOTHING since E-Tanks worked. Ignore all earlier boss-package rename/correction messages. This package already removes the disputed sound. **Do not import any appear/scissors/full-tail-check WAV.** The only new Sound resource is `snd_mm1_cutman_boss_fill`; music uses the two PCM Included Files below.

Keep your working E-Tank scripts, inventory initializer and health-commit fix. No E-Tank installation steps need repeating. Install the boss resources below once; no room placements or terrain edits.

## 1 — THREE new Sprites

Folder **Sprites → MM1 → Bosses → Cut Man → Entrance**. Exact resource names:

| Resource | ZIP Art file | Strip settings | Origin |
|---|---|---|---|
| `spr_mm1_cutman_boss_entrance` | `spr_mm1_cutman_boss_entrance_strip2.png` | 2 images; 2/row; each32×40 | X16,Y24 |
| `spr_mm1_cutman_boss_meter` | `spr_mm1_cutman_boss_meter_strip29.png` | 29 images;29/row; each8×56 | X0,Y0 |
| `spr_mm1_cutman_boss_entry_backdrop` | `spr_mm1_cutman_boss_entry_backdrop.png` | ordinary single16×64 image | X0,Y0 |

For strips: Edit Sprite → File → Create from Strip, specified counts/cell dimensions, all offsets/gaps0. Confirm actual subimage dimensions/count. Keep PNG alpha; do not crop/resize/recolour/centre/Remove Background. Cut Man's original white/magenta palette is native to this fight; it was not taken from the stage-select introduction. Two poses are alternating scissors, not a walk animation. The extra transparent vertical padding preserves native alignment. Existing `spr_mm1_cutman_boss_gate_closed` is reused unchanged.

## 2 — ONE new Sound and TWO Included Files

**Sounds → MM1 → Bosses → Cut Man → Entrance**:
- `snd_mm1_cutman_boss_fill` ← matching Audio WAV.

New audio engine; uncompressed WAV, preload, volume1, pitch1, no looping/effects. Existing approved `snd_mm5_gate_open` reused for new shutter closing, no reimport/change. MM1 native door uses24hex, but project deliberately retains the approved MM5 gate cue. The native18 meter take uses accepted2×effects gain. Disputed26 is not played.

**Included Files → MM1 → Bosses → Cut Man → Playback** (organize in IDE, but export paths MUST be root):
- `Playback/mm1_cutman_boss_intro.pcm`
- `Playback/mm1_cutman_boss_loop.pcm`

Export both for Windows directly to game working-directory/root, exact filenames. These are raw mono signed16 little-endian48kHz, NOT Sound resources. Do NOT import them as WAV/rename them. Audio boss_intro/loop WAV files are reference masters, not an additional runtime music path. No Alarm timer/extra audio_play_sound of those music WAVs; the native musical opening must play ONCE, then the main phrase loops through the sample queue. Music gain baked at2.125 (accepted stage2.5×85%); keep runtime volume1.

## 3 — THREE new Scripts

Folder **Scripts → MM1 → Bosses → Cut Man → Entrance**. Create each exact Script resource; paste WHOLE matching file from ZIP Scripts:
1. `scr_mm1_cutman_boss_entrance_start`
2. `scr_mm1_cutman_boss_entrance_step`
3. `scr_mm1_cutman_boss_music_dispose`

Do not put these in object events. `scr_mm1_cutman_boss_entrance_step` is a Script called only by camera Begin Step, not an object Step event.

## 4 — THREE new Objects

### A. Cut Man display actor

Folder **Objects → MM1 → Bosses → Cut Man → Entrance**. Create **`obj_mm1_cutman_boss`**:
- Sprite `spr_mm1_cutman_boss_entrance`; Parent `<no parent>`; Visible ON, Solid OFF, Persistent OFF.
- **Create → Execute Code:** WHOLE `Objects/obj_mm1_cutman_boss_create.gml`.
- **Draw → ordinary Draw:** WHOLE `Objects/obj_mm1_cutman_boss_draw.gml` (hides body until arrival; do NOT omit).
- **Draw → Draw GUI:** WHOLE `Objects/obj_mm1_cutman_boss_draw_gui.gml` (native boss meter, not player HUD).
- NO Step, collisions, combat-enemy parent or room placements. Camera creates it. No AI/contact/hit response in this entrance-only checkpoint.

### B. Incoming boss-room shutter

Folder **Objects → MM1 → Bosses → Cut Man → Entrance → Door**. Create **`obj_mm1_cutman_boss_entry_gate`**:
- Sprite `spr_mm1_cutman_boss_gate_closed`; Parent **existing `obj_mm1_cutman_boss_gate`**; Visible ON, Solid OFF, Persistent OFF. Inherits existing solid-parent collision mask.
- **Create:** WHOLE `Objects/obj_mm1_cutman_boss_entry_gate_create.gml` (contains event_inherited; required).
- **ordinary Draw:** WHOLE `Objects/obj_mm1_cutman_boss_entry_gate_draw.gml`.
- No other events/room placement. Do NOT replace the existing gate object's Create/Draw, move either existing gate, or add room-editor collision.

### C. Boss music queue owner

Folder **Objects → MM1 → Bosses → Cut Man → Audio**. Create **`obj_mm1_cutman_boss_music`**:
- Sprite `<no sprite>`; Parent `<no parent>`; Visible OFF, Solid OFF, Persistent OFF.
- **Create:** WHOLE `Objects/obj_mm1_cutman_boss_music_create.gml`.
- **Asynchronous → Audio Playback:** WHOLE `Objects/obj_mm1_cutman_boss_music_audio_playback.gml`. NOT Audio Recording/modern Playback Ended.
- **Other → Room End:** WHOLE `Objects/obj_mm1_cutman_boss_music_room_end_and_destroy.gml`.
- **Destroy:** same Room End/Destroy file.
- NO Step, Draw or Alarm. No manual instance; created at room commit. Audio-only owner stays active during pause solely to refill its queue. Actor/world remain frozen. Queue freed before its buffers; repeated cleanup safe.

## 5 — APPEND camera initialization and teardown ONCE

Existing **Objects → MM1 → Cut Man → Stage → Camera → `obj_mm1_cutman_camera`** (keep your current folder if different):

1. **Create:** at the very BOTTOM after existing Free Fall/Jumping Gates fields, append WHOLE `Hooks/obj_mm1_cutman_camera_create_append.gml`. First line of executable code `route_boss_intro = false;`. Preserve ALL existing initialization.
2. **Other → Room End:** after existing code append WHOLE `Hooks/obj_mm1_cutman_camera_cleanup_append.gml`.
3. **Destroy:** after existing code append the SAME cleanup hook.

Appends, NOT complete replacements. Do not repeat old Free Fall/door/E-Tank appends. No changes to combat manager/player/stage object's events.

## 6 — REPLACE camera Begin Step, pause Script and pause Draw GUI

1. **`obj_mm1_cutman_camera` → Step → Begin Step:** replace ALL current code with WHOLE `Objects/obj_mm1_cutman_camera_begin_step.gml`. This includes accepted Free Fall, hurt guard and jumping gates; do not retain old code underneath. Not ordinary Step or End Step. Keep End Step/room bounds unchanged.
2. **Scripts → Mega Man → MM5 → Pause Menu → Stage Controller → `scr_mm5_pause_open`:** replace ALL code with matching `Scripts/scr_mm5_pause_open.gml`. Adds intro-only pause guard and excludes only the new audio-only object from frozen gameplay IDs. Does NOT change opening/closing timing.
3. **Objects → Mega Man → MM5 → Pause Menu → Stage Controller → `obj_mm5_pause_menu` → Draw → Draw GUI:** replace ALL with matching `Objects/obj_mm5_pause_menu_draw_gui.gml`. Latest E cached-player-health correction retained; boss GUI meter also cached so it survives pause fade-out/fade-in.

Keep pause Create/BeginStep/Step/restore/E commit/combat_begin from your latest working E-Tank install. Do not reinstall older E files over the health-handoff correction.

## 7 — Test from a stopped/fresh run

- Existing stage music, first door and both walking/jumping entries remain unchanged. Reach second door normally. Camera scroll must match accepted opening. At room commit Mega Man stays on entry platform, camera3072,720; no teleport down to Cut Man's lower floor.
- Stage music stops once and boss musical opening begins once. Native boss meter appears empty at40,25. There is an intentional ~3second wait BEFORE incoming shutter closes; not a stuck transition.
- Relative to room commit: shutter sound183, visible top-down closing strips184/190/196/202; body209 (no added appearance sound), two original scissors poses alternate; first health unit211/every2 through full28 at265; seven fill cues217..265/every8. Native rendering has one-frame OAM latency; GML GUI shows current health directly. Control returns303 (about5seconds after room commit), NOT as soon as meter full.
- Hold/release/repress fire through intro; accepted charge/rearm policy retained. Start during intro must not open pause or interrupt it; hold movement/jump must not move Mega Man during lock. After intro, fresh Start opens normal pause.
- Pause after intro >30seconds, then resume: boss music continues its main phrase, never repeats opening/runs out; boss actor freezes; boss meter appears in cached closing stage; E heal remains real after unpause; player/charge/fire transitions unchanged.
- Leave/restart room: no leaked boss music/duplicate queues; entry starts fresh. Missing PCM should give explicit error, not silent substitute. Both PCM filenames/rate/root export must match.
- Recheck first gate, ladders/falls/pits, spikes, E death-persistence, eight enemies and fixed health. No corresponding gameplay/terrain/audio assets changed.
- **Cut Man stays stationary and cannot take/deal damage yet.** Player control returns for entrance acceptance only; attacks/weapon damage/defeat/reward are the NEXT checkpoint. Do not call the complete boss fight or level finished.

## Evidence / limits

Native entrance probe fresh-boots supplied MM1USA then discloses ONE original checkpoint-reload shortcut (page20/C219), pinned/protected approach to second gate; original Right-only entrance afterward. Not natural full-stage traversal. Native gate/boss/forced-input/health/audio code executes unchanged; seven original-USA byte spans asserted. Native original incoming shutter backdrop and all29 meter states; two complete11-cell Cut Man sprites opaque-pixel matched to original renderer for94 rendered intro updates. ROM/state/disassembly NOT shipped. Source-only art/native timing is not hardware/installed certification.

Native music0D is separately recaptured with only its native driver request after complete silence. Pointer first loop arrival373, returns757/1141; all four pointers match on successive384frame returns. One-time opening + immutable sample queue loop, not frame-timed looping. Full-APU masters include emulator filtering; independent music/SFX mixing is NOT native channel stealing. Sound/loop seams/new original cues still need listening approval. Existing opening MM5 cue deliberately retained for closing; not native-MM1 door audio claim.

606 actual-GML intro ticks (held/released fire), native sprites/meters/timing/spans, music/WAV/PCM, queue ownership/idempotence, camera source-preservation and pause cache/guard tests pass. Limited mocks are NOT GMS1.4 compilation, event ordering, collision, async/GPU/audio or user acceptance. Compile/playtest before accepting. Boss combat not implemented.
