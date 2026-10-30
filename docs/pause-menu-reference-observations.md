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

## Separate lives counter requested

User requests moving life icon (explicitly not health) and adding numbers. V2 original head moved from top-right to spare row below R.MARINE at136,142; LIVES label156,146 with03 example at212,146. Header renamed HEALTH at96,19, health bar152,18 unchanged. Tests assert relocated head exact source and native health bar bytes unchanged. Both selected snapshots/metadata updated.03 is illustrative, no starting-lives rule/gameplay implementation. Placement pending user review; spare slot now used for counter.

## Corrected header: no PAUSE text, lives outside utility grid

User rejects lives in weapon/utility section and says PAUSE text not needed. Supersedes previous spare-row lives placement: head16,13 plus sample03 at36,19 now top-left header; PAUSE removed. HEALTH96,19/bar152,18 retained, exact source pixels checked. No lives drawn in grid; spare utility row free again. Both v2 snapshots and metadata updated, no gameplay changes or starting-lives decision.

## Upgrades page and original utility icon recovery

User requests icon-based separate Upgrades page, selected-item descriptions, cleaner UPGRADES navigation position; explicitly identifies MM6 Energy Balancer source and asks to fix missing Rush Jet/Marine. recover-utility-menu-icons.mjs captures MM4 native grey/selected Jet144,112 and Marine144,96; MM6 original Energy Balancer120,192. Controlled inventory reveal, NOT natural acquisition. MM4 B1..BD=FF broad inventory fixture; MM6 single0696=01. Disassembly branch38:92E0 cross-checked against supplied ROM bytes AD9606F006A9462028CB00, invokes draw46 only if owned. Docs and four evidence PNGs record provenance. No repaint, per-icon<=4 colours, PNG roundtrip exact tests.

Main draft now no placeholders, uses MM4 Jet/Marine originals; no E.BALANCER label at bottom; centred UPGRADES button. Separate upgrades v1 originalMM6 icon plus external cyan selection frame, contextual name/description panel, centred WEAPONS return. Only Energy Balancer present, future items undecided; no fake placeholders/icons. Name/description static selection illustration, not implemented cursor or mechanics. Header/top-left lives and health retained byte-exact; bottom frame preserved. Three scripts rerun PASS (including both main selection snapshots); no GMS files/ROM patches/gameplay changes. Seven KindlyPatrick adaptations/credit untouched.

Exploration note: low-RAM flag probes and broad MM6 block probes did not establish acquisition flags; do not use them as gameplay proof. ROM branch established0696 and exact native menu art in final recovery. Temporary atlas/probe captures, downloaded disassembly snippets and emulator states remain ignored.work, not deliverables.

## Upgrade selected-colour follow-up

User “yes” approves separate upgrades arrangement and requests coloured upgrade-page icons. build-upgrade-icon-states.mjs generates original MM6 Energy Balancer shape with custom selected blue/cyan/white palette (NES0F,11,21,30); untouched original grey remains unselected. Exact black/foreground mask and alpha asserted, original source byte identity/SHA256, four colours and PNG/strip roundtrip tests PASS. Grey/colour comparison and2-frame strip added in Adapted Upgrade Icons/. Upgrades selected preview uses new coloured PNG, same header/frame/name/description. Explicitly custom colour adaptation, not native MM6 selected palette; originalCapcom source, not KindlyPatrick sheet. Only current upgrade Energy Balancer, no speculative icons. Colour approval pending; no GMS/inventory/input changes.

## Audio choices: MM5 open and cursor

After approving coloured upgrades implementation direction, user chooses MM5 Start-to-menu sound and adds MM5 cursor movement. record-menu-open.mjs and record-menu-cursor.mjs recover separate full-APU effects from supplied MM5 USA, original inputs and sound driver: open29hex, cursor27hex. F0 music-stop used only for recording; zero-tail verified. Cursor take begins only after open sound and extra silent150 frames, freshRight changes Buster->Coil (Buster now native grey pixel-checked). No mixed opening/cursor tails or extra commands. Native input/request fixture, not claim hardware/Mesen execution. No clipping/normalization/fades/channel isolation; silence-only trim5ms each side, exactPCM slice tests PASS.48kHz stereo PCM16, open0.3571458333s, cursor0.2636666667s.

Assets/Audio/Mega Man/MM5/Pause Menu/ has2 WAVs, recovery JSONs and GMS1.4 resource/import guide (Sounds > Mega Man > MM5 > Pause Menu). Names snd_mm5_menu_open / snd_mm5_menu_cursor. User source choices approved, no claim user imported/installed or auditioned these new exports. Eventual controller plays open once on closed->open; cursor only on actual selection change, no every-Step/Draw duplication; input repeats/page transitions still to implement/decide. No close/confirm/cancel sounds chosen. No player/menu/room/music GML changed; F0 capture stop is NOT requested runtime music behaviour. Menu visuals/icons approved, working controller still pending.

## Rolling Cutter original fill correction — resource setup paused

