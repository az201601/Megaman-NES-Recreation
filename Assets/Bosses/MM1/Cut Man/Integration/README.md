# Connected Cut Man combat + victory package

- **Package:** `mm1-cutman-connected-combat-victory-gms14.zip`
- **Read first:** `INSTALL-GMS14.md` (also inside the ZIP).
- **Installed checks:** `ACCEPTANCE.md` (also inside the ZIP).
- **Resource/file inventory:** `MANIFEST.json` (also inside the ZIP).

Start from the working full Cut Man level/E-Tank/entrance/shutter/flash baseline.
This is one connected incremental update, not a standalone project or another
entrance installation. Stop the runner and back up the project first. The guide
specifies exact folders, resources, sprite cells/origins, five full Script
replacements and precise player/boss event edits. No editor room placement.

Includes fight28HP/1,1,3, permanent lethal-hit attack shutdown, MM6 defeat/clear/
centre/acquisition/teleport, approved custom-look/MM6-sequence weapon screen,
approved original-volume extended MM5 music, two native player Cutter demo
throws with approved25 sound, once-only inventory unlock and stage-select return.
Fixed demo playback is not a general equipped-Cutter gameplay controller.

Package integrity/resource dimensions/approved audio hashes/baseline invariants
and source controller/audio/reward/safety regressions pass. Actual GMS1.4.1760
compile, GPU/audio/pause/deactivation and installed playtest are NOT executed.
There is no `.project.gmx` checkout or GMS runner here. See pending acceptance
checklist; do not mistake source completion for installed acceptance.

Rebuild: `python3 tools/rom-recovery/package-cutman-connected.py`.
Check: `python3 tools/rom-recovery/test-cutman-connected-package.py`.

ZIP SHA-256: `9a81fcad006dc24f2dd8e58da40d4f66bfe9569f4985f2527e9c895046269e9f`.

## Installed test correction — final-hit death sound

During keyboard/F8-assisted victory testing the user reported the missing
last-hit death sound. The once-only lethal handoff now plays existing
`snd_mm5_megaman_death` after stopping boss music. It does not call player death,
lose a life, change timing or grant rewards early. Source regressions pass;
user retest of this correction remains pending. Older extracted packages need
this one-line addition in `scr_mm1_cutman_victory_handoff` after
`scr_mm1_cutman_boss_stop_combat();`:

```gml
audio_play_sound(snd_mm5_megaman_death, 15, false);
```
