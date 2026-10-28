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
