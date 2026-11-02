# Custom Rolling Cutter weapon-get screen — revised visual draft

Overall layout approved by user. Requested row-removal and weapon-colour revision
implemented; revised appearance/runtime acceptance pending. Not installed, animated
or complete. No partial installer.

This is the **reveal/name-card state**, not the later weapon demonstration.
Native logical size256x240, with a4x nearest-neighbour review image. Adaptation:

- MM6 pipe/window frame art, rearranged into shorter top/bottom bands and recoloured
  blue/steel. Custom bottom weapon-acquired nameplate only. Top Cut Man text
  AND its entire box removed; uninterrupted mechanical frame restored. This palette/layout
  is custom, not asserted to be original MM6 colours or timing.
- Original MM6 large Mega Man from a controlled original award scene. The figure
  is background-rendered, NOT an OAM actor: native rendered64x96 region at176,72
  isolated against the original black backdrop.1632 nonblack pixels preserved and
  individually checked against native rendering. Black backdrop becomes alpha.
  Original geometry/alpha retained. Displayed variant uses Rolling Cutter armour
  colours: dark blue -> grey666666, light blue -> whiteFFFEFF, cannon magenta ->
  light greyADADAD. Face/eye/white-highlight pixels remain unchanged. This is a
  custom weapon-specific adaptation, not an original MM6 weapon palette claim.
- Accepted original38-cell MM5 sprite alphabet, including white/cyan tint correction.
  No new font, invented letters, antialiasing or interpolated scaling.
- YOU GOT / ROLLING CUTTER only. The small weapon icon, R.CUTTER menu name and
  their card are removed, per user request. No such menu row on future weapons.
- Each future weapon screen must use that weapon's portrait palette; do not leave
  the displayed Mega Man in default blue. No score/CLEAR POINTS.
- Approved original-volume MM5 weapon-get music remains the audio plan. This Draw
  does not start/modify any audio, and does not grant inventory or complete phases.

## Files and future resource boundaries

`spr_mm1_weapon_get_frame.png`:256x240, one image, origin0,0.
Future folder `Sprites > MM1 > Cut Man > Weapon Get`.
`spr_mm1_weapon_get_rolling_cutter_megaman.png`:64x96, one image, origin0,0.
Future folder `Sprites > MM1 > Cut Man > Weapon Get`.
`spr_mm6_weapon_get_megaman.png` is the preserved blue native source/reference,
not the displayed Rolling Cutter variant. Reuse only existing `spr_mm5_pause_font`;
no menu icon resource dependency.
`scr_mm1_cutman_weapon_screen_draw.gml`: eventual resource under
`Scripts > MM1 > Cut Man > Weapon Get`, read-only256x240 GUI renderer.
The final screen GUI owner must render after stage/HUD; no hook is installed yet.

`layout.json` gives exact source hashes, coordinates, colour mapping and limits.
`custom-rolling-cutter-screen-preview.png`: native-size review.
`custom-rolling-cutter-screen-preview-4x.png`: crisp4x review, NOT an import sprite.

Reproduce with supplied ROM and ignored native scene snapshots:
```
node tools/rom-recovery/probe-mm6-weapon-award.mjs
node tools/rom-recovery/build-cutman-weapon-screen.mjs
node tools/rom-recovery/test-cutman-weapon-screen-design.mjs
```
The test executes this actual GML Draw plus the accepted actual MM5 font script
through a PNG raster harness, and checks every pixel against the review image.
This is not GMS compilation/GPU/appearance acceptance.

Remaining after visual approval: animated reveal/typing, native-MM6-style demo
adapted to actual Rolling Cutter, music lifetime/full-cycle handling at approved
original volume, once-only screen completion/return, complete installation package.
Do not set screenDone on a timer to bypass the unfinished demonstration.

Latest user review: grey/white portrait and removal of menu row approved.
Top Cut Man nameplate subsequently removed on request; no boss-name box on this
or future weapon-get screens. Main weapon title and bottom acquired plaque stay.

## Final static appearance approved

User confirmed “yes!” after removal of the top Cut Man box.
`appearance-approval.json` locks the approved preview hash and exact design scope.
Keep this layout while implementing reveal/typing,weapon demo and audio/return
ownership. Static appearance approval is not installed/runtime acceptance.

## Animated reveal/text and music connected in source

The sole victory coordinator now initializes/advances the screen in phase8.
`Scripts/scr_mm1_cutman_weapon_screen_enter.gml` creates one draw-only overlay;
`weapon_screen_step` uses the same pause/refill-aware shared tick as phase/motion.
`Screen/scr_mm1_cutman_weapon_screen_present.gml` is the read-only actual renderer.

