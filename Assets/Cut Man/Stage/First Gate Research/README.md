# First entrance gate — research, not an installation package

The Eleventh connection is user-accepted. This is research for the next connection;
no replacement GML, room expansion or gate-operation package has been delivered yet.
Keep the accepted Eleventh installation unchanged for now.

## Approved hybrid

- MM1 gate artwork, four bottom-up edits and automatic passage.
- **MM5 opening sound**, command `$25`, never the MM1 `$24` cue.
- No enemies, combat, damage, pickups or boss fight in this task.

## Measured MM1 sequence

`native-gate.json` records 240 original-USA frames. This inherits controlled earlier
lead-ins, uses a pinned renderer traverse and a one-time ground placement/cache refresh,
then unmodified Right-only input. It is not a natural whole-level playthrough.
Frame20 is trigger/age0. Opening routine runs frame52/age32. Visible bottom-up
16px strips change at53/59/65/71 (ages33/39/45/51). Scroll runs76..139:
64 steps, camera +4 and logical player +1 each. Camera4864→5120,
player5080.25→5144.25. Pose is walking through138, standing at139.
Type2 persists through171; bookkeeping commits section12/begin20/end22 at172.
Independent fresh Right pulses ages150..152 are ignored;153..155 are accepted.

The raw page byte temporarily jumps during scrolling. Use logical X from camera
plus modulo256 screen-relative X, NOT raw page*256+lowX during the handoff.
World mapping: native X−2816, native Y+720; new camera2304,720 and playerX2328.25.
The final MM5 feet/Y/collision adaptation has not been implemented or runtime-tested.

The probe hooks opening, second opening, closing, animation, sound and scrolling.
No second-opening or closing call occurs during this first entrance. **Do not add
an invented closing animation/cue.** Post-entry Left180 with no additional RAM
patches remains section12/camera5120 with integer playerX5144 at the boundary.
Page20's kind1 rectangle is an invisible return blocker, not a recovered visible
shutter: the native corridor reference has ordinary background artwork there.
Do not invent a left-side gate sprite from that collision-only feature.

## Corridor

Original pages20–22, 768×240, map to world2304..3071/Y720..959.
Controlled Right/A-once traverse pins Y148/velocity0/protection100 for renderer
verification only; reaches native camera5632/player5761 in466 frames, before the
far-right second gate. All2880 tile-ID/palette pairs checked against live PPU.
`native-corridor-reference.png` includes the original black upper region and native
background colors; it is a research reference, not a scenery tileset to import.
The final corridor's right gate remains closed until separately implemented.

## Source checks / reproducibility

MM1: TheRealQuantam/mm1base at9c1cb05bd1d63c176e1930053dda76bcb85cd977,
`bank7.s` annotated spans at PRG1D066/1D09B/1D0F3 match the supplied USA ROM.
Only those spans were newly byte-audited, not the entire modified Japanese-based
source. Native USA execution is the primary timing evidence.

MM5: refreshing-lemonade/megaman5-disassembly at
03e59a6855c1aca85d063bd2973005dc3ffd02ef, `bank1B_1F.asm`.
Gate-before-horizontal-scroll caller1ECB93 invokes1ED0FC. Its three-edit PPU routine
queues25 at1ED120/122; paired shutter routine also queues25 at1ED1B5/B7.
Four supplied-USA byte spans are verified in the audio recovery manifest.
The MM5 animation timing is NOT substituted for the MM1 four-edit sequence.

Tools under `tools/rom-recovery/`:
- `probe-cutman-first-gate.mjs`
- `probe-cutman-first-gate-ready.mjs`
- `probe-cutman-gate-boundary.mjs`
- `recover-cutman-gate-corridor.mjs`
- `record-mm5-gate-sfx.mjs`
- `test-cutman-first-gate-research.mjs`

The recovery tools require local supplied ROMs and prior ignored snapshot lead-ins;
no ROM or emulator snapshots are distributed. The test also needs the local MM1 ROM
for its byte checks. Existing Eleventh55 source/model checks still pass unchanged.
GameMaker compiler/runtime/scheduler/collision and completed gate-passage integration
remain untested because the new GML implementation has not been made yet.
