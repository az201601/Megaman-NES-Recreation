# Big Eye — GMS 1.4.1760 manual installation

Back up your working project; stop the runner. Requires your six accepted enemies: Blader, Blaster, corrected Super Cutter, Flea, Octopus Battery and Flying Shell. **Do not reinstall their older checkpoints.** Download/extract the new ZIP from GitHub to a separate folder. Manual source/resource package, not an importable GMX.

## 1. ONE sprite

Folder **Sprites → Enemies → MM1 → Big Eye**.

1. Create Sprite **`spr_mm1_big_eye`** (update an exact existing name rather than accepting a numbered duplicate).
2. **Edit Sprite → File → Create from Strip**, select **`Art/spr_mm1_big_eye_strip2.png`**.
3. **Number of images2; Images per row2; Image width32; Image height48**. All pixel/cell offsets and horizontal/vertical separations **0**.
4. Confirm two32×48subimages, grounded first/airborne second—not a single64×48image.
5. Green check to leave editor. Set **Origin X12, Y27** manually. Do not Centre afterward, crop padding, resize, recolor or remove the transparent rows. Save.

Keep transparency, default mask/texture settings, no smoothing/Remove Background. Numeric collision is independent of artwork. Both native poses independently match original rendered pixels.

## 2. ONE new sound

Folder **Sounds → Mega Man → MM1 → Big Eye**.

1. Create Sound **`snd_mm1_big_eye_land`**.
2. Load **`Audio/snd_mm1_big_eye_land.wav`**.
3. Normal uncompressed playback, default gain1, save. Non-looping playback is in code.

This is actual native landing cue$29, full-APU48kHzstereoPCM16, exact2×sample-amplitude gain and silence-only trim; **do not double the gain again**. The protected native enemy lands naturally; its ground wait is held after that landing only during recording to prevent a second landing contaminating the tail. One request/one driver dispatch across the whole capture. No channel muting, synthesized replacement, fade, filter or pitch change. Full-tail audit is not an import file. **New sound awaits your listening/runtime approval.** Leave approved Blaster/Shell/MM5/MM6/music resources and Included Files unchanged.

## 3. FIVE new scripts

Folder **Scripts → Enemies → MM1 → Big Eye**. Create each Script resource below, paste the **whole identically named file** from `Scripts/`, save:

- `scr_mm1_big_eye_step`
- `scr_mm1_big_eye_world_step`
- `scr_mm1_big_eye_spawn`
- `scr_mm1_big_eye_hit`
- `scr_mm1_big_eye_contact`

Do not create Script resources from Objects/ or Hooks/. Do not add these as object Step events.

## 4. ONE new object — only Create and ordinary Draw

Folder **Objects → Enemies → MM1 → Big Eye**.

1. Create Object **`obj_mm1_big_eye`**.
2. **Sprite `<no sprite>`; Visible checked; Solid unchecked; Persistent unchecked; Parent `<no parent>`**. Default editor mask/depth; code sets drawing/depth.
3. Add **Create → Execute Code**, paste whole **`Objects/obj_mm1_big_eye_create.gml`**.
4. Add ordinary **Draw → Execute Code**, paste whole **`Objects/obj_mm1_big_eye_draw.gml`**. Not Draw GUI/Begin/End.
5. Save. **No Step, Begin Step, End Step, Collision, Destroy or inherited-event actions.** The existing central combat owner runs movement/contact once.

No manual room placement/generator objects. Unlike the previous Shell bullet, **Big Eye has no parent**. Do not change that bullet's required parent or any accepted object events.

## 5. APPEND ONE existing Create event — not a replacement

Open **Objects → Mega Man → MM5 → Combat → `obj_mm5_combat` → Create → Execute Code** (or its current folder).

Scroll to the very bottom, after the accepted Flying Shell initialization. Append the **whole** **`Hooks/obj_mm5_combat_create_big_eye_append.gml`**, **once only**. New block begins:

```gml
big_eye_spawn_count = 1;
```

Keep ALL previous player/combat/health/drop/refill/death/enemy initialization and the entire Shell spawn block. Do not paste into manager Step/End Step, stage Create or the Big Eye object. Unknown `big_eye_spawn_count` at runtime usually means this step is missing.

## 6. REPLACE TWO complete existing scripts — do not append

Folder **Scripts → Mega Man → MM5 → Combat**, or the folder containing your accepted scripts.

1. Open **`scr_mm5_combat_end_frame`**, select ALL existing code, replace with whole **`Scripts/scr_mm5_combat_end_frame.gml`**, save.
2. Open **`scr_mm5_combat_shot_step`**, select ALL existing code, replace with whole **`Scripts/scr_mm5_combat_shot_step.gml`**, save.

These are existing Script resources, not events. They preserve accepted code outside additive Big Eye calls/loop. No other replacements. Camera/player/buster events/stageCreate/music/scenery/collision/ladders/blocks/gates/HUD/pause/old sounds/IncludedFiles remain unchanged. Do not add a second central movement pass.

## 7. Compile and installed-game test

Source/native/mock checks are **not GMS1.4 compilation or installed runtime certification**. Test before treating this checkpoint as accepted.

1. Compile/run; verify six earlier enemies, pause, charge/fire/hit/ding/pickup audio still work.
2. After the two Shell encounters/downward return, find Big Eye before the first gate: **projectX2016,Y892, band720**, scripted once when its anchor enters view. No manual placement. Grounded feet align with original floor; sprite should not be chopped or shifted.
3. Ground wait15activeupdates; turns toward player at launch, picks native low/high jump. Low hopX308/256/up849/256, high hopX209/256/up1254/256. Airborne skips shared clock&3==0 updates. Terrain contacts use existing invisible-solid/one-way-floor sweeps, not scenery. Check floor, nearby blocks/walls, underside/ceiling and both directions. Removed Super Arm blocks must not leave phantom support.
4. One landing cue on each airborne-to-ground transition, no repeated rumble during the15-update wait; no invented launch sound. Listen to the new take and confirm volume/tail.
5. All poses vulnerable: **20 normal hits**,20medium hits, or7full-charge hits from full health. Each successful hit uses approved MM6cue. MM5 adaptation: normal/mid1damage/full3; full shots consumed at pre-hitHP≥4, weak finishing full shot pierces. No closed blocking/ding for Big Eye.
6. Body contact deals **10health** through existing MM5 recoil/protection/slide/death owner. Numeric enemy halfsize12×20, not whole image rectangle. A lethal shot processed before contact must not also hurt player. One explosion/one existing MM5 drop roll on kill, no drops on offscreen/route cleanup.
7. No duplicate Big Eyes while anchor remains visible; killed/culled record rearms only after anchor leaves view. Ordinary record spawn scheduling is a central-project adaptation, not Shell's repeating-edge generator.
8. Pause/refill freeze movement/jump/wait/hit/contact; no landing audio should run while frozen. Gate/ladder changes remove stale Big Eye without explosion/drop. Existing life/health caps, cues and spare-life semantics unchanged.

Static/double-speed actors usually mean missing central replacement or extra Step event. Tiny/oversized art means wrong strip width/height; shifted art means origin not12,27. Do not rebalance approved audio to compensate for this new cue. Send compiler message/event/line if compilation fails; source mock is not the compiler.
