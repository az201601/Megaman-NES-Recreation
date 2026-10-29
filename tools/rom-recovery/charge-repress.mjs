// MM5 default buster charge/release observations. Original USA ROM via JSNES2.1.0.
// No GMS changes, audio isolation or altered charge/projectile routines.
import {NES,Controller} from 'jsnes';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url);
const rom=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary');
const snap=JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json',import.meta.url)));
function run(held,left=false,pending=false){
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
  if(t===held+2)n.buttonDown(1,Controller.BUTTON_B);
  if(t===held+3){if(pending)m[0x38]=40;n.buttonUp(1,Controller.BUTTON_B);}
  n.frame();
  rows.push({t,state:m[0x30],charge:m[0x38],pose:m[0x33],animation:m[0x558],
   paletteIndices:Array.from(m.slice(0x611,0x614)),
   palette:Array.from(n.ppu.sprPalette.slice(0,8)),
   shots:[1,2,3].filter(i=>m[0x300+i]===0x70).map(i=>({slot:i,x:m[0x348+i]*256+m[0x330+i]+m[0x318+i]/256,y:m[0x378+i],
    speed:m[0x3c0+i]+m[0x3a8+i]/256,dir:m[0x420+i],animation:m[0x558+i],phase:m[0x540+i]}))});
 }
 return {held,left,births,sounds,rows};
}

const results=[];
for(const held of [41,81])for(const pending of [false,true]){
 const c=run(held,false,pending);results.push({pending,...c});
 assert.ok(!c.births.some(b=>b.t===held+2),'Fresh press blocked while any charged projectile active');
 assert.equal(c.rows[held+1].pose,15,'Blocked press must not refresh');
 if(pending)assert.equal(c.births[2].t,held+23,'Pending intermediate release waits for charged projectile to clear');
 else assert.equal(c.births.length,2);
 console.log(held,pending,c.births,c.sounds);
}
fs.writeFileSync(new URL('./.work/charge-repress.json',import.meta.url),JSON.stringify(results,null,2));
console.log('Original-ROM charged exclusivity: fresh press blocked by either charged projectile; forced pending mid waits until after its cleanup.');
