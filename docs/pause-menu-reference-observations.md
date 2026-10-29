# MM4 / MM5 / MM6 pause-menu reference study

## User scope

Health HUD runtime confirmed working. Damage/invulnerability deferred until enemies. User requests original MM4/MM5/MM6 menu inspection BEFORE custom layout, not a copy of any one. Requirements: Buster/MM1 six weapons plus Rush Coil/Jet/Marine in same selection list with energy bars, E/W/M inventory counts, player health, no score. Power/Jet Mega Man remain undecided, not enabled features. Tank effects/caps and opening transition not finalized. Inspection is not inventory/weapon implementation.

## Source availability

All three supplied USA ROMs now local/tracked. Initial checkout and main-tree check only found MM1/MM5; upload commit d7658ce on current Arena branch added MM4/MM6. Fetched and rebased local study commit over upload, no branch switch or ROM substitution. Earlier missing-ROM message is superseded.

## Method and captures

Original ROMs in JSNES2.1.0; screenshots use approved Mesen0.9.9 default palette mapping, NOT direct Mesen runtime captures or custom/generated mockups. Natural boot/stage selection with Right away from invalid centre portrait and Start, no inventory/weapon/unlock/RAM patches. Waited900 updates after choosing stage for MM4/MM6 arrival to finish, then Start and100 updates for open menu. Initial experiments selecting centre or pressing Start during arrival didn't open menu; not mislabelled as menus. MM5 uses existing normal-gravity Napalm snapshot and natural Start.

Reproduction: inspect-pause-references.mjs (MM4/MM6), inspect-mm5-pause.mjs (MM5), then inspect-pause-navigation.mjs. Last script uses independent structured-cloned pause snapshots and fresh Right/Down/Start with90updates to settle, no input shared between cases. Ignored .work contains intermediate frames/snapshots. Three actual initial menu captures saved under docs/pause-menu-reference/ for review.

## Directly observed initial screens

|Game|Layout|Initial menu content|
|---|---|---|
|MM4|Large upper framed panel with WEAPONS / LIFE / ENERGY headings; three lower compartments|M.BUSTER left, R.COIL right, horizontal energy bars; health at top; E00 lower-left, character preview lower-middle, lives02 lower-right|
|MM5|Large WEAPONS ENERGY framed panel; three lower compartments; Mega Man V logo in unused main-panel space|M.BUSTER left, R.COIL right with bars; E00 and M00 separate lower boxes; selected-weapon character preview and lives02 share lower-right|
|MM6|Top mode/portrait + LIFE panel; weapon panel underneath; three lower compartments|NOR portrait/top health, M.BUSTER entry below, four outlined small squares in weapon-panel lower-right, E00 bottom-left, middle compartment blank, lives02 bottom-right. Do not identify empty squares/middle slot functionality from this screenshot alone.|

No W tank is shown in these initial screens. User's E/W/M trio is a custom requirement, not proof all three originals supply it. Locked weapons and Power/Jet forms not unlocked in these samples; full inventory/item behaviour not certified. Empty space doesn't imply permanent capacity/function without further study.

## Input samples actually viewed

- MM4/MM5: Right from initial Buster selects R.COIL (highlight/icon changes; Rush preview replaces Mega Man preview). Confirms Rush shares weapon-selection interface, rather than separate inventory page, in observed cases.
- MM4/MM5: Down from initial Buster selects E tank00 (tank/count highlighted). No tank consumed/tested; zero inventory.
- MM6: Down from initial NOR/top selection moves highlight to M.BUSTER entry. No unlocked adapter interaction tested.
- Start from paused state resumes stage in all three observed runs.
- MM5 original pause-open sound request29hex observed; no final WAV captured/auditioned/approved. Sparse early captures include black transition frame; no exact open/close durations or music-channel behaviour certified.

## Design implications, NOT implementation

