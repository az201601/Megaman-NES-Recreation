# Pause menu — Step1: import resources (GMS1.4.1760)

Approved design and sounds. **Sprites by KindlyPatrick** is the requested displayed credit for the seven supplied-sheet weapon designs. Corrected Rolling Cutter retains original greys, no gold. Original ROM assets and custom selected palettes remain distinguished in source manifests.

This is a manual import pack, NOT a GMX/project or functioning pause controller. **Do not replace any player, HUD, startup, room or audio-manager events in this step.** No Objects, Scripts or room instances yet. Source assets prepared does not mean installed in your project.

## 1. Make resource folders

Under **Sprites > Mega Man > MM5 > Pause Menu**, create:

- Panels
- Icons
- Font
- Meters

Under **Sounds > Mega Man > MM5**, create **Pause Menu** (reuse it if already present).

Keep your existing health HUD/arrival/player/charge resources unchanged. No score resources.

## 2. Import these Sprite resources

Use the EXACT resource names in this table, **without** `_strip22` etc. in the resource name. Every sprite origin is **X0,Y0**. Sprite collision masks are irrelevant: these are GUI art, not objects or collision geometry.

| Folder | Resource name | File in Sprites/ | Each frame | Frames |
|---|---|---|---|---|
| Panels | spr_mm5_pause_main_panel | spr_mm5_pause_main_panel.png |256x240|1|
| Panels | spr_mm5_pause_upgrades_panel | spr_mm5_pause_upgrades_panel.png |256x240|1|
| Icons | spr_mm5_pause_weapon_icons | spr_mm5_pause_weapon_icons_strip22.png |16x16|22|
| Icons | spr_mm5_pause_upgrade_icons | spr_mm5_pause_upgrade_icons_strip2.png |16x16|2|
| Icons | spr_mm5_pause_tanks | spr_mm5_pause_tanks_strip6.png |16x16|6|
| Icons | spr_mm5_pause_lives | spr_mm5_pause_lives.png |16x16|1|
| Font | spr_mm5_pause_font | spr_mm5_pause_font_strip38.png |8x8|38|
| Meters | spr_mm5_pause_meter_styles | spr_mm5_pause_meter_styles_strip2.png |56x8|2|

For a single PNG, create Sprite and load it normally. For a strip:

1. Create/open Sprite, then **Edit Sprite > File > Create from Strip** and choose the matching PNG.
2. Set number of images to the table's Frames, images per row to the same number (one horizontal row), image width/height to Each frame. Horizontal/vertical offset0, separation0.
3. Check the preview before confirming. Verify the resulting frame count and frame size in the editor; do not leave the full strip as one wide frame.
4. Keep original pixels/PNG alpha: **no remove-background operation, resize, smoothing or edge cropping.** Black pixels are deliberate. Font transparency is already in the PNG.
5. Origin0,0. No need to assign these sprites to objects. Do not preview state strips as gameplay animations; code will choose explicit frame indices later.

If your import path automatically recognises `_stripN`, check the same final sizes/counts instead of splitting a second time.

The font is a **Sprite**, NOT a Fonts resource or a system font. Its38 frames follow the exact original-source mapping below; the eventual text helper will use that mapping (not assume ASCII-contiguous glyphs).

### Quick visual checks (zero-based frame numbers)

| Entry | Grey | Selected |
|---|---|---|
| M.BUSTER |0|1|
| R.CUTTER |2|3|
| I.SLASHER |4|5|
| H.BOMB |6|7|
| F.STORM |8|9|
| T.BEAM |10|11|
| S.ARM |12|13|
| M.BEAM |14|15|
| R.COIL |16|17|
| R.JET |18|19|
| R.MARINE |20|21|

Cutter selected stays grey/white like source; no gold/removed fill. Its selected casing/shading is slightly brighter than unselected. Both Rush Jet/Marine are original MM4 icons; Coil/Buster original MM5, including recovered selected Coil.

