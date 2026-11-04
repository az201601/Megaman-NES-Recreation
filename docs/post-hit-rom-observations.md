# MM1 / MM5 post-hit recovery — ROM observations

Measured 2026-10-28 using supplied USA ROMs and JSNES 2.1.0. This is reference work, **not an installed GameMaker controller**. Preserve MM1 Cut Man scenery/music; upcoming player mechanics remain MM5-based.

## Reproducibility and scope

Scripts and verification: `tools/rom-recovery/README.md`. ROM SHA-256:

- MM1: `58fb9ef0c14c2947332929b9330d56c38a78040fd388274c39efd84e8d5446c7`
- MM5: `32bd2b4ecd2129aa5337afe9171696ef35646d3fd597339aebba19221764521c`

Used naturally occurring enemy hits in Cut Man (MM1) and Napalm Man (MM5), then replayed identical snapshots with different inputs. Position includes fractional pixels. Controlled tests modify RAM protection/facing fields to isolate causes. No ROM damage routine was patched. JSNES is not hardware validation. Distinguish game logic updates from displayed/emulator frames: enemy activity can produce lag frames.

## Results

| Feature | MM1 | MM5 |
|---|---|---|
| Ordinary enemy contact while protected | Ignored | Ignored in hurt state and during subsequent protection timer |
| Protection bookkeeping | `$55` set to 111 (`$6F`) by nonlethal damage | Player state `$30 = 6` protects during recoil; `$05B8` is set to 60 when recoil ends |
| Observed repeat contact | HP falls at run frames 110, 222, 334: 112 displayed-frame spacing in this encounter | Controlled body-contact branch loses 6 HP without protection; no loss with timer active or state 6 |
| Horizontal recoil, clear path | 0.5625 px/update in the measured hit | 0.5 px/update normally; 0.25 when pressing against recoil |
| Left/right during recoil | No trajectory difference in first 29 post-hit updates tested | Can halve recoil; cannot turn it into free walking during hurt |
| Tested recovery boundary | Left/right first change position on update 30 after damage | Exactly 27 hurt-handler executions; ordinary directional movement resumes on next update |
| Spike contact | Fatal even with positive protection timer | Protected during hurt state / positive timer; fatal unprotected |

### Timing is not one shared animation timer

MM1 starts the protection/blink counter on the damage event. It continues after ordinary movement resumes. In the recorded run, the counter is 111 at the damage frame, 0 at run frame 221, and another enemy hit is registered on frame 222. Do not describe this as “unable to move for the whole flashing period.” Rendering checks bit 1 of `$55`; visible frames are still protected while the counter is nonzero.

MM5 has **two protection phases**. The hurt state itself blocks damage even though `$05B8` remains zero. Recovery writes 60 to `$05B8`; the animation/render update can decrement it to 59 before the end-of-frame snapshot. The same recoil required 27 handler executions in every tested input branch. It occupied 27 emulator frames holding Right and 28 with no direction/Left because the latter encounter included a lag frame. A fixed wall-clock lockout inferred from screenshots would therefore be misleading. At nominal 60 updates/second, 27 updates are about 0.45 seconds and 60 timer counts are about 1 second. Preserve the actual update order rather than replacing both with an arbitrary single timeout.

A held jump button alone did not create a jump during either hurt sequence. This does **not** establish fresh-press buffering, shooting acceptance, or every special movement-state transition.

### What “pushing/pulling” actually means

**MM5 is not simply “always push away from the enemy's position.”** Its hurt movement uses the player's stored facing flag (`$0528 & $20`) and moves opposite that facing. Replaying the same tiger contact with the facing bit reversed changes recoil from -0.5 to +0.5 px/update, while both branches lose the same 6 HP and the tiger remains on the same side. Thus contact while facing away can look like being **pulled toward the enemy**. No suction force or additional enemy displacement was needed.

The hurt handler sets horizontal speed to `$0080` (0.5). If the held horizontal direction opposes recoil, it changes that to `$0040` (0.25). In the leftward-recoil test:

- no direction / Left: -0.5 px/update;
- Right: -0.25 px/update;
- 27 unobstructed recoil updates: 13.5 px versus 6.75 px total displacement.

