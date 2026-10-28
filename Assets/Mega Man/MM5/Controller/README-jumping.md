# MM5 normal-gravity jumping — GMS 1.4.1760 checkpoint

## Scope / measurement

Normal-gravity Napalm Man ROM replay (not Star Man): initial upward velocity 5 px/update; gravity .25 after movement, terminal downward speed 7. Releasing jump cancels upward velocity AFTER the release update's movement. Held jump rises 52.5 px in clear air. A held button does not automatically trigger another jump after landing in the tested replay. Jump uses a fresh button press in this controller; Space is the chosen PC binding, not an NES input requirement.

Normal vertical terrain tables: ceiling X -7,+7 at Y -10; floor X -7,0,+7 at Y +12. The unchanged ROM ceiling-collision code sets downward velocity to 1; this is code-checked, not a separately replayed natural ceiling impact. Scripts: tools/rom-recovery/jump-values.mjs, fall-values.mjs, extract-landing.mjs. The provided GML adapts probes to rectangular instances and integer surface snapping: it does not claim identical subpixel metatile resolution or update ordering for every combined horizontal/vertical interaction.

## Setup order

1. Sounds resource tree: create `Mega Man > MM5 > Movement`. Create `snd_mm5_megaman_land` in that folder and load `snd_mm5_megaman_land.wav` from `Assets/Audio/Mega Man/MM5/Movement/`. Ordinary non-positional sound; retain default volume. Playback is nonlooping in code. No invented jump-launch sound: the measured ordinary jump requests landing SFX $1B, with no launch request.
2. Objects > Player > MM5 > obj_mm5_megaman > Create > Execute Code: append the following, keeping all confirmed existing variables:

```gml
jump_speed = 5;
head_offset = 10;
```

Required pre-existing variables: feet_offset=12; grounded=false; fall_speed=0; fall_gravity=.25; fall_speed_max=7; walk_speed=1.296875; walk_pause=0; walk_previous_input=0. Keep standing image initialization and debug_player_reference=true.

3. Objects > Player > MM5 > obj_mm5_megaman > Step > Step > Execute Code: REPLACE the entire current code with the contents of `obj_mm5_megaman_step.gml`. Open the .gml as plain text and copy/paste into the existing event. Do not create a script resource named after this file and do not append the code beneath the old Step. It already includes the existing walking, startup pause, wall resolution, temporary X>=8 boundary, and falling. It requires the previously installed scripts `scr_mm5_player_wall_blocked` and `scr_mm5_player_wall_limit`.
4. Draw event unchanged. Solid unchecked. Do not enable GameMaker built-in gravity/speed. Do not alter scenery, region objects, blocks or music. Room speed remains 60.

## Changes beyond the previous vertical test

- Space presses while supported start a jump; early release shortens it.
- Upward sweep uses ceiling probes and stops against undersides.
- Downward sweep/support now uses all three normal floor probes, rather than the old center-only support point.
- Landing plays one noise SFX per downward landing, not on every grounded update or at spawn.
- Artwork stays standing until the animation checkpoint.

## Test sequence

- Start at X48,Y180. Hold Space: full jump, clean landing. Keep holding after landing: must NOT bounce repeatedly.
- Release then tap Space: shorter jump.
- Jump while walking: left/right input should work; test the existing block wall and left boundary again.
- Ceiling: temporarily start the same single instance at X144,Y148, supported by the lower block at X128,Y160. Holding Space should hit the roof underside, end ascent and land back on the block without passing through. Then restore X48,Y180. This is temporary test placement, not arrival integration.
- Check landing sound once on each landing; no continuously repeating grounded sound.

A raised edge can support a side floor probe while the central magenta/green marker is still drawn at the player's center: marker length is not collision width. Full animation, slide, ladder-top rules, weapon/charge, damage, pits and screen transitions remain unfinished. Keep testing within this room, away from its unimplemented right exit. Low-gravity levels are separate future work.
