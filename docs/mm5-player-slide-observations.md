# MM5 sliding — measurement and preparation checkpoint

## Status

User has approved normal movement, jump/audio/animation and the complete current rectangular-region ladder implementation, including ceiling obstacles, downward solid landing and unsupported bottom release. User also disabled LADDER/TOP diagnostic labels. Preserve this accepted behaviour.

Sliding research started; no slide movement or artwork has been installed. First user instruction is Create-state preparation only. No GMS runtime/compiler is available here.

## Reproduce

With the supplied original USA MM5 ROM, dependencies and generated Napalm Man stage snapshot available:

```
node tools/rom-recovery/slide-values.mjs
```

Output `.work/slide-values.json` is regenerable reference data, not a distributed game asset. The probe starts from a relocated normal player state0, not forced slide state2. It supplies spatial terrain classes at the original raw-class mask sites C551/C659 (JSNES PC one less), preserving original entry/movement/clearance logic. Eight synthetic-floor warmup updates precede the input schedules so a fresh A is genuinely grounded. Normal gravity only. This is a controlled synthetic floor/tunnel/wall/edge experiment, not a natural encounter or certification of all metatile/object cases. Background stage logic remains running; sound requests are logged but not isolated to the player. Do not label every sound command as slide audio.

## Observations with assertions

- Fresh A while Down is held enters slide; Down can predate A or be pressed on the same update. Already holding A then pressing Down does not slide (the grounded A has already jumped).
- Speed 2.5 px/update, no acceleration. Left at entry selects left; right-facing/no horizontal input selects right.
- Duration counter is initialized to $1A (26). Entry already moves 2.5 and decrements to25. Last update moves the 26th time then exits to state0, total65 px on clear floor. Counting only displayed end-of-update state2 would miss the last move.
- Releasing Down/A does not shorten the slide. Keeping Down/A held does not auto-repeat once it ends.
- Opposite direction on update8 sets opposite facing, moves 2.5 backward that same update, then ends slide on open floor (timer reset). Not simply an instant reversal into another full slide.
- Fresh A without Down on update8 jumps if clearance permits: state1, Y delta -5 from the current slide reference. Fresh Down+A does not jump or restart the timer.
- Tunnel solid band x160..223/y160..175 over floor192 blocks standing: slide continues at counter0 until standing clearance. Fresh A under that ceiling is blocked. This does not yet establish all clearance tolerances or reverse/edge+ceiling combinations.
- Full-height wall x176 stops the slide early, state0 on update12 at X161, counter still17. Widened slide probes require separate collision handling, not reuse of standing width blindly.
- Floor ending at x176: slide leaves support, state0 then state1 in the observed updates. Exact drop phase/clearance rules need more study before implementation.
- Slide reference Y shifts +2 on entry and -2 on ordinary standing exit; do not confuse this with sinking or changing world-floor height. Relative jump-cancel and edge Y behaviour require care when adapting the existing GMS fixed feet reference.
- Animation ID $10 during normal slide. Artwork and any required player sound still need extraction/validation; no audio is being added based on unrelated background requests.

## Original-ROM code references

Switchable player bank ROM offset0x36010 (bank1B); addresses below are CPU addresses in that bank.

- 8092 checks new A; 809B-80A2 checks held Down under normal gravity.
- 80C2-80E7 selects direction and checks entry clearance.
- 80F0-80FF initializes duration26/state2/speed$0280 (2.5).
- 811F-8128 adjusts reference Y using table8EF1 (+2 normal gravity).
- 8299-82C5 checks support and jump/standing clearance.
- 82C8-82DD opposite-direction input changes direction and clears timer.
- 82DF-82F0 moves first, then decrements timer.
- 82F2-8309 checks standing clearance and restores standing reference.
- 830C-832A restores ordinary state/speeds/animation.

## First GMS resource/event preparation

**Objects > Player > MM5 > obj_mm5_megaman > Create > Execute Code**: append the five variables from `Assets/Mega Man/MM5/Controller/obj_mm5_megaman_create_slide_append.gml`. Do not replace Create or change Step/Draw, collision masks, sprite origins or sound events. Preparation alone deliberately does not enable sliding. User installation is pending.

