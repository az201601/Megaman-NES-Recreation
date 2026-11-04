> **Superseded for combat:** this is the historical art-only guide. The complete manual combat source/import package is now at `Assets/Combat/MM5/Blader Checkpoint/INSTALL-GMS14.md`; follow that guide instead. Local GMS compilation/playtesting remains required.

# Cut Man: Blader sprite checkpoint — GMS1.4.1760

Original MM1 Blader graphics recovered from supplied USA ROM, using actual OAM components/attributes and pinned Mesen0.9.9 RGB palette. JSNES2.1.0, not a Mesen executable/hardware capture. Two16x24 canonical left-facing frames; original right-facing counterpart is mirrored. Not repainted, AI-generated or redrawn. Each pose has been matched against original rendered opaque pixels.

## Install ONLY the sprite

Back up project first. Folder **Sprites > Enemies > MM1 > Blader**.

Create exactly **spr_mm1_blader**. In its Sprite Editor use **Create from Strip** on **spr_mm1_blader_strip2.png**:

- Source strip32x24.
- Two images total, two per row.
- Image width16,height24.
- Offsets0,0; separations0,0.
- Final sprite must be **2 subimages, each16x24**, not one32x24 image.
- Origin8,12 (art canvas centre). The eventual renderer must account for native OAM's +1Y; this is not an enemy collision origin/hitbox certification.
- Preserve PNG alpha. Remove Background OFF; Smooth Edges OFF. Do not recolour or resize.
- Collision mask is not being connected in this checkpoint. No automatic sprite-to-terrain collision.

Enlarged checkerboard **blader_sprite_preview.png** is for viewing only. Do NOT import that preview or flatten its grey background into sprite artwork.

**Do not create/place a Blader object yet.** Do not alter player, HUD, pause, charge, collision or stage music. This checkpoint adds no active gameplay, sounds, damage, hitbox, drops or enemy spawning. Current player/pause system is preserved. Sprite Editor playback speed is only a preview; measured native rotor changes every3enemy updates, to be driven by controller later.

## Verified behaviour for upcoming controller

AI changes from pursuit to dive when horizontal INTEGER gap is below40px (search uses current player position after its own update). It commits direction and target height at entry, does not continually home during the dive, reverses its vertical speed partway through, then returns to level pursuit. Source fixed-point increments are24/256 then4/256 per update; timer51 on entry, decremented to50 immediately, vertical reversal at pre-decrement26, ends at0 resetting vertical speed0 and horizontal speed1+32/256=1.125. Vertical magnitude is floor(abs(integerYdifference)*256/24)/256. Two rotor states alternate every3updates in observed uninterrupted runs.

249 routine/helper bytes match supplied USA ROM exactly. Labels came from TheRealQuantam/mm1base commit9c1cb05bd1d63c176e1930053dda76bcb85cd977 (RockmanJ-based/modified project); modified code never executed. Independent fixed-point model matches1023original AI updates over three moving input traces; idle fourth branch never spawns it.16attack entries/15vertical reversals included. This does NOT certify gameplay collision, bullet response, damage, audio, all stage spawns, or GMS runtime.

### Important stage-placement boundary

First observed spawn in natural Right branch: worldX272,Y76, at update21 after camera progresses; starts in slot16, type0. Right+jump reaches spawn earlier (update15). Idle branch has no spawn in360updates. Therefore **do not invent a fixed21-frame spawn timer** or put it arbitrarily inside the existing256-wide Screen01 room. We need the next route section/camera and proper original spawn trigger before stage placement. Exact spawn-table/camera threshold still to decode; snapshot X272 is observed, not a fully recovered spawn rule.

Next installation checkpoints require camera/route expansion before placement, enemy collision/shot/death/audio checks and relevant MM5 player damage/invulnerability integration. Original MM1 body hit in existing reference is3HP; not a finished custom combat implementation. No MM1 spike immunity bypass and no score/points to carry over.

## Reproduce/source tests

Prepare original stage snapshot with tools/rom-recovery/mm1-hurtwalk.mjs. Recover source-only reference ASM into ignored.work from pinned GitHub commit (bank5.s,bank7.s); never fetch/run a modified ROM. Run recover-cutman-blader.mjs and test-cutman-blader.mjs. Raw four360-frame traces and per-pose source OAM in Reference/native-blader-trace.json. Generated data does not modify ROMs or GameMaker project.

## Combat foundation follow-up (not an installation release)

The accepted stage route is now fully extended, so the historical route-expansion
prerequisite above is satisfied. `Reference/native-blader-combat.json` now decodes
all nine original Blader spawn records and confirms the first natural camera
threshold: cameraX17, right edge272, record `[01,10,4C,00]`. This replaces the
previous unknown-trigger status, not the original observation at update21.
Native body damage3 and one-normal-shot kill threshold are now byte checked;
USA body-damage table isFE89 (the J-based source's printed FEBD is not correct
for the supplied USA ROM). Complete combat installation is still pending at
`Assets/Combat/MM5/Blader Checkpoint/README.md`. Do not place an object yet.
