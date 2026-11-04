# Blaster checkpoint — GMS 1.4.1760 manual installation

**Back up the working GameMaker project first. Stop the runner.** This update assumes the accepted Blader combat/health/drop package is installed, including its single camera-End-Step combat pass and working louder audio mix. Do not reinstall the old Blader ZIP or overwrite the accepted loud effects with quiet masters.

Download/extract `Downloads/mm1-blaster-combat-gms14.zip` from GitHub into a new folder. Paths below refer to that ZIP. Complete every step before running. This is source/resource delivery, not a compiled GMX.

## 1. Import two sprites

Create resource folder **Sprites → Enemies → MM1 → Blaster**. If a named resource already exists, update/check that resource rather than making a suffixed duplicate.

### Shell: spr_mm1_blaster

1. Right-click the folder → **Create Sprite**. Name it `spr_mm1_blaster`.
2. Click **Edit Sprite** → **File → Create from Strip**.
3. Choose `Art/spr_mm1_blaster_strip4.png`.
4. Set **Number of images = 4**, **Images per row = 4**, **Image width = 16**, **Image height = 16**.
5. Set every cell/pixel offset and horizontal/vertical separation to **0**.
6. Confirm the strip import. Verify **four separate16×16 subimages**, not one64×16 image.
7. Close the image editor with its green check. Manually set **Origin X8, Y7**. Do **not** click Centre afterward.
8. Save the sprite.

### Bullet: spr_mm1_blaster_bullet

1. Create another Sprite resource in the same folder. Name it `spr_mm1_blaster_bullet`.
2. Use **Load Sprite**, selecting `Art/spr_mm1_blaster_bullet.png`.
3. Verify **one8×8 subimage**.
4. Manually set **Origin X4, Y3**. Save.

Both: retain PNG transparency, no Remove Background/Smooth Edges, no cropping/resizing/repainting. Leave texture settings at defaults. Combat uses explicit numeric bounds, not masks; default masks are fine. Preview playback speed does not control game animation. The recovered shell is left-facing; code mirrors for right-facing variants.

## 2. Import two approved sounds

Under **Sounds → Mega Man → MM1 → Blaster**, create/reload:

- **Resource:** `snd_mm1_blaster_fire` → **File:** `Audio/snd_mm1_blaster_fire.wav`.

This is the user-approved final live-shot recording with only its silent padding trimmed. Do not use an earlier firing preview or the full four-shot recording.

Under **Sounds → Mega Man → MM6 → Combat → Blocked Hit**, create/reload:

- **Resource:** `snd_mm6_blocked_hit` → **File:** `Audio/snd_mm6_blocked_hit.wav`.

This is the approved MM6 ding, not the rejected MM1 cue.

For each: open Sound properties → Load Sound → select the named WAV → keep normal uncompressed playback/default gain1 → save. Both already include the accepted2x sample-amplitude boost. **Do not boost again.** They are triggered non-looping by code. Keep the already-approved louder `snd_mm6_enemy_hit`, all existing gameplay sounds, both charge Included Files and stage music0.85 untouched.

## 3. Import five NEW scripts

Create folder **Scripts → Enemies → MM1 → Blaster**. Right-click → Create Script. For each name below, paste the complete identically named file from `Scripts/`, then save:

- `scr_mm1_blaster_step`
- `scr_mm1_blaster_hit`
- `scr_mm1_blaster_world_step`
- `scr_mm1_blaster_contact`
- `scr_mm1_blaster_spawn`

There are **five** new scripts (not one per object/event). Only the two existing scripts in Step6 below are replacements. Never import files from Objects/ or Hooks/ as Script resources.

## 4. Create two NEW objects

Create folder **Objects → Enemies → MM1 → Blaster**.

For **both** objects use: **Sprite `<no sprite>`**, **Visible checked**, **Solid unchecked**, **Persistent unchecked**, **Parent `<no parent>`**, mask/depth defaults. Code chooses artwork/depth. No manual room placement.

### obj_mm1_blaster

1. Right-click folder → Create Object. Name it `obj_mm1_blaster`.
2. **Add Event → Create**. From Control actions add **Execute Code**. Paste the whole `Objects/obj_mm1_blaster_create.gml` file.
3. **Add Event → Draw → Draw** (ordinary Draw, not GUI/Begin/End). Add Execute Code. Paste all of `Objects/obj_mm1_blaster_draw.gml`.
4. Save. Its only events are **Create** and **Draw**.

### obj_mm1_blaster_bullet

1. Create Object named `obj_mm1_blaster_bullet` with the same settings.
2. **Create → Execute Code:** complete `Objects/obj_mm1_blaster_bullet_create.gml`.
3. **Ordinary Draw → Execute Code:** complete `Objects/obj_mm1_blaster_bullet_draw.gml`.
4. Save. Its only events are **Create** and **Draw**.

**No Step, Begin Step, End Step, Collision or Destroy events on either new object.** No inherited terrain parent. Do not manually place cannons/bullets in any room.