Next checkpoint: extract/import the slide pose, then integrate a measured slide state in small testable steps, with separate standing-clearance and slide-body probes. Preserve ladder entry/drop priorities deliberately rather than accidentally intercepting their keys.

## Artwork checkpoint

User confirmed the five Create variables installed. `extract-slide-art.mjs` now extracts actual slide entry in the original Napalm snapshot (no class injection/state2 forcing). Static right-facing 32x40 pose, origin16,16; live samples2/5/10 equal, eleven OAM components, no clipping. Camera-relative alignment and previous-frame reference checked. Separate trailing dust excluded. See Assets/Mega Man/MM5/Sliding/README.md. User sprite import and movement integration remain pending.

## Standing-clearance helper checkpoint

User confirmed slide sprite imported. Before enabling slide movement, add `scr_mm5_player_can_stand` under Scripts > Mega Man > MM5 > Collision. It accepts standing-reference X,Y in player context, tests the full adapted standing interior X±7 / Y-head_offset through Y+feet_offset-1 against ordinary solid parent/children, and excludes one-way ladder tops. This conservative rectangle is an intentional rectangular-terrain adaptation, not a claim to reproduce native clearance probe dimensions. Current standing-reference coordinates are supplied, NOT native slide-shifted Y. No caller is installed yet, so ordinary movement/ladders cannot be affected. No Create, Step, Draw or mask edits at this checkpoint. User helper installation pending.

Equivalent rectangle model passed floor-surface exclusion, low-ceiling rejection, adjacent clear gap, inclusive-edge obstructions and outside-edge exclusion. GMS compile/runtime validation remains local to the user. Future slide completion, cancellation and jumping must check clearance before restoring standing collision; never restore standing merely because the duration counter expired.

## First slide movement integration (user validation pending)

User confirmed standing-clearance helper installed. New script `scr_mm5_player_slide_step` in Scripts > Mega Man > MM5 is called after the initial normal support check and before horizontal walking; true return exits Step to prevent a second movement pass. Existing Down-from-top/Up-grab blocks now exclude sliding. Down on an actual ladder-top marker retains the previously accepted ladder-entry priority over a simultaneous slide request; attached ladder controls are unchanged. Normal jump branch suppresses Down+Space when slide entry is blocked.

First checkpoint includes fresh Down+Space grounded entry, chosen/current facing, 2.5 speed, 26 moving updates /65px, no release cancellation/held auto-repeat, opposite-direction short cancellation, and fresh non-Down Space handoff into existing jump physics when standing clearance allows. Collision rectangles conservatively test an adapted slide body X±14, Y-3 through Y+feet_offset-1, in ≤1px horizontal sweeps. Walls stop rather than penetrate; timer expiration cannot force standing into a ceiling. Ordinary solids include Super Arm child objects; top markers supply one-way feet support but do not block horizontal body clearance.

The player's world reference Y, feet_offset12 and head_offset10 stay unchanged. Draw replaces only draw_self with a sliding-only draw_sprite_ext offsetY+2; all non-slide drawing remains draw_self. This preserves accepted normal/ladder reference and mask behaviour. Stand/jump clearance receives standing-reference Y. Unlike native MM5's shifted slide reference, this jump handoff uses the existing standing-reference jump arc; the native two-pixel phase difference is not claimed exact. No new slide sound or dust effect is installed; normal movement landing sound remains present. Do not mistake lack of effect hookup for full presentation completion.

Ledge exits with available standing clearance restore air/fall_speed>=1 and resume normal collision/gravity next Step. If a combined low ceiling/ledge prevents standing, a safety falling sweep retains the small body until clearance; that combined behaviour is a deliberate adaptation pending further ROM measurement. First user test is open floor and full-height walls only; tunnel/jump-cancel/edge matrix follows separately. Fixed-room left bound14 is the adapted slide width, not the normal standing bound8.

