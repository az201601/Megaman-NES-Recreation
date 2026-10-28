# MM5 ladders — measurements in progress

## Existing project / user checkpoint

User confirmed normal movement, jump/release/ceiling/landing, and basic idle/walk/air animation are working and visually accurate. Last guidance was to set debug_player_reference=false; do not assume that local GMS change has been made. Existing region geometry stays MM1 Cut Man: obj_stage_ladder at (80,96,16,96) and (160,96,16,32), tops at Y96; region centers X88 and X168. These geometry values do not determine MM5 climbing speed.

## Direct controlled ROM result

`tools/rom-recovery/ladder-speed.mjs` uses the supplied USA ROM and JSNES 2.1.0. Requires mm5-start / mm5-stage snapshots. It enters normal player state 3 and initializes its vertical magnitude from the original entry code ($03D8=$4C, $03F0=$01). It supplies ladder class $20 at the original player terrain-result writes ($48..$4A) to prevent an immediate no-ladder exit. This is a synthetic continuing ladder, not natural stage traversal or a full entry/exit test.

Original movement execution, 12 updates each:

- Up: -1.296875 pixels per update.
- Down: +1.296875 pixels per update.
- Neutral: no vertical displacement (holds position).
- X remains unchanged; state stays 3.

The original entry code snaps integer X using `(X & $F0) | $08`, which centers a 16-pixel tile. This is code inspection, not a measured horizontal capture tolerance. It must be adapted deliberately to the project's rectangular ladder regions rather than assuming every room coordinate is a native NES tile map.

## Next local GMS step (initialization only)

Objects > Player > MM5 > obj_mm5_megaman > Create > Execute Code: append the fields in `Assets/Mega Man/MM5/Controller/obj_mm5_megaman_create_ladder_append.gml`. Do not replace Create or modify Step yet. The new variables are inert until detection and movement are integrated.

## Still unverified / not implemented

- Natural bottom / airborne / top entry tolerances, endpoint transitions, exact release and obstruction behavior.
- Jump/drop combinations, including fresh versus held input.
- Climbing and top-transition sprite extraction and frame cadence.
- The special support/descending behavior of obj_stage_ladder_top (currently not queried by the controller).
- No complete ladder system is installed by this checkpoint; ordinary jumping/physics/animation remain unchanged.

Do not parent ladders/tops to obj_stage_solid or turn the entire ladder volume into a permanent solid. Keep current stage music and removable Super Arm blocks intact. No new climb sound is assigned without verification.

## Detection checkpoint (instructions supplied; user test pending)

User reports the three ladder-state variables have been added. Append ladder_candidate=noone, ladder_top_candidate=noone and debug_ladder_detection=true to the same Create event. The repository's full Step now appends detection-only region queries at its end (reference center, then upper-body Y-11; separate feet-point ladder-top query). Append obj_mm5_megaman_draw_ladder_append.gml after the existing Draw code, retaining draw_self(). This displays LADDER / TOP in the default font and restores draw colour/alpha. It deliberately leaves the default font selected; GMS 1.4 has no draw_get_font() getter.

This is project-region detection, not a completed ROM-equivalent capture-tolerance or attachment rule. Test the lower floor at X88,Y180: LADDER should appear over the left ladder. At X48,Y180 it should disappear. No Up/Down behavior, X snapping, gravity suppression, top support, climb artwork or movement is installed. Do not use the roof opening for a standing/top-support test yet: the controller still ignores ladder tops as terrain. Existing animation/physics are unchanged.

Compatibility correction: user encountered unknown function draw_get_font() in GMS 1.4. Removed the unsupported font getter/restoration from the Draw appendix. Keep draw_set_font(-1), which selects the default font. Physics and detection are unchanged.

## Attachment checkpoint (supplied after user confirmed region detection)

