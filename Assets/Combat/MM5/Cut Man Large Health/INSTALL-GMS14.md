# Cut Man fixed large health — GMS1.4.1760 installation

Requires the working eight-enemy checkpoint through Screw Bomber, its accepted sprite fixes, accepted Free Fall/Jumping Gates and existing MM5 pickup/refill resources. Back up the working project and stop the runner. Manual source patch, not an importable GMX.

**No sprite, sound, room, tile, terrain, camera, player, gate, Screw Bomber or accepted enemy resource replacement. No manual room placement.** Reuse existing `spr_mm5_pickup_large_health`, `obj_mm5_pickup`, health/refill scripts and sound.

## Placement and behaviour

Original Cut Man record38 = page15/localX40/Y184/type40hex (large health). Top stripe begins at native page13/projectX1280: **1280+(15−13)×256+40 = worldX1832**, **worldY184**, camera band **0**. This is the ledge on the right side of the top horizontal section, after the second cutter dispenser, before the downward route. Existing ledge top is Y192; the 16×16 health sprite sits above it.

Fixed anchor, not an enemy drop: no falling/bouncing or 255-update expiration. Existing MM5 animation and collection: **+10 health, capped28**, incremental refill/freeze and accepted refill sound. Full-health collection removes it silently. Not an E-Tank and no new inventory reward.

It appears once while its anchor is in view. Once collected, it stays gone while that anchor remains in view. Leaving its view/band or route cleanup rearms it for a later return; room restart also resets it. This screen-entry policy follows the project's existing spawn system, not a claim to reproduce the NES global slot-reuse persistence exactly.

## 1. ONE new Script

Folder **Scripts → Stages → MM1 → Cut Man → Pickups** (create these folders if absent).

Create **`scr_mm1_cutman_large_health_spawn`**. Paste the WHOLE matching file from ZIP `Scripts/`, save.

## 2. ONE new object — Create ONLY, required pickup parent

Folder **Objects → Stages → MM1 → Cut Man → Pickups**.

Create **`obj_mm1_cutman_large_health`**:
1. Sprite **`<no sprite>`**; **Visible checked**, **Solid unchecked**, **Persistent unchecked**.
2. **Parent = existing `obj_mm5_pickup`**. Important: this joins the already working central pickup collection/cleanup pass and inherits its ordinary Draw event. It is NOT a terrain parent.
3. Add **Create → Execute Code**, paste the WHOLE **`Objects/obj_mm1_cutman_large_health_create.gml`**, save.
4. **NO Step, Begin Step, End Step, Draw, Collision or Destroy events.** Do not add an inherited Create action; fields are explicitly initialized. Leave inherited Draw alone.
5. No instances in the room editor. The new script owns its single placement.

Do not change the existing `obj_mm5_pickup` object or any pickup sprites/events.

## 3. APPEND ONCE to manager Create — NOT a replacement

Open **Objects → Mega Man → MM5 → Combat → `obj_mm5_combat` → Create → Execute Code**, or its current folder.

At the bottom, AFTER all accepted eight-enemy AND Free Fall initialization, append the WHOLE **`Hooks/obj_mm5_combat_create_large_health_append.gml`**, once only. Block begins **`cutman_health_x = 1832;`** after its comment.

Keep all existing code, including `screw_spawn_count` and `combat_pit_death`. Do not paste into stage/camera Create or manager Step/End Step.

## 4. REPLACE TWO complete existing scripts

Folder **Scripts → Mega Man → MM5 → Combat**, or their current folder.

1. Existing **`scr_mm5_combat_end_frame`**: select ALL code, replace with the WHOLE **`Scripts/scr_mm5_combat_end_frame.gml`**, save.
2. Existing **`scr_mm5_combat_pickup_step`**: select ALL code, replace with the WHOLE **`Scripts/scr_mm5_combat_pickup_step.gml`**, save.

These are Script resources, not object events. End-frame keeps the accepted Screw version intact except one route-rearm line and one final fixed-pickup spawn call. Pickup-step adds only a fixed-object early exit before the unchanged random-drop body. Existing collect/refill/Draw logic is NOT replaced.

**Do not reinstall earlier combat checkpoints, append earlier enemy initialization again, or replace camera/gate/room/terrain/player/audio/death/shot scripts.** No extra movement/collection pass.

## 5. Compile and playtest

1. Compile. Unknown `cutman_health_x`/`cutman_health_armed` means step3 is missing. Unknown resource means steps1/2 are incomplete.
2. Reach the top horizontal section: worldX1832/Y184 on the right-side ledge. Exactly one large health capsule should be there. No new manual instance is needed.
3. Wait more than 5 seconds: it must stay on the ledge without falling, countdown flicker or disappearance. Its normal two-phase MM5 animation continues.
4. Collect while damaged: **+10 capped28**, incremental bars and accepted sound/freeze; movement, enemies, shots and refill resume normally. Slide collection also uses existing bounds. Recoil still prevents immediate collection until the accepted hurt restriction ends.
5. At full health it disappears silently; it must not continually regenerate while standing there. Leave the anchor's view/band and return to check screen-entry rearm. A route handoff must not leave duplicates or stale pickups.
6. Pause/resume with the pickup visible and during refill; retain existing charge/music policy. The new actor follows the parent's existing pause/deactivation/Draw/cleanup ownership.
7. Enemy-dropped large/small health must still fall, expire, collect and refill exactly as before. Recheck both doors, free falls/pits, Screw Bomber art/behaviour and the seven earlier enemies—none of their resources changed.

Invisible pickup usually means the required `obj_mm5_pickup` parent is missing or an empty Draw event was added. Disappearing after about4seconds/falling means the new fixed object was not created/selected or pickup-step replacement is missing. Duplicate regeneration usually means manager append/central spawn was duplicated or a manual room instance was added.

## Evidence and limits

`Reference/native-cutman-large-health.json`: supplied USA ROM record/table/instruction bytes, controlled600-update stationary/no-expiry trial, original +10 collection. The lifetime trial substitutes the native item type into an opening-area fixture; it is NOT used for sprite extraction or claimed natural traversal. Existing accepted MM5 sprite/refill evidence supplies project visuals/effects. Native record mapping independently checked against final stage geometry.

Source/model tests exercise actual GML with limited mocks: native record, ledge placement,1000-update anchor/no-expiry, view/band edges, no duplicates, born guard, +10/cap/full-health/slide/hurt, refill/audio, route cleanup/rearm, unchanged random drops and exact accepted source preservation. **Not GMS1.4 compilation/scheduler/GPU/installed acceptance. Please report your compile/playtest result.** No ROM, savestate or disassembly is shipped.
