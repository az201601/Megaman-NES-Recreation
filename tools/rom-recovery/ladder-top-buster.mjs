// Controlled spatial ladder-top probes, original MM5 USA player/firing routines.
// NOT natural stage capture. Only terrain class results at verified lookup hooks supplied.
import {NES,Controller} from 'jsnes';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url);
const rom=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary');
const snap=JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json',import.meta.url)));
const results=[];
for(const left of [false,true])for(const y of [124,127,128,140])for(const mode of ['tap','hold','mid-release','full-release','descend-mid','ascend-basic','natural-mid','natural-full']){
 const n=new NES();n.loadROM(rom);n.fromJSON(structuredClone(snap));
 for(let b=0;b<8;b++)n.buttonUp(1,b);for(let t=0;t<30;t++)n.frame();
 const m=n.cpu.mem;assert.equal(m[0x32],0);assert.equal(m[0xaf],0);
 Object.assign(m,{[0x30]:3,[0x330]:136,[0x318]:0,[0x378]:y,[0x360]:0,[0x3d8]:0x4c,[0x3f0]:1});
 if(left){m[0x31]=2;m[0x420]=2;m[0x528]&=0xdf;}
 m[0x48]=0;m[0x49]=y>=128?0x20:0;m[0x4a]=0x20;
 let t=0,reads=0;const sounds=[],births=[],rows=[];
 const write=n.cpu.write.bind(n.cpu);
 n.cpu.write=(a,v)=>{if(a>=0x301&&a<=0x303&&v===0x70)births.push({t,slot:a-0x300,py:m[0x378]+m[0x360]/256});return write(a,v);};
 const emulate=n.cpu.emulate.bind(n.cpu);
 n.cpu.emulate=()=>{
  const pc=n.cpu.REG_PC;
  if(pc===0xec5c)sounds.push({t,command:n.cpu.REG_ACC});
  if(n.cpu.REG_X===0&&(pc===0xc550||pc===0xc658)){
   assert.equal(n.mmap.load(pc+1),0x29);assert.equal(n.mmap.load(pc+2),0xf0);
   n.cpu.REG_ACC=m[0x11]>=128?0x20:0;reads++;
  }
  return emulate();
 };
 for(t=1;t<=110;t++){
  for(let b=0;b<8;b++)n.buttonUp(1,b);
  if(mode==='tap'&&t===3||mode==='hold'&&t>=3||mode==='ascend-basic'&&t===3)n.buttonDown(1,Controller.BUTTON_B);
  if(mode==='ascend-basic'&&t>=3)n.buttonDown(1,Controller.BUTTON_UP);
  if(mode==='natural-mid'&&t>=3&&t<44||mode==='natural-full'&&t>=3&&t<84)n.buttonDown(1,Controller.BUTTON_B);
  // Controlled retained meter isolates release at lip from approach timing.
  if((mode==='mid-release'||mode==='descend-mid')&&t===3)m[0x38]=40;
  if(mode==='full-release'&&t===3)m[0x38]=80;
  if(mode==='descend-mid'&&t>=3)n.buttonDown(1,Controller.BUTTON_DOWN);
  n.frame();
  rows.push({t,camera:m[0xfc],x:m[0x330]+m[0x318]/256,y:m[0x378]+m[0x360]/256,state:m[0x30],charge:m[0x38],pose:m[0x33],animation:m[0x558],terrain:Array.from(m.slice(0x48,0x4b)),shots:[1,2,3].filter(i=>m[0x300+i]===0x70).map(i=>({slot:i,animation:m[0x558+i],x:m[0x348+i]*256+m[0x330+i]+m[0x318+i]/256,y:m[0x378+i]}))});
 }
 assert.ok(reads>0);results.push({left,y,mode,reads,sounds,births,rows});
 console.log(JSON.stringify({left,y,mode,sounds,births,rows:rows.filter((r,i)=>i<4||i&&r.animation!==rows[i-1].animation||i&&r.charge!==rows[i-1].charge&&r.t<10).slice(0,15)}));
}
fs.writeFileSync(new URL('./.work/ladder-top-buster.json',import.meta.url),JSON.stringify(results,null,2));

for(const c of results.filter(c=>c.y<128)){
 const r=c.rows,sign=c.left?-1:1;
 assert.equal(r[1].state,3);assert.equal(r[1].animation,20,'Settled native lip pose');
 if(c.mode==='tap'||c.mode==='mid-release'||c.mode==='full-release'){
  assert.equal(c.births.length,1);assert.equal(c.births[0].t,3);
  assert.equal(r[2].pose,16);assert.equal(r[2].animation,21);
  assert.ok(r.slice(2,18).every(v=>v.animation===21&&v.y===c.y));
  assert.equal(r[18].animation,20);assert.equal(r[18].pose,0);
  const basic=c.mode==='tap';assert.equal(r[2].shots[0].animation,basic?24:c.mode==='mid-release'?168:169);
  assert.equal(r[2].shots[0].y,c.y-1);
  assert.equal(r[2].shots[0].x,basic?136+(c.left?-15:16)+sign*1075/256:136+sign*25);
 }
 if(c.mode==='hold'){assert.equal(r[3].charge,1);assert.equal(r[82].charge,80);assert.deepEqual(c.sounds,[{t:3,command:26},{t:36,command:34}]);}
 if(c.mode.startsWith('natural-')){
  const release=c.mode==='natural-mid'?44:84;
  assert.deepEqual(c.births.map(b=>b.t),[3,release]);
  assert.equal(r[release-1].animation,21);assert.equal(r[release-1].charge,0);
  assert.equal(r[release-1].shots[0].animation,release===44?168:169);
  assert.deepEqual(c.sounds.map(s=>s.command),[26,34,release===44?32:33]);
 }
 if(c.mode==='descend-mid'||c.mode==='ascend-basic'){
  assert.ok(r.slice(2,18).every(v=>v.y===c.y&&v.animation===21));
  assert.equal(r[18].y,c.y+(c.mode==='descend-mid'?1:-1)*1.296875);
 }
}
console.log('PASS:64 controlled terrain/meter cases; settled lip animation14hex ->15hex for basic/mid/full,16 pause, natural held thresholds/audio. Not natural stage/ledge completion certification.');
