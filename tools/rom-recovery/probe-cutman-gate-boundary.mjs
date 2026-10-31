// Native post-gate left return, no additional placement or RAM patches.
import fs from'node:fs';import assert from'node:assert/strict';import{NES,Controller as C}from'jsnes';
const root=new URL('../../',import.meta.url),w=new URL('./.work/cutman-first-gate/',import.meta.url),n=new NES();n.loadROM(fs.readFileSync(new URL('Mega Man (USA).nes',root),'binary'));n.fromJSON(JSON.parse(fs.readFileSync(new URL('frame-184.json',w))));for(let b=0;b<8;b++)n.buttonUp(1,b);n.buttonDown(1,C.BUTTON_LEFT);const rows=[];
for(let frame=1;frame<=180;frame++){n.frame();const m=n.cpu.mem;rows.push({frame,x:m[0x460]*256+m[0x480]+m[0x4a0]/256,y:m[0x600]+m[0x620]/256,cameraX:m[0x1b]*256+m[0x1a],order:m[0x29],begin:m[0x27],end:m[0x28]});}
assert.ok(rows.every(r=>r.order===12&&r.begin===20&&r.end===22&&r.cameraX===5120));assert.ok(rows.slice(30).every(r=>Math.floor(r.x)===5144));
fs.writeFileSync(new URL('native-boundary.json',w),JSON.stringify({source:'Original post-gate frame184, fresh Left180frames, no further RAM patches. Native left-side kind1 feature blocks return; no new visible closing shutter established.',rows},null,2));console.log(rows[0],rows.at(-1));
