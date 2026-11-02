# Victory owner — connected draft source contract

**Source only. Do not import yet.** The uninstalled combat adapters still need
the final custom weapon screen/music/demo and persistent unlock/return. Player
physics, defeat, acquisition/teleport and approved finite audio now have owners. There is deliberately no installation ZIP for this checkpoint.
Accepted entrance/flash/shutter/E-Tank source is unchanged.

## Resource folder boundary

Create scripts eventually under `Scripts > MM1 > Cut Man > Victory`:
`init`, `start`, `step`, `busy` have full `scr_mm1_cutman_victory_` prefixes.
They use GMS1.4-compatible scalar instance fields/arguments, no structs/arrays of
structs, no GMS2 APIs and no obsolete variable-existence functions.

## Ownership contract for the integration (not instructions to install now)

- Boss Create calls `scr_mm1_cutman_victory_init()` once.
- The lethal-hit adapter first latches `cm_defeat_pending`, disables AI/cutter and
  prevents later contacts, then invokes `start(3200)` in the owner context once.
- Busy query is based on that immediate latch, not a later phase flag. Player,
  charge/fire, pause-open, terrain hazards and combat spawners must respect it.
- One central active-update owner calls `step` with the shared `combat_tick`.
  Actors/effects must not run competing Step clocks. Draw is read-only.
- Start event1 stops boss/charge audio through their OWN disposal helpers,
  removes existing shots without drops, and starts boss defeat effects.
- Only actual boss-body disappearance acknowledgement starts the first240-update wait;
  particles continue during that wait.
  Event2 starts approved stage-clear music once; another240 active updates precede
  event3 (centre walking). Native rendered offsets are not hardcoded timers.
- Movement bridge may act on `cmv_move`/`cmv_snap` **only when `cmv_advanced` is true**.
  Frozen/duplicate calls return no event and cannot move the player twice.
  MM5 gravity/collision continues under input lock. No fresh jump/fire/slide input.
- Existing slide/hurt/ladder state needs explicit handoff testing; do not merely
  set grounded=true, snap Y to floor or set full invulnerability on a timer.
- Event4 requests acquisition only after crossing centre and actual support.
  Event5 requests teleport only after real acquisition completion.
  Event6 requests our custom screen only after teleport completion.
- Acquisition/teleport/screen signals must belong to their CURRENT owner; stale
  signal values must be cleared on entry. No guessed animation timeout fallback.
- Event7, only after screen/demo finishes, requests persistent Rolling Cutter
  ownership/full weapon energy and stage-selection return. The receiver must
  write persistent ownership before changing rooms. No E-Tank grant or score.
- Cancellation event8 is terminal in every active phase, even while frozen. It
  disposes owned audio/effects and grants nothing. Destroy/Room End must clean up.
- The custom screen uses custom music, not native16. It demos Rolling Cutter;
  it skips MM6's password prompt. No invented graphics/music placeholders are
  silently integrated by these scripts.

## What is tested now

`node tools/rom-recovery/test-cutman-victory-controller.mjs` executes the actual
GML phase scripts through the repo's JS-compatible test approach: five centre
starts including exact centre/overshoot, supported versus airborne handoff, two
240-active-update waits,10,000 frozen updates, duplicate clocks, all eight abort
phases and one-shot reward request. This is **not** a GMS compile/playtest, nor
proof that the missing bridges or combat are installed.

## Player/hit bridge checkpoint

Source now calls `scr_mm1_cutman_victory_handoff(actor)` from the actual lethal-hit
adapter, after disabling combat. Boss Create includes the exact init field block.
The transaction starts phase1 once, locks/cancels player fire/charge/hurt/ladder,
preserves airborne Y/velocity, stops known charge and boss-music owners, and removes
projectiles. Actual central End Frame checks the latch both before world updates
and immediately after shots, avoiding same-frame terrain death/drops/spawns.

