# Step2 — interactive menu UI test (GMS1.4.1760)

User confirms all menu sprites/sounds imported, including6-frame E/W/M selection strip. This checkpoint tests controls/rendering/audio in **a new, isolated room**, not in Cut Man. Existing gameplay is untouched. GML files are plain text for manual resource/event creation; do not import this ZIP as a GameMaker project.

## Scope — read first

This is an INTERACTIVE UI TEST, not a completed pause system. Uses explicit sample data: health14, lives03, weapon energy14 (Buster28), tanks E02/W02/M01, all11 test entries available and Energy Balancer owned. No decisions about real starting inventory/lives/unlocks are implied. Tank Start reduces a TEST counter once and logs a message; it does not heal/refill weapons, consume the player's inventory or implement Energy Balancer. Choosing a weapon records only a local test selection. No world freezing/player integration/credits screen yet. Displayed credit remains **Sprites by KindlyPatrick** when credits are implemented.

## 1. Create Scripts folders and4 scripts

Folder: **Scripts > Mega Man > MM5 > Pause Menu > UI Test**.

Create each Script with exact name and paste ALL contents of corresponding .gml file:

- scr_mm5_pause_text
- scr_mm5_pause_meter
- scr_mm5_pause_box
- scr_mm5_pause_test_move

No arguments need configuring in the editor. Text uses your original38-frame sprite alphabet, not a Fonts resource. Meter helper crops the imported full-bar styles for this UI test; it is not a verified original-ROM empty-meter rendering routine.

## 2. Create Object folder and controller

Folder: **Objects > Mega Man > MM5 > Pause Menu > UI Test**.

Create **obj_mm5_pause_menu_test**:
- No Sprite; Visible ON; Solid OFF; Persistent OFF.
- Add ONLY these4 events and paste each matching file in full:

| Object event | File |
|---|---|
| Create | obj_mm5_pause_menu_test_create.gml |
| Step > Step | obj_mm5_pause_menu_test_step.gml |
| Draw > Draw GUI | obj_mm5_pause_menu_test_draw_gui.gml |
| Other > Room Start | obj_mm5_pause_menu_test_room_start.gml |

No ordinary Draw event, Begin Step, player event, startup object, HUD object, cleanup event or room creation code needed. In particular **do not paste this into obj_mm5_megaman**. No GMS2 function/struct/array_create syntax; no unsupported draw_get_font.

## 3. Create an isolated test room

Folder: **Rooms > Mega Man > MM5 > Pause Menu > UI Test**.

Create **rm_mm5_pause_menu_test**:
- Width256, height240, speed60.
- Background black; no background sprite/tile layers needed.
- Place EXACTLY ONE instance of obj_mm5_pause_menu_test (position0,0 is fine).
- No player, HUD, arrival, charge manager, stage objects or other instances in this room.

Temporarily move this room to the FIRST position in the Rooms resource tree so Run starts here. Remember the current first room and restore it after the UI check (normally your title room). Do not rename/delete existing rooms or add this controller to the Cut Man room yet. The controller configures Draw GUI to256x240, matching current HUD design.

## 4. Run and check controls

The menu opens immediately on test-room entry, playing the approved MM5 opening sound ONCE.

| Input | UI-test action |
|---|---|
| Arrows | Move among weapon rows, E/W/M and UPGRADES |
| Hold arrow | Immediate move,18-update delay, then repeat every6updates |
| Enter | Represents START in this test |
| Enter on weapon | Records test selection and closes test menu |
| Enter on E/W/M | Uses ONE TEST counter if >0; stays open so you can inspect it |
| Enter on UPGRADES | Opens upgrades page |
| Arrows on upgrades | Move between Energy Balancer icon and WEAPONS return button |
| Enter on Energy Balancer | No activation; passive item, description stays visible |
| Enter on WEAPONS | Returns to main page |
| Escape on upgrades | Returns to main page |
| Escape on main page | Closes menu without selecting a weapon |
| Enter while closed | Reopens menu with opening sound |

Arrows do not wrap at outer edges; no move means no cursor sound. Selected tank/upgrade uses its coloured state. Exactly one main-page target highlighted at a time. No separate Rush section. Text stays compact (R.CUTTER etc), no PAUSE title, lives at top-left outside weapons/utilities. Description appears only when Energy Balancer ICON has the cursor, not when return button has it.

Do not hold Enter expecting repeated consumption: tank use is fresh-press only. No unapproved close/confirm/refill sound is added. Stage music is not stopped; no stage music exists in this isolated room.

## 5. Required checks before stage integration

1. All original glyphs draw legibly; each icon matches approved art. Cutter remains original grey/white, no gold. W casing unchanged, letter flipped only.
2. Full/partial meters fit rows without touching neighbouring icons. Sample health is half-full by design, NOT your actual player's HP.
3. From Buster press Down six times: E tank highlights in colour. Press Enter once:02->01. HOLD Enter: stays01. Release/repress:01->00. Press again: stays00, never negative.
4. Move Right to W and M; each selected icon colours correctly. Same fresh-press test, independent sample counters. Debug output explicitly says TEST and no gameplay refill.
5. Reach UPGRADES, enter, check coloured Energy Balancer/name/description. Select WEAPONS: icon grey and description clears. Return and reopen page.
6. Moving cursor plays MM5 cursor effect only on changed target, not at a blocked edge. Opening/reopening plays MM5 open once; redraw does not replay sounds. No overlapping cursor stacks on rapid moves.
7. Enter on a weapon closes to black test-room screen with ENTER OPENS MENU. Enter reopens. No shooting/player should appear in test room.
8. Restore previous first room and run your normal game: title/select/Cut Man/health/startup/audio unchanged.

Report compile error text/file/line if GMS complains, or which check differs. **These files have NOT been executed in GameMaker here.** Static/resource/graph/input-counter models pass but are not a substitute for your GMS1.4 run.

## Next checkpoint (not installed here)

After UI works: integrate controller with Cut Man, gate READY/arrival, freeze only active gameplay instances safely and restore exactly those, preserve music and charge audio, prevent close-key leakage, use actual player health/lives/inventory, and define tank refill eligibility/effects/close behaviour. Do NOT assume Start on tank closes the real menu yet; staying open here is a test convenience. Damage, enemies, unlocks, tank gameplay and Energy Balancer automatic routing remain separate work.
