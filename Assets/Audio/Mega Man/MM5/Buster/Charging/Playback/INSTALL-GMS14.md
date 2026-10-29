# Charge audio playback test — GMS1.4.1760

User confirms charged projectile objects installed. All colour/approved release resources ready. This checkpoint installs ONLY charge intro/loop playback with temporary F6 test key. X remains existing basic fire; charged emission/colour-controller integration follows AFTER real queue test. Don't replace any player/controller/basic projectile code.

## 1 Included Files (not Sounds)

Add mm5_charge_intro.pcm and mm5_charge_loop.pcm to GMS Included Files, export to game's root working directory (not nested folders). These are raw48000Hz signed16-bit stereo PCM, exactly approved intro/loop WAV payloads with only44-byte WAV headers removed. Intro413028bytes/103257frames; loop76760bytes/19190frames. No gain/normalization/sample edits/resampling. Do NOT import PCM as Sound resources. Existing snd_mm5_buster_mid/full/shot/landing unchanged.

## 2 Scripts

Scripts > Mega Man > MM5 > Buster > Charging: create Audio group (and missing parent groups).
Create Script resources, paste matching GML files directly, no GMS2 function wrapper:

- scr_mm5_charge_audio_start
- scr_mm5_charge_audio_stop
- scr_mm5_charge_audio_dispose

These execute in manager context; don't call start directly in player context. Stage music has its own queue and is never stopped/freed by these scripts.

## 3 Object

Objects > Mega Man > MM5 > Buster > Charging: create Audio group.
Create obj_mm5_charge_audio: no sprite/parent, Visible/Solid/Persistent all unchecked. Do not place in room.

Events:

- Create > Execute Code: obj_mm5_charge_audio_create.gml
- Step > Step > Execute Code: obj_mm5_charge_audio_step_TEST_ONLY.gml (temporary, F6 only)
- Asynchronous > Audio Playback > Execute Code: obj_mm5_charge_audio_audio_playback.gml (NOT Audio Recording or Audio Playback Ended)
- Other > Room End > Execute Code: scr_mm5_charge_audio_dispose();
- Destroy > Execute Code: scr_mm5_charge_audio_dispose();
- Other > Game End > Execute Code: scr_mm5_charge_audio_dispose();

Each cleanup event contains just that one script call. Cleanup is idempotent, so Room End + Destroy + Game End won't double-free. Keep unrelated events intact if manager resource already exists, don't create duplicate managers.

## 4 Create manager from player

Existing obj_mm5_megaman > Create > Execute Code: APPEND obj_mm5_megaman_create_audio_manager_append.gml, preserving every existing initializer. It checks instance_exists before instance_create. No player Step/Draw/Async changes. Do not add another room instance; test with one player/manager only.

## 5 Real GMS test (required)

Run current movement test room:

1. Hold F6 at least10seconds: approved rising introduction ONCE, then smooth steady repetition without replaying intro.
2. Release F6 during intro or loop: charge stops promptly, no ordinary shot or release sound.
3. Release/repress rapidly several times: one fresh intro per press, no overlap/stuck sound; then hold10seconds again.
4. Existing stage music continues throughout (if present). Normal movement, X basic shots and landing audio remain unchanged.
5. Room exit/restart should not leave charge playing or report invalid buffer/queue handles.

F6 starts immediately as a TEST, not native34-update X charge threshold. Do not judge charge gameplay timing yet. Keep temporary F6 Step until result reported; next integration will remove it and drive manager from measured player charge events. Do not import full preview as a looping Sound.

## 6 Queue/evidence limits

Same GMS1.4 queued-buffer approach used by accepted Cut Man music. queue buffer_s16/48000/audio_stereo; intro +2 loop cycles queued before audio_play_sound(...false). Audio Playback callback refills only its own queue's completed loop buffer, ignores intro/other queues/shutdown, never deletes async_load. Stop stops own voice then frees queue, retains immutable buffers for reuse; cleanup marks closing, stops/frees queue BEFORE buffer_delete. No audio_stop_all/global music edits/timers.

charge-audio-gml-model.mjs executes actual GML-subset with mocked queue/buffer APIs. Checks intro once,50 refills, short/long stop/restart, stale/shutdown callbacks, no stage-voice stop, allocation/load/play failures, double cleanup. This does NOT prove actual GMS async ordering, handle reuse/latency, compiler availability or sound smoothness. Rapid restart especially needs user runtime test. Source code uses known1.4 APIs, no GMS2 structs/methods/cleanup event or modern Playback Ended.

Approved waveform seam hearing "very smooth" is preserved; this new queue playback itself remains user-runtime pending. Player charging, pending-release/cancel/slot handling, face-safe colour selection and actual charged emission still not enabled at this test checkpoint.
