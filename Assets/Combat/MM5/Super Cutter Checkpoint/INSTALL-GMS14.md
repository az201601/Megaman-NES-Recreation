# Super Cutter — GMS 1.4.1760 installation

**Back up your working project and stop the runner first.** This additive package assumes your accepted, working Blader + Blaster combat installation. Do not reinstall either old ZIP. Finish all steps below before running.

Extract `mm1-super-cutter-combat-gms14.zip` from GitHub into a new folder. Paths below refer to the extracted ZIP. This is manual source/resource installation, not an importable GMX project.

## 1. One NEW flying-cutter sprite

Your two **building/dispenser sprites and objects are already installed**. Leave them and their placement scripts alone. This new resource is only the moving cutter.

Create resource folder **Sprites → Enemies → MM1 → Super Cutter**.

1. Right-click that folder → **Create Sprite**, name **`spr_mm1_super_cutter`**.
2. Open **Edit Sprite → File → Create from Strip**.
3. Select **`Art/spr_mm1_super_cutter_strip2.png`**.
4. Set **Number of images = 2**, **Images per row = 2**, **Image width = 16**, **Image height = 32**.
5. Set all starting pixel/cell offsets and horizontal/vertical separations to **0**. Confirm.
6. Verify **two separate 16×32 subimages**, not one 32×32 image. The closed pose has transparent padding above/below; the open pose is taller. Do not crop or stretch either.
7. Close the editor using its green check. Manually set **Origin X = 8, Y = 15**. Do not click Centre afterward.
8. Retain transparency; no smoothing, Remove Background, resizing or repainting. Defaults for masks/textures are fine: combat uses numeric bounds, not sprite alpha. Save.

If this resource already exists, update it rather than creating a suffixed duplicate.

## 2. Four NEW scripts

Create folder **Scripts → Enemies → MM1 → Super Cutter**. Create each Script resource below and paste the **entire** matching file from `Scripts/`:

- `scr_mm1_super_cutter_step`
- `scr_mm1_super_cutter_world_step`
- `scr_mm1_super_cutter_hit`
- `scr_mm1_super_cutter_contact`

Save all four. Do not import Objects/ or Hooks/ files as Script resources.

## 3. One NEW object — exact settings and events

Create folder **Objects → Enemies → MM1 → Super Cutter**.

1. Right-click → **Create Object**, name **`obj_mm1_super_cutter`**. This is **not** the existing `obj_mm1_super_cutter_dispenser` building.
2. Set **Sprite: `<no sprite>`**, **Visible: checked**, **Solid: unchecked**, **Persistent: unchecked**, **Parent: `<no parent>`**. Leave mask/default editor depth alone; code draws the sprite and sets depth.
3. **Add Event → Create**. Add a Control **Execute Code** action. Paste the whole **`Objects/obj_mm1_super_cutter_create.gml`**.
4. **Add Event → Draw → Draw** (ordinary Draw, not GUI/Begin/End). Add Execute Code and paste the whole **`Objects/obj_mm1_super_cutter_draw.gml`**.
5. Save. The object has **only Create and ordinary Draw**.

**Do not add Step, Begin Step, End Step, Collision, Destroy or terrain-parent events. Do not place any cutter or extra dispenser in the room.** The existing combat owner moves cutters once per active update and spawns them from the two existing buildings.

## 4. Append ONE existing Create event — keep all its old code

Under **Objects → Mega Man → MM5 → Combat**, open **`obj_mm5_combat` → Create → Execute Code**.

Scroll to the very bottom, **after all accepted Blaster initialization**. The previous Blaster append ends with:

```gml
blaster_spawn_armed[10] = true; blaster_spawn_id[10] = noone;
```

After that, append the **entire** file:

**`Hooks/obj_mm5_combat_create_super_cutter_append.gml`**

Append once only. **Do not replace the Create event** or remove any Blader, Blaster, health/refill/drop/death initialization. The new block begins `super_spawn_count = 2;`.

## 5. Replace TWO complete existing Script resources

