# Mega Man 5 — non-ladder drops and fall deaths

User requested independent MM5 confirmation before changing Cut Man camera/fall handling. No gameplay resources changed by this research. Screw Bomber work is paused. Big Eye and six earlier enemy types remain accepted baseline.

## Confirmed in supplied USA ROM

**A non-ladder fall CAN enter a downward-connected room.** It is not restricted to climbing a ladder or holding Down. Connection is determined by native room-layout metadata and valid room endpoint, not merely an arbitrary screen positioned below in an editor.

Controlled Napalm trial restores original naturally booted/selected/arrived stage, then positions player/camera at the first room's valid endpoint page3, X128/Y231, downward speed7, normal falling state1. All buttons released. No ladder state, ROM or room-table changes. Original metadata current23hex/next40hex selects a downward transition when player reachesY238. Layout changes20hex→41hex and page3→4. Original native downscroll executes60steps×4pixels. The player stays falling, enters the next room near its top (native alignmentY24), then resumes the retained7pixel fall (nextY31). No death entry/cue during this trial. This is controlled native-routine evidence, not a natural complete-stage playthrough or a claim every room edge connects.

**An unconnected bottom exit kills immediately on out-of-screen processing, even at full health and with post-hit invulnerability.** Separate Napalm-start trial places player below the floorY224/downspeed7/state1 without altering room metadata. Native positions areY231,238, then wrappedY5/highscreen1. At that third update nativeE02B sets playerstate7 directly. Both flash0 and flash60 variants die; latter still has flash58. Health bars remain28 in native RAM: this is not ordinary damage subtraction/hurt/recoil or gradual HP draining.

Pit path issues nativeF0music-stop and1Ddeath cues once, sets16bit wait012Chex=300. It directly enters the death delay without this path creating on-screen explosion-ring actors (the player is below the screen). Next updates run the countdown; in these trials one spare life is deducted at frame304 (301subsequent updates after entry, including underflow/transition bookkeeping). Later fade/reload/arrival is separate from the300counter; do not describe a single universal300-video-frame checkpoint-to-respawn interval. Normal spare-life/checkpoint flow follows; this test used2spares and verifies2→1, not every GameOver/Continue choice.

## Primary evidence and limits

`native-mm5-falls.json` includes ROMSHA256,95exactUSA source bytes, controlled-trial methods/rows/PCevents/audio command requests. Source labels cross-checked against `refreshing-lemonade/megaman5-disassembly@03e59a6855c1aca85d063bd2973005dc3ffd02ef`: normal boundaryCD57, downscrollCEA9/CEB8, offscreen-playerE01F..E041, countdown8509. Source comments are not blindly trusted; the95instruction bytes are independently matched. Source repository ROM/executable not run.

Reproduce ignored starting snapshots with `mm5-start.mjs` then `mm5-stage.mjs`; `probe-mm5-connected-drop.mjs` and `probe-mm5-fall-boundary.mjs` run the controlled cases. `test-mm5-fall-reference.mjs` checks persisted evidence against supplied ROM. JSNES2.1.0, not Windows/Mesen/hardware certification. The internal Y is MM5's player coordinate, not a promise the GMS MM5 feet/origin adaptation uses that exact number.

## Consequence for our project

The user's rule is correct with the connection qualification: free-fall through a connected lower exit should transition without a ladder; an actual bottomless pit should enter death regardless of health/blinking. We must map Cut Man's actual lower-room connections rather than assume all rectangular room space below is playable. The existing MM1 ladder animation/hold schedule must not automatically be presented as MM5 fall timing. No camera/GMS fix has been implemented or installed by this research checkpoint. Existing combat_die empties displayed health as a project adaptation; the native pit handler itself does not subtract HP to reach death.

## Follow-up — spike/health death versus pit visuals

User asked whether pit deaths omit the explosion compared with health/spike deaths. `probe-mm5-death-effects.mjs` now compares four original-ROM controlled cases; results in `native-mm5-death-effects.json`:

- Lethal spike-classF0 contact, health28/no flashing: native hazard dispatch82A5 reaches shared death8332, health0/state7, **16type03 death-particle actors** created at the player.
- Actual original imminent Napalm tiger contact with health set1/no flashing: native damage collision reaches the **same8332 routine**, **16same type03 death-particle actors**.
- Unconnected below-floor fall: native offscreen deathE02B/state7, **zero death-particle spawns**; health RAM still28. It does not call shared8332.
- Spike-class contact while flashing60: native hazard guard skips death, health28/flash59 after the frame, no particles. This verifies that handler's post-hit protection check, not every spike approach/mask/invulnerability scenario.

Spike fixture substitutes one original terrain-query classification with lethalF0 at C737; native hazard-marker collection, invulnerability guard, dispatch/death/spawn/audio routines remain unmodified. This is direct original handler evidence, **not a natural traversal to a specific spike tile**. Lethal-contact fixture retains original collision with only incoming health1/flash0. The pit fixture retains original room metadata. No explosion/GMS/camera/player/audio implementation was changed by this research. The visual distinction is real: pit death does not merely create an explosion offscreen; this path does not create those death particles at all.
