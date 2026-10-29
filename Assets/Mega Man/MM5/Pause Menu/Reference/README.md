# Original MM5 menu font — source reference, NOT an install pack

User explicitly chose original MM5 font for custom pause menu. Current work extracts actual compact weapon-name/counter glyphs from original MM5 pause snapshot, approved Mesen0.9.9 palette via JSNES (not direct Mesen capture). Original foreground pixels preserved; background transparent for composition. No generated/redrawn lettering.

Files: original-subset PNG34 cells8x8 in one row (272x8), JSON character/tile map. This is not an ASCII-ordered full alphabet or finalized GMS font resource. Do not import/replace project font yet.

Important discovery: weapon-name glyphs are a subset, not consecutive A..Z. CHR E0..F5 order is ABCDEGHIJKLMNORSTUWYVP. F/Q/X/Z are missing from that compact set. Existing digits B0..B9, space00, period5E complete34 cells. M.BUSTER and R.COIL mappings asserted against original live nametable text. This doesn't claim MM5 lacks those letters everywhere: other screens/fonts may have them. No permission inferred to invent missing letters while calling entire font original. User decision needed for faithful font extensions or another original-MM5 glyph source. F.STORM and EQUIPMENT need F/Q respectively.

Confirmed labels: M. BUSTER, R. CUTTER, I. SLASHER, H. BOMB, F. STORM, T. BEAM, S. ARM, M. BEAM, R. COIL, R. JET, R. MARINE.11 entries total. Power/Jet Mega Man undecided. Custom frame NES style, original bars/tank/life/Buster/Rush icons required, custom MM1 special-weapon icons allowed; expanded equipment section for possible Energy Balancer/future features. No menu code/design installation yet.

No original W-Tank icon has been verified in supplied MM4/5/6: do not silently convert E/M lettering and call it original. Icon provenance and missing Rush Jet/Marine extraction still pending. Custom frame/layout draft also pending rather than presented with substituted font/icons. Initial concept is direction only, not final asset approval. No gameplay/resource changes made.