User confirms both MM5 menu audio exports correct, agrees resource-import step, then interrupts to correct Rolling Cutter: original filled colour had been removed. Selected map source112,112,112 -> black0F was the issue. It now maps to selected gold27/EA9E22, preserving original fill positions and white/grey blade shading; four colours total. Explicit regression prevents mapping that fill back to black. Original grey Cutter/all other icons unchanged; selected strip7/pair strip14/comparison/Cutter-selected menu regenerated. Corrected art pending user review before continuing imports.

Resource setup not delivered or installed. Preparatory natural MM5 selectedCoil recovery script addition and Reference/mm5-coil-selected-original.png remain in-progress workspace changes, separate from Cutter correction; no resource ZIP generated, no GMS/controller changes. Don't claim import checkpoint completed.

## Rolling Cutter: original grey, NOT gold

User rejects gold correction and requests checking original source colour. Original KindlyPatrick sheet viewed again, actual top-row Cutter source RGB112,112,112/184,184,184/255,255,255/0,0,0. Selected Cutter now source-grey NES remap00(666666),3D(B8B8B8 exact184grey),30(FFFEFF),0Fblack; casing3D, no gold anywhere. Original grey fill preserved in place; no pixels removed/repainted. This supersedes previous gold-fill proposal. Source184grey uses exactNES3D rather than173grey. Unselected Cutter and other six icon pairs unchanged. Tests pin entire Cutter map/casing so gold or black-fill cannot regress;4colour/PNGpair tests PASS; main menu regenerated. Resource packaging remains paused with preparatory Coil changes untouched.

## Approved correction, plural credit, import checkpoint

User approves original-grey Cutter (“they look good”) and asks to proceed. User explicitly corrects desired credit to **Sprites by KindlyPatrick** (plural). RootCREDITS, active review footers and source/selected manifest credit fields now use exact wording; technical adaptation provenance and permission caveat retained, no credits screen claimed implemented. Both menu sounds previously user-confirmed correct.

Natural MM5 Right capture also recovers selected original Coil16x16; distinct from grey and<=4colour asserted. build-pause-import-pack.mjs packages8 Sprite resources (2blank panels,22weaponstates,2upgradestates,3tanks,life,38fontglyphs,2fullmeterstyles) and2approvedSound WAV copies, exact resource map/credit/importguide. Every weapon strip frame row checked against source, corrected grey Cutter included, no flattened sample counts/text embedded in panels. Only resource checkpoint; no objects/scripts/events/room/player/HUD modifications. Meter styles full states only, not claim29filllevels/inventory implemented. User must manually import/confirm; don't claim installation.

## E/W/M selected colours and Start-use rule

User requests coloured E/W/M when selected and specifies pressing Start uses one. Added Tank Icon States/: original grey geometry retained, custom selected blue11/cyan21/white30 on black0F (<=4 colours), same letters/casing/alpha/black mask. W remains letter-only flipped M; selected W/M outside-letter casing identical.6-frame strip order Egrey/Eselected/Wgrey/Wselected/Mgrey/Mselected, individual16x16 and4x comparison. New colours pending user review. Import pack spr_mm5_pause_tanks resource now6 rather than3 frames; oldstrip3 removed from pack, guide/manifest/ZIP updated. Existing imports replace only same tank resource, no duplicate.

Start action recorded: selected tank uses one, not just close. No GMS controller/inventory consumption or refill implemented; zero count/full-meter eligibility/effects/closing behaviour still integration decisions/tests. No claim tanks function yet. Existing grey art/other sprites/sounds unchanged. Restored stale index safely only after all remote-tracked file hashes matched workspace; no source changes lost.

## Imports confirmed; interactive UI test checkpoint

User confirms “everything imported” (including tank6). Controller UI Test/ now provides8 GMS1.4-style files:4 scripts(text/meter/box/navigation), test object Create/Step/DrawGUI/RoomStart, detailed manual instructions and separate ZIP. New isolated rm_mm5_pause_menu_test only; no stage/player/HUD/room sources modified. Enter represents Start, arrows navigate15 main targets with18/6 repeat; cursor sound only on changed target. Upgrade icon/return selection plus contextual description; Escape back/close. Open sound once on entry/reopen. Start on selected tank decrements only explicit TEST inventory, fresh-press, zero floor, no healing/refill or real consumption. Test stays open after tank use for inspection, not final close-policy decision. All entries accessible only for UI testing, not actual unlock rules.

Sampleshealth14/lives03/energies14(Buster28)/tanks02,02,01; not real inventory or approved defaults. Original8 sprites/2 sounds required, import guard22/6/2/38. display_set_gui_size256x240 matches installed HUD. No world freeze, player weapon setting, real health/lives, READY/charge integration, automatic EnergyBalancer or tank effects implemented. Next stage integration only after user test passes. test-pause-ui.mjs graph connectivity/bounds, counter edge/zero model, repeat timing, originalfont/resource references/static GMS2/unsupported API exclusions PASS. Not executed in GMS1.4; user compile/render checklist required. Credits wording remains Sprites by KindlyPatrick; no credits screen added.
