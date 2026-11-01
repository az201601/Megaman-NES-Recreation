# Flying Shell / Shellgun — original-ROM research checkpoint

**Reference evidence and recovered art only; no gameplay installer yet.** User accepted Octopus Battery (“confirmed working”), then authorized research of the next original enemy after the later Bladers. Preserve installed Blader/Blaster/Super Cutter/Flea/Octopus Battery. No working combat/camera/terrain/player/pause/audio resources changed here.

## Verified behavior

- Two native Cut Man records: type0A at page16X248/Y128 and page17X248/Y128. These are repeating screen-edge encounters, **not one-use stationary enemies**. The accepted camera maps them to right-edgeX2040/Y368 andY608, camera bands240/480 (sections9/10, viewX1792); this is a project coordinate mapping, not native geometry.
- Flies **left at288/256 =1.125pixels/update**, fixed native integer Y128. Source does not zero the position fractions on every reactivation; recorded fractional carry is retained. No homing or Flea-style skipped update.
- Timer increments before active-cycle checks; native movement uses previous speed first. Timer56 stops X movement and opens. Timer72 fires **eight bullets simultaneously**. Timer88 resets timer0, restores1.125speed and closes. A full cycle therefore contains56moving/32stationary enemy updates; movement away resumes on the following update. Snapshot lead-ins start mid-first-cycle, not at timer0.
- Eight-way burst uses original speed-table indices28,32,36,40,44,48,52,56. Cardinal speed4, diagonal component720/256=2.8125. Directions up,up-left,left,down-left,down,down-right,right,up-right. Original child type2D is the same projectile type used by Blaster; bullets are not homing or gravity-affected.
- **Closed blocks; open is one normal hit.** Two actual native-B controlled-overlap trials verify closed incoming-hit cleared/HP20unchanged/blocked queue1D, versus open hit through original subtraction converting to native death explosion1B. Native initialHP20/basic20 =>one normal hit while vulnerable. The obsolete HP byte can remain20after native death-type conversion; death is established by the1Btransition, not by pretending that byte became0.
- Body contact damage **1**, collision halfwidth8/halfheight9. Bullet contact damage **2**, halfwidth/halfheight1/1, normal damage0. MM5 charge/deflection will be explicit later project adaptations; MM1 has no charge shot. Keep approved MM6 successful-hit and blocked ding when integrating, not rejected original MM1 ding audio.
- Native offscreen departure reactivates a shell at cameraX+248 without a generic killed-record “wait until anchor leaves view” restriction. Both1000-update trials contain3offscreen reactivations. Killing creates an invisible replacement with native counter72; the controlled kill trace consumes two counter decrements during the death update and reactivates70subsequent emulator frames later. **Do not describe this as a universal72elapsed-frame delay.** New-instance ordering/fraction retention are part of the recorded native scheduling, not already implemented in GMS.

## Sound findings — no audio replacement approved here

Each eight-bullet burst issues **eight original15hex(21decimal) sound requests**, and all eight reach the opcode-qualified sound driver in the following emulator frame. **There is no deduplication in this trace.** It is the same sound-command ID as accepted Blaster firing, but this research does not prove an eight-dispatch burst has a sample-identical waveform to the approved single-shot recording. Do not stack eight WAV voices as an unverified substitute. A native full-APU burst comparison/capture remains part of the next audio/integration work before choosing reuse or presenting a new take. Existing approved WAVs, volumes/charge ownership remain untouched.

The closed-hit routine queues native1D. That is behavioral evidence only, not a request to replace the user-approved MM6blocked27 sound. Original impact/blocked traces are separate from normal movement sound observations.

## Original art

Two original poses recovered from live OAM/CHR/palette and independently opaque-pixel matched to native rendering. Closed is16×16; open has original17pxwidth because its middle tile pair sits1pxright of the top/bottom pairs. Common **17×24cells, origin8,11**, closed image4rows down, open at top. Strip orderclosed/open, canonical left. No cropping, invented pixels, procedural jaw or smoothing. Do not import yet without a complete gameplay installer. JSNES2.1.0 plus Mesen0.9.9RGB mapping, not a run of Mesen.exe.

## Evidence / limits / reproduction

`Reference/native-flying-shell.json`: supplied MM1USA SHA256,413exact source bytes checked against pinned TheRealQuantam/mm1base@9c1cb05bd1d63c176e1930053dda76bcb85cd977. Modified reference ROM never executed. Two1000-update trials inherit existing controlled first-through-tenth ladder probes and protected/high-Y traversals. Neutral inputs during observation; playerY36/verticalspeed0/protection100 pinned everyframe. Native enemy/spawn/bullet/sound code unmodified.

Across the two trials:1984consecutive active-cycle state/velocity/position transitions checked independently,1038bullet-position deltas checked,20bursts/160projectile initializations with160native15requests and160driver dispatches. Invisible/offscreen transitions recorded separately, not forced into the active-cycle model or mislabeled a fixed single-use spawn. Some emulator frames contain no AI update; cadence claims refer to **enemy updates**, not wall-clock frame identity.

Impact trials create a projectile via native B, then relocate only that projectile onto slot16 at an eligible alternating-parity TestShotHit pass. No enemy HP/state/flag patch. Open-kill continuation records birth/hidden countdown/reactivation. These are not natural aiming, unassisted whole-stage traversal, charged-MM1 behavior, a full audio waveform comparison or GMS/hardware certification.

`Reference/native-flying-shell-art.json` records OAM tile/attributes and RGBA hashes. No ROM, modified executable/disassembly dump or emulator states distributed.

Requires supplied ROM, pinned bank5/bank7 label dumps and ignored ninth/tenth ladder snapshots. From the existing fourth snapshot, regenerate fifth,sixth,seventh,eighth,ninth,tenth ladder probes in order, then:

```sh
node tools/rom-recovery/probe-flying-shell.mjs
node tools/rom-recovery/recover-flying-shell-art.mjs
node tools/rom-recovery/test-flying-shell-research.mjs
```

Next: native burst-audio comparison/capture, additive GMS1.4 repeated-spawn/flight/burst/closed-block/open-kill implementation, preserved MM5 combat/drop/pause/refill ownership, detailed resource/event instructions and GitHub install ZIP. **No gameplay integration/installation/runtime acceptance is claimed by this research checkpoint.**
