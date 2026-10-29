# Weapon icon selection colours — review only

User designates existing grey adaptations as UNHIGHLIGHTED and requests coloured HIGHLIGHTED states when selected. This checkpoint provides seven colour proposals next to unchanged grey icons. No GMS/menu/controller/import changes. Selected-colour approval pending.

Credit: **Weapon-menu icons adapted from artwork by KindlyPatrick.** See root CREDITS.md and preserved user sheet. These are custom NES-palette adaptations, NOT verified original GB/NES selected sprites. Existing attribution/permission caveats continue.

All icons16x16. Same interior source pixel positions and same casing geometry as grey. Colour mapping explicit in selected-manifest.json; approved pinned Mesen0.9.9 default palette only, at most4 total colours per icon including black, no anti-aliasing/scaling. Source sheet's hues guide selected palettes. Rolling Cutter's source was grey: warm casing is a custom proposal, white/grey blade retained, original filled background restored in selected gold (NES27). Source112,112,112 must NOT map to black. Super Arm uses warm rust/cream with gold casing. Ice blue/white, Bomb green, Fire red/gold/cream, Thunder gold/white/grey, Magnet blue/cyan/white. These are icon colours only, NOT approved player weapon palettes, energy consumption or gameplay effects.

Existing seven grey PNG files are read-only and SHA256-checked unchanged. Grey casing colours change to selected accent only on originally nonblack casing pixels; black corners remain black. Interior colors use original source RGB -> explicit NES indices, no shape repainting. Tests assert native palette membership, <=4 colours, all alpha unchanged, source/casing mapping, seven unique selections, different from grey and combined strip byte equality.

Files:
- Seven individual spr_mm1_menu_[weapon]_selected.png
- spr_mm1_menu_weapons_selected_strip7.png:112x16, seven selected frames.
- spr_mm1_menu_weapons_states_strip14.png:224x16, alternating GREY then SELECTED for each weapon (0/1Cutter,2/3Ice,4/5Bomb,6/7Fire,8/9Thunder,10/11Arm,12/13Magnet).
- weapon-states-review.png/native256x192 and -4x.png/exact1024x768 for review, using original larger MM5 font.

No automatic animation: these are selection-state frames, not a temporal sequence. No GMS imports yet; review palette proposals first. Root art source/rights notes preserved; eventual in-game credit screen remains unimplemented.

Reproduce: node tools/rom-recovery/build-selected-weapon-icons.mjs, after original reference/grey adaptation assets exist. It does not require ignored emulator snapshots.

## Rolling Cutter fill correction

User reports removed original filled colour. Selected background source112,112,112 now maps to NES27/EA9E22, not black0F. All original fill positions restored; white/grey blade shading retained, four-colour limit preserved. Grey icon and other six selected icons unchanged. Colour correction pending user review; resource-import packaging paused.