`slide-gml-model.mjs` executes the JS-compatible subset of the actual GML with mocked GMS APIs. Assertions cover26 moves/65px, held input, opposite direction, jump handoff, tunnel expiry/clearance, walls, ledges, blocked entry and one-way support. This is not a GMS compiler or runtime substitute. User must compile and run locally. Full Step, ladder prefix and entry snippet synchronized; exact Draw replacement has its own file. See docs/mm5-player-slide-setup.md for installation.

## User validation: cancellation passed; low-tunnel test next

User confirmed all three cancellation checks pass: opposite-direction open-floor cancellation, fresh Space without Down jumps out, fresh Down+Space does not jump/restart. First slide movement had already been reported working. Palette migration subsequently installed MM5 player, MM1 menu/intro (intro explicitly tested), and stage assets without gameplay code changes.

Next temporary room test is one obj_stage_solid at48,160, instance Creation Code image_xscale=2/image_yscale=1 (32x16 roof), existing player room instance16,180. Do NOT change obj_stage_solid itself. Roof covers48..79/y160..175; floor remains192; the block at128,160 remains well beyond the tunnel exit. Initial slide ends its26-update timer atX81 still under standing-clearance obstruction; local actual-script model extends3 moving updates and stands at88.5. Also modeled fresh Space denial under roof and leftward reversal continuing crouched until clearance atX<41. GMS validation pending; short timer windows make repeat attempts appropriate. F2 shows the invisible roof. After testing remove ONLY that temporary room instance and restore player48,180. No controller/art/audio changes required.

## Low ceiling confirmed; open ledge next

User reports all low-ceiling tests are good: timer expiry retains crouch, jump is blocked under the roof, and reversal retreats safely before standing. Preserve current controller. Combined low-ceiling/ledge behaviour remains an unverified adaptation.

Next open-ledge GMS fixture: remove previous temporary ceiling. In rm_mm1_cutman_stage place one temporary obj_stage_solid at16,160; set only that instance Creation Code image_xscale=4/image_yscale=1 (64x16 platform endingX79). Move existing player room instance32,148, on its top. Keep normal floor192 and real blocks/collision unchanged. Start rightward slide, release Down/Space and horizontal input; all wider feet lose support atX94.5 on movement25. Actual-script mock model asserts air pose, groundedfalse, slidingfalse, fall_speed1, unchangedY148 on that handoff update. Subsequent normal physics should land on floor at referenceY180 with the existing landing sound; model does not execute ordinary physics, so that landing and air controls require local runtime validation. Repeat with Right held to check air control, noting real Super Arm blocks may then be encountered farther right. Remove only this temporary platform and restore player48,180 afterward. No code/asset changes for user; runtime confirmation pending.

User confirmed the raised open-ledge runtime test passes: air-pose handoff, falling, normal landing sound and air control. Temporary platform cleanup/player restoration were instructed; not independently confirmed. Combined low-ceiling/ledge remains pending and requires separate ROM measurement before claiming native-equivalent behaviour.

## Combined ceiling/ledge probe completed

User agreed to ROM measurement. New slide-ceiling-ledge.mjs passes four controlled cases (open/covered neutral, covered Right, covered Left after release). Roof does not prolong slide on loss of support: state2/animation10hex ->state0/animation04 ->state1/animation07; neutral covered trace equals open trace. This contradicts the existing crouched-fall fallback as a native state/presentation claim. See docs/mm5-slide-ceiling-ledge-observations.md for coordinates, timing, horizontal corrections and the rectangle-resolver risk of a naive gate deletion. Research checkpoint only; working controller unchanged, combined-case correction pending.

Combined-case correction now implemented in source and delivered with Create flag, three script replacements and a pre-animation grace reset; see mm5-slide-ceiling-ledge-setup.md. No crouched-fall fallback remains. Actual GML-subset integration tests now execute normal physics and walls through landing, not just the slide script. GMS user installation/validation pending; accepted normal reference/update-phase adaptations remain, native local collision corrections are not copied.
