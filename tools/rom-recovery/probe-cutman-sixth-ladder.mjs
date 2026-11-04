// Controlled outgoing-ladder entry, then original Up-only code. Inherits first probe lead-in.
import fs from 'node:fs';
import {NES, Controller as C} from 'jsnes';
const root=new URL('../../',import.meta.url), work=new URL('./.work/cutman-fifth-scroll/',import.meta.url),out=new URL('./.work/cutman-sixth-scroll/',import.meta.url);fs.mkdirSync(out,{recursive:true});
const n=new NES();n.loadROM(fs.readFileSync(new URL('Mega Man (USA).nes',root),'binary'));n.fromJSON(JSON.parse(fs.readFileSync(new URL('after-continuation.json',work))));for(let b=0;b<8;b++)n.buttonUp(1,b);n.buttonDown(1,C.BUTTON_UP);
const m=n.cpu.mem;
// Controlled placement on actual outgoing top-right ladder; original scroll/input code unchanged.
m[0x480]=216;m[0x460]=10;m[0x4a0]=0;m[0x600]=40;m[0x620]=0;m[0x660]=0;m[0x680]=0;m[0x400]=0;m[0x420]=0xc0;m[0x55]=100;
// Refresh original collision/ladder cache at relocated X with one neutral original frame.
n.buttonUp(1,C.BUTTON_UP);n.frame();n.buttonDown(1,C.BUTTON_UP);
const rows=[],events=[];let frame=0;const emulate=n.cpu.emulate.bind(n.cpu);n.cpu.emulate=()=>{if([0x9fda,0xa071,0xa0ca].includes(n.cpu.REG_PC))events.push({frame,pc:(n.cpu.REG_PC+1).toString(16),y:m[0x600],fraction:m[0x620],type:m[0x26]});return emulate();};
for(frame=1;frame<=184;frame++){n.frame();if(frame===48)fs.writeFileSync(new URL('before-up-trigger.json',out),JSON.stringify(n.toJSON()));rows.push({frame,page:m[0x460],x:m[0x480],playerY:m[0x600]+m[0x620]/256,pose:m[0x400],flags:m[0x420],cameraX:m[0x1a]+256*m[0x1b],cameraY:m[0x1e],scrollRows:m[0x33],begin:m[0x27],end:m[0x28],order:m[0x29],type:m[0x26]});}
fs.writeFileSync(new URL('up-continuation.json',out),JSON.stringify({source:'Original MM1 USA Controlled one-time placement on page10 outgoing ladder X216,Y40, velocity/fraction reset and protection100; Up-only original code thereafter. Inherits prior controlled lead-ins (including earlier900Right traverse). One neutral cache-refresh frame after placement, then original Up-only.',events,rows},null,2));fs.writeFileSync(new URL('after-continuation.json',out),JSON.stringify(n.toJSON()));console.log(events);console.log(rows.filter((r,i)=>!i||r.order!==rows[i-1].order||r.type!==rows[i-1].type));
