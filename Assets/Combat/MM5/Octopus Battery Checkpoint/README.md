# Octopus Battery / Suzy — additive combat checkpoint

After accepted Flea, Blader, Blaster and Super Cutter. Manual GMS1.4.1760 source/resource package: one original3pose sprite, one Create+Draw object, six new scripts, one manager Create append, two complete central-script replacements. Original16records (6vertical/10horizontal) mapped to the accepted route, no manual actors or second horizontal object. No camera/player/scenery/collision/menu/audio rewrites.

## Native evidence and adaptations

Original research included unchanged under Reference:295ROMbytes checked (286exact source plus3annotated USA table-operand instructions),1999native AI entries,1996consecutive state transitions across two1000-update trials; both63/126delays and multiple reversals; eight original normal-projectile controlled-overlap trials verify20->16in all four eye phases for both axes. **Closed eyes remain vulnerable**, not Blaster-like blocks. Three original16×16poses independently opaque-pixel matched to native rendering; origin8,7, open/half/closed; phase mapping0/1/2/1. Source pin and all controls are documented in the enemy research README/probes. No modified reference ROM executed.

The actual GML state script matches1996native transitions with recorded contact flags. The actual movement+state scripts also match **all1996consecutive position/state/timer/travel transitions** against the accepted terrain rectangles for the **first two native encounters** (one vertical/one horizontal), not just the observed contact flags. This is a limited measured corridor result, not proof of every native MM1 tile-class edge, every room or GMS collision/runtime behavior.

Native axis speed2, no gravity/homing/quarter-frame skip; move/collide before state logic. Endpoint delay63/126begins decrementing next update. Intended velocity presses into the endpoint while waiting; timer expiry reverses and starts opening immediately. Open/closed stable phases reset low nibble; transitions use low0..8 before advancing, giving9display updates per opening/closing phase. Rendering stores the phase before native graphics increment; NES/GMS draw-pipeline lag identity is not claimed.

Explicit project adaptations:

- Existing invisible solid rectangle/parent bounds (including removable blocks), numeric7pxhalfextent and center-line probes, swept at most1pixel. One-way ladder caps support downward travel only. First measured corridors match native transitions, but this is not a complete native metatile-solver port; other tile classes and project caps remain adaptation. No scenery-alpha collision or terrain edits.
- Existing central spawn convention: new actor initialization is drawn at birth, then movement begins next active update. All16mapped anchors use existing screen/band visibility, record rearm/active-ID deduplication, cleanup/freeze ownership.
- Native20HP/4basic normalized to5HP/1normal-or-mid; MM5 fullcharge3 and oldHP<4pierce. A fresh target takes two full shots; high-HP nonlethal hit consumes full shot, weak kill can pierce. This is MM5 hybrid charge behavior, not native MM1 charge.
- Endpoint RNG samples one uniform `irandom(255)` byte only when selecting a new wait, using bit0; original MM1 full RNG history/absolute clock not replicated. Accepted MM5 random-drop/explosion/refill/life/death ownership remains intact.
- Successful hits reuse approved loud MM6 cue35. No blocked ding, eye/movement/endpoint sound or audio replacement/reboost. Prior effects2×/music0.85 and charge ownership untouched.

Mapped native page9 in route_section4/band960, pages10/11/12 in sections5/6/7/bands720/480/240, each baseX1280+localX. Reference/mapped-octopus-battery-anchors.json records all16source records and mapped anchors. The accepted camera script establishes bands/bounds; no camera edits made.

## Validation and status

`test-octopus-battery-integration.mjs` executes actual GML using the limited JS/engine adapter:1996state and1996full-terrain transitions from the first two original traces,16mapped records/continuous1000step terrain sojourns per anchor, both endpoint choices, all-phase normal/mid/full damage/pierce/contact4/7pxbounds, kill-before-contact, one drop, born/freeze/route/offscreen/deflected-shot guards and built-in-local checks. Existing base407checks, Flea1369free/614grounded/498skip transitions, SuperCutter245states and Blaster840states pass with the overlay. Source audit preserves all accepted central-script lines outside additive calls. Gate34/pause16source regressions pass.

**Not GMS compiler/runner/GPU/event-scheduler/async-audio certification.** The editable installed GMX is not present in this repo. Follow INSTALL-GMS14.md, compile/playtest; user-installed runtime acceptance pending. Source completion is not installation.

```sh
node tools/rom-recovery/test-octopus-battery-research.mjs
node tools/rom-recovery/test-octopus-battery-integration.mjs
OCTOPUS_OVERLAY=1 node tools/rom-recovery/test-flea-integration.mjs
OCTOPUS_OVERLAY=1 node tools/rom-recovery/test-super-cutter-integration.mjs
OCTOPUS_OVERLAY=1 node tools/rom-recovery/test-blaster-integration.mjs
python tools/rom-recovery/package-octopus-battery-combat.py
```

ZIP/manifest/CRC/exact bytes verified; no ROM/emulator state/disassembly/executable/audio or scenery replacement. Later enemies, spikes, weapon effects/tanks/upgrades, checkpoint refinements and boss remain outside scope.
