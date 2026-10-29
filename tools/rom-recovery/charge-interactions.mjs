// Original-ROM charge interaction probes. Controlled setups explicitly marked.
import {NES,Controller} from 'jsnes';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url);
const rom=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary');
const snap=JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json',import.meta.url)));
const cases=[
 {name:'walk mid release',release:42,keys:t=>t>=35?['RIGHT']:[]},
 {name:'walk full release',release:82,keys:t=>t>=75?['RIGHT']:[]},
 {name:'air full release',release:82,keys:t=>t>=75?['A']:[]},
 {name:'ladder up full release',ladder:true,start:3,release:84,keys:t=>['UP']},
 {name:'ladder down mid release',ladder:true,start:3,release:44,keys:t=>['DOWN']},
 {name:'release during slide',release:60,keys:t=>t===50?['DOWN','A']:[]},
 {name:'hold through slide',release:82,keys:t=>t===50?['DOWN','A']:[]},
 {name:'start hold during slide',start:5,release:86,keys:t=>t===1?['DOWN','A']:[]},
 ...[1,2,4,7].map(mask=>({name:'full occupied mask'+mask,release:82,mask})),
 ...[1,2,4,7].map(mask=>({name:'mid occupied mask'+mask,release:42,mask})),
];
const results=[];
for(const c of cases){
 const n=new NES();n.loadROM(rom);n.fromJSON(structuredClone(snap));
 for(let b=0;b<8;b++)n.buttonUp(1,b);for(let t=0;t<30;t++)n.frame();
 const m=n.cpu.mem;assert.equal(m[0x32],0);assert.equal(m[0xaf],0);
 if(c.ladder){m[0x30]=3;m[0x330]=136;m[0x318]=0;m[0x378]=140;m[0x360]=0;m[0x3d8]=0x4c;m[0x3f0]=1;}
 let t=0,template;const births=[],sounds=[],rows=[],spawnWrites=[];
 const write=n.cpu.write.bind(n.cpu);
 n.cpu.write=(a,v)=>{
  if(c.ladder&&a>=0x48&&a<=0x4a&&n.cpu.REG_X===0&&n.cpu.REG_PC>=0xc4a1&&n.cpu.REG_PC<0xc6db)v=0x20;
  if(a>=0x301&&a<=0x303&&v===0x70)births.push({t,slot:a-0x300,px:m[0x330]+m[0x318]/256,py:m[0x378]+m[0x360]/256});
  if((a>=0x331&&a<=0x333)||(a>=0x379&&a<=0x37b))spawnWrites.push({t,a,v,pc:n.cpu.REG_PC});
  return write(a,v);
 };
 const emulate=n.cpu.emulate.bind(n.cpu);
 n.cpu.emulate=()=>{if(n.cpu.REG_PC===0xec5c)sounds.push({t,command:n.cpu.REG_ACC});return emulate();};
 for(t=1;t<=c.release+20;t++){
  for(let b=0;b<8;b++)n.buttonUp(1,b);
  for(const k of c.keys?.(t)||[])n.buttonDown(1,Controller['BUTTON_'+k]);
  if(t>=(c.start||1)&&t<c.release)n.buttonDown(1,Controller.BUTTON_B);
  // Controlled slot occupancy just before release: clone initialized original basic shot.
  // Do NOT patch the charge, allocation, emission or movement routines.
  if(c.mask&&t===c.release){
   assert.ok(template);
   for(let slot=1;slot<=3;slot++){
    if(c.mask&(1<<(slot-1))){
     for(const [a,v] of template)m[a-3+slot]=v;
     m[0x330+slot]=200;m[0x318+slot]=0;m[0x348+slot]=0;
    }else m[0x300+slot]=0;
   }
  }
  n.frame();
  if(t===1)template=Array.from({length:32},(_,i)=>[0x303+24*i,m[0x303+24*i]]);
  rows.push({t,state:m[0x30],x:m[0x330]+m[0x318]/256,y:m[0x378]+m[0x360]/256,charge:m[0x38],pose:m[0x33],animation:m[0x558],
   shots:[1,2,3].filter(i=>m[0x300+i]===0x70).map(i=>({slot:i,x:m[0x348+i]*256+m[0x330+i]+m[0x318+i]/256,y:m[0x378+i],animation:m[0x558+i],speed:m[0x3c0+i]+m[0x3a8+i]/256}))});
 }
 const out={name:c.name,release:c.release,controlledLadder:!!c.ladder,controlledOccupancy:c.mask||0,births,sounds,spawnWrites,rows};results.push(out);
 console.log(JSON.stringify({name:c.name,births,sounds,pre:rows[c.release-2],release:rows[c.release-1],after:rows[c.release]}));
}
fs.writeFileSync(new URL('./.work/charge-interactions.json',import.meta.url),JSON.stringify(results,null,2));

