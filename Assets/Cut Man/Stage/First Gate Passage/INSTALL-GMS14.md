# First gate opening and corridor — GMS1.4.1760

Upgrade from your **working Eleventh Ladder Transition**. Stop the game and back up
the project first. This installs the first gate opening/automatic passage and the
three-screen corridor. The far-right second gate remains closed; no enemies/combat.

**Room width changes2304→3072 only. No vertical shift.** All resources and instances
remain scripted. Do not place additional gates, blocks, collision or tiles manually.

## 1. Create TWO new Sprite resources

Folder: **Sprites > MM1 > Cut Man > Stage > Doors**.

### `spr_mm1_cutman_boss_gate_open_backdrop`

Load `spr_mm1_cutman_boss_gate_open_backdrop.png`, **32×64**, one subimage, origin0,0.
This recovered native opening backdrop looks plain cyan; it is intentional, not a
missing image. Keep alpha/colours unchanged, Remove Background OFF, smoothing OFF.
No object uses it as a collision mask.

### `spr_mm1_cutman_second_gate_closed`

Load `spr_mm1_cutman_second_gate_closed.png`, **16×64**, one subimage, origin0,0.
Collision mask: Rectangle, precise OFF, manual bounds **left0/right15/top0/bottom63**.
Keep alpha/colours unchanged, Remove Background OFF, smoothing OFF.

Keep your original **`spr_mm1_cutman_boss_gate_closed`** unchanged:32×64, origin0,0,
full rectangle0..31/0..63. No animation-strip import or replacement of that sprite.

## 2. Create ONE Sound resource

Folder: **Sounds > MM5 > Stage > Doors**.

Resource name: **`snd_mm5_gate_open`**.

Import **`snd_mm5_gate_open_complete_untrimmed.wav`** from this package. Although the
filename is longer, name the GameMaker Sound resource exactly `snd_mm5_gate_open`.
This is your approved complete MM5 recording, including its silent tail.

Use a normal built-in sound: **not streamed/uncompressed in memory**, sound effect,
Default audio group, stereo,48kHz, volume1. No looping, fades, pitch/volume edits or
positional3D effects. Use the new audio system already used by the project.
Do NOT put it into Included Files or any charge PCM buffer/queue. Do NOT edit the
working audio manager, paths, music, Async Audio Playback event or alarms.
The camera calls `audio_play_sound` once at the start of opening and owns that voice.

## 3. Update the EXISTING Background atlas — mandatory

**Backgrounds > MM1 > Cut Man > Stage > `bg_mm1_cutman_ladder_route_tileset`**.

Replace its image using THIS package's PNG with the same name. Still **128×64**,
now **29 populated16×16 tiles**. Old28 indices and pixels are retained; a native
black corridor tile is appended. Do not skip the update because dimensions match.
Tiles16×16, offsets/separations0, Remove Background OFF, smoothing OFF, alpha intact.
Reference panoramas are NOT resources or room backgrounds to import.
Keep the room's existing cyan background colour unchanged.

## 4. Update the EXISTING gate object — two events

**Objects > MM1 > Cut Man > Stage > Doors > `obj_mm1_cutman_boss_gate`**.

Keep Sprite `spr_mm1_cutman_boss_gate_closed`, Parent **`obj_stage_solid`**,
Visible ON, Solid OFF, Persistent OFF. Do not create a second gate Object resource.

- Replace the ENTIRE **Create** code with `obj_mm1_cutman_boss_gate_create.gml`.
- Add a normal **Draw** event, Execute Code: `obj_mm1_cutman_boss_gate_draw.gml`.
  If a normal Draw event already exists, replace its entire code. Not Draw GUI.

The Draw event removes four bottom-up strips over the recovered opening backdrop.
The camera moves the player during passage; the original closed collision mask is
retained behind the separate native one-way return boundary. Do not add another
invisible blocker behind the first gate. The second scripted gate uses this same
Object with its own16×64 sprite/mask assigned by the features script.
No Step, Collision or audio event is needed on the gate.

## 5. Scripts — create ONE, replace FIVE

Existing folder: **Scripts > Cut Man > Stage > Ladder Route** (keep existing names).
New script may be placed in **Scripts > Cut Man > Stage > Doors**.

Create **`scr_mm1_cutman_gate_start`**, paste all matching `.gml`.

Replace the ENTIRE contents of each existing Script:
1. `scr_mm1_cutman_ladder_route_tiles`
2. `scr_mm1_cutman_ladder_route_collision`
3. `scr_mm1_cutman_ladder_route_blocks` (same17 blocks, included for a matched set)
4. `scr_mm1_cutman_ladder_route_features`
5. **`scr_mm1_cutman_scroll_start`**

