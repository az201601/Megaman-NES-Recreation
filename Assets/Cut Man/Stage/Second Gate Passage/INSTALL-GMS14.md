# Second gate and empty boss room — GMS1.4.1760

Upgrade from the working **First Gate Passage + MM5 Immediate Opening** installation.
Stop the game and back up first. This adds the second gate passage and original
boss-room scenery/collision/two Super Arm blocks. **Cut Man, his entrance, gate
closing, boss music/health fill and combat are NOT installed in this update.**

## 1. Create ONE new Sprite — before running

**Sprites > MM1 > Cut Man > Stage > Doors > `spr_mm1_cutman_second_gate_open_backdrop`**

Import `spr_mm1_cutman_second_gate_open_backdrop.png`, **16×64**, one subimage,
origin **0,0**. Keep PNG colours/alpha; Remove Background OFF, smoothing OFF.
This is the original background exposed by the opening second gate; not a mask.
Keep its exact resource name, including `second_gate_open_backdrop`.

Keep all existing gate sprites (including the FIRST gate's cyan opening backdrop),
Super Arm block sprite/object and approved `snd_mm5_gate_open` Sound unchanged.
No new Sound or Object resource. No manual gate, block, scenery or solid instances.

## 2. Replace SIX entire existing Script resources

**Scripts > Cut Man > Stage > Ladder Route**, or their current equivalent folder:
1. `scr_mm1_cutman_ladder_route_tiles`
2. `scr_mm1_cutman_ladder_route_collision`
3. `scr_mm1_cutman_ladder_route_blocks`
4. `scr_mm1_cutman_ladder_route_features` (unchanged; included for matched full set)
5. **`scr_mm1_cutman_scroll_start`**

**Scripts > Cut Man > Stage > Doors**:
6. **`scr_mm1_cutman_gate_start`**

Paste the matching entire `.gml` into each exact resource; no appended code or
suffixed copies. Shared camera/scroll-start/gate-start handshake is now **1301**,
not1201. Replace together; stale starts raise a named mismatch error.

Blocks script places **19**: the accepted17 unchanged plus two original boss-room
blocks at **3104,880** and **3136,880**. No permanent terrain or baked scenery art
under these block footprints. Existing feature script still places just two gates,
ten art-only spikes and two dispensers; it does not create Cut Man or a fake third
visible gate. The boss-room return boundary is native invisible collision.

## 3. Replace FIVE events on the EXISTING camera

**Objects > Cut Man > Stage > Ladder Route > `obj_mm1_cutman_camera`**:

| Event | Entire matching file |
|---|---|
| Create | `obj_mm1_cutman_camera_create.gml` |
| Begin Step | `obj_mm1_cutman_camera_begin_step.gml` |
| End Step | `obj_mm1_cutman_camera_end_step.gml` |
| Other > Room End | `obj_mm1_cutman_camera_room_end.gml` |
| Destroy | `obj_mm1_cutman_camera_destroy.gml` |

RoomEnd/Destroy are unchanged owner-only voice cleanup, included for completeness.
Keep one camera instance only; no new normal Step event.

## 4. Update the existing gate Object's Draw

**Objects > MM1 > Cut Man > Stage > Doors > `obj_mm1_cutman_boss_gate`**:
- Replace its ENTIRE normal **Draw** event with `obj_mm1_cutman_boss_gate_draw.gml`.
  Not Draw GUI; do not add a second Execute Code action after the old one.
- Create code is unchanged, included as `obj_mm1_cutman_boss_gate_create.gml` for
  completeness. Keep existing Sprite `spr_mm1_cutman_boss_gate_closed`, Parent
  **`obj_stage_solid`**, Visible ON, Solid OFF, Persistent OFF and original masks.

Draw now chooses the correct recovered backdrop for each gate. First gate remains
32×64 and cyan-backed; second remains16×64 with its own background. Both keep the
approved immediate response and existing four-part bottom-up art. No closing timer
or new gate Object is added.

## 5. Room width ONLY

**Rooms > MM1 > Cut Man > Stage > existing Cut Man stage room**:
- Width **3328** (previously3072).
- Height **2160**, speed **60**, view0 **256×240**: unchanged.
- Initial view **X0/Y1920**, player opening position (usually2100): unchanged.
- Existing cyan room background and camera-follow-none: unchanged.

Do NOT add240 vertically, move the player to the boss room, or change prior routes.
Keep Stage Create/music initialization unchanged. Its four existing geometry/features
calls still run once. No extra calls, Included Files, PCM manager/buffer/queue/async/
alarms, player Step, pause, charge, HUD or arrival modifications.

The included Background atlas is **byte-identical** to the current first-gate
29-tile128×64 image; recovery copy only. No new atlas tile or image replacement is
required if your working29-tile atlas is already installed. Reference panoramas
are NOT room backgrounds/Sprite resources to import.

## 6. Restart and test

1. Recheck first gate: approved immediate sound/opening still works.
2. Cross the corridor and walk right into the **second gate while standing on the
   floor**, not sliding/jumping. It opens immediately with the approved MM5 cue.
3. Camera scrolls into original page23. The player advances more slowly during THIS
   scroll, as measured in MM1:11/16px per scroll frame, not the first gate's1px.
   Final native boundary resolution is preserved; MM5 standing feet adapt Y.
4. After the short existing standing hold, explore the **empty boss-room test area**.
   Check both scripted Super Arm blocks and right wall. Jump/slide/shoot/pause work.
   Camera stays **X3072/Y720**, no sudden vertical reset.
5. Return left is blocked by original invisible boundary; no invented visible left
   shutter appears yet. Restart to replay the route; no checkpoint system added.
6. Test charge hold/release through each gate; no stale release shot or double cue.

Native second-gate type2 ends before Cut Man's scripted entrance finishes. The
original gate closing happens only after that entrance; we deliberately defer it,
boss music, health fill and control restrictions to the boss update rather than
invent an empty-room closing timer. Control here returns after121frames as an
explicit boss-free test adaptation, not a claim of full native boss-intro timing.

34 source/model checks pass, including all22 ladder directions and both gate
paths, room reconstruction and collision/support. Actual GMS compiler/GPU/event
scheduler/mask runtime still requires your confirmation.

Rollback: restore the working First Gate Passage GML set (with immediate patch),
old gateDraw and room width3072, then restart. No vertical/atlas/audio rollback.
