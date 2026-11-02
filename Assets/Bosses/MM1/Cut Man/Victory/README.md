# Cut Man victory — connected source work and research history

**Current status: connected combat/victory draft source, NOT an installable package.**

Defeat, centre walking/landing, native-derived in-room acquisition and teleport
have source owners and executable GML-adapter tests. Custom Rolling Cutter
screen/music/demo, persistent unlock/return and GMS runtime acceptance remain.
Sections below retain the chronological research/implementation history; later
corrections supersede earlier candidates and remaining-work lists.

The user approved implementing the final hit as part of the upcoming Cut Man fight:
MM6-based defeat/clear sequence, automatic movement to the room centre, weapon-get
animation, then a custom new-weapon screen and custom music, retaining an MM6-style
new-weapon demonstration. Award Rolling Cutter.
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

## Historical initial work plan (later checkpoints below supersede this list)

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

## Audio identification correction — authoritative current status

User correction: **“only the stage clear music is correct”**. The supposed weapon-get
music is the MM6 boss-introduction music after stage selection. User suspects the
flash effect is Wily-castle lightning but explicitly isn't sure. Do not treat that
suspected61 identity as confirmed.

### Approved

`Audio/Approved/snd_mm6_stage_clear.wav` is the byte-identical approved13 review.
SHA256 `7cee112f16574979b772e94ea175a5957987dfd33a3456d9336921df580020ad`.
`Reference/stage-clear-approval.json` preserves the user confirmation independently
of regeneration. No gain/trim/content change. Runtime integration still pending.
The approved Cut Man throw25 is unaffected; rejected26 remains absent.

### Withdrawn from the victory plan

-10: `Audio/Research/mm6-stage-intro-reference.wav`. User identified this as the
  stage-selected boss intro, NOT the requested post-boss weapon-get track.
-61: `Audio/Research/mm6-cue61-unidentified-reference.wav`. No longer labelled an
  acquisition effect; identity unverified. Not approved. Possible Wily lightning
  is a hypothesis only. Do not install it for the victory sequence.
-27: `Audio/Research/mm6-stage-intro-text-tick-reference.wav`. Its source is stage
  introduction typing, not post-boss weapon-get evidence. Existing approved blocked
  hit cue27 remains untouched, but its presence in stage intro does not establish
  a weapon-get text tick or justify adding one there.

The wrong takes have been moved OUT of the approval Review folder into Research.
Historical immutable GitHub links may retain their old misleading filenames; those
labels are withdrawn. No new approval is being requested for these archived takes.

### Why the earlier evidence was insufficient

The controlled453-frame3C:80C5 coroutine is the boss-introduction screen, NOT the
requested weapon-get sequence. Its Blizzard profile/stats display was visible in
the captured renderer output; the assistant incorrectly classified that context.
Checking that the source calls10/61/27 and exporting those commands correctly does
NOT prove they belong in the requested victory scene. Byte/driver/audio tests only
proved command execution/export integrity, not the scene identity claimed.

The453-frame timings, flash calls51/71, text ticks276..356 and full-screen profile
must NOT define the planned victory flow. All those victory/acquisition timing
claims are withdrawn. Original stage-clear13 and the independently audited native
centre-walk routine remain separate evidence; neither validates the wrong screen.

`probe-mm6-stage-intro.mjs` is renamed to state its actual research scope. It uses
a controlled native coroutine0 scheduler restart at80C5/banks3C/3D, original
Blizzard stage0 and original rendering afterward. Output is now named stage-intro,
not weapon-get. Final RTS termination remains a fixture-only scheduler exit.
`recover-mm6-victory-audio.mjs` now reproduces ONLY approved stage-clear13; it cannot
silently recreate the wrong victory candidates or erase approval. Its silence/
full-APU/no-clipping/exact-approved-hash checks remain. The archived report retains
original waveform hashes and the now-correctly-labelled stage-intro trace.
`test-mm6-audio-identification.mjs` verifies export integrity AND rejection/status
records; it does not claim to identify the missing weapon-get music.

### Next evidence required

Trace the REAL final-hit/clear/auto-walk/acquisition/weapon-get path and its callers,
not another guessed screen entry or soundtrack number. Visually verify the actual
weapon award screen, capture its naturally requested audio and independently
extract that command for listening. Do not offer a replacement music/flash take
until that context is established. Actual weapon-get track/effects are unresolved.