These are Script resources, **not object events**. Under **Scripts → Mega Man → MM5 → Combat** (or the folder containing your existing combat scripts):

1. Open **`scr_mm5_combat_end_frame`**. Select **all existing code**, replace with the entire **`Scripts/scr_mm5_combat_end_frame.gml`**, save.
2. Open **`scr_mm5_combat_shot_step`**. Select **all existing code**, replace with the entire **`Scripts/scr_mm5_combat_shot_step.gml`**, save.

Both replacements contain the accepted Blader and Blaster behavior plus cutter calls. Do not append these files to the old scripts; that would duplicate combat passes.

**No changes** to the camera End Step, combat object's End Step, player events, parent/charged buster objects, scene/collision/ladder/gate scripts, building Create, menus, HUD or audio resources. In particular keep the accepted `mm5_shot_deflected = false;` buster Create append from the Blaster update.

## 6. Audio — nothing to import

The original MM1 dispensers launch **silently** in the verified trials. There is no new firing WAV and no borrowed Blaster cue. Successful cutter hits reuse your accepted **`snd_mm6_enemy_hit`**. Keep Blaster firing, closed-shell MM6 ding, MM5 firing/charge/hurt/refill/life effects, the 2× effect mix and 85% stage music untouched. Do not boost anything again.

## 7. Compile, then check in the working stage

Source/native/mock checks have passed; **GMS 1.4 compilation and your installed gameplay still need confirmation**.

1. Compile/run the normal Cut Man stage. Confirm Bladers and Blasters still behave and sound as accepted, including shell deflection/ding.
2. At the first existing dispenser after the Blaster section, approach horizontally. Cutters begin when the player's integer X is **less than 80 pixels** from the launch anchor; 80 itself is outside. A new cutter launches every **32 active updates** while in range. No vertical-distance gate is added.
3. Check launches to either side: direction/sideways speed are chosen once at launch; cutters arc upward, fall, and do not home or bounce on scenery. Their two native jaw poses alternate every ten active updates. Leaving the horizontal trigger range does not delete cutters already flying.
4. Normal and medium shots: **five hits** kill a fresh cutter, with your approved successful-hit sound on each hit. Full charge: **two hits**; the first consumes the shot and leaves two HP, the second kills and can pierce. No ding on vulnerable cutters.
5. A cutter touching Mega Man deals **4 health**, respecting the existing MM5 recoil, protection, slide bounds and death ownership. The building art itself is not a second damageable enemy or solid.
6. Killing a cutter uses the existing enemy explosion and one MM5 random-drop roll. Offscreen/scroll cleanup must not produce drops. Existing health/life pickups, refill pause and cues must still work.
7. Pause and resume with cutters flying. They must freeze/resume with the established world pause; a health refill likewise freezes movement and launch timers. Check ladder/gate scrolling for no old cutters or duplicate buildings.
8. Check the second dispenser later in the stage. It uses the same behavior and its already-installed building.

Launch anchors are `(912,1140)` in camera band960 and `(1424,180)` in band0. Existing building top-left positions remain `(864,1088)` and `(1376,128)`. **Do not move or recreate them.**

If you see “unknown variable super_spawn_count,” check Step4; an unknown new script/object/sprite means Steps1–3 are incomplete. An extra movement update usually means an unwanted cutter Step event or duplicated central pass. Stop and correct that before judging timing.

## Compile-error correction — built-in `direction`

If the first package reports **“cannot redeclare a builtin variable”** in `scr_mm1_super_cutter_world_step`, the original script mistakenly declared local `direction`, a GMS1.4 built-in. The corrected file uses `launch_direction` throughout; behavior is unchanged.

Download the updated ZIP, open the existing **Script resource `scr_mm1_super_cutter_world_step`**, select all its code and replace it with the entire corrected `Scripts/scr_mm1_super_cutter_world_step.gml`. Save and compile again. **Only that one script needs replacing** if you already completed the installation. Do not reappend the manager Create block, recreate resources, or replace other events.
