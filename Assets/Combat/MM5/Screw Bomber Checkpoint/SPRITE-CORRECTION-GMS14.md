# Screw Bomber — corrected sprites (GMS1.4.1760)

**Use `Downloads/mm1-screw-bomber-sprite-correction-gms14.zip` if you already installed the first Screw Bomber package.** It contains only this guide, three PNGs, two bullet events, and one replacement Screw script. No manager append, central replacement, or gate code. If Screw Bomber is not installed yet, use the updated full ZIP and `INSTALL-GMS14.md` instead; do not install both sets of instructions.

## What was wrong

The earlier extraction put Screw Bomber's types into an opening-area test fixture. Its AI and OAM tile IDs were real, but the opening area's loaded CHR graphics/palette were not Screw Bomber's corridor graphics. Matching the extraction to that same faulty fixture did not validate sprite identity. **Both earlier body strips and the claim that its bullet RGBA equalled Blaster's are superseded.** This was an extraction error, not your import settings.

The corrected strips come from all three original corridor spawns after a disclosed native checkpoint-reload setup. All five poses were matched to the rendered original game for floor and ceiling; the second floor encounter independently matched the first. The bullet has the same shape/movement as Blaster but uses the corridor's salmon/white palette. Keep Blaster's accepted magenta bullet unchanged.

Visual review in the repository (NOT import files):
- [Floor strip enlarged 8×](../../../Enemies/MM1/Screw%20Bomber/Reference/floor-strip-preview-8x.png)
- [Ceiling strip enlarged 8×](../../../Enemies/MM1/Screw%20Bomber/Reference/ceiling-strip-preview-8x.png)
- [Original corridor floor encounter](../../../Enemies/MM1/Screw%20Bomber/Reference/native-floor-encounter.png)
- [Original corridor ceiling encounter](../../../Enemies/MM1/Screw%20Bomber/Reference/native-ceiling-encounter.png)

## 1. Replace the TWO existing body sprites — no duplicate resources

Back up the working project and stop the runner.

Folder: **Sprites → Enemies → MM1 → Screw Bomber**.

For **`spr_mm1_screw_bomber_floor`** and **`spr_mm1_screw_bomber_ceiling`**:
1. Open the existing sprite → Edit Sprite. Remove its old five subimages.
2. File → Create from Strip; select the matching corrected `Art/*_strip5.png` from this ZIP.
3. **Number of images 5; Images per row 5; Width 16; Height 16.** Cell/pixel offsets and both separations **0**.
4. Check that there are exactly **five 16×16 subimages**, not one 80×16 image. Closed, emerging, then three rotating poses.
5. Green check to leave the editor; manually set **Origin X8, Y7**. Do not Centre, crop, resize, repaint, remove the background, or flip the ceiling strip again. Keep PNG transparency.

The first floor pose has transparent bottom eight rows; the first ceiling pose has transparent top eight rows. This padding is intentional.

## 2. ONE new bullet sprite

Same sprite folder. Create **`spr_mm1_screw_bomber_bullet`**.

Load Sprite → **`Art/spr_mm1_screw_bomber_bullet.png`**. Exactly **one 8×8 subimage**, **Origin X4, Y3**, original PNG transparency. Do NOT replace `spr_mm1_blaster_bullet` or Flying Shell's sprite.

## 3. ONE new bullet object — parent is IMPORTANT

Folder: **Objects → Enemies → MM1 → Screw Bomber**.

Create **`obj_mm1_screw_bomber_bullet`**:
- Sprite **`<no sprite>`**; **Visible checked**, Solid unchecked, Persistent unchecked.
- **Parent = existing `obj_mm1_blaster_bullet`**. Not a terrain parent and not parentless.
- **Create → Execute Code:** paste the WHOLE `Objects/obj_mm1_screw_bomber_bullet_create.gml`. All shared fields are explicitly initialized; do not add an inherited-event action.
- **Ordinary Draw → Execute Code:** paste the WHOLE `Objects/obj_mm1_screw_bomber_bullet_draw.gml`. This overrides the parent Draw with the correct palette.
- No Step, Begin Step, End Step, Collision, or Destroy events. No room instances.

The parent lets the accepted central bullet movement/contact/cleanup code include these children exactly once, just as with Flying Shell's bullet. Do not edit the existing Blaster bullet events or add another movement pass.

## 4. Replace ONE existing Screw script

Folder: **Scripts → Enemies → MM1 → Screw Bomber**.

Open existing **`scr_mm1_screw_bomber_step`**, select ALL its code, replace with the WHOLE **`Scripts/scr_mm1_screw_bomber_step.gml`** from this correction ZIP, save.

Only the spawned bullet object name and its explanatory comment changed. AI/timing/vectors/audio are unchanged. Keep the Screw body object's existing Create/Draw and all other scripts/events untouched. **Do not reappend the manager Create or reinstall the two central scripts.**

## 5. Compile and check

- Both mounted variants should now visibly be Screw Bomber, without scrambled tile fragments, in all five poses.
- Each fan should have five salmon/white bullets moving once. Blaster and Flying Shell keep their existing art/audio/behaviour.
- A stationary new bullet generally means its parent was not selected. Double movement means an unwanted Step event or duplicate movement pass.
- Doors, free-fall/pits, room/terrain, player, audio and the seven accepted enemy resources are unchanged.

Original-ROM extraction and source/model tests pass. **GMS1.4 compilation and your installed visual/gameplay acceptance are still pending.** No ROM or savestate is shipped.
