# Eleventh connection and two-screen gate approach — GMS1.4.1760

Upgrade from **user-confirmed Tenth**, retaining the confirmed camera repair. Stop the game and back up the project first.

Adds the bottom-left descent from page17 to original **pages18–19**, its upward return and the full two-screen approach to a **closed gate**. Gate opening/passage and the room beyond are not installed yet. All new blocks and the gate are objects, not scenery.

**This update changes room WIDTH and atlas CONTENTS. It does not shift anything vertically.**

## 1. Create TWO new resources

### Closed gate sprite

**Sprites > MM1 > Cut Man > Stage > Doors > `spr_mm1_cutman_boss_gate_closed`**

- Load `spr_mm1_cutman_boss_gate_closed.png`: **32×64**, one subimage.
- Origin **0,0**; do not remove a background colour, rescale, smooth or repaint.
- Set collision mask **Rectangle**, precise OFF, manual bounds **left0/right31/top0/bottom63**. This represents the full closed barrier while gate operation is deferred.

### Closed gate object and Create event

**Objects > MM1 > Cut Man > Stage > Doors > `obj_mm1_cutman_boss_gate`**

- Sprite: `spr_mm1_cutman_boss_gate_closed`.
- **Parent: `obj_stage_solid`** so the existing MM5 collision queries block the closed gate. Do not invent another invisible solid behind it.
- Visible ON, Solid **OFF**, Persistent OFF. The Solid checkbox is not the project's collision system.
- **Create event**: paste all of `obj_mm1_cutman_boss_gate_create.gml`. It sets depth999, frame0, static artwork and the explicit32×64 sprite mask.
- No Step/Draw/Collision/Room Start/other events. No opening animation, auto-walk, boss trigger, sound or passage logic yet. Parent membership/mask supply the closed obstruction; no manual instance placement.

This is a static endpoint barrier for the current build, not a claim of original boss-entry behaviour. Gate artwork is recovered from the original closed gate, not invented.

## 2. Update the EXISTING Background image — mandatory

**Backgrounds > MM1 > Cut Man > Stage > `bg_mm1_cutman_ladder_route_tileset`**, or its existing folder:

- Load/replace its image with THIS package's `bg_mm1_cutman_ladder_route_tileset.png`, keeping the exact existing resource name.
- Still **128×64**, but now **28 populated tiles**, not25. Three original gate-wall tiles are appended; old25 indices/pixels stay unchanged.
- Background, **not Sprite**; tiles16×16, offsets/separations0; preserve PNG alpha/colours, Remove Background OFF, no smoothing.
- **Do not skip this because the dimensions look unchanged.** An older128×64 image lacks the three new wall tiles and can show missing scenery without a size error.

Existing spike16×16 and dispenser96×80 PNGs are included unchanged for recovery only. Do not recreate/rename their working resources or change spike damage policy. The gate PNG is the only new Sprite import; the atlas is an existing Background image update. Reference panoramas are not room backgrounds.

## 3. Replace FIVE existing Scripts

In **Scripts > Cut Man > Stage > Ladder Route**, or current equivalent folder, paste each matching ENTIRE `.gml` into the exact existing Script resource:

1. `scr_mm1_cutman_ladder_route_tiles`
2. `scr_mm1_cutman_ladder_route_collision`
3. `scr_mm1_cutman_ladder_route_blocks`
4. `scr_mm1_cutman_ladder_route_features`
5. **`scr_mm1_cutman_scroll_start`**

No appended code or suffixed duplicate scripts. Scroll_start is a Script, not an object event. The new matching handshake is **1101**; do not reuse Tenth1001 or Ninth901 start code. Missing/mixed scripts produce a named error instead of the previous silent camera reset.

The blocks script places all **seventeen**: the original thirteen unchanged plus four at1824,848;1856,848;1856,880;1888,880. Features places both existing dispensers, ten existing spikes, and one new closed gate at **2272,816**. Never manually place these objects. No duplicate permanent block/gate collision or baked object artwork.