`player_move` retains the accepted player controller's vertical collision block
byte-for-byte through gravity (without keyboard-release cutting), existing wall
helpers and walk startup/animation. No keyboard simulation, forced grounded state,
fixed floor Y or repeated player Step. `player_tick` guards active clock/freeze.
A short slide is only expanded where standing fits; a blocked overhang holds
safely (arena currently has none). Momentum preservation across the final hit is
an explicit project adaptation, not a claim about native MM6 held-input handling.

Hook fragments are staged under `Hooks/`, NOT installed. The central phase/effects
coordinator is still missing, so there is not yet a runtime call advancing this
movement through victory. Boss defeat/acquisition/teleport art and animation-owned
completion flags, approved-audio playback ownership, custom screen/demo/music,
persistent reward/selection and Room End cleanup still need connection. Do not
install this checkpoint by itself: it would stop at the defeat phase.

Tests now also execute actual `player_begin`, `player_move`, `player_tick`, the
real lethal-hit transaction and central late-hazard guards. Native entrance probe
was regenerated, unblocking the16-group live combat adapter regression; it passes.

## Phase/movement coordinator now wired in draft source

`player_step` combines the existing phase core with the already implemented
`player_tick`/`player_move` helpers, using the shared combat clock. Its hook replaces
the old lock-only Step hook; it must be called after combat begin and before all
normal player input. Do NOT also advance phases/movement from camera/actor Step.
The canonical combat/handoff scripts remain the only final-hit transaction.

Owner Create/init now defines completion flags and serialized phase-entry requests.
Handoff publishes event1 once. Coordinator publishes subsequent entry events with
`cmv_entry_serial`, clears each incoming animator's stale completion flag, and
runs MM5 gravity/walking once in phases1..5. Centre crossing commits X before a
same-call acquisition transition; otherwise the MM5 stride can overshoot by1px.
Frozen/duplicate calls do not move, advance waits or replay an entry event.

The receiving defeat/acquisition/teleport/audio/custom-screen implementation still
must consume each entry serial and set its own completion flag. The coordinator
does NOT fabricate those flags, play placeholder audio, grant inventory or change
rooms. Without that receiver it intentionally waits at defeat, so this remains
uninstallable. This extends, rather than replaces, the earlier player bridge.

`test-cutman-victory-coordinator.mjs` runs the actual phase/player/motion scripts
with the real wall/support helper GML against rectangular geometry. Defeat-FX
completion is a disclosed mocked signal. Airborne momentum settles, clear waits
advance, off-centre walking reaches exactly3200, duplicate/frozen updates do not
move, acquisition entry is serialized once and cancellation cannot award a weapon.

## Owned victory audio receiver

`victory_audio_step` now consumes phase-entry serials from the sole coordinator.
Event2 starts the approved clear WAV exactly once. Acquisition entry does NOT
start its sound: the connected animator raises `cmv_acquisition_sound_requested`
at energy-circle onset, and the receiver plays it once in phase6. Native F0
ends it219 active updates later, before descent; event5 also stops it defensively. Events7/8 dispose owned voices even while frozen.
Freeze/resume affects only these voices; Room End/Destroy hook is idempotent.
No global stop-all, native16 screen-music fallback or audio-based animation ack.

Future GMS sound resources (not imported yet):
- `snd_mm6_stage_clear` from approved `snd_mm6_stage_clear.wav`.
- `snd_mm6_weapon_acquisition` from approved
  `snd_mm6_weapon_acquisition_review_excerpt.wav`.

Preserve the approved PCM/gain: use sound volume1, do not multiply another2x.
Both are finite nonlooped sources. The acquisition excerpt is the approved timed
window, not a seamless loop or natural-tail claim. Custom screen music is still
uncreated and the receiver deliberately contains no placeholder for it.
The acquisition animator must synchronize onset/stop and report real completion;
the source animator now owns this synchronization. Installed audio/GPU acceptance
is still pending.

