# MM5 stage pause transitions — GameMaker Studio1.4.1760

Back up your project. This replaces the instant stage/menu switch with the measured original MM5 transition: discrete NES palette steps, black switch, discrete brightening. **GMS source/install package, not a compiled or runtime-certified GameMaker project.** Original ROM/frame/input and software-palette checks pass; please test compilation and drawing in your existing project.

## Upgrade YOUR currently installed stage controller

Do these in order. Do not add another pause object or change the isolated UI test.

### 1. Add ONE sprite

Resource folder: **Sprites > Mega Man > MM5 > Pause Menu > Transition**.

- Resource name EXACTLY `spr_mm5_pause_fade_lut`.
- Load `Transition Resources/spr_mm5_pause_fade_lut.png` as ONE image (not a strip).
- It is **64x512**, origin0,0. Keep its colours and full image size; do NOT centre/crop/resize/repaint it.
- Remove Background OFF; Smooth Edges OFF. This image is a colour lookup table, NOT visible menu artwork.
- Keep existing imported sprites, including grey Cutter, exactly as approved.

### 2. Add ONE shader

Resource folder: **Shaders > Mega Man > MM5 > Pause Menu**.

Create shader resource EXACTLY **shd_mm5_pause_fade**. Set its type/language to **GLSL ES** (not HLSL or GLSL desktop).

A single shader resource has TWO code tabs:

| Shader tab | Replace ENTIRE tab contents using |
|---|---|
| Vertex | `Transition Resources/shd_mm5_pause_fade.vsh` |
| Fragment | `Transition Resources/shd_mm5_pause_fade.fsh` |

Do NOT create two shader resources and do NOT paste these files into Execute Code events or ordinary scripts. This is the GMS1.4 shader system, not a GMS2 layer/filter effect. If your shader editor looks different, show it before guessing. Hardware/shader compilation must be checked on your Windows runner; controller reports a clear error if shader fails.

### 3. Add TWO scripts

Folder: **Scripts > Mega Man > MM5 > Pause Menu > Stage**.

Create each exact Script resource and paste the matching WHOLE.gml file:

1. `scr_mm5_pause_draw_page` — approved custom layout moved intact out of the event so it can render into the fade surface.
2. `scr_mm5_pause_transition_sample` — measured timing/which screen/palette step.

Keep the existing3 Shared drawing scripts unchanged: scr_mm5_pause_text, scr_mm5_pause_meter, scr_mm5_pause_box.

### 4. Replace THREE existing scripts

Same **Scripts > Mega Man > MM5 > Pause Menu > Stage** folder. Replace contents, not resource names:

- `scr_mm5_pause_open`
- `scr_mm5_pause_restore`
- `scr_mm5_pause_dispose`

Keep scr_mm5_pause_inventory_init and scr_mm5_pause_stage_move unchanged. No inventory reset during upgrade other than a normal new run. Initial state remains02 spare lives, Buster only, no tanks or falsely owned upgrades.

### 5. Replace FOUR existing object events

Object: **Objects > Mega Man > MM5 > Pause Menu > Stage > obj_mm5_pause_menu**.

Each event keeps ONE Execute Code action. Replace its ENTIRE contents:

| Event | File |
|---|---|
| Create | obj_mm5_pause_menu_create.gml |
| Step > Begin Step | obj_mm5_pause_menu_begin_step.gml |
| Step > Step | obj_mm5_pause_menu_step.gml |
| Draw > Draw GUI | obj_mm5_pause_menu_draw_gui.gml |

Do not append new code below the previous drawing/controller code. Do not add normal Draw, Draw GUI End, or End Step events. Existing Room End and Destroy each still call scr_mm5_pause_dispose(), unchanged. obj_mm5_pause_state/Create unchanged; do not place it in a room.

### 6. Room/settings

- Existing Cut Man stage room speed must be **60**. Controller checks it; do not change timing to room_speed-dependent smooth tweening.
- Keep exactly ONE obj_mm5_pause_menu in stage room, as already installed (no sprite, Visible ON, Solid OFF, Persistent OFF). Depth is set by Create.
- Existing player, obj_mm5_hud, arrival, background/tiles, music and charge manager remain in place. No player/HUD/audio events are replaced.
- Keep normal application surface enabled and existing native256x240 game/view framing. GUI remains256x240. Do not disable application_surface or introduce extra viewports.
- Code disables texture interpolation, consistent with this NES project. Shader renders into256x240 before enlargement, not expensive per-window-pixel palette searching.
- This revision targets your **Windows GMS1.4 runner**. Newly held fire uses keyboard_check_direct + keyboard_clear for physical release rearming without delaying stage restoration. Other exporters are NOT certified here.

### 7. Stop/restart and test

Do not hot-reload past Create: restart the game.

