# Mega Man (NES) Recreation in Pixel Game Maker MV
## Master Architecture, ROM-Verified Reference & Step-by-Step Roadmap

> **Target Engine:** Pixel Game Maker MV (PGMMV v1.0.4+)  
> **Fidelity Target:** Authentic 1987 NES 8-Bit Visuals, Stages & Physics + Toggleable Quality-of-Life (QoL) Upgrades  
> **Reference ROM:** `Mega Man (USA).nes` (`CRC32: 5DED683E`, 128 KB UNROM Mapper 2) — all physics constants, hitboxes, ammo costs, screen counts, and boss damage values below are verified directly against the ROM in this repository and PGMMV's runtime engine.

---

## Table of Contents

1. [Project Creation & Core PGMMV Settings](#1-project-creation--core-pgmmv-settings)
2. [Scene & Screen Flow Architecture (`Transitions` Tab)](#2-scene--screen-flow-architecture-transitions-tab)
3. [Camera, Rooms, Shafts & Boss Shutter System](#3-camera-rooms-shafts--boss-shutter-system)
4. [Global Switches & Variables Registry (`Resources` Tab)](#4-global-switches--variables-registry-resources-tab)
5. [Authentic NES → PGMMV Physics & Hitbox Spec](#5-authentic-nes--pgmmv-physics--hitbox-spec)
6. [Mega Man Palette Swapping, HUD & Weapon Menu](#6-mega-man-palette-swapping-hud--weapon-menu)
7. [Weapons System & ROM-Verified Boss Damage Matrix (`Database` Tab)](#7-weapons-system--rom-verified-boss-damage-matrix-database-tab)
8. [Complete 10-Stage Breakdown & Gimmick Architecture](#8-complete-10-stage-breakdown--gimmick-architecture)
9. [Quality-of-Life (QoL) Upgrades Design](#9-quality-of-life-qol-upgrades-design)
10. [Step-by-Step Build Roadmap (8 Interactive Milestones)](#10-step-by-step-build-roadmap-8-interactive-milestones)

---

## 1. Project Creation & Core PGMMV Settings

### 1.1 `File → New Project` Wizard
When creating the blank project in Pixel Game Maker MV:

| Wizard Field | Value | Why |
|---|---|---|
| **Game Perspective** | **Side View** | Enables downward Scene Gravity, floor/ceiling wall detection, and jumping natively. |
| **Tile Size** | **`16 × 16`** | Divides the `256 × 240` NES screen into an exact **`16 × 15` tile grid**. Matches 16px-wide ladders, 16×16 spikes, 16×16 Yoku disappearing blocks, and 16×64 boss shutter doors. |
| **Screen Resolution** | **`256 × 240`** | Full internal NES nametable resolution (`16 cols × 15 rows`). *(Note: NTSC CRTs cropped 8px top/bottom to `256 × 224`, but `Mega Man` stage rooms are authored on `256 × 240` grids.)* |
| **Start Type** | **Blank Project** | Avoids sample-project clutter in Switches, Variables, and Animations. |

### 1.2 `Settings → Project Settings`
Open the top menu **`Settings → Project Settings`** and configure:

- **Project Settings → Resolution & Window:**
  - **Base Resolution:** `256 × 240`
  - **Initial Screen Size (Magnification):** `×3` (`768 × 720`) or `×4` (`1024 × 960`) — always use integer multiples so pixels stay razor-sharp.
  - **Max Player Count:** `1`
- **Image Filtering Tip (`Resources → Images`):** Keep bilinear/smoothing disabled on all imported PNG sheets so pixel edges remain crisp.

### 1.3 `Settings → Group Management` (Object Collision Groups)
By default, PGMMV only creates `Player` and `Enemy`. Add the following custom groups so bullets, bosses, pickups, and stage gimmicks never collide accidentally:

| Group Order | Group Name | Purpose |
|---|---|---|
| Default | `Player` | `obj_MegaMan` |
| Default | `Enemy` | Standard stage enemies (Mets, Bunby Helis, Sniper Joes, Big Eyes, etc.) |
| Custom 1 | `Player Bullet` | Buster, Rolling Cutter, Ice Slasher, Hyper Bomb, Fire Storm, Thunder Beam, Thrown Guts Rock |
| Custom 2 | `Enemy Bullet` | Enemy & Boss projectiles *(separated from `Enemy` so Mega Man's shots pass through enemy shots instead of clanking or destroying them)* |
| Custom 3 | `Boss` | Robot Masters & Wily Fortress Bosses *(reads from Boss Damage Database & drives Boss HUD bar)* |
| Custom 4 | `Item` | Pearls, Life Energy (S/L), Weapon Energy (S/L), 1-UP, Yashichi, Magnet Beam item, Boss Orb |
| Custom 5 | `Gimmick` | Moving Platforms, Yoku Blocks, Guts Liftable Blocks, Magnet Beam Segments, Shutter Doors, Room Triggers |

### 1.4 `Settings → Operation Key Management` (NES + QoL Controls)
Map standard controller + keyboard bindings for both classic NES play and modern QoL shortcuts:

| PGMMV Operation Key | NES Equivalent | Action in Game | Recommended Keyboard / Pad |
|---|---|---|---|
| `Up / Down / Left / Right` | D-Pad | Move, Aim Throw, Climb Ladders, Navigate Menus | Arrow Keys or `WASD` / D-Pad |
| `A` | NES **A** | **Jump** / Drop from Ladder / Confirm | `Z` or `Space` / South Face Button (`A`/`Cross`) |
| `B` | NES **B** | **Shoot** Active Weapon | `X` or `J` / West Face Button (`X`/`Square`) |
| `Start` *(or `Menu`)* | NES **Start** | Open / Close Weapon Pause Sub-Screen | `Enter` / `Start` |
| `L1` | *QoL Addition* | **Cycle Owned Weapon ← Previous** (instant) | `Q` / `LB` (`L1`) |
| `R1` | *QoL Addition* | **Cycle Owned Weapon → Next** (instant) | `E` / `RB` (`R1`) |
| `Select` *(or `R2`)* | *QoL Addition* | **Instant Reset to Mega Buster** (`Weapon = 0`) | `Left Shift` / `Back` (`Select`) |

---

## 2. Scene & Screen Flow Architecture (`Transitions` Tab)

### 2.1 Why "1 Scene = 1 Full Stage" Is Best in PGMMV
In PGMMV, splitting a single stage into 15–24 separate Scenes connected by `Portals` causes object-reset headaches, slow workflow across 200+ scenes, and awkward boss-corridor shutter sequences.

Instead, use the **Single-Scene-Per-Stage Grid Pattern**:
- **1 Stage = 1 PGMMV Scene** (only **10 Stage Scenes** in the entire game!).
- Inside each Stage Scene, rooms are snapped to a **`256 × 240` pixel grid** (`16 × 15` tiles per screen), matching the exact screen topology of `Mega Man (USA).nes`.
- Checkpoints simply store a `CheckpointID` (`0`, `1`, or `2`) and respawn Mega Man at the checkpoint coordinates inside the same Scene (or reload the current Scene at those coordinates on death).

### 2.2 Complete Scene List (`Scenes` Tab)

#### Normal Scenes (`Scenes → Scene List`)
| Scene ID | Name | Dimensions (Screens) | Notes |
|---|---|---|---|
| `001` | `scn_BootInit` | `1 × 1` (`256×240`) | Loads saved QoL/progress file if present, initializes defaults, jumps to Title. |
| `002` | `scn_Title` | `1 × 1` (`256×240`) | Title screen (`NEW GAME`, `CONTINUE / LOAD`, `OPTIONS / QoL`). |
| `003` | `scn_StageSelect` | `1 × 1` (`256×240`) | 6 Robot Master portraits around central Dr. Wily icon (appears once all 6 cleared) + Boss Intro Fanfare panel. |
| `004` | `scn_Stage0_CutMan` | `24 screens` | Cut Man Stage (Bank 0 layout). |
| `005` | `scn_Stage1_IceMan` | `24 screens` | Ice Man Stage (Bank 1 layout). |
| `006` | `scn_Stage2_BombMan` | `24 screens` | Bomb Man Stage (Bank 2 layout). |
| `007` | `scn_Stage3_FireMan` | `24 screens` | Fire Man Stage (Bank 3 layout). |
| `008` | `scn_Stage4_ElecMan` | `24 screens` | Elec Man Stage (Bank 4 layout — vertical tower + Magnet Beam room). |
| `009` | `scn_Stage5_GutsMan` | `24 screens` | Guts Man Stage (Bank 5 layout — track lifts). |
| `010` | `scn_Stage6_Wily1` | `17 screens` | Wily Stage 1 (Requires Magnet Beam + Guts Arm; Boss: Yellow Devil). |
| `011` | `scn_Stage7_Wily2` | `18 screens` | Wily Stage 2 (Cut + Elec rematches; Boss: Copy Robot). |
| `012` | `scn_Stage8_Wily3` | `24 screens` | Wily Stage 3 (Flooded rush tunnel; Boss: CWU-01P). |
| `013` | `scn_Stage9_Wily4` | `13 screens` | Wily Stage 4 (Bomb + Fire + Ice + Guts gauntlet; Boss: Wily Machine 1 Phase 1 & 2). |
| `014` | `scn_StageClear` | `1 × 1` (`256×240`) | Score/Bonus Pearl tally, Weapon Get display, Auto-Save hook. |
| `015` | `scn_GameOver` | `1 × 1` (`256×240`) | `CONTINUE` / `STAGE SELECT` / `SAVE & TITLE`. |
| `016` | `scn_Ending` | `Scrolling` | Mega Man runs home right-to-left + Staff Credits → `scn_Title`. |

#### Menu Overlay Scenes (`Scenes → Menu Scene List`)
| Menu Scene | Role | Behavior |
|---|---|---|
| `menu_HUD` | In-Stage Heads-Up Display | Set as **Initial Display Menu** on all 10 Stage Scenes (`Scene Settings → Menu Settings`). Renders Player HP bar, Active Weapon Ammo bar, Boss HP bar, and optional NES 7-digit Score. |
| `menu_WeaponSubscreen` | Start-Button Pause Menu | Opened via `Show Menu Screen` (with **`Pause Scene = ON`**) when pressing `Start` during gameplay. Shows `P`, `C`, `I`, `B`, `F`, `E`, `G`, `M` ammo bars, remaining Lives, Score, and quick QoL toggles if desired. |

### 2.3 Screen Flow Diagram (`Transitions → Screen Flow`)

```text
[scn_BootInit]
      │
      ▼
 [scn_Title] ◄──────────────────────────────────────────────┐
      │                                                     │
      ▼                                                     │
[scn_StageSelect] ◄───────────────┐                         │
      │                           │ (Robot Master cleared)  │
      ├──► [scn_Stage0..5 (RMs)] ─┴──► [scn_StageClear]     │
      │                                       │             │
      └──► (All 6 RMs cleared: Dr. Wily)      │ (Wily 1–3)  │
                  │                           ▼             │
                  └──► [scn_Stage6..9 (Wily 1–4)] ──────────┼──► [scn_Ending]
                              │                             │
                              ▼ (Lives == 0)                │
                        [scn_GameOver] ─────────────────────┘
```

### 2.4 Layer Structure Inside Every Stage Scene
Standardize every Stage Scene to **4 Layers** (top = frontmost):

| Layer # | Name | Contents |
|---|---|---|
| **Layer 1 (Top)** | `Foreground / Mask` | Foreground pipes/liquid tops (e.g., Fire Man lava surface & Wily 2 pit masks that draw in front of Mega Man), Shutter Door overlays. |
| **Layer 2 (Main)** | `Main Gameplay` | Solid Wall Tiles, Ladders, Spikes, Ice Tiles, `obj_MegaMan`, `Enemies`, `Boss`, `Bullets`, `Items`, `Gimmicks`, `obj_CameraController`. |
| **Layer 3** | `Background Detail` | Non-colliding decorative tiles (skyline, factory pillars, Wily fortress pipes). |
| **Layer 4 (Bottom)** | `Backdrop / Flash` | Solid NES background color tile or boss-corridor black fade backdrop (also used for Elec Man Thunder Beam background flash). |

---

## 3. Camera, Rooms, Shafts & Boss Shutter System

### 3.1 How Authentic Mega Man Room Scrolling Works in PGMMV
In PGMMV's `Scene Settings → Camera`, **do NOT** attach the camera directly to `obj_MegaMan`—doing so causes the camera to expose adjacent rooms above/below corridors or scroll past boss shutters.

Instead, create an invisible **`obj_CameraController`** object and set every Stage Scene's Camera to **Follow `obj_CameraController`**:

```text
┌─────────────────────────── Horizontal Corridor Room (e.g. 3 Screens = 768×240) ───────────────────────────┐
│                                                                                                           │
│   RoomMinX (0)                                                                           RoomMaxX (768)   │
│   ├──────────────┬────────────────────────────────────────────────────────┬──────────────┤                │
│                  ▲                                                        ▲                               │
│         Camera Left Clamp                                        Camera Right Clamp                       │
│         (RoomMinX + 128)                                         (RoomMaxX - 128)                         │
│                                                                                                           │
│         obj_CameraController.X = clamp(MegaMan.X, RoomMinX + 128, RoomMaxX - 128)                         │
│         obj_CameraController.Y = RoomTopY + 120   (Locked vertically!)                                    │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Handling the 3 NES Room Transition Types

1. **Horizontal Corridors (`1` to `N` screens wide × `240` px tall):**
   - `obj_CameraController` tracks `MegaMan.X` clamped between `RoomMinX + 128` and `RoomMaxX - 128`, while `Y` stays locked at `RoomTopY + 120`.
2. **Vertical Ladder / Drop Transitions (`240` px Up or Down):**
   - Place an `obj_ScrollTrigger_Vert` strip along the `240px` seam between stacked screens *(omit on bottomless pits so `Y > RoomTopY + 240` triggers Instant Pit Death instead!)*.
   - When `obj_MegaMan` crosses the seam:
     1. Turn ON `SW_ScreenTransition`.
     2. Execute **`Change Game Speed → 0%`** targeting groups `Enemy`, `Enemy Bullet`, `Player Bullet`, and `Gimmick` (freezes the world in place, identical to NES!).
     3. Glide `obj_CameraController.Y` by `±240` px over **`0.75s` (45 frames)** while shifting `obj_MegaMan.Y` by `±24` px across the boundary so he stays cleanly on the ladder or enters the room below.
     4. Update `VAR_RoomMinX / MaxX / TopY`, despawn off-camera temporary actors, restore **`Game Speed → 100%`**, and turn OFF `SW_ScreenTransition`.
3. **Boss Corridor Shutter Doors (`obj_BossDoor`, `16 × 64` px = 4 vertical tiles):**
   - Triggered only when Mega Man touches the door from the left while grounded or airborne (moving right):
     1. Turn ON `SW_ScreenTransition` & freeze `Game Speed → 0%` on enemies/shots.
     2. Play `anim_DoorOpen` (4 segments retracting upward, **6 frames = `0.10s` per segment**, playing `SE_Shutter` each step = `0.40s` total).
     3. Pan `obj_CameraController.X` `+256` px right over **`0.85s`** while auto-moving `obj_MegaMan` `+48` px right into the new room.
     4. Lock `VAR_RoomMinX` to the new screen's left edge, play `anim_DoorClose` (`0.40s`), restore `Game Speed → 100%`, and turn OFF `SW_ScreenTransition`.
     5. If `self_IsBossRoomDoor == ON`: set `VAR_BossPhase = 1` to start the Boss Drop-In & 28-unit HP bar fill!

---

## 4. Global Switches & Variables Registry (`Resources` Tab)

> **Golden PGMMV Rule:** Keep per-enemy HP, timers, and AI states in **Object Self-Variables** (`Objects → Variable Management`). Reserve **Project Common Switches & Variables** (`Resources → Switches / Variables`) strictly for cross-object communication, HUD display, stage state, and saved progress.

### 4.1 Project Common Switches (`Resources → Switches`)

| ID | Switch Name | Save? | Purpose |
|---|---|---|---|
| `001` | `SW_Clear_CutMan` | **Yes** | Cut Man stage cleared |
| `002` | `SW_Clear_IceMan` | **Yes** | Ice Man stage cleared |
| `003` | `SW_Clear_BombMan` | **Yes** | Bomb Man stage cleared |
| `004` | `SW_Clear_FireMan` | **Yes** | Fire Man stage cleared |
| `005` | `SW_Clear_ElecMan` | **Yes** | Elec Man stage cleared |
| `006` | `SW_Clear_GutsMan` | **Yes** | Guts Man stage cleared |
| `007` | `SW_Own_RollingCutter` | **Yes** | Unlocked Weapon 1 (`C`) |
| `008` | `SW_Own_IceSlasher` | **Yes** | Unlocked Weapon 2 (`I`) |
| `009` | `SW_Own_HyperBomb` | **Yes** | Unlocked Weapon 3 (`B`) |
| `010` | `SW_Own_FireStorm` | **Yes** | Unlocked Weapon 4 (`F`) |
| `011` | `SW_Own_ThunderBeam` | **Yes** | Unlocked Weapon 5 (`E`) |
| `012` | `SW_Own_GutsArm` | **Yes** | Unlocked Weapon 6 (`G`) |
| `013` | `SW_Own_MagnetBeam` | **Yes** | Picked up Magnet Beam (`M`) in Elec Man's stage |
| `014` | `SW_WilyUnlocked` | **Yes** | All 6 Robot Masters defeated → Wily Fortress selectable |
| `015` | `SW_ScreenTransition` | No | Active during shaft scroll or shutter door transition |
| `016` | `SW_InputLocked` | No | Locks player controls (Teleport-In, Boss Intro, Victory) |
| `017` | `SW_PlayerOnLadder` | No | True while Mega Man is attached to a ladder |
| `018` | `SW_PlayerOnIce` | No | True while standing on Ice Man slippery tiles |
| `019` | `SW_CarryingGutsBlock` | No | True while holding a Guts liftable rock overhead |
| `020` | `SW_BossActive` | No | Shows Boss HP bar on `menu_HUD` |
| `021` | `SW_RefillTicking` | No | Pauses gameplay while ticking Life/Weapon energy bar up (`1 pip / 3 frames`) |
| `022` | `SW_PlayerDead` | No | Triggers 8-way radial death orb explosion & respawn sequence |
| `023` | `SW_QoL_QuickSwap` | **Yes** | *(Default ON)* Enables `L1`/`R1`/`Select` live weapon switching |
| `024` | `SW_QoL_CrispGroundStop` | **Yes** | *(Default OFF)* Instant stop on dry ground (MM2 feel) vs authentic MM1 slight skid |
| `025` | `SW_QoL_SpikeIframes` | **Yes** | *(Default OFF)* Invincibility frames protect from spikes (MM2+ rule vs MM1 instant death) |
| `026` | `SW_QoL_ShowScoreHUD` | **Yes** | *(Default ON)* Shows classic MM1 7-digit score at top center of HUD |
| `027` | `SW_QoL_AllowPauseTrick` | **Yes** | *(Default OFF)* Resets boss i-frames on unpause if enabled for nostalgia |

### 4.2 Project Common Variables (`Resources → Variables`)

| ID | Variable Name | Initial | Save? | Purpose |
|---|---|---|---|---|
| `001` | `VAR_PlayerHP` | `28` | No | Mega Man Life Energy (`0–28`) |
| `002` | `VAR_PlayerMaxHP` | `28` | No | Constant `28` (7 HUD cells × 4 pips) |
| `003` | `VAR_Lives` | `3` | **Yes** | Remaining lives (`0` = Game Over on next death; NES starts at 2 extra = 3 total tries) |
| `004` | `VAR_Score` | `0` | **Yes** | 7-digit player score (`0–9999999`) |
| `005` | `VAR_BonusPearls` | `0` | No | Stage score balls collected (tallied × `1,000` pts at Stage Clear) |
| `006` | `VAR_CurrentWeapon` | `0` | No | `0`=Buster, `1`=Cut, `2`=Ice, `3`=Bomb, `4`=Fire, `5`=Elec, `6`=Guts, `7`=Magnet |
| `007` | `VAR_Ammo_Cut` | `28` | No | Rolling Cutter Energy (`0–28`) |
| `008` | `VAR_Ammo_Ice` | `28` | No | Ice Slasher Energy (`0–28`) |
| `009` | `VAR_Ammo_Bomb` | `28` | No | Hyper Bomb Energy (`0–28`) |
| `010` | `VAR_Ammo_Fire` | `28` | No | Fire Storm Energy (`0–28`) |
| `011` | `VAR_Ammo_Elec` | `28` | No | Thunder Beam Energy (`0–28`) |
| `012` | `VAR_Ammo_Guts` | `28` | No | Guts Arm Energy (`0–28`) |
| `013` | `VAR_Ammo_Magnet` | `28` | No | Magnet Beam Energy (`0–28`) |
| `014` | `VAR_HUD_ActiveAmmo` | `28` | No | Mirrors the currently selected weapon's ammo (`0–28`) for `menu_HUD` |
| `015` | `VAR_CurrentStage` | `0` | **Yes** | `0–5` = Robot Masters, `6–9` = Wily Stages 1–4 |
| `016` | `VAR_WilyProgress` | `6` | **Yes** | Highest unlocked Wily Stage (`6–9`) for QoL fortress saving |
| `017` | `VAR_CheckpointID` | `0` | No | `0` = Stage Start, `1` = Midpoint, `2` = Pre-Boss Corridor |
| `018` | `VAR_RespawnX` | `128` | No | X pixel coordinate for current checkpoint |
| `019` | `VAR_RespawnY` | `120` | No | Y pixel coordinate for current checkpoint |
| `020` | `VAR_RoomMinX` | `0` | No | Current camera room left edge (px) |
| `021` | `VAR_RoomMaxX` | `256` | No | Current camera room right edge (px) |
| `022` | `VAR_RoomTopY` | `0` | No | Current camera room top edge (px) |
| `023` | `VAR_BossModeID` | `0` | No | `0–5` RMs, `6` Yellow Devil, `7` Copy Robot, `8` CWU-01P, `9` Wily P1, `10` Wily P2 |
| `024` | `VAR_BossHP` | `28` | No | Current Boss HP (`0–28`) displayed on `menu_HUD` |
| `025` | `VAR_BossPhase` | `0` | No | `0`=Inactive, `1`=Drop-In, `2`=Pose & HP Fill, `3`=Active Fight, `4`=Defeated |
| `026` | `VAR_ActiveSpecialShots`| `0` | No | Tracks single-fire special weapon lockout (`$60` equivalent in NES) |
| `027` | `VAR_RefillPending` | `0` | No | Remaining HP/Ammo units queued to tick up during energy pickup |

---

## 5. Authentic NES → PGMMV Physics & Hitbox Spec

PGMMV's movement engine runs at **60 FPS** and stores speeds directly in **pixels per frame** (`dots/frame`) and gravity in **pixels per frame²** (`dots/frame²`). That means 6502 fixed-point speeds (`px + sub/256`) convert **1-to-1** into PGMMV values!

### 5.1 ROM-Verified Physics Table (`Mega Man (USA).nes` → PGMMV)

| Mechanic | NES Hex (`px.sub`) | Exact `px/frame` | PGMMV Setting & Exact Value | Where to Set in PGMMV |
|---|---|---|---|---|
| **Scene Gravity** | `-$00.$40` | `0.2500` px/f² | **`Gravity = 0.25`**, Direction `180°` | `Scene Settings → Gravity` |
| **Terminal Fall Speed** | `-$0C.$00` | `12.0000` px/f | **`Limit Falldown = ON`**, **`Max = 12.00`** | `obj_MegaMan → Basic Settings` |
| **Ground Run Speed** | `$01.$60` (Row 8) | `1.3750` px/f | **`Horizontal Move = 1.38`** *(or set Object SysVar `Horizontal Move = 1.375` on Init)* | `obj_MegaMan → Basic Settings` |
| **Mid-Air Move Speed** | `$01.$50` (Row 7) | `1.3125` px/f | **`Move Speed % = 95.5%`** inside `Jump`/`Fall` Action boxes *(subtle MM1 accuracy!)* | `Action Program → Jump / Fall` |
| **Walk-Start ("Tiptoe")** | `$00.$20` (Row 1) | `0.1250` px/f | **`Move Speed % = 9%`** for `0.11s` (7 frames) in `WalkStart` Action box | `Action Program → WalkStart` |
| **Initial Jump Speed** | `$04.$DF` | `4.8711` px/f | **`Jump Speed = 4.87`**, **`Affect Input Duration = 0.00s`** *(see §5.2!)* | `obj_MegaMan → Basic Settings` |
| **Early Jump Release** | Cap YVel to `$01.$00` | `1.0000` px/f | On `A Released` while rising → transition to `JumpCut` (`Jump Speed` capped / `Fall`) | `Action Program → Jump → Link` |
| **Ladder Climb (Up/Down)**| `±$00.$C0` | `0.7500` px/f | **`Vertical Move = 0.75`**, **`Ignore Gravity = 100%`** | `Action Program → LadderClimb` |
| **Damage Knockback X** | `$00.$90` (Row 9) | `0.5625` px/f | Move opposite facing at `0.56` px/f for `0.53s` (32 frames) | `Action Program → HurtKnockback`|
| **Post-Hit i-Frames** | Blink timer | ~`1.50s` (90f) | `Filter Effect → Blink` + ignore `Enemy`/`Enemy Bullet` damage for `1.50s` | `obj_MegaMan` / Child Timer |
| **Mega Buster Shot** | `$04.$00` (Row 5) | `4.0000` px/f | **`Bullet Speed = 4.00`**, **`Max Bullets on Screen = 3`**, Ignore Gravity | `obj_MegaMan → Bullet Settings` |
| **Player Hitbox** | `±8` W, `±12` H | **`16 × 24` px** | Green Wall Box = **`16 × 24`**, Blue Collision Box = **`16 × 24`** | `anim_MegaMan → Frames` |

### 5.2 CRITICAL PGMMV Engine Gotcha: Parabolic Jump vs "Jetpack" Jump!
In PGMMV's internal runtime (`ObjectMovement::jump`), if you set **`Affect Input Duration` > `0.00`** under `Basic Settings → Jump`, PGMMV **disables gravity while the Jump button is held** and moves the player upward at a flat, constant velocity until the timer expires. That feels floaty and robotic—nothing like NES Mega Man!

**How to get 100% authentic NES Parabolic Variable-Height Jumping in PGMMV:**
1. In `obj_MegaMan → Basic Settings`:
   - Set **`Jump Speed = 4.87`**
   - Set **`Affect Input Duration = 0.00` seconds**
   - Now PGMMV applies `4.87` px/frame on Frame 1 and immediately subtracts `0.25` px/frame² gravity every single frame (`4.87 → 4.62 → 4.37 → ... → 0.00` over 20 frames = **~48.7 pixels = 3 tiles max jump height**, matching *Mega Man 1* to the pixel!).
2. In `obj_MegaMan → Action Programs`:
   - Connect `Jump` → `Fall` with **Link Condition 1:** `Reached Jump Peak` (`Jump Top`).
   - Connect `Jump` → `Fall` with **Link Condition 2 (OR):** `Control Key 'A' Released`!
   - When the player taps `A` and releases early, transitioning into `Fall` kills the remaining upward impulse so gravity pulls Mega Man straight into a short hop—giving crisp 1-tile, 2-tile, and 3-tile jump control!

### 5.3 Mega Man 1's Signature Ground Skid & Ice Physics
Unlike *Mega Man 2–6*, *Mega Man 1* has a subtle momentum decay on normal ground (`-$00.$04`/frame) and heavy skidding on Ice Man's floors:
- **For Ice Floors:** In PGMMV's **`Tiles → Gimmick Settings`**, enable **`Make Player's Movement Slip`** (`Slip = 85–92`) on Ice tiles! PGMMV has native slip physics (`wallSlip`) built directly into `ObjectMovement`.
- **For Normal Floors:** If `SW_QoL_CrispGroundStop == ON`, use `Basic Movement` without acceleration (`Slip = 0`) for ultra-responsive *Mega Man 2* stopping; if `OFF` (strict MM1 mode), apply a brief 6-frame `SkidStop` Action box when releasing Left/Right on the ground.

---

## 6. Mega Man Palette Swapping, HUD & Weapon Menu

### 6.1 Instant NES Armor Palette Swapping (Zero Duplicate Objects!)
Do **NOT** use PGMMV's `Fill Color` filter to recolor Mega Man for weapons—that tints his peach face and black outlines! And do **NOT** duplicate `obj_MegaMan` 8 times!

Instead, use PGMMV's built-in **`Resource Sets`** feature (`Animations → Resource Set`):
1. Build **`anim_MegaMan`** **once** (all motions, frames, `16×24` Wall/Collision boxes, and `Connection Point` at Buster tip `(+14, -2)`).
2. Export 8 identically arranged PNG spritesheets where **only the 2 armor colors** change:

| Resource Set # | Weapon | Primary Armor (NES Hex) | Secondary Trim / Helmet (NES Hex) |
|---|---|---|---|
| **Set 1** | `0: Mega Buster (P)` | Royal Blue (`#0070EC`) | Cyan (`#3CBCFC`) |
| **Set 2** | `1: Rolling Cutter (C)` | Dark Grey (`#787878`) | Pure White (`#FCFCFC`) |
| **Set 3** | `2: Ice Slasher (I)` | Deep Cobalt (`#0058F8`) | Pure White (`#FCFCFC`) |
| **Set 4** | `3: Hyper Bomb (B)` | Emerald Green (`#00A800`) | Pure White (`#FCFCFC`) *(or Pale Yellow)* |
| **Set 5** | `4: Fire Storm (F)` | Red-Orange (`#D82800`) | Golden Yellow (`#FC9838`) |
| **Set 6** | `5: Thunder Beam (E)` | Dark Grey (`#787878`) | Pale Yellow (`#FCE4A0`) |
| **Set 7** | `6: Guts Arm (G)` | Rust Brown (`#AC7C00`) | Pure White (`#FCFCFC`) |
| **Set 8** | `7: Magnet Beam (M)` | Royal Blue (`#0053EE`) | Cyan (`#06BFF2`) *(authentic MM1 `$D485` keeps Buster colors; optional Red/White if preferred)* |

3. Whenever `VAR_CurrentWeapon` changes, execute PGMMV's Runtime Action **`Change Animation Resource Set`** (`kResourceSetChange`) to select `Set (VAR_CurrentWeapon + 1)`. Every frame, hitbox, and current animation pose stays 100% intact!

### 6.2 HUD Layout (`menu_HUD` — `256 × 240`)
In *Mega Man 1 (NES)*, all vertical energy bars hold **`28` units** (`7` 8×8 cells × `4` pips per cell):

```text
┌──────────────────────────────────────────────────────────────────┐ (0, 0)
│                        0 0 1 4 5 0 0     ◄── 7-Digit Score       │
│  [W] [P]                                     (if SW_QoL_ShowScore│
│  [E] [L]                                              [B]        │
│  [A] [A]                                              [O]        │
│  [P] [Y]                                              [S]        │
│  [O] [E]                                              [S]        │
│  [N] [R]                                                         │
│  X=16 X=24                                           X=232       │
│  (Hidden when                                   (Hidden until    │
│   Weapon == 0)                                  SW_BossActive)   │
└──────────────────────────────────────────────────────────────────┘ (256, 240)
```

- **How to build the 28-pip bars cleanly in PGMMV:**
  - Create a 29-frame `anim_EnergyBar` (Frames `0` through `28`, colored per weapon via **Resource Sets**, or use PGMMV's built-in `Gauge` object / variable-driven Animation Frame!).
  - Place `obj_HUD_LifeBar` at `(24, 56)` bound to `VAR_PlayerHP`.
  - Place `obj_HUD_WeaponBar` at `(16, 56)` bound to `VAR_HUD_ActiveAmmo` (hidden when `VAR_CurrentWeapon == 0`).
  - Place `obj_HUD_BossBar` at `(232, 56)` bound to `VAR_BossHP` (visible when `SW_BossActive == ON`).

---

## 7. Weapons System & ROM-Verified Boss Damage Matrix (`Database` Tab)

### 7.1 All 8 Player Weapons (Verified from `Mega Man (USA).nes` `$A71E–$A8E5`)

| ID | Code | Weapon Name | Source | Cost / Shot | Shots on Full Bar (`28`) | Max Active | PGMMV Implementation Pattern |
|---|---|---|---|---|---|---|---|
| `0` | `P` | **Mega Buster** | Default | `0` (Free) | Infinite | **`3` shots** | Native `Fire Bullet` (`4.00` px/f, straight horizontal). |
| `1` | `C` | **Rolling Cutter** | Cut Man | **`1` unit** | `28` throws | `1` boomerang | Custom projectile object: launches forward (`2.5` px/f) with arc kick, reverses back toward `obj_MegaMan` (`Object Lock → Move Toward`), despawns on touching Mega Man. |
| `2` | `I` | **Ice Slasher** | Ice Man | **`1` unit** | `28` shots | `1` wave | Fast horizontal blade (`4.0` px/f). On hitting freezable enemy or Fire pillar: sets target `Game Speed = 0%` for `3.3s` (200 frames) instead of knockback! |
| `3` | `B` | **Hyper Bomb** | Bomb Man | **`2` units** | `14` bombs | `1` bomb | Gravity-affected arc projectile (`bounces = 3` or timer `~2.1s`), then spawns `obj_BombExplosion` AoE hitbox + SE. |
| `4` | `F` | **Fire Storm** | Fire Man | **`1` unit** | `28` shots | `1` pair | Spawns **2 objects simultaneously**: `obj_FireWave` (`4.0` px/f forward) + `obj_FireShield` (child object orbiting `obj_MegaMan` for `0.5s` that destroys weak contact enemies!). |
| `5` | `E` | **Thunder Beam** | Elec Man | **`1` unit** | `28` volleys | `1` volley | Spawns **3 beams simultaneously** (Forward + Up + Down at `4.0` px/f) + briefly flashes Layer 4 backdrop; pierces standard targets & breaks Guts blocks! |
| `6` | `G` | **Guts Arm** | Guts Man | **`2` units** | `14` throws | `1` throw | Probes `16px` ahead for `obj_GutsLiftBlock` (blinks white when in range). Pressing `B` lifts overhead (`SW_CarryingGutsBlock = ON`); pressing `B` again throws (`0` cost on pickup, **`2` units on throw**), shattering into **4 diagonal rock fragments** on impact! |
| `7` | `M` | **Magnet Beam** | Elec Stage Item *(requires Guts or Thunder)* | **`2` units** | `14` beams | Up to `5` active | Spawns `obj_MagnetPlatform` extending horizontally while `B` is held (up to screen/wall limit). Acts as a one-way solid floor (`Top Wall Detection ONLY`) and blinks/expires after **`~3.5s`**. |

### 7.2 Exact Boss Damage Matrix (`Mega Man (USA).nes` `$FDEE–$FE45`)
Enter this exact table into PGMMV's **`Database` Tab** (`DB_BossDamage`)! Every Boss has **`28` Max HP**. A value of `0` deflects with `SE_Clank` (or absorbs with no damage).

| `BossModeID` | Boss Name | `P` Buster | `C` Cutter | `I` Ice | `B` Bomb | `F` Fire | `E` Elec | `G` Guts Rock | `M` Magnet | Primary Weakness |
|---|---|---|---|---|---|---|---|---|---|---|
| **`0`** | **Cut Man** | `3` | `1` | `0` | `2` | `3` | `1` | **`14`** | `0` | **Guts Arm (`14` dmg = 2-hit KO!)** *(Buster/Fire = `3`)* |
| **`1`** | **Ice Man** | `1` | `2` | `0` | `4` | `1` | **`10`** | `0` | `0` | **Thunder Beam (`10` dmg = 3-hit KO!)** *(Bomb = `4`)* |
| **`2`** | **Bomb Man** | `2` | `2` | `0` | `1` | **`4`** | `2` | `0` | `0` | **Fire Storm (`4` dmg)** *(Buster/Cut/Elec = `2`)* |
| **`3`** | **Fire Man** | `2` | `2` | **`4`** | `1` | `1` | `1` | `0` | `0` | **Ice Slasher (`4` dmg)** |
| **`4`** | **Elec Man** | `1` | **`10`** | `0` | `2` | `1` | `1` | `4` | `0` | **Rolling Cutter (`10` dmg = 3-hit KO!)** |
| **`5`** | **Guts Man** | `2` | `1` | `0` | **`10`** | `2` | `1` | `1` | `0` | **Hyper Bomb (`10` dmg = 3-hit KO!)** |
| **`6`** | **Yellow Devil** *(Wily 1)* | `2` | `2` | `0` | `0` | `2` | **`4`** | `0` | `0` | **Thunder Beam (`4` dmg)** |
| **`7`** | **Copy Robot** *(Wily 2)* | `1` | `1` | `0` | `2` | **`2`** | **`2`** | `0` | `0` | **Fire Storm / Thunder Beam / Hyper Bomb (`2` dmg)** |
| **`8`** | **CWU-01P** *(Wily 3)* | *(Special)* | `0` | `0` | *(Special)*| `0` | `0` | *(Special)* | `0` | **7 sequential bubble units**: each bubble takes `4` hits from Buster or `1` thrown Guts Block (`4` HP removed from 28-unit boss bar per destroyed unit!) |
| **`9`** | **Wily Machine (Phase 1)** | `1` | `1` | `1` | `1` | **`4`** | `1` | `1` | `0` | **Fire Storm (`4` dmg)** |
| **`10`** | **Wily Machine (Phase 2)** | `1` | `1` | `0` | `1` | `1` | **`1`** *(multi)* | `4` | `0` | **Rolling Cutter / Thunder Beam / Fire Shield** *(multi-hit arc)* |

> **Recommended Boss Weakness Loop:** `Bomb Man → Guts Man → Cut Man → Elec Man → Ice Man → Fire Man (→ Bomb Man)`.  
> *(Starting with **Cut Man** or **Bomb Man** is easiest with the Mega Buster since Buster deals `3` dmg to Cut Man and `2` dmg to Bomb Man!)*

---

## 8. Complete 10-Stage Breakdown & Gimmick Architecture

All screen counts below are read directly from the stage descriptors (`$8C00`) in `Mega Man (USA).nes`:

| Stage | Screens | Signature Gimmicks to Build in PGMMV | Boss (`28` HP) |
|---|---|---|---|
| **0. Cut Man** | `24` | Wall-clinging Bladers, Sniper Joe shield timing, **2× Guts Liftable Blocks** in boss room! | **Cut Man** (leaps + throws Rolling Cutter; knockback on Buster hit!) |
| **1. Ice Man** | `24` | **Slippery Ice Tiles** (`Tile Slip`), **Yoku Disappearing Blocks** (frame-synced cycle timer), **Footholder** flying shooting platforms over pits, Pengs. | **Ice Man** (jumps + fires 3-tier wall of Ice Slashers) |
| **2. Bomb Man** | `24` | Bombomb 4-way cluster spawners (`y=$FF` wave spawner), Killer Bombs, Mambu shell-open timing, Sniper Joes. | **Bomb Man** (high leaps + lobs Hyper Bombs) |
| **3. Fire Man** | `24` | **Timed Flame Pillars** (freezable into solid platforms with Ice Slasher!), Changkey Makers (fireballs jumping from lava), lava foreground mask. | **Fire Man** (dueling Fire Storm waves + ground flame linger) |
| **4. Elec Man** | `24` | Tall vertical climbing shafts, Gabyoall floor patrollers, **Electric Beam Traps**, **Yoku Blocks**, **Magnet Beam Item** locked behind Guts Liftable Blocks (or Thunder Beam). | **Elec Man** (fast sprints + high-damage Thunder Beams) |
| **5. Guts Man** | `24` | **Track Conveyor Drop Platforms** (use PGMMV **`Courses`** where segments toggle between solid top & open track frame!), Mets, Picket Man, Big Eye at end! | **Guts Man** (**Screen Shake** stun if Mega Man is grounded on heavy land + boulder toss into 4 rock shards) |
| **6. Wily Stage 1** | `17` | Big Eye ambush, **Guts Block barrier**, Fire beams, **vertical shaft requiring Magnet Beam** (`M`) to climb! | **Yellow Devil** (19-piece horizontal assemble/disassemble pattern + single eye shot) |
| **7. Wily Stage 2** | `18` | **Cut Man rematch** room + **Elec Man rematch** room (`BossMode != Stage` awards bonus points instead of weapon), Bombombs over pits. | **Copy Robot** (mirrors Mega Man's equipped weapon & jump responses) |
| **8. Wily Stage 3** | `24` | Vertical drop shaft → **Auto-rush flooded sewer pipe** (constant rightward water push + Pengs/Killer Bombs). | **CWU-01P** (7 accelerating bubble cores; room has 4 Guts blocks inside!) |
| **9. Wily Stage 4** | `13` | Track lifts → **Yashichi** hidden refill → Sequential **Bomb Man → Fire Man → Ice Man → Guts Man** boss corridor gauntlet! | **Wily Machine No. 1** (Phase 1 front armor → Phase 2 exposed cockpit + spiral energy orbs) |

---

## 9. Quality-of-Life (QoL) Upgrades Design

Because we registered `SW_QoL_*` switches (`023–027`) with **Save = ON**, your recreation stays 100% faithful to 1987 NES *Mega Man* while fixing its notorious rough edges:

1. **Live `L1`/`R1` Weapon Cycling + `Select` Buster Reset (`SW_QoL_QuickSwap`):**
   - Pressing `R1` or `L1` scans `SW_Own_*` for the next/previous owned weapon, updates `VAR_CurrentWeapon`, swaps Mega Man's **Animation Resource Set**, and updates `VAR_HUD_ActiveAmmo`—zero menu pause required! Pressing `Select` snaps straight back to `Mega Buster (0)`.
2. **Native Progress & Fortress Saving (`Save File`):**
   - Original NES *Mega Man 1* had **no passwords and no battery save**! By marking `SW_Clear_*`, `SW_Own_*`, `VAR_Score`, `VAR_Lives`, and `VAR_WilyProgress` as **Saved** in PGMMV, `scn_StageClear` auto-saves via PGMMV's native `Save File` runtime action.
3. **Zero OAM Flicker & Zero Lag Slowdown:**
   - Handled automatically by PGMMV's hardware-accelerated renderer while keeping authentic 60 FPS frame timings.
4. **Optional Post-Hit Spike Protection (`SW_QoL_SpikeIframes`):**
   - In NES *Mega Man 1*, getting knocked onto spikes while blinking in i-frames still kills you instantly! We build spikes on a dedicated `Gimmick` / Tile damage check: if `SW_QoL_SpikeIframes == OFF`, spikes always deal `28` damage; if `ON`, spikes are ignored while Mega Man's i-frame timer is active (matching *Mega Man 2+*).
5. **Pause-Trick Control (`SW_QoL_AllowPauseTrick`):**
   - Famous MM1 quirk: opening/closing the `Select` pause screen cleared boss invincibility frames (`boss_iframes`), allowing Thunder Beam / Fire Storm to shred Yellow Devil in one shot! In PGMMV, `Show Menu Screen (Pause Scene = ON)` naturally preserves the Boss's i-frame timer (fixing the exploit cleanly), with an optional `SW_QoL_AllowPauseTrick` switch if you want to allow it as an Easter egg!

---

## 10. Step-by-Step Build Roadmap (8 Interactive Milestones)

We will build this cleanly inside the Pixel Game Maker MV editor one milestone at a time—testing and playable at the end of **every single milestone**:

- [ ] **Milestone 1 — Project Setup, Assets & Test Sandbox**
  - Create the `256×240` (`16×16` tile) PGMMV project, set up Object Groups, Controls, Common Switches/Variables, and import Mega Man's spritesheet (8 Resource Sets) + test tileset *(we can extract crisp PNGs directly from `Mega Man (USA).nes` whenever you want!)*.
- [ ] **Milestone 2 — Mega Man Core Controller & Mega Buster**
  - Build `anim_MegaMan` (`16×24` hitboxes + Buster connection point) and `obj_MegaMan`'s complete Action Program: Teleport-In, Idle (with blink!), Walk-Start tiptoe, Run, Parabolic Variable-Height Jump, Ladder Grab/Climb/Top-Dismount/Ladder-Shoot, Knockback + i-Frames, 8-Orb Death Explosion, and 3-shot Mega Buster.
- [ ] **Milestone 3 — Camera Room System, Shutters, Checkpoints & Pickups**
  - Build `obj_CameraController`, horizontal corridor clamping, `240px` vertical shaft transitions, `256px` Boss Shutter Doors, Checkpoint respawn logic, and Energy/Score/1-UP pickups with authentic bar-ticking refill.
- [ ] **Milestone 4 — HUD, Start Weapon Sub-Screen & QoL Quick-Swap**
  - Build `menu_HUD` (28-pip Life, Weapon, and Boss bars + Score), `menu_WeaponSubscreen`, and `L1`/`R1`/`Select` live weapon switching with instant Resource Set palette swaps.
- [ ] **Milestone 5 — First Complete Vertical Slice: Cut Man's Stage + Cut Man Boss**
  - Assemble all 24 screens of Cut Man's stage, Sniper Joe / Blader / Bunby Heli / Mambu / Big Eye enemies, Guts Liftable Blocks in the boss room, Cut Man's AI, Boss Orb victory, and Stage Clear tally → Rolling Cutter unlock!
- [ ] **Milestone 6 — All Remaining Special Weapons & `DB_BossDamage`**
  - Implement Rolling Cutter, Ice Slasher (with enemy freeze), Hyper Bomb, Fire Storm (wave + shield), Thunder Beam (3-way), Guts Arm (lift/shatter), Magnet Beam (temporary platform segments), and the 11×8 Boss Damage Database.
- [ ] **Milestone 7 — Remaining 5 Robot Master Stages & Bosses**
  - Build Ice Man, Bomb Man, Fire Man, Elec Man, and Guts Man stages, their signature tile/course gimmicks (Ice slip, Yoku blocks, Footholders, Flame pillars, Guts track lifts), and `scn_StageSelect`.
- [ ] **Milestone 8 — Wily Fortress (Stages 1–4), Final Bosses, Save/QoL Menu & Ending**
  - Build Wily Stages 1–4, Yellow Devil (19-chunk blitz), Copy Robot, CWU-01P, Wily Machine Phases 1 & 2, Ending credits sequence, and Title/Save/QoL Options screen.
