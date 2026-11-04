# READY + arrival — resource checkpoint, GMS1.4.1760

Use this combined pack instead of earlier arrival-only pack. User has imported nothing yet. Both READY and teleport arrival are included. Final flow: stage visible -> flashing READY with control locked -> descending beam -> arrival effect at ground -> materialization -> existing player controller. This checkpoint imports two Sprites and reviews sound ONLY. No controller/event changes yet.

## Resources

Create Sprites > Mega Man > MM5 > Arrival (resource folders).

1. Create Sprite spr_mm5_ready. Load spr_mm5_ready.png normally (NOT a strip). Verify one40x8 image. Manual origin X20,Y3. No resizing/cropping/background removal. The origin reproduces native actor128,128 -> glyph bounds108..147,125..132. Invisible phases will be handled by code, no blank Sprite needed.

2. Create Sprite spr_mm5_megaman_arrival. Edit Sprite > File > Create from Strip, source spr_mm5_megaman_arrival_strip5.png. Five images, five per row, cells32x48, ALL offsets/separations0. Manual origin X16,Y24 (not normal player's16,16). Verify5 subimages32x48. Name resource WITHOUT _strip5. Beam/flash phases intentionally repeat; these aren't five assembled player poses. Existing idle provides assembled Mega Man afterward. Do not auto-animate it as final timing; later code owns phases.

3. Play mm5-arrival-review.wav locally. Please confirm the sound before creating/importing a Sound resource. This is full original APU with original F0 music-stop request, no channel isolation/synthesis/gain/resampling. Silence-only trim with5ms padding,48000Hz stereo16bit,0.1853958333seconds. Original2Dhex request at beam ground contact; don't invent a beam-start or READY beep. Queue/capture details in IMPORT-GMS14.md in repository (older arrival-only guide).

Do NOT assign these sprites to player object or change its mask. Do NOT add room instances/Create/Step/Draw code or alter stage music/room speed. Existing working player remains unchanged. Save project after imports. Confirm READY1x40x8, arrival5x32x48, origins20,3 and16,24, and audio audition result.

## Measured timing and limits

Natural Napalm Man start, normal gravity, supplied MM5 USA ROM in JSNES2.1.0. No player/animation/ROM patches. Original READY anim1Ahex uses original tiles81..85hex/palette4; blank phases use transparent tile7Fhex/palette0 (assert every source pixel0). Alternates6updates visible/6blank in recorded interior phases. State08 READY interval572..661 lasts90updates; hardware OAM phase edges lag logic. Beam anim13hex starts662 at Y8.25; ground/sound679; materialization phase transitions680/683/686/689, idle state00/anim01hex690, idle OAM691. See original arrival guide for subpixel/collision and palette provenance. Numbers are relative to original Start press, not recommended hard-coded GMS room timeline.

ready-arrival.mjs verifies visible tile sequence, blank actual transparency, all sampled phase memberships, six-update cadence, and paints exact OAM/CHR components with approved Mesen0.9.9 palette. Not a direct Mesen runtime capture or generated/redrawn lettering. mm5-arrival.mjs/extract-arrival.mjs/record-arrival.mjs assert natural arrival timing, phase components/bounds/repeats and isolated-from-music full-APU recording. Large snapshots ignored in .work. To regenerate, first mm5-start.mjs if select snapshot absent, then mm5-arrival.mjs, ready-arrival.mjs, extract-arrival.mjs, record-arrival.mjs.

This is not yet an installed/accepted combined controller. Input arbitration (held/fresh buttons), READY activation versus room load/music, alternative spawn positions/floors, GMS collision and handoff remain to be implemented/tested before integration. No complete1:1 claim.
