# Custom pause menu — layout draft v1 (review only)

User chose larger ORIGINAL MM5 alphabet for all pause-menu text. Current draft is a pixel-accurate256x240 composition, plus exact4x nearest-neighbour preview. Not AI-generated artwork, not a screen captured from an existing game, not final GMS resources. Custom blue/offwhite NES-style frame/panel divisions; source glyph shapes unchanged.

11 confirmed abbreviated entries in two columns: M. BUSTER / R. CUTTER / I. SLASHER / H. BOMB / F. STORM / T. BEAM; S. ARM / M. BEAM / R. COIL / R. JET / R. MARINE. All shown full solely to test spacing; not actual implemented/unlocked inventory. Tanks E/W/M00, optional E.BALANCER label and UPGRADES entry reserve expandable equipment page. Counts/selection illustrative. No score or lives count. Life icon displayed as requested. Power/Jet Mega Man still undecided, not enabled/shown; adding both would exceed two-column6-row capacity (one free row currently), so would require pagination/reflow, NOT squeezing13 into12. Equipment/custom-feature expansion should have its own page.

## Original art in draft

- User-approved larger MM5 font from verified ROM CHR alphabet/header set. See Reference font scripts/map/provenance. White glyphs unmodified; optional inactive label is tinted in draft.
- Buster, R.Coil, E tank, M tank, life head and full bar strips are exact native frame crops from original MM5 pause. Crops/coordinates in layout-v1.json; original-colour crops composed without resizing. Health line uses same recovered horizontal bar strip as layout study, not a claim MM5 original menu places this health panel here. Selected Buster bar original cyan, others original white.
- Original frames/icons contain their original black backgrounds. They have not been reinterpreted as final collision/resource sheets.

## Placeholders that are NOT final/original icons

Dim outlined boxes with horizontal mark reserve seven custom MM1 weapon/tool icons (six Robot Master weapons + Magnet Beam). Custom pixel-art icons still to be created/approved. Two other such boxes reserve original Rush Jet/Marine icons pending recovery, NOT new invented Rush art. W tank box with original-font W is ONLY a labelled space reservation: no authentic W-tank icon verified from supplied MM4/MM5/MM6. User wants original tank art; source choice must be settled before replacing placeholder. Do not call this W box a recovered ROM icon. Original E/M shown.

E.BALANCER text reserves a possible upgrade, not an implemented/owned item or recovered equipment icon. UPGRADES is a visual navigation proposal, not decided input binding. Frame/selection outline are new pixel graphics in NES menu style, not recovered originals. Top-level conceptual direction accepted earlier, but this exact frame/layout still pending review.

No GMS import or event/object changes. No pause engine, weapon effects, tanks, energy balancer, damage/invulnerability, controls or new game features implemented by this draft. Intended next step: review spacing/frame first; recover original icons and settle W source; make custom weapon icons; then implementation separately. Game remains at working health-HUD checkpoint.

Reproduce: build-pause-layout-draft.mjs consumes original complete-font reference + ignored natural mm5-pause-60.png. Tests assert all glyphs mapped, all pixel writes/labels in bounds, exactly11 unique entries. Does not certify interactivity/readability at actual scaled window or layout approval.

## V2 — approved icons in context

User approves seven grey/selected KindlyPatrick-based icon pairs. V2 uses those exact PNGs, approved larger MM5 font and existing custom frame. Two snapshots: Cutter selected (primary review) and Buster selected (alternate). Only one row is selected/coloured; other custom icons grey. Selected text/frame use cyan and original native selected-bar crop, a visual layout proposal rather than implemented controls/weapon palette behaviour. Values still illustrative full/00; no actual game inventory implied.

Buster grey recovered by original natural Right-to-Coil pause selection, not recoloured by guess. Reference/mm5-buster-unselected-original.png plus recover-mm5-buster-unselected.mjs record source. Native Buster/Coil/life/E/M/bar art unchanged. Reproduction of the recover script requires ignored mm5 pause snapshot from inspect-mm5-pause.mjs; v2 itself reads only committed assets.

W placeholder replaced by Reference/mm1-w-tank-letter-flip-draft.png: original M tank16x16 crop, ONLY interior8x8 letter cell(x4..11,y4..11) flipped vertically. All casing/outside bytes checked unchanged; no whole-tank flip or invented casing. W remains explicitly adapted, not a recovered original W tank. It is a visual draft, not an inventory feature.

Original Rush Jet/Marine icons still pending recovery: their TWO outlined slots are honest placeholders, not substitutes from the supplied sheet. Existing invented icon drafts remain historical; v2 uses approved KindlyPatrick adaptations. Optional E.BALANCER/UPGRADES area still capacity planning, not enabled equipment. Both optional adapters still undecided; pagination/reflow needed for extra entries.

Tests:11 unique/in-bounds labels, exactly one selected row, all seven icon pixels exact approved state, selection outline does not overwrite adjacent icon rows, W-only-letter flip, complete font mappings. Selection outline reduced to18px high to fit18px row pitch without painting previous row's bottom icon border. Pixel images256x240 plus exact4x; no antialias/resize on source art. No GMS/menu/input/gameplay/event changes. Frame/layout review pending before importing assets. Root KindlyPatrick credit continues.