Custom presentation timings (NOT claimed native MM6 timings):
- Entry: mechanical frame and bottom acquired plaque; character/name not yet shown.
- Updates1..48: bottom-to-top reveal of original grey/white portrait,2pixels/update.
- Update60: YOU GOT typing begins, one original MM5 glyph every4 active updates.
- Update100: ROLLING CUTTER typing begins, same4update cadence; complete at152.
- Update220: request the demonstration; hold the exact approved static composition.
- Screen completion requires actual future demonstration acknowledgement. No timer,
  music end, Start button or long wait substitutes for the unimplemented demo.

`Objects/obj_mm1_cutman_weapon_screen_create.gml`: no sprite, Visible ON, Solid OFF,
Persistent OFF, depth-30000 after accepted HUD(-10000) and pause(-20000). ONLY Create
and Draw GUI events; no Step/input/collision clock. Draw GUI finds the boss and
reads its screen fields; the full frame covers gameplay/HUD and also holds phase9
until room return. Cancel/abort removes the visible overlay through phase guarding.
These are future connected package boundaries, NOT instructions to import now.

Approved MM5 original-level finite excerpt now starts once on serialized event6,
using `snd_mm5_weapon_get` from approved `snd_mm5_weapon_get_review_excerpt.wav`.
Default gain1, no2x boost/normalization; stop stale owned clear voice only. Freeze,
resume,cancel,finish,Room End/Destroy include the new voice. No global stop-all,
custom/MM6 music fallback, forced restart, or unverified loop. The11.482second
excerpt is finite: screen progression never depends on its end. Full-cycle/loop
handling remains a separate issue if final screen/demo duration requires it.

`custom-rolling-cutter-reveal-preview.gif` is a SILENT looping3x preview of actual
GML-rasterized states, sampled every4active updates, with an extra review-only end
hold. It is NOT a playback acceptance recording or final demo animation.
`test-cutman-weapon-screen-animation.mjs --export` writes its input PNGs to ignored
`.work/weapon-screen-animation/`. The actual fully revealed GML raster matches the
approved static image pixel-for-pixel.10000updates without a real demo never grant.

Remaining: actual Rolling Cutter demonstration/acknowledgement; final return flow
and stage-select presentation test; complete GMS installer and runtime acceptance.

### Reveal and typing approved

User approved the animated preview from ec5e129.
`animation-approval.json` locks the GIF hash and approved presentation scope.
Preserve reveal/typing and final approved composition while adding the actual
Rolling Cutter demo. Demo completion and GMS installation/runtime remain pending.

## Actual Cutter demonstration — source implemented, installation pending

The approved reveal/typing/layout are unchanged. At update220, the shared owner
starts a lower-left grey/white MM5 player demonstration:30-update preparation,
throws at demo ages30 and150, native catch acknowledgements at101 and221, then a
90-update tail. Only two native catch acknowledgements plus that tail permit
screen completion. The existing phase9 receiver then grants Cutter once and
returns to stage selection. No score or tanks are awarded here.

This is **fixed native demonstration playback**, not a general-purpose gameplay
Rolling Cutter AI. `Reference/player-cutter-demo.json` records a fresh USA native
player throw after actual native weapon-menu selection, separate from boss AI.
230 annotated player-control bytes were independently matched to USA ROM;
2588 visible projectile pixels matched native output. Final player-occluded
pixels are disclosed separately. Renderer-aligned positions and both original
poses are replayed together at60Hz, translated only, not an invented curve.
MM5 idle/shoot art changes only blue/cyan armor slots to grey/white.

New scripts: `scr_mm1_cutman_weapon_demo_step` and
`scr_mm1_cutman_weapon_demo_sample`. New Screen sprites, all origin0,0:
`spr_mm5_cutter_demo_idle`32x32(single), `spr_mm5_cutter_demo_throw`40x40(single),
`spr_mm1_player_rolling_cutter_demo_strip2`(two16x16 cells).
Do not install these separately: the connected incremental package remains pending.

The approved existing `snd_mm1_cutman_rolling_cutter_throw` (native25) fires
once for each throw, through the audio owner, never Draw. Its voice participates
in pause/resume and terminal/cancel/Room End disposal. MM5 weapon-get remains
once-only, unboosted gain1. `test-cutman-weapon-demo.mjs` exercises actual GML
screen/demo/audio together; coordinator regression reaches phase9/reward request.
The inventory receiver has its own once-only grant/return regression.

