# MM5 health HUD display — GMS1.4.1760

User confirms spr_mm5_health_meter imported (29 images,8x56,origin0,0). Damage/invulnerability deferred until enemies. This checkpoint adds plain player health28 and one separate HUD object only. No damage/refill/test keys, enemies, weapon meter, lives, score, sounds or health-related death logic. HUD runtime acceptance pending.

Back up player Create and Cut Man first-screen room. No player Step/Draw/arrival/movement/buster/audio changes.

## 1 Append player health

obj_mm5_megaman > Create > existing Execute Code: APPEND obj_mm5_megaman_create_health_append.gml (`mm5_health=28;`). Keep everything already there including mm5_startup_active initialization. This is plain0..28 health, not GMS built-in global health, not raw NES flagged byte9C. Current nonpersistent player starts full each new Create; inter-room persistence/respawn isn't implemented here.

## 2 New HUD object

Create Objects > Mega Man > MM5 > HUD resource folder. New Object EXACT name obj_mm5_hud:
- Sprite:<no sprite>
- Visible CHECKED
- Solid UNCHECKED
- Persistent UNCHECKED
- Parent:none

Add one Execute Code action per event; paste matching entire file. These are EVENT code files, not Script resources:

|Event|File|
|Create|obj_mm5_hud_create.gml|
|Other > Room Start|obj_mm5_hud_room_start.gml|
|Draw > Draw GUI|obj_mm5_hud_draw_gui.gml|

NO ordinary Draw or Step event. Do NOT put HUD drawing inside player Draw: startup intentionally exits that event. GUI draws above ordinary scene independently of startup lock/camera.

Create calls display_set_gui_size(256,240) so GUI uses NES logical pixels even with enlarged game window. It sets GLOBAL GUI coordinate size for all Draw GUI events, not room/view/window size. It intentionally matches this project's256x240 canvas. Existing normal Draw events (READY/arrival/player/scenery) unaffected. If other GUI code already sets a different GUI size, report before adding competing settings; don't resize the room or manually scale meter. Default GUI persists across rooms until changed, which is appropriate for shared NES logical canvas; manager itself isn't persistent.

Room Start obtains player after every Create completes; exactly one HUD/player required. Meter binding is to that player instance for room lifetime. Draw hides safely if player is later destroyed; automatic rebinding to a new same-room respawn is future enemy/death work. No instance-order dependency on the arrival manager.

## 3 Place ONE in Cut Man first-screen room

Keep ONE existing player and ONE obj_mm5_stage_start. Add exactly ONE obj_mm5_hud at0,0 (instance position irrelevant). Keep scene tiles, collision, ladders, blocks and stage music unchanged. No new player/arrival/music instances. Do not put HUD object in title, select or Robot Master intro room.

## 4 Restart/test

Stop and restart to initialize new Create field.
1. Full health meter appears near upper-left: canvasX24,Y25,8x56,original black/cream/offwhite. Shows28 pips; stays full because no damage system yet.
2. Meter stays visible throughout flashing READY, beam and materialization, while normal player is hidden. No new HUD sound.
3. After control returns, walk/jump/slide/shoot/charge and ladder body/top still work. Meter must not animate/drain/flash like charge colours or move with player/camera.
4. Enlarged window still gives same logical placement/relative scale as scene, not a tiny unscaled desktop-pixel meter. Don't remove black backing. No border/score/name added.
5. Existing room restart reruns startup with full meter, no duplicate health bars/errors. Test only existing transitions; don't invent keys.

Confirm visual/runtime result before next changes. Exact compiler error/event/line or screenshot if alignment wrong. Do not change health value manually in user project as a damage test; all-level source tests already done without installing test controls.

## Evidence/limits

hud-health.mjs29 controlled original-ROM HP presets preserve upper flags, original HUD routines produce seven8x8 tiles60..64hex atX24,Y25..73. Full native snapshot156&31=28. PNG has6 lit pixels per health unit (4 creamF7D8A5,2 offwhiteFFFEFF), opaque black remainder, bottom-up. Approved Mesen0.9.9 palette via JSNES, NOT direct Mesen runtime capture/repainted art. Ten natural READY/arrival/idle samples show full meter present during startup.

hud-gml-model.mjs executes actual event source subset with engine mocks: both Create orders, player lookup/count guards, all29 frames/positions vs original tiles and actual PNG, startup active/inactive unchanged HUD, floor/clamp only for rendering without mutating health, safe absent player. Explicit white blend/full alpha and unit scale used. Existing controller/audio/charged/basic/slide source checks unaffected. Mock GUI APIs are NOT GMS compiler/runtime/actual-window-scaling certification.

No dynamic health refill animation/SFX, hurt/iframes/pushing/spikes/enemy collision/death/persistence/weapons/score implemented. Agreed scope remains HUD first, damage/invulnerability when enemies begin. HP0 art does not certify death.

## Rollback

Remove HUD instance from gameplay room. Player mm5_health field may remain unused. No Step/Draw changes to undo. Restart. If project had a prior different global GUI size, restore that prior setting explicitly; otherwise256x240 remains intended NES canvas. Keep imported meter sprite.
