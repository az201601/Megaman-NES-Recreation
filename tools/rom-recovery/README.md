# Post-hit ROM probes

Reference-only Node ESM probes; they do not modify ROMs or GameMaker assets. Results and limitations: `../../docs/post-hit-rom-observations.md`.

Requires Node, npm and the user's two ROMs at repository root. Install isolated dependencies here:

```sh
cd tools/rom-recovery
npm ci --ignore-scripts
for probe in mm5-start mm5-stage mm5-hit mm1-hurtwalk recoil spike5 spike1 facing facing1 trace-recoil contact-gates; do
  node "$probe.mjs" || exit 1
done
node verify.mjs
```

Run the sequence in order. `.work/` contains ignored, regenerable snapshots, RAM traces, images and bank dumps; do not commit these or node_modules. The probes retain their exploratory structure and verbose logs. No server is needed.

- `mm5-start`: boot, title and stage-select state.
- `mm5-stage`: choose Napalm Man and save playable opening.
- `mm5-hit`: naturally encounter first tiger; save before/after hit and actual mapped bank. MMC3 `cpu.mem` ROM addresses are not a substitute for `mmap.load`.
- `mm1-hurtwalk`: boot Cut Man, walk/jump into actual enemy contact; record damage events and snapshots.
- `recoil`: replay six input branches for each game's hit.
- `spike5`: actual Napalm spike contact; timer/state branches and X pin to test expiry. Contains controlled RAM modifications.
- `spike1`: **synthetic collision input**: substitute spike class at the real terrain-probe write, then detect execution of original death routine. Not a natural-spike-room playback.
- `facing` / `facing1`: reverse only player facing before contact; compare actual ensuing damage/recoil.
- `trace-recoil`: count MM5 hurt-handler speed initializations; log recovery. Expect 27 handler executions, even when displayed-frame counts differ due to lag.
- `contact-gates`: actual imminent enemy-body contact with protection disabled, timer enabled, or MM5 hurt state forced.
- `verify`: assertions over the generated observations. This is targeted regression coverage, not emulator/hardware certification or proof of all attack types.

Known unmeasured cases include an independently identified enemy projectile, fresh jump/fire buffering, and the full grounded/airborne/ladder/slide/attack matrix. ROM hashes are recorded in the observations document. No ROM copies or save states are distributed in this tool directory.

## Cut Man opening route (four-screen horizontal stripe)

```
npm ci --prefix tools/rom-recovery --ignore-scripts
node tools/rom-recovery/mm1-hurtwalk.mjs
node tools/rom-recovery/recover-cutman-opening-route.mjs
node tools/rom-recovery/probe-cutman-opening-camera.mjs
node tools/rom-recovery/build-cutman-opening-package.mjs
node tools/rom-recovery/test-cutman-opening-package.mjs
python tools/rom-recovery/package-cutman-opening.py
```

Supplied MM1 USA bank0 decoding. First two pages checked against original boot nametables; latter two checked against original renderer during explicitly controlled Y/protection-pinned traversal, not natural playthrough. Original first-screen static-solid/ladder coverage unchanged. Camera GML compared against1620native frames; source mocks are NOT GMS1.4 compile/runtime proof. Install guide/ZIP in Assets/Cut Man/Stage/Opening Route. No next-room upward handoff/enemies/combat/pickups installed by this checkpoint. Raw generated scratch frames remain.work. Committed geometry/nativecamera records make source tests auditable without external ROM distribution.

## MM5 pickup/drop recovery

After `mm5-start.mjs` and `mm5-stage.mjs`, run `recover-mm5-drops.mjs`,
`probe-mm5-pickup-effects.mjs` and `test-mm5-drops.mjs`. Output and scope notes:
`../../Assets/Pickups/MM5/README.md`. Includes all256 controlled original-CPU
modulo50/selection results, native-render-checked original sprite strips, nine-update
palette phases,255-update lifetime traces and five original collision/refill trials.
Research and art only; no installed GMS pickup/drop behavior. Full native RNG state
sequence, natural enemy spawn/drop eligibility and collision boundary matrix remain
separate from these controlled probes.

## Blader combat implementation foundation (unfinished integration)