- Upgrade icons:0=original grey Energy Balancer,1=custom blue/cyan selected.
- Tanks:0=E grey,1=E selected,2=W grey,3=W selected,4=M grey,5=M selected. W flips only original M lettering, not casing.
- Font:0..25=A..Z,26..35=0..9,36=space,37=period. All8x8, no invented glyphs.
- Meter styles:0=original unselected full bar,1=original selected full bar. These are NOT29 energy-fill frames; fill drawing/empty-state verification and inventory mechanics are still later implementation work.
- Panels are intentionally mostly blank: static frame/separators/backing only. Names, lives/counts/health, bars, icons, cursors and descriptions will be drawn dynamically. Do NOT import the flattened review screenshots instead: they bake sample03/full energy/00 tanks into the picture.

## 3. Import the confirmed audio

Under **Sounds > Mega Man > MM5 > Pause Menu**:

- Create/update `snd_mm5_menu_open`, load `Sounds/snd_mm5_menu_open.wav`.
- Create/update `snd_mm5_menu_cursor`, load `Sounds/snd_mm5_menu_cursor.wav`.
- Create `snd_mm5_menu_close`, load `Sounds/snd_mm5_menu_close.wav`.

Uncompressed/non-streamed, volume1, default audio group. Original48kHz stereo PCM16, no loop. Preview all three in the editor. Do not add playback code yet, replace stage music, or create duplicate resources if already imported. Open/cursor are user-confirmed MM5 sounds; weapon-confirm close is newly recovered from MM5 Start/A. No tank-use/cancel sound chosen.

## 4. Stop and verify

You should now have **8 new Sprite resources +3 Sound resources**, organised as above. Run the current game: with no new events or room instances yet, title/select/Cut Man/player/HUD/audio should behave exactly as before. If anything changed, check that you did not replace existing resources or add events.

Confirm all imports/counts/origins before the next checkpoint. Next: GMS1.4 controller/text drawing, page navigation, selection and sounds; then safe world-freezing/integration and live health/lives/weapon state. Weapon behaviours, unlock rules, tank consumption and Energy Balancer functionality are NOT implemented by this import pack. No starting-lives count is chosen here.

## Rebuild / provenance

`node tools/rom-recovery/build-pause-import-pack.mjs` rebuilds PNGs, WAV copies, resource manifest and credit from committed source files (no emulator snapshots needed). ZIP packaging is separate. Pack panels are custom approved frame design; other assets retain source pixels in the strips. Generator asserts22 weapon frame rows match source bytes, all pair dimensions/counts, PNG roundtrip and distinct states. Selected Coil recovery is reproducible via recover-mm5-buster-unselected.mjs after generating MM5 pause snapshot. Technical provenance/permission caveats in root CREDITS.md remain; the visible credit is exactly **Sprites by KindlyPatrick**.

## Tank selection update

Replace ONLY spr_mm5_pause_tanks if you already imported the previous3-frame version. Use spr_mm5_pause_tanks_strip6.png,6 frames each16x16, origin0,0; keep the same resource name. Other resources/names unchanged. Selected tanks use custom blue/cyan NES palette (not a claim of original MM5 selected tank colours); original grey shapes/letters retained. User specifies Start on selected E/W/M uses one, not merely closing the menu. This is recorded for controller implementation; artwork does NOT consume inventory yet. Zero-count/full-meter eligibility, effects and menu-close behaviour still need integration decisions/tests.

## Third menu sound: weapon confirmation/close

Create snd_mm5_menu_close under Sounds > Mega Man > MM5 > Pause Menu, using Sounds/snd_mm5_menu_close.wav (uncompressed/nonstreamed, volume1/default group, one-shot). It is original MM5 command28, recovered separately for Start and A with matching PCM. Open/cursor WAVs unchanged. Current pack now8 Sprite resources and3 Sounds. Stage-controller update plays close sound once only on successful weapon confirmation, not page moves/empty tanks. No sprite reimports needed for this audio update.
