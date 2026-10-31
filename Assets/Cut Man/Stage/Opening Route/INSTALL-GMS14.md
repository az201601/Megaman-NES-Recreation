# Cut Man opening route + camera — GMS1.4.1760

This expands the installed first screen into the original **four-screen opening horizontal run**, worldX0..1023, ending at the upward ladder on the far right. NOT the complete stage yet. No active enemy/combat or upper-room handoff installed here. User already imported spr_mm1_blader; keep it unused until proper spawning/combat are ready.

Back up the project/room and obj_mm1_cutman_stage Create. Source/ROM/data tests pass; **not compiled or run in GameMaker here**. Do not overwrite working music/arrival/player/HUD/pause events.

## 1. Add ONE Background tileset

Folder: **Backgrounds > Cut Man > Stage > Opening Route**.

Name exactly **bg_mm1_cutman_opening_tileset**. Load matching PNG128x32 as a **Background resource**, not a Sprite. Use as tile set ON; tile width/height16; offsets/separations0. Preserve alpha; Remove Background OFF; smoothing/interpolation OFF.

This is a new13-tile atlas replacing the first-screen-only atlas FOR THIS ROOM'S runtime tile script. Do not import layout/scenery reference PNGs as backgrounds. Keep old atlas/scripts for rollback; do not run both sets of scripts.

## 2. Add THREE Scripts

Folder: **Scripts > Cut Man > Stage > Opening Route**. Exact names, entire matchingfiles:

- scr_mm1_cutman_opening_tiles
- scr_mm1_cutman_opening_collision
- scr_mm1_cutman_opening_blocks

First builds scenery tiles. Second builds invisible regions from original ROM collision classes, not colours/visual art. Third creates FIVE extension block instances only; original FOUR room-placed blocks remain.

## 3. Change ONLY the geometry calls in stage Create

Object: **Objects > Cut Man > Stage > obj_mm1_cutman_stage > Create**.

Find this existing line:
```
scr_mm1_cutman_screen01_tiles();
```
Replace ONLY that line with:
```
scr_mm1_cutman_opening_tiles();
```
Find this existing line:
```
scr_mm1_cutman_screen01_collision();
```
Replace ONLY that line with:
```
scr_mm1_cutman_opening_collision();
scr_mm1_cutman_opening_blocks();
```

Leave ALL music queue/buffer/Alarm/async/RoomEnd code and other initialisation intact. Do not replace the whole Create with these lines. Each new script runs ONCE per entry. No old screen01 script calls should remain active in this room. Keep show_stage_regions/debug drawing if installed.

If either old call is absent, report your existing stage Create before adding duplicates. These instructions assume prior prescribed runtime tile/collision setup, not unknown manually duplicated terrain.

Keep four existing obj_mm1_super_arm_block instances at128,64;128,160;160,128;160,160. Keep sprite32x32/origin0,0/full rectangular mask and parent obj_stage_solid as already installed. Do not add invisible permanent solids beneath blocks. Do not use instance_activate_all or mass-delete solids/blocks.

Extension script creates ONLY384,64;384,160;416,128;416,160;640,96. Do not also place those five in the editor. Nine total blocks, still removable objects—not scenery. Pickup/throwing not implemented by this update; Buster-only inventory stays unchanged.

## 4. Expand EXISTING stage room / set view0

Resource: **Rooms > Cut Man > Stage > rm_mm1_cutman_stage**. Keep all existing working instances in their current coordinates (player, stage start/arrival, HUD, music/stage controller, pause controller and four blocks).

- Room width **1024**, height **240**, speed **60**.
- Keep existing cyan-only background bg_mm1_cutman_screen01_background at0,0, bottom layer, visible, Foreground OFF. Enable **horizontal tiling** so sky fills extended room. Vertical tiling OFF; Stretch OFF; speeds0. Do not use the assembled panorama as a room background.
- Enable **views**. Enable **Visible when room starts** for view0 only. Other views remain disabled.
- View in room: X0,Y0, width256,height240.
- Viewport on screen: X0,Y0, width256,height240.
- Object following: **<no object>**. No built-in follow competing with camera code.
- Keep existing game window/enlargement/aspect settings, pixel interpolation OFF, application_surface enabled, GUI256x240. Do not enlarge GUI to room1024wide. Renderer displays ONE256x240 viewport, not the whole1024wide room.

## 5. Add ONE camera object with TWO events

Folder: **Objects > Cut Man > Stage > Opening Route**.

Create **obj_mm1_cutman_camera**:
- Sprite none; Visible OFF; Solid OFF; Persistent OFF; Parent none.
- **Create**: paste obj_mm1_cutman_camera_create.gml in full.
- **Step > End Step**: paste obj_mm1_cutman_camera_end_step.gml in full. NOT normal Step/BeginStep/Draw.

