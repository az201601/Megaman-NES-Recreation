// Original second entrance: inherited controlled lead-ins, corridor renderer traverse,
// one ground placement/cache refresh, then original Right only; no gate ROM patches.
import fs from'node:fs';import{NES,Controller as C}from'jsnes';
const root=new URL('../../',import.meta.url),out=new URL('./.work/cutman-second-gate/',import.meta.url);fs.mkdirSync(out,{recursive:true});
const n=new NES();n.loadROM(fs.readFileSync(new URL('Mega Man (USA).nes',root),'binary'));n.fromJSON(JSON.parse(fs.readFileSync(new URL('./.work/cutman-first-gate/frame-184.json',import.meta.url))));const m=n.cpu.mem;
for(let b=0;b<8;b++)n.buttonUp(1,b);n.buttonDown(1,C.BUTTON_RIGHT);n.buttonDown(1,C.BUTTON_A);
for(let frame=1;frame<=466;frame++){m[0x600]=148;m[0x620]=0;m[0x660]=0;m[0x680]=0;m[0x55]=100;n.frame();if(frame===1)n.buttonUp(1,C.BUTTON_A);}
for(let b=0;b<8;b++)n.buttonUp(1,b);
m[0x480]=216;m[0x460]=22;m[0x4a0]=0;m[0x600]=148;m[0x620]=0;m[0x660]=0;m[0x680]=0;m[0x400]=0;m[0x420]=0xc0;m[0x55]=100;n.frame();fs.writeFileSync(new URL('before-approach.json',out),JSON.stringify(n.toJSON()));
n.buttonDown(1,C.BUTTON_RIGHT);let frame=0;const events=[],rows=[],emulate=n.cpu.emulate.bind(n.cpu);n.cpu.emulate=()=>{if([0xd065,0xd073,0xd091,0xd09a,0x9fda,0xc476].includes(n.cpu.REG_PC))events.push({frame,pc:(n.cpu.REG_PC+1).toString(16),a:n.cpu.REG_ACC});return emulate();};
function tiles(page,x,w){return Array.from({length:8},(_,y)=>Array.from({length:w},(_,dx)=>n.ppu.nameTable[n.ppu.ntable1[page%2]].tile[(12+y)*32+x+dx]));}
let lastType=0;for(frame=1;frame<=420;frame++){const before=n.toJSON();n.frame();const camera=m[0x1b]*256+m[0x1a];rows.push({frame,logicalX:camera+((m[0x480]-m[0x1a]+256)%256)+m[0x4a0]/256,y:m[0x600]+m[0x620]/256,pose:m[0x400],life:m[0x6a0],cameraX:camera,type:m[0x26],begin:m[0x27],end:m[0x28],order:m[0x29],playerHP:m[0x6a],bossHP:m[0x6b],gateRight:tiles(22,30,2),gateLeft:tiles(23,0,2)});
if(!lastType&&m[0x26])fs.writeFileSync(new URL('before-trigger.json',out),JSON.stringify(before));lastType=m[0x26];
if(frame%4===0||frame<=24)fs.writeFileSync(new URL(`frame-${frame}.json`,out),JSON.stringify(n.toJSON()));}
fs.writeFileSync(new URL('native-second-gate.json',out),JSON.stringify({source:'Original USA ROM, inherited controlled ladder/first-gate lead-ins,466frame Right/A-once corridor traverse pinnedY148/velocity0/protection100, one page22X216/Y148 reset/protection100+neutral cache refresh, then unmodified Right-only420frames. Not natural whole-level gameplay; native boss behaviour observed only as research, not implemented.',events,rows},null,2));
console.log(events);console.log(rows.filter((r,i)=>!i||r.type!==rows[i-1].type||r.order!==rows[i-1].order||JSON.stringify(r.gateRight)!==JSON.stringify(rows[i-1].gateRight)||JSON.stringify(r.gateLeft)!==JSON.stringify(rows[i-1].gateLeft)).map(({gateRight,gateLeft,...r})=>r));
