// Archived linked trace + supplied ROM spans, not a natural boss-kill certification.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url);
const r=JSON.parse(fs.readFileSync(new URL('Assets/Bosses/MM1/Cut Man/Victory/Reference/mm6-linked-victory.json',root)));
const rom=fs.readFileSync(new URL('Mega Man 6 (USA).nes',root));
for(const s of r.spans){const v=Buffer.from(s.hex,'hex'),off=16+parseInt(s.bank)*8192+(parseInt(s.address)&8191);assert.deepEqual(rom.subarray(off,off+v.length),v);}
const event=(kind,pc)=>r.events.find(e=>e.kind===kind&&e.pc===pc);
const order=[event('linked-victory-code','9145'),event('teleport','dfb9'),event('teleport','dff3'),event('award','bd1b'),event('award','be42'),event('award','bea9')];
assert.ok(order.every(Boolean));
for(let i=1;i<order.length;i++)assert.ok(order[i].frame>order[i-1].frame);
assert.equal(r.events.filter(e=>e.kind==='audio-dispatch'&&e.command===0x23).length,4);
assert.equal(r.frames,1121);
console.log('PASS:4 native linking spans; continuous acquisition -> teleport -> award -> demo trace. Final-hit/clear/centre not executed by this fixture.');
