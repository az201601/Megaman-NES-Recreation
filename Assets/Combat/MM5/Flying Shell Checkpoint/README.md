# Flying Shell / Shellgun — additive GMS1.4 checkpoint

After accepted Blader/Blaster/Super Cutter/Flea/Octopus Battery. Two new native sprites, one new native burst sound, twoCreate+Draw objects (body no parent, bullet child of existing Blaster bullet), five new scripts, one manager Create append, two central replacements. No actor Step events/manual instances or camera/player/terrain/menu/existing-audio changes. Detailed manual resource/event/parent instructions in INSTALL-GMS14.md. **GMS compile/installed gameplay/new audio acceptance pending.**

## Behavior / native checks

Original evidence:413exact sourcebytes, two1000-update protected original-ROM trials,1984active-shell animation/timer/movement transitions and1038bullet deltas,20eight-way bursts, closed block/openonehitkill overlap trials and replacement trace. Native cycle moves with previous speed before timer check:1.125left, stop/open56, fire72, restore speed/close/reset88. Vulnerability samples pre-update state, matching the accepted Blaster scheduling convention. Halfwidth8/halfheight9/body1; projectile halfsize1/contact2. Closed uses existing approved MM6ding and established all-shot hybrid up/back deflection; open normal/mid/full kill, fullcharge weak-target piercing, approved MM6hit/explosion/one-MM5-drop pipeline. Native MM1 has no charge; these charge/deflection rules are project adaptations.

Both native page16/17X248/Y128 encounters map to project `(2040,368)`/`(2040,608)` in viewX1792/bands240/480. They repeat while the encounter is visible: no-kill left exit repositions the same body at right+248 while retaining Xfraction and no drop; killed body schedules replacement after70subsequent active updates, based on the observed native72birthcounter minus two same-death-update decrements. Cooldown stored in manager arrays rather than invisible native placeholder actors. We preserve that measured delay under central scheduling, not every native slot/order/fraction side effect. Existing new-actor birth waits one update before movement/contact; native-to-GMS draw lag identity is not claimed. New body after kill starts clean position fractions rather than native recycled-slot random fractions. No uniform RNG needed for cycle; accepted MM5 drop-byte mapping remains the existing project adaptation.

## Native artwork and shared projectile owner

Body17×24commoncells/origin8,11preserve open middle pair's native1pxright offset; closed16×16 occupies rows4..19. Two native-render matched poses, no repaint/crop. Native burst bullet is8×8/origin4,3 and **salmon FE8170**, not earlier Blaster's magenta B71E7B. Live OAM/CHR/palette composed RGBA and opaque native render independently verified; separate child Draw sprite avoids recoloring accepted Blaster assets.

Both use original projectile type2D, so the new bullet object is a **child of existing obj_mm1_blaster_bullet**, with its own complete Create and Draw. Existing parent-type central movement/contact/route cleanup automatically includes children in GMS1.4. No second movement loop or parent event edits. The limited mock adapter now explicitly models that parent inclusion; installed GMS inheritance must still be confirmed. Missing parent would strand bullets. Source files alone cannot set a GUI project's parent property; follow installer.

## Full-APU sound comparison/capture

`compare-flying-shell-audio.mjs` loads identical ninth-ladder normal-game snapshots including initialized PAPU48kHz, queues nativeFFonce at an empty native dispatch to stop initialized music, then captures an unchanged real burst after300protected neutral updates. Native AI issues8cue15requests;8reach driver. A **separate labelled control** reduces same8requests to1at dispatch. Active PCM is **not identical** (6568vs6592sample frames after silence-only active extraction); this is not a claim of perceptual distinction or comparison to the historical approved Blaster capture.

New sound is the actual unchanged eight-dispatch full-APU take, one WAV played once per burst; no8voice stacking, synthetic tones, channel muting, fades, filters or normalization. Exact2×PCM amplitude gain,96leading/480trailing zero frames (2ms/10ms),48kHzstereoPCM16;7144frames total. Full-tail audit stays in repo; import ZIP includes only trimmed native-burst sound renamed snd_mm1_flying_shell_fire.wav. Accepted Blaster/MM6/MM5 effects/charge/music0.85 untouched. **New sound is awaiting user listening/runtime approval**, not retroactively approved by earlier effects.

## Validation and limits

Actual-GML limited JS/engine tests match1984native flight states and1038native bullet deltas through the shared parent pass;8vectors, pre-update vulnerability, allshot closed/open behavior, repeating exit/fraction and70update replacement,2anchors, one drop, body1/bullet2/slide, killed-before-contact, pause/refill/death/route cleanup, deflected-shot exclusion, new sprite/audio hashes/exact PCM trim and builtin-local guards. All old central lines preserved outside additive calls. Base407checks and accepted Octopus1996/Flea1369free+614grounded+498skip/SuperCutter245/Blaster840 suites pass under overlay. Gate34/pause16source checks pass.

These are **not GMS compiler/runner/GPU/event-scheduler/inheritance/audio hardware or user installation proof**. Editable GMX is not in repo. Native controls/overlap/snapshot limitations remain documented in research README/evidence. Later enemies/hazards/tanks/upgrades/checkpoint refinements/boss outside scope.

```sh
node tools/rom-recovery/compare-flying-shell-audio.mjs
node tools/rom-recovery/recover-flying-shell-art.mjs
node tools/rom-recovery/test-flying-shell-integration.mjs
SHELL_OVERLAY=1 node tools/rom-recovery/test-octopus-battery-integration.mjs
SHELL_OVERLAY=1 node tools/rom-recovery/test-flea-integration.mjs
SHELL_OVERLAY=1 node tools/rom-recovery/test-super-cutter-integration.mjs
SHELL_OVERLAY=1 node tools/rom-recovery/test-blaster-integration.mjs
python tools/rom-recovery/package-flying-shell-combat.py
```

Deterministic ZIP/CRC/manifest/exact-copy verified; no ROM/state/disassembly/executable/full-tail audit/old audio or scenery replacements. Backup, install in order, compile/playtest and confirm.