No victory controller, resource import or complete stage package has been issued.
Final-hit owner, MM5 controls/auto-walk, original defeat/acquisition effects,
correct weapon screen/music, Rolling Cutter unlock and return selection remain
unfinished. Keep working entrance/combat sources and approved audio unchanged.

## Scene-verified replacement music candidate (pending listening approval)

The controlled original-ROM entry at **3B:BD1B** now renders the actual weapon
award: frame320 says **YOU GET B.ATTACK**, followed by a native weapon demonstration.
See `Reference/mm6-weapon-award-you-get.png` and `Reference/mm6-weapon-award.json`.
This is distinct from the withdrawn stage-intro fixture. Its native audio dispatch
is **16hex music**, **65hex effect**, then **37hex text ticks**; later demonstration
shots request23hex. No new effects have been exported or approved.

`Audio/Review/mm6-weapon-award-music-review.wav` is a **29.9555-second excerpt**
(full native APU, 48k mono16, gain2.125, unclipped peak0.844572). The track continues;
this excerpt is **not a seamless runtime loop**. Approval is pending. Approved
stage-clear13 and throw25 remain unchanged. Do not integrate this candidate yet.

Reproduce with `probe-mm6-weapon-award.mjs`, then
`recover-mm6-weapon-award-audio.mjs`; verify with `test-mm6-weapon-award.mjs`.
The fixture restarts coroutine0 from a playable snapshot, maps banks3A/3B, sets
stage0 and06A5=0, and terminates the final RTS via C5E6 because there is no fixture
caller. No ROM/code/audio injection in the scene. This **does not** establish a
natural boss-kill caller chain, complete victory timing or airborne MM5 behavior.
Those remain outstanding, along with the runtime controller and installation.

## Weapon-get music approved

User confirmed **“this is the one”** for the scene-verified16hex music preview.
`Reference/weapon-get-approval.json` records its unchanged hash; the exact preview
is preserved in `Audio/Approved/snd_mm6_weapon_get_review_excerpt.wav`.
This supersedes pending-listening status above, not the loop limitation: seamless
runtime preparation and integration remain outstanding. No new effects approved.

## Weapon-acquisition effect review

`recover-mm6-weapon-acquisition-effect.mjs` exports **65hex**, observed at frame97
of the verified BD1B award fixture, at the animation transition BD9D before text
begins at195. This is separate from text ticks37, music16, and withdrawn61.
`Audio/Review/mm6-weapon-acquisition-effect-review.wav`: 0.670479s, 48k mono16,
2x gain, no clipping, natural tail followed by silence. Provenance and native
sound dispatcher checks: `Reference/mm6-weapon-acquisition-effect.json`.
**Listening approval pending; no runtime integration.** Music approvals unchanged.

## Correction: requested effect is BEFORE the weapon-get screen

User rejected65: they mean the in-room sequence after centre walking, before the
YOU GET screen.65 remains unapproved; its prior candidate interpretation is withdrawn.

Following F9B4 installs player continuation38:9145. This continuation requests3A
at9167, launches the player upward, then requests5F at91A7 when vertical velocity
is nonnegative and Y>=78hex, spawns four animated entities, waits, then requestsF0.
`probe-mm6-pre-award.mjs` runs that original actor continuation using a disclosed
x128/y180/stage0/06A5=0 fixture in natural stage geometry (NOT a natural boss kill).
Observed3A frame0,5F frame55,F0 frame274; transition reached275.
`Reference/mm6-pre-award-energy-animation.png` shows the player/energy circles;
trace is `Reference/mm6-pre-award-trace.json`.

`Audio/Review/mm6-pre-award-energy-animation-review.wav` is5F, full native APU,
2x gain, no clipping. **Timed219-update excerpt, NOT a natural-tail or loop claim**:
the native scene interrupts it withF0. Listening approval pending.3A is separately
observed at the start, not silently combined with5F. Approved music unchanged.

## Pre-screen acquisition effect approved

User confirmed **“yes that one..”** for5F, the in-room energy-circle animation
effect after centre walking and before YOU GET. Exact preview preserved unchanged
in `Audio/Approved/snd_mm6_weapon_acquisition_review_excerpt.wav`; approval/hash
in `Reference/weapon-acquisition-approval.json`. This supersedes pending listening
status for5F above. Runtime timing/stop ownership remains to implement;65 remains
rejected and3A is not approved by this confirmation.

## Latest screen/music direction and sequence clarification

User explicitly chose **custom music** for our custom weapon-get screen, retaining
an MM6-style new-weapon demonstration. The previously identified/approved MM6
weapon-get music remains a reference, **not the production screen music choice**.
No custom music has been composed or integrated.

