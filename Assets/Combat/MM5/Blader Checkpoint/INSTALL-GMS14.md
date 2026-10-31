# Blader combat — manual GMS 1.4.1760 installation

**Back up the working project first.** Stop the runner; import everything below before running. This package builds on the accepted **Second Gate Passage** stage (3328×2160), MM5 player/charge/health HUD, pause controller, scripted blocks and dust. No GMX/GMS2 instructions. Original checkpoints/Game Over UI are not included: health0 retries from the stage opening if a spare life remains, otherwise returns to title for a new game.

Use `Downloads/mm1-blader-mm5-combat-health-pickups-gms14.zip` from GitHub. Paths below are relative to that ZIP. The repository version keeps existing approved resources at their original locations; the ZIP gathers copies in `Art/` and `Audio/`.

## 1. Sprites — resource folders and exact names

If a sprite already exists, update/check it; **do not create a duplicate name with a suffix**. Create-from-strip uses horizontal rows, zero offsets/separations. Preserve alpha, no background removal/smoothing/cropping/repainting. Image speed is controlled in code, not editor playback.

| Resource folder under Sprites | Resource | File in Art/ | Cell size | Frames | Origin X,Y |
|---|---|---|---:|---:|---:|
| Enemies → MM1 → Blader | `spr_mm1_blader` | `spr_mm1_blader_strip2.png` |16×24|2|8,12|
| Mega Man → MM5 → Combat | `spr_mm5_megaman_hurt` | `spr_mm5_megaman_hurt_strip2.png` |32×40|2|16,16|
| Mega Man → MM5 → Combat | `spr_mm5_hurt_star` | `spr_mm5_hurt_star.png` |8×8|1|4,4|
| Effects → MM5 → Combat | `spr_mm5_combat_explosion` | `spr_mm5_combat_explosion_strip5.png` |32×32|5|16,16|
| Mega Man → MM5 → Pickups | `spr_mm5_pickup_small_health` | `spr_mm5_pickup_small_health_strip2.png` |8×8|2|4,3|
| Mega Man → MM5 → Pickups | `spr_mm5_pickup_large_health` | `spr_mm5_pickup_large_health_strip2.png` |16×16|2|8,7|
| Mega Man → MM5 → Pickups | `spr_mm5_pickup_small_weapon` | `spr_mm5_pickup_small_weapon_strip2.png` |8×8|2|4,3|
| Mega Man → MM5 → Pickups | `spr_mm5_pickup_large_weapon` | `spr_mm5_pickup_large_weapon_strip2.png` |16×16|2|8,7|
| Mega Man → MM5 → Pickups | `spr_mm5_pickup_extra_life` | `spr_mm5_pickup_extra_life_strip1.png` |16×16|1|8,7|

Small-health dark frame is genuine opaque black art. Collision masks are NOT used for combat; do not parent these sprites/objects to terrain. Different origins include the recovered NES OAM offsets; don't click Centre afterwards.

## 2. Sounds

Import the trimmed WAVs from `Audio/`, as normal uncompressed/non-looping Sound resources (new audio engine, default gain1). Keep these resource folders:

- **Sounds → Mega Man → MM5 → Combat**: `snd_mm5_megaman_hurt`, `snd_mm5_health_refill`, `snd_mm5_extra_life`, `snd_mm5_megaman_death`.
- **Sounds → Mega Man → MM6 → Combat → Enemy Hit**: `snd_mm6_enemy_hit`. This is the approved0.403063s trimmed cue; reuse it if already imported.

Do not replace the existing MM5 firing, mid/full release, charging, landing, arrival, gate or stage music resources. Do not loop the refill WAV: the code restarts only its own voice once per added bar. Extra-life sound plays once on collection, not every overlap update.

## 3. Script resources — import ALL files in Scripts/