const get=name=>results.find(c=>c.name===name);
for(const name of ['walk mid release','walk full release','air full release','ladder up full release','ladder down mid release']){
 const c=get(name),b=c.births.find(b=>b.t===c.release);assert.ok(b,name+' release');
 const r=c.rows[c.release-1],s=r.shots.find(s=>s.slot===b.slot);
 assert.equal(s.speed,5);assert.equal(s.x,Math.floor(b.px)+25);assert.equal(s.y,Math.floor(b.py)-1);
 const xWrite=c.spawnWrites.find(w=>w.t===c.release&&w.a===0x330+b.slot);
 const yWrite=c.spawnWrites.find(w=>w.t===c.release&&w.a===0x378+b.slot);
 assert.equal(xWrite.v,Math.floor(b.px)+20);assert.equal(yWrite.v,Math.floor(b.py)-1);
 assert.equal(r.pose,16);assert.equal(r.charge,0);
 if(c.controlledLadder){
  const y=c.rows[c.release-2].y;
  assert.ok(c.rows.slice(c.release-1,c.release+15).every(r=>r.state===3&&r.y===y));
  assert.equal(c.rows[c.release+15].y-y,name.includes('up')?-1.296875:1.296875);
 }
}
assert.equal(get('air full release').rows[81].state,1);
for(const name of ['release during slide','hold through slide']){
 const c=get(name);assert.ok(c.rows.slice(49,68).every(r=>r.state===2&&r.charge===48));
 assert.equal(c.rows[68].state,0);assert.equal(c.rows[68].charge,48);
}
assert.deepEqual(get('release during slide').births.map(b=>b.t),[1,70]);
assert.equal(get('hold through slide').rows[80].charge,60);
assert.equal(get('hold through slide').rows[81].shots[0].animation,0xa8);
assert.deepEqual(get('start hold during slide').births.map(b=>b.t),[86]);
assert.equal(get('start hold during slide').rows[19].charge,0);
assert.equal(get('start hold during slide').rows[20].charge,1);
for(const mask of [1,2,4,7]){
 const full=get('full occupied mask'+mask);
 assert.deepEqual(full.births.map(b=>b.t),[1]);assert.equal(full.rows[81].charge,1);assert.equal(full.rows[81].pose,0);
 assert.ok(!full.sounds.some(s=>s.command===0x21));
 assert.equal(full.rows.at(-1).shots.length,0,'Injected basic shots have cleared; no deferred full emission');
 const mid=get('mid occupied mask'+mask);
 const birth=mid.births[1];assert.equal(birth.t,mask===7?56:42);assert.equal(birth.slot,mask===4?2:3);
 assert.equal(mid.sounds.filter(s=>s.command===0x20).length,1);
 if(mask===7){assert.equal(mid.rows[41].charge,40);assert.equal(mid.rows[41].pose,0);}
}
console.log('16 charge interaction cases passed: moving/air/ladder releases and direct spawn writes, ladder pause16, slide charge freeze/delayed release, controlled full-slot rejection and pending intermediate release.');
