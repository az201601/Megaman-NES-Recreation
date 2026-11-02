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