After the MM1/MM5 stage snapshots and original MM1 pinned source-only bank5.s/
bank7.s files, run `mm5-hit.mjs`, `probe-blader-combat.mjs`,
`probe-mm5-hurt-boundaries.mjs`, `probe-mm5-health-freeze.mjs`,
`recover-mm5-hurt-art.mjs` and `record-mm5-combat-sfx.mjs`.
`test-blader-combat-research.mjs` verifies those evidence/art/audio assets;
`test-blader-combat-kernels.mjs` executes the actual four pure GML kernels through
a syntax adapter. Neither is a GMS compiler/runtime test or a claim that the
requested enemy/player/pickup object/event integration is finished. Current scope:
`../../Assets/Combat/MM5/Blader Checkpoint/README.md`.

## Blader combined combat package (supersedes foundation-only status)

`probe-mm5-combat-bounds.mjs` executes original CPU contact/shot threshold functions;
`recover-mm5-combat-effects.mjs` and `recover-mm5-hurt-stars.mjs` recover native
pixel-matched effects/offsets and original16death vectors. `record-mm5-combat-sfx.mjs`
now includes original extra-life24 and death1D as well as hurt1C/refill26.
`test-blader-combat-integration.mjs` executes actual source scripts/events with
407mock-engine assertions (NOT GMS runtime). `package-blader-combat.py` builds the
self-contained manual import ZIP and validates byte-identical resource copies and
SHA256 manifest. Complete guide/scope/adaptations at
`../../Assets/Combat/MM5/Blader Checkpoint/INSTALL-GMS14.md` and README.md.
Existing gameplay event sources remain historical approved baselines; this package
supplies precise fragments/replacement hooks rather than pretending to modify an
absent editable GMX project. Local GMS1.4 compile/playtest acceptance is pending.

## Blaster gameplay checkpoint

`probe-blaster-gameplay.mjs` rebuilds a controlled first-gun observation from ignored `.work/mm1-stage.json` (regenerate with `mm1-hurtwalk.mjs`). Tests4variants×600updates against independent animation-byte/firecounter and signed fixedpoint movement; writes public non-ROM evidence JSON. Variant default tables are bank6, not bank5. `test-blaster-integration.mjs` overlays the additive package on the accepted actual-GML mock engine; the base407checks still run and additional Blaster checks follow. No compiler/runtime equivalence claim.

```sh
node tools/rom-recovery/mm1-hurtwalk.mjs
node tools/rom-recovery/probe-blaster-gameplay.mjs
node tools/rom-recovery/test-blaster-integration.mjs
node tools/rom-recovery/test-blader-combat-integration.mjs
python tools/rom-recovery/package-blaster-combat.py
```

Approved trim source/manifest and MM6ding evidence are packaged with exact hashes. Do not rerun older recorders over accepted output/import quiet masters or rejected previews. No ROM/save-state distribution.

## Super Cutter dispenser gameplay checkpoint

After accepted Blaster runtime, `probe-super-cutter.mjs` uses the ignored fourth-ladder native snapshot and original supplied MM1USA, with explicitly controlled player positioning/protection, not patched enemy code. Verifies187source bytes including type11's AI_Generic/B6C3 entry, original HP/damage helper, generator/distance division. Nine160-update distance trials establish strict<80/32cadence, launch velocities,245pre-AI cutter states and240consecutive movement/gravity deltas; no sound requests in either verified queue path. `recover-super-cutter-art.mjs` recovers and independently renderer-matches both original OAM poses into16×32commoncells/origin8,15. Requires pinned mm1base source-label dumps and existing `.work/cutman-fourth-scroll/after-continuation.json`; regenerate that using first-through-fourth ladder probes documented above. No ROM/state/disassembly included in ZIP.

```sh
node tools/rom-recovery/probe-super-cutter.mjs
node tools/rom-recovery/recover-super-cutter-art.mjs
node tools/rom-recovery/test-super-cutter-integration.mjs
SUPER_CUTTER_OVERLAY=1 node tools/rom-recovery/test-blaster-integration.mjs
python tools/rom-recovery/package-super-cutter-combat.py
```

The optional `SUPER_CUTTER_OVERLAY=1` loads accepted Blaster then additive cutter sources into the existing407check adapter. New tests compare actual GML against native trigger/motion/pose records and exercise5HP/charged piercing/cleanup/contact/drop/freeze integration. Tests are not GMS compiler/runtime proof; use `Assets/Combat/MM5/Super Cutter Checkpoint/INSTALL-GMS14.md` for exact manual import. Do not replace building/scenery or approved audio. Source package is runtime-pending, not installed merely because tests pass.

## Flea original-game research (not a gameplay installer)

