# Flea combat — GMS 1.4.1760 manual installation

**Back up your working project and stop the runner first.** This additive package assumes the accepted Blader, Blaster and corrected Super Cutter installations are already working. Do not reinstall earlier packages.

Download/extract `Downloads/mm1-flea-combat-gms14.zip` from GitHub into a new folder. Paths below refer to that extracted ZIP. Complete every step before running. This is manual source/resource installation, not an importable GMX.

## 1. Import ONE new sprite

Create resource folder **Sprites → Enemies → MM1 → Flea**.

1. Right-click → **Create Sprite**, name **`spr_mm1_flea`**. If it exists already, update it instead of creating a suffixed duplicate.
2. **Edit Sprite → File → Create from Strip**. Choose **`Art/spr_mm1_flea_strip2.png`**.
3. Set **Number of images = 2**, **Images per row = 2**, **Image width = 16**, **Image height = 24**.
4. Set all starting pixel/cell offsets and horizontal/vertical separations to **0**, then confirm.
5. Verify **two separate16×24 subimages**, not one32×24 image. The standing pose has transparent bottom padding; the other has the extended spring. Do not crop, resize or repaint.
6. Close the editor with its green check. Manually set **Origin X = 8, Y = 7**. **Do not click Centre afterward.**
7. Retain PNG transparency, no smoothing/Remove Background. Leave mask/texture settings at defaults; combat uses numeric bounds, not the tall spring artwork. Save.

## 2. Import FIVE new scripts

Create folder **Scripts → Enemies → MM1 → Flea**. Create each Script resource below; paste the **entire matching file** from `Scripts/`, then save:

- `scr_mm1_flea_step`
- `scr_mm1_flea_world_step`
- `scr_mm1_flea_spawn`
- `scr_mm1_flea_hit`
- `scr_mm1_flea_contact`

There are five new scripts. Objects/ and Hooks/ files are not Script resources.

## 3. Create ONE new object — exact settings/events

Create folder **Objects → Enemies → MM1 → Flea**.

1. Right-click → **Create Object**, name **`obj_mm1_flea`**.
2. Set **Sprite `<no sprite>`**, **Visible checked**, **Solid unchecked**, **Persistent unchecked**, **Parent `<no parent>`**. Leave editor mask/depth at defaults; code draws artwork and sets depth.
3. **Add Event → Create**. Add a Control **Execute Code** action. Paste the whole **`Objects/obj_mm1_flea_create.gml`**.
4. **Add Event → Draw → Draw**, ordinary Draw, not GUI/Begin/End. Add Execute Code and paste the whole **`Objects/obj_mm1_flea_draw.gml`**.
5. Save. The only events are **Create** and **ordinary Draw**.

**No Step, Begin Step, End Step, Collision or Destroy event. No inherited solid/terrain parent. No manual room placement.** Existing combat code owns movement, contact and spawning once per active update.

## 4. Append ONE existing Create event — do not replace it

Under **Objects → Mega Man → MM5 → Combat**, open **`obj_mm5_combat` → Create → Execute Code**.

At the very bottom, **after all accepted Super Cutter initialization** (the last existing line should be `super_spawn_timer[1] = 0;`), append the complete contents of:

**`Hooks/obj_mm5_combat_create_flea_append.gml`**

Append **once only**. Keep all Blader/Blaster/Super Cutter and health/drop/refill/death initialization above it. This new block starts `flea_spawn_count = 3;` and adds the three original Flea anchors, not duplicates of existing enemies or buildings.

## 5. Replace TWO existing Script resources in full

Under **Scripts → Mega Man → MM5 → Combat**, or the resource folder where your current combat scripts live:

1. Open **`scr_mm5_combat_end_frame`**. Select **all existing code**, replace with the entire **`Scripts/scr_mm5_combat_end_frame.gml`**, save.
2. Open **`scr_mm5_combat_shot_step`**. Select **all existing code**, replace with the entire **`Scripts/scr_mm5_combat_shot_step.gml`**, save.

These two replacements include the accepted Blader/Blaster/Super Cutter logic plus Flea calls. **Do not append these complete files**, which would duplicate the combat pass. These are Script resources, not actor events.

Nothing else changes: **no camera events, player/buster events, geometry/collision/ladder/gate scripts, building objects, stage Create, pause, HUD or audio replacements**. Keep the accepted Blaster deflection Create append and corrected Super Cutter launch script.

## 6. Audio — nothing to import

Original Fleas did not issue jump/landing sounds in the verified trials. The shared original AI's landing cue belongs to **Big Eye**, not Flea; it is deliberately not added here. Successful hits reuse your accepted **`snd_mm6_enemy_hit`**; MM5 explosion/drop/pickup feedback stays unchanged. Preserve the existing Blaster firing and shell ding, firing/charge sounds, 2× effect mix and 85% stage music. No sounds or Included Files are supplied or reboosted.

## 7. Compile, then test the installed stage

Native/source/mock checks pass; **GMS1.4 compilation and installed-game behavior still need your confirmation**.

1. Compile/run Cut Man normally. Confirm accepted Bladers, Blasters, shell ding/deflection and cutter dispensers still behave/sound correctly.
2. After the first dispenser, look for the **three Fleas on the rising steps**. They spawn from original screen-entry anchors, not a new proximity trigger. No extra building or manual room instances should appear.
3. Check both hop patterns: a taller/slower sideways jump and a lower/faster sideways jump. Each hop aims toward the player's side at launch; moving across afterward must not make the airborne enemy home/turn continuously. It pauses about15active updates after landing. Every fourth airborne active update deliberately skips movement/gravity, matching the original cadence.
4. Verify the two poses: compressed/standing on the floor, extended spring in the air. The spring does **not** enlarge the8×8-halfsize collision body.
5. Check floors, walls, ceilings and removable Super Arm block terrain. Fleas must not pass through solid walls/floors. Ceilings stop upward motion and initiate falling, not a fake landing wait. Ladder caps act as one-way floors, not walls/ceilings. Scenery pixels are not collision.
6. Normal, medium and full charge each kill in **one hit**, with the approved successful-hit effect. Normal/mid are consumed; full charge pierces these weak enemies. Blaster-deflected shots must not damage them afterward.
7. Contact deals **2 health**, using the same MM5 recoil, protection, slide bounds and death ownership. A kill resolved before contact must not also hurt the player.
8. A killed Flea uses the existing explosion and exactly one MM5 random-drop roll. Offscreen/scroll cleanup must not create drops. Test existing health/life pickups and refill sound/freeze.
9. Pause with Fleas airborne, then resume. Their movement and shared skip phase freeze with the established world pause; health refill also freezes them. Scroll away/back and check no duplicate active Fleas or stale enemies through ladder/gate transitions.

All three anchors are in camera band960: `(1080,1144)`, `(1112,1112)`, `(1144,1080)`. They are **script-spawned**. Do not place actors at these coordinates manually or change any accepted terrain to make a test fit.

An “unknown variable flea_spawn_count” means Step4 was missed. An unknown Flea resource means Steps1–3 are incomplete. If timing is doubled, check for an unwanted Flea Step event or duplicated central pass. Built-in names such as `direction` are not redeclared as locals; launch facing uses `flea_facing`.