Original normal-stage order supported by supplied-ROM source and component probes:
final hit/defeat -> boss disappears -> pre-clear wait -> stage-clear13 -> neutral
wait -> centre walk -> landing/vertical-position check -> player9145 acquisition
animation (approved5F during energy circles) -> teleport routineDFB9 -> screen.
Important: stage-clear is NOT an immediate final-hit dispatch in MM6. F95A waits
for slot8 inactive, F964 loads240 updates (first8 stages), F97E requests13, then
another240-update wait precedes centring. These constants are source evidence,
not measured end-to-end onset times. User-described immediate music would be a
project adaptation, not exact MM6 timing. Full natural-kill/caller trace remains
unverified; do not claim complete end-to-end runtime validation.

## Linked verification requested by user

`probe-mm6-linked-victory.mjs` now runs continuously from the native player9145
continuation through energy animation, teleport, **the real main-scene caller**,
weapon-get screen and weapon demonstration, returning to the real caller. No
second scene redirect or fake RTS termination. Captured/asserted order:

- frame0: actor9145; frame55: approved5F energy effect;
- frame274: nativeF0 stops effect; frame275: actualDFB9 teleport routine;
- frame308: teleport reaches offscreen-exit branchDFF3;
- frame330: main flow reachesBD1B award; frame338: native16 music;
- frame705: demo setupBE42; shots791/855/919/983; frame1120: returnBEA9.

These offsets are relative to the **controlled acquisition entry**, not final hit.
See `Reference/mm6-linked-victory.json` and `mm6-linked-victory-demo.png`.
The supplied ROM bytes additionally link F9B4->player9145 and player9237->DFB9.
The earlier clear/centre byte audit still applies. A complete **natural boss kill
through clear and centre** has NOT been captured. An attempted F95A manager fixture
in starting-stage geometry killed/reset the player and was discarded; it must not
be presented as successful end-to-end verification. Implementation remains pending.

## COMPLETE CONTINUOUS SEQUENCE VERIFIED (supersedes remaining trace gap above)

`probe-mm6-whole-victory.mjs` now uses the **actual Tomahawk true-boss room**:
controlled native checkpoint restartCD4C, stage5/room1F. The original engine loads
room geometry, artwork, boss entrance/HP fill, actors and scheduler. At frame360,
BEFORE firing: bossHP=0 (native signed one-hit health), playerHP=27, playerX=80.
Normal B button presses create real projectiles. Optional A480..500 tests airborne.
No game RAM, code, sound, scene, timer or physics patches after the lethal hit.
Controls released on lethal HP write; one Start2500 dismisses the native password.
This is not an unassisted stage playthrough; it IS a continuous native final-hit
through stage-selection trace, without stitching or post-defeat entry fixtures.

Both grounded and airborne/off-centre runs pass. Airborne native last hit occurs
frame498 at X65/Y129 (grounded run Y180), damage1 subtracts native HP0 toFF in
**31:9A15**, not the separate genericEF99 path previously audited. Boss slot8
becomes inactive at501; native manager proceeds throughF964 at502.

| Observed event | Frame in both runs |
| --- | ---: |
| Lethal projectile damage | 498 |
| Stage-clear13 request | 780 |
| Centre walk begins, X65 | 1021 |
| Centred X128; acquisition continuation | 1076 |
| Energy animation / approved5F request | 1130 |
| TeleportDFB9 | 1358 |
| Teleport offscreenDFF3 | 1397 |
| Award screen entryBD1B | 1419 |
| Native weapon demonstration setupBE42 | 1854 |
| Demo returnBEA9 | 2269 |
| Stage-select entryF05E after Start2500 | 2520 |

These are emulator-frame observations for this controlled Tomahawk fixture,
NOT universal constants or acoustic onset measurements (sound emulation disabled;
native dispatch logged).240-update source counters must not be labelled240 rendered
frames: this trace includes native hitstop/scheduling. Airborne player lands during
the post-defeat wait; walking starts after the clear-music wait.

**Additional native scene:** MM6 displays its PASSWORD / STAGE SELECT / CONTINUE
prompt after the weapon demo. Our agreed custom flow can skip that prompt and
return directly to our stage selection; that is a deliberate adaptation.
Our screen uses **custom music**, not native16. No custom music is created yet.
Immediate final-hit control-lock behavior is a project requirement, not established
by a trace that releases player buttons on lethal hit.

