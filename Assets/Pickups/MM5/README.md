# MM5 enemy drops and original pickup sprites

Research/art package only. **No pickup objects, drop logic, enemy combat or sound changes have been installed in the GMS project.** Fixed stage pickups, Eddie, E/W/M tanks and the approved stage tank distribution are separate.

## Verified drop selection

The supplied **Mega Man 5 (USA)** ROM is authoritative. Original bank 1D routine AE59–AEB9 mixes its RNG state using carry-dependent ADC/SBC operations, divides the resulting byte by **50 decimal** using F207–F22C, then scans the thresholds at AF1B backwards. The death animation must reach frame 4 and `$2F` must not be negative before this routine rolls. This table describes eligible calls, not every possible destructible object in the game.

| Result | Animation ID | Remainder buckets | Nominal / 50 buckets | Inputs / 256 | If input byte is uniform |
|---|---:|---|---:|---:|---:|
| Small health | 75 hex | 3–7 | 10% | 28 | 10.9375% |
| Large health | 74 hex | 8–9 | 4% | 10 | 3.90625% |
| Small weapon energy | 77 hex | 10–13 | 8% | 20 | 7.8125% |
| Large weapon energy | 76 hex | 0–1 | 4% | 12 | 4.6875% |
| Extra life | 78 hex | 2 | 2% | 6 | 2.34375% |
| Nothing | — | 14–49 | 72% | 180 | 70.3125% |

**Do not call the nominal column exact measured gameplay frequencies.** Byte modulo 50 is biased: residues 0–5 have six representatives, others have five. The last column is exact *conditional on uniformly distributed input bytes*, not proof that MM5's evolving, carry-dependent RNG is independent or uniform. A `random(50)`/50-way bucket implementation would omit the original byte-modulo bias. Matching complete native RNG sequences would additionally require its state, inputs and carry context.

Original threshold bytes: `0E 0A 08 03 02`; animation bytes: `77 74 75 78 76`. `Recovered/drop-selection.json` contains all 256 original-CPU divider/selector results and three pinned ROM byte spans. These are controlled instruction-level tests, not a simulated kill-frequency survey. Interrupts/PPU advancement are disabled **only for the isolated arithmetic/selection test**; sprite/effect tests run ordinary NES frames.

Source navigation reference: [refreshing-lemonade/megaman5-disassembly, pinned 03e59a6855c1aca85d063bd2973005dc3ffd02ef](https://github.com/refreshing-lemonade/megaman5-disassembly/tree/03e59a6855c1aca85d063bd2973005dc3ffd02ef), bank1B_1F.asm. Original-ROM bytes and execution, not unverified source comments, determine the identities and results here. In particular, **75 is small health; 77 is small weapon energy**. The separate Eddie table is not the enemy drop table.

## Artwork and behaviour verified

- Original CHR tiles, native OAM offsets/flips and sprite palettes; no redraw, resizing or invented details in import PNGs. Transparency comes from native colour-index zero, not colour-key removal. Black artwork remains opaque.
- Mesen 0.9.9 default colour mapping, consistent with the project's other recovered sprites. This is a colour adapter, not a claim that JSNES is Mesen.
- Four energy pickups each have **two palette phases**, switching every **9 updates** in the observed native trace, with a shared/global phase. Their native animation-frame index stays zero: these are palette changes, not shape animation. A free-running two-frame sprite is only an approximation of shared phase until the gameplay controller supplies synchronization.
- Extra life has one static frame.
- The native OAM top-left is centre `(-4,-3)` for small pickups and `(-8,-7)` for large pickups/life, including the NES OAM Y+1 rule. The import guide preserves those anchors.
- Every exported opaque pose is checked against the original renderer's pixel output. The test clears other actor slots and pins the pickup centre/vertical velocity to isolate artwork; it does **not** certify natural enemy death spawning, trajectory, collision boxes or all stage palettes.
- Native dropped-item B7 countdown starts at FF hex, decrements once per observed active update and removes the item at update **255**. Last 59 nonzero counts request native flashing. This is not a pause-independent wall-clock timeout. `pickup-art.json` records 260 updates for every item, including disappearance.
- Controlled native collision/refill trials verify small health **+2**, large health **+10**, small weapon energy **+2 to the selected weapon**, large weapon energy **+10 to the selected weapon**, extra life **+1**. Each trial starts with 5 health/weapon bars and 2 spare lives. Internal energy is `80 hex + bars`, so max `9C hex` means **28 bars**, not 156 health. The native refill loop caps at 9C; each observed increment is four frames apart (source async argument 3 must not be mistaken for a three-frame observed interval).
- Extra-life routine caps the stored spare-life count at 9. Native weapon refill returns without filling anything if the Buster is selected. These last two branches are source/byte observations, not extra runtime trials in this package. Custom Energy Balancer behavior remains separate.

## Files and reproduction

- `Recovered/*_strip2.png`: four two-frame strips; `*_strip1.png`: static extra life.
- `Recovered/*_0.png` / `*_1.png`: individual original-size frames for inspection.
- `Recovered/mm5-pickups-preview.png`: labelled 4× nearest-neighbour reference, **not** an import sprite.
- `Recovered/drop-selection.json`, `pickup-art.json`, `pickup-effects.json`: evidence.
- `INSTALL-SPRITES-GMS14.md`: resource folders, sizes, origins and import steps.
- `Downloads/mm5-pickups-research-and-sprites-gms14.zip`: self-contained import/research package, no ROM.

From the repository root:

```sh
npm ci --prefix tools/rom-recovery
node tools/rom-recovery/mm5-start.mjs
node tools/rom-recovery/mm5-stage.mjs
node tools/rom-recovery/recover-mm5-drops.mjs
node tools/rom-recovery/probe-mm5-pickup-effects.mjs
node tools/rom-recovery/test-mm5-drops.mjs
```

No supplied ROM or disassembly dump is included in the download. Existing stage, pause, firing/charge and approved MM6 hit audio are unchanged.
