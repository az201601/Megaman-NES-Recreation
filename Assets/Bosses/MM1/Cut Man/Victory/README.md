# Cut Man victory — approved scope and initial MM6 research

**Status: research checkpoint, NOT an installable victory implementation.**

The user approved implementing the final hit as part of the upcoming Cut Man fight:
MM6-based defeat/clear sequence, automatic movement to the room centre, weapon-get
animation, then an adapted new-weapon screen and MM6 music. Award Rolling Cutter.
Do not introduce score, CLEAR POINTS, or an MM1 victory flow.

The accepted entrance/flash/one-column shutter and E-Tank implementation remain
unchanged. Fight balance is explicitly **28 HP; normal/partial/full Buster 1/1/3**.
The optional stage E-Tank pickup is not replaced by a victory inventory grant.

## Evidence already checked

Source navigation: `refreshing-lemonade/megaman6-disassembly`, pinned revision
`f0763c46fad2bbcb45e4b8a2f759a10ee3c7c421`, `bank38_3F.asm`.
The disassembly is a navigation aid, not an executable replacement ROM.

`Reference/mm6-usa-source-audit.json` records nine exact supplied-USA-ROM byte
spans and 21 isolated native-CPU centring tests. Run:

```sh
npm ci --prefix tools/rom-recovery --ignore-scripts
node tools/rom-recovery/verify-mm6-victory-flow.mjs
```

The supplied ROM SHA-256 is
`86e069792addf21322355c245a0b155ba74e123b4a3eb9cd347175444569d122`.
No ROM/save state is distributed.

### Source sequence, not yet a complete rendered timing trace

- `3F:EF99`: original boss-hit code requests successful-hit command35 and subtracts
  damage. Native HP uses a signed convention: it branches on nonnegative rather
  than testing project HP==0. Do NOT copy that convention into the chosen28HP GML
  contract (final hit means project health reaches zero).
- `3F:F95A`: waits for native boss slot8 to disappear; source then initializes a
  240-update counter for the first eight stages (60 for later stages).
- `3F:F97E`: writes audio command13 to DC, calls the native update helper, then
  initializes another240-update wait. During the latter wait, clears live input
  and installs neutral forced controls each update. These are instruction constants,
  not a certification that rendered disappearance/music onset is precisely at
  those offsets from the final hit.
- `3F:F999`: invokes the original completion bookkeeping routine F4E7 before the
  normal-stage centring path. Project stage completion and Rolling Cutter unlock
  must use project identifiers, never native MM6 weapon/stage bit positions.
- `3F:F9C6`: compares the player's X with128. Left of128, forces right until X>=128;
  at/right of128, forces left until X<128. Then writes X=128. Even exactly128 takes
  one native left-update before snapping back. Do not mistake this for a timeout,
  teleport-only implementation, or a measured walking speed.
- `3E:D42A`: clears live controls and calls the forced-control helper. Native1/2
  directions are not project input key codes.
- `3F:F9A5`: following centring, neutral forced-control updates continue until
  player Y>=180; then source assigns0413=91/042A=45 and returns to the script engine.
  This establishes another vertical-state wait in source; it is NOT an airborne
  final-hit playtest or proof of how the MM5 player should be landed.
- `3F:FA0B`: preparation requests0C (or18 for stage0F). Keep that distinct from
  the later13 request; don't export/name all these cues 'stage clear'.

### What the isolated test actually executes

Original fixed-bank F9C6 centring instructions and D42A forced-input helper run in
JSNES. Only E468's frame/engine work is intercepted and replaced with disclosed
1/2/3-pixel deterministic horizontal strides. Tests cover starting X24,64,127,128,
129,192,232, verify direction/centre snap/stack restoration and removal of live
jump/fire/start bits. This tests the branch logic and crossing cases, **not** native
walking speed, elapsed game frames, collisions, audio or full cutscene playback.

## Remaining work before shipping

1. Finish original MM1 Cut Man AI/poses/Rolling Cutter/contact and chosen MM5 Buster
   integration. A zero-HP transition must be latched exactly once so simultaneous
   shots cannot replay music, duplicate rewards, or allow one last damaging cutter.
2. Probe an actual native MM6 final-hit-to-clear path, disclosing any checkpoint or
   HP setup. Trace explosion/palette/player/input/sound/script states and actual
   rendered frames. Distinguish final-hit SFX, defeat/preparation cue, clear music,
   acquisition SFX, and weapon-screen music; recover/listen to each before naming.
3. Follow0413/042A script handoff to the real weapon-get screen. Recover original
   art/font/animation and verify music/transition timings. Do not use credits or
   ending sequences merely because their music commands are nearby in this file.
4. Adapt automatic movement to the existing MM5 player physics/invisible solids.
   Room origin3072 gives centre worldX3200. Preserve subpixel physics while walking;
   suppress live movement/jump/fire/slide/pause/E use once victory owns controls.
   Cancel charge/charge-loop audio and surviving projectiles through their existing
   owners. Test grounded, airborne, sliding, hurt and charging final-hit cases.
5. Keep a single victory owner running after the combat boss is removed. Separate
   combat shutdown, music ownership, player auto-walk, acquisition animation and
   weapon screen; no return-to-fight or deadlock if the actor disappears early.
