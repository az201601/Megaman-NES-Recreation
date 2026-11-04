# Ninth transition repair — GMS1.4.1760

For the ninth update and the repository recording `2026-10-31 14-13-20.mp4`.

## What the recording shows

The upward handoff scrolls into the room above, then the view returns to the lower room and the player disappears. The recording does not expose your installed event/script source, so it cannot alone prove which resource is stale.

The source/model reproduction is exact for this mixed version: Ninth Begin Step + an older Eighth `scr_mm1_cutman_scroll_start`. Ninth Create initializes `route_target_section` to0, but the older start script never changes it. At scroll completion the camera assigns section0, then End Step returns the view toY1920 while the player remains above it. Correct matching Ninth code selects section1 for the first upward handoff.

This small bundle reinstalls the matching camera and start script, and adds a per-call version handshake. If an older start script is still installed, a clear error names it at entry instead of silently resetting the camera. This does not claim your installed source has been inspected or that GameMaker runtime has been tested here.

## Replace these FOUR existing code resources

Stop the running game and back up the project. Do not add new scripts or camera instances.

1. **Scripts > Cut Man > Stage > Ladder Route > `scr_mm1_cutman_scroll_start`** (or its existing folder): replace the **ENTIRE script** with `scr_mm1_cutman_scroll_start.gml` from this bundle. This is a Script resource, **not an object event**. The new code contains `route_start_version = 901;` and `route_target_section = route_section - route_dir;`, plus explicit ninth branch selection. Do not append the file below old code or import it as a suffixed second script.
2. **Objects > Cut Man > Stage > Ladder Route > `obj_mm1_cutman_camera` > Create**: replace the entire event with `obj_mm1_cutman_camera_create.gml`.
3. Same camera, **Step > Begin Step**: replace the entire event with `obj_mm1_cutman_camera_begin_step.gml`.
4. Same camera, **Step > End Step**: replace the entire event with `obj_mm1_cutman_camera_end_step.gml`.

Keep Other > Room End and Destroy unchanged. One invisible, non-solid, nonpersistent camera instance, no Sprite/normal Step/Draw. Keep the existing geometry scripts, features, blocks, helpers, player/pause guards, stage Create/music/async/alarms, charge/HUD/arrival/menu unchanged. Both buildings and all thirteen blocks remain scripted. No new resources, art or geometry imports.

## Keep ALL coordinates unchanged

In **Rooms > Cut Man > Stage > `rm_mm1_cutman_stage`**:

- Room **2048×2160**, speed60.
- View0 **X0,Y1920,W256,H240**, visible/enabled, followNone; other views off.
- Viewport X0,Y0,W256,H240, existing display/GUI settings unchanged.
- Existing player startX unchanged; startY **original openingY+1920** (original180 means **2100**).
- Cyan sky tiled on both axes. No block/building/manager movement or duplicate instances.

**Do not add another240, lower the player to compensate, shift scenery, change the sky or edit stage Create.** This is a route-state/matched-code repair, not a terrain repair. The ninth room remains at1792,240; buildings864,1088 and1376,128 stay fixed.

## Stop, restart and retest

1. Stop the old run completely and run the project again. Do not resume the failed offscreen state.
2. Repeat the recorded upward handoff. On the first connection, the camera must stay at **768,1680** after reaching the room above; it must not snap back toY1920. Mega Man stays near that room's bottom ladder. Continue climbing, release Up and wait; return down and repeat.
3. If the new error names `scr_mm1_cutman_scroll_start`, check step1: replace the existing exact Script resource, not just the camera events, not a differently named copy. Restart. Do not remove the safeguard or change `route_target_section` to a guessed constant. If all four resources really match and it still fails, send their current full contents and the direction/room shown.
4. Recheck all previous transitions. At the upper three-screen run, left ladderX1336 still returns to page12 in95 updates; right ladderX1992 descends to the new room in126, and returns upward in126. Camera stays1792 for the right branch. Repeat right down/up, then left return, so stale target/timing cannot hide.
5. Pause/charge/shot cleanup/music behave as before. Existing pit and unfinished bottom exit remain unfinished; next outgoing ladderX1896 in page16 is still unconnected. Do not descend out there yet.

43 source/model checks pass, including the old mixed-version failure, immediate mismatch detection (even after a previous version value), correct post-unlock first-room camera, all18 native direction traces and repeated branch selection. Source/model tests are not GMS1.4 compiler/GPU/event-scheduler/audio/collision certification. Your runtime confirmation is still required. No next stage connection or enemy work included.