`probe-flea-gameplay.mjs` starts from the existing ignored fourth-ladder snapshot, releases ladder with native A, then uses controlled high-Y/protected Right approach to first original page8Flea spawn. Saves ignored frame-boundary `.work/flea-before-first-ai.json`. Five controlled600-update original-AI trials produce public215ROM-byte evidence and2708state entries, both native RNG hop choices,45landings/15-update waits,499air skips and no sound issue calls. `recover-flea-art.mjs` independently native-render-matches both grounded/extended-spring poses. `test-flea-research.mjs` checks ROM spans, traces, mapped anchors and strip hashes. Run these three scripts in that order. No gameplay/installation or GMS-runtime completion implied; scope at `Assets/Enemies/MM1/Flea/README.md`.

## Flea additive gameplay package (research-only status superseded)

`test-flea-integration.mjs` overlays the new `Assets/Combat/MM5/Flea Checkpoint/` on accepted Blader/Blaster/Super Cutter sources in the limited actual-GML adapter. Checks1369native free transitions/614grounded/498skips plus explicit rectangular-terrain boundary and accepted3support fixtures; new spawning/hits/contact/drop/cleanup/freeze/deflection and built-in-local guards pass. All old central-script lines preserved outside additive calls. Not the GMS compiler/runner or complete native metatile solver proof.

```sh
node tools/rom-recovery/test-flea-integration.mjs
FLEA_OVERLAY=1 node tools/rom-recovery/test-super-cutter-integration.mjs
FLEA_OVERLAY=1 node tools/rom-recovery/test-blaster-integration.mjs
python tools/rom-recovery/package-flea-combat.py
```

`FLEA_OVERLAY=1` layers all three earlier checkpoints before Flea and retains the407base checks. `package-flea-combat.py` writes deterministic16file ZIP/manifest with original evidence/art and manual folder/resource/object/event instructions; no ROM/save-state/audio/scenery replacement. Local GMS compile/playtest acceptance pending. Follow INSTALL-GMS14.md, not historical research-only guidance.

## Octopus Battery / Suzy original research (not gameplay installation)

`probe-octopus-battery.mjs` uses the ignored firstFlea snapshot and controlled Right/Y36/protected lead-in to first native04vertical/21hex-horizontal spawns. Records1999AI entries and independently checks1996state/timer/reversal/graphics transitions using observed native collision flags; both63/126delays,2pixel axis travel and silence verified. Eight native-B bullets relocated for controlled overlap test all four eye phases for each type: all20->16, **closed eye is vulnerable**. No enemy HP/state/flags patches.295ROMbytes checked,286exact source matches and three annotated USA-vs-J-derived table operands; see scope/controls at `Assets/Enemies/MM1/Octopus Battery/README.md`.

Run `probe-octopus-battery.mjs`, `recover-octopus-battery-art.mjs`, then `test-octopus-battery-research.mjs`. Three independently native-render-matched16×16poses; no new gameplay/audio/terrain resources or installer yet. Local GMS integration/runtime remains future work. No ROM/state/disassembly distributed.

## Octopus Battery additive implementation (supersedes research-only preparation status)

`test-octopus-battery-integration.mjs` loads the new package after all four accepted enemy checkpoints under `OCTOPUS_OVERLAY=1`. Actual GML state and full accepted-terrain movement/state each match1996native transitions for the first vertical/horizontal pair; all16mapped anchors additionally get1000step terrain sojourns. Combat, HP/charge/pierce,7px/contact4, cleanup/freeze/born/oneway/removal/rearm/deflection, source-preservation and built-in-local guards pass. No GMS compiler/runtime or whole-native-metatile/RNG certification.

```sh
node tools/rom-recovery/test-octopus-battery-integration.mjs
OCTOPUS_OVERLAY=1 node tools/rom-recovery/test-flea-integration.mjs
OCTOPUS_OVERLAY=1 node tools/rom-recovery/test-super-cutter-integration.mjs
OCTOPUS_OVERLAY=1 node tools/rom-recovery/test-blaster-integration.mjs
python tools/rom-recovery/package-octopus-battery-combat.py
```

`package-octopus-battery-combat.py` emits deterministic18file ZIP plus manifest/CRC/exact-copy checks; no ROM/emulator states/audio/scenery replacement. Follow `Assets/Combat/MM5/Octopus Battery Checkpoint/INSTALL-GMS14.md`. The package is prepared, not installed merely because source tests pass.