Evidence: `Reference/mm6-whole-victory.json`, seven native screenshots;
`test-mm6-whole-victory.mjs` validates both traces, actual lethal/caller ROM bytes,
scene order and screenshots. No ROM/save state distributed. No GMS runtime claim.

## Implementation started: phase-owner core (not installed)

`Scripts/scr_mm1_cutman_victory_{init,start,step,busy}.gml` implements the phase
contract in `CONTROLLER-CONTRACT.md`: defeat completion ->240 active updates ->
clear music entry ->240 active updates -> centre crossing/support -> acquisition
completion -> teleport completion -> custom screen/demo completion -> one reward/
return request. Duplicate ticks, freeze and cancellation have explicit ownership.
No audio, guessed animation art or fabricated custom music is imported by the core.

`test-cutman-victory-controller.mjs`:20 grouped actual-GML checks PASS.
`test-cutman-boss-hit.mjs`:261 existing actual-GML balance/latch checks PASS.
Attempted live-adapter regression is currently BLOCKED by missing ignored native
fixture `.work/cutman-boss-entrance/frame-473.json`; not reported as passing.
Combat is STILL uninstalled. Live handoff/player movement/charge and pause locks,
defeat/acquisition/teleport art, audio ownership, screen/demo/music, persistent
unlock and final installation package remain unfinished. Accepted entrance files
unchanged. This core is not a complete victory controller installation.

## Lethal handoff and MM5 player bridge connected in source

The combat hit adapter now synchronously calls the once-only victory handoff.
Boss Create carries initialized victory fields. The central combat End Frame exits
on victory both before ordinary updates and immediately after the lethal shot,
so later hazards/drops/refills/spawns cannot run on that frame. The transaction
locks the player, clears charge/hurt/ladder and removes shots; known charge and
boss-music owners are disposed without stopping unrelated audio.

New player bridge scripts preserve actual MM5 vertical collision/gravity and wall
helpers, with forced direction, supported landing and single-tick ownership.
Airborne momentum is preserved; no Y tween or false grounded flag. Player Create,
Step and pause-open hook fragments are staged, **not installed**. The movement
bridge still needs the central phase/effects coordinator before installation.

PASS:11 actual-GML player groups;20 phase groups; lethal-hit transaction/100repeat
checks plus actual central End Frame early-exit checks;261 hit/balance checks;
16 live combat adapter groups. Regenerated native entrance fixture resolves the
previous ENOENT block. Limited mocks are not GMS runtime acceptance. All visuals,
phase-coordinator/audio playback, custom screen/demo/music, persistence/selection
and final install package remain outstanding. No user installation action yet.

## Coordinator checkpoint

The draft player Step hook now calls `victory_player_step`, connecting the phase
core to the existing MM5 forced-motion bridge. This fills the missing phase/motion
caller from the previous checkpoint. New actual-GML combined test passes through
physical airborne landing, two active-clock waits and centre walking to acquisition
entry, including freeze/duplicate guards and abort. A same-call centre-snap bug
was caught and fixed before handing off to the acquisition animator.

The existing11 movement,20 phase,16 live combat-adapter groups and lethal-handoff/
late-hazard guards pass again after regenerating the missing entrance fixture.
Still NOT installed/packaged: effect/art/audio entry receiver, actual animation
completion, custom screen/demo/music, persistent award/return and final cleanup.

## Victory audio receiver implemented in source

Added owned finite clear/acquisition playback, serialized once-only dispatch,
freeze/resume and cancel/completion/Room End/Destroy cleanup. The player coordinator
calls it even when a terminal cancellation does not advance the movement clock.
The acquisition effect waits for an explicit **energy-circle onset** request, not
acquisition jump entry. It is stopped before teleport. Native16 music is never
used as a substitute for the requested custom screen music.

`test-cutman-victory-audio.mjs` passes actual-GML ownership/dispatch tests and checks
both approved WAV hashes unchanged. Combined coordinator test now also executes
the audio receiver and confirms clear playback once before the acquisition gate.
Existing handoff,16 combat-adapter and6 post-defeat safety cases pass.

Still source-only/uninstallable: defeat/acquisition/teleport art/animation owners,
custom weapon screen/music/demo, persistent unlock/return and full GMS playtest.

## Boss defeat visuals connected in draft source

Recovered native MM6 burst artwork (six images,40 renderer-matched fixtures) and
16 source vectors, verified by independently executing native6502 direction lookup.
The visual-only burst now replaces the boss/cutter Draw on defeat; it has no
collision, projectile instances or random drops. It advances on the shared clock,
respects freeze/duplicates, culls offscreen and clears on abort.

