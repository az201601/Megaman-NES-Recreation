# MM5 arrival — first artwork import and audio review

Prerequisite: user confirms ladder-top basic/charged shooting installed and tested working. Existing player controller remains unchanged at this checkpoint. GMS1.4.1760; no GMX or GMS2 syntax.

## Import one Sprite only

Create folder Sprites > Mega Man > MM5 > Arrival.
Create Sprite resource named EXACTLY spr_mm5_megaman_arrival (without _strip5).

Edit Sprite > File > Create from Strip, source spr_mm5_megaman_arrival_strip5.png:
- 5 images,5 per row.
- Cell width32,height48. Whole sheet160x48.
- All offsets/separations0.
- MANUAL origin X16,Y24. This is NOT the usual player origin16,16: this arrival canvas includes extra top padding for the tall beam.
- No crop/resize/remove background. Verify5 subimages,32x48.

Existing player sprites mostly use16,16; do NOT change them. Do NOT assign this new sprite to obj_mm5_megaman, modify its mask, add room instances, set animation speed, or edit Create/Step/Draw yet. Event-controlled phase selection comes later.

These are teleport beam/flash/materialization effects, not five fully assembled Mega Man poses. Native beam0 repeats2 and effect3 repeats in final observed phase4 before returning to existing normal idle. All original effect components use body palette0, with no face component; existing idle provides normal face afterward. No missing face has been removed/invented. Five phases are not equal-duration frames: don't test with automatic image_speed animation as final timing.

## Review audio, don't import a Sound yet

Play included mm5-arrival-review.wav locally. Full original APU,48000Hz stereo16bit,0.1853958333seconds. Music stopped with original F0 request before arrival. No channel isolation/synthesis/gain/resampling; only silence trimmed with5ms padding. Exactly one original sound request2Dhex at ground contact in measured run; no ordinary shot/charge/landing effect mixed into clip. Please approve sound before naming/importing the final Sound resource. No beam-start sound added by guess.

## Natural-ROM observations (not installed controller behaviour)

mm5-arrival.mjs starts naturally from existing MM5 select snapshot, chooses Napalm Man with Right+Start, no player/ROM patch and no inputs after Start. Update numbers relative to Start:
-529 player actor created, animation1Ahex (READY sequence).
-572 state08, READY phase timer starts; remains READY through661.
-662 beam descends, animation13hex/phase0, Y8.25.
-17 free downward moves:8.25,8.5,...12.25; the18th attempts12.5 and hits ground, final collision snap679 Y180.75 at floor192. Ordinary fall-speed cap7 must NOT be assumed for teleport.
-679 sound2Dhex requested at contact, beam phase0 still selected.
-680/683/686/689 phase1/2/3/4. Native post-contact subpixel Y varies while integer anchor remains180.
-690 returns state00, normal idle animation01hex, Y180.5.

These are CPU post-update observations. OAM display runs one update behind: component samples use pre-update anchor/animation and next original PPU/OAM state. At690 observed phase4 picture still matches phase3; ordinary idle appears in OAM691. Graphics/GMS integration should not confuse counters with exact first hardware pixel timing. READY artwork/control gate, held/fresh input arbitration, alternative spawn floors, collision adaptation and all transition priorities still pending before controller delivery. No complete1:1 claim.

## Provenance / repeatability

Tools: mm5-arrival.mjs -> extract-arrival.mjs + record-arrival.mjs. Original USA ROM, JSNES2.1.0. Approved Mesen0.9.9 default palette adapter; NOT direct Mesen runtime captures or generated artwork. Assert natural state/timing/descent/contact/sound; exact OAM tiles/counts, no clipping, original palette components, repeated phase equality. Sound run restores pre-arrival snapshot556, sends F0 at557, verifies exact-zero silence650..678, original arrival request679 only. Music stop is explicitly modified; player/arrival routines unaltered. Large snapshots/reference traces kept ignored in .work.
