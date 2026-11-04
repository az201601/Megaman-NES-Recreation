# Cut Man fixed large health

Incremental manual GMS1.4.1760 patch after the user-confirmed working Screw Bomber and accepted final sprite fix. Original record38/page15X40/Y184/type40 maps world1832,184/band0 in the top horizontal stripe. Existing ledge topY192. Reuse existing MM5 large-health sprite/kind74/+10/cap28/incremental refill/audio; no new art/sound. Fixed position/no drop lifetime; one visible anchor spawn, offview/route rearm is explicit project policy rather than native global-slot-persistence certification.

INSTALL-GMS14.md identifies folders, one new script, one child object/Create ONLY (parent obj_mm5_pickup, inherit ordinary Draw), one managerCreateappend, two full script replacements. Accepted Screw central version retained outside one rearm/one spawn line; random-drop pickup-step retained after a fixed-object early exit. No collect/refill/shot/camera/gate/terrain/room/player/death/enemy/audio change.

Reference/native-cutman-large-health.json verifies supplied USA original record/table/instruction bytes,600-update stationary/no-expiry controlled type40 trial and original +10 collection. Not a sprite-extraction fixture or natural-stage/respawn/global-pool certification. Existing MM5 art/refill evidence reused, not guessed/newly generated.

Reproduce: node tools/rom-recovery/probe-cutman-large-health.mjs; node tools/rom-recovery/test-cutman-large-health.mjs; python tools/rom-recovery/package-cutman-large-health.py. Source/model tests are not GMS compiler/runtime or installed acceptance. Back up and follow checklist; no boss/spikes/tank/whole-stage completion claim.
