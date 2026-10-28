# MM5 sliding — measurement and preparation checkpoint

## Status

User has approved normal movement, jump/audio/animation and the complete current rectangular-region ladder implementation, including ceiling obstacles, downward solid landing and unsupported bottom release. User also disabled LADDER/TOP diagnostic labels. Preserve this accepted behaviour.

Sliding research started; no slide movement or artwork has been installed. First user instruction is Create-state preparation only. No GMS runtime/compiler is available here.

## Reproduce

With the supplied original USA MM5 ROM, dependencies and generated Napalm Man stage snapshot available:

```
node tools/rom-recovery/slide-values.mjs
```

Output `.work/slide-values.json` is regenerable reference data, not a distributed game asset. The probe starts from a relocated normal player state0, not forced slide state2. It supplies spatial terrain classes at the original raw-class mask sites C551/C659 (JSNES PC one less), preserving original entry/movement/clearance logic. Eight synthetic-floor warmup updates precede the input schedules so a fresh A is genuinely grounded. Normal gravity only. This is a controlled synthetic floor/tunnel/wall/edge experiment, not a natural encounter or certification of all metatile/object cases. Background stage logic remains running; sound requests are logged but not isolated to the player. Do not label every sound command as slide audio.

## Observations with assertions

- Fresh A while Down is held enters slide; Down can predate A or be pressed on the same update. Already holding A then pressing Down does not slide (the grounded A has already jumped).
- Speed 2.5 px/update, no acceleration. Left at entry selects left; right-facing/no horizontal input selects right.
- Duration counter is initialized to $1A (26). Entry already moves 2.5 and decrements to25. Last update moves the 26th time then exits to state0, total65 px on clear floor. Counting only displayed end-of-update state2 would miss the last move.
- Releasing Down/A does not shorten the slide. Keeping Down/A held does not auto-repeat once it ends.
- Opposite direction on update8 sets opposite facing, moves 2.5 backward that same update, then ends slide on open floor (timer reset). Not simply an instant reversal into another full slide.
- Fresh A without Down on update8 jumps if clearance permits: state1, Y delta -5 from the current slide reference. Fresh Down+A does not jump or restart the timer.
- Tunnel solid band x160..223/y160..175 over floor192 blocks standing: slide continues at counter0 until standing clearance. Fresh A under that ceiling is blocked. This does not yet establish all clearance tolerances or reverse/edge+ceiling combinations.
- Full-height wall x176 stops the slide early, state0 on update12 at X161, counter still17. Widened slide probes require separate collision handling, not reuse of standing width blindly.
- Floor ending at x176: slide leaves support, state0 then state1 in the observed updates. Exact drop phase/clearance rules need more study before implementation.
- Slide reference Y shifts +2 on entry and -2 on ordinary standing exit; do not confuse this with sinking or changing world-floor height. Relative jump-cancel and edge Y behaviour require care when adapting the existing GMS fixed feet reference.
- Animation ID $10 during normal slide. Artwork and any required player sound still need extraction/validation; no audio is being added based on unrelated background requests.

## Original-ROM code references

Switchable player bank ROM offset0x36010 (bank1B); addresses below are CPU addresses in that bank.

- 8092 checks new A; 809B-80A2 checks held Down under normal gravity.
- 80C2-80E7 selects direction and checks entry clearance.
- 80F0-80FF initializes duration26/state2/speed$0280 (2.5).
- 811F-8128 adjusts reference Y using table8EF1 (+2 normal gravity).
- 8299-82C5 checks support and jump/standing clearance.
- 82C8-82DD opposite-direction input changes direction and clears timer.
- 82DF-82F0 moves first, then decrements timer.
- 82F2-8309 checks standing clearance and restores standing reference.
- 830C-832A restores ordinary state/speeds/animation.

## First GMS resource/event preparation

**Objects > Player > MM5 > obj_mm5_megaman > Create > Execute Code**: append the five variables from `Assets/Mega Man/MM5/Controller/obj_mm5_megaman_create_slide_append.gml`. Do not replace Create or change Step/Draw, collision masks, sprite origins or sound events. Preparation alone deliberately does not enable sliding. User installation is pending.

Next checkpoint: extract/import the slide pose, then integrate a measured slide state in small testable steps, with separate standing-clearance and slide-body probes. Preserve ladder entry/drop priorities deliberately rather than accidentally intercepting their keys.

## Artwork checkpoint

User confirmed the five Create variables installed. `extract-slide-art.mjs` now extracts actual slide entry in the original Napalm snapshot (no class injection/state2 forcing). Static right-facing 32x40 pose, origin16,16; live samples2/5/10 equal, eleven OAM components, no clipping. Camera-relative alignment and previous-frame reference checked. Separate trailing dust excluded. See Assets/Mega Man/MM5/Sliding/README.md. User sprite import and movement integration remain pending.