## Flying Shell / Shellgun research (not gameplay installation)

After accepted Octopus Battery, regenerate fifth-through-tenth ladder probes from the existing fourth snapshot as needed. `probe-flying-shell.mjs` uses ninth/tenth frame-boundary states with controlled high-Y/protection to observe actual type0A repeated-flight/spawn cycles,413sourcebytes,1984active-state transitions/1038bullet deltas/20eight-way bursts. Eight sound15requests AND eight opcode-qualified15driver dispatches occur perburst (not deduplicated). Native-B controlled overlaps prove closed block/openonehitkill; invisible kill replacement counter72/reactivation70subsequent frames is separately recorded. No enemy/AI/ROM patches, no natural aiming/GMS/audio-waveform identity claim.

Run `probe-flying-shell.mjs`, `recover-flying-shell-art.mjs`, `test-flying-shell-research.mjs`. Two native-render-matched jaw poses in17×24cells/origin8,11preserve the original1pxmiddle offset. No ROM/state/audio/gameplay installer distributed here. Native burst audio comparison and additive GMS implementation are next; keep approved Blaster/MM6ding/hit assets untouched. Scope/controls at `Assets/Enemies/MM1/Flying Shell/README.md`.

## Flying Shell native audio + additive gameplay package

`compare-flying-shell-audio.mjs` compares actual8native15dispatch and labelled1request control from identical ninth-ladder initializedPAPU snapshots after nativeFFstop, protectedneutral player. Active PCM differs; records real8dispatch full-APU burst with2×gain and silence-only trim, not8WAVvoice stacking. New cue awaits user approval; accepted audio untouched. `recover-flying-shell-art.mjs` now additionally recovers native salmon bullet palette independently render-matched (not accepted Blaster magenta).

`test-flying-shell-integration.mjs` loads all accepted overlays before Shell, tests1984native flight states/1038bullet deltas,8vectors, repeatededge reentry/70update kill replacement, closed/open normal-mid-full, body1/bullet2, drop/freeze/cleanup, source/initialization preservation, builtinlocals and exactaudio trim/hashes. Adapter explicitly models new projectile child inclusion in existing parent bullet loop; GMSGUI parent selection/runtime must still be tested. No camera/player/terrain/oldaudio edits.

```sh
node tools/rom-recovery/compare-flying-shell-audio.mjs
node tools/rom-recovery/recover-flying-shell-art.mjs
node tools/rom-recovery/test-flying-shell-integration.mjs
SHELL_OVERLAY=1 node tools/rom-recovery/test-octopus-battery-integration.mjs
SHELL_OVERLAY=1 node tools/rom-recovery/test-flea-integration.mjs
SHELL_OVERLAY=1 node tools/rom-recovery/test-super-cutter-integration.mjs
SHELL_OVERLAY=1 node tools/rom-recovery/test-blaster-integration.mjs
python tools/rom-recovery/package-flying-shell-combat.py
```

Package22files/manifest/CRC/exactcopies; only trimmed new burst in ZIP, fulltail stays repo. No ROM/state/disassembly/audio-master replacement. Follow `Assets/Combat/MM5/Flying Shell Checkpoint/INSTALL-GMS14.md`; source prepared, compilation/installed playtest and new sound acceptance pending.

## Big Eye initial research

`probe-big-eye-gameplay.mjs` replays eleventh beforeDown snapshot (generate with `probe-cutman-eleventh-ladder.mjs`), protects player, captures native record44/type09 spawn, finds enemy slot separately, then five controlled600video-update trials.219source/helper/speed bytes exactUSA;1347actual AI entries/25launches/20landing29hexrequests/236skips. Rightward trials leave slot after49entries; no3000AI-entry/fullterrain claim. `test-big-eye-research.mjs` verifies persisted traces/source bytes and limits. Research-only: art/audio recovery, additive source/installer and GMS runtime still pending. Accepted six-enemy baseline unchanged.

## Big Eye native resources + additive package

`recover-big-eye-art.mjs`: native OAM/CHR/palette, two independently render-matched32×48poses/origin12,27. `recover-big-eye-audio.mjs`: initializedPAPU/nativeFFstop, fullAPU actual29hexlanding, holds grounded wait255 afterward solely to avoid second landing in tail; total1request/1dispatchasserted. Exact2×gain/exactzeros-only2mslead+10mstrail,8652trimframes/54953fulltail. New take awaiting approval; accepted audio untouched.