The Step source now starts with the separately provided `obj_mm5_megaman_step_ladder_attach_prefix.gml`. This is a deliberately temporary attachment-only test: held Up plus a fresh center/upper-body region query attaches and snaps X to the rectangular region center (X88 / X168). While attached, fall_speed=0 and an early exit skips all ordinary movement/physics/animation selection. Draw/debug labels still run. Holding/releasing directions does not yet climb or detach; restart the test to reset. Standing art is a temporary placeholder. No sprite-mask or stage-geometry changes. Destroying the attached region clears attachment and resumes normal physics.

This adapts the region detection to the project; it does not establish ROM capture tolerances or endpoint rules. No ladder-top standing/descending support is added. User attachment test pending: move across the left ladder without Up (no snap); approach slightly off-center and press Up (snap to88); release Up (hold still). Regress normal movement away from ladders in a fresh run.

## Bounded climbing checkpoint (user confirmed grab/center/hold)

Create adds ladder_moving=false. Replace only the attached-ladder block with obj_mm5_megaman_ladder_climb_block.gml. Up/Down apply the measured 1.296875 speed; neutral stops; both keys cancel as a project input convention. X remains region-centered. Y is bounded to [bbox_top-feet_offset, bbox_bottom+1-feet_offset], i.e. 84..180 for the left ladder and 84..116 for the right ladder. These bounds are a temporary adaptation to project geometry, NOT the NES endpoint-transition timing. It stays attached at both ends. Normal physics and visual selection are skipped.

Still no exit/drop, detached ladder-top support, ladder artwork, or obstruction resolution inside ladder volumes. Test only existing clear regions; do not add solids inside them. No climbing sound is assigned. Test Up/Down, neutral hold, endpoint clamping, fixed X; restart to reset. Runtime validation pending.

## Fresh Jump / direction combinations — controlled ROM matrix

User requested confirmation of direction held during and after Jump on a ladder. `tools/rom-recovery/ladder-release.mjs` tests the unchanged player routine with continuing synthetic class $20 ladder terrain. Two neutral updates establish fresh button state before the test (important: a held button is not a fresh Jump). Not a naturally reached ladder or a top-marker $40 test.

- Fresh Jump alone, Left+Jump or Right+Jump: exits ladder state 3 to state 0 on the release update, with unchanged Y and downward velocity initialized to 1. Next update enters falling state 1, moves down 1, and stores 1.25; subsequent gravity increments are .25. No upward impulse.
- Left/Right held with Jump or applied on the following update: normal horizontal airborne motion +/-1.296875 begins on the following update; it does not change the vertical fall in these unobstructed tests.
- Up+Jump or Down+Jump: stays attached and climbs in the held direction. A fresh Jump does not release while either vertical direction is held.
- Up applied on the update after release (or after one falling update): reattaches to the continuing ladder, even while Jump remains held. No post-drop cooldown was needed in these mid-ladder tests.
- Down applied after release: continues falling; it does not re-grab the ladder body here. This does not establish Down entry from a ladder top.
- Press Up+Jump, release Up but continue holding Jump: stays attached. Release/repress Jump with vertical input neutral then drops.

The field named downwardVelocity in the raw JSON is converted from the stored engine Y magnitude/sign; in attached ladder state actual Up/Down direction is selected separately by input. Use measured position deltas for ladder direction. These findings are not yet integrated into GML. User's bounded climbing test has passed; bottom exit, top transition and drop integration remain pending.

## GML drop checkpoint (bounded climbing confirmed by user)

Insert obj_mm5_megaman_ladder_drop_insert.gml after the Up-to-grab block and before the attached-climbing block. Fresh Space with neither Up nor Down held clears attachment, sets downward fall_speed=1, displays the air pose, and exits the Step without moving. Normal physics/horizontal controls resume on the next Step. Up+Space/Down+Space do not release; releasing vertical input while Space remains held does not create a fresh press. No upward impulse, new Create fields, sound request or cooldown is added. Holding Left/Right is allowed.