## Native-derived boss defeat burst connected

Recovered six original MM6 burst images from the native Tomahawk defeat, using
40 single-particle OAM/CHR/palette fixtures. Every opaque exported pixel matched
its native rendered frame. `Art/spr_mm6_boss_defeat_strip6.png`: six32x32 cells,
origin16,16. Future resource folder `Sprites > MM6 > Victory`, resource name
`spr_mm6_boss_defeat`. No independently stepping/colliding projectile objects.

Sixteen original direction/speed vectors (eight each table selector5/9) were read
from supplied ROM data and independently executed through native6502 E61A in the
test. The visual owner uses256-fixed-unit velocities with fractional GML positions.
It is an adaptation of native update/render scheduling: no NES scanline sprite
limit/flicker, actor allocation order or exact hitstop emulation claim.

IMPORTANT corrected acknowledgement semantics: the native boss-disappearance
starts the pre-clear wait while burst particles are STILL moving. Therefore
`cmv_defeat_done` now means body disappearance acknowledged, NOT all particles
finished. `defeat_step` starts the burst and acknowledges that actual body removal;
it continues moving/culling visuals during subsequent waits/walking. Waiting for
all particles first would incorrectly add another long pause before clear music.
The ordinary boss Draw checks defeat BEFORE drawing body/cutter, so stale combat
art never remains visible. Its defeat Draw is read-only, cannot hurt the player,
never creates enemy explosion/drop objects and cannot award items.

The combined coordinator test now runs the real defeat owner: its earlier mock
completion acknowledgement has been removed. At that earlier checkpoint acquisition/teleport/screen still lacked owners. The
next checkpoint below connects acquisition/teleport; the custom screen remains open. No new defeat
SFX imported; approved audio bytes and accepted entrance remain unchanged.

## In-room acquisition and teleport source owner connected

`recover-mm6-inroom-victory.mjs` continuously replays the verified original-ROM
1021 snapshot through1418, without game-RAM, ROM, CHR or palette edits. It exports
frames1076..1418:343 updates,62 unique8x8 tiles. Exact native OAM HUD bars are
excluded; scenery is never copied. Flips, palette, overlapping OAM order and
per-scanline sprite-overflow masking are retained.212027 visible opaque pixels
matched native output inside JSNES's default8pixel TV crop; exported source edges
remain uncropped. Not a run of Mesen.exe or GMS acceptance.

Future sprite resource: `Sprites > MM6 > Victory > spr_mm6_inroom_victory_tiles`,
`Art/spr_mm6_inroom_victory_tiles_strip62.png`:62 cells of8x8, origin0,0, alpha,
no smoothing/resizing/cropping. This small tile strip plus packed draw data avoids
343 oversized fullscreen sprites. Script resources remain under the MM1 Cut Man
Victory folder: `victory_anim_data`, `victory_anim_enter`, `victory_anim_step`,
`victory_anim_draw`, `victory_player_draw` (all full `scr_mm1_cutman_` prefixes).
These are staging boundaries, NOT a partial-install request.

The sole coordinator calls animation Step before core phase Step, and entry after
core, before audio. Entry4 records the actual centred, supported player anchor.
MM6 reference128,180 maps to that anchor (normally3200,900; floor912), without
moving the collision body or forcing Y. Native MM6 acquisition/teleport poses
replace the MM5 character Draw during this scripted interval only. No second
player/physics/projectile object; normal MM5 art/motion remains in phases1..5.

- Phase6 displays native1076..1357, indices0..281.
- Energy-circle sound request at index54/native1130; approved5F only.
- Stop at index273/native1349:219 active updates after onset, before descent.
- At index282 the animator acknowledges acquisition; event5 enters teleport at
  that same continuous index/native1358, not a restarted animation.
- Phase7 displays indices282..342/native1358..1418, including the genuine blank
  pre-screen tail after beam departure. Next update acknowledges teleport and
  requests the custom screen. No guessed timer replaces a missing animation.
