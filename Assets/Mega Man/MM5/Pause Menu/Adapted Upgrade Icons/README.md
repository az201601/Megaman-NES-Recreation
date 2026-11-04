# Upgrade icon selection states

User approved upgrades layout and requests coloured upgrade icons. Energy Balancer is currently the only defined upgrade. Future upgrades will follow grey-unselected/colour-selected convention, but no unspecified upgrades/art added.

- Unselected: unchanged original MM6 grey PNG in Recovered Utility Icons.
- Selected: original pixel positions with custom NES blue/cyan/white mapping. Black0F, dark grey->11(155FD9), light grey->21(64B0FF), white->30(FFFEFF). Four colours total including black. Alpha and exact black/foreground mask preserved. No shape redraw/scale/antialias.
- This is a **custom selected palette**, NOT an original MM6 selected icon. MM6's passive icon did not have cursor-selected colours. Original Capcom artwork; not from KindlyPatrick's sheet.
- 32x16 strip has2frames: original grey, custom colour. Individual selected PNG16x16. Native/4x comparison and palette/source SHA256 manifest included.
- Upgrades page now draws selected colour PNG with external cyan cursor, same description and layout. Only current selected item shown; no interactive cursor/navigation implementation yet. Selected colours pending user review.

Rebuild: `node tools/rom-recovery/build-upgrade-icon-states.mjs`, then `node tools/rom-recovery/build-upgrades-layout-draft.mjs`. Tests assert untouched grey bytes, shape/alpha/black mask, four approved pinned NES colours, exact PNG roundtrips. Uses committed art, no emulator snapshots needed.
