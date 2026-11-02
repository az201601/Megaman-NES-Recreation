# Victory owner — first implementation checkpoint

**Source only. Do not import yet.** The uninstalled combat adapters still need
this owner connected to player physics, visuals, queued audio and the custom
weapon screen. There is deliberately no installation ZIP for this checkpoint.
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
- Only a real finished-defeat-effect signal starts the first240-update wait.
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
