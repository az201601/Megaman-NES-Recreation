# MM5-style immediate gate opening — timing-only patch

For the already working First Gate Passage installation, GMS1.4.1760.
Back up the project and stop the game first.

## 1. Replace camera Begin Step

**Objects > Cut Man > Stage > Ladder Route > `obj_mm1_cutman_camera` > Begin Step**

Replace the ENTIRE Execute Code contents with
`obj_mm1_cutman_camera_begin_step.gml`. Not normal Step or End Step; do not append.

## 2. Replace the gate-start Script

**Scripts > Cut Man > Stage > Doors > `scr_mm1_cutman_gate_start`**

Replace the ENTIRE existing Script contents with `scr_mm1_cutman_gate_start.gml`.
Do not create a suffixed duplicate or put this into the gate Object's Create event.

**Both replacements are required.** Gate-start now owns the initial sound/strip;
the matching Begin Step no longer plays a second sound32frames later.

## 3. Restart and test

Walk right into the first gate while grounded and standing. Sound and the first
opening strip now start in the trigger frame—no initial half-second wait. The
approved complete MM5 sound plays once, unchanged. The other strips follow at
6/12/18frames; the passage begins at24frames (0.40s at60fps). Player/camera travel
speeds and the final standing hold are unchanged, just shifted earlier. Control
returns at121frames rather than153.

This applies **MM5's immediate response**, retaining MM1's artwork, four opening
strips and passage. It does NOT replace them with MM5's three-edit/12-frame visual
animation. MM5's original opener was verified to queue sound and build its first
edit on the same frame; no guessed0.15s wait is used.

No new Sprite/Sound/Object, room dimensions, positions, atlas, Stage Create, audio
manager, music/queue/async/alarms, player, charge, pause, HUD or gate Draw changes.
Keep your fixed opening-backdrop resource and the existing complete MM5 WAV.
Earlier ladder handshake1201 and all17 blocks/two dispensers/ten visual spikes/
second closed gate stay unchanged. No enemies/combat added.

35 actual-GML source/model checks pass, including all22 ladder directions and
immediate opening, single sound, camera/player path, charge/rearm and teardown.
This is not GMS compiler/GPU/scheduler certification; please confirm it in-game.

Rollback: restore BOTH files from the original first-gate commit94f0b24, then restart.
The refreshed main First Gate Passage ZIP now includes this immediate version.
