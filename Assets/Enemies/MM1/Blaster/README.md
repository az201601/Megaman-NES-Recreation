# MM1 Blaster — original-ROM research checkpoint

**Research only. No new sprites, sounds or GameMaker objects are ready for import in this checkpoint.** Preserve installed Blader combat, movement, stage routes, pause and accepted gameplay-volume pack. User requested original encounter order: Blaster next, before cutter dispensers.

## Verified so far

- Supplied MM1 USA ROM is the executable reference, running in JSNES 2.1.0. External `TheRealQuantam/mm1base` pinned `9c1cb05bd1d63c176e1930053dda76bcb85cd977` names this wall cannon `AI_Beak`. That modified/Rockman-J-based source is used only for labels, never as a playable ROM.
- All **143 original USA bytes** of the AI/closed-shell helper at CPU `$AF26..$AFB4` match the labeled source.
- Original stage spawn records contain **11 Blasters** (types `$0B/$17/$22`; no `$23` in Cut Man's record list).
- First original anchor: **X824, Y72**, page3/X56. In the installed hybrid stage's opening run this corresponds to **X824, Y1992** (opening segment has a +1920 Y translation). Original-ROM coordinates and hybrid coordinates must not be mixed.
- In this explicitly controlled approach the first spawn happens at cameraX569, when X824 enters the 256-pixel view. Its absolute frame435 is a fixture observation, NOT a timer to hardcode.
- First Blaster observed for **765 original AI executions**. Three complete bursts each request **four bullets**, at internal fire counters **0,32,64,96**. Inter-shot spacing is32 updates; the first three burst starts are207 updates apart in this fixture.
- The four bullets use native default-speed table indices12,16,20,24, not four identical aimed shots. Actual signed trajectories still require movement-trace verification before GML conversion.
- The observed enemy begins with native life20. Do not infer shot damage or logical hybrid HP from that number alone.

## Evidence and limitations

`Reference/native-blaster-cycle.json` records verified instruction bytes, source ROM hash, native stage records, animation-state transitions, shot requests and speed-initialization calls. It does not include ROM/save-state content.

The fixture forces playerY36, zero vertical fraction/speed and protection100 each frame, holds Right until playerX700, then releases. Enemy code, stage records and ROM bytes are unmodified. This allows a stationary observation without death or traversal obstruction; it is **not natural playthrough, collision, vulnerability, audio, art, hardware or GMS runtime certification**. The full state byte includes per-update animation counters; it is not a sprite-frame index.

## Reproduction

From repository root:

```sh
npm ci --prefix tools/rom-recovery --ignore-scripts
node tools/rom-recovery/mm1-hurtwalk.mjs
```

The probe additionally expects ignored source-label file `tools/rom-recovery/.work/mm1-bank5.s`, fetched from the pinned GitHub source above. Download source only; never build/run that project's modified ROM.

```sh
gh api 'repos/TheRealQuantam/mm1base/contents/bank5.s?ref=9c1cb05bd1d63c176e1930053dda76bcb85cd977' --jq .content | base64 -d > tools/rom-recovery/.work/mm1-bank5.s
node tools/rom-recovery/probe-cutman-blaster.mjs
node tools/rom-recovery/test-cutman-blaster-reference.mjs
```

## Remaining before an import package

1. Recover original closed/opening/open/closing poses and bullet artwork, verifying against native render.
2. Verify four signed fixed-point projectile paths and all facing variants, muzzle offsets and lifecycle.
3. Independently test closed/open vulnerability, normal-shot thresholds, projectile/body damage, native collision bounds and relevant sound requests. Do not guess charged-shot behavior for MM1: charging is an explicit MM5-player adaptation.
4. Map all11 anchors through accepted route translations; integrate into the existing single combat scheduler without double updates or changes to Blader.
5. Package GMS1.4 scripts/event deltas and detailed imports, then compile/playtest locally with the user. Preserve accepted SFX +6dB and stage music0.85; do not silently import quiet master recordings over the accepted mix.
