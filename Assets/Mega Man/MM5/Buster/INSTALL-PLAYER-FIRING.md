# Basic X firing — player hooks (GMS1.4.1760)

Prerequisites confirmed: all corrected shooting sprites imported; projectile object Create/End Step installed. X accepted. Ensure approved sound resource snd_mm5_buster_shot exists under Sounds > Mega Man > MM5 > Buster before running; sound-resource import was not separately explicitly confirmed. This checkpoint adds basic firing, not charging/enemies/damage.

Back up current player event code first. DO NOT replace entire Create, Step or Draw. The packaged GML files are snippets except the new named Script resource. Existing movement, collision, landing audio, dust, slide overhang fixes, camera and diagnostic drawing must remain.

1. Scripts > Mega Man > MM5 > Buster (create missing groups): create Script scr_mm5_player_try_buster. Paste matching .gml contents into Script editor, no GMS2 function wrapper.
2. Existing player obj_mm5_megaman (Objects > Player > MM5) > Create > Execute Code: APPEND obj_mm5_megaman_create_buster_append.gml. Keep all old initialization.
3. Same player > Step > Step > Execute Code: put obj_mm5_megaman_step_buster_prefix.gml at VERY TOP, before ladder checks/overhang prefix/any possible exit. Do not remove any old code.
4. In that same Step find the attached-climbing assignment:

    ladder_vertical_input = keyboard_check(vk_down)
                          - keyboard_check(vk_up);

   Immediately AFTER the complete assignment, insert obj_mm5_megaman_ladder_buster_insert.gml. This is before ladder_y_min/ladder_y_max, before ladder_target_y or any vertical displacement. Do not put it in Up/Down ladder-entry code.
5. Same Step: immediately BEFORE the existing // VISUAL SELECTION comment, insert obj_mm5_megaman_normal_buster_insert.gml. This is AFTER movement/collision/landing audio/overhang cleanup. Do NOT put it at bottom below animation/ladder-detection. Together with step4 there are TWO try_buster call sites: attached climbing exits before normal movement so only one runs per update.
6. Same player > Draw: replace ONLY the existing if(sliding){draw_sprite_ext(... y+2 ...);}else{draw_self();} visual block with obj_mm5_megaman_draw_buster_replace.gml. Keep all diagnostic drawing after that block. Do not append another character draw. This switches drawn art only; normal sprite_index/mask/animation/controller remain intact. Sliding retains existing +2 artwork offset.

Do not edit projectile object again, add room projectile instances, change room speed, move old events to End Step or add audio calls anywhere else. Projectile End Step handles one movement phase after player Step creation. Do not also move projectile in Create/Step/player scripts.

## Test checkpoint

- Stand right/left; tap X: one shot, one approved sound, matching shooting pose. Holding X does not auto-repeat (charging not implemented).
- Tap rapidly: never more than three active shots; fresh taps work again after a shot disappears. Pose16 updates is NOT a cooldown. Blocked attempt must not play another sound or refresh pose.
- Walk, jump, turn after firing: existing movement unchanged; shot retains its fired direction and fixed Y. Walking and air shooting poses must include face. Existing shots do not inherit player movement.
- On the ordinary ladder body, hold Up/Down and tap X: shooting stops vertical climbing16 updates then resumes automatically if direction held. Left/Right+X chooses shot facing. Neutral ladder stays attached. Do not judge ladder endpoints/drop priority as native-complete yet.
- While sliding X produces no shot/sound; dust and all previous slide/tunnel/ledge/ceiling behaviour must remain unchanged. Exit/cancel-frame fire deliberately withheld until measured.
- After16 updates (~0.27sec at60steps/sec), normal art returns. Landings retain approved landing sound exactly once. Debug overlays remain present if enabled.

Report compiler errors verbatim with event/line, or visible behaviour before further changes. Source/mock success is not a GMS runtime pass. Don't proceed to charging until this basic checkpoint is user-verified.

## Evidence and intentionally limited scope

Measured1075/256px/update speed, integer spawn floorX+16/right or-15/left and floorY-1, same creation-update movement, three active projectiles, fresh input,16 pose and continuous-ladder pause. Helper fires after ordinary movement or before attached ladder motion. Model executes actual GML-subset helper/hooks/Draw and combined Step with mocks; checks both paths, no double call, static rapid reuse29, blocked no-refresh/sound, direction/fractional coordinates and slide gate. Existing slide/dust regression model also passes. No GMS compiler/runtime in sandbox; user tests required especially End Step creation-update scheduling.

View0/room reference-edge removal is a GMS adaptation checked against static256px original traces, not native scrolling certification. No terrain/enemy Collision events, damage, charge, held-X-through-slide buffering, native ladder-top/drop/slide-exit priorities implemented. Top lip shots deliberately blocked; regular body-ladder shooting enabled. These are explicit scope guards, not measured native behaviour claims. Render-only shooting art avoids changing collision masks or player sprite_index.