MM1 differs: the ordinary damage routine takes the damaging object's direction flag, inverts its `$40` bit for the player's hurt-facing flag, and then applies recoil. It is not a general “compare attacker X to player X” rule either. Flipping player facing before the same enemy contact did not flip the resulting leftward recoil; the damage handler replaced that facing. Holding Left or Right during the recorded recoil did not reduce or reverse its 0.5625 px/update motion.

These conclusions describe the ordinary damage paths tested, not every boss-specific attack, moving platform, conveyor, or scripted grab.

### Vertical response

In the MM1 recorded hit, reference Y starts at 148, rises to 144.25, and returns to the same support: a small hurt hop. First post-hit vertical displacement is -1.25 px, reducing by 0.25 per update towards the apex.

The MM5 tiger hit occurs in the air. The damage path resets vertical velocity to downward 1 px/update (`$03D8 = 0`, `$03F0 = $FF` in this engine's sign convention), rather than preserving the prior jump. First subsequent displacement is downward 1.25 px, then 1.5, 1.75, etc., until terrain stops it. Do not copy MM1's upward hurt hop into MM5. Grounded, ladder and slide interruptions still deserve dedicated boundary tests before the complete controller is implemented.

## Spike tests: distinguish natural and controlled inputs

**MM5:** Replayed an actual imminent spike contact at Napalm Man run frame 609. Without protection, HP 10 becomes 0 and state becomes 7. Setting only the protection timer to 60 preserves HP 10 on the identical contact. Pinning X to that spike contact prevents walking off: protection expires, and death occurs on test frame 61. A separate forced hurt-state branch also survives contact with timer zero. The pin is a test constraint, not proposed gameplay behavior.

**MM1:** Tested the original ROM's spike classification/death path with a controlled collision result, rather than claiming to have walked into a natural spike room. The player terrain probe writes collision classes to `$2A..$2C`; the test substitutes class 3 (spike) at the real probe write. With `$55 = 0` **and** with `$55 = 100`, execution enters the unchanged death routine at `$C219` in the first frame. The supplied ROM's `$D7BE: CMP #$03 / BEQ` leads to `$D7DE: JMP $C219`; the vertical-contact path at `$D7F1` has the same direct death behavior. Neither path checks `$55`. This directly verifies the spike exception in executable ROM code, but is explicitly a synthetic collision-input test, not footage of a naturally reached spike tile.

These results concern spikes, not pits, crushers, lava, or every instant-death hazard. Never infer “all hazards are safe while flashing.”

## Remaining coverage / implementation boundary

- Enemy-body protection is replay-tested independently of spike behavior. MM1 ordinary damaging-object processing checks `$55` before damage; MM5's ordinary damage entry checks both `$05B8` and state 6. An independently identified enemy-projectile encounter has **not** been replay-tested yet; do not label that part hardware/ROM-playback confirmed.
- Recoil direction logic and speed are tested and code-checked. A full matrix of boss attacks, ladders, slides, airborne/grounded impacts, fresh jump/fire presses, and frame-boundary contacts is not completed.
- The MM1 spike exception is a rule demonstrated here, not evidence of whether its developers intended it or made an oversight.
- Implement MM5 facing-based recoil, counter-steering and the separate hurt/protection phases when player work begins. Do not import MM1 spike bypass or an invented attraction force.

## Blader combat checkpoint follow-up

Controlled original initializer trials now cover incoming normal0/air1/slide2/
ladder3 × neutral/fresh-fire/fresh-jump. All27hurt updates; slide saves/restores2,
ladder detaches to0; no charging or new shots during hurt. These substitute the
incoming state at ORIGINAL nonlethal initializer after natural tiger HP subtraction;
not naturally reached slide/ladder geometry contacts. Recorded at
`Assets/Combat/MM5/Blader Checkpoint/Reference/native-hurt-state-boundaries.json`.
The manual GMS combat source/import package is now complete with rectangle-terrain
adaptations documented; native source tests do not certify every project wall,
ceiling/slide tunnel or the Windows runner. Local playtesting remains required.
