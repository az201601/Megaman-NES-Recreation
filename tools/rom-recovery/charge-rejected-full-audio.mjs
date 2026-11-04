// Controlled occupied slot at full release; all charge/audio routines original.
import {NES,Controller} from 'jsnes';import fs from 'node:fs';import assert from 'node:assert/strict';
const n=new NES({sampleRate:48000});n.loadROM(fs.readFileSync('Mega Man 5 (USA).nes','binary'));n.fromJSON(JSON.parse(fs.readFileSync('tools/rom-recovery/.work/mm5-stage.json')));for(let b=0;b<8;b++)n.buttonUp(1,b);
const q=n.cpu.mem[0xda];n.cpu.mem[0xdc+q]=0xf0;n.cpu.mem[0xda]=(q+1)&7;for(let i=0;i<150;i++)n.frame();
let frame=0,template;const writes=[],requests=[];const wr=n.papu.writeReg.bind(n.papu);n.papu.writeReg=(a,v)=>{writes.push([frame,a,v]);return wr(a,v);};const em=n.cpu.emulate.bind(n.cpu);n.cpu.emulate=()=>{if(n.cpu.REG_PC===0xec5c)requests.push([frame,n.cpu.REG_ACC]);return em();};
for(frame=0;frame<180;frame++){
 if(frame===10)n.buttonDown(1,Controller.BUTTON_B);
 if(frame===91){for(const [a,v] of template)n.cpu.mem[a]=v;n.cpu.mem[0x333]=200;n.cpu.mem[0x31b]=0;n.buttonUp(1,Controller.BUTTON_B);}
 n.frame();if(frame===10)template=Array.from({length:32},(_,i)=>[0x303+i*24,n.cpu.mem[0x303+i*24]]);
}
assert.deepEqual(requests,[[10,26],[43,34]]);
assert.equal(n.cpu.mem[0x38],1);
assert.ok(writes.some(w=>w[0]>=170&&w[1]===0x4004&&w[2]===0x7a));
assert.ok(!writes.some(w=>w[0]>91&&w[1]===0x4004&&w[2]===0x30));
fs.writeFileSync(new URL('./.work/charge-rejected-full-audio.json',import.meta.url),JSON.stringify({requests,writes,charge:n.cpu.mem[0x38]},null,2));
console.log('Controlled rejected full release: no release request, counter1 and original charge voice continues through179 (not automatically silenced).');
