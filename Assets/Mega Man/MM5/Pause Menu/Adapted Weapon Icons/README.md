# KindlyPatrick-based weapon icons — adaptation review

Credit: **Sprites by KindlyPatrick** The user supplied the reference sheet and explicitly requested attribution and allowed adaptation. Original supplied image/credit retained under Weapon Icon References. This is external reference artwork, NOT verified original Game Boy/NES ROM extraction. Author/licensing terms beyond the image signature were not supplied; verify redistribution permission before release.

The seven earlier hand-invented icons are superseded as design direction, not approved final game art. These new16x16 proposals retain the reference sheet's interior pixel positions without scaling or redrawing. Source14x14 interior is remapped to the original MM5 four-colour unselected palette; native casing replaces the perimeter and four inset corner pixels. This is a deliberately documented modification, not a claim of byte-identical complete icons.

Unselected palette: black000000,dark666666,greyADADAD,offwhiteFFFEFF. Palette maps/source rectangles in adaptation-manifest.json. Original source designs for Rolling Cutter, Ice Slasher, Hyper Bomb, Fire Storm, Thunder Beam, Super Arm, Magnet Beam preserved. Review columns show source versus adaptation, labelled in approved larger original MM5 font.

Individual16x16 PNGs and112x16 strip7 are review artifacts, NOT instructions to import yet. Selected colours and final integration await user review. Existing player, menu layout and GMS project code unchanged. No new weapon/tank/equipment behaviour enabled. Buster/Rush icons still intended to use original game assets, not these adaptations.

Tests: all seven unique16x16; every interior pixel matches explicit same-position source palette mapping; casing matches native MM5 R.Coil; only four native colours; strip order. Reproduce with adapt-supplied-weapon-icons.mjs; review-supplied-weapon-icons.mjs verifies source crops. Root CREDITS.md records intended in-game attribution, not a claim a credits screen is installed.

## Selection-state follow-up

User confirms grey is unhighlighted and wants selected colour versions. See Selected/ for seven palette proposals, paired strips/review and tests. Existing grey files remain unchanged. Selected approval pending; not GMS-imported. This supersedes earlier statement that selected variants are not yet prepared, but not the review-only/gameplay limitations.
