# Missing boss-room flashing — small addition after working entrance

GMS1.4.1760. Requires your working entrance, corrected ONE-column shutter and working E-Tanks. STOP runner/back up. Use this guide ONLY; do not reinstall whole boss package, repeat camera hooks, alter doors, or change audio.

## 1. ONE new Sprite

Folder **Sprites → MM1 → Bosses → Cut Man → Entrance**.

Create **`spr_mm1_cutman_boss_room_flash`**. Ordinary Load Sprite (NOT strip), import **`Art/spr_mm1_cutman_boss_room_flash.png`** from this ZIP. One256×240 image, origin **0,0**. Keep transparency. Do not centre/crop/resize/remove background. Transparent regions are intentional: original palette2 wall pixels only, not a fullscreen white flash. Existing scenery and cyan/green stage colours stay unchanged elsewhere.

## 2. ONE new Object, TWO events

Folder **Objects → MM1 → Bosses → Cut Man → Entrance → Scenery**.

Create **`obj_mm1_cutman_boss_room_flash`**:
- Sprite `<no sprite>` (Draw handles it explicitly).
- Parent `<no parent>`.
- Visible **checked**; Solid unchecked; Persistent unchecked.
- **Create → Execute Code:** paste ENTIRE `Objects/obj_mm1_cutman_boss_room_flash_create.gml`. Sets depth998, in front of scenery tiles1000 but behind gameplay actors/HUD. Do not choose a player/enemy/solid parent.
- **Draw → ordinary Draw → Execute Code:** paste ENTIRE `Objects/obj_mm1_cutman_boss_room_flash_draw.gml`. NOT Draw GUI/Begin/End.
- No Step/Alarm/Collision/Destroy/Room End events. Never place an instance in the room. Nonpersistent scenery-only instance remains inert after flash and is removed automatically on room exit/restart.

## 3. Replace ONE existing Script

**Scripts → MM1 → Bosses → Cut Man → Entrance → `scr_mm1_cutman_boss_entrance_start`**.

Select ALL existing code and replace with ENTIRE **`Scripts/scr_mm1_cutman_boss_entrance_start.gml`** from this ZIP. It adds ONLY this spawn call after `route_section = 13;`:

```gml
instance_create(3072, 720, obj_mm1_cutman_boss_room_flash);
```

Use the full replacement, do not add the line twice. Do not put this in camera Create or player Step. No new Script resource is needed. Do not change `scr_mm1_cutman_boss_entrance_step` or any camera/pause/door/health/music file.

## 4. Fresh-run test

- Enter boss room. Grey wall pattern flashes brighter five times at the start while Mega Man remains held on his entry platform.
- Bright relative ticks1..8,17..24,33..40,49..56,65..71; normal from72 onward (~1.2seconds). First bright pulse is next update after room commit. Last bright hold7updates is original observed timing, not a typo.
- This is palette2 changing `[0F,20,10,00] → [0F,30,20,10]`, not opaque white rectangle/fade, invincibility flicker, alternate boss sprite, or a new sound.
- Mega Man and HUD remain visible/in front. Green wall regions keep original colours. No shader/surface or global blend changes.
- Door still closes at existing later point, same16px column; Cut Man appearance/health28/fill sounds/control return303 unchanged. No disputed cue restored. E-Tank actual-health correction and pause unchanged.
- Pause remains locked during introduction; no frozen bright overlay remains after intro, after pause, or on room exit/retry.

Source/native/model tests PASS, installed GMS compile/GPU/depth/visual acceptance still PENDING. If grey wall does not change, check exact sprite/object names, Visible, ordinary Draw and start Script replacement; do not add editor scenery/instances to compensate.

## Evidence and scope

`Reference/native-room-flash.json`: original supplied-USA entry from disclosed controlled-approach snapshot, Right-only310updates/no palette/CHR/framecounter edits. Actual completed-render colours compared across every coloured palette2 wall pixel atX>=64; match one exact phase each sampled update. Every opaque normal-mask pixel matches accepted reconstructed boss-room PNG before recolouring. Exact original spatial mask/brightRGB, not guessed flash colour/period. Five pulses/39bright updates verified independently of queued palette writes. Native cue/other timing/assets unchanged. Project uses transparent scenery overlay atdepth998 rather than NES palette writes; this does not certify hardware/GMS renderer equivalence.