Corrected the disappearance signal: native pre-clear wait overlaps the moving
particles. The implementation acknowledges body disappearance at burst startup,
not after the last particle leaves, avoiding an extra unintended victory delay.
The combined phase/player/audio test now uses this real acknowledgement rather
than a mock. Native scheduling/flicker is not claimed identical.

`test-cutman-defeat-effects.mjs` passes artwork hash/40fixtures/16native6502 vector
checks and actual GML particle freeze/Draw/cull/cancel checks. Existing combat,
lethal-handoff, audio, coordinator and post-defeat safety checks pass.
Remaining: actual acquisition and teleport animation owners/art, custom weapon
screen/music/demo, persistent unlock/return, complete import package and GMS test.
Still no installable ZIP. Do not import this partial checkpoint alone.

## In-room acquisition and teleport connected (supersedes prior remaining list)

Native continuous replay yielded343 rendered updates and62 original8x8 tiles.
212027 opaque pixels matched native renderer output inside its TV crop; full
source edges remain uncropped. Native sprite-overflow flicker is retained, and
no HUD/background scenery is baked into the transparent artwork.

The real animation owner now handles the acquisition jump, energy circles,
descent/landing, teleport beam and blank pre-screen tail. The actual supported
player anchor stays fixed; only the scripted Draw follows native frames. The
ordinary MM5 body is suppressed during the scene, not duplicated underneath it.
Approved5F starts at native circle onset, stops219 active updates later at the
native F0 point before descent, and remains byte-identical. No unapproved native
3A sound has been added. No audio-based completion assumption.

Tests pass:343 actual-GML draw fixtures; combined player/collision/phase/audio
sequence through real acquisition/teleport acknowledgement to custom-screen
request; freeze/duplicate guards;1000-update screen hold without reward; existing
combat/lethal-hit/post-defeat harmlessness regressions. Native reference and
recovery tool included; no ROM or savestates distributed.

Still remaining: custom Rolling Cutter screen and custom music with MM6-style
weapon demonstration, persistent unlock/completion and stage-selection return,
final connected package/incremental installation instructions, GMS1.4 runtime
acceptance. Do not install this source checkpoint in isolation.

## Reward/return receiver and custom music audition draft

The coordinator now has a guarded phase9 receiver for actual future screen/demo
completion. It unlocks accepted R.CUTTER slot1 with28energy only when newly owned,
marks session completion and requests the established stage-select room once.
No tanks/lives/E-perch/other weapons change; repeat clear does not refill Cutter.
Missing persistent inventory holds safely; no reset-on-victory. The proposed
new-game-only flag append is tested against accepted full inventory initialization.
No disk-save format or stage-select cleared marker is claimed implemented.

Custom original music draft: `Audio/Custom Review/rolling-cutter-weapon-get-original-draft.wav`,
12.8seconds/8bars/150BPM, pulse/pulse/triangle/noise. Deterministic offline NES-style
synth and original score, not ROM music. Awaiting listening approval; NOT wired
into audio. Existing approved tracks/effects unchanged.

Remaining: custom Rolling Cutter screen and MM6-style demonstration, approval and
integration of custom music, stage-select completion presentation, final connected
install package and GMS runtime acceptance. The current production screen gate
still cannot complete itself, so no early unlock/return is possible.

### Custom music revision2 — listening pending

User found the first draft too cute/happy; it is not the production choice.
`Audio/Custom Review/rolling-cutter-weapon-get-determined-v2.wav` is the new audition:
D minor,144BPM, lower/sustained melody, reduced upper-register decoration, stronger
bass/backbeat. Original composition, no borrowed ROM melody. Generator and current
metadata now describe revision2; revision1 WAV retained only as review history.
No production integration or playback changes; approval still required.

### Custom music revision3 — driving action direction

User rejected revision2, then explicitly chose **driving action theme** when asked
about direction. Revision3 is a new riff-led composition rather than another
minor-key retune: repeated sixteenth-note hook, choppy low root/fifth backing,
syncopated bass and more prominent noise drums/fills.160BPM,8bars,12seconds.
`Audio/Custom Review/rolling-cutter-weapon-get-action-v3.wav` is audition-only;
metadata/score in `Reference/custom-weapon-get-music-action-v3.json`, reproducible
via `compose-rolling-cutter-action.mjs`. Revisions1/2 remain rejected review history.
No custom music has been approved or integrated; gameplay/approved audio unchanged.
