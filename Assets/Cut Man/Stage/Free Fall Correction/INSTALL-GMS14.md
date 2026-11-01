# Free-fall connections + MM5 pit death — GMS1.4.1760

**Stop the runner and back up the accepted project first.** Requires accepted Second Gate Passage/immediate gate opening and all seven enemy checkpoints through Big Eye. Do NOT reinstall old stage/enemy packages. Manual source/resource ZIP, not importable GMX. Complete ALL steps before compiling.

No new sprites, backgrounds, sounds, objects or room instances. No room/view/player-start coordinate change. Do not move scenery, collision, blocks, ladders, gates or enemy anchors.

## 1. FOUR new Script resources

Create folder **Scripts → Cut Man → Stage → Free Fall**:

- **`scr_mm1_cutman_room_below`** — whole `scr_mm1_cutman_room_below.gml`
- **`scr_mm1_cutman_fall_check`** — whole `scr_mm1_cutman_fall_check.gml`
- **`scr_mm1_cutman_fall_step`** — whole `scr_mm1_cutman_fall_step.gml`

Create folder **Scripts → Mega Man → MM5 → Combat → Death**:

- **`scr_mm5_combat_pit_die`** — whole `scr_mm5_combat_pit_die.gml`

Paste each whole file into its exact Script resource and save. These are scripts, not new Step events. Do not create suffixed duplicates.

## 2. APPEND existing camera Create — do not replace

Open **Objects → Cut Man → Stage → Ladder Route → `obj_mm1_cutman_camera` → Create → Execute Code**.

At the very bottom, after ALL existing camera/gate initialization, append the whole **`obj_mm1_cutman_camera_create_append.gml`**, **once only**:

```gml
route_fall_mode = false;
route_fall_from_x = 0;
route_fall_to_x = 0;
```

Keep existing room3328×2160/speed60 checks, initialview0,1920, route/player/audio lists and gate fields. Do not replace Create with this three-line append.

## 3. REPLACE existing camera Begin Step — entire event

On the SAME `obj_mm1_cutman_camera`, open **Begin Step → Execute Code**. Select ALL existing code and replace it with the whole **`obj_mm1_cutman_camera_begin_step.gml`**.

This complete event already includes the accepted combat-begin/lock prefix, with a narrowly adjusted hurt guard for bottom crossings. **Do not prepend the old combat prefix again.** It preserves gate and ladder code, removes the old ladder-opening-only fall fallback, and dispatches the separate free-fall path.

Do NOT change camera End Step. It must still run the accepted `scr_mm1_cutman_camera_end_update` helper and then one combat pass. Do not replace it with a historical stage-only End Step. Keep Room End/Destroy and all gate resources unchanged.

## 4. APPEND existing combat manager Create — do not replace

Open **Objects → Mega Man → MM5 → Combat → `obj_mm5_combat` → Create → Execute Code**.

After all accepted enemy initialization (including Big Eye), append the whole **`obj_mm5_combat_create_pit_append.gml`**, once:

```gml
combat_pit_death = false;
```

Do not delete earlier health/death/drop/enemy/clock initialization. This flag is deliberately initialized without obsolete variable-existence functions.

## 5. REPLACE ONE existing Script resource

Under **Scripts → Mega Man → MM5 → Combat**, open **`scr_mm5_combat_die`**.

Select ALL code and replace with the whole **`scr_mm5_combat_die.gml`**. Do not append. All existing death/music-stop/sound/countdown/retry ownership is preserved; ordinary death explicitly resets the pit-only visual flag.

No changes to `scr_mm5_combat_damage`, spike collision, enemy hit scripts, combat_end_frame, shot_step, health/life/refill or pause scripts.

## 6. REPLACE manager ordinary Draw — entire event

Open **Objects → Mega Man → MM5 → Combat → `obj_mm5_combat` → ordinary Draw → Execute Code**.

Replace ALL code with the whole **`obj_mm5_combat_draw.gml`**. This is ordinary Draw, not GUI/Begin/End Draw. It still draws the same16normal death particles, but exits for pit death.

Do not change the player's Draw, enemy explosions, sprites, masks, depths, parent settings, sounds, music volume or Room End/Destroy events.

## 7. Compile and playtest

Native evidence/source/mock tests pass; **GMS1.4 compiler/runner/event scheduling and your installed-game acceptance remain pending**.

1. Compile. Unknown `route_fall_mode` means Step2 missing; unknown `combat_pit_death` means Step4 missing. Unknown `scr_mm1_cutman_*fall*` means Step1 incomplete. Restart from a fresh room entry after installing all files.
2. Fall without holding Down and without attaching to a ladder through an opening with a room directly below. It must scroll down, keep WORLD X, enter near the next screen's top, and continue falling. No32-update ladder hold on this free-fall path. Native reference uses60camera steps×4px, player screenY−3.5, one alignment frame then normal physics resumes. Any necessary horizontal camera interpolation is a Cut Man editor-layout adaptation, not player teleportation/native-MM1 certification.
3. Try ordinary lower-room returns away from the exact ladder center. Test both top-section branches: lower left room underX1280..1535, lower right underX1792..2047. The interveningX1536..1791 has NO lower room and is a pit. Top-section WORLD coordinates are not camera-local coordinates.
4. In the earlier three-screen horizontal section (viewY960), only WORLD X768..1023 has the lower room. The gap aroundX1184..1215 must be a real pit, not a teleport into the left room. This fixes the earlier documented restart-only pit limitation.
5. Fall into a genuine bottomless pit, including the lowest opening run where no lower room exists. At player center reaching viewbottom, music stops/death cue plays once, **NO player explosion particles**, then the accepted countdown/life loss/retry occurs once. Full health and post-hit blinking must not save Mega Man.
6. Test ordinary lethal enemy damage: normal16-particle death explosion must remain. Original MM5 spike death uses that same normal explosion, but **this patch does not implement the currently artwork-only Cut Man spike collision**. Future spike kill handling must call ordinary `scr_mm5_combat_die`, not the pit wrapper. No new spike exception/policy installed here.
7. Test falling while hurt; transition must not stall halfway because of the camera hurt guard. Try charge held across a fall, charge released/repressed, fresh fire after release, pause immediately before a fall and refill before crossing. No extra shot, charge release sound, landing sound or music restart should be invented by the transition.
8. Check every previously accepted ladder handoff (including Down on the actual ladder), both gates, pause transitions, all seven enemies, shots, contacts, health/life drops/refills and accepted audio. Attached-ladder/gate timing stays on its existing path. Enemy/projectile cleanup remains centrally owned while route_busy is true.
9. Confirm spare-life loss/retry: this patch preserves the existing project policy (opening-room retry if spare lives remain; existing title/new-game inventory flow at zero spares). It does **not** claim to add MM5 native checkpoint placement or a native Game Over/Continue menu. HUD health0 on pit death is also the accepted project's shared-death adaptation; original MM5 pit RAM does not drain health first.

No old enemy/geometry downloads should be reapplied after this patch. Keep backup for rollback: restore both changed events, die script and appended Create boundaries together; remove the new scripts only after restoring their callers.
