// Independent fixed-point model against CPU-entry snapshot and original native outcome.
import fs from'node:fs';import assert from'node:assert/strict';import{PNG}from'pngjs';
const base=new URL('../../Assets/Enemies/MM1/Blader/Reference/',import.meta.url);
const t=JSON.parse(fs.readFileSync(new URL('native-blader-trace.json',base)));
let updates=0,attacks=0,turns=0;
for(const [mode,rows]of Object.entries(t.branches))for(const row of rows){
 if(!row.entry)continue;
 const b=row.entry,a=row.after;let{timer,vx,vyRaw,flags}=b;
 if(timer===0){
  const dx=b.px-Math.floor(b.x);flags=(flags&~64)|(dx>=0?64:0);
  if((Math.abs(dx)&255)<40){
   const dy=b.py-Math.floor(b.y),speed=Math.floor(Math.abs(dy)*256/24);
   vyRaw=(dy>=0?-speed:speed)&65535;timer=51;vx=0;attacks++;
  }
 }
 if(timer!==0){
  if(timer>=27)vx+=24/256;
  else{if(timer===26){vyRaw=(-vyRaw)&65535;turns++;}vx+=4/256;}
  timer--;
  if(timer===0){vyRaw=0;vx=1.125;}
 }
 const x=b.x+((flags&64)?vx:-vx),signed=vyRaw>=32768?vyRaw-65536:vyRaw,y=(b.y-signed/256+256)%256;
 const id=`${mode}:${row.update}`;
 assert.equal(a.timer,timer,id+'timer');assert.equal(a.vx,vx,id+'vx');assert.equal(a.vyRaw,vyRaw,id+'vy');assert.equal(a.flags&64,flags&64,id+'dir');
 assert.equal(a.x,x,id+'X');assert.equal(a.y,y,id+'Y');updates++;
}
assert.ok(updates>900);assert.ok(attacks>10);assert.ok(turns>10);assert.equal(t.verifiedBytes,249);
assert.equal(t.poses.length,2);assert.ok(t.poses.every(p=>p.matchedRender));
const strip=PNG.sync.read(fs.readFileSync(new URL('spr_mm1_blader_reference_strip2.png',base)));assert.equal(strip.width,32);assert.equal(strip.height,24);
assert.ok(Array.from(strip.data).filter((_,i)=>i%4===3).every(v=>v===0||v===255));
// First uninterrupted visible rotor run repeats every3 captured frames.
const seq=t.branches.right.filter(r=>r.pose!==null).slice(0,18).map(r=>r.pose);
assert.deepEqual(seq,[0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1]);
console.log(`PASS${updates}original Blader AI updates: exact fixed-point X/Y/speeds/timer/direction;${attacks}attack entries;${turns}reversals;2native poses/3update rotor. NOT GMS runtime.`);
