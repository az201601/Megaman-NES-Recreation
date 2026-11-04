# Octopus Battery / Suzy — GMS 1.4.1760 manual installation

**Back up your working project and stop the runner first.** This additive package assumes your accepted Blader, Blaster, corrected Super Cutter and Flea installations. Do not reinstall an older combat ZIP.

Extract `mm1-octopus-battery-combat-gms14.zip` from GitHub into a new folder. Paths below refer to the extracted ZIP. Complete every step before compiling. This supplies source/resources with manual instructions, not an importable GMX.

## 1. ONE new sprite

Create resource folder **Sprites → Enemies → MM1 → Octopus Battery**.

1. Right-click → **Create Sprite**, name **`spr_mm1_octopus_battery`**. If that name exists, update/check it rather than creating a suffixed duplicate.
2. **Edit Sprite → File → Create from Strip**. Select **`Art/spr_mm1_octopus_battery_strip3.png`**.
3. Set **Number of images = 3**, **Images per row = 3**, **Image width = 16**, **Image height = 16**.
4. Set all starting pixel/cell offsets and horizontal/vertical separations to **0**, then confirm.
5. Verify **three separate16×16 subimages**, not one48×16 image: open eye, half eye, closed eye.
6. Close the image editor with its green check. Manually set **Origin X = 8, Y = 7**. Do not click Centre afterward.
7. Retain PNG transparency. No smoothing, Remove Background, cropping, resizing or repainting. Defaults for masks/textures are fine; combat uses numeric bounds. Save.

## 2. SIX new Script resources

Create folder **Scripts → Enemies → MM1 → Octopus Battery**. Create each Script resource below and paste the **entire matching file** from `Scripts/`, then save:

- `scr_mm1_octopus_battery_state`
- `scr_mm1_octopus_battery_step`
- `scr_mm1_octopus_battery_world_step`
- `scr_mm1_octopus_battery_spawn`
- `scr_mm1_octopus_battery_hit`
- `scr_mm1_octopus_battery_contact`

There are six new scripts. Do not import Objects/ or Hooks/ files as Script resources. The `state` script is called by the movement script; it is not an extra actor event.

## 3. ONE new object — exact settings/events

Create folder **Objects → Enemies → MM1 → Octopus Battery**.

1. Right-click → **Create Object**, name **`obj_mm1_octopus_battery`**. Both vertical and horizontal variants use this one object; spawn code selects the axis.
2. Set **Sprite `<no sprite>`**, **Visible checked**, **Solid unchecked**, **Persistent unchecked**, **Parent `<no parent>`**. Leave editor mask/depth at defaults; code draws and sets depth.
3. **Add Event → Create**. Add a Control **Execute Code** action and paste the whole **`Objects/obj_mm1_octopus_battery_create.gml`**.
4. **Add Event → Draw → Draw**, ordinary Draw, not GUI/Begin/End. Add Execute Code and paste the whole **`Objects/obj_mm1_octopus_battery_draw.gml`**.
5. Save. Its only events are **Create** and **ordinary Draw**.

**No Step, Begin Step, End Step, Collision or Destroy event. No inherited terrain parent. No manual room placement.** Existing central combat code owns updates and all16spawns. Do not add another sprite/object for the horizontal variant.

## 4. Append ONE existing Create event — keep all old code

Under **Objects → Mega Man → MM5 → Combat**, open **`obj_mm5_combat` → Create → Execute Code**.

Scroll to the very bottom, after all accepted Flea initialization. Its last line should be:

```gml
flea_spawn_id[0] = noone; flea_spawn_id[1] = noone; flea_spawn_id[2] = noone;
```

After that line, append the **entire** file:

**`Hooks/obj_mm5_combat_create_octopus_battery_append.gml`**

Append **once only**. Do not replace this Create event or remove existing Blader/Blaster/Super Cutter/Flea/health/refill/drop/death fields. The new block begins `battery_spawn_count = 16;`. Coordinates/types are already filled in; no editing or manual placement is required.

## 5. Replace TWO existing Script resources completely

