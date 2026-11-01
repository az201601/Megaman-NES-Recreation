# Screw Bomber — first-frame-only sprite fix (GMS1.4.1760)

**For the working installation after the previous sprite/bullet correction. No scripts, objects, events, origins, manager code, audio or doors need changing.**

Download `Downloads/mm1-screw-bomber-first-frame-fix-gms14.zip`.

## What changed

Only subimage **0** of the floor and ceiling body sprites. Subimages **1–4 are byte-for-byte unchanged**. The bullet is unchanged.

The previous extraction caught a retraction-transition frame: enemy Y had changed, but OAM still held the preceding emerging pose. A narrow Y window selected only its lower two tiles and wrongly classified them as the closed pose. Those pixels really appeared on screen, but they were not the complete closed sprite. The corrected recovery requires a complete native tile set for every pose (closed = BC + CF) and native-render matching after the alignment settles. All three actual corridor encounters were rechecked.

## Replace the TWO existing sprite strips

1. Back up the working project and stop the runner.
2. Folder **Sprites → Enemies → MM1 → Screw Bomber**.
3. Open existing **`spr_mm1_screw_bomber_floor`** → **Edit Sprite**. Remove its five old subimages. **File → Create from Strip** → select **`Art/spr_mm1_screw_bomber_floor_strip5.png`** from this ZIP.
4. Set **Number of images 5**, **Images per row 5**, **Image width 16**, **Image height 16**. All cell/pixel offsets and both separations **0**. Confirm exactly **five 16×16 subimages**.
5. Green check out of the editor. Confirm **Origin X8, Y7**. Do not Centre, crop, resize, remove the background, or repaint. Keep PNG transparency.
6. Repeat for existing **`spr_mm1_screw_bomber_ceiling`**, using **`Art/spr_mm1_screw_bomber_ceiling_strip5.png`**. Same strip settings and **Origin X8, Y7**. Do not flip it again.
7. Save and run. Check the retracted floor cap and ceiling cap before activation and between cycles. Their transparent mounting padding is intentional.

**Do not create duplicate sprite resources. Do not reinstall the bullet correction, replace any code, or append manager initialization again.** The working behaviour remains unchanged.

If you have not installed Screw Bomber at all, use the updated full installer instead. If you still have the original scrambled graphics and have not installed the first correction, use `SPRITE-CORRECTION-GMS14.md`; that ZIP has also been refreshed with these fixed strips.

Native-ROM render/tile-set and source/model tests pass; your installed visual acceptance of these two first frames is still pending.
