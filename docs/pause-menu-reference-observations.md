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