Use a common weapon/Rush list with icon+name+horizontal energy, a clearly separated E/W/M footer, and visible health. MM6-style separate top status strip is an option, not mandatory imitation. Don't copy logos, all headers, or unrequested lives/collectibles/score just because originals show them. Capacity for optional Power/Jet may be reserved but no fake enabled entries. User still to review custom mockup before GMS resources/events; no menu/player/global-pause changes delivered here. Need separately test full inventories, confirmation/tank consumption/sounds and a genuine pause strategy for queued music/charge/audio, timers and projectiles before integration.

## Confirmed visual direction / compact-font discovery

User favours second initial concept's general arrangement, but requires custom NES-style frame, original MM5 font, original bars/tank/life/Buster/Coil/Jet/Marine icons, custom MM1 special-weapon icons matching originals. Weapon labels abbreviated; Magnet Beam confirmed M. BEAM, total11 entries. Equipment area for possible Energy Balancer and expandable custom features; Power/Jet Mega Man remain optional. No specific tank effects or full pause integration approved/implemented.

extract-mm5-menu-font.mjs recovers34 original weapon-name/counter glyph cells and map, checks exact live M.BUSTER and R.COIL tile sequences. E0..F5 is subset ABCDEGHIJKLMNORSTUWYVP, NOT ASCII alphabet: F/Q/X/Z unavailable in compact set. F.STORM/EQUIPMENT therefore need missing-glyph policy. No original pixels invented, no assumption those letters absent from all MM5 screens. Saved reference-only PNG/map; no import guide or GMS changes. Faithful custom extension vs other MM5 source requires explicit decision before final draft; don't silently approximate user-required original font. Full icon source/recovery, especially W tank and Rush Marine, still pending.

## Original MM5 full alphabet found (custom glyphs prohibited)

User directs missing glyphs sourced elsewhere in MM5, no custom lettering. New find-mm5-fonts.mjs scans original CHR A-like candidates, visual identification plus compare-mm5-fonts.mjs natural password boot validates full26 alphabet masks loaded into PPU ASCII41..5A. Bank34 letters also match ten actual pause-header glyphs exactly. F/Q/X/Z recovered from3446/3451/3458/345A. No silent custom F or font imported from another game.

Important correction: original MM5 uses more than one lettering size. Compact weapon-label A6x6 ink at1,1 vslarger header/password-font A7x7 at0,0, both8x8cells. Therefore can't claim found letters are identical to compact label set or mix sizes unnoticed. Saved comparison and original complete38-cell reference with source offsets; recommend larger original set consistently throughout custom menu, pending explicit user review before adopting. No GMS code/resources changed; custom frame/icon work still pending. Source scripts assert26 live alphabet mappings +10 pause-heading masks, preserve original digits/period/space. Does not claim pure F/Q/X/Z visibly drawn on password screen individually, only original font is loaded there and has verified ROM source.

## Larger font approved / pixel-accurate layout draft v1

User selects "the bigger": entire larger original MM5 set approved, no custom glyphs. New build-pause-layout-draft.mjs composes256x240 review image +4x preview from that font, exact available MM5 icon/bar crops and custom NES-style blue/offwhite frame. All11 labels inclM.BEAM, life panel, E/W/M counts, optional E.BALANCER and UPGRADES navigation. No GMS changes. Two-column6-row spacing leaves1 spare slot; two optional Power/Jet forms would require extra page/reflow, not misleadingly promised to fit. Seven custom MM1 weapon/tool icons and originalJet/Marine remain outlined placeholders; W is explicitly a labelled placeholder, not original recovered tank artwork (source still unverified). E/M/Buster/Coil/life/bar crops exact. Static full bars/00 counts illustrative, no inventory/weapon/tank implementations. Exact frame/layout awaiting user review.

## W tank retained / custom weapon icons draft1

User initially considered E/M only but then explicitly keeps W by flipping ONLY the M letter in original M tank vertically, preserving casing. No later-game W reference/repaint required. Custom weapon/tool icon scope seven: Rolling Cutter, Ice Slasher, Hyper Bomb, Fire Storm, Thunder Beam, Super Arm, Magnet Beam. Buster/Rush icons remain original, including Jet/Marine recovery pending. No GMS changes requested at art-review stage.

