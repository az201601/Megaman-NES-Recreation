# First gate passage — source complete, runtime pending

Install with `INSTALL-GMS14.md` after the user-accepted Eleventh update. GMS1.4.1760,
manual resource/event import, no GMX. New gate opening/auto-passage and original
three-screen corridor20–22; second gate remains closed. No enemy/combat work.

**MM5 complete untrimmed door-opening sound is user-approved** and used unchanged.
No MM1 opening cue, composite shot/charge audio or synthetic replacement.

Room3072×2160, opening view0,1920 and player opening position unchanged. Existing
geometry and all17 blocks/two dispensers/ten visual-only spikes retained. New corridor
X2304..3071/Y720..959, camera2304..2816/Y720; next gate3056,816/16×64. The original
invisible return boundary2304,816/16×64 blocks going back after entry.

New totals:3070tile calls,109terrain/return-boundary solids,24ladders,24tops,
17blocks,2dispensers,10art-only spikes,2gate objects. Atlas29tiles128×64 keeps old28
pixels/indices unchanged. Native corridor is reconstructed exactly from actual tile
placements plus the separate second-gate sprite; all earlier scene pixels preserved.
Native black upper/lower corridor bands are scenery tiles, not a room background change.

**User-approved MM5-style immediate start:** sound and first removed strip at
trigger age0, next strips6/12/18, scroll24..87 (64×camera4/player1), stand87,
section bookkeeping120/control121. The initial32-frame hold is removed.
This is deliberately hybrid: MM5's immediate response, approved MM5 sound,
MM1 artwork/four strips at6-frame intervals and MM1 passage speed. It is NOT
MM5's complete three-edit/four-frame/12-frame animation transplanted onto MM1 art.
No first-gate close animation/cue is invented. MM5 walk artwork/cadence retained.
Grounded/standing entry atX2264 adapts MM5 collision probes and snaps to2264.25/
Y880−feet_offset; finalX2328.25. No native MM1 subpixel-Y or midair/slide entry claim.
Normal MM5 movement resumes on ready121; no MM1 normal acceleration is copied.

Shared busy/shot/charge/pause guards and finishing/rearm helpers reused. Gate playback
is one built-in sound owned by the camera; only this voice is stopped on teardown.
Stage Create, accepted PCM audio manager, music/async/alarms/player/pause/HUD untouched.
Handshake1201 rejects stale1101 starts. No manual stage object placements.

Tools: `build-cutman-first-gate.mjs`, `test-cutman-first-gate.mjs`,
`test-cutman-first-gate-research.mjs`, `package-cutman-first-gate.py`.
**35 source/model checks** include all22 previous ladder directions, the gate's busy
frames/camera/player timing, approved cue only once, native strips, charge/rearm,
stale-script rejection, teardown, corridor geometry/pixels and actual MM5 wall probes.
Builder separately checks native PPU opening pixels at first/second/full-open phases.
Prior Eleventh55 and historical regressions are run separately. Research details and
controlled-traversal limitations are recorded in sibling `First Gate Research/`;
2880 native PPU tile-ID/palette pairs verified. No natural whole-level/hardware claim.

Installation and actual GMS compiler/GPU/scheduler/parent-mask runtime confirmation
are still pending. Do not call the full Cut Man stage complete: enemies/hazards,
second gate/boss room, damage/death/checkpoints, pickups/tanks, boss/reward/return
remain separate future work.
