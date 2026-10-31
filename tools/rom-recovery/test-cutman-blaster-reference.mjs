// Assertions over recorded native evidence; not a GMS compiler/runtime test.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url);
const rom=fs.readFileSync(new URL('Mega Man (USA).nes',root));
const r=JSON.parse(fs.readFileSync(new URL('Assets/Enemies/MM1/Blaster/Reference/native-blaster-cycle.json',root)));
for(const s of r.spans) assert.equal(rom.subarray(s.offset,s.offset+s.hex.length/2).toString('hex'),s.hex);
assert.equal(r.spans.reduce((n,s)=>n+s.hex.length/2,0),143);
assert.equal(r.firstSpawn.x,824);assert.equal(r.firstSpawn.y,72);
assert.equal(r.firstSpawn.camera,569);
assert.equal(r.records.length,11);
assert.equal(r.aiUpdates,765);
const shots=r.shotAttempts;
assert.ok(shots.length>=12);
for(let i=0;i<12;i+=4){
 assert.deepEqual(shots.slice(i,i+4).map(s=>s.parent.timer),[0,32,64,96]);
 for(let j=i+1;j<i+4;j++) assert.equal(shots[j].frame-shots[j-1].frame,32);
}
assert.equal(shots[4].frame-shots[0].frame,207);
assert.equal(shots[8].frame-shots[4].frame,207);
assert.deepEqual([...new Set(r.speedInitializations.map(s=>s.index))].sort((a,b)=>a-b),[12,16,20,24]);
console.log('PASS: 143 original USA bytes; 11 Blaster records; 765 observed AI updates; 3 four-shot bursts; 32-update spacing and 207-update repeat in controlled fixture.');
