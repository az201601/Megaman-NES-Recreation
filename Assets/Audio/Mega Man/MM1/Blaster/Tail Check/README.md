# Firing tail check — still awaiting listening approval

User approved **MM6's blocked-hit ding** but reports the revised MM1 firing sound may be incomplete. Keep that MM6 ding and existing successful-hit35 unchanged. Do not treat any firing preview as approved.

This diagnostic deliberately keeps the complete first-shot window and final shot with long tail. Nothing is removed based on silence/last-nonzero detection. It also changes the setup: original stage music initializes and plays normally, then originalFF is queued at nativeD554 on approach update300,232updates before firstfire. This retains normal sound-driver initialization rather than preventing the music from ever starting. PlayerY36, zeroverticalspeed/fraction and protection100 are controlled; Right toX760 then released. Actual nativeAI creates bullets and issues15 on updates532/564/596/628. No injected firing command, channel isolation, fades or synthesized tail. FullAPU/defaultstereo; exact2xgain as accepted gameplay balance.

- **mm1-blaster-last-shot-full-tail-balanced.wav**: final real shot,50ms preroll and every captured sample through update700,1.260021s total. Includes over1second after native driver end-of-data.
- **mm1-blaster-first-shot-untrimmed-balanced.wav**:50ms before first request through the next request,0.582458s. No PCM trimmed from that interval.
- **mm1-blaster-full-burst-untrimmed-balanced.wav**: continuous actual four-shot recording,2.928604s. Reference only, not one sound resource per bullet.

Source-only external label CMDSFX_EndOfData at9662 is qualified against mapped opcodeA5F0, not PC alone. Both used-channel executions reach original end-of-data at encounter updates542,574,606,638. Recording continues beyond the last one to700 and ends in exactzero PCM. JSON records requests/dispatch/end-of-data sample indices and file hashes. Individual peaks remain below1; final-game overlapping mix still needs runner testing.

**Finding:** the earlier file is short, but checking its last nonzero sample alone did not establish that its sound was incomplete. No missing later component has been demonstrated. These untrimmed, normally initialized takes let the user judge the full output before choosing the final effect. Do not claim the suspected truncation is fixed or synthesize/stretch a tail to match an assumption. If it still sounds wrong, compare with a user reference or independently captured emulator playback before integration.

No game logic changes or resource imports in this checkpoint. `tools/rom-recovery/recapture-blaster-fire-tail.mjs` reproduces the capture; `test-blaster-fire-tail.mjs` validates original end markers, hashes and sample-exact slicing from the continuous burst.
