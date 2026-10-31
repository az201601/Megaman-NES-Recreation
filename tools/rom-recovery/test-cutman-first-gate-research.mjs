// Research assertions only. Does not test a GameMaker implementation.
import fs from'node:fs';import assert from'node:assert/strict';import crypto from'node:crypto';
const root=new URL('../../',import.meta.url),dir=new URL('Assets/Cut Man/Stage/First Gate Research/',root),audio=new URL('Assets/Audio/Mega Man/MM5/Stage/Gate/',root);
const d=JSON.parse(fs.readFileSync(new URL('native-gate.json',dir))),row=f=>d.rows.find(r=>r.frame===f),m=fs.readFileSync(new URL('Mega Man (USA).nes',root));
for(const[offset,hex]of[[0x1d066,'a631bd6ed04c9bd0'],[0x1d09b,'eea006209cc348a9242077c468'],[0x1d0f3,'a9062009d1']])assert.equal(m.subarray(16+offset,16+offset+hex.length/2).toString('hex'),hex,'MM1 supplied USA bytes vs annotated source');
assert.equal(row(19).type,0);assert.equal(row(20).type,2);assert.equal(row(171).type,2);assert.equal(row(172).type,0);
assert.ok(d.events.some(e=>e.frame===52&&e.pc==='d066'));
assert.ok(!d.events.some(e=>['d074','d092'].includes(e.pc)),'No second-door/close call during this first entrance probe');
const changed=d.rows.filter((r,i)=>i&&JSON.stringify(r.gateRight)!==JSON.stringify(d.rows[i-1].gateRight)).map(r=>r.frame);
assert.deepEqual(changed.filter(f=>f<76),[53,59,65,71]);
for(let frame=76;frame<=139;frame++){const r=row(frame),step=frame-75;assert.equal(r.cameraX,4864+step*4);assert.equal(r.logicalX,5080.25+step);}
assert.equal(row(139).pose,0);assert.equal(row(138).pose,6);
assert.deepEqual([row(172).begin,row(172).end,row(172).order],[20,22,12]);
const fresh=JSON.parse(fs.readFileSync(new URL('native-ready.json',dir))).results;
assert.ok(fresh.filter(r=>r.pressAge<=152).every(r=>r.x===5144.25));assert.ok(fresh.filter(r=>r.pressAge>=153).every(r=>r.x>5144.25));
const boundary=JSON.parse(fs.readFileSync(new URL('native-boundary.json',dir))).rows;
assert.ok(boundary.slice(30).every(r=>Math.floor(r.x)===5144&&r.order===12));
const report=JSON.parse(fs.readFileSync(new URL('recovery.json',audio))),wav=fs.readFileSync(new URL('snd_mm5_gate_open.wav',audio));
assert.equal(crypto.createHash('sha256').update(wav).digest('hex'),report.sha256);assert.equal(wav.length,report.bytes);assert.equal(wav.readUInt32LE(24),48000);assert.equal(wav.readUInt16LE(22),2);assert.equal(report.warmPeak,0);
console.log('PASS MM1 USA gate-byte spans, native timing/strips, all64camera/player steps, fresh-input release, no first-gate close call, one-way boundary, MM5 isolated WAV integrity. Research only; no GMS runtime claim.');
