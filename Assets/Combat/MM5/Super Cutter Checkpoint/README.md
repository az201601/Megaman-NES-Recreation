# Super Cutter combat checkpoint

Additive manual GMS1.4.1760 installer **after the user-accepted Blaster checkpoint**. Both existing dispenser buildings/scenery stay untouched. Four new scripts, one new Create+Draw object, one new two-pose strip, one manager Create append and two full central-script replacements. No camera/player/menu/audio resource replacement and no new firing sound.

## Original-ROM evidence versus adaptation

- `Reference/native-super-cutter.json` (also maintained under `Assets/Enemies/MM1/Super Cutter/Reference/`): supplied MM1 USA ROM hash, 187 independently byte-verified source bytes from pinned mm1base9c1cb05bd1d63c176e1930053dda76bcb85cd977, nine controlled distance trials, both original stage records, native launch initialization and first-cutter lifetimes. The generic type11 handler really is B6C3 (dispatch AI_Generic); its four bytes are explicitly checked. Five in-range trials yield25launches total; strict distance<80, updates1/33/65/97/129, vx=floor(distance×256/51)/256, upwards1254/256, gravity64/256 applied after movement. In-range first lifetimes supply245 independently recorded pre-AI states, including initialization, with240 consecutive movement/gravity deltas asserted.
- No calls to C477 sound issue or opcode-qualified9003 sound dispatch in the nine160-update trials. These are controlled observations, not a proof that every possible game context is silent. No invented launch effect added.
- Native cutter initial20HP/basic damage4 gives **five normal hits**, derived from original initialized HP, damage table and verified generic subtraction. It is not a natural five-shot kill recording. Native contact4, halfwidth/height8/8. The invisible generator is not a damageable building.
- `Reference/native-super-cutter-art.json`: both16×32 common-cell poses composed from original live OAM/CHR/palette, each independently opaque-pixel matched to native JSNES rendering. Canonical left, origin8,15; closed pose has8transparent rows above/below its original16×16 image. Mesen0.9.9 palette conversion, not a run of Mesen.exe. Native graphics state0..9/16..25 alternates two poses every10updates; it is not a made-up four-frame rotation.
- Hybrid MM5 adaptation: normalize native20/4 into5HP/1normal-or-mid and3full, with accepted MM5 pre-hitHP<4 full-shot piercing. Existing MM6 successful-hit35 plays for every accepted hit. Native MM1 has no charge shot: this is intentionally not called native MM1 charge behavior. Existing MM5 explosion/drop/refill/life system is reused, one roll per completed kill explosion.
- Native anchors map to the accepted stage's two buildings at offset48,52. Generators are manager arrays, not duplicate artwork/room objects. Existing central scheduling convention is retained: newly created actors begin at their native initialization state and movement starts next active update. Compared against native pre-AI states, not a certification of NES/GMS draw pipeline lag.

## Verification and limits

`test-super-cutter-integration.mjs` executes actual GML via the existing limited JS/engine adapter:245native position/velocity/animation states, all nine160-update trigger trials, both anchors, normal/mid/full damage and pierce boundaries, killed-before-contact, contact/slide/protection, one drop, silence, born-frame guard, deflected-shot exclusion, route/offscreen cleanup and freeze guards. Accepted base407checks and Blaster840state tests also pass with the cutter overlay.

These are **not** the GameMaker compiler/runner, GPU/event scheduler, audio hardware or local installed acceptance. Follow `INSTALL-GMS14.md`, compile/playtest and confirm. No editable GMX project is present in this repository, so instructions do not pretend to have changed the user's installed project. Weapon pickups/tanks/upgrades, later enemies and boss remain outside this checkpoint.

Reproduce with original supplied ROM and ignored `.work/cutman-fourth-scroll/after-continuation.json` from the existing first-through-fourth ladder probes; source-label dumps come from the pinned mm1base reference, never its modified ROM:

```sh
node tools/rom-recovery/probe-super-cutter.mjs
node tools/rom-recovery/recover-super-cutter-art.mjs
node tools/rom-recovery/test-super-cutter-integration.mjs
SUPER_CUTTER_OVERLAY=1 node tools/rom-recovery/test-blaster-integration.mjs
node tools/rom-recovery/test-blader-combat-integration.mjs
python tools/rom-recovery/package-super-cutter-combat.py
```

ZIP excludes ROMs, executable/disassembly dumps, emulator states, historical audio and unused scenery. SHA256 manifest records exact packaged resources. Accepted sound files are not repackaged or boosted.
