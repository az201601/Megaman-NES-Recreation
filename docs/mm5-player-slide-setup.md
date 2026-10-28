# GMS1.4 slide movement checkpoint

Prerequisites confirmed by user: slide Create variables, slide sprite (32x40/origin16,16), scr_mm5_player_can_stand. Preserve normal physics and completed ladders. Compile/runtime test pending.

1. Scripts > Mega Man > MM5: create scr_mm5_player_slide_step and copy the full same-named GML file from Assets/Mega Man/MM5/Controller.
2. Objects > Player > MM5 > obj_mm5_megaman > Step > Step > Execute Code:
   - After the FIRST normal support check (grounded=false / fall_speed>=0 / grounded=scr_mm5_player_supported(x,y)), before // HORIZONTAL MOVEMENT, add `if (scr_mm5_player_slide_step()) exit;`.
   - In the Down-from-top entry condition at the top, add `&& !sliding` immediately after `if (!on_ladder`.
   - Change Up grab to `if (!on_ladder && !sliding && keyboard_check(vk_up))`.
   - In the ordinary grounded jump branch only, change `if (keyboard_check_pressed(vk_space))` to `if (keyboard_check_pressed(vk_space) && !keyboard_check(vk_down))`. Do not alter ladder Space-drop conditions.
   Full Step source includes all changes as an alternative/reference; do not append the entire Step to existing code.
3. Draw > Execute Code: replace ONLY draw_self() with obj_mm5_megaman_draw_slide_replace_draw_self.gml. Retain any reference/debug drawing below. No sprite origin, mask, feet/head offset, Create or stage edits.

Initial test from restored player room position48,180: clear floor to the left of Super Arm blocks. Hold Down, fresh Space facing right; clear slide should end at113,180 after26 updates, travel65px; releasing buttons doesn't stop it, holding doesn't repeat. Facing left from113 gives room for another clear65px slide. Right toward existing block at128 must stop before entering it. Grounded jump without Down and full ladder route must still work. Down+Space while on a ladder top marker keeps existing ladder-entry priority (not a slide test).

Later test checkpoints: reversal/jump cancel, low tunnels, ledges and combinations. Until those are confirmed locally, do not call this a fully validated MM5 controller. Dust and slide-specific sound remain presentation work; ROM sound logs still include background requests.