**Keep stage Create/music unchanged.** Its verified four once-per-entry geometry/features calls already work. No second feature call, geometry in Step, music/async/buffer/queue/alarm/cleanup replacement. Keep helpers `scr_mm1_cutman_route_busy`, `scr_mm1_cutman_scroll_finish`, `scr_mm1_cutman_scroll_dispose`, player Step/pause Begin Step guards, movement/charge/menu/HUD/arrival/audio unchanged.

## 4. Replace THREE camera events

**Objects > Cut Man > Stage > Ladder Route > `obj_mm1_cutman_camera`**, or existing folder:

| Existing event | Matching ENTIRE file |
|---|---|
| Create | `obj_mm1_cutman_camera_create.gml` |
| Step > Begin Step | `obj_mm1_cutman_camera_begin_step.gml` |
| Step > End Step | `obj_mm1_cutman_camera_end_step.gml` |

Keep Other > Room End and Destroy unchanged. Exactly one invisible, non-solid, nonpersistent camera, no Sprite/normal Step/Draw. All three events and start script must match1101. Explicit route targets and per-call version guard remain in place.

## 5. Change room WIDTH only

In **Rooms > Cut Man > Stage > `rm_mm1_cutman_stage`**:

| Setting | Required |
|---|---|
| Room width | **2048 →2304** |
| Room height | **2160 unchanged** |
| Speed |60|
| Starting visible view0 | **X0,Y1920,W256,H240**, followNone |
| Viewport |X0,Y0,W256,H240; other views off|
| Existing player's startX |unchanged|
| Existing player's startY |**Original openingY+1920**, original180 means **2100**, unchanged|

**Do not add another240** to height, viewY, player or existing scenery. Keep cyan sky tiled on both axes and existing GUI/window/aspect/application-surface/filtering settings. Leave manager instances in place.

New stripe **X1792–2303,Y720–959**, cameraX1792–2048,Y720, player bounds1800–2296. Earlier room/camera/player bounds retain their accepted widths: widening the room does not extend them. New rightmost space above/below this stripe stays cyan, not extra platforms.

## 6. Stop/restart and test

1. Restart, not resume an old offscreen state. Opening remains VIEW0,1920 /ATLAS128×64 if using the temporary diagnostic; player2100 for original180, ledge2016/screen96, floor2112/screen192. Note size diagnostics alone cannot detect a stale25-tile atlas: do step2 above. Remove only temporary diagnostics afterward.
2. Check first upward handoff from the bug video stays in its destination after unlock, then previous ten connections both directions. A mismatch error means replace the exact entire1101 start Script and all three camera events, not guessed target values. Old positions/cameras/timings remain unchanged.
3. In page17 (camera1792,480), descend **bottom-left ladder, player centreX1832**. Eleventh Down takes **126 updates**, cameraX1792 throughout, finishing view1792,720. No old-room snap, teleport to page12, arrival/music restart.
4. Explore both new screens. Camera followsX1792–2048 atY720. Four new Super Arm blocks form the original stepped group near the left; all seventeen are separate solid children, not baked tiles/permanent duplicate solids. Pickup/throwing remains later Super Arm functionality.
5. At the far-right end, the gate at2272,816 is a **closed32×64 sprite/object**. It should block walking/sliding through its opening, show no duplicate tile image and not have a16×16 inherited mask. The original wall/terrain surrounds it. **Do not expect it to open yet**: no boss-entry passage/auto-walk or room beyond is included. If it is invisible, check new Sprite assignment/Visible/Create; if passable, check parent `obj_stage_solid` and full mask. Do not compensate with an extra room-editor wall.
6. Return across the run and climb the **same top-left incoming ladderX1832** in the first screen. Up takes **95 updates**, returning view1792,480 to page17. Shared ladderX1824/Y688/h96 crossesY720 with no false seam lip. No outgoing ladder in this stripe; the next route step is the closed gate.
7. Repeat eleventh down/up, then tenthUp95, ninthUp126 and older eighth-leftDown95. Each new route must select its correct target/timing. Right-screen Up/Down or falling through invalid areas must not invent a return. Existing horizontal pit1184–1215/Y1152–1199 is still unimplemented death/respawn territory: jump across, restart if necessary.
8. Pause before/after the new directions, among the blocks and at the gate. Cached scene/HUD/fades must restore the correct horizontal camera. Fresh Start before a trigger has priority; Start/A while automatic must not pause/jump/move. Test shots and old held charge/release/re-press/fresh fire atready126Down/95Up. Outgoing shots clear, stale charge cancels, continuous own charge voice resumes, new busy holds release-rearm; stage music unchanged.
9. The ten earlier spike objects stay at their accepted positions. **Still artwork only, no damage/death**; this update does not enable MM1 instant-kill rules or guess MM5 invulnerability. Both dispensers remain inert and separate. No new enemy/cutter spawning, pickup/tank effects, death/checkpoint or boss AI work included.
10. Restart/re-enter: no duplicate geometry/blocks/spikes/buildings/gate, stale busy state or paused voice. Report compile resource/event/line or direction/section/screenshot for issues. Create the two new gate resources before compiling the new feature script.

