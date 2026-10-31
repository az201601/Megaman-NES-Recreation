# Charge intro/loop audition — hearing approval pending

User confirmed snd_mm5_buster_mid/full imported. Existing controller, projectile, approved release/ordinary/landing audio unchanged. This is a new loop-boundary audition, NOT a new GMS resource installation step.

Listen to mm5-charge-looped-preview.wav: original rising charge introduction then16 repetitions of the proposed steady loop, total8.5478541667s. No ordinary press shot or release included. Listen for clicks, rhythmic hiccups or conspicuous pitch jumps once settled. No new Sound resources or event edits until hearing confirmation and queue/playback instructions.

## Files

- mm5-charge-intro-review.wav:103257 sampleframes/2.1511875s,48000Hz stereoPCM16.
- mm5-charge-loop-review.wav:19190 sampleframes/0.3997916667s, same format.
- mm5-charge-looped-preview.wav:intro then16 exact copies of loop;410297 sampleframes/8.5478541667s.

Source is the already-auditioned actual original-game full-APU charge take: .work/charge-effect-charge-raw.wav, capture begins35, natural B held. Music stopped by originalF0 command. Initial shot completed before capture, verified zero prior tail, only captured effect22. No synthesis/channel muting/isolation, fades/crossfades, normalization, resampling or sound layering. Not direct Mesen audio capture.

prepare-charge-loop.mjs crops unmodified captured PCM. Native register pattern repeats every8updates after110 (17 repetitions independently asserted). Register pattern is NOT a proof of identical PCM waveform phase; first one-cycle attempt failed waveform guard and was not published. Candidate search uses starts within update174 and lengths approximately1..9 native8-update cycles, +/-20samples; score matches128-sample stereo waveform neighbourhood and penalizes boundary jump. Proposed loop uses roughly3 register cycles; raw[111061,130251),19190samples. Intro raw[7804,111061). Intro-to-first-loop is contiguous original PCM.

Sample-seam metrics:128-sample stereo window RMS difference37.9113/32767, max460; end-to-start adjacent jump6. Guards RMS<50,max<512,jump<50 pass. These are engineering limits for a candidate, NOT proof of a bit-perfect native seamless loop. No edited samples. User must hear the16-repeat preview before installation. Slight PCM timing adjustment from exact register-cycle duration is a sample-crop adaptation; no claim of hardware/cycle-exact reproduction. Existing accepted non-loop preview remains unchanged.

Reproduce: npm ci in tools/rom-recovery; if needed mm5-start.mjs then mm5-stage.mjs to recreate ignored snapshot; record-charge-effects.mjs; prepare-charge-loop.mjs. Raw takes/seam JSON in ignored .work. User should download ZIP from GitHub and audition locally. Later integration must play intro once then repeat steady segment, stop charging handle on successful release before release sound. Simply looping rising preview is incorrect. Blocked/cancel semantics and sample-queue runtime testing remain separate.

## User hearing acceptance

User reported "very smooth" for16-repeat audition. The proposed intro/loop pair is hearing-approved and remains unchanged. Earlier hearing-pending notes above are historical; GMS intro/loop queue runtime installation is still pending, not inferred from listening acceptance. Do not simply loop the intro or full preview.
