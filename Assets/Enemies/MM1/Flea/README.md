# Flea — original-game research checkpoint (not a gameplay installer)

Super Cutter's corrected GMS1.4 package is user-accepted as working. The user authorized research of the next new enemy in original encounter order: Flea/type02, three robots on native page8 after the first dispenser. This directory adds **reference evidence and recovered art only**. No gameplay scripts, room actors, install ZIP or changes to accepted combat are supplied here yet.

## Verified findings

- Original records18/19/20: native worldX2104/2136/2168,Y184/152/120. Accepted hybrid stage mapping is `(1080,1144)`, `(1112,1112)`, `(1144,1080)`, all camera band960. Do not place enemies yet.
- Initialized native20HP and20normal damage => **one normal hit**. This threshold is derived from initialization/table/verified subtraction, not a recorded natural bullet kill. Contact damage **2**, collision halfwidth/halfheight **8/8**; do not enlarge collision to fit spring artwork.
- Initial ground timer1 starts a hop on first AI update after spawn. No Super-Cutter-style proximity gate. At each hop the native AI faces the player again, then chooses via native RNG bit0: speed-table choice0 has upwards1248/256 (4.875), horizontal304/256 (1.1875); choice4 has upwards1024/256 (4), horizontal768/256 (3). No homing within the hop.
- Airborne AI skips movement/gravity **when original frame counter &3 is0**. The other three updates run original terrain-aware movement. This is not a free parabola every frame and not a four-update ground wait.
- On descending floor contact, horizontal speed becomes0 and ground delay15; next jump is15updates later in the observed continuations. Native terrain can interrupt upward motion too. Integration needs collision with accepted invisible solids/removable blocks, not scenery alpha.
- No sound issue calls occurred in any trial. Shared Flea/BigEye AI has a landing cue branch **only for type09/Big Eye**, not type02/Flea. Do not borrow that later enemy's landing sound.
- Two original poses: grounded16x16 and airborne16x24 with extended spring. Recovered strip uses two16x24 common cells, origin8,7, canonical left; standing image is top-aligned with transparent bottom8rows. Each pose independently matches opaque native-render pixels. Do not import into the working project until a full installer identifies resource/event settings.

## Evidence and scope

`Reference/native-flea-gameplay.json` contains supplied MM1USA SHA256,215source bytes independently compared to the supplied ROM, original firstspawn, records/mapped anchors, five controlled600-update trials and2708native Flea AI-entry states. Across these trials:48hop initializations (both native RNG choices),45landings,499airborne skipped updates asserted unchanged. First jump direction/velocities, initialHP/timer, postlanding timer15/vx0 and absence of Flea sound issues are asserted in the probe. Delays are observed where the enemy survives and the next hop fits the trace; missing continuation is not a zero-delay hop.

Pinned label source: TheRealQuantam/mm1base@9c1cb05bd1d63c176e1930053dda76bcb85cd977. Its modified ROM is never executed. Lead-in inherits controlled ladder probes; one native A releases the ladder, then Right with playerY36/verticalspeed0/protection100 pinned until original firstspawn. Trials start from a frame-boundary snapshot before firstFlea AI and pin playerX to anchor+delta(-128,-40,0,40,128),Y36/verticalspeed0/protection100 everyframe with neutral inputs. Enemy/terrain/spawn/RNG/sound code is not patched. These are not natural traversal, unassisted combat or hardware/GMS tests.

`Reference/native-flea-art.json` records live OAM composition and RGBA hashes. `recover-flea-art.mjs` independently checks composed opaque pixels against native JSNES rendering. Mesen0.9.9 color adapter only; not a claim that Mesen.exe was run. Original ROM, disassembly dumps and emulator states are not included.

Reproduce after existing ignored fourth-ladder snapshot and pinned bank5/bank7 source-label dumps exist:

```sh
node tools/rom-recovery/probe-flea-gameplay.mjs
node tools/rom-recovery/recover-flea-art.mjs
node tools/rom-recovery/test-flea-research.mjs
```

Next work is additive GMS1.4 integration, terrain/ceiling/floor probes, shared airborne skip phase, MM5 normal/mid/full hits/drops and preservation tests, followed by manual installation and user runtime confirmation. None is claimed complete by this research checkpoint.