Counts: **2354scenery tiles /106terrain solids /24ladders /24tops /17blocks /2dispensers /10spikes /1closed gate**. Optional `obj_stage_solid` debugcount124 includes17 block children +one gate child. Eight gate cells and sixteen new block cells are excluded from scenery, no duplicate permanent terrain behind them.

**55 source/model checks pass**: all22 captured actual GML busy-frame direction cases, fresh readiness, previous900+900 horizontal captures plus new263-frame camera capture,11 merged seams, accepted positions/pixels, widened cyan void, appended atlas preservation,2354 actual tile calls/full scene+separate objects, gate art/footprint, repeated route targets/timing, mismatch/video regression, charge/rearm/cleanup. GMScompiler/GPU/scheduler/async/descendant iteration/masks/collision fit remain unverified here: your runtime confirmation is required.

## Original reference / adaptation limits

Supplied MM1 USA ROM, JSNES2.1.0, Mesen RGB mapping; not Mesen executable/hardware/new comprehensive ASM audit/natural whole-stage traversal. Inherits controlled lead-ins including earlier renderer traversals. One placementpage17/X40/Y222 with fraction/velocity/pose reset/protection100, neutral collision-cache refresh, then original Down-only; Up-only fromDown184, no further patches.

- Down trigger14/scroll46–105/finish106/bookkeeping139/normal140: age126; fresh123–125 ignored/126–128 accepted.
- Up trigger50/scroll82–141/finish142/bookkeeping144/normal145: age95; fresh92–94 ignored/95–97 accepted.
- Original begin18/end19/order11. **1920 live tile-ID and palette pairs** validate both pages. Separate263-frame controlled Right/A-once replay pinsY36/velocity0/protection100; stops at first camera maximum before gate operation. This verifies camera/PPU, not walk/jump/gate/enemy behaviour.
- Four original kind2 page18 entries supply separate32×32 blocks. Original kind3 page19 X224/Y96 towrappedX0/Y160 supplies32×64 closed gate; mask/blocking here is a temporary closed-endpoint adaptation, not original gate-operation certification. Original special handling is not ordinary class1 terrain; its eight class0 artwork cells are replaced by the object.
- Every existing pixel outside the new stripe stays identical to accepted Tenth; right-side void elsewhere cyan. Full512×240 native stripe matches with separate four blocks and closed gate. First25 atlas tiles preserved exactly, three gate-wall tiles appended; spikes/dispenser art unchanged.
- MM5 normal art/physics/climb1.296875/9-update cadence/8px edge padding/menu/charge/fall adaptations retained. Native entry subpixels injected for trace tests; actual MM5 entries differ. All mechanics outside this scoped connection remain unchanged.

## Rollback to confirmed Tenth

Restore Tenth's five existing scripts and three camera events (1001), existing Background image25tiles, roomwidth2304→2048; keep height2160/view1920/player2100 for original180. Gate resources may remain unused; no manual placements. This removes the new gate/four blocks/stripe and restores bottom-left outgoing as unconnected. Existing13blocks/2dispensers/10spikes remain. Helpers/music/guards unchanged; restart.