build-custom-weapon-icons.mjs creates seven unique16x16 symbolic icons in original MM5 unselected grey palette, preserves actual R.Coil2px-perimeter casing, manual interior pixel masks. Seven originals are custom artwork, not fake ROM extractions. Review shows native/enlarged with original Coil reference and approved larger MM5 font. Allbounds/4colours/unchanged casing/unique icons/strip order tested. Only unselected states, awaiting user shape review; selected variants follow. Original menu layout not modified yet. No imported resources/event changes, no new weapons implemented.

## KindlyPatrick source / adaptation review ready

User supplies227x253 icon sheet signed BY KINDLYPATRICK, directs basing icons on it, explicitly requests credit, and allows adaptation. Earlier invented symbols superseded. Full original retained; review script isolates proposed seven top-row designs. New adaptation script preserves source14x14 interior coordinates, explicit grayscale remap to MM5 native four colours, original casing perimeter/four inset corners. Comparison shows source and unselected adaptation side by side. All mapping/casing/palette/unique/strip tests pass. Root CREDITS.md records “Weapon-menu icons adapted from artwork by KindlyPatrick”; eventual in-game credits not implemented yet. No claim of ROM provenance or verified redistribution licence. Shape/adaptation runtime/art approval still pending; no GMS imports or game code changes.

User ultimate direction: eight non–Mega Man NES-inspired stages; Castlevania, Contra, Chip 'n Dale tentatively named, others unknown. Recorded separately without committing to stages/bosses/weapon effects. User agrees to continue pause menu; latest “sure” is NOT inferred approval of unseen adapted icons. Show comparison next.

## Selected icon colour proposals

User explicitly assigns existing grey icons to unhighlighted state and requests selected coloured versions. build-selected-weapon-icons.mjs adds seven selected16x16 proposals with exact source-position remaps into pinned Mesen palette, max4 colours each, unchanged casing geometry/alpha; original grey PNG SHA256 identities verified untouched. KindlyPatrick credit retained. Shapes not redrawn/scaled. Paired grey/colour review and14-frame alternating state strip prepared, palette maps recorded. Cutter has custom warm casing/black background because reference blade was grey, no claim original selected colours. Source-derived iceblue/greenbomb/firewarm/goldthunder/creamarm/bluemagnet. User colour approval pending; no GMS/gameplay/weapon palette changes. Separate originalBuster/Rush and E/W/M work unaffected.

## Approved paired states / layout v2

User “this looks good!” approves grey/selected custom icon pairs. Next agreed task places approved icons into full menu draft. build-pause-layout-v2.mjs produces Cutter-selected primary and Buster-selected alternate, same11 labels/frame/font; approved icon PNG bytes checked exact. One highlighted row, other weapon icons grey. Selection box18px matchesrowpitch, avoiding overwriting previous row's icon border. New original unselected Buster recovered with natural pause Right-to-Coil; grey-native palette verified, no RAM/colour patch.

W tank now original M casing with8x8 letter interior only vertically flipped, outside pixel identity asserted; user-approved method, still art draft not tank logic. Jet/Marine original icon recovery still pending, explicitly2 placeholders. Bar/count values illustrative, optionalequipment notenabled, no GMS changes. Source credit maintained. V2 layout/frame review pending; icon pair approval doesn't imply layout/gameplay acceptance.

## Compact names — user correction

User says design is good and requests no space after the period in weapon names: R.CUTTER, not R. CUTTER. V2 now uses M.BUSTER,R.CUTTER,I.SLASHER,H.BOMB,F.STORM,T.BEAM,S.ARM,M.BEAM,R.COIL,R.JET,R.MARINE in both snapshots and metadata. Bounds, icon pixel-identity and compact-name assertions PASS. All icon/bar/frame positions and other design unchanged. Earlier art-review sheets are historical and may retain spaced labels; current menu generator/metadata are authoritative for display labels. No GMS changes; Rush Jet/Marine placeholders still pending.