Existing region-based Up capture remains enabled, so Up can re-grab after release while overlapping a ladder. Its current before-physics capture order is not an exact copy of the ROM's fall-then-capture boundary phase. Do not claim frame-perfect re-grab timing. Bottom exit, top transition/support and ladder art remain pending. Test this halfway along the ladder, not at the temporary endpoint clamps. User GMS validation pending.

## Supported bottom-exit checkpoint (drop/directional tests confirmed)

Insert obj_mm5_megaman_ladder_bottom_exit_insert.gml inside the attached-climbing block immediately after ladder_moving is computed. Descending to ladder_y_max releases only if one of the three normal feet probes detects obj_stage_solid (including child Super Arm blocks). It restores grounded idle and zero vertical speed, then exits the Step. Normal movement resumes the following Step, so a simultaneous fresh Space is not processed a second time as an ordinary jump during the exit update. No new sound is assigned to this transition.

Current geometry: left ladder ends at Y192, reference Y180 on the floor. Right ladder ends at Y128, reference Y116 on a removable block. If support is absent (e.g. block later removed), this checkpoint deliberately remains attached at the temporary bound; falling from an unsupported ladder end is not yet implemented. Top endpoints/ladder-top support still pending. User test pending: descend left ladder to floor, walk away, re-grab; mid-ladder release/hold unchanged. This is a region-based adaptation, not a natural-ROM endpoint timing certification.

## Ladder-top support checkpoint (bottom exit confirmed)

Before automatic top release, create scr_mm5_player_supported in Scripts > Mega Man > MM5 > Collision. It extends the three floor points to include obj_stage_ladder_top while the caller is not rising. Replace only the two normal-physics grounded-probe assignments with this helper; ladder bottom-exit still requires actual solid terrain.

The normal downward sweep now optionally promotes a ladder-top marker to hit_solid only if the feet cross its bbox_top from above during that substep. It does not participate in wall or ceiling queries. The existing landing branch snaps to its top and plays the approved landing sound once. Ladder regions/tops remain non-Solid and separate from obj_stage_solid.

This is one-way support adapted to GMS region geometry, not a claim of exact MM5 ladder-top transition cadence. No top-detachment or Down-entry behavior is installed yet. User tests pending: stationary at (88,84); fall from (88,60) onto Y84; restore (48,180). Existing climbing still stops attached at Y84 for now.

## Functional top transitions (top standing/landing confirmed by user)

No new Create/Draw changes. Before Up capture, Down can enter from a detected top marker only when grounded with zero vertical speed. It finds the actual ladder region at that marker's top plane and attaches, aligning Y to the support plane and X through the existing climb block. Down while falling through a ladder body still cannot grab.

After climbing movement, before bottom exit, Up at ladder_y_min finds the top marker and clears attachment into grounded standing at marker.bbox_top-feet_offset. It skips ordinary physics for that update. Existing one-way support retains the standing player in the opening on following updates. Holding Up alone does not recapture from this position because neither the reference nor upper body overlaps the ladder volume.

Current bounds produce (88,84) / (168,84) for the two tops. This is a functional GMS rectangle-region adaptation, NOT a claim of ROM-exact over-the-lip pose timing, capture tolerances, or simultaneous Down+Jump priority. Standing art remains a temporary ladder placeholder. No new transition sound is assigned. User test pending: climb to top, walk away/back, Down from TOP label, descend, return Up; normal jump/drop and bottom exit regressions.

## Artwork extraction started after complete route passed

User reports the full top/bottom route is flawless. New extract-ladder-art.mjs uses controlled class inputs to extract two climb cells and the top pose. All cells are 32x40, origin16,16. Active climb phases change at 9 updates; neutral holds phase and the renderer ends with timer1 after the handler's reset. Assets include a provenance/import guide; animation selection is not connected by this checkpoint. User imports and visuals pending.
