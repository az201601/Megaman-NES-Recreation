# GMS1.4 ladder artwork integration checkpoint

User confirmed all functional region-based ladder routes and imported spr_mm5_megaman_climb (two 32x40 cells) and spr_mm5_megaman_ladder_top (one 32x40 cell). All origins are 16,16.

1. **Objects > Player > MM5 > obj_mm5_megaman > Create > Execute Code:** append anim_climb_frame=0 and anim_climb_timer=0; preserve existing variables.
2. **Step > Step > Execute Code:** reset those two counters directly after each successful ladder assignment: ladder_instance=ladder_grab_candidate in the Up block and ladder_instance=ladder_entry_region in the Down-from-top block.
3. In the attached-climbing block only, replace the temporary standing-art section with obj_mm5_megaman_ladder_animation_insert.gml. Do not replace standing artwork in the top/bottom exit branches, or airborne artwork in the drop branch. Keep the new code before the attached block's final exit, since ordinary movement's animation section is skipped while attached.
4. No movement, collision, Draw, sound or default object-sprite changes. Preserve image_xscale facing; the two baked climbing poses alternate regardless of existing mirroring.

The climbing strip advances every nine moving updates; no vertical movement holds the current phase and resets the cadence counter to 1, corresponding to the observed ROM end-of-frame state after neutral handler/render updates. The top pose is selected when the player's reference Y is less than the current region's bbox_top. This gives the lip band in the current geometry (84<Y<96, before the existing top exit runs). Top artwork is static even as the underlying cadence counter advances, matching the equal extracted top phase images.

That band selection is a functional artwork adaptation to the already-tested GMS transitions, NOT proof of native MM5 top-entry/exit temporal equivalence. No additional pause, teleport or collision change is added. Idle/air/run selection elsewhere remains unchanged.

Checks: local cadence model passed 36 moving updates (two complete two-frame loops), neutral hold/reset, and lip-boundary selection. GMS runtime still needs user confirmation: both climbing directions animate, middle release freezes, top entry/exit use the top art without world-position shifts, drop chooses air and exits restore idle/walk.

User subsequently reported the climbing and top artwork integration seems good; animation checkpoint accepted.
