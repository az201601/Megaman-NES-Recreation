# Screw Bomber — GMS1.4.1760 manual installation

Back up your working project and stop the runner. Requires the seven accepted enemies through Big Eye, existing Blaster bullet/fire resources, and accepted Free Fall Correction. **Keep your latest camera/gate code, including Jumping Gate Entry if installed. Do not reinstall older stage/combat checkpoints.** This ZIP is a manual source/resource patch, not an importable GMX. Complete every step before running.

**Already installed the earlier Screw package? Use `SPRITE-CORRECTION-GMS14.md` and its smaller correction ZIP instead. Do not reappend manager initialization. The earlier scrambled strips are superseded.**

## 1. THREE new sprites

Resource folder **Sprites → Enemies → MM1 → Screw Bomber**.

| Resource name | ZIP artwork |
|---|---|
| `spr_mm1_screw_bomber_floor` | `Art/spr_mm1_screw_bomber_floor_strip5.png` |
| `spr_mm1_screw_bomber_ceiling` | `Art/spr_mm1_screw_bomber_ceiling_strip5.png` |

For EACH of the two body sprites:
1. Create the exact resource name above. Edit Sprite → File → Create from Strip; select its matching PNG.
2. **Number of images5; Images per row5; Image width16; Image height16**. Every cell/pixel offset and horizontal/vertical separation **0**.
3. Confirm FIVE16×16subimages, not one80×16image. Closed first, emergence second, three rotating poses next.
4. Green check to leave editor; set **Origin X8,Y7** manually. Do not Centre afterward, crop transparent rows, resize/repaint or flip the ceiling strip again. Closed floor has bottom8rows transparent; closed ceiling has TOP8rows transparent—intentional native mounting alignment.
5. Keep transparency/default mask settings; no smoothing/Remove Background. Save. Numeric combat bounds do not use sprite masks.

Also create **`spr_mm1_screw_bomber_bullet`** in the same folder. Load Sprite → **`Art/spr_mm1_screw_bomber_bullet.png`**, ONE8×8subimage, **Origin X4,Y3**. Keep PNG transparency. Do not overwrite Blaster or Flying Shell bullet sprites.

## 2. FIVE new Script resources

Folder **Scripts → Enemies → MM1 → Screw Bomber**. For each name create a Script, paste the WHOLE identically named file from ZIP `Scripts/`, save:

- `scr_mm1_screw_bomber_step`
- `scr_mm1_screw_bomber_world_step`
- `scr_mm1_screw_bomber_spawn`
- `scr_mm1_screw_bomber_hit`
- `scr_mm1_screw_bomber_contact`

Do not create scripts from Objects/ or Hooks/. These scripts are not object Step events.

## 3. TWO new objects — Create and ordinary Draw ONLY

Folder **Objects → Enemies → MM1 → Screw Bomber**.

1. Create **`obj_mm1_screw_bomber`**.
2. **Sprite `<no sprite>`; Visible checked; Solid unchecked; Persistent unchecked; Parent `<no parent>`**. Default editor depth/mask; code owns drawing/depth and numeric combat bounds.
3. Add **Create → Execute Code**, paste whole `Objects/obj_mm1_screw_bomber_create.gml`.
4. Add ordinary **Draw → Execute Code**, paste whole `Objects/obj_mm1_screw_bomber_draw.gml`. NOT Draw GUI/Begin/End.
5. Save. **No Step, Begin Step, End Step, Collision or Destroy events. No manual room instances or generator object.** Existing central combat owner updates it once.

### Bullet: `obj_mm1_screw_bomber_bullet`

Same Objects folder. Create **`obj_mm1_screw_bomber_bullet`**:
1. Sprite `<no sprite>`; Visible checked; Solid/Persistent unchecked.
2. **Parent = existing `obj_mm1_blaster_bullet`**. This is required to join the accepted central movement/contact/cleanup pass exactly once.
3. **Create → Execute Code:** whole `Objects/obj_mm1_screw_bomber_bullet_create.gml`. Fields initialized explicitly; no inherited-event action.
4. **Ordinary Draw → Execute Code:** whole `Objects/obj_mm1_screw_bomber_bullet_draw.gml`.
5. No Step/Begin Step/End Step/Collision/Destroy events, no manual room instances. Do not edit the existing Blaster bullet events or add a second movement pass.

The dedicated child keeps the actual corridor salmon/white palette without changing Blaster's accepted magenta bullet. Same numeric native2D movement/contact as Blaster; own Draw only. **No new sound.**

Fire uses existing **`snd_mm1_blaster_fire`** ONCE per five-shot fan. This is the same native$15cue; no fake distinct Screw effect, five overlapping WAVs or gain changes. Successful hits use existing `snd_mm6_enemy_hit`. **No blocked-hit ding**: Screw Bomber is vulnerable even retracted. Leave all accepted audio/charge/music/Included Files untouched.

