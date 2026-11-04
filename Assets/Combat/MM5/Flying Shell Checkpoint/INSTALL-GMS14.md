# Flying Shell / Shellgun — GMS 1.4.1760 manual installation

**Back up the working project and stop the runner first.** This update assumes the user-accepted Blader, Blaster, corrected Super Cutter, Flea and Octopus Battery installations. Do not reinstall earlier combat ZIPs.

Extract `mm1-flying-shell-combat-gms14.zip` from GitHub into a new folder. Paths below refer to the extracted ZIP. Complete all steps before compiling. Manual resource/source package, not an importable GMX.

## 1. Import TWO new sprites

Create resource folder **Sprites → Enemies → MM1 → Flying Shell**. If a named resource exists, update/check it instead of creating a suffixed duplicate.

### Body — spr_mm1_flying_shell

1. Right-click → **Create Sprite**, name `spr_mm1_flying_shell`.
2. **Edit Sprite → File → Create from Strip**, choose **`Art/spr_mm1_flying_shell_strip2.png`**.
3. **Number of images = 2**, **Images per row = 2**, **Image width = 17**, **Image height = 24**.
4. All starting pixel/cell offsets and horizontal/vertical separations **0**. Confirm.
5. Verify **two separate17×24 subimages**, closed then open, not one34×24 image. The closed pose has padding; the open middle tile pair really extends1pxright. Do not crop, resize or straighten it.
6. Close editor with its green check. Manually set **Origin X8, Y11**. Do not click Centre afterward. Save.

### Bullet — spr_mm1_flying_shell_bullet

1. Create Sprite `spr_mm1_flying_shell_bullet` in the same folder.
2. **Load Sprite** → **`Art/spr_mm1_flying_shell_bullet.png`**.
3. Verify **one8×8 subimage**, manually set **Origin X4, Y3**, save.

Both retain PNG transparency, no smoothing/Remove Background/cropping/repainting, default mask/texture settings. Collision uses numeric bounds. The later-room bullet color is native salmon; **do not overwrite `spr_mm1_blaster_bullet`**, which retains the accepted earlier-room magenta palette.

## 2. Import ONE new sound — leave accepted sounds alone

Create folder **Sounds → Mega Man → MM1 → Flying Shell**.

1. Create Sound resource **`snd_mm1_flying_shell_fire`**.
2. Load **`Audio/snd_mm1_flying_shell_fire.wav`**.
3. Normal uncompressed playback/default gain1; save. Code plays it non-looping.

This is **one real full-APU eight-request native burst**, not eight copies of the Blaster WAV. It already has the established2×sample-amplitude gain and silence-only trimming. **Do not boost again.** Its separate filename avoids replacing any approved Blaster firing, MM6 ding/hit, MM5 firing/charge/hurt/refill/life, Included Files or stage music85%.

This new recording is supplied for your listening/runtime confirmation; it is **not previously user-approved merely because older effects were accepted**. If you want to audition before importing, use the separately linked GitHub native-burst WAV (same samples). The full-tail audit recording remains in the repository, not an import file. No synthesized/faded/pitch-adjusted effect.

## 3. FIVE new Script resources

Create folder **Scripts → Enemies → MM1 → Flying Shell**. Create each Script resource below; paste the entire identically named file from `Scripts/`, then save:

- `scr_mm1_flying_shell_step`
- `scr_mm1_flying_shell_world_step`
- `scr_mm1_flying_shell_spawn`
- `scr_mm1_flying_shell_hit`
- `scr_mm1_flying_shell_contact`

Objects/ and Hooks/ files are not Script resources. Do not add scripts as actor Step events.

## 4. TWO new objects — exact settings/events

Create folder **Objects → Enemies → MM1 → Flying Shell**.

### Body — obj_mm1_flying_shell

1. Create Object `obj_mm1_flying_shell`.
2. **Sprite `<no sprite>`**, **Visible checked**, **Solid unchecked**, **Persistent unchecked**, **Parent `<no parent>`**. Default editor mask/depth; code draws and sets depth.
3. **Create → Execute Code:** entire **`Objects/obj_mm1_flying_shell_create.gml`**.
4. **Ordinary Draw → Execute Code:** entire **`Objects/obj_mm1_flying_shell_draw.gml`**. Not GUI/Begin/End Draw.
5. Save. Only Create and ordinary Draw.

### Bullet — obj_mm1_flying_shell_bullet (IMPORTANT PARENT)