`custom-rolling-cutter-demo-preview.gif` is a silent3x actual-GML raster preview
including approved reveal, both throws and catches, plus review-only final hold.
GIF cannot preview the implemented sound. It is not installed GMS acceptance.


## New MM6-sequence approval GIF (supersedes custom timing direction)

User requested keeping our custom look but following MM6 animation and sequence.
`custom-rolling-cutter-mm6-sequence-review.gif` is the new **approval-only** GIF.
It uses native MM6 centre pose animation/flash,40-update rightward slide,
continuous4-update character typing,90-update hold,large-portrait fade/replacement,
30-update small-player preparation,25-update fade,10-update wait,240-update
weapon-demonstration loop,90-update tail and exit fade. Our longer weapon title
adds24 typing updates. Blue/steel art,grey/white weapon colour and MM5 font remain.
No Beat part/password/score scenes are added.

The small demonstrator replaces the large portrait in the right pane; its
custom vertical placement keeps a leftward Cutter clear of the custom title.
The native Cutter busy lock means the MM6 stage0 firing attempts at64-update
intervals produce two actual throws, not overlapping Cutters. Their original
player-native72-sample return/catch traces are retained. Palette fades are
custom approximations of MM6 luminance transitions, not palette-bit-exact.
The silent GIF does not change approved music or25 sound requirements.

Reproduce with `probe-mm6-enemy-hit.mjs` (stage fixture), then
`probe-mm6-screen-timing.mjs`, then `render-mm6-style-cutter-review.py` with Pillow.
Native timing events/ROM hash are archived in
`Reference/mm6-screen-sequence-timing.json`; adaptations/GIF hash in
`Reference/mm6-sequence-review.json`. This new timing is awaiting user approval;
the previous actual-GML source is deliberately not replaced until approved.

### MM6-sequence approval recorded

User accepted the new GIF with **“yes”**. `mm6-sequence-approval.json` locks
the exact approved GIF hash and scope. This replaces the earlier custom timing
approval, not our custom appearance or approved audio. Updated runtime timing
integration and connected GMS installation/runtime acceptance remain pending.


### Approved MM6 sequence integrated in source

The current screen Enter/Step/Draw now implements the approved sequence through
update814. The initial164 updates use22 deduplicated256x240 intro subimages,
from the exact approved generator (assembly/flash, not an independent timer).
`spr_mm1_cutter_screen_intro_strip22` has origin0,0;22 cells256x240, no scaling.
After that, live Draw uses separate sprites/font,40-update slide,continuous
4-update typing,90-update hold,portrait fade/replacement,small-player preparation
and fade,240-update MM6 cadence,90-update tail and20-update exit fade.

New `scr_mm1_cutman_weapon_screen_intro` selects shared-clock intro frames.
New origin0,0 mirrored resources:`spr_mm5_cutter_demo_idle_left`32x32,
`spr_mm5_cutter_demo_throw_left`40x40, and
`spr_mm1_player_rolling_cutter_demo_left_strip2`two16x16 cells. The mirrored
resources exactly retain the approved GIF's alignment, not a collision mask.
The native busy-lock produces actual throws at484/612 and catches555/683.
Only both native catches plus completed exit fade acknowledge screen completion.
Approved25 audio remains once per actual throw, with owned pause/resume/disposal.

Actual-GML raster compared across408 approved samples:maximum component delta1
(original MM5 off-white glyphs/integer tint rounding), no layout/geometry/timing
differences. Actual-GML coordinator reaches phase9/reward request with two real
catch acknowledgements. The separate reward suite verifies once-only inventory
and stage-select return. No GMS compile/render/audio acceptance is claimed.

**Do not install these files piecemeal.** Connected incremental GMS package and
runtime validation remain pending. The approved MM5 audio resource is still the
unboosted finite11.482s take, not a proven full-cycle loop; the new13.57s screen
is longer, so full-duration music playback needs verification before packaging.

### Extended MM5 music recovered for listening approval

`Audio/Review/mm5-weapon-get-extended-native-review.wav` now covers15.392s,
including continuous music through the13.57s approved screen. Every one of the
551145 approved stereo PCM samples is byte-identical at the start; original
peak0.41943359375 is unchanged. No amplification/stretching/PCM loop or padding.
The native driver continues after suppressing the later menu13 command at its
entry (documented CPU instrumentation); nativeF0 stops it after900updates with
24tail updates. This is a finite continuation, not a proved seamless loop.
See `Reference/mm5-weapon-get-extended-recovery.json` and
`test-mm5-weapon-get-extended.mjs`. The production resource remains untouched
until listening approval of the extended take, per the standing audio direction.