`test-big-eye-integration.mjs`: actual GML through limited adapter matches721native free/350ground/236skip transitions; accepted anchor support/rectangular terrainfixtures,20normal/mid/7full/weakpierce/contact10/slide/bounds/landingonce/drop/freeze/rearm/cleanup/killbeforecontact/art/audio/preservedcentral/builtin guards. Full native terrain-edge solver not claimed. All prior overlays supported through `BIG_EYE_OVERLAY=1`; tests are not GMS runtime.

```sh
node tools/rom-recovery/recover-big-eye-art.mjs
node tools/rom-recovery/recover-big-eye-audio.mjs
node tools/rom-recovery/test-big-eye-integration.mjs
BIG_EYE_OVERLAY=1 node tools/rom-recovery/test-flying-shell-integration.mjs
BIG_EYE_OVERLAY=1 node tools/rom-recovery/test-octopus-battery-integration.mjs
BIG_EYE_OVERLAY=1 node tools/rom-recovery/test-flea-integration.mjs
BIG_EYE_OVERLAY=1 node tools/rom-recovery/test-super-cutter-integration.mjs
BIG_EYE_OVERLAY=1 node tools/rom-recovery/test-blaster-integration.mjs
python tools/rom-recovery/package-big-eye-combat.py
```

Follow `Assets/Combat/MM5/Big Eye Checkpoint/INSTALL-GMS14.md`. Source/resources prepared; GMS compilation/installedgame/newcue acceptance pending. No ROM/savestates/fulltail/oldscene/audio replacements in ZIP.

## MM5 fall reference + Cut Man Free Fall Correction

`probe-mm5-connected-drop.mjs`: controlled valid Napalm room-endpoint page3→4 original metadata, fallingstate1/no buttons/no ladder,60native downscroll steps and continuedfall. `probe-mm5-fall-boundary.mjs`: controlled below-floor placement, unconnected pit/fullHP/flash0+60, native state7/musicstopF0/death1D/counter012C/life2→1. `probe-mm5-death-effects.mjs`: controlled single spikeF0terrain-class result versus actual lethal-contact/health1 and unconnectedpit; original spike/lethal-contact share8332/16particles, pit usesE02B/0particles; flash guard verified. Natural specific-spike approach/masks not claimed. `test-mm5-fall-reference.mjs` validates persisted traces/95ROMbytes. Recreate initialized snapshots via mm5-start then mm5-stage; lethal-contact uses mm5-hit snapshot. ROM/source references remain excluded from installZIP.

`test-cutman-free-fall.mjs`: actual patch GML/limited mocks,5934valid worldXmapping checks against14independent roomrects,11nonseam drops, all60nativevertical samples/alignmentframe/release62/retainedfall/charge/Start/refill/hurt/pits/gate+ladder sourcepreservation. `test-pit-death-integration.mjs`: actual shared combat scripts, pit fullHP/protection0+60/onecue/0particles/300timer/one-life/zero-sparetitle; ordinary lethaldamage16particles/die+drawpreservation/builtin guards. `FALL_OVERLAY=1` loads accepted7enemy overlays then patch sources in integration adapter. No GMS compiler/event/runtime identity claim.

```sh
node tools/rom-recovery/test-mm5-fall-reference.mjs
node tools/rom-recovery/test-cutman-free-fall.mjs
node tools/rom-recovery/test-pit-death-integration.mjs
FALL_OVERLAY=1 node tools/rom-recovery/test-big-eye-integration.mjs
FALL_OVERLAY=1 node tools/rom-recovery/test-flying-shell-integration.mjs
FALL_OVERLAY=1 node tools/rom-recovery/test-octopus-battery-integration.mjs
FALL_OVERLAY=1 node tools/rom-recovery/test-flea-integration.mjs
FALL_OVERLAY=1 node tools/rom-recovery/test-super-cutter-integration.mjs
FALL_OVERLAY=1 node tools/rom-recovery/test-blaster-integration.mjs
python tools/rom-recovery/package-cutman-free-fall.py
```

Follow `Assets/Cut Man/Stage/Free Fall Correction/INSTALL-GMS14.md`.14file deterministicZIP/manifest/CRC/exactcopies. No newart/audio/object/geometry/enemy resources; don't replace accepted combat-owned cameraEndStep. HUDhealth0/opening-title retry/horizontal camera interpolation are explicit project adaptations. Cut Man spike collision not added. Installed acceptance pending.