1. Create Object `obj_mm1_flying_shell_bullet`.
2. **Sprite `<no sprite>`**, **Visible checked**, **Solid unchecked**, **Persistent unchecked**.
3. Set **Parent = existing `obj_mm1_blaster_bullet`**. This is deliberate projectile inheritance, **not a terrain parent**. It lets the already accepted central bullet movement/contact/cleanup pass include these children exactly once while their own Draw uses the correct later-room palette.
4. **Create → Execute Code:** entire **`Objects/obj_mm1_flying_shell_bullet_create.gml`**. This initializes all shared bullet fields explicitly; do not add an extra inherited-event action.
5. **Ordinary Draw → Execute Code:** entire **`Objects/obj_mm1_flying_shell_bullet_draw.gml`**. This overrides the parent's ordinary Draw.
6. Save. Only Create and ordinary Draw.

**No Step, Begin Step, End Step, Collision or Destroy events on either new object. Do not edit the existing Blaster bullet object's events. No manual room instances or generator objects.** The child bullet's parent selection is required; a parentless bullet would draw but never enter the shared movement/contact pass.

## 5. Append ONE existing Create event — do not replace

Open **Objects → Mega Man → MM5 → Combat → `obj_mm5_combat` → Create → Execute Code**.

Scroll to the very bottom, after accepted Octopus Battery initialization. The last existing record ends with:

```gml
battery_spawn_armed[15] = true; battery_spawn_id[15] = noone;
```

Append the **whole** file **`Hooks/obj_mm5_combat_create_flying_shell_append.gml`** after that line, **once only**. Keep all previous enemy/health/drop/refill/death initialization. The new block begins `shell_spawn_count = 2;`.

## 6. Replace TWO complete existing Script resources

Under **Scripts → Mega Man → MM5 → Combat**, or the folder containing your current combat scripts:

1. Open **`scr_mm5_combat_end_frame`**, select all code, replace with the whole **`Scripts/scr_mm5_combat_end_frame.gml`**, save.
2. Open **`scr_mm5_combat_shot_step`**, select all code, replace with the whole **`Scripts/scr_mm5_combat_shot_step.gml`**, save.

Do **not append** these complete replacements. They preserve the accepted five enemy types and add Shell calls without duplicating a pass. They are Script resources, not events.

**No other changes:** camera/player/buster events, stage Create, terrain/ladders/gates/blocks/buildings, HUD, pause and existing sounds/Included Files remain untouched. Keep the accepted buster Create deflection flag. No room resizing or manual actor placement.

## 7. Compile and test your installed game

Native/source/mock tests pass, but **GMS1.4 compilation, event inheritance, audio and your installed-game confirmation remain pending**.

1. Compile/run normally. Check all five previously accepted enemy types and their firing/hit/ding/pickup sounds still work.
2. After the later Blader section and downward ladders, watch Flying Shell enter from the **right** at the original height. Both encounter bands are installed: first launch `(2040,368)` in band240, second `(2040,608)` in band480. Do not place actors manually.
3. It flies left1.125px/update, opens/stops after56enemy updates, fires eight directions at timer72, closes/restores speed at88. It then moves again on the next update. Check all eight bullets spread and leave the screen; one complete native burst effect should play, not eight overlapping WAV voices.
4. Closed: normal/mid/full shots deflect up/back with the **approved MM6 ding**, once per shot. Deflected shots must not hit other targets. This is the established MM5 hybrid deflection, not claimed native MM1 charge behavior.
5. Open: **one normal, medium or full shot kills**, with the approved successful-hit cue. Normal/mid are consumed; full charge pierces the weak enemy. Check hits around opening/closing boundaries too: vulnerability is sampled from the pre-update native state, not sprite alpha.
6. Body contact deals **1 health**, bullet contact **2**; accepted MM5 recoil/protection/slide/death ownership stays intact. Body halfheight9 is deliberately different from other8pxhalfheight enemies. A same-update kill before contact should not hurt Mega Man.
7. If it leaves the left edge without being killed, another shell re-enters from the right immediately as a repeating encounter, with no kill explosion/drop. A killed shell makes one explosion/one MM5 drop roll, then a replacement enters after the measured70subsequent active-update cooldown. It must not require scrolling the anchor offscreen to repeat, and must never duplicate an active body.
8. Pause/resume during flight, firing and replacement wait; health refill must also freeze flight/bullets/cycle/cooldown. Ladder/gate transitions remove stale bodies and inherited bullets without drops. Existing health/life/refill caps and cues must still work.
9. Listen to the new native burst take. Its sound/runtime acceptance is still for you to confirm. Do not replace or rebalance accepted effects to compensate.

“Unknown variable shell_spawn_count” means Step5 is missing. Unknown Shell resources mean Steps1–4 are incomplete. Static bullets usually mean the bullet's parent was not set to `obj_mm1_blaster_bullet`. Double movement usually means an unwanted Step event or duplicate central pass. Built-in local names such as `direction` are avoided.
