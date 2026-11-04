# Mesen 0.9.9 default colour approval checkpoint

User confirms their uploaded Windows Mesen0.9.9 is used exactly as downloaded. Target is original 2C02 default64-colour palette, no emphasis and no video effects. Source: https://github.com/SourMesen/Mesen/blob/0.9.9/Core/EmulationSettings.h (2C02 array; constructor selects it). Default video filter None and neutral picture settings are defined in GUI.NET/Config/VideoInfo.cs at that tag.

This standing PNG is a PALETTE-MATCHED conversion of our current asset, NOT a direct Mesen capture. `node tools/rom-recovery/preview-mesen-palette.mjs` reproduces it. Maps JSNES2.1.0 default RGB to NES index candidates and then the pinned Mesen RGB table. Unknown/ambiguous colours fail instead of guessing. The test confirmed all327 opaque positions/alpha unchanged;198 RGB pixels changed. Output32x32, single subimage, origin16,16. Canonical assets and extraction tools are not switched until colour approval. Other art still has previous colours during this test.

GMS test: Sprites > Mega Man > MM5 > existing spr_mm5_megaman_idle. Back up sprite, Load Sprite using this PNG, retain name and verify one32x32 frame and origin16,16. Do not edit object default resource reference, Create/Step/Draw, collision masks, timing or audio. Compare standing pose's colours to Mesen. Once approved migrate batches (all MM5 player poses, then MM1 title/select/intro/scenery/objects), preserve dimensions/origins/frame order/transparency/tile arrangements and intentional artwork edits. No blind whole-repo nearest-colour conversion: some assets may use other palettes or deliberate colours.

Use the pinned Mesen palette for future artwork; don't call palette-matched JSNES extraction a Mesen capture. Actual Mesen runtime setup/verification is separate from this palette checkpoint. Do not revise tested mechanics merely because colour output changes.

## Approval and migration

Standing colours approved by user. Canonical MM5 player assets and their extraction tools have now migrated; see MM5-PLAYER-IMPORT.md. The preview generator pins its pre-migration input so it remains reproducible. Other artwork migration remains pending.