## 4. APPEND ONCE to existing manager Create (NOT a replacement)

Open **Objects → Mega Man → MM5 → Combat → `obj_mm5_combat` → Create → Execute Code**, or its current resource folder.

Scroll to the very bottom AFTER all accepted seven-enemy AND Free Fall/pit initialization. Append the WHOLE **`Hooks/obj_mm5_combat_create_screw_bomber_append.gml`**, **once only**. New block begins `screw_spawn_count = 3;`.

Keep ALL previous code, including `big_eye_spawn_count` and `combat_pit_death`. Do not paste into stage Create, manager Step/End Step or the Screw object. This adds three script-owned spawn records; do not place turrets manually.

## 5. REPLACE TWO complete existing Script resources

Folder **Scripts → Mega Man → MM5 → Combat**, or current folder of your working scripts.

1. Open existing **`scr_mm5_combat_end_frame`**, select ALL code, replace with whole **`Scripts/scr_mm5_combat_end_frame.gml`**, save.
2. Open existing **`scr_mm5_combat_shot_step`**, select ALL code, replace with whole **`Scripts/scr_mm5_combat_shot_step.gml`**, save.

These are Script resources, NOT manager/camera events. They preserve ALL accepted central lines outside additive Screw calls/loop. **No other replacements.** Keep camera Create/Begin Step/End Step, jumping/walking gates, player/controller/buster events, death/pit/Draw, pause/HUD, all enemies, room settings, stage/music/tiles/solids/ladders/Super Arm blocks unchanged. Do not add a second combat movement pass.

## 6. Compile and installed playtest

Native/source/mock checks pass; **GMS1.4 compilation, scheduler/GPU/audio/installed runtime and user acceptance remain pending**.

1. Compile/run and check the seven earlier enemies/charge/pause/audio still work. Pass the first boss gate into the corridor. No new room edits.
2. Scripted spawn order at bandY720: **floorX2520,Y880 → ceilingX2760,Y816 → floorX2896,Y880** (native records45–47/pages20–22). Closed mounts must stay aligned; emergence moves body8px out of floor/ceiling, retraction restores original Y. No floating base/cropped/shifted ceiling pose.
3. Activation requires horizontal distance **strictly less than80pixels**; exactly80waits. Five-update animation phases, two5-shot fans per activation, first at activeupdate33, second65 while in-range from fresh spawn. Each fan: left/right horizontal3px/update, diagonals556/256px per axis, central vertical3; floor upward, ceiling downward. No player homing. Native cooldown choices32/63/125, decremented on selection tick. Cooldown drains even out of range; after it expires, closed body waits for proximity again.
4. Hear ONE approved Blaster firing cue per fan, not five stacked. Kill at any pose: **three normal or medium hits, one full charge** from full health; approved MM6hit cue each. Fullcharge3damage/weak-target piercing is the existing MM5 project adaptation. Closed is NOT invulnerable. A standing pellet can pass ABOVE the low retracted floor body: that is a numeric miss, not blocking; do not enlarge masks to fake a hit.
5. Floor body contact **1health**, ceiling body **2health**, bullets **2health**, through existing MM5 recoil/protection/slide/death ownership. Enemy halfsize8×8, bullet1×1; no sprite-mask collision. A lethal shot wins over body contact in the same combat pass. Fired bullets survive the turret's death until hit/offscreen/route cleanup; cannot shoot bullets down.
6. Exactly one explosion/one existing MM5 drop roll per kill; no drop for leaving the view or starting a gate/ladder/free-fall transition. No score. No repeated respawn while anchor remains visible; record rearms after leaving view. Three records only, not infinitely repeating generators.
7. Pause/refill/death freeze actor/fire/contact; no new cue while frozen. On gate/ladder/free-fall transitions remove stale turrets and shared bullets without explosion/drop. Recheck non-ladder drops into lower screens, pit death/no particles, ordinary lethal explosion, both walking/jumping gates and charge rearming. Those stage/death resources are not replaced by this patch.

Unknown `screw_spawn_count` normally means Step4 missing. Unknown script/resource means Step1/2/3 missing or a suffixed duplicate name. Static/double-speed turrets usually mean missed central replacement or an extra object Step event. Incorrect art size/origin/transparent-row cropping causes alignment errors; do not edit room coordinates or masks to hide an import error.

Scope: controlled original-ROM AI/animation/real B-hit/art evidence, with explicit MM5 damage normalization and accepted central birth/spawn/clock/bullet scheduling adaptation. Not an end-to-end natural corridor/native MM5 charge test, global NES RNG/object-pool reproduction, GameMaker compiler certification or completed boss fight. Do not import Reference JSON as resources.
