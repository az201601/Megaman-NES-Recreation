# Cut Man spikes — GMS1.4.1760 installation

Requires the working eight-enemy/Screw Bomber + final sprite fixes, fixed large health, accepted Free Fall/Jumping Gates, and existing ten scripted spike objects. Back up the working project and stop the runner. Manual source patch, not an importable GMX.

**No new sprites, sounds, objects, room instances, manager initialization or events. No terrain, movement, player, camera, gate, enemy, pickup or death-resource replacement.** This activates the ten spikes already placed by the stage feature script.

## Rules / the invincibility fix

- Contact without protection is lethal at any health, including full28.
- BOTH existing MM5 recoil (`mm5_hurt_left > 0`) AND subsequent flashing (`mm5_invulnerable > 0`) protect against spikes. Do not transplant MM1's unprotected spike-death path.
- **Check contact every active combat update.** No enter-only Collision event, one-time touched flag, or permanent safe flag. If protection expires while still touching a spike, the next eligible check kills immediately—no need to move away and touch again.
- The original MM5 hazard guard samples before the flash counter decrements; initial counters1/2/60 allow1/2/60 guarded updates, then lethal continuous contact on2/3/61. The existing project timer ordering is retained.
- Uses ordinary `scr_mm5_combat_die`, NOT pit-death wrapper: normal16-particle explosion, accepted stage-music stop/death cue/countdown/life/retry. Pit death remains particle-free.
- Hazards are checked after entity contact (a new nonlethal hit can establish recoil protection), before pickup collection (an unprotected spike death cannot be undone by health collection). Arrival, refill, route handoffs, death and the existing pause owner retain their locks.

## 1. ONE new Script

Folder **Scripts → Stages → MM1 → Cut Man → Hazards** (create folders if absent).

Create **`scr_mm1_cutman_spike_contact`**. Paste the WHOLE matching **`Scripts/scr_mm1_cutman_spike_contact.gml`**, save.

This is a Script resource. Do NOT paste it into the spike object's Step or Collision event.

## 2. REPLACE ONE complete existing Script

Folder **Scripts → Mega Man → MM5 → Combat**, or its current folder.

Open existing **`scr_mm5_combat_end_frame`**, select ALL code, replace with the WHOLE **`Scripts/scr_mm5_combat_end_frame.gml`**, save.

It retains the latest fixed-health/eight-enemy version, adding only the hazard dispatch and early exit after lethal contact. **Do not use an earlier Blader/Blaster/Screw-only end-frame replacement** or the fixed large health will lose its spawn call.

Do not change `scr_mm5_combat_pickup_step`, refill/collect/damage/die scripts, player events, manager Create/Draw, camera events, geometry/feature scripts, doors, audio or sprites. **No manager append is required.** No second hazard call or movement/collection pass.

## 3. Existing spike object settings — verify only

Folder from the installed stage resources: **Objects → MM1 → Cut Man → Stage → Hazards → `obj_mm1_cutman_spike`**.

Keep existing:
- Sprite **`spr_mm1_cutman_spike`**, sprite origin **0,0**,16×16; no scaling/repainting/cropping/mask edits.
- Parent **None**, Visible ON, Solid OFF, Persistent OFF.
- Existing Create (depth999, image_speed0, image_index0).
- **No Step, Draw, Collision, Room Start or other new events.** Automatic sprite drawing remains intended.

Do not replace Create merely because its historical comment says damage was deferred. The new centrally owned script now handles lethality. Platforms below the spikes remain separate invisible solids; do not make spikes solid or give them a terrain parent.

The feature script already creates ten spikes: `(2000,528)`, `(2016,528)` and `(1920,688)` through `(2032,688)` every16pixels. Leave all positions and stage calls unchanged. No editor placement.

## 4. Compile and installed playtest

1. Compile. An unknown `scr_mm1_cutman_spike_contact` means step1 is missing or misspelled. An unknown spike object means the earlier Tenth/Eleventh stage hazards were not installed; do not create duplicate or differently named resources.
2. Reach the two spike platforms in the right-hand descending section. At full health, land/touch either platform without invincibility: one death cue, normal explosion, one life lost after the accepted delay. Check both upper tiles and the lower row.
3. Take a nonlethal enemy hit and touch spikes during recoil/flashing: survive while protected. Verify the normal MM5 flashing appearance and existing movement remain unchanged.
4. **Critical regression:** remain touching a spike until flashing ends. Death must occur on the first unprotected hazard check, with no fresh entry or movement needed. Do not treat visual white/black blink phases as separate immunity states; the actual counter governs protection.
5. Leave the spike before invincibility expires: survive; after protection ends, touching it again must be lethal. Repeat after another enemy hit to rule out a stale safe flag.
6. Check standing, airborne/landing, climbing into contact and sliding. Slide has the controller's wider/shorter collision envelope; invisible triangle corners are not safe pockets.
7. Pause/resume nearby and while flashing; health-refill freeze/arrival/ladder/free-fall/gate handoffs must not cause extra hazard updates. Protection resumes on the existing clock.
8. Pit death must still omit explosion particles. Ordinary enemy lethal damage/spike death must still show the explosion. Death cue/music stop/life loss must happen once, not per spike tile or per frame.
9. Recheck fixed large health at1832,184, random health drops/refill, eight accepted enemies, Screw's final art and both walking/jumping doors. Those resources are not replaced.

## Collision policy and evidence limits

A spike is a full16×16 hazard tile at the existing top-left anchor, not the PNG's triangular alpha mask. The player's numeric hazard envelope follows the accepted rectangular controller: standing X±7, top `head_offset`10, inclusive feet probe `feet_offset`12; slide X±14/topY−3/same feet reference. Integer sampling uses floor. The envelope is an explicit rectangular-project adaptation, **not a claim that every corner/approach matches all original MM5 metatile probes**. No collision/solid geometry is added or removed.

`Reference/native-mm5-spike-guards.json`: supplied MM5USA original guard/dispatch/terrain-marker bytes; fresh Napalm boot and controlled F0 lethal classifications at original terrain queries, timers0/1/2/60 plus isolated state6 guard samples. Counter expiry/recoil guard/death16particles/onecue verified. Vertical placement is controlled to exclude pits; no natural whole-stage spike traversal, hardware or Mesen-executable claim. Existing independent MM5 hurt trials establish the27-update recoil→60flashing policy; this patch does not replace it.

Actual-GML model tests check8580 integer/subpixel/body boundaries, all10 anchors, stationary timer expiry/recoil→flash, contact/refill priority, deathparticles/audio/retry/guards and exact accepted central-source preservation. **Source/emulator/model checks are not GMS1.4 compiler/runtime or your installed acceptance. Please report compilation and the invincibility-expiry playtest.** No ROM/savestate/disassembly is shipped.
