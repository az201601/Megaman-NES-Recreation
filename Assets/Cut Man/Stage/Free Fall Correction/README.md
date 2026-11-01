# Free Fall Correction — connected lower rooms and distinct pit death

User approved MM5-verified rules before continuing Screw Bomber. Big Eye and six earlier enemy types are accepted baseline. Detailed GMS1.4.1760 instructions: **INSTALL-GMS14.md**. No art/audio/object/room/geometry/player/enemy-resource replacements.

Four new scripts; append existing cameraCreate and combatCreate; replace existing cameraBeginStep, combat ordinaryDraw and scr_mm5_combat_die. Do not add actor Step passes or replace accepted combat-owned cameraEndStep. No GMS2/variable-existence introspection.

Connection lookup checks the actual Cut Man section rectangles at current worldX, not a ladder-center condition or arbitrary editor space. Returns1→0,2→1,3→2,4left→3,5→4,6→5,7→6,8left→7/8right→9,9→10,10→11; other lower edges are pits. All5934valid padded worldX samples checked against independent14-room rectangles. Reuses outgoing shot/charge cleanup, separate MM5-inspired60step×4 camera/−3.5screenY/8pxentry alignment, resumes retained falling velocity after alignment. Horizontal camera interpolation to the lower section's clamp range is a project-layout adaptation; worldX stays fixed.

Pit death calls shared accepted die ownership then flags pit-only visuals. Normal die resets flag; Draw omits all particles only for pit. No damage/invulnerability gate: full health/blinking cannot survive a pit. Existing music stop/death cue/300-updatecounter/lives/retry remain unchanged. Project pit HUDhealth0 and opening/title retry policy are explicit adaptations, not nativeMM5 HP/checkpoint/GameOver equivalence. Normal damage still16particles. Cut Man spike art remains artwork-only; original MM5 spike path has normal explosion but its collision is not added here.

Original MM5 evidence at `docs/mm5-fall-reference/`:95exactUSA bytes, controlled original connected drop/no buttons/no ladder with60scrollsteps, pit fullHP/flash0+60/musicstopF0/death1D/counter012C/one-life loss, original spike-class and real lethal-contact handlers create16type03particles while pit creates0. Spike fixture replaces one terrain classification, not natural spike traversal. Repro probes included in repository, no ROM/states/disassembly in ZIP.

`test-cutman-free-fall.mjs`:5934mapping checks/11nonseam drops/every native60step vertical sample/incoming alignment+release/falsefalls/pits/hurt/Start/refill/charge/unchanged gate+ladder source body. `test-pit-death-integration.mjs`: actualGML pit fullHP/protection0+60/onecue/noDrawparticles/300counter/one life/zero-spare titleflow; ordinary lethal damage16particles/source preservation/builtin guards. Base407 + all seven enemy suites pass under FALL_OVERLAY; gate34/pause16source checks pass. These limited mocks are NOT GMS compilation/GPU/scheduler/audio/installed gameplay acceptance.

Deterministic manifest/ZIP/CRC/byteequality verified. **Prepared source/package, installed test pending.** GitHub-only download. Preserve working backup.
