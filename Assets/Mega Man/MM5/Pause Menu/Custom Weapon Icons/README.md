# Custom MM1 weapon/tool menu icons — draft1, review ONLY

User requests seven custom icons in original NES menu style: R.CUTTER, I.SLASHER, H.BOMB, F.STORM, T.BEAM, S.ARM, M.BEAM. Original Buster and Rush Coil/Jet/Marine icons remain original game art, not redrawn. User keeps E/W/M Tanks: W adaptation is ORIGINAL M casing with ONLY M lettering flipped vertically, not a whole upside-down tank. That tank edit isn't part of this icon set yet.

These seven are NEW custom16x16 pixel designs, NOT ROM-recovered MM1 menu artwork. Exact original MM5 unselected R.Coil casing retained at perimeter2px, its original R/C lettering removed and interior drawn manually as pixel masks. Same four colours as source: black000000, dark666666, greyADADAD, offwhiteFFFEFF. No gradients, antialiasing, arbitrary resizing or invented extra colours. Original source is committed native MM5 screen docs/pause-menu-reference/mm5-initial-menu.png crop144,96,16,16. Whole square opaque black backing retained, matching native icons.

Designs: cutter crescent blade, ice crystal, bomb/fuse, flame, lightning bolt, clenched fist, magnet emitter/platform beam. These are design proposals, not assertions of native weapon projectile shape. Ice shard/fist/emitter are symbolic; user may request changes. Unselected states ONLY; selected palette variants come after shape approval.

Files spr_mm1_menu_[weapon].png are individual16x16; strip7 is112x16 ordered rolling_cutter,ice_slasher,hyper_bomb,fire_storm,thunder_beam,super_arm,magnet_beam. Native review256x176 and4x exact nearest-neighbour1024x704 show all seven with original R.Coil reference, labelled with user-approved larger original MM5 font. Original reference icon is for comparison, not eighth custom icon.

DO NOT IMPORT into GMS yet. No event/room/menu/gameplay changes. Shapes, selected states, actual final resource names/origins and integration await review. Existing menu-frame/layout draft untouched until icons approved. No new weapons/items enabled. Source build-custom-weapon-icons.mjs validates7 unique images,16x16 bounds, four-colour palette, unchanged original casing, strip order and mapped MM5 font characters. No GMS runtime claims.
