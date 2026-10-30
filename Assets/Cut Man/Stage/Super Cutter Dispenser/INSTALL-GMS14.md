# Super Cutter building sprite/object correction — GMS1.4.1760

Apply AFTER Fourth Ladder Transition (1536x1200room, ten scripted blocks). This patch separates the building artwork from scenery; it does NOT add cutter-spawning AI. No route extension or geometry change. Back up affected resources first.

## 1. Add ONE Sprite

Folder **Sprites > Cut Man > Stage > Hazards > Super Cutter Dispenser**.

Name **spr_mm1_super_cutter_dispenser**. Load matching96x80PNG as ONE frame. Origin **X0,Y0** (top-left), no centering. Preserve PNG transparency; Remove Background OFF, smoothing OFF. No resize, splitting or animation. Keep opaque black pixels in its opening. Collision mask can remain automatic: this object is not used as terrain collision.

Native-decoded building appearance is unchanged. This is an authorised conversion of background artwork to a sprite for this project, not a claim NES hardware originally drew that entire building as sprites.

## 2. Add ONE Object

Folder **Objects > Cut Man > Stage > Hazards > Super Cutter Dispenser**.

Name **obj_mm1_super_cutter_dispenser**:
- Sprite spr_mm1_super_cutter_dispenser.
- Visible ON, Solid OFF, Persistent OFF.
- Parent **none**. Not obj_stage_solid, not an enemy parent.
- Create: one Execute Code action containing entire obj_mm1_super_cutter_dispenser_create.gml.
- No Step/Draw/Collision events. Default sprite drawing is intended; Create sets depth999, frame0, image_speed0.
- Do NOT manually place it in the room.

Building is non-solid just as its original terrain class0 was. Adding a sprite does not invent a collision wall. Existing floor below it remains unchanged. Future behaviour will own separate cutter objects; none are installed here.

## 3. Add ONE Script

Folder **Scripts > Cut Man > Stage > Ladder Route**.

Name **scr_mm1_cutman_ladder_route_features**. Entire matching.gml file. Creates the building once atworldX864,Y128 (first screen of upper horizontal run, localX96,Y128).

## 4. Replace ONE existing Script

Existing **scr_mm1_cutman_ladder_route_tiles** gets the entire matching file from THIS patch. It removes the30building tiles;1177scenery placements remain. No duplicate image behind the sprite. Same existing bg_mm1_cutman_ladder_route_tileset, no atlas reimport or editing. Unused artwork may remain in atlas; it is not placed by script.

Do NOT replace camera scripts/events, collision script, blocks script, helpers or player/pause events. All ten blocks and route connection timing stay unchanged.

## 5. Add ONE call to existing stage Create

Existing **obj_mm1_cutman_stage > Create**, immediately after existing three geometry calls, add only:
```
scr_mm1_cutman_ladder_route_features();
```

That section should now read:
```
scr_mm1_cutman_ladder_route_tiles();
scr_mm1_cutman_ladder_route_collision();
scr_mm1_cutman_ladder_route_blocks();
scr_mm1_cutman_ladder_route_features();
```

If existing calls are separated, keep their order/other code and put new call after last geometry call. Once per room entry, not in Step. Keep ALL stage music buffers/queue/Alarm/async/cleanup and unrelated code. Do NOT replace whole stage Create. Do not also manually place an object. No room/player/view/arrival/HUD/music settings change.

## 6. Restart and test

1. Stop/restart, climb into horizontal run. Building should look exactly as before, same96x80position and pixel art.
2. Confirm one obj_mm1_super_cutter_dispenser instance (debugger if available); no duplicate after restart/re-entry. Code has one creation call. All10blocks still present.
3. Move/jump through same areas: building remains non-solid; floor/ladders/route/camera unchanged. Player appears in front, scenery behind. No cutter projectiles should appear yet.
4. Pause near building, close menu, walk away/return; image/visibility correct, music/charge/HUD unchanged. Test current handoff up/down again.
5. If missing: check Visible/sprite/origin0,0/new features call. If doubled during manual movement/debug hide: ensure tile-script replacement and no manual building instance. If wrong position: room/view/player start must remain current Fourth settings, not another+240.

Source/model pixel reconstruction passes for entire1536x1200scene with1177actual tile calls,10blocks and one sprite, exactly matching previous reference. This is NOT GameMaker compiler/GPU/event-scheduler/runtime proof; test in project. No AI/fire cadence/trigger/cutter sprites/sounds/damage certified or implemented here.

## Rollback

Restore Fourth package's tile script and remove only new features call from stage Create. New sprite/object/script may stay unused. No camera/room/collision/blocks changes to undo. Restart. Never restore tiles AND keep building instance creation together.
