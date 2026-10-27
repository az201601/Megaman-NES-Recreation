# Mega Man 1 recreation: observations and next steps

## Scope and method

Observed the supplied `Mega Man (USA).nes` with JSNES 2.1.0, frame-stepping from boot. These are emulator observations, not hardware/cycle-exact validation. Emulator RGB values are not a definitive NES display palette. No extracted ROM graphics or temporary emulator dependencies are added to the project.

The editable GMS project is currently on the user's machine, not in this repository. Current resource names reported by the user: `spr_mm1_title_screen`, `spr_mm1_font`, `obj_mm1_title_screen`, `rm_mm1_title_screen`. Use game-specific resource prefixes going forward.

## Title

- Native canvas: 256 x 240.
- Supplied logo image preserves the title logo's position; copyright/licensing text and TM are omitted in the recreation.
- PRESS START cell origin: (88, 136). Visible glyph pixels begin at y=137.
- Prompt is steady while idle.
- After a single Start press, measured rendered frames (first emulated frame after button-down = 1):
  - 1: prompt visible.
  - 2–9: hidden.
  - 10–17: visible, then alternating eight-frame blocks.
  - 114–120: hidden (seven-frame final hidden segment).
  - 121–128: visible.
  - 129–133: black screen.
  - 134: stage-select graphics visible.
- Existing GML timer supplied in conversation models the title visibility sequence, not the subsequent five black frames and stage-select handoff.
- A 60-step GMS room is a real-time approximation of NTSC frame timing, not exact NTSC timing.

## Stage select

Layout:

```
         CUTMAN       GUTSMAN
  ELECMAN   SELECT STAGE   ICEMAN
             PRESS START
         FIREMAN      BOMBMAN
```

- Initial selection: Cut Man.
- Six framed portraits, labels, blue background, black outer margins in emulator output.
- Selected frame changes palette; not a free-moving arrow cursor.
- The selected frame alternates highlighted/unhighlighted appearance. During a held-Right test, the stable selection alternated appearance at 16-frame intervals.
- Right tap order: Cut -> Guts -> Ice -> Bomb -> Fire -> Elec -> Cut.
- Left tap order: Cut -> Elec -> Fire -> Bomb -> Ice -> Guts -> Cut.
- Up/Down tests from initial selection did not move selection.
- Holding Right for 120 frames moved once to Guts; it did not repeatedly advance.
- Start confirmed Guts Man after navigating right.
- A/B confirmation behaviour, exact initial highlight phase, input latency, audio timing, text/frame pixel coordinates and returning-after-stage behaviour remain to be measured.

## Boss introduction (sample: Guts Man)

- Separate presentation from stage select: blue field and dark horizontal band.
- Boss sprite animates/moves; text does not all appear at once.
- Observed text includes GUTSMAN, CLEAR POINTS, 90000.
- Partial name GUT visible in an early sample; full name/points visible in later samples.
- Sample frames are not enough to specify the full animation, duration, or lettering cadence. Measure before implementation.

## Intentional recreation changes

- No score or points system anywhere in the recreation.
- Boss introductions retain animation and name reveal, but omit CLEAR POINTS and the numerical value.
- Do not create score variables or scoring logic.

## Recommended implementation order

1. Finish title-to-select handoff, including observed black interval.
2. Prepare stage-select graphics and audio; do not use a flattened image as the final implementation for dynamic portraits/highlight.
3. Reproduce static stage-select layout at native resolution.
4. Implement ordered, wrapping left/right selection and palette-flashing selected frame; validate phase and period before finalising.
5. Confirm Start and preserve selected boss for the next room.
6. Measure and implement boss introduction for one boss first.
7. Only then begin stage geometry, Mega Man movement and collision.

## Naming plan (proposed, not existing assets)

- `rm_mm1_stage_select`
- `obj_mm1_stage_select`
- `spr_mm1_stage_select_background`
- `spr_mm1_stage_select_frame`
- `spr_mm1_stage_select_portraits`
- `snd_mm1_stage_select`
- Later: `rm_mm1_boss_intro`, `obj_mm1_boss_intro`

Retain original MM1 behaviour as a baseline. Add fan-game features as explicit later changes rather than accidentally replacing original menu behaviour with a generic grid menu.