## 5. Append two existing Create events — do not replace

### Existing obj_mm5_combat → Create

Under **Objects → Mega Man → MM5 → Combat**, open `obj_mm5_combat`, select **Create**, and open its current Execute Code action.

Scroll to the very bottom. **After the existing `depth = -12;` line**, append the complete contents of:

`Hooks/obj_mm5_combat_create_blaster_append.gml`

Keep every old line above. Append this **once only**. It adds the11 original cannon anchors, facing and initial timer stagger without replacing the9 Blader records or health/death fields.

### Existing obj_mm5_buster_shot → Create

Open the parent normal-buster object `obj_mm5_buster_shot`. In its existing **Create → Execute Code**, append at the very bottom:

`Hooks/obj_mm5_buster_shot_create_blaster_append.gml`

The added code is just:

```gml
mm5_shot_deflected = false;
```

Keep all existing initialization. Do not add this to player Create. Both charged objects must retain parent `obj_mm5_buster_shot` and their existing `event_inherited();` in Create, so they receive this variable too. Do not replace their existing Create events.

## 6. Replace two EXISTING Script resources

Under **Scripts → Mega Man → MM5 → Combat**, open each existing script below, select its entire contents and replace with the complete same-named file in this ZIP's `Scripts/`:

1. `scr_mm5_combat_end_frame`
2. `scr_mm5_combat_shot_step`

These full replacements retain the accepted Blader/health/drop processing while adding cannon movement, shots, contacts and spawns to the **same** central pass. Do not append them below the old script contents, make suffixed copies, or create an additional pass.

**No camera event edits this time.** The existing camera End Step still calls `scr_mm5_combat_end_frame` after the accepted view update. Leave its helper and wrapper alone. Keep manager Begin Step/Draw/cleanup, player Step/Draw/hurt/health, projectile End Step hooks, pause restore, route features and stage/music code unchanged. There is no new stage-install call: the already-installed manager now owns both enemy types.

## 7. Fresh compile/run and checklist

Stop any old runner and start fresh. If GameMaker reports an error, send the exact resource/event/line and error text; do not adjust room/view coordinates to compensate.

1. Existing READY/arrival,28HP,02 spare lives, music balance, Bladers, pause, firing/charging, ladders and gates still work.
2. Opening two cannons appear at(824,1992) and(952,2040), attached to their original walls. Further groups of3 occur on the next three vertical ladder screens. No duplicate room instances or manual placements.
3. Each cycles closed/open/closed and fires4 shots,32 active updates apart, in four fixed diagonal paths. Later variants keep their original38-update initial stagger. No continuous homing. Each bullet fires the approved sound once, not every movement step.
4. Closed-shell normal/mid/full impacts play the MM6 ding once and bounce up/back without killing the cannon, spawning an explosion or rolling a drop. Deflected shots must not hit other enemies. Return to ordinary shots after they leave view; no permanent three-shot cap lock.
5. During opening/open/closing, normal or mid kills in one accepted hit; full kills and continues through. Successful impacts use the existing approved MM6 hit sound, not the ding. A cannon killed in that pass must not damage the player afterward.
6. Native contact values: cannon body1HP, bullet2HP. Same accepted MM5 recoil/protection and interruption rules as Blader. Test standing, sliding, jumping and ladder contact; existing post-hit protection prevents repeated health drain.
7. Cannon death uses the existing explosion and exactly one MM5 drop roll (or none). Bullet cleanup, misses, wall passage and route cleanup must never roll drops.
8. Pause and health refill freeze cannon timers, bullets and deflected shots; normal music/charge ownership remains as accepted. No extra fire or double movement after resume.
9. Ladder/return/gate transitions clear outgoing cannons/bullets without drops. Moving out of an anchor's view and returning may rearm it, but an active record must never duplicate. Test all three ladder-screen groups, including right-facing cannons.
10. Death/retry retains the existing disclosed stage-opening retry/title adaptation. No checkpoint/Game Over UI changes here.

All scripts were source/mock tested, **not compiled or run in Windows GMS1.4 here**. Preserve the backup until drawing/origins, all route placements, collision edges, pause/refill, charged reflection and audio overlap pass in your project.

## Explicit hybrid choices

Original MM1 basic damage and vulnerability cycle are recovered. MM1 has no charged buster: allowing MM5 mid/full to kill an exposed1logicalHP cannon and fullcharge to pierce is this recreation's adaptation. All blocked player-shot sizes bounce up/back4px per active update; no native MM1-charge or native-MM5-reflection equivalence is claimed. New enemy bullets wait until the next central update to move/contact, matching the package's deterministic scheduler policy rather than asserting NES slot-order/OAM latency equivalence. Bullet collision uses recovered1×1 extents plus existing MM5 player/slide extents; successful bullet contact consumes that bullet. Rectangular bounds, uniform-byte MM5 drop selection, screen-edge cleanup and scripted-route translations remain hybrid adaptations. Only contact amounts/AI/table evidence are called original, not the entire GMS integration1:1.
