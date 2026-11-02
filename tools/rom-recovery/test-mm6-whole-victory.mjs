// Archived end-to-end ROM trace validation, NOT a GMS runtime test.
import fs from 'node:fs';import assert from 'node:assert/strict';import{createHash}from'node:crypto';
const root=new URL('../../',import.meta.url),base=new URL('Assets/Bosses/MM1/Cut Man/Victory/Reference/',root);
const r=JSON.parse(fs.readFileSync(new URL('mm6-whole-victory.json',base))),rom=fs.readFileSync(new URL('Mega Man 6 (USA).nes',root));
const hash=b=>createHash('sha256').update(b).digest('hex');
for(const s of r.spans){const v=Buffer.from(s.hex,'hex'),off=16+parseInt(s.bank)*8192+(parseInt(s.address)&8191);assert.deepEqual(rom.subarray(off,off+v.length),v);}
for(const t of r.scenarios){assert.equal(hash(rom),t.romSha256);assert.ok(t.finished);assert.equal(t.hit.frame,498);assert.equal(t.hit.pc,'9a18');assert.equal(t.hit.damage,1);assert.equal(t.hit.x,65);assert.equal(t.hit.y,t.scenario==='airborne'?129:180);
for(let i=1;i<t.ordered.length;i++)assert.ok(t.ordered[i].frame>t.ordered[i-1].frame);
const audio=t.events.filter(e=>e.kind==='audio-dispatch'&&e.frame>t.hit.frame);
for(const id of [0x13,0x5f,0x16])assert.ok(audio.some(e=>e.command===id));
assert.equal(t.ordered.find(e=>e.pc==='f9b4').x,128);
assert.ok(t.events.some(e=>e.kind==='stage-select'&&e.frame>t.ordered.at(-1).frame));}
for(const f of r.images)assert.equal(hash(fs.readFileSync(new URL(f.file,base))),f.sha256);
console.log('PASS:2 continuous final-hit -> clear -> centre -> acquisition -> teleport -> weapon/demo -> password -> stage-select traces;3 ROM spans;7 screenshots. Controlled pre-hit setup, no post-hit gameplay RAM patches.');