6. Unlock Rolling Cutter once and mark Cut Man cleared once. Preserve existing
   inventory/E-Tank collection persistence and life/health state; no random boss
   drops, score, or duplicate E award. Returning selection must reflect completion.
7. Ship GMS1.4.1760-compatible resources in folders, explicit object/event settings,
   exact incremental replacement boundaries, source tests and a GitHub-only ZIP.
   No GMS compiler/runner is available here; installed acceptance stays separate.

No new Sound, Sprite, Object, Script or event should be imported from this research
checkpoint. There is deliberately no Downloads ZIP until executable integration
and resource dependencies exist.

## Native weapon-get coroutine and audio approval checkpoint

**Still not an installable victory controller.** Original weapon-get path now
traced through453 original frames from an explicitly controlled entry, and the
requested music is available for listening approval.

`probe-mm6-weapon-get.mjs` begins with the naturally booted stage snapshot from
`probe-mm6-enemy-hit.mjs`, releases buttons, sets original banks3C/3D and bank shadows,
selects original Blizzard stage variant51=0, and restarts native coroutine0 at80C5
through scheduler fields21/29/2D/34/38. Original routines and PPU run afterward.
The final8275 RTS is intercepted ONLY after reaching the function end, terminating
the fixture coroutine through originalC5E6 rather than returning to a nonexistent
caller. This is NOT a natural boss kill or a complete final-hit-to-select trace.

Observed original events relative to this controlled entry:

-16: music10 dispatch (weapon-get).
-51 and71: acquisition-flash effect61 dispatch, matching its two original call sites.
-96: original preparation for the following profile/weapon-information screen.
-276..356 every8: eleven text-character ticks27 in the Blizzard fixture.
-372: final text wait begins.
-452: native weapon-get routine reaches its final RTS (453frames including0).

The first animation retains the current stage background; the Blizzard fixture's
following profile screen naturally contains Blizzard data/art, NOT approved Cut Man
stats or a completed project adaptation. Text duration will need adapting to the
actual Rolling Cutter wording. Never copy Blizzard stats into Cut Man or assume
this controlled-entry timing certifies the earlier boss-death/auto-walk phases.

### Audio auditions (approval pending, no imports)

- `Audio/Review/mm6-stage-clear-review.wav`: original13,3.35121s.
- `Audio/Review/mm6-weapon-get-music-review.wav`: original10,5.98123s.
- `Audio/Review/mm6-weapon-acquisition-flash-review.wav`: original61,0.70325s.
- `Audio/Review/mm6-weapon-screen-text-tick-review.wav`: original27,0.11990s;
  reference only. Same cue identity as existing accepted `snd_mm6_blocked_hit`;
  reuse that existing resource, do not demand a new approval/resource for the tick.

Only the first THREE are new listening approvals. The user was right that the
throw is the only new COMBAT effect;61 is separately confirmed in the approved
MM6 VICTORY sequence, not an extra Cut Man fight/appearance sound. Rejected26
remains absent. Native61 is requested twice20updates apart; the eventual audio
owner must restart its owned effect, not silently blend two independent full tails.

All48kHz mono16bit, full native APU/default channel panning averaged to mono,
music gain2.125 and SFX2x, no clipping. Exports retain command lead and natural full
tail; only exact-zero trailing silence is trimmed to10ms padding. All four commands
finish naturally within the long capture windows (15/20/5/4seconds), not arbitrary
music loops. Exact hashes, peaks, original driver dispatches and source-native
weapon-get trace are in `Reference/mm6-victory-audio.json`.

Reproduction:

```sh
npm ci --prefix tools/rom-recovery --ignore-scripts
node tools/rom-recovery/probe-mm6-enemy-hit.mjs
node tools/rom-recovery/probe-mm6-weapon-get.mjs
node tools/rom-recovery/recover-mm6-victory-audio.mjs
node tools/rom-recovery/test-mm6-victory-audio.mjs
```

Extraction uses the natural playable-stage snapshot (not the finished weapon-get
fixture), F0 stop plus an uncaptured native35 warmup to settle the known JSNES DC
residual, then verifies a full second of exact silence. Both mailbox queue and
original driver entry are traced: ONLY the requested command is dispatched during
each take. No ROM patch, channel mute, DC subtraction, synthesized notes, stitched
cues, fade, normalization or stretching.5 original-USA call spans, four WAV hashes/
formats/tails and controlled-entry event timing checks pass. No GMS audio/runtime
or user listening approval is implied.

Research pitfalls retained: redirecting the idle CPU with native task33=FF saves
continuations in the wrong slot; use the native scheduler entry fixture instead.
The completed weapon-get fixture did not produce isolated audio here, so do not
reuse it as the extraction source or equate a queued command with audible output.
The successful stage-snapshot takes independently assert nonzero audio and natural
release plus exact-silent tail.

Remaining implementation is unchanged: final-hit effects/control owner, original
pre-clear/post-clear waits, MM5 auto-walk/airborne handling, acquisition/profile
adaptation, Rolling Cutter unlock/clear persistence/return selection, then a complete
incremental GMS package. Do NOT install partial combat/victory resources yet.
