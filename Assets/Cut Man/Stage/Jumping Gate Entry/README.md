# Jumping Gate Entry

User confirmed Free Fall Correction working and requested jumping into either boss door also opens it. Preserve the seven accepted enemies and free-fall/pit baseline.

Follow **INSTALL-GMS14.md**. ONE new script, ONE existing gate-start script replacement, ONE complete cameraBeginStep replacement. No new art/audio/objects/events/room settings, no Create append or cameraEndStep change.

Eligibility: Right-only contact at each accepted gate face, standing-body vertical probes overlapping doorwayY816..879. Grounded/verticalspeed0/floor-only restriction removed; slide/ladder/startup/hurt/refill/death/pause guards retained. Grounded passage matches accepted first/second gate X/camera/strips/audio/age121release. Airborne trigger retains exact Y/velocity; camera helper applies existing MM5 gravity/cap/ceiling probes, ignores currently opening gate's mask, lands on accepted Y880floor and joins auto-walk. No second player Step, instant ground teleport or new landing sound. This airborne choreography is an explicit project adaptation, not native-ROM fidelity certification.

`test-jumping-gates.mjs`:1476per-update/eligibility checks, both complete standing traces, rising/apex/falling entry, exact triggerY/arc/ground clamp/ceiling, onecue/charge/shotcleanup, rejected out-of-height/away/slide/ladder/Start/refill/hurt/startup cases;11connectedfalls/6pits via new BeginStep; exact reconstruction of Free Fall BeginStep outside gate changes; GMS1.4builtin-local/obsolete-introspection guards. FreeFall5934mapping/11drop suite, pit actualGML/base407 and pause16source regressions pass. These limited mocks are NOT GMS compiler/runner/scheduler/GPU/audio/installed acceptance.

No combat/death/enemy scripts changed. Existing Cut Man spikes remain art-only. GitHub-only deterministic ZIP/manifest/CRC/exactcopies verified. **Prepared source/package; installed compile/playtest acceptance pending.** Back up first.
