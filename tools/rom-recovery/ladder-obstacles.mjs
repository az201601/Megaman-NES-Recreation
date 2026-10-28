// Controlled MM5 ladder obstacle probe: synthetic spatial terrain, NOT a natural encounter.
// Supply raw terrain classes just before the original AND #$f0 instructions:
// $C551 vertical movement lookup; $C659 body/ladder lookup. No ROM bytes patched.
// Unlike replacing only $48-$4A writes, this also feeds the original $10 aggregate
// and collision carry/snap paths. JSNES REG_PC is one less than the next opcode.
import {NES, Controller} from 'jsnes';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root = new URL('../../', import.meta.url);
const rom = fs.readFileSync(new URL('Mega Man 5 (USA).nes', root), 'binary');
const snapshot = JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json', import.meta.url)));
const results = [];
for (const key of ['UP', 'DOWN']) for (const obstacle of ['ceiling', 'floor']) {
    const n = new NES(); n.loadROM(rom); n.fromJSON(structuredClone(snapshot));
    for (let t = 0; t < 30; t++) n.frame();
    for (let b = 0; b < 8; b++) n.buttonUp(1, b);
    const m = n.cpu.mem;
    m[0x30] = 3; m[0x330] = 136; m[0x318] = 0;
    m[0x378] = 140; m[0x360] = 0; m[0x3d8] = 0x4c; m[0x3f0] = 1;
    let movementReads = 0, bodyReads = 0, solidReads = 0;
    let update = 0;
    const soundRequests = [];
    const emulate = n.cpu.emulate.bind(n.cpu);
    n.cpu.emulate = () => {
        const pc = n.cpu.REG_PC;
        if (pc === 0xec5c) soundRequests.push({update, command: n.cpu.REG_ACC});
        if (n.cpu.REG_X === 0 && (pc === 0xc550 || pc === 0xc658)) {
            // Verify the original next instruction really masks the loaded class.
            assert.equal(n.mmap.load(pc + 1), 0x29);
            assert.equal(n.mmap.load(pc + 2), 0xf0);
            const probeY = m[0x11];
            const solid = obstacle === 'ceiling'
                ? probeY >= 96 && probeY < 112
                : probeY >= 160 && probeY < 176;
            n.cpu.REG_ACC = solid ? 0x10 : 0x20;
            if (pc === 0xc550) movementReads++; else bodyReads++;
            if (solid) solidReads++;
        }
        return emulate();
    };
    n.buttonDown(1, Controller['BUTTON_' + key]);
    const rows = [];
    for (let t = 1; t <= 30; t++) {
        if (t === 25) for (let b = 0; b < 8; b++) n.buttonUp(1, b);
        if (t === 28) n.buttonDown(1, Controller[key === 'UP' ? 'BUTTON_DOWN' : 'BUTTON_UP']);
        update = t;
        n.frame();
        rows.push({t, y: m[0x378] + m[0x360] / 256, state: m[0x30],
            timer: m[0x570], frame: m[0x540], animation: m[0x558]});
    }
    assert.ok(movementReads > 0 && bodyReads > 0);
    if (key === 'UP' && obstacle === 'ceiling') {
        assert.ok(solidReads > 0);
        assert.ok(rows.every(r => r.state === 3));
        // Native snap preserves fraction; integer position remains 121 at the stop.
        assert.ok(rows.slice(13, 24).every(r => Math.floor(r.y) === 121 && r.timer === 1));
        assert.ok(rows.slice(13, 27).every(r => r.frame === rows[13].frame));
        assert.ok(rows.slice(24, 27).every(r => r.y === rows[23].y));
        assert.equal(rows[27].y - rows[26].y, 1.296875);
    } else if (key === 'DOWN' && obstacle === 'floor') {
        assert.ok(solidReads > 0);
        assert.equal(rows[5].state, 3); assert.equal(rows[6].state, 0);
        assert.ok(rows.slice(6, 27).every(r => r.y === rows[6].y && r.state === 0));
        assert.equal(rows[27].state, 3); // Up recaptures, no displacement on this update.
        assert.equal(rows[27].y, rows[26].y);
        assert.equal(rows[28].y - rows[27].y, -1.296875);
    } else {
        for (let t = 1; t <= 24; t++) {
            assert.equal(rows[t - 1].state, 3);
            assert.equal(rows[t - 1].y, 140 + (key === 'UP' ? -1 : 1) * t * 1.296875);
        }
    }
    assert.deepEqual(soundRequests, [], "No sound commands in these controlled contacts");
    results.push({key, obstacle, movementReads, bodyReads, solidReads, soundRequests, rows});
}
fs.writeFileSync(new URL('./.work/ladder-obstacles.json', import.meta.url), JSON.stringify(results, null, 2));
console.log('Passed spatial terrain probes: ceiling keeps attachment and freezes phase; floor exits to state 0; reversing away works.');
console.log('Controlled static class-$10 geometry only; moving/removable object contacts and natural stage encounters are NOT established.');
