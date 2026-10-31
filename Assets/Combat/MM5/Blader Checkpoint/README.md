# Blader combat checkpoint — IN PROGRESS, do not install yet

## User-authorized target

Script-spawned MM1 Blader movement/art; MM5-style player contact hurt/recoil and
protection; normal/mid/full buster damage and enemy death; approved MM6 hit cue
for both normal/charged impacts; MM5 enemy drop selection; collectable health
(+2/+10 capped28) with MM5 incremental refill sound and world pause; extra life
(+1 spare life, max9). Keep weapon-energy drops in the table but defer their
refill effects until special weapons exist. Fixed stage pickups/tanks remain separate.

## Completed foundation, not a playable integration package

- `Scripts/scr_mm1_blader_ai.gml`: actual GMS1.4 movement kernel executed through
  syntax adaptation against all1023 previously recorded original CPU entry/outcome
  pairs, including globalY+1920 adaptation and eight-bit Y wrap. Original AI is
  preserved, not substituted with sine motion or a continuously homing dive.
- `Scripts/scr_mm5_enemy_drop_from_byte.gml`: native selector tested on all256
  original input-byte outcomes. The eventual RNG owner still needs integration;
  this function does not claim to reproduce the whole native RNG state sequence.
- `Scripts/scr_mm5_recoil_dx.gml`: stored-facing recoil and counter-steering, six
  input/facing combinations. Collision sweep and state ownership remain separate.
- `Scripts/scr_mm5_health_refill_tick.gml`: incremental health kernel, cap28,
  immediate first bar and four-update cadence, including final wait. Tested on
  eight amount/starting-health branches. Caller must restart only its own refill
  sound voice and resume gameplay on the frame the final wait reaches zero.
- `Art/spr_mm5_megaman_hurt_strip2.png`: original MM5 standing/air hurt body and
  flash poses,32x40 cells/origin16,16/canonical right. Every opaque pose matches
  native renderer pixels. Separate initial stars are NOT part of this strip.
- `Reference/native-health-refill-freeze.json`: original native collection of
  both health sizes with a second dropped-item lifetime as freeze witness.
  Hold Right+Jump+Fire from frame3: player position, charge counter38hex and
  witness lifetime stay frozen. Small +2 sounds at2,6 and resumes10; large +10
  sounds at2,6,...38 and resumes42. Native sound26 is requested once per bar.
- `Reference/native-hurt-state-boundaries.json`:12 controlled initializer trials
  (incoming state normal/air/slide/ladder × neutral/fresh-fire/fresh-jump).
  All execute27 hurt updates. Charge stays zero and no new shots are emitted
  during hurt. Slide saves/restores state2 and uses terrain selector4. Ladder
  state3 is NOT preserved; damage initializer saves normal state0. Thus the
  future controller must detach a hit climber, not snap them back to the ladder.
  These substitute the incoming state byte at the ORIGINAL nonlethal initializer
  after natural tiger-contact HP subtraction. They are NOT naturally reached
  ladder/slide impacts or a full wall/ceiling/ladder-mouth boundary matrix.
- Audio recovered at `Assets/Audio/Mega Man/MM5/Combat/`: native hurt1C and
  refill26, full APU recordings plus silence-only trimmed versions. No approved
  firing, charging, stage, gate or MM6 hit files changed.

## Blader ROM results

`Assets/Enemies/MM1/Blader/Reference/native-blader-combat.json`:

- Original generic enemy life20, original normal buster damage20 for Blader.
  **One normal hit kills it.** Intended hybrid logicalHP1/normal1/full3 preserves
  that threshold. Do not invent several hits merely because the health byte is20.
- Original contact damage **3**. The source is RockmanJ-based; its printed operand
  FEBD is NOT the supplied USA address. The USA instruction at PRG16235 actually
  reads FE89. Derive/verify the original operand, never use the J table address.
- Type fallback half-width8, half-height8. This does NOT finish all contact,
  projectile-shape, slide and exact boundary hitbox testing; art alpha isn't a mask.
- Native first spawn record `[01,10,4C,00]`: X272,Y76, type0. Natural Right trace
  spawns at cameraX17, when right edge reaches272; not a fixed21-update timer.
- Full original stage record list contains nine Bladers: page1 X16/64/80,
  page2 X56/112/128, page15 X96/144/160; Y76/140/92 for each triple.
  This is original stage-page data. Translate through the accepted multi-stripe
  stage geometry before script placement; don't use page*256 as globalX for page15.

## Still required before installation

1. Finish native projectile/body/pickup boundary checks, death/drop presentation and
   original hurt stars; validate damage interruptions against real project terrain.
2. Implement the object/controller event layer: scripted native spawn activation and
   respawn/despawn rules, deterministically ordered shot/AI/contact passes, health0
   safe death flow, and exactly-once death/drop selection. Keep full-shot piercing
   of low-HP targets from MM5, not automatic destruction on every impact.
3. Connect hurt/slide/ladder state transitions and draw overrides without replacing
   the existing accumulated player events; preserve charge release/input behavior.
4. Wire health refill's world lock into all gameplay updates, camera/route handoffs
   and pause opening, leaving music/GUI alive; do not strand actors with unmanaged
   instance deactivation. Refill sounds restart, not overlap a pile of one-shot WAVs.
5. Add pickup motion, collision/collection, expiry/blink and extra-life inventory
   award. Weapon pickup effects stay deferred; do not reroll them to health.
6. Package precise resource folders/events and test actual GML event sources with
   mocked engine scheduling. GMS1.4 compiler/runtime/visual checks require the user's
   local project; no GMX is available in this repository.

No new object has been placed, no existing gameplay event has been changed, and no
installation ZIP is offered at this intermediate foundation checkpoint. Kernel tests
are not proof that the complete requested combat system is installed or ready.
