# Original utility menu icons

Recovered from the supplied USA ROMs, rendered through JSNES with pinned Mesen0.9.9 palette conversion. **Not redrawn icons, not fan-sheet crops.** Original Mega Man/Capcom art; KindlyPatrick credit applies to the separate seven adapted weapon icons, not these original utility icons.

- Rush Jet and Rush Marine: Mega Man4 menu,16x16 each, original grey and native selected-colour states. Native lettered R.J/R.M icon designs, no substitute dog silhouettes. Grey/colour pairs in utility-icons-review.png and exact4x. Original MM4 casing/palette retained (not repainted to MM5).
- Energy Balancer: Mega Man6 pause menu, original16x16 crop at120,192. This is the icon the original game draws once acquired. Original MM6 does not cursor-select this passive item; no fake selected-colour extraction claimed. Custom upgrades page uses a cyan cursor frame OUTSIDE the unchanged icon.

## Evidence and limits

Four full native menu reference PNGs accompany the crops. Flags were controlled to reveal items in the original menu, **not a natural acquisition/playthrough**. No executable ROM patches or game-project changes:

- MM4: RAM00B1..00BD setFF during stage then original Start opens menu, exposing all entries. This broad inventory reveal is documented honestly, not an independently validated address-by-address inventory map or gameplay behaviour test. From Buster:Right to Dive,Down Skull,Down Coil,Down Marine,Down Jet. Native selection colours captured directly.
- MM6: only RAM0696 set01, then original Start opens menu. Supplied ROM bytes at PRGbank38:92E0 assert `AD9606 F006 A946 2028CB 00`: load0696, zero skips to92EB, nonzero invokes original menu draw command46. Shape, colours and placement unchanged.
- Code location cross-check aided by https://github.com/refreshing-lemonade/megaman6-disassembly/blob/master/bank38_3F.asm ; actual source bytes checked in supplied ROM, not assumed from external source.

All saved PNG pixels checked against capture bytes, <=4 colours per icon; grey/selected differ, alpha identical. No antialias/scaling/repainting;4x is review only. Native Rush sprites now placed into main-menu draft, no remaining placeholder slots. Energy Balancer now in separate upgrades-page draft. No GMS import, navigation, inventory, lives or automatic refill mechanics implemented.

Reproduce from repository root:

```
npm ci --prefix tools/rom-recovery
mkdir -p tools/rom-recovery/.work
node tools/rom-recovery/inspect-pause-references.mjs
node tools/rom-recovery/recover-utility-menu-icons.mjs
node tools/rom-recovery/build-pause-layout-v2.mjs
node tools/rom-recovery/build-pause-layout-v2.mjs M.BUSTER
node tools/rom-recovery/build-upgrades-layout-draft.mjs
```

Natural initial snapshots live only in ignored.work. Final crops/reference frames/manifests persist. Normal layout rebuilds use committed PNGs and do not need emulator snapshots.

## Follow-up: custom selected upgrade palette

User requests coloured upgrade selections. Original grey Energy Balancer extraction above remains unchanged. Adapted Upgrade Icons/ now contains a custom blue/cyan/white selected remap, explicitly NOT an MM6 original colour-state extraction. Upgrades-page selected preview now uses that coloured icon rather than only an external frame; original extraction and native evidence still intact.
