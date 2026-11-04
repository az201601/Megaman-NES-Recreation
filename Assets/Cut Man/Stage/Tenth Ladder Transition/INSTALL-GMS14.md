# Tenth descending connection — GMS1.4.1760

Upgrade from the **confirmed working Ninth connection + camera repair**. Back up the project and stop the old run first.

Adds original **page17/room10** below page16, with its upward return. **No coordinate shift** this time. The room introduces native spikes: these are separate scripted sprite/objects, **artwork only for now**, not scenery tiles and not working damage/death hazards yet.

## 1. Create TWO new resources first

These are the only new resource names. Create folders as needed; do not manually place their instances.

### Sprite

**Sprites > MM1 > Cut Man > Stage > Hazards > `spr_mm1_cutman_spike`**

- Load `spr_mm1_cutman_spike.png`: **16×16**, one subimage, original recovered native artwork.
- Origin **X0,Y0**; preserve the PNG's transparency, do not remove another background colour.
- Leave the mask settings at their default; damage collision policy is deferred. Do not scale/repaint or import as a Background.

### Object and event

**Objects > MM1 > Cut Man > Stage > Hazards > `obj_mm1_cutman_spike`**

- Sprite: **`spr_mm1_cutman_spike`**.
- Parent: **None**; Visible **ON**, Solid **OFF**, Persistent **OFF**.
- **Create event**: paste the ENTIRE `obj_mm1_cutman_spike_create.gml`.
- No Step, Draw, Collision, Room Start or other events. Automatic sprite drawing is intended.
- Create sets depth999, image_speed0, image_index0. This object does not apply damage, kill the player or create terrain collision. The original solid platforms beneath the spikes remain separate invisible terrain.

The updated feature script creates **ten** instances: two on the upper-right platform, eight across the bottom-right floor. No manual room-editor spike instances. No new dispenser/block resources.

## 2. Replace FIVE existing scripts

In **Scripts > Cut Man > Stage > Ladder Route**, or their current folder, replace each exact existing Script resource's ENTIRE contents:

1. `scr_mm1_cutman_ladder_route_tiles`
2. `scr_mm1_cutman_ladder_route_collision`
3. `scr_mm1_cutman_ladder_route_blocks`
4. `scr_mm1_cutman_ladder_route_features`
5. **`scr_mm1_cutman_scroll_start`**

Do not append code or create suffixed duplicates. In particular, scroll_start is a **Script**, not an object event. Its matching Tenth code contains `route_start_version = 1001;`, explicit target10/9 selection, and the measured95-update upward return. Installing only camera events can no longer silently reuse an older start script: the safeguard raises a named mismatch error instead.

Features places both old dispenser objects at their unchanged coordinates864,1088 and1376,128, plus the ten new spike objects. Thirteen existing Super Arm blocks retain their coordinates. No manual buildings/blocks/spikes and no baked spike/building tiles.

**Keep stage Create/music unchanged.** Its verified tiles/collision/blocks/features calls already run once per entry. Do not add a second feature call or move geometry calls to Step. Preserve ALL music/buffer/queue/async/alarms/cleanup/unrelated initialization.

Keep `scr_mm1_cutman_route_busy`, `scr_mm1_cutman_scroll_finish`, `scr_mm1_cutman_scroll_dispose`, player Step/pause Begin Step guards, movement/charge/arrival/HUD/menu/audio unchanged.

## 3. Replace THREE existing camera events

**Objects > Cut Man > Stage > Ladder Route > `obj_mm1_cutman_camera`**, or its current folder:

| Existing event | Entire replacement file |
|---|---|
| Create | `obj_mm1_cutman_camera_create.gml` |
| Step > Begin Step | `obj_mm1_cutman_camera_begin_step.gml` |
| Step > End Step | `obj_mm1_cutman_camera_end_step.gml` |

Keep Other > Room End and Destroy unchanged. Exactly one invisible, non-solid, nonpersistent camera, no Sprite/normal Step/Draw. All three events and scroll_start must match this package; do not mix Ninth repair901 with Tenth1001. The confirmed explicit-target/mismatch repair is retained, not reverted to the old up-only index formula.

## 4. KEEP room/view/player coordinates

In **Rooms > Cut Man > Stage > `rm_mm1_cutman_stage`**:

- Room **2048×2160**, speed60, unchanged.
- View0 visible/enabled, followNone, **X0,Y1920,W256,H240**; other views off.
- Viewport X0,Y0,W256,H240; keep GUI/window/aspect/application-surface/filtering settings.
- Existing player startX unchanged; startY **original openingY+1920**. Original180 means **2100**, unchanged.
- Cyan-only sky tiled on both axes; no reference panorama as a room background.

**DO NOT add another240** to the room, view, player or accepted scenery. New page17 occupies previously empty **X1792–2047,Y480–719**, fixed camera **1792,480**, player bounds1800–2040. Page16 remains1792,240; the upper horizontal run remainsY0; earlier sections stay fixed.

Existing Background `bg_mm1_cutman_ladder_route_tileset` stays128×64/25tiles,16×16 tiling, offsets/separations0. Existing `spr_mm1_super_cutter_dispenser` stays96×80/origin0,0. Both included recovery copies are unchanged: do not rename/reimport working resources. The new spike PNG is the one required new sprite import.

## 5. Restart and test