1. Finish READY/arrival. Start(Enter) must not open during startup. Health HUD/stage remain unchanged before Start.
2. Enter: immediate original opening sound; frozen stage **including upper-left health meter** darkens in4steps, black briefly, then menu brightens in steps. No abrupt disappearing player/HUD, slide, wipe, transparency tween, border flash or duplicate HUD.
3. Navigation/confirm ignored during transition; first control boundary is frame38 counting triggering update as1. Full brightness starts35, three updates before ready. Both directions about0.6sec at60updates/sec.
4. Menu remains custom layout: Buster only initially; unowned weapon rows hidden/skipped;02 spare lives and actual health; grey Cutter art unchanged; tanks0; separate upgrades page. Do NOT expect original MM5 layout to replace ours. Existing credit remains **Sprites by KindlyPatrick** in its approved location/artwork.
5. Start OR A(Space) on M.BUSTER: close sound immediately and reverse transition immediately. No waiting for release before fade. Menu darkens, black briefly, frozen stage/HUD brightens; gameplay resumes at38. No automatic jump from held confirmation. Hold Enter or Space through the whole close as an extra test: picture must still finish on time. Release/repress Enter to pause again.
6. Fresh Right during full-bright-but-not-ready35..37 ignored; fresh Right at38 accepted. Holding movement through close may move upon readiness; it must not prolong the fade.
7. Test pause while airborne, sliding, on ladder and with projectiles: outgoing stage picture must remain still throughout pause/transition, resume from same world state. Enemies not installed yet; no enemy certification implied.
8. Music continues throughout. Hold existing charge X continuously before/during pause: charge freezes and its own voice pauses, resumes after transition without restarting music. Release X while paused: no buffered shot on return. New/re-pressed X inside pause is suppressed until released, WITHOUT extending transition. Also test releasing X on the same update as Start.
9. Open/close repeatedly; test resized window and minimize/restore. Surfaces are volatile: if GPU loses stage snapshot, controller safely exits pause instead of leaving actors permanently inactive. Device-loss recovery may abort the visual transition; that is intentional fallback, not native behaviour.
10. Tanks still do NOT consume/refill anything because real tank effects are not connected. Extra weapon gameplay and Energy Balancer automation still absent. No damage/life decrement/score added.

Report exact compiler error (resource,event,line), shader error, or a short video if timing/colour/position differs. Source/software tests do not certify GameMaker1.4's GPU, event order, viewport projection, sampler orientation or physical keyboard behaviour on your machine.

## Measured schedule

Frame0 before input; frame1 fresh Start or accepted confirm. Audio at1. Outgoing dims at2/6/10/14(black). Opening allblack14..23, first incoming menu24; closing allblack14..22, first stage23. Incoming brighter27/31, full35, ready38. Opening/closing each37update intervals from trigger1 to ready38. No fade sound or invented sound added; uses approved original29hex open/28hex close/27hex cursor.

## Palette fidelity and custom-art boundary

LUT uses pinned Mesen0.9.9 default NES palette and original index darkening, NOT RGB multiplication/alpha overlay. Generator verifies all64 source indices x4levels. Software shader mirror reproduces original captured outgoing2/6/10/14 and incoming24(or23)/27/31 pixels exactly WHEN original per-pixel white20/30 identities are supplied.

Approved game art is RGB, not indexed NES tiles. NES20 and30 are identical RGB white but have different fading paths; this cannot be recovered uniquely from a flattened screen. Explicit custom convention: stage composite/known MM5 player+HUD white20; menu font/frame white20, selected weapon/tank/obtained-upgrade icon white30. Other exact native NES colours retain original index paths. Non-native RGB pixels use nearest NES colour for dimmed steps; full brightness bypasses shader and preserves approved artwork exactly. A stage tile that originally meant white30 cannot be disambiguated from player white20 in this snapshot architecture. Therefore timing/step mechanism is matched, **not a claim of original MM5 per-index/pixel equivalence for our different custom stage/menu**. Original reference capture/trace is separate under docs/pause-menu-reference/transitions/.

The known installed health HUD at24,25 is explicitly included in the cached stage; application_surface alone omits Draw GUI. Future additional GUI HUDs must also be added to this cache before claiming they fade correctly. This does not modify/duplicate the visible HUD in normal play.

## Fresh installation/resource inventory

For an already installed controller use upgrade steps ABOVE. Full package also contains unchanged resources for a fresh install:

**Scripts > Mega Man > MM5 > Pause Menu > Stage** (7): inventory_init,open,restore,dispose,stage_move,draw_page,transition_sample with exact scr_mm5_pause_ prefixes from files. Shared3 scripts remain required from UI test package.

**Objects > Mega Man > MM5 > Pause Menu > Stage**:
- obj_mm5_pause_state: no sprite, invisible, non-solid, persistent; Create from matchingfile; NOT room-placed. Menu creates once, explicit inventory_init(true) on first Create. Future New Game may explicitly reset with true; false is no-op.
- obj_mm5_pause_menu: no sprite, visible, non-solid, nonpersistent; six events Create,BeginStep,Step,DrawGUI,RoomEnd,Destroy using matchingfiles; exactly one in stage room.

**Sprites > Mega Man > MM5 > Pause Menu > Transition**: one64x512LUT. **Shaders > Mega Man > MM5 > Pause Menu**: oneGLSL ES shader with two tabs.

Approved previous pause import pack8sprites+3sounds remains required; existing player, arrival, healthHUD/spr_mm5_health_meter and charge system are prerequisites. snd_mm5_menu_close.wav also retained in ZIP for anyone who missed previous patch; no sound reimport needed if already installed. NativeStart29, cursor27, close28; close Start/A recordings byte-identical.

## Rollback

Restore backed-up7updated resources, remove2new stage scripts/LUT/shader ONLY after restoring old references. Keep existing inventory state owner, shared helpers, approved art/audio, HUD/player/charge/arrival resources. Restart. Avoid mixing old instant-open events with new scripts.
