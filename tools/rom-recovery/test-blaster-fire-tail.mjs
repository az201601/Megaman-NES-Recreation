import fs from'node:fs';import assert from'node:assert/strict';import{createHash}from'node:crypto';
const base=new URL('../../Assets/Audio/Mega Man/MM1/Blaster/Tail Check/',import.meta.url);
const r=JSON.parse(fs.readFileSync(new URL('recovery.json',base)));
for(const f of r.files){const b=fs.readFileSync(new URL(f.name,base));assert.equal(createHash('sha256').update(b).digest('hex'),f.sha256);assert.equal((b.length-44)/192000,f.seconds);assert.equal(b.readUInt32LE(24),48000);assert.equal(b.readUInt16LE(22),2);assert.ok(f.peak<1);}
assert.deepEqual(r.requests.map(v=>v.f),[532,564,596,628]);assert.deepEqual(r.ends.map(v=>v.f),[542,542,574,574,606,606,638,638]);
assert.deepEqual(r.suppressed,[{phase:'encounter',f:300,id:255}]);assert.deepEqual(r.tail,[0,0]);
const full=fs.readFileSync(new URL('mm1-blaster-full-burst-untrimmed-balanced.wav',base));
const last=fs.readFileSync(new URL('mm1-blaster-last-shot-full-tail-balanced.wav',base));assert.deepEqual(last.subarray(44),full.subarray(44+r.lastStartSample*4));
const first=fs.readFileSync(new URL('mm1-blaster-first-shot-untrimmed-balanced.wav',base));assert.deepEqual(first.subarray(44),full.subarray(44+r.firstStartSample*4,44+r.firstEndSample*4));
assert.ok((r.totalSamples-r.ends.at(-1).sample)/48000>1);
console.log('PASS: untrimmed first/finalshot are exact continuous-burst PCM slices; original driver end-of-data for both channels on all4shots; >1s captured after final driver end;48kHz stereo,hashes,no clipping.');
