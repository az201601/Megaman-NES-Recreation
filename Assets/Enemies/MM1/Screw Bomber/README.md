# Screw Bomber — native reference and prepared GMS1.4 checkpoint

User requested next enemy after seven accepted types and fall/gate correction work, then explicitly chose to leave both doors as-is after the timing investigation and resume Screw Bomber. Original corridor records45–47: nativepage20/X216/Y160/type05floor;21/X200/Y96/type16hexceiling;22/X80/Y160/type05floor. Project mapping subtract2816nativeX/add720Y:2520,880;2760,816;2896,880. Scripted, not editor-placed.

## Supplied original USA evidence

- `Reference/native-screw-bomber-source.json`:230AI/helper/table bytes individually matched pinned TheRealQuantam/mm1base@9c1cb05bd1d63c176e1930053dda76bcb85cd977. J-derived source is not whole-ROM identity; never run a modified reference ROM.
- `Reference/native-screw-bomber-gameplay.json`: original boot/controlled safe approach; slot16 replaced with native floor/ceiling defaults at824/Y160or96, lifecycle/fractions0/HP20; neutral input/playerY36/protection100/pinnedX. Ten600update trials at delta−80/−79/0/79/80:6000AI entries,41five-shot fans. Native code/animation/RNG/spawn/sound unmodified. Other slots cleared initially; adjacent native enemies can subsequently spawn. Firing requests source-filtered;11321checked shared2Dmovement pairs include adjacent enemy bullets. Not natural corridor traversal or independent MM5charge behavior.
- `Reference/native-screw-bomber-art.json`: **corrected** artwork from all three actual corridor spawns after native checkpoint reload (disclosed page20/C219 death-handler shortcut, native restart, then Right-only approaches/protection100). Fifteen OAM/CHR/palette poses independently opaque-pixel native-render matched, second-floor equality, each used pattern matched verbatim to supplied ROM. Earlier opening-area type-substitution artwork had the wrong CHR/palette and is superseded; four actual three-B-press kills (closed/open for both orientations) with originalHP20→13→6→death. Closed bodies take damage; NO blocked-shell ding/deflection invented. Actual corridor bullet6A/palette3 is salmon/white, NOT the opening-area Blaster palette. Dedicated bullet sprite/child preserves accepted Blaster resources.

Native strict<80horizontal activation; emergence8px; animation control64hex (fiveupdates/phase), twofans32updates apart; randomcooldown32/63/125 from native seedmod3. Floor fan up/ceiling down, horizontal3, diagonal556/256peraxis, vertical3. Floorbody1/ceilingbody2, sharedtype2Dbullet2, bodyhalf8×8/bullet1×1. Original20HP/basic7 takes3normalhits. Everyfan issues five same-frame15soundrequests; existing approved Blaster cue is SAMEeffect, reused once perprojectfan. No separately generated/re-recorded effect or five stacked WAVs.

## Artwork and implementation

Two corrected native80×16PNGstrips, five16×16frames each; one8×8bullet sprite/origin4,3. Origin8,7; closed floor top8rows/closed ceiling bottom8rows; keep all transparent padding and don't flip again. No generative art or repainted sprites.

Manual package/precise instructions: `Assets/Combat/MM5/Screw Bomber Checkpoint/`. Two actorsCreate+Draw (parentless body, bullet child of Blaster), five scripts, managerCreateappend/two central replacements. Reuse existing bullet movement/contact through inheritance and existing audio; no room/terrain/camera/gates/player/death/pause/oldenemy/audio changes. MM5normalizedHP3/normal-mid1/full3/weakpiercing and accepted central spawn/birth/clock/RNG adaptation are explicit, NOT native global objectpool/RNG or native MM5charged-Screw certification.

Reproduce: `node tools/rom-recovery/test-screw-bomber-source.mjs`; `node tools/rom-recovery/probe-screw-bomber-gameplay.mjs` (regenerates ignored initial snapshots from original boot); `node tools/rom-recovery/recover-screw-bomber-art.mjs`; `node tools/rom-recovery/test-screw-bomber-integration.mjs`. JSNES2.1.0/pngjs7 from tools package lock. No savestates/ROM/disassembly shipped. **Prepared and mock-tested, not GMScompile/installed acceptance.**

## Correction installation

The first delivered strips were scrambled opening-area tile data. This was our extraction error, not an import error. **SPRITE-CORRECTION-GMS14.md** in the combat package covers replacing only the affected Screw resources. No doors/accepted enemies/audio/terrain change. Enlarged strip previews and three cropped native encounter screenshots are in Reference/.
