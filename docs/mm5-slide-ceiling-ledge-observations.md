# MM5 slide + overhanging ceiling + ledge — controlled ROM observation

## Status

User has confirmed ordinary slides, opposite-direction cancellation, fresh jump cancellation, Down+jump gating, low-tunnel timer extension/jump blocking/reversal, and open-ledge air handoff/landing sound/air control. Current crouched-fall fallback for a combined ceiling/ledge has NOT been validated. Do not change those accepted paths merely because this combined case differs.

`node tools/rom-recovery/slide-ceiling-ledge.mjs` executes the original USA ROM using JSNES2.1.0. It starts grounded and enters via real Down+A, rather than forcing slide state2. Original terrain lookups receive synthetic class10 for platform [16,80)x[160,176), floorY192, optional roof [48,112)x[128,144), class0 elsewhere. Hooks before original class-mask instructions C551/C659 preserve aggregation/movement/state routines. Eight neutral grounded updates precede input scheduling. Normal gravity asserted. No ROM code patched. This is not Mesen runtime, a hardware timing certification or a naturally reached stage encounter. Mesen colour matching is unrelated to this measurement.

Four schedules: open edge neutral; covered edge neutral; covered edge Right from update20; covered edge Left from update29. Entry update3; release Down/A update4. Results/queries/audio requests saved to ignored .work/slide-ceiling-ledge.json. Background logic remains active; sound requests are not isolated player effects.

## Asserted results

All four cases:
- Update27: state2, animation10hex (slide), X94.5, Y150.25, remaining timer1. Entry reference was148.25; native slide reference shifts+2.
- Update28: support loss ends slide before timer runs out; state0, animation04, X unchanged94.5, Y151.25 (+1). The support-loss path does not take the normal standing Y-2 restoration path.
- Update29: state1, animation07 (normal air), Y151.5 (+0.25). The reference remains at roof-overlap height. A roof does NOT preserve slide state/pose until standing clearance becomes available.
- Update43: state0, Y180.25 on lower floor.
- No hurt/death states in sample.

Open and covered neutral traces are identical for all48 updates. Under the roof, holding Right gives an X correction94.5 ->88.796875 on update29; pressing Left after release gives104.203125. These are observed native terrain-response corrections in this controlled geometry, NOT a guarantee of equivalent natural-stage clearance tolerances. Do not extrapolate to arbitrary global rectangle ejection.

## Difference from current GMS fallback

The existing script deliberately gates ending slide on `scr_mm5_player_can_stand` and, when unsupported/blocked overhead, moves downward while retaining small body + slide pose + slide-speed horizontal movement. ROM results contradict this as a native presentation/state rule: support loss overrides the grounded stand-clearance gate. Do not ask user to validate the current fallback as MM5-accurate.

Simply deleting the gate is NOT yet a safe integration change: the current normal GMS horizontal wall resolver snaps against an entire solid object's bbox. Restoring the tall body already underneath the ceiling and then moving horizontally can cause a large sideways ejection, whereas the ROM uses local terrain corrections. Its slide-relative Y and early fall velocity timing also differ from the accepted standing-reference adaptation.

Next implementation should be narrowly scoped to combined ceiling/ledge release. Address the falling transition and already-overlapping overhead probes together, with targeted model/runtime tests and no changes to the accepted ordinary slide/ceiling/ledge paths. Do not silently rewrite general wall collision or port native two-pixel shifts into all accepted mechanics. No GMS controller code changed at this research checkpoint; no new temporary room fixture has been instructed yet.

## Subsequent correction checkpoint

Implemented narrow support-loss release in slide script, retaining the previously accepted standing-reference fall1 handoff. It no longer waits for standing clearance to select air. Replaced the crouched-fall fallback with `slide_overhang_fall` grace; existing upper wall probes already overlapping the same above-reference solid are ignored only during that falling transition. Middle/feet/body walls and new upper contacts still block. This intentionally prevents global rectangular-bbox ejection rather than copying measured native local-grid correction coordinates. Grace clears after clearance/landing/rising/new slide. No Draw, palette or general physics constants changed.

Actual-script mock integration now executes ordinary Step physics plus both wall helpers and passes neutral/Left/Right covered falls through landing at180 with exactly one sound, no sideways ejection, grace clearing, body wall/new upper collisions and disabled-grace equivalence to original helpers across a geometry grid. Existing flat slide, grounded tunnel and open-ledge model assertions still pass. Setup/delivery in mm5-slide-ceiling-ledge-setup.md. User compile/runtime validation pending; this does not supersede the documented native phase/coordinate differences.

## User runtime confirmation

User reports the complete correction works after installation and testing: compilation, support-loss air-pose transition, neutral/Left/Right falling without sideways ejection, and the requested regression checks. Combined-case checkpoint accepted. Retain the documented rectangular-collision and standing-reference timing adaptations; this confirmation does not establish NES frame-perfect equivalence. Temporary test-instance removal and player-position restoration were instructed.
