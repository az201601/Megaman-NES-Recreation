# Gameplay volume balance — GMS 1.4

Listening checkpoint: current MM5/MM6 sound effects and the charge intro/loop have an exact **2× sample-amplitude boost (+6.0206 dB)**. Original approved source files remain unchanged. No normalization per effect, compression, limiting, trimming, pitch, rate or duration changes. This is a custom mix adjustment, not an original NES mix claim.

Individual files do not clip. Simultaneous music/effects can still overload the final mixer; test by ear in the runner. This package is not runtime/audio-device certification.

## 1. Back up the working GameMaker project

Stop the runner. Extract this ZIP to a new folder, not over older packages.

## 2. Replace the audio INSIDE existing Sound resources

Do not create duplicates or rename resources. For EACH name below, open its existing Sound resource, use **Load Sound** to select the identically named WAV from this ZIP's **Sounds/** folder, and save. Keep the existing sound type, compression, audio group and volume settings. If volume is already below its original default, note it before changing anything; the amplitude boost is already baked into these files, so do not add another gain boost.

**Sounds → Mega Man → MM5 → Movement**
- `snd_mm5_megaman_land`

**Sounds → Mega Man → MM5 → Arrival**
- `snd_mm5_megaman_arrival`

**Sounds → Mega Man → MM5 → Buster** (retain existing Charging subfolder where used)
- `snd_mm5_buster_shot`
- `snd_mm5_buster_mid`
- `snd_mm5_buster_full`

**Sounds → Mega Man → MM5 → Combat**
- `snd_mm5_megaman_hurt`
- `snd_mm5_health_refill`
- `snd_mm5_extra_life`
- `snd_mm5_megaman_death`

**Sounds → Mega Man → MM5 → Pause Menu**
- `snd_mm5_menu_open`
- `snd_mm5_menu_cursor`
- `snd_mm5_menu_close`

**Sounds → Mega Man → MM5 → Stage → Gate**
- `snd_mm5_gate_open`

**Sounds → Mega Man → MM6 → Combat → Enemy Hit**
- `snd_mm6_enemy_hit`

If your existing folders differ, keep the resources in those folders; the exact resource name matters. Do NOT import these WAVs as Included Files.

## 3. Replace both charge Included Files

The sustained charge is played through a PCM queue, not an ordinary Sound resource. In GameMaker's **Included Files**, replace the contents of BOTH existing entries using this ZIP's **Included Files/** folder:

- `mm5_charge_intro.pcm`
- `mm5_charge_loop.pcm`

Keep their exact filenames and existing export settings so both are exported to the game working directory. If GMS won't replace an entry in place, remove only that Included File entry and add its replacement with the same settings. Never add a second entry with the same name. Do not make these PCM files Sound resources. Both segments receive the same gain so there is no new volume jump at the intro/loop boundary. No charge playback script edits are needed.

## 4. Lower only Cut Man's stage music slightly

Open **obj_mm1_cutman_stage → Alarm 0 → existing Execute Code**. Find:

```gml
stage_music_voice = audio_play_sound(stage_music_queue, 1, false);
```

Immediately after it, add this line **once** (skip if already added):

```gml
audio_sound_gain(stage_music_voice, 0.85, 0);
```

Keep all other code, queue buffers, callbacks, cleanup, stage geometry and music files unchanged. Do not change master gain. This controls the existing voice, not the sound-effects volume. No edits to combat/player/camera events are required for this pack.

## 5. Fresh run and listen

1. Stop and rebuild/run fresh so Included Files are re-exported.
2. Compare arrival, landing, basic fire, mid/full release and sustained charging against stage music. Hold through several charge-loop repetitions.
3. Check hit, hurt, health refill, extra life, death, gate and menu cues when encountered. Menu transitions and charge pause/resume must remain unchanged.
4. Check rapid shots and overlapping effects for distortion/crackling. If the mix distorts, report which combination; no individual-file clipping does not guarantee safe summation.
5. Decide whether effects now feel right or need a smaller boost. This first listening balance is not final user approval.

Title/select/boss-intro music and the historical MM1 arrival effect are deliberately untouched; do not replace those with gameplay effects.

## Rollback

Reload the original WAVs from their previous import packages and restore both original charge PCM files. Remove only the added 0.85 music-gain line (or change it to 1). All original repository audio remains intact. Do not change game logic or resource names.
