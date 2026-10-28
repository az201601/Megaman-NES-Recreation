# MM5 basic movement animation checkpoint (GMS 1.4.1760)

Prerequisites confirmed by user: normal walking, wall resolution, left boundary, jump height/release, ceiling contact and approved landing sound work. Air and walk sprites have now been imported. Their resources are spr_mm5_megaman_idle (32x32), spr_mm5_megaman_walk (four 32x32 frames), spr_mm5_megaman_air (32x40). All origins must be 16,16.

## Resource / event changes

- **Objects > Player > MM5 > obj_mm5_megaman > Create > Execute Code**: append the two variable initializations from `Assets/Mega Man/MM5/Controller/obj_mm5_megaman_create_animation_append.gml`. Preserve all existing initialization.
- **obj_mm5_megaman > Step > Step > Execute Code**: append the `// VISUAL SELECTION` section from the end of the repository's full `obj_mm5_megaman_step.gml`. Place it after the landing-audio block, outside all loops/conditions. Do not append the entire Step file under an existing Step; that would run physics twice.
- **Draw event** unchanged: keep draw_self() and the diagnostic markers. Default object sprite remains spr_mm5_megaman_idle. Do not add an Animation End event, built-in sprite playback action, new mask, or parenting change.

## Selection / timing

Manual playback keeps image_speed=0. In air, choose the single air pose. Grounded with no horizontal input, choose idle. During the existing grounded startup pause choose idle, including the final paused update where walk_pause has reached zero but walk_amount is still zero. Otherwise cycle four walk cells, seven Step updates each. Left/right mirroring is still set by the movement code, not animation.

The sprite artwork and seven-update loop are ROM-derived. This is not a claim of complete ROM draw-frame/NMI phase equivalence, nor validation of every combined transition. Pushing into a wall continues the walk cycle while input is held in this first animation pass. Idle is the existing single standing pose; blinking, shooting, slide, ladder and hurt animations are not installed. Collision remains manual world-space probes, not sprite bounds.

## User runtime checks (pending)

1. Stationary standing pose; unchanged floor alignment.
2. Left/right walking cycle and correct facing.
3. Brief standing pose during grounded startup; immediate standing on release.
4. Air pose during full/short jumps and falls; revert after landing.
5. No cropped feet on the 32x40 air image, no shifting world position between sprites.
6. Existing wall/ceiling/floor resolution and one-shot landing sound still work.

If the image shifts while debug origin/feet markers stay fixed, inspect sprite origin/padding rather than adjusting physics. Screenshot/runtime validation is still required.
