# MM5 door opening vs the current recreation — contact investigation

**Investigation only. No gate/player/camera/art/audio/gameplay changes or replacement ZIP. Screw Bomber remains paused.** User clarified that passage/scrolling is fine, but opening seems too fast, then requested a closer MM5 comparison. The suggested8-frame strip spacing was never installed and is NOT treated as native MM5 timing.

## New finding: onset and animation cadence are different questions

The earlier opener-only probe correctly measured MM5's three edits4frames apart, but did **not** measure approach-to-visible-opening. This investigation now follows the original player/camera boundary logic into BOTH sequential Napalm Man gates and checks actual PPU writes plus rendered/displayed pixels.

At the rendered door tile's left edge, MM5 does not immediately block Mega Man and start opening. It permits his center to advance to the screen boundary threshold. The native camera code compares the player center low byte with240; when it passes240, it clamps to240 and enters the gate-bearing screen transition. Our accepted project instead starts opening at standing right-side collision contact: playercenter=gateleft−8. This is earlier geometrically.

**Do NOT describe MM5 as having a fixed6–7frame opening-delay timer.** The measured6–7frames are the remaining walking distance between two different positional markers. Timing depends on position, fractional alignment and movement speed. Matching this exactly would require resolving our solid-gate trigger/movement geometry, not merely copying a delay constant. Neither camera logic nor collision has been changed here.

## Measured timeline

Frame0 below is the **native boundary trigger/opening-routine entry**, not the earlier right-edge/door-face crossing. Times are nominal60FPS.

| Event | Original MM5, both tested Napalm doors | Current project source, both doors |
|---|---|---|
| Trigger position | Player center reaches/passes door tile's left edge at screenX240 | Standing right side touches solid gateface: center=gateleft−8 |
| Geometric side-probe reaches door tile → trigger |6–7updates in tested alignments | No deliberate wait after source trigger eligibility |
| Sound request |Age0, command25hex |Age0, approved existing MM5sound |
| Build/apply first opening edit |Build0, PPU write/display1 |First strip set1 at triggerage0 |
| Subsequent opening edits |Build4/8; PPU write/display5/9 |Strips at6/12/18 |
| Edit spacing |4frames ≈0.067sec |6frames =0.100sec |
| Geometric side-probe crossing → first visible opening |7–8frames ≈0.117–0.133sec |Immediate on activation; installed GMS contact/event/display latency not measured here |
| Entire door visibly clear |Age9 ≈0.150sec |Fourth/final strip removed at sourceage18 =0.300sec |
| Opener returns / current scroll starts |Age12 =0.200sec |Age24 =0.400sec |
| Door artwork |16×48, three16px strips |First32×64/second16×64, four16px strips |

**Interpretation:** current strip animation is already slower, but its first response is earlier in the approach. That is a plausible reason it can *feel* too abrupt. This evidence does not establish the user's subjective cause, certify installed GMS latency or justify arbitrarily slowing all remaining strips. A short project-specific anticipation could be previewed later, or native-style positional activation designed, but neither is silently applied as an exact native match.

Our cameraBeginStep precedes the player's ordinary Step. An ordinary Step first resolving at the solid face will normally become eligible at the next BeginStep; sourceage0 still opens the first strip immediately. This event-order expectation is not an installed GameMaker measurement, and should not be compared as a certified0ms physical-contact latency against the native visible frames.

## Four measured gate entries

| Trial starting X fraction | Door | First geometric right-edge/tile crossing | Native trigger | Displayed edits | Scroll starts |
|---|---|---:|---:|---|---:|
|0/256 |First, native page26→27 |24 |31 |32,36,40 |43 |
|0/256 |Second, page27→28 |279 |286 |287,291,295 |298 |
|160/256 |First |24 |30 |31,35,39 |42 |
|160/256 |Second |279 |286 |287,291,295 |298 |

