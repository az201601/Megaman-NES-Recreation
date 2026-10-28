// Normal grounded walk from idle; requires mm5-stage.mjs output.
import {NES,Controller} from 'jsnes';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const n=new NES();
n.loadROM(fs.readFileSync(new URL('../../Mega Man 5 (USA).nes',import.meta.url),'binary'));
n.fromJSON(JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json',import.meta.url))));
for(let b=0;b<8;b++)n.buttonUp(1,b);
for(let t=0;t<30;t++)n.frame();
const x=()=>n.cpu.mem[0x330]+256*n.cpu.mem[0x348]+n.cpu.mem[0x318]/256;
const probes=[];
const emulate=n.cpu.emulate.bind(n.cpu);
n.cpu.emulate=()=>{
  if(n.cpu.REG_PC===0xc5a9&&n.cpu.REG_X===0&&n.cpu.REG_Y<=1){
    const selector=n.cpu.REG_Y;
    const offset=n.mmap.load(0xc8e2+selector);
    const row=Array.from({length:5},(_,i)=>n.mmap.load(0xc912+offset+i));
    probes.push({selector,offset,row});
  }
  return emulate();
};
const rows=[];
n.buttonDown(1,Controller.BUTTON_RIGHT);
for(let t=1;t<=24;t++){
  const before=x();n.frame();
  rows.push({update:t,x:x(),dx:x()-before});
}
assert.equal(rows[0].dx,1.296875);
for(let i=1;i<=5;i++)assert.equal(rows[i].dx,0);
for(let i=6;i<24;i++)assert.equal(rows[i].dx,1.296875);
assert.ok(probes.some(p=>p.selector===0));
assert.deepEqual(probes.find(p=>p.selector===0).row,[2,8,247,9,11]);
// Opposite-direction table is adjacent; verify it directly in the fixed bank.
const leftOffset=n.mmap.load(0xc8e3);
assert.deepEqual(Array.from({length:5},(_,i)=>n.mmap.load(0xc912+leftOffset+i)),[2,248,247,9,11]);
n.buttonUp(1,Controller.BUTTON_RIGHT);
const stop=x();for(let t=0;t<4;t++)n.frame();assert.equal(x(),stop);
fs.writeFileSync(new URL('./.work/walk-values.json',import.meta.url),JSON.stringify({rows,probes},null,2));
console.log('Ground walk: 1.296875 px/update; first move then 5 paused updates; release stops displacement.');
console.log('Wall tables: X +8/-8; Y starts -9 then increments +9 and +11 => -9,0,+11.');
