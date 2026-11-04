# Ladder-top basic and charged shooting — GMS1.4.1760

Delta checkpoint AFTER user-reported working charging controller (no errors). Back up existing scr_mm5_player_try_buster and player Draw first. No new player Step hooks, movement/ladder-region edits, sounds, manager events or Create code.

## 1 Import one sprite FIRST

Sprites > Mega Man > MM5 > Buster > Charging > Player Colours:

Create Sprite named EXACTLY spr_mm5_megaman_ladder_top_shoot_charge (no _strip6 in resource name).

Edit Sprite > File > Create from Strip, source spr_mm5_megaman_ladder_top_shoot_charge_strip6.png:
- 6 images,6 per row; each40x40.
- All offsets/separations0.
- Manual origin X16,Y16. DO NOT Center20,20. No crop/resize/remove background.
- Verify6 subimages,40x40; face intact. Frames are six charge banks, not automatic animation.

Existing spr_mm5_megaman_ladder_top_charge is NON-shooting: keep it unchanged. New bank0 provides ordinary top shooting; banks1..5 provide charging colours while firing. Separate ordinary-shoot resource isn't necessary for current charge-aware Draw.

## 2 Replace SAME helper Script contents

Scripts > Mega Man > MM5 > Buster > scr_mm5_player_try_buster:
Replace whole script contents with included scr_mm5_player_try_buster.gml. Do NOT create a duplicate resource. Only functional difference from prior controller helper: removes old early-return at `on_ladder && y < ladder_instance.bbox_top`. Settled top firing is now measured, so that guard is no longer appropriate. Keep slide/slide-at-start guard and every other gate, threshold/audio rule unchanged.

## 3 Replace ONLY character drawing block

obj_mm5_megaman > Draw > Execute Code:
Replace current character drawing block with included obj_mm5_megaman_draw_charge_replace.gml. KEEP debug/reference drawings afterward. Don't append a second character draw or replace the entire Draw event.

Only change from prior block: ladder_top INSIDE buster_pose_timer>0 branch now draws spr_mm5_megaman_ladder_top_shoot_charge. Non-shooting ladder_top still draws spr_mm5_megaman_ladder_top_charge. No sprite_index or collision-mask change.

## 4 Test

1. Restart. Climb near top until back-facing ladder-top art appears, release directions to stop while still attached. Tap X: top-shooting pose/ordinary shot, then original non-shooting top pose after16updates. Both directions (Left/Right+X chooses facing).
2. At same location hold X through intermediate (~0.8s) then release. New initial-shot pose, charge colours/sound, intermediate release/pose. Colours return blue. Repeat full (~1.5s), with initial basic clear of view.
3. Repeat with charge built on ladder body BEFORE entering top band; release at top, both levels. This approach timing is user regression testing, not independently certified all-transition ROM trace.
4. While attached at top, fire/release while Up/Down held: no vertical movement for16updates; movement resumes17. On downward crossing of top/body boundary normal climb art should resume. Don't change old geometry to compensate for discrepancies; report exact position/input.
5. Ordinary ladder body, standing/air, slide and audio cleanup must still work. No slide shot/sound. Temporary F6 event remains removed.

Report first error/event/line or visual mismatch. New resource name must match exactly; missing Sprite identifier otherwise appears as an uninitialized instance variable in GMS.

## Evidence / limits

ladder-top-buster.mjs executes original player/firing/animation routines against synthetic spatial ladder (class20 for probeY>=128, empty above).64 cases: initialY124/127/128/140, both facings, tap/hold/controlled mid/full release/ascending basic/descending mid/natural mid/full held releases. No ROM patches. Meter40/80 only injected in controlled release cases; natural-hold cases independently prove thresholds/audio. This is NOT a natural stage ladder/ledge encounter.

Settled topY124/127 has terrain00,00,20 and original animation14hex. Basic/mid/full selects15hex,16update pose/vertical pause; first resumed displacement17 is1.296875. Shot direction/offset/speed, all-clear allocation and audio requests unchanged. Natural press3, charge22 request36, mid release44/full84. Top-held counter advances normally. Charged variants share original shooting pose.

extract-ladder-top-buster-art.mjs captures live OAM/CHR animation15hex for all three emission levels, repeat samples6/15; exact body/face components equal between levels. Face tile24hex preserved. Six native palette banks affect body only; alpha/face unchanged, no opaque clipping. Canvas40x40,origin16,16. Approved Mesen0.9.9 palette through JSNES; not direct Mesen runtime captures or generated/repainted art.

Actual GML-source mock:32 settled-lip cases compared through combined existing Step + new helper/Draw + actual projectile sources. Native viewport offset8 supplied for X136 tests; otherwise wider/shifted cleanup can differ legitimately. Counters,poses,projectiles,requests,top/climb draws,16pause/first resumed displacement agree in stated cases. All previous controller/basic/slide/audio/charged source regressions pass. This is not a GMS compiler/runtime guarantee.

Existing rectangular GMS lip band/entry/exit geometry is UNCHANGED. It is a functional band, not proof every position is native-equivalent: sampled native settled top locations are4px/1px above ladder128. Synthetic no-platform ascending probe can release attachment on first resumed step; GMS exit geometry is not asserted equal there. Natural platform/class40 top exit, capture/drop/jump/simultaneous endpoint priorities, collision/hurt/enemy interactions remain unverified. Do not claim complete ladder-top engine1:1 from these controlled shots.