1. Stop/restart rather than resume the old offscreen state. READY/arrival/music/HUD/menu and opening alignment must remain unchanged. If using the earlier diagnostic, opening **VIEW0,1920 / ATLAS128x64**; original180 player2100, ledge2016/screen96, floor2112/screen192. Remove only temporary diagnostics afterward.
2. Recheck earlier handoffs, especially the first upward transition shown in the bug video. It must remain in the upper room after unlock. If a mismatch error names scroll_start, replace that exact entire Script resource with THIS package's1001 version and all three camera events; do not bypass the guard or guess target numbers.
3. Repeat ninth right descentX1992/returnUp, both126, and upper-run left returnX1336,95. All previous geometry, thirteen blocks and two dispenser objects remain in place.
4. In page16 (camera1792,240), descend its **bottom outgoing ladder, player centreX1896**. This is the Tenth connection. Down takes **126 updates**, cameraX1792 throughout, finishing atY480. No left snap, arrival/music restart or return to page12.
5. Explore page17. Incoming ladder is top atX1896. Its merged volume isX1888,Y448,height64 acrossY480: no artificial lip atY480. Existing gray wall panel/green platforms are scenery/terrain; spike triangles are individual sprite/objects, not tiles. Two spikes at(2000,528)/(2016,528), eight atX1920–2032 step16,Y688.
6. **Spike damage is intentionally not installed.** Passing through their artwork without damage is not a hazard implementation claim or a newly broken health system. Native class3 remains distinct from class1 terrain. Avoid relying on these placeholders as solid ground; native floors/platforms beneath remain separate. No MM1 instant-kill exception, MM5 invulnerability rules or death/respawn have been guessed here.
7. Climb the same top incoming ladderX1896 back to page16. This upward return takes **95 updates**, NOT126. Repeat down/up several times, then return through ninthUp126 and eighth-leftDown95: targets/timing/camera must reset for each route.
8. Next **bottom-left outgoing ladder, player centreX1832**, startsY688 and ends720; it is NOT connected yet. Stop before descending out there. Death/respawn remains deferred, so leaving the built route may require restart. Existing horizontal pitX1184–1215/Y1152–1199 must still be jumped; no extra floor/teleport has been added.
9. Pause before/after both new directions and inside page17. Cached scene/HUD/fades restore1792,480. Fresh Start before entry has priority; Start/A during automatic handoff must not pause, jump or move. Test basic/mid/full shots before entry, old continuous charge, release/re-press during busy, and fresh fire atready126Down/95Up. Own charge voice resumes correctly, stale release cancels, busy-period new holds are release-rearmed, outgoing shots clear, music stays untouched.
10. Restart/re-enter: no duplicate blocks/buildings/spikes, stale busy state or paused voice. Send compile resource/event/line or section/direction/screenshot for problems. The two new resource names must exist before updated feature-script compilation.

Geometry: **2196 scenery tiles,102 terrain solids,24 ladders,24 tops,13 scripted blocks,2 dispenser objects,10 spike objects**. Optional `obj_stage_solid` debugcount115 includes13 block descendants, not spikes. All accepted cells/objects/features stay at the same coordinates; only the new room and merged incoming seam are added.

**48 source/model checks pass**, all20 actual GML native busy-frame direction cases, independent ready timings, both prior900-frame horizontal cameras,10 seams, unchanged accepted pixels outside page17,2196 actual tile calls plus separate objects, spike artwork reconstruction, repeated target/timing/camera selection, mismatch/video regressions, charge/rearm/cleanup. Actual GMS1.4 compilation/GPU/event scheduling/async/descendant iteration/collision fit still require your confirmation. No enemies/cutter spawning/damage/pickups/tank effects/death/checkpoints/boss completion claimed.

## Native provenance / adaptation limits

Supplied MM1 USA ROM /JSNES2.1.0 /Mesen RGB mapping, not Mesen executable/hardware or a new comprehensive ASM byte audit. Inherits prior controlled lead-ins (including renderer traversals). One controlled placement on page16/X104/Y222 with fraction/velocity/pose reset/protection100, one neutral original frame to refresh collision cache, then original Down-only; no new horizontal traverse or extra patches for Up return. Not natural whole-stage traversal.

- Down: trigger14, scroll46–105, finish106, bookkeeping139, normal140: **age126**.
- Up-only fromDown184: trigger50, scroll82–141, finish142, bookkeeping144, normal145: **age95**. Do not infer this from flags or assume all Up126.
- Fresh Down123–125 ignored/126–128 accepted; fresh Up92–94 ignored/95–97 accepted independently.
-960 live nametable tile-ID and palette pairs validate page17/room10. No nativekind2 blocks here. Ten native class3/raw196/palette1 cells share identical16×16 art; cyan made transparent without repainting, rendered with separate objects. This is our authorized sprite/object adaptation, not a claim original hardware drew these cells as OAM sprites.
- All new-room pixels exactly reconstruct the native image. Every accepted pixel outside the new room remains identical to the repaired Ninth reference, existing atlas/sprite copies byte-identical. MM5 normal movement/art/climb1.296875/9-update cadence/8px edge padding/charge/menu/fall policies remain adaptations; native-entry subpixels are injected for busy-frame comparisons, not exact MM1-player runtime claims.

## Rollback to confirmed Ninth repair

Restore repaired Ninth's five existing scripts and three camera events together (protocol901). Keep room2048×2160/view1920/player2100 if original180 unchanged. Tenth spike resources may remain unused, but do not manually place them; restoring Ninth features removes their scripted placements. Do not install pre-repair mixed camera/start code. Existing buildings/thirteen blocks/music/helpers/guards remain unchanged. Restart.