Each `.gml` in **Scripts/** becomes a Script resource with exactly that filename minus `.gml`; paste its entire contents. **Do not turn Objects/, Player/ or Hooks/ files into Script resources.**

Folders under **Scripts**:

- **Enemies → MM1 → Blader**: `scr_mm1_blader_ai`.
- **Cut Man → Stage → Combat**: `scr_mm1_cutman_camera_end_update` (the accepted camera End Step logic, copied unchanged into a helper).
- **Mega Man → MM5 → Combat**: every `scr_mm5_*` file in Scripts/.

Keep existing collision helpers, charge audio, pause scripts and `scr_mm1_cutman_route_busy`. No existing script is replaced in this step except if you already imported one of the four foundation kernels: update that same resource.

## 4. Four NEW Objects — no manual room placement

All four: **Visible checked, Solid unchecked, Persistent unchecked, Sprite <no sprite>, Parent <no parent>**. Custom Draw events choose the artwork; manual sprite collision is not used.

| Folder under Objects | Object | Events (Execute Code) |
|---|---|---|
| Enemies → MM1 → Blader | `obj_mm1_blader` | Create=`Objects/obj_mm1_blader_create.gml`; normal Draw=`Objects/obj_mm1_blader_draw.gml` |
| Effects → MM5 → Combat | `obj_mm5_enemy_explosion` | Create=`Objects/obj_mm5_enemy_explosion_create.gml`; normal Draw=`Objects/obj_mm5_enemy_explosion_draw.gml` |
| Mega Man → MM5 → Pickups | `obj_mm5_pickup` | Create=`Objects/obj_mm5_pickup_create.gml`; normal Draw=`Objects/obj_mm5_pickup_draw.gml` |
| Mega Man → MM5 → Combat | `obj_mm5_combat` | Create=`Objects/obj_mm5_combat_create.gml`; **Begin Step**=`Objects/obj_mm5_combat_begin_step.gml`; normal Draw=`Objects/obj_mm5_combat_draw.gml`; **Room End AND Destroy** each=`Objects/obj_mm5_combat_cleanup.gml` |

**No ordinary Step or End Step on these new objects. No Destroy drop event.** The unique combat pass is called from the camera End Step, after view placement; adding another pass would double-update movement, timers and damage.

## 5. Existing Mega Man — small event edits, not full replacements

Object **obj_mm5_megaman** (Objects → Player → MM5):

1. **Create**: APPEND `Player/obj_mm5_megaman_create_combat_append.gml`. Keep existing health28, movement, ladder, slide, arrival and charge initialization.
2. **Step → Step**: paste `Player/obj_mm5_megaman_step_combat_prefix.gml` at the **very top**, ABOVE existing route/startup/buster/ladder/slide prefixes. Keep every existing line below it. Hurt/refill exits must happen before controls or firing.
3. **Normal Draw**: replace **only the current character-drawing block** (the charging-aware block that ends with `draw_sprite_ext(charge_sprite,...)`) with `Player/obj_mm5_megaman_draw_combat_replace_body.gml`. Keep the existing arrival/startup Draw prefix **above**, and all debug drawing **below**. Do not leave `draw_self()` or another player sprite draw active alongside this block. **Do not replace the whole Draw event.**

No collision events, mask changes, built-in speed/gravity or new key bindings. Health HUD still reads `mm5_health` as before.

## 6. Existing projectile End Steps — replace, don't append

- **obj_mm5_buster_shot → End Step**: REPLACE with `Hooks/obj_mm5_buster_shot_end_step_replace.gml`.
- **obj_mm5_buster_mid → End Step** AND **obj_mm5_buster_full → End Step**: REPLACE each with `Hooks/obj_mm5_charged_buster_end_step_replace.gml`.

Both charged objects must retain **parent obj_mm5_buster_shot**, and all three Create events are unchanged. No ordinary Step movement. The guards hand movement/animation to the combat pass only when the combat manager exists; the original approved End Step code remains intact as the fallback elsewhere.

## 7. Existing camera, pause and dust hooks

**obj_mm1_cutman_camera** (Objects → Cut Man → Stage):

- **Begin Step**: PREPEND `Hooks/camera_begin_step_prefix.gml`, keeping all accepted gate/route logic below.
- **End Step**: REPLACE the ENTIRE event with `Hooks/camera_end_step_replace.gml`. It first calls the unchanged accepted camera helper from Step3, then calls the combat pass exactly once. Do not append a second combat pass elsewhere. Create, Destroy and Room End remain unchanged.

**obj_mm5_pause_menu → Begin Step**: PREPEND `Hooks/pause_begin_step_prefix.gml`, **above** its existing route guard. Keep all original menu logic below. Recoil/refill/death block opening; ordinary post-hurt protection can still pause.

**scr_mm5_pause_restore** (existing Script resource): APPEND `Hooks/pause_restore_append.gml` at the very bottom, after it restores the frozen actors/menu flags. This resets the combat Begin latch after menu deactivation; do not replace the original restore script.

**obj_mm5_slide_dust → Step → Step**: PREPEND `Hooks/slide_dust_step_prefix.gml`, keeping existing dust age/frame/removal code below.

No pause layout, transition, inventory UI or tank-use changes. The accepted pause controller still owns its exact frozen-ID restoration.

## 8. Script-place the manager — one line

Open existing **scr_mm1_cutman_ladder_route_features** (the accepted Second Gate Passage version). At the **bottom**, after all existing dispensers/spikes/gates, append exactly once:

```gml
scr_mm5_combat_install();
```

Do not change Stage Create, its existing once-per-entry geometry calls, music queues/async/cleanup, room dimensions or camera coordinates. **Do not put any Blader, pickup, explosion or combat manager manually in the room.** The feature script creates the manager; the manager creates enemies and effects.

## 9. Compile, then test from a fresh stage entry

Do not resume an old saved runner state. First fix any compile error before changing room/view coordinates. Report the exact object/script, event and error text if one occurs.

1. READY/arrival, HUD28, existing stage music and camera0,1920 are unchanged. Pause still shows02 spare lives and the accepted UI.
2. Walk right: first Blader activates when viewX reaches17; there are three in the first flying group and three in the second. It should pursue/dive/reverse, not home continuously through a dive. The upper horizontal route also has its original group of three.
3. Normal buster and mid charge kill a Blader in one hit. Full charge kills and continues through it. Every accepted impact uses approved MM6 hit audio; firing/charge sounds are still MM5. A killed Blader must not damage the player on that same combat pass.
4. Contact costs3 health. Test facing both directions: recoil is opposite **stored player facing**, not always away from enemy X. Counter-steering halves it. Movement/fire/jump are blocked through27 hurt updates, then control returns while protection blinks. Continued contact must not drain health each frame.
5. Test hits while jumping, on a ladder (detach/fall), sliding, by a wall and beneath an overhang. Check no floor/wall tunnelling, double vertical movement, ladder snap-back or buffered shot. GMS terrain/runtime coverage is required; the Node tests are not the Windows runner.
6. A death makes a brief original explosion, then either one pickup or nothing. Repeated kills need not yield every type quickly; there is no debug forced-drop key or altered rate in this build. Leaving view or crossing a route seam must not award drops.
7. Damage Mega Man, then collect small/large health: +2/+10 capped28. Watch incremental bars and one MM5 refill sound per added bar. Shots/enemies/dust/camera/protection must freeze; music continues. Held movement/fire should resume without duplicated shots or overlapping refill voices. Full-health pickup disappears silently.
8. Extra life increases spare lives by1 up to9 and plays the MM5 extra-life sound **once**. Menu count must agree. Weapon energy remains a real drop but does not refill anything or alter health; that feature is deliberately deferred.
9. Open/close pause during ordinary play and post-hurt protection. Verify original transitions, firing/charge handling and stage music. Start during recoil/refill must not open a competing menu. No charge voice should remain stuck after damage or death.
10. Cross ladder/return/gate routes while enemies/shots/items are active: outgoing actors clear with no accidental drop, gates keep the accepted immediate MM5 cue, stage geometry/routes are unchanged. Walk off and back into an enemy anchor's view: it may respawn only after rearming, never duplicate an active record.
11. At health0, player disappears into original death particles/sound. After the native countdown, one spare life is consumed and the stage restarts at the opening. With no spare lives, this checkpoint returns to title/new-game inventory; **dedicated Game Over/Continue UI and native stage checkpoints are later work**, not silently claimed complete.

Keep the backup until these checks pass in GMS1.4.1760. Source-level tests do not replace local compilation, drawing, input, event scheduling and async-audio checks.
