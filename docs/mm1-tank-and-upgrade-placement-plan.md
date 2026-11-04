# MM1 recreation — approved tank and upgrade distribution

User approved this distribution. Applies to the original Mega Man1 recreation stages, not the future crossover stage themes.

| Stage | Planned fixed pickups |
|---|---|
| Cut Man | One E-Tank |
| Guts Man | One E-Tank and one W-Tank, on separate optional routes |
| Ice Man | One E-Tank |
| Bomb Man | Energy Balancer; no fixed tank in this distribution |
| Fire Man | One E-Tank |
| Elec Man | One W-Tank; retain original Magnet Beam location; no fixed E-Tank |
| Later Wily fortress stage (exact stage undecided) | One M-Tank |

Totals in approved distribution: four E-Tanks, two W-Tanks, one M-Tank. These are pickup placements, not inventory capacity limits or starting inventory.

Except for the subsequent Cut Man decision below, exact rooms, coordinates, route requirements, revisit/respawn rules and pickup/consumption implementation are not settled by this distribution approval. Inspect original layouts and choose exact locations when building each stage. Proposed optional-route direction: clear clues, no blind jumps/unmarked secrets; Guts Man's E and W are not bundled in one place.

Energy Balancer is specifically settled for Bomb Man; exact hiding spot remains to choose. Existing starting inventory remains zero tanks, Buster only and02 spare lives. This distribution approval alone did not implement pickups/consumption; the subsequent Cut Man checkpoint below adds E only.

Pause menu checkpoint: user explicitly confirmed both opening and closing transitions work and look correct in-game. Preserve that working baseline.

## Cut Man location approved

User approved the proposed visible optional perch: on the lone raised Super Arm block in the long middle outdoor section, after the first cutter dispenser and just before the small pit. Existing block top-left1152,1056/32×32; proposed tank centre anchor1168,1048/camera band960, final sprite alignment to verify when implemented. Adjacent ledge top1088 gives32px climb, within accepted52.5px jump height; no Super Arm removal or terrain changes required. This approves LOCATION only, not inventory capacity, death/revisit respawn policy or consumption implementation. Preserve existing zero starting tanks and disabled consumption until refill is connected.

## Cut Man follow-up: capacity/persistence/use approved; source package ready

User selected E capacity9, leave available at cap, retain collected status across death/retry (no farming), and explicitly requested E use/full refill. Implemented in `Assets/Combat/MM5/Cut Man E-Tank/`: world centre1168,1048/band960, original MM5 two-phase16×16 art/origin8,7, shared pickup child/static/no expiry. Collection +1 E/one existing cue24/no heal/life change; global flag reset only explicit new-game/Game Over inventory reset, not room/manager Create. Persist through retry/revisit until that reset; no savefile/cross-run system added.

Fresh Start on E at health1–27/count>0 consumes1; full-health/empty/health0 do nothing, held Start never repeats. Existing four-update incremental refill/cue26 on pause-owned health copy, world/player stay deactivated. After last wait staysmenu/returnsBuster; normal exact-ID restore commits28 after activation; interrupted surface/Room-End restore completes paid benefit. Cached-stage HUD reflects heal during closing. A on E/W/M consumption deferred. Source/model/native tests PASS; GMS1.4 compile and user installed acceptance PENDING. See package guide for exact resource/event installation. Placement/death/cap policy deliberately differs from native MM5 removing full-cap pickup.
