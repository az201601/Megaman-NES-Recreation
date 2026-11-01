# Jumping into either boss gate — GMS1.4.1760

**Stop the runner and back up the working project.** Requires your accepted Free Fall Correction, both gate passages and seven enemy types. This is a small manual source patch, not an importable GMX. Complete ALL three steps before running.

No new art, sound, objects, rooms or manual instances. No camera/player coordinates, sprite origins, masks, parent settings or audio volume changes. Keep all existing gate objects and their closed collision masks.

## 1. Create ONE new Script resource

Resource folder **Scripts → Cut Man → Stage → Doors**.

Create **`scr_mm1_cutman_gate_air_step`**. Paste the whole **`scr_mm1_cutman_gate_air_step.gml`** and save. Do not add it as an object Step event.

This helper runs only while the camera owns a gate passage. It carries the captured jump/fall velocity with the existing MM5 player gravity/cap, checks overhead terrain, ignores only the currently opening gate's mask, and lands on the same accepted passage floor (Y880 minus feet_offset). It does not run a second player-controller Step or add a landing sound.

## 2. Replace ONE complete existing Script resource

In **Scripts → Cut Man → Stage → Doors**, open **`scr_mm1_cutman_gate_start`**.

Select ALL existing code, replace with the whole **`scr_mm1_cutman_gate_start.gml`**, save. Do NOT append or create a suffixed duplicate.

This keeps approved immediate gate sound/first strip, outgoing-shot/charge ownership, X entry and gate targets. Airborne entry retains its current Y and captures its velocity instead of snapping to floor. The two new camera fields are initialized inside this script on EVERY gate entry; no Create append is needed.

Keep existing `scr_mm1_cutman_scroll_start` version1301, scroll_finish, gate objects/Draw and sounds untouched.

## 3. Replace camera Begin Step — the ENTIRE existing event

Open **Objects → Cut Man → Stage → Ladder Route → `obj_mm1_cutman_camera` → Begin Step → Execute Code**.

Select ALL code and replace with the whole **`obj_mm1_cutman_camera_begin_step.gml`**, save.

This is a complete replacement, including the accepted combat prefix and free-fall/pit dispatcher. **Do not prepend the old combat prefix again.** Do not paste it into ordinary Step/End Step.

Keep camera Create (including accepted Free Fall fields), End Step, Room End/Destroy unchanged. In particular keep the combat-owned End Step helper/pass, NOT a historical stage-only End Step. Keep player events, pause/health/combat/death scripts, all enemies, scenery/collision/blocks and room settings unchanged.

## 4. Compile and playtest both doors

Source/mock checks pass; **GMS1.4 compilation, event scheduling, installed animation/terrain and user acceptance remain pending**.

1. Walk Right into the first and second door as before. Immediate sound/first strip and accepted opening/walk/camera cadence should be unchanged.
2. Jump Right into each door while rising, near apex and falling. When Mega Man's standing body probes overlap the doorway and his right side touches it, opening starts without waiting to land. No immediate vertical teleport to the floor.
3. His current jump arc continues under camera ownership; after landing he uses the existing automatic walking passage. Actual overhead solids should stop upward movement; the opening gate's retained closed mask must not snag him. No duplicate player Step or extra landing sound.
4. Both gates should play ONE approved opening cue each. Normal jump entries settle before the established age121 control release; a still-airborne cutscene stays locked rather than releasing unsupported walking control.
5. Test charge held throughout, charge released/repressed, fresh fire after release, pause just before contact, and hurt/refill/death restrictions. The accepted charge/shot cleanup and rearming must remain intact.
6. Merely being above the doorway, below it, away from its face, pressing Left+Right, sliding or on a ladder must NOT open it. Sliding/ladder eligibility was not broadened by this request. Right input is still required, as with accepted walking entry.
7. Recheck accepted non-ladder falls, both upper-section downward branches, genuine pit death/no particles, ordinary lethal damage/explosion, ladders, pause, both gate destinations and all seven enemies.

Unknown `scr_mm1_cutman_gate_air_step` means Step1 missing. Unknown `route_gate_entry_air`/`route_gate_fall_speed` while opening usually means Step2 was missed or an old gate-start script remains. A gate-start version error refers to your existing matched1301 scroll-start resource; do not change room dimensions to work around it.

This is an explicit MM5-player/MM1-gate project adaptation—not a claim that original MM1/MM5 jumping gate choreography was independently ROM-matched here. Original walking gate trace is preserved. No boss entrance, Cut Man AI, gate closing or spike collision added.
