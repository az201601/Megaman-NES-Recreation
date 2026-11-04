# Second gate passage — source complete, runtime pending

GMS1.4.1760; manual resource/event import, no GMX. Upgrade accepted immediate first
gate to second gate and original page23 boss-room layout, **without Cut Man/boss AI**.
See `INSTALL-GMS14.md`. Original native closing is tied to the later boss entrance;
no arbitrary closing timer, boss music/health fill or combat is added here.

New world3328×2160, no vertical shift. Opening viewY1920/player position unchanged.
New roomX3072..3327/Y720..959; camera3072,720.19scripted blocks (new3104,880 and
3136,880),3302tile calls,115terrain/boundary solids,24ladders/24tops, unchanged
2dispensers/10art-only spikes/2gates. Atlas29tiles128×64 byte-identical to previous.
Previous3072×2160scene/geometry/positions preserved. Native boss room reconstructed
exactly from actual scenery calls plus the two separate original block sprites.

Both gates: approved complete MM5 cue and first strip immediately at age0; remaining
MM1 artwork strips6/12/18, camera scroll24..87, stand87, commit120/control121.
Second camera2816→3072 at4px/frame. Native second player advances11/16px for the
first63 scroll steps; last frame resolves toX3096.5625. First gate remains1px/frame
and final2328.25. MM5 feet adaptY868. All normal movement and first-gate timing retained.
Native second control is held for the boss entrance; ready121 here is deliberately
an empty-room test adaptation, NOT full MM1 boss-intro timing.

New Sprite `spr_mm1_cutman_second_gate_open_backdrop`16×64; existing gateDraw chooses
it for the second opening. No new Objects/Sounds, manual placements, PCM/audio-manager/
StageCreate/music/player/pause/HUD changes. Camera/scroll/gate protocol1301 rejects
stale1201. Existing owner-only audio teardown, shot/charge/rearm guards reused.

Research: supplied original-USA execution inherits controlled ladder and first-gate
lead-ins;466frame Right/A-once corridor renderer traverse pinsY148/velocity0/protection100,
onepage22X216/Y148 placement/reset/protection100 +neutral cache refresh, Right-only420.
Not natural whole-level playthrough. Trigger20, opener52, visual strips53/59/65/71,
scroll76..139, room commit172. Boss entrance then runs; native closeD092 only at355,
not immediately after scroll. No original MM1 cue delivered; user-approved MM5 cue reused.
960boss-room tile-ID/palette pairs verified live PPU; builder verifies cropped gate
art at first/second/fully-open phases. No new comprehensive disassembly byte audit.

34 source/model tests: all22 original ladder busy trajectories under NEW GML, both
gate trajectories, immediate/single sound, slower second movement/final clamp,
charge/rearm/fresh release, stale scripts, idempotent cleanup, exact geometry/pixels,
unchanged atlas and accepted scene,19blocks/no duplicate permanent block terrain,
entry support/bounds and second backdrop selection. First-gate35 and historical
regressions run separately. These are not GMS compiler/GPU/scheduler/collision proof.

Tools: `probe-cutman-second-gate.mjs`, `recover-cutman-boss-room.mjs`,
`build-cutman-second-gate.mjs`, `test-cutman-second-gate.mjs`,
`package-cutman-second-gate.py`. Raw emulator snapshots remain ignored, no ROM included.
Installation/runtime confirmation pending. Enemies/cutter spawning/spike damage,
damage/invulnerability/death, pickups/tank effects/checkpoints, boss entrance/
closing/music/health fill/fight/reward/stage return remain future work.