No appended code or suffixed duplicates. The matching start/camera handshake is now
**1201**, replacing1101. The new gate script also checks this, so a stale start script
cannot silently use the wrong transition.

The existing stage Create already invokes the four geometry/features scripts once.
**Do not replace Stage Create, append a second call, or alter music initialization.**
Keep `scr_mm1_cutman_route_busy`, `scr_mm1_cutman_scroll_finish`,
`scr_mm1_cutman_scroll_dispose`, the player Step/pause Begin Step busy prefixes,
charge/HUD/arrival/menu helpers and inventory unchanged.

## 6. Replace FIVE events on the EXISTING camera

**Objects > Cut Man > Stage > Ladder Route > `obj_mm1_cutman_camera`**:

| Event | Entire replacement |
|---|---|
| Create | `obj_mm1_cutman_camera_create.gml` |
| Begin Step | `obj_mm1_cutman_camera_begin_step.gml` |
| End Step | `obj_mm1_cutman_camera_end_step.gml` |
| Other > Room End | `obj_mm1_cutman_camera_room_end.gml` |
| Destroy | `obj_mm1_cutman_camera_destroy.gml` |

Keep one camera instance only; no new normal Step event. Room End/Destroy still call
the existing disposer; the new wrapper additionally stops ONLY this camera's gate
voice and is safe when both events run. Never replace these with global audio stops.

## 7. Room settings — width only

**Rooms > MM1 > Cut Man > Stage > your existing Cut Man stage room**:
- Width **3072** (was2304).
- Height **2160**, speed **60**: unchanged.
- View0 enabled/visible,256×240: unchanged.
- View0 initial position **X0/Y1920**: unchanged; camera follow object remains none.
- Player's working opening position: **unchanged** (previous original180→2100).
- No extra240 added anywhere. Do not move the player to the corridor for installation.

## 8. Restart and test

Stop/restart; do not hot-continue a run with old camera fields.
1. Traverse the working earlier routes. Confirm the Eleventh descent/upward return
   still works before committing through the gate.
2. Walk **right on the floor** into the first gate. Stop sliding/jumping first.
   At ground contact it takes control and immediately starts the approved MM5 sound
   and first opening strip (no initial half-second hold), then opens bottom-up and
   moves player/camera automatically into the corridor.
3. After the standing hold, normal walking/jumping/sliding/shooting and pause return.
   Test release/re-hold of charge through the sequence; no stale release shot.
4. Traverse all three corridor screens. Camera Y stays720; no vertical jump/reset.
   The **far-right second gate stays closed**. That is the current endpoint.
5. Left return from the corridor is blocked by the original collision-only boundary.
   No invented first-gate closing animation or extra visible left shutter is added.
6. Restart after entering the corridor to revisit earlier routes; no checkpoints or
   new death/return system is part of this update.

Standard grounded gate contact and the quarter-pixel entry snap are adaptations to
the existing MM5 controller, not a claim of native MM1 midair/slide entry behaviour.
No enemies, cutter spawning, spike damage, health damage/invulnerability, pickups,
tank effects, boss opening/fight/reward or stage return are installed.

Source/model checks are not a GMS compiler/GPU/scheduler/collision certification.
Please confirm the actual runtime result after installation.

Rollback: restore the working Eleventh8 script/camera replacements, old atlas,
gate Create (remove new normal Draw), original camera RoomEnd/Destroy disposer-only
code, room width2304, and restart. Remove the unused new resources if desired;
no vertical rollback or audio-manager repair is needed.


## Already installed the first-gate package? Timing-only upgrade

Use the separate **MM5 Immediate Opening** patch ZIP. Replace ONLY these two complete
code resources as a matched pair, then stop/restart:
1. Objects > Cut Man > Stage > Ladder Route > `obj_mm1_cutman_camera` > **Begin Step**:
   `obj_mm1_cutman_camera_begin_step.gml`.
2. Scripts > Cut Man > Stage > Doors > **`scr_mm1_cutman_gate_start`**:
   `scr_mm1_cutman_gate_start.gml`.

No new resources, atlas/room/player/audio changes or reinstallation of the whole
corridor. The version1201 ladder handshake remains unchanged. Do not replace the
Gate Draw event or backdrop sprite that you already fixed. Sound and first strip
start together at contact; four strips finish at0.30s, passage starts at0.40s.
This retains MM1 artwork/cadence; only the initial response follows MM5.
