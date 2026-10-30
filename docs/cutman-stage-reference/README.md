# Cut Man opening — native encounter reference

Source: supplied Mega Man(USA) ROM, JSNES2.1.0, pinned Mesen0.9.9 RGB; NOT Mesen executable/hardware capture. Fresh stage from mm1-hurtwalk.mjs. Natural held Right with A pressed at updates1,71,141,211 and released25,95,165. No ROM/RAM modifications.

Images opening-100.png and opening-110.png are256x208 crops of original frame rows32..239, omitting original score rows. These are encounter REFERENCES, not GMS room backgrounds or imported art. Their cyan/terrain/objects are not to be flattened together in the recreation.

The opening blue/white flying enemy is Blader. Native first contact in this particular replay occurs at110: HP28->25. Next contact222:25->22. These timings describe this input trace only; not a spawn timer/attack cadence. Full test-frame observations in native-opening-observations.json. Do not infer flight velocity, trigger distance, attack cycle or GMS hitbox from these two pictures.

In frame100, visible enemy OAM uses six8x8 cells8A..8F, palette2, arranged16x24 at X151/159, Y98/106/114 (raw OAM Y; displayed sprite startsY+1). These are one observed pose, NOT a complete recovered animation strip or a16x24 collision mask.

Reproduce:
```
npm ci --prefix tools/rom-recovery --ignore-scripts
node tools/rom-recovery/mm1-hurtwalk.mjs
node tools/rom-recovery/inspect-cutman-opening.mjs
```

Implementation boundary: no enemy GML or installed damage logic in this reference checkpoint. Preserve working MM5 player/charge/arrival/healthHUD/pause. Before enemy installation, complete flight/attack/animation/shot-response/audio observations and MM5 damage, recoil, invulnerability and interruption cases. Earlier post-hit probes cover only part of that matrix; independently identified enemy-projectile test remains outstanding. No score or MM1 spike immunity bypass to add.