The native geometric marker is `floor(playercenterX)+8` crossing the **tile** left edge, using the MM5 normal rightward terrain-probe table (`C8E2=0`, `C912..C916=02 08 F7 09 0B`: X+8, Y−9/0/+11), independently checked against the supplied ROM. It is **not** a blocking collision callback: the door area is traversed before the boundary trigger. Painted pixels have internal tile padding; don't equate the marker with a sprite-pixel collision.

Firstgate trial0 example: edge marker24, trigger31 with no visual door edit yet, actual first displayed opening32. Opening edit buffers are built31/35/39, written to PPU32/36/40; at least40/40/20unoccluded displayed pixels independently change with those patches. Second door confirms the same1/5/9display spacing. Sound is a native request trace, not a new APU waveform or measured speaker latency.

### Actual native frame crops

Each PNG contains five consecutive **selected** samples (not a real-time animation): geometric edge crossing; trigger; first edit visible; second edit visible; fully open. Each cell16×48 is raw original onFrame output atX240..255/Y144..191, including the actual overlapping player sprite. Zoom with nearest-neighbour scaling to inspect. No substituted background or repainted doors.

- [First gate, frames24/31/32/36/40](native-door-1-five-frames.png)
- [Second gate, frames279/286/287/291/295](native-door-2-five-frames.png)

Raw JSNES palette retained in these research crops; no Mesen display settings changed. TV-style right-edge cropping is disabled only in the analysis emulator because otherwise the door's rightmost8pixels would be artificially blacked out.

## Method and limits

Supplied unmodified **Mega Man5(USA)** SHA256 `32bd2b4ecd2129aa5337afe9171696ef35646d3fd597339aebba19221764521c`; JSNES2.1.0. Source labels from `refreshing-lemonade/megaman5-disassembly@03e59a6855c1aca85d063bd2973005dc3ffd02ef`, `bank1B_1F.asm`;54relevant instruction/table bytes checked directly against supplied ROM. Individual verified spans, events, pixel hashes, side-probe/camera/position records and current project source hashes are in [native-mm5-gate-contact.json](native-mm5-gate-contact.json).

Fresh original boot/normal Napalm selection. **Controlled lead-in, not a natural full-stage traversal:** once at normal camera-call entryC9DD, redirect its existing callee stack to the original D460 full-room renderer, selecting actual page26/section12; restore section offset2 when renderer returns. Then one supported player placementX208/Y180 on the actual192-high approach ledge, flash120 set once to avoid existing-enemy interference, two neutral frames. During measurement: **Right only**, no per-frame position/velocity/protection pins, no gate flags forced, no opening-routine redirection, no ROM code/PPU/tile/speed edits. Follow BOTH original gate approaches sequentially; repeat with a different initial Xfraction. No RAM state snapshots, ROM or disassembly included in this report.

PPU writes are observed, not modified. Background-strip hashes avoid confusing avatar-pose changes with door edits; every recorded visible edit additionally requires nonzero actual displayed pixels to change to their new background value without sprite occlusion. Thus hero movement alone cannot be mistaken for opening. CPU routine events agree with both PPU-write and pixel results. This is emulator/controlled-situation evidence, not hardware, every-stage/every-entry-mode or GameMaker scheduler certification. Jump entry and accepted project charge/freefall/pit behavior are untouched.

Reproduce from repo root after `npm ci --ignore-scripts --prefix tools/rom-recovery`:

```sh
node tools/rom-recovery/probe-mm5-gate-contact.mjs
node tools/rom-recovery/test-mm5-gate-contact.mjs
node tools/rom-recovery/test-jumping-gates.mjs
```

The probe boots itself from the supplied original ROM; no earlier `.work` snapshots or disassembly downloads required. Static test rechecks ROM identity/spans, all four entry traces, pixel/PPU timing, geometric markers, source schedules/hashes and captured-frame dimensions. Source/mock tests do not replace installed GMS testing. **Decision about any timing adjustment remains with the user.**
