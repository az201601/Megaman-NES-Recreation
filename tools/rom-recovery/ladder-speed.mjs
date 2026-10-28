// Controlled MM5 climbing-state test, NOT a naturally reached ladder encounter.
// Inject class $20 at the original player terrain-result writes to represent
// continuing ladder tiles. No player movement instructions or ROM bytes patched.
import {NES,Controller} from 'jsnes';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url);
const rom=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary');
const snapshot=JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json',import.meta.url)));
const results=[];
for(const key of ['UP','DOWN','NONE']){
 const n=new NES();n.loadROM(rom);n.fromJSON(structuredClone(snapshot));
 for(let t=0;t<30;t++)n.frame();
 for(let b=0;b<8;b++)n.buttonUp(1,b);
 const m=n.cpu.mem;
 // Initialization values read from the original normal ladder-entry code.
 m[0x30]=3;m[0x330]=136;m[0x318]=0;
 m[0x378]=140;m[0x360]=0;m[0x3d8]=0x4c;m[0x3f0]=1;
 let injections=0;
 const write=n.cpu.write.bind(n.cpu);
 n.cpu.write=(address,value)=>{
  if(address>=0x48&&address<=0x4a&&n.cpu.REG_X===0
     &&n.cpu.REG_PC>=0xc4a1&&n.cpu.REG_PC<0xc6db){
   value=0x20;injections++;
  }
  return write(address,value);
 };
 if(key!=='NONE')n.buttonDown(1,Controller['BUTTON_'+key]);
 const rows=[];
 for(let t=1;t<=12;t++){
  n.frame();
  const y=m[0x378]+m[0x360]/256;
  assert.equal(y,140+(key==='UP'?-1:key==='DOWN'?1:0)*t*1.296875);
  assert.equal(m[0x30],3);
  assert.equal(m[0x330],136);
  rows.push({t,y,state:m[0x30]});
 }
 assert.ok(injections>0);
 results.push({key,injections,rows});
}
fs.writeFileSync(new URL('./.work/ladder-speed.json',import.meta.url),JSON.stringify(results,null,2));
console.log('Controlled ladder state: Up -1.296875, Down +1.296875 px/update; neutral holds position.');
console.log('Entry tolerances, top transitions, jump/drop, obstruction and animations are NOT established by this test.');
