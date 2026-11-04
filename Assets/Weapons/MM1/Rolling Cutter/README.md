# Equipped R.CUTTER — incremental source package

Source integration complete; NOT yet compiled/installed/accepted in GMS1.4.1760.
Start from the user's accepted Cut Man victory/full-teleport installation, with
F8 test removed. No earlier stage/entrance/boss/audio reinstallation. No GMX is
available here: the ZIP supplies manual resource/event updates,not an edited game.

Read `Integration/INSTALL-GMS14.md`, then the acceptance checklist. Back up and
complete the entire update before Run; installing only the menu would leave an
unusable weapon. Work through the guide incrementally with the assistant.

## Connected behaviour

- Owned-only M.BUSTER/R.CUTTER selection; pause reopens on equipped slot.
- Switch applies after exact frozen IDs reactivate;clears charge/projectiles and
  rearms a held fire key. No blanket instance activation. E-Tank branch retained.
- Original M.BUSTER firing body remains byte-identical behind weapon dispatch.
- One Cutter at a time,one energy per successful emission,no hold auto-repeat,
  no charge,no zero-energy Buster fallback. Uses existing approved25 throw sound.
- Actual original PLAYER flight model,not Cut Man boss AI or victory playback.
  Outward42-update curve,current-player accelerating homing and native byte catch.
- Sole shared combat clock;no independent projectile Step/End Step/Collision.
  Pause and health/weapon refills freeze flight. Switch/death/route/victory/room/
  owner-loss cleanup,including disposal after a paused room exit. Once-per-tick guard prevents duplicate camera updates.
- Draw-only grey/white MM5 player palette through movement,shooting,slide,ladder,
  hurt and arrival;skin/white flashes/alpha/shapes/padding/origins unchanged.
- All FOUR native player projectile phases,5 active updates each. Dedicated live
  art includes EC/ED as well as EE/EF;does not change accepted fixed victory demo.
- Native C enemy damage values normalized into accepted MM5-stage HP:Battery and
  Screw die in one accepted hit;Super Cutter and Big Eye take1 normalized HP.
  Closed Beak/Shell are ignored,not Buster-deflected. Projectile survives hits.
  Shell respawn70-tick wait and one existing explosion/drop pipeline retained.
- Cut Man takes1,retains63-update blink;lethal latch immediately destroys Cutter
  and hands off to unchanged accepted victory. No body/projectile harm afterwards.
- Equipped energy HUD at8,25 and matching pause capture. Energy drops+2/+10 refill
  using accepted one-bar/four-update/final-wait policy and existing refill sound.
  Buster does not silently refill Cutter. W/M tanks and Balancer remain deferred.

## Native proof vs hybrid policy

USA ROM SHA58fb9ef0c14c2947332929b9330d56c38a78040fd388274c39efd84e8d5446c7.
16,000 actual-GML manager comparisons against original bank5:A393..A464 and
unmodified native aim helpers;72 complete natural throw updates match exact
fractions/speeds/catch.160 native CPU enemy-damage cases;native halfsize8/8.
Projectile art:296 opaque pixels independently native-render matched across all
four original poses,converted to the already-used Mesen palette.

Collision is an explicit MM5-world adaptation,NOT a complete MM1 enemy-hit-state
port:one accepted hit per contiguous target overlap,may hit again after separation.
Closed/blinking targets do not arm the latch before becoming vulnerable. Flight
is clipped to the active256x240 camera band and ignores terrain. Current simulation
position is rendered rather than emulating NES one-update OAM latency. No claim of
whole-game1:1 fidelity,GameMaker compilation,real deactivation/audio/GPU acceptance.

## Tests

- `test-player-cutter-manager.mjs`:16k native CPU comparisons.
- `test-player-cutter-flight.mjs`:72 natural updates(actual GML).
- `test-player-cutter-equipment.mjs`:166 equipment/menu/input mock cases.
- `test-player-cutter-combat.mjs`:160 native CPU +123 GML world/contact/refill cases,
  including complete shared-world throw with zero remaining energy,boss latch,
  closed-target opening inside overlap and idempotent map disposal.
- `test-equipped-cutter-palette.mjs`:13 complete pixel/sprite-map checks.
- Existing accepted victory handoff/in-room/controller suites still pass.

Reference JSON documents source evidence and bounded mock scope. Neither source
checks nor source completion equals the user's installed runtime acceptance.
