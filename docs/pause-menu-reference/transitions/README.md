# Original MM5 pause transitions — observed reference, not a GMS patch

Supplied Mega Man5 USA ROM, natural Start to open and Start on Buster to confirm/close. No inventory, ROM, palette or sound-driver patches. JSNES2.1.0 running original code; default RGB output converted to the pinned Mesen0.9.9 palette. **Not a Mesen executable capture or hardware timing claim.** Correct original sounds were already recovered separately.

## Visual references

- mm5-menu-open-reference.gif: stage -> original pause menu.
- mm5-menu-close-reference.gif: original pause menu -> stage.

GIFs use EXACT original256x240 captured pixels/approved NES RGB values (conversion asserted identical); no artificial tween, dark overlay, scaling, dithering or compositing. GIF playback rounds to10/20ms centiseconds; frame records, NOT GIF playback clock, are authoritative. Endpoint holds were added to aid viewing.20 selected native keyframes included for audit. Entire121-frame-per-direction palette/scroll/nametable/image hashes in native-transition-trace.json; independent input probes in native-input-probes.json.

## Frame convention

Frame0 is stable BEFORE input. Fresh Start at frame1, release at2. Rows describe the captured visible frame after that update. Closing begins from fully settled menu after120openingupdates. Counting from input frame1 to first enabled frame38 gives37update intervals (~0.617s at60updates/sec). Exact NES video rate is not being equated to60Hz here; GMS target room speed is60.

| Captured frame | Opening | Closing |
|---|---|---|
|1|Original opening sound29hex; stage still original brightness|Original confirm/close sound28hex; menu still original brightness|
|2..5|First darker stage palette|First darker menu palette|
|6..9|Second darker stage palette|Second darker menu palette|
|10..13|Third darker stage palette|Third darker menu palette|
|14..23 open /14..22 close|Completely black|Completely black|
|18..21 within black|Original menu nametable setup, rendering disabled|Original stage nametable setup, rendering disabled|
|24..26 open /23..26 close|First faint menu pixels visible from24|First faint stage pixels visible from23|
|27..30|Next menu palette level|Next stage palette level|
|31..34|Next brighter menu palette|Next brighter stage palette|
|35..37|Full-bright menu|Full-bright stage|
|38|Fresh cursor movement accepted|Fresh stage walk input accepted|

CHR cache/bank changes at frame23 in each direction (opening still black; closing is the first faint stage frame). Later stage CHR changes at53/70/etc are normal background animation, not transition phases.

Notice the incoming screen does **not** slide or zoom. Coarse scroll registers temporarily change while PPU memory is being uploaded under black; these are not visible sliding animation. Visible frames use fixed scroll in this stationary-scene test. Nametable bank changes across the black interval.

## Fade mechanism

This is discrete NES PALETTE darkening/lightening, not continuous alpha dimming. Example stage colours29->19->09->0F and27->17->07->0F; lowest-brightness colours disappear sooner. Original menu white20->10->00->0F, whereas selected white30->20->10->00->0F. RGB20/30 are identical in pinned palette but have different fade paths: an eventual exact shader/indexed implementation must retain/disambiguate palette indices rather than pretend every equal RGB has the same origin.

Do not substitute a smooth black rectangle alpha animation and call it1:1. Our custom menu layout is intentionally different; aim to reproduce original sequence, stepped palette behaviour, blackout and input/audio scheduling, not replace approved layout with original MM5 screen.

## Input observation

Independent cloned pre-open and pre-close states tested one-frame Right presses at EACH frame24..43. During opening, presses24..37 produced no cursor command; first accepted38 produces original27hex cursor sound immediately. During closing, presses24..37 produced zero walk displacement; first38 moves1.296875px. Later39..43 accepted likewise. No held-input/charge/pause-rearm equivalence claimed by those fresh-press probes.

## Implementation status / next change

**Observation only. Existing GMS stage controller still lacks these fades; no new import/install instructions yet.** Current previously delivered closing-key release guard must be revisited together with the timed transition so it doesn't accidentally extend the native timing. Existing charge/audio/input safety requires runtime checks, not deletion based on fresh-press-only probes.

Planned phases: capture/freeze outgoing stage -> original stepped fade-out -> black switch -> stepped menu fade-in -> menu-ready38; reverse on successful confirmation, then resume world/input only at corresponding ready boundary. Sound requests occur on transition entry, not at fade completion. Ignore navigation/confirmation during transition. Preserve existing custom layout, plural KindlyPatrick credit, ownership hiding, Start/A confirmation and no leaked jump. Actual GMS solution still to build/test; do not install any unreviewed draft fade/shader.

## Reproduce

```
npm ci --prefix tools/rom-recovery
mkdir -p tools/rom-recovery/.work
node tools/rom-recovery/mm5-start.mjs
node tools/rom-recovery/mm5-stage.mjs
node tools/rom-recovery/inspect-mm5-menu-transitions.mjs
node tools/rom-recovery/probe-mm5-transition-input.mjs
python -m pip install --target tools/rom-recovery/.work/pydeps pillow
python tools/rom-recovery/build-mm5-transition-review.py
node tools/rom-recovery/test-mm5-menu-transitions.mjs
```

Scratch frame sequences/dependencies remain ignored.work; only compact reviewed references, keyframes and trace/probe records committed. Tests assert fade step frames, blank intervals, full-bright frame35, fresh-input threshold38, sound29/28 entry and no visible scrolling.
