// Re-record both historical natural sequences and corrected separate reviews,
// then verify the original game's successful-release/charge-stop transition.
import './record-charge-sfx.mjs';
import './record-charge-effects.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const read=name=>JSON.parse(fs.readFileSync(new URL('./.work/'+name,import.meta.url)));
for(const kind of ['mid','full']){
 const d=read(`charge-${kind}-direct-recording.json`);
 const release=kind==='mid'?51:91;
 const has=(frame,address,value)=>d.writes.some(w=>w.frame===frame&&w.address===address&&w.value===value);
 if(kind==='mid'){
  assert.ok(has(release+1,0x4004,0x30));
  assert.ok(!d.writes.some(w=>w.frame>release+1&&w.address===0x4004&&w.value!==0x30));
 }else{
  assert.ok(has(release+2,0x4004,0x7d));
  assert.ok(has(release+9,0x4004,0x30));
  assert.ok(!d.writes.some(w=>w.frame>release+9&&w.address===0x4004&&w.value!==0x30));
 }
 const s=read(`charge-effect-${kind}.json`);
 assert.deepEqual(s.requests.filter(r=>r.captured).map(r=>r.sound),[kind==='mid'?32:33]);
 assert.equal(s.controlledMeter,true);
}
const charge=read('charge-effect-charge.json');
assert.equal(charge.controlledMeter,false);
assert.deepEqual(charge.requests.filter(r=>r.captured).map(r=>r.sound),[34]);
function cycle(t){return charge.writes.filter(w=>w.frame>=t&&w.frame<t+8).map(w=>[w.frame-t,w.address,w.value]);}
for(let i=1;i<=17;i++)assert.deepEqual(cycle(110+i*8),cycle(110),'Stable native charge register pattern repeats8 updates');
console.log('Charge audio verified: no press shot in any separate clip; no charging in release clips; original successful releases replace charge voice; stable charge register cycle8. Preview is NOT a seamless PCM loop.');
