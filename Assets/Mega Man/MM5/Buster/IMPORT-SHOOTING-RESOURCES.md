# MM5 shooting resources — import-only checkpoint

User confirmed projectile spr_mm5_buster_shot imported (8x8,origin4,3) and explicitly approved the shot sound. Approved canonical audio: Assets/Audio/Mega Man/MM5/Buster/snd_mm5_buster_shot.wav, byte-identical to reviewed WAV. No firing code installed yet.

## Player sprites

Use existing Sprites > Mega Man > MM5 > Buster group. Create THREE sprites, Load Sprite from matching PNG:

- spr_mm5_megaman_idle_shoot
- spr_mm5_megaman_air_shoot
- spr_mm5_megaman_climb_shoot

Each is one40x40 subimage with manually set origin16,16. The40px width includes extended cannon/padding; do not resize or crop to match the old32px sprites. Do not click Center (20,20 would be incorrect).

In the same group create spr_mm5_megaman_walk_shoot. Edit Sprite > File > Create from Strip: spr_mm5_megaman_walk_shoot_strip4.png;4 images,4 per row,40x40 cells, all offsets/separations0. Exactly4 subimages, origin16,16. Don't accidentally use32px cells from ordinary walking.

## Approved sound

Sounds > Mega Man > MM5: create group Buster and sound snd_mm5_buster_shot. Load snd_mm5_buster_shot.wav. Use normal non-positional playback, uncompressed/not streamed if selecting compression, default volume1 and default audio group. Don't add playback events or loop it. Existing stage queued music/approved landing audio remain unchanged.

## Leave controller unchanged

Do not assign shooting sprites as the player's default sprite, change player sprite masks/origins, create a projectile object or edit Create/Step/Draw. These resource imports alone deliberately do not enable firing. Next checkpoint chooses fire key and adds basic projectile behaviour/state in small tested steps; charging remains deferred.

All artwork is original-ROM pixels with approved Mesen default palette (not direct Mesen capture). Preserve alpha and padding. Audio is actual full-game output with music stopped, reviewed by the user; canonical copy introduces no waveform or metadata changes.