Under **Scripts → Mega Man → MM5 → Combat**, or the resource folder containing your existing combat scripts:

1. Open **`scr_mm5_combat_end_frame`**. Select **all existing code**, replace with the entire **`Scripts/scr_mm5_combat_end_frame.gml`**, save.
2. Open **`scr_mm5_combat_shot_step`**. Select **all existing code**, replace with the entire **`Scripts/scr_mm5_combat_shot_step.gml`**, save.

These files retain all accepted enemy logic plus new Octopus Battery calls. **Do not append these complete files**, which would duplicate the combat pass. These are Script resources, not actor events.

**No other edits:** leave camera/player/buster events, stage Create, geometry/collision/ladders/gates/blocks, dispenser buildings, HUD, pause, audio resources and Included Files unchanged. Keep the accepted Blaster deflection append and corrected Super Cutter script. Do not place any of the16enemies manually.

## 6. Audio — nothing to import or reboost

Verified original movement/endpoint trials issued no sounds. There is no movement WAV or invented eye-closing cue. **Closed eyes remain vulnerable**, so no Blaster-style deflection or blocked-hit ding is added. Each accepted normal/charged hit uses your approved **`snd_mm6_enemy_hit`**; kill explosions/drops and MM5 pickup feedback reuse the existing system.

Preserve accepted Blaster firing/MM6 shell ding, MM5 firing/charge/hurt/refill/life, 2× effects and85%stage music. No replacement sounds are included.

## 7. Compile and check in your installed game

Native/source/mock tests pass; **GMS1.4 compilation and your installed runtime confirmation are still pending**.

1. Compile/run Cut Man normally. Check the accepted four enemy types, their firing/hit/ding cues, pause, HUD and pickups still work.
2. Past the Fleas, find the first two **vertical** Octopus Batteries and the **horizontal** one, followed by the remaining vertical/horizontal enemies through the three upward rooms. All16original records are mapped; no additional manual actors are needed.
3. Check travel at2pixels per active update. Solid floors/ceilings/walls define endpoints. At contact, the eye closes and waits63or126active updates before reversing; it starts travelling away while opening, not only after the eye is fully open. No homing/proximity activation or Flea-style every-fourth-update skip.
4. Verify three actual eye poses and correct alignment; no cropping or smooth interpolation. The numeric body uses7px halfwidth/height, not the full alpha of a16px sprite.
5. Hit **open, half and closed** eyes. Every phase takes damage. A fresh enemy needs **five normal or medium hits**; a full charge deals3, so **two full hits** kill. The first full charge is consumed and leaves2HP; the second kills and can pierce. There must be **no closed-eye ding or deflection**. Shots already deflected by Blaster must still be unable to damage it.
6. Contact deals **4 health** through accepted MM5 recoil/protection/slide/death rules. A same-update kill resolved before contact must not also hurt Mega Man. Check standing and sliding near the edges of the body.
7. Kills reuse the existing explosion and exactly one MM5 random-drop roll. Offscreen/scroll cleanup must not produce drops. Test existing health/life collection, refill freeze/cues and caps.
8. Pause/resume while they move or wait, then collect health. Movement, wait timers and animation must freeze with existing world/refill ownership. Ladder/gate transitions must remove stale actors without drops. Scrolling away/back may rearm a record, but must not duplicate a still-active instance or instantly respawn a killed enemy while its anchor stays visible.
9. Check collisions with existing invisible solids and removable blocks; no scenery-alpha collision. One-way ladder caps support downward vertical movement, not horizontal walls or ceilings. Removing terrain must not leave a cached invisible endpoint.

The first three anchors are `(1352,1128)`, `(1384,1064)` vertical and `(1464,1096)` horizontal, camera band960. The next rooms use bands720,480,240; all coordinates are in the supplied Create append and reference JSON. **Do not change accepted terrain or room size to fit a test.**

If you get “unknown variable battery_spawn_count,” check Step4. An unknown new script/object/sprite means Steps1–3 are incomplete. Double movement usually indicates an unwanted actor Step event or duplicated central pass. The scripts avoid declaring built-in names such as `direction`; travel uses `battery_travel`.