Place exactly ONE at0,0 in the existing stage room. No automatic room switching/vertical-scroll scripts yet. No Draw event. Camera starts at0 during READY/arrival, then uses floor(player.x)-128 clamped0..768, Y0. No easing, dead-zone or MM1 player speed substituted for your working MM5 movement.

Pause controller already freezes/restores active IDs, including this camera. Its stage snapshot uses the current application_surface viewport plus known health HUD, so no pause source edits needed. Existing basic/charged projectile parent EndStep already culls using visible view0 when enabled; runtime-test its edge timing with new camera—source mocks do not certify engine EndStep scheduling.

## 6. Restart/test THIS checkpoint

1. Fresh stage entry: READY/beam/materialisation at original player position, no immediate camera jump; music unchanged. First screen visually unchanged except removal of the one-pixel black top scanline in old capture (native sky remains cyan right to top; see evidence below).
2. Walk/jump/climb the opening run. Camera begins following past logicalX128, stays centered horizontally when away from limits; moves left again when you return; stops at0 and768. No smoothing, shaking or one-frame border/background gap.
3. Original first-screen geometry: floorY192, roofY96, left96-high/right32-high ladders, passable ladder tops and four blocks must still work. No invisible permanent block collision after a block is later removed.
4. Explore newly visible repeated building, stepping platforms, and right-hand tower. Beige/grey wall fill, vents/windows remain NON-solid scenery. Roofs/steps/floor use original terrain-class solids; six ladder volumes and five internal one-way ladder tops across opening route. Top-edge ladder continues into next unimplemented section, NOT a platform atY0.
5. Existing F2 region overlay if installed:22ordinary terrain solids +9block children =31instances queried as obj_stage_solid,6ladder regions,5ladder tops. No duplicate old first-screen regions. Extra manual test fixtures can change counts; do not delete working stage objects indiscriminately.
6. Pause at left/middle/right, including airborne/ladder/slide and holding a charge. Opening/closing must show the current camera section plus health HUD, freeze view/world, preserve charge/music policy, then resume without snapping left or extra jump. GUI must remain fixed-screen.
7. Basic/mid/full shots travel/cull at camera edges rather than room edges. Test shots while walking both directions; do not weaken basic-shot limits or alter charge scripts to hide a bug.
8. Re-enter/restart: no duplicate blocks, regions, tiles, camera or music. Starting inventory/lives unchanged.
9. **Stop before climbing out at top of far-right ladder.** Next-room vertical handoff is not implemented in this checkpoint; do not treat it as stage completion or invent a blocker. Return along the route for current tests. No enemies, damage/death/checkpoints, pickups or E-Tank have been installed by these geometry scripts.

Report precise compiler resource/event/line or screenshot/video for any scenery, view, ladder/collision or pause discrepancy. Do not replace player/arrival/HUD/pause events for this checkpoint.

## Evidence / limits

- Supplied MM1 USA bank0 room-order/pointers, column-major32x32 blocks,16x16 metatiles, native CHR and attributes. JSNES2.1.0 + pinned Mesen0.9.9 RGB, NOT Mesen executable/hardware capture.
- Original opening stripe bounds read from RAM begin0/end3 and ROM layout. Original camera entry/player data: actual camera GML matches1620recorded frames across Right,Right+jump,reverse and controlled traversal.
-1920native tile IDs +1920palette entries match boot PPU pages0/1. Pages2/3: another1920tile/palette pairs match original scrolling uploads during a **controlled** traversal that pins playerY36/subpixels/vertical speed and protection100 each frame. No ROM/code patches. This is background-upload verification, NOT natural traversal or complete collision/enemy/hazard certification.
-462visual placements from13unique16x16tiles. Compositing scenery +9separate existing32x32block sprites reconstructs every pixel of all four ROM-decoded screens. First-screen static-solid and ladder coverage matches prior installed rectangles exactly.
- Earlier framebuffer reference has256black pixels along scanline0; direct native CHR decode and matching nametable have cyan sky there. New atlas does NOT carry that capture border forward. Other first-screen scenery pixels retained; all first-screen geometry unchanged. No claim that old black scanline was new level terrain.
- Under opaque first-screen blocks, retain approved scenery underlay (wall fill where appropriate), repeated for identical page1; page2block is over sky. Future native Super Arm replacement/pickup effects still require implementation; this underlay does not certify native destroyed-block behaviour.
- Collision classes are source data, not inferred art opacity. Rectangular-region/one-way ladder-top behaviour remains the established MM5 controller adaptation; full original terrain-probe mechanics are not claimed.
- Existing music/arrival/HUD/charge/player/pause code unmodified. No original score, enemy sprites, pickups, or boss doors flattened into these scenery tiles. No new sound for static scenery/camera.

## Rollback

Restore original stage Create geometry calls, remove camera instance, restore room256x240/viewsdisabled/background horizontal tiling OFF. Five extension blocks and all runtime tiles/regions vanish on restart. Keep original four editor blocks/player/arrival/HUD/pause/music. New unused resources may remain in folders. Do not mix old/new geometry calls.
