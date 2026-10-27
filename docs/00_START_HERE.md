# 00 — Start here (absolute beginner)

You want to rebuild Mega Man 1 exactly, in GameMaker: Studio 1.4.1760.
This page gets you from "I have never used GameMaker" to "a game window opens".
Take it slowly. Do not skip the **Test** lines — they are how you know a step
worked before you build on top of it.

---

## 0.1 The four things you need

| Thing | Why | Where |
| --- | --- | --- |
| **GameMaker: Studio 1.4.1760** (Windows) | The editor that turns code into a game | You must already have the installer. It is discontinued; YoYo Games no longer offers the 1.4 download. If you don't have it, use a legally obtained copy from your own archive. Never download a cracked copy. |
| **This repository** | The guide, code and graphics | You already have it. |
| **An NES emulator with frame advance** — [Mesen 2](https://github.com/SourMesen/Mesen2) or FCEUX | To *measure* the original game. 1:1 means you compare, not guess. | Free, Windows |
| **Python 3** (optional) | Only to re-run the graphics extractor | Free. `gfx/` is already generated, so you can skip this. |

> **Important about versions.** GML (GameMaker Language) changed a lot in
> GameMaker Studio 2 / GameMaker 2022+. Every code file in `gml/` is written
> for **1.4.x**. If you paste it into a modern GameMaker it will produce errors
> (`instance_create`, `view_xview[0]`, `image_speed`, `draw_text` etc. behave
> differently). Use 1.4.1760 for this project.

---

## 0.2 Vocabulary (you will see these words constantly)

| Word | Meaning |
| --- | --- |
| **Sprite** | A picture (PNG). Mega Man, a bullet, a brick. |
| **Object** | A *thing* in the game: the player, an enemy, a wall. It usually has a sprite and code. |
| **Instance** | One copy of an object in a room. Ten Mets = ten instances of `obj_met`. |
| **Room** | A level / screen. In GMS 1.4 a room has a size, a speed, and instances placed in it. |
| **Event** | "When this happens, run this code." Create, Step, Draw, Collision, Alarm… |
| **Step** | One frame of game time. With `room_speed = 60`, the Step event runs 60 times per second. |
| **Script** | A named block of GML you can call from anywhere, e.g. `scr_mm_hurt_player(3)`. |
| **Parent** | An object other objects inherit from. Great for walls and enemies. |
| **View** | The camera. It shows a 256×240 slice of a bigger room. |
| **`x`, `y`** | An instance's position in the room, in pixels. `y` grows **downwards**. |
| **`hsp`, `vsp`** | Our names for horizontal / vertical speed in pixels per frame. |
| **`global.`** | A variable that survives everywhere (score, lives, HP). |
| **`var`** | A temporary variable that disappears at the end of the event. |

---

## 0.3 The GameMaker 1.4 window, in one picture

```
┌──────────────────────────────────────────────────────────────┐
│ File Edit …                                     [F5 = Run]   │
├───────────────┬──────────────────────────────────────────────┤
│ RESOURCE TREE │  The editor for whatever you double-clicked  │
│               │  (sprite, object, room, code…)               │
│ ▸ Sprites     │                                              │
│ ▸ Sounds      │                                              │
│ ▸ Backgrounds │                                              │
│ ▸ Scripts     │                                              │
│ ▸ Objects     │                                              │
│ ▸ Rooms       │                                              │
│ ▸ Included    │                                              │
│   Files       │                                              │
│ ▸ Global Game │                                              │
│   Settings    │                                              │
└───────────────┴──────────────────────────────────────────────┘
```

* **Right-click** a folder in the tree → **Create …** to make a resource.
* **F5** runs the game, **F9** toggles a breakpoint, **Ctrl+S** saves.
* A GMS 1.4 project is normally a folder of files; **File → Create
  Executable** or **File → Export Project (`*.gmz`)** makes a shareable file.

---

## 0.4 STEP 1 — Make the project (10 minutes)

1. Open GameMaker: Studio 1.4.1760.
2. **File → New Project**. Choose **New Empty Project** (NOT "Drag & Drop").
3. Save it as `MegaMan1` somewhere simple, e.g. `C:\MegaMan1\`.
   GameMaker saves it as `MegaMan1.project.gmx` plus folders.
4. In the resource tree, double-click **Global Game Settings** at the very
   bottom. Set:

   * **Windows tab → Scaling**: choose **Fixed scale** and enter `300` (percent),
     or keep aspect ratio. 3 × 256×240 = 768×720, a perfect integer scale.
   * **Uncheck "Interpolate colors between pixels"**. This is essential —
     otherwise your pixel art becomes blurry.
   * **Uncheck "Start in fullscreen mode"** while developing.
   * **General tab**: leave everything default.

5. **File → Save** (Ctrl+S).

> **Why 300%?** The NES drew 256×240 pixels. On a modern monitor that is tiny.
> Multiplying by a whole number (3) keeps every source pixel exactly square.
> Never use a fractional scale (e.g. 2.5×) for a 1:1 recreation.

**Test:** press F5. A blank window should open. Close it. Nothing else should
happen — that is correct, we have no room yet.

---

## 0.5 STEP 2 — Your first room (5 minutes)

1. Right-click **Rooms → Create Room**. A new `room0` appears.
2. In the **Settings** tab:
   * **Width** `256`, **Height** `240`
   * **Speed** `60`  ← this is `room_speed`. The NES runs at ~60.0988 Hz; 60 is
     the closest GameMaker value and every constant in this guide assumes 60.
3. In the **Backgrounds** tab, click the colour swatch and pick a dark grey
   (`#202020`). This is just so you can see sprites.
4. In the **Views** tab:
   * tick **Enable the use of Views**
   * select **View 0**, tick **Visible in room when startup**
   * **View in room**: X `0`, Y `0`, W `256`, H `240`
   * **Port on screen**: X `0`, Y `0`, W `768`, H `720`
5. Close the room window.

**Test:** F5. A 768×720 dark grey window opens. If it is a different size,
re-check the port and the scaling setting from step 1.

---

## 0.6 STEP 3 — How you will paste code (read this once!)

Every file in `gml/` is a plain text file containing one piece of code.
There are two places code goes:

### A. Scripts (easiest)

1. Right-click **Scripts → Create Script**.
2. Type the **name** exactly as the file says, e.g. `scr_mm_init`
   (the filename is `gml/scr_mm_init.gml`).
3. Delete the default text and paste the whole file contents.
4. Click the green **✓** (check) button in the toolbar to save and close.

### B. Object events

1. Right-click **Objects → Create Object**. Name it exactly, e.g. `obj_player`.
2. Pick its sprite from the **Sprite** drop-down (if the file's header says so).
3. Click **Add Event** and choose the event named in the file's header, e.g.
   **Create**, **Step → Step**, **Draw → Draw**, **Collision → obj_shot**.
4. In the Actions panel, open the **control** tab and drag the
   **Execute Code** action (a page icon with `{ }`) into the Actions box.
   A code editor opens. Paste the file contents, click ✓.
5. Repeat for every event file belonging to that object.

> **Tip:** the first comment line of every `gml/` file tells you exactly which
> object and event it belongs to. Example:
> `// obj_player — Step event (Normal Step)`.

> **Naming matters.** GML refers to resources by name. If you call it
> `spr_player` instead of `spr_mm_stand_R`, the code will not compile. Use the
> exact names in `docs/02_STEP_BY_STEP.md`.

---

## 0.7 STEP 4 — Hello, Mega Man (10 minutes)

1. Right-click **Sprites → Create Sprite**. Name it `spr_mm_stand_R`.
2. Click **Load Sprite**, choose
   `gfx/megaman/P/stand_R_0.png`.
3. Set **Origin X = 24**, **Origin Y = 24** (the PNG is 48×48; the ROM puts
   Mega Man's centre at pixel 24,24).
4. Click **Modify Mask** → tick **Manual** bounding box and set
   **Left 18, Right 29, Top 13, Bottom 34**. That gives a 12×22 hitbox —
   smaller than the picture, exactly like the NES.
5. Create a second sprite `spr_mm_stand_L` from `stand_L_0.png` with the same
   origin and mask.
6. Right-click **Objects → Create Object**, name it `obj_player`, assign the
   sprite `spr_mm_stand_R`.
7. Open the room from step 2 → **Objects** tab → click in the room near the
   bottom-left (about x=40, y=180) to place one `obj_player`.
8. F5.

**Test:** you should see the original 1987 Mega Man sprite, sharp (not blurry),
floating in a dark grey 256×240 world. He won't move yet — that is step 6 of
the main guide.

---

## 0.8 How the rest of the guide is structured

Open **[`02_STEP_BY_STEP.md`](02_STEP_BY_STEP.md)** next. Each step has:

* **Goal** — what you will have at the end.
* **Do** — exact clicks and code files to paste.
* **Why** — the reasoning, so you actually learn.
* **Test** — press F5 and check something specific.
* **If it broke** — the two or three most likely mistakes.

Before you start coding, skim
**[`01_THE_1_TO_1_SPEC.md`](01_THE_1_TO_1_SPEC.md)** once. You don't need to
memorise it — it is the answer-book you come back to when a number feels wrong.

---

## 0.9 Five beginner rules that will save you hours

1. **Save after every step.** Ctrl+S is free.
2. **Only add one new thing at a time, then press F5.** If you paste 500 lines
   at once and it breaks, you will not know where.
3. **Read the error message.** GameMaker tells you the object, event and line.
   `"Unknown variable hsp"` means you forgot to define `hsp` in the Create event.
4. **Names are case-sensitive-ish and must match exactly.** Copy them, don't
   retype them.
5. **Compare with the real game constantly.** Open Mesen, load
   `Mega Man (USA).nes`, and use **frame advance** (default `\` key) to step one
   frame at a time. Record the original and your version side by side. That is
   what "1:1" actually means.

---

## 0.10 Already stuck?

→ [`04_TROUBLESHOOTING.md`](04_TROUBLESHOOTING.md)