- Freeze/duplicate ticks do not consume a frame; Draw never advances animation.
- The player Draw guard suppresses only the ordinary character block, keeping
  HUD/debug/startup. Custom-screen phases keep the arena player hidden.

Native3A jump/teleport dispatches are recorded for research but NOT imported or
played: only5F received approval for this part. Approved WAV bytes unchanged.
Custom-screen completion stays false: no reward or scene return fabricated.
`test-cutman-inroom-victory.mjs` checks every packed GML Draw frame against the
recovered commands. The combined coordinator test now runs actual acquisition,
teleport, audio, phase and collision code through phase8, then holds1000 updates
without invented screen completion. GMS compilation/rendering/listening pending.

## Persistent-session reward/return receiver staged and gated

`scr_mm1_cutman_victory_reward_return(cancelled)` is now called by the sole
coordinator in phase9 ONLY. It additionally requires screen completion and the
once-only reward request, rejects cancellation, and waits safely for the existing
`obj_mm5_pause_state`/ready inventory. It never creates or resets the inventory.
Actual custom-screen completion remains unimplemented/false, so this receiver
cannot grant anything prematurely in the current draft.

On the first grant: existing `global.mm5_pause_owned[1]` (R.CUTTER) becomes true;
a newly owned Cutter receives28 energy; `global.mm1_cutman_cleared` becomes true.
An already owned Cutter retains its current energy (no repeat-clear refill).
No E/W/M tanks, lives, other weapons/energy, Balancer, or E-perch flag change.
`cmv_return_started` is latched before owned-audio disposal and the request to
`rm_mm1_stage_select` (the established room name in docs/mm1-observation-plan.md).
Duplicate coordinator calls cannot grant/transition again.

Future new-game-only boundary: append
`Hooks/scr_mm5_pause_inventory_init_victory_append.gml` after the accepted E-Tank
flag in `scr_mm5_pause_inventory_init`. Stage-entry false exits above the append;
only explicit new game clears the completion flag. No accepted E-Tank source was
replaced in this checkpoint. This is persistent SESSION state using the accepted
persistent inventory object, NOT a new disk-save system or stage-select cleared
marker implementation. Stage-select visual acknowledgement remains to connect.

`test-cutman-victory-reward.mjs` executes actual GML grant/return and the exact
append combined with accepted full inventory initialization. It covers every
pre-screen phase, abort/cancel, missing-state retry,600 duplicate calls, preserved
inventory/lives/tanks, no repeat refill, new-game vs stage-entry reset.

## Custom music audition draft (not integrated)

`Audio/Custom Review/rolling-cutter-weapon-get-original-draft.wav` is an original
8bar/12.8second150BPM four-voice composition, generated deterministically by
`compose-rolling-cutter-screen.mjs`. Two pulses, triangle bass and noise percussion;
no native16 fallback, ROM music transcription or sampled ROM audio. This is an
offline NES-style software synth, not APU/hardware emulation. Metadata/hash and
score are in `Reference/custom-weapon-get-music-draft.json`.
Listening approval is required before production playback. No existing approved
WAV bytes, gains or sound resources changed. Screen/demo still unimplemented.

## Current production direction — MM5 music / custom MM6-adapted screen

User reversed the custom-music choice. Use original **Mega Man5 GET weapon music**
with a **custom adaptation of Mega Man6's weapon-get screen**, keeping the Rolling
Cutter demonstration. The original custom action track is superseded and must
not be integrated. Retain its files only as review/approval history.
`Reference/weapon-screen-production-direction.json` is the current specification.
MM5 music must be identified in its actual native weapon-get scene and recovered
from the supplied ROM; listening confirmation remains required before playback.
The preceding defeat/clear/centre/acquisition/teleport flow, approved13/5F audio,
no-score policy and separate E-Tank reward are unchanged.
