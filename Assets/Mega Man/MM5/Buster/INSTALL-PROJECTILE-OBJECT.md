# Basic projectile object — GMS1.4.1760 checkpoint

User confirms all corrected shooting sprites imported and accepts X for fire. Sound recording approved; sound-resource import not explicitly confirmed. Keep planned resource name snd_mm5_buster_shot. This checkpoint only creates the projectile object; firing/sound/pose/three-shot gate integration follows separately. Charging remains deferred.

## Object

Objects > Mega Man > MM5: create group Buster and object obj_mm5_buster_shot.

- Sprite: spr_mm5_buster_shot (already imported,8x8,origin4,3)
- Visible checked; Solid and Persistent unchecked.
- Parent none; Mask same as sprite/default. No collision events at this checkpoint.
- Do not place in a room.

Add Create > Execute Code: paste obj_mm5_buster_shot_create.gml.
Add Step > End Step > Execute Code: paste obj_mm5_buster_shot_end_step.gml.
**End Step, not ordinary Step.** Leave ordinary Step absent. No custom Draw, sound or collision events.

No player event changes. X deliberately does nothing until the next integration checkpoint. Do not change walking/jumping/ladder/slide/dust code, room speed or camera settings.

## Behaviour / evidence limits

Exact measured shot speed1075/256px per update; no inherited player speed, no gravity. Caller will choose +/-1 direction after Create. End Step owns motion (one movement phase after future player-Step creation); Create does not move. GMS1.4 event scheduling is not verified by the JavaScript mock; runtime check comes with firing integration.

Removal at horizontal reference outside active view0 (or room if no visible active view0) is a GMS camera adaptation. Standing original traces in static256px window last through update26, absent27, both directions; model agrees for original spawn144/113. This does not establish native scrolling, multi-view, all exact edge cases or damage/collision behaviour. Do not call entire prototype1:1. No arbitrary timeout or padded sprite-width cleanup. No enemy/terrain collisions/damage/charging implementation yet.

Validation: node tools/rom-recovery/buster-values.mjs (original ROM); node tools/rom-recovery/buster-gml-model.mjs (actual GML subset mocked, not GMS compiler/runtime). Test motion both ways, exact fractions, fixedY, flipped artwork, no automatic double motion, static lifetime, translated/wider view and invisible view fallback.
