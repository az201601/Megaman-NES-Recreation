// MM5 default buster charge/release observations. Original USA ROM via JSNES2.1.0.
// No GMS changes, audio isolation or altered charge/projectile routines.
import {NES,Controller} from 'jsnes';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url);
const rom=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary');
const snap=JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json',import.meta.url)));
function run(held,left=false){
 const n=new NES();n.loadROM(rom);n.fromJSON(structuredClone(snap));
 for(let b=0;b<8;b++)n.buttonUp(1,b);for(let t=0;t<30;t++)n.frame();
 const m=n.cpu.mem;assert.equal(m[0x32],0);assert.equal(m[0xaf],0);
 if(left){m[0x31]=2;m[0x420]=2;m[0x528]&=0xdf;}
 let t=0;const sounds=[],births=[],rows=[];
 const write=n.cpu.write.bind(n.cpu);
 n.cpu.write=(a,v)=>{
  if(a>=0x301&&a<=0x303&&v===0x70)births.push({t,slot:a-0x300,playerX:m[0x330]+m[0x318]/256,playerY:m[0x378]+m[0x360]/256});
  return write(a,v);
 };
 const emulate=n.cpu.emulate.bind(n.cpu);
 n.cpu.emulate=()=>{if(n.cpu.REG_PC===0xec5c)sounds.push({t,command:n.cpu.REG_ACC});return emulate();};
 for(t=1;t<=held+40;t++){
  if(t===1)n.buttonDown(1,Controller.BUTTON_B);
  if(t===held+1)n.buttonUp(1,Controller.BUTTON_B);
  n.frame();
  rows.push({t,state:m[0x30],charge:m[0x38],pose:m[0x33],animation:m[0x558],
   paletteIndices:Array.from(m.slice(0x611,0x614)),
   palette:Array.from(n.ppu.sprPalette.slice(0,8)),
   shots:[1,2,3].filter(i=>m[0x300+i]===0x70).map(i=>({slot:i,x:m[0x348+i]*256+m[0x330+i]+m[0x318+i]/256,y:m[0x378+i],
    speed:m[0x3c0+i]+m[0x3a8+i]/256,dir:m[0x420+i],animation:m[0x558+i],phase:m[0x540+i]}))});
 }
 return {held,left,births,sounds,rows};
}
const lengths=[1,2,15,16,17,18,19,20,31,32,33,34,35,39,40,41,42,47,48,49,50,79,80,81,82,83,84,85,86,180];
const results=lengths.map(h=>run(h));results.push(run(34,true),run(49,true),run(82,true));
fs.writeFileSync(new URL('./.work/charge-values.json',import.meta.url),JSON.stringify(results,null,2));
for(const c of results)console.log(JSON.stringify({held:c.held,left:c.left,births:c.births,sounds:c.sounds,
 before:c.rows[c.held-1].charge,release:c.rows[c.held],later:c.rows.slice(c.held,c.held+12).map(r=>[r.t,r.shots.map(s=>[s.slot,s.animation,s.speed,s.x])])}));


// First threshold sweep: input starts held on update1, releases on H+1.
for(const c of results){
 const {held:H,rows,births,sounds,left}=c;
 assert.ok(rows.every(r=>r.state===0),'Standing/normal-gravity baseline must stay stable');
 assert.equal(births[0].t,1);assert.equal(sounds[0].command,0x1a);
 assert.equal(births.filter(b=>b.t<=H).length,1,'Holding must not auto-fire');
 assert.equal(rows[0].charge,0);
 for(let t=2;t<=Math.min(H,86);t++)assert.equal(rows[t-1].charge,t-1);
 for(let t=87;t<=H;t++)assert.equal(rows[t-1].charge,80+(t-81)%6);
 assert.equal(rows[H].charge,H>=17?0:H-1,'Successful release resets charge; subthreshold residual persists');
 const releaseBirth=births.find(b=>b.t===H+1);
 assert.equal(!!releaseBirth,H>=17,'Release emission boundary');
 assert.equal(births.length,H>=17?2:1);
 assert.deepEqual(sounds.filter(s=>s.command===0x22),H>=34?[{t:34,command:0x22}]:[]);
 if(releaseBirth){
  const level=H>=81?2:H>=41?1:0;
  const shot=rows[H].shots.find(s=>s.slot===releaseBirth.slot);
  assert.equal(shot.animation,[0x18,0xa8,0xa9][level]);
  assert.equal(shot.speed,level?5:1075/256);
  assert.equal(releaseBirth.slot,level===2?1:H<27?2:3);
  assert.equal(shot.x,128+(left?-(level?20:15):(level?20:16))+(left?-1:1)*shot.speed);
  assert.equal(shot.y,179);assert.equal(rows[H].pose,16);
  assert.equal(sounds.at(-1).command,[0x1a,0x20,0x21][level]);
 }
}
console.log('Charge assertions passed: fresh press shot, counter starts next update, no hold autofire, release thresholds16/40/80, charge request32->33 at hold34, 80..85 cycle, three release types/sounds and speed5 charged.');

// Cross-check palette shadow writes against the ROM's charge palette tables.
// These RAM writes lead rendered PPU colours; don't confuse them with display timing.
const tables=[0x8f47,0x8f4f,0x8f57].map(a=>Array.from({length:8},(_,i)=>rom.charCodeAt(0x36010+a-0x8000+i)));
assert.deepEqual(tables.map(t=>t[0]),[0x0f,0x2c,0x11]);
for(const c of results){
 for(let i=0;i<c.held;i++){
  const r=c.rows[i],counter=r.charge;
  const index=counter>=80?5+((counter&15)>>1):((counter&2)?((counter>>4)&7):0);
  assert.deepEqual(r.paletteIndices,tables.map(t=>t[index]),'Charge palette RAM/table correspondence');
 }
 if(c.held>=17){
  for(let j=0;j<16;j++)assert.equal(c.rows[c.held+j].pose,16-j);
  assert.equal(c.rows[c.held+16].pose,0);
 }
 for(let i=1;i<c.rows.length;i++)for(const shot of c.rows[i].shots){
  const prev=c.rows[i-1].shots.find(s=>s.slot===shot.slot);
  if(prev&&!c.births.some(b=>b.t===c.rows[i].t&&b.slot===shot.slot)){
   assert.equal(shot.x-prev.x,(shot.dir===1?1:-1)*shot.speed);
   assert.equal(shot.y,prev.y);
  }
 }
}
console.log('Palette ROM-table/RAM checks, release pose16, projectile motion/fixedY checks passed. Rendered PPU palettes are logged separately; no Mesen capture claim.');
