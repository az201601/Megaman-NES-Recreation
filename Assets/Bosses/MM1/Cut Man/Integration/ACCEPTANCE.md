# Connected Cut Man — installed acceptance checklist

Source/package tests pass separately. The user has now confirmed the installed
victory sequence finishes, returns to stage selection and retains R.CUTTER in
the pause menu after stage re-entry; full teleport-out sound also confirmed and
F8 test block removed. See INSTALLED-VICTORY-ACCEPTANCE.json. Other checkboxes
remain pending unless individually reported; this is not blanket acceptance of
all combat/pause/death cases. Stop on the first failure.

## Compile and baseline
- [ ] Back up the accepted post-entrance project; apply entire guide, fresh run.
- [ ] No unknown resources, syntax errors, duplicate objects or uninitialized fields.
- [ ] Existing player movement/slide/jump/charge/white flashes, pause/tanks/lives,
      stage scenery, hazards, transitions and fixed E-Tank still behave as accepted.
- [ ] Existing one-column shutter/art/cadence and five wall flashes are unchanged;
      boss fill reaches28 and control returns on the accepted intro boundary.

## Fight and death
- [ ] One boss only. Fight starts only after existing intro-complete flag.
- [ ] Original walking/jumps/throw/return/hurt poses visible; no separately moving
      cutter object or doubled Step. Throw25 plays once per successful throw.
- [ ] Normal and partial shots deal1, full charge3; boss28HP. Boss absorbs shots.
- [ ] Body/cutter deal expected4 damage through MM5 protections, not MM1 spikes.
- [ ] Pause and E refill freeze AI, cutter, damage and animation consistently;
      resume does not double-step, desync sound, restart boss music or jump frames.
- [ ] Die/retry during fight: no lingering boss music/cutter, accepted life loss,
      E-Tank persistence and retry location preserved. No inventory reset/farming.

## Final-hit safety and in-room sequence
- [ ] Lethal hit while overlapping boss/cutter: immediate permanent harmlessness,
      including same-update collision. Repeat for normal/partial/full projectiles.
- [ ] No hazard/contact/spawn/charge/fire after victory lock, no random boss drops.
- [ ] Defeat effects finish body disappearance, stage-clear13 runs in correct order.
- [ ] Auto-walk reaches centre with normal support/collision, including airborne
      final hit and an initially sliding player; no snapped Y or ceiling clipping.
- [ ] Approved5F acquisition effect, landing and teleport finish in order; MM5
      normal character draw hidden only where needed, no doubled player/HUD.

## Approved custom/MM6-adapted weapon screen
- [ ] Blue/steel look, no top CUT MAN plaque or small weapon/menu card.
- [ ] Grey/white character, centre assembly/flash, rightward slide, continuous
      typing YOU GOT / ROLLING CUTTER, hold, portrait fade then small demonstrator.
- [ ] MM5 GET weapon music plays once at original unboosted volume; no short-take
      silence before screen finishes, no looping/restart, no old custom/MM6 track16.
- [ ] Two leftward Cutters with return/catch, two25 sounds (not repeated in Draw).
- [ ] No title overlap/texture seams/alpha artefacts; correct glyphs and subimages.
- [ ] Second real catch, final hold and exit fade finish before stage selection.

## Completion, cancellation and inventory
- [ ] First clear: Cutter slot1 owned, energy28, completion flag true; stage select
      once. Revisit preserves existing Cutter energy, no extra tank/life rewards.
- [ ] Stage E-Tank remains separate and cannot be farmed by death/return.
- [ ] New game resets completion/ownership via existing inventory owner; ordinary
      room entry/death never resets inventory. No persistence beyond session claimed.
- [ ] Room End/Destroy/abort during victory disposes only owned clear/acquisition/
      screen/throw voices, grants nothing prematurely, leaves no screen overlay.
- [ ] Re-enter stage after selection: accepted entrance works, no old fields or
      audio leak. General equipped-Cutter gameplay is a separate later task.
