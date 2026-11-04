# E/W/M tank selection states

User requests coloured states for all selectable tanks and specifies Start on a selected tank uses one.

Grey E/M are exact original MM5 crops; W is the existing original-M lettering-only vertical flip. Blue/cyan selected states are custom palette remaps, NOT original MM5 selected-tank palette extractions. All casing, letters, black masks and alpha preserved. W and M casing still byte-identical outside letter cell. At most4 pinned Mesen NES colours per icon: black0F, darkblue11, cyan21, white30 (where source white exists).

Strip6 frames:0 E grey,1 E selected,2 W grey,3 W selected,4 M grey,5 M selected. Six individual16x16 PNGs and native/exact4x comparison included. No anti-alias/scaling or whole-tank flipping.

Import Pack and ZIP now replace spr_mm5_pause_tanks_strip3.png with spr_mm5_pause_tanks_strip6.png. SAME resource name spr_mm5_pause_tanks,6 frames16x16/origin0,0. Other sprites/audio unchanged. If already imported, replace only this resource; do not add duplicate tank resource. Approval of these new colours pending review.

Start-use behaviour recorded for future controller/inventory: not implemented by sprite update. No consumption, refill, zero-count handling, eligibility or menu-closing logic supplied here. Those require integration/tests; don't claim working tanks.

Rebuild: node tools/rom-recovery/build-tank-icon-states.mjs, then node tools/rom-recovery/build-pause-import-pack.mjs. Tests assert exact masks, alpha, W/M casing, palette limit and PNG roundtrips.
