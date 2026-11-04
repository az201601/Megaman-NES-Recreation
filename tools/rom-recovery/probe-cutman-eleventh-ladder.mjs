// Controlled right traverse/placement, then original Down-only outgoing connection.
import fs from 'node:fs';import {NES,Controller as C} from 'jsnes';
const root=new URL('../../',import.meta.url),work=new URL('./.work/cutman-tenth-scroll/',import.meta.url),out=new URL('./.work/cutman-eleventh-scroll/',import.meta.url);fs.mkdirSync(out,{recursive:true});
const n=new NES();n.loadROM(fs.readFileSync(new URL('Mega Man (USA).nes',root),'binary'));n.fromJSON(JSON.parse(fs.readFileSync(new URL('after-continuation.json',work))));const m=n.cpu.mem;
for(let b=0;b<8;b++)n.buttonUp(1,b);
m[0x480]=40;m[0x460]=17;m[0x4a0]=0;m[0x600]=222;m[0x620]=0;m[0x660]=0;m[0x680]=0;m[0x400]=0;m[0x420]=0xc0;m[0x55]=100;
n.frame();n.buttonDown(1,C.BUTTON_DOWN);
const rows=[],events=[];let frame=0;const emulate=n.cpu.emulate.bind(n.cpu);n.cpu.emulate=()=>{if([0x9fda,0xa071,0xa0ca].includes(n.cpu.REG_PC))events.push({frame,pc:(n.cpu.REG_PC+1).toString(16),y:m[0x600],fraction:m[0x620],type:m[0x26]});return emulate();};
let priorType=m[0x26];for(frame=1;frame<=184;frame++){const before=n.toJSON();n.frame();if(!priorType&&m[0x26])fs.writeFileSync(new URL('before-down-trigger.json',out),JSON.stringify(before));priorType=m[0x26];rows.push({frame,page:m[0x460],x:m[0x480],playerY:m[0x600]+m[0x620]/256,pose:m[0x400],flags:m[0x420],cameraX:m[0x1a]+256*m[0x1b],cameraY:m[0x1e],scrollRows:m[0x33],begin:m[0x27],end:m[0x28],order:m[0x29],type:m[0x26]});}
fs.writeFileSync(new URL('native-down.json',out),JSON.stringify({source:'Original USA controlled prior lead-ins; inherited right traversals; one placement page17 X40/Y222, fraction/velocity/pose reset/protection100, neutral cache refresh, then original Down-only. NOT natural whole-stage traversal.',events,rows},null,2));fs.writeFileSync(new URL('after-continuation.json',out),JSON.stringify(n.toJSON()));console.log(events);console.log(rows.filter((r,i)=>!i||r.order!==rows[i-1].order||r.type!==rows[i-1].type));
