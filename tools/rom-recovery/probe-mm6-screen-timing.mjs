// Linked original-ROM post-centre animation -> teleport -> award -> demo trace.
// Start from naturally booted playable snapshot; disclose one native coroutine-entry/bank/stage setup.
import fs from'node:fs';import assert from'node:assert/strict';import{NES}from'jsnes';import{PNG}from'pngjs';import{createHash}from'node:crypto';import{mesenRgbFromJsnes}from'./mesen-palette.mjs';
const root=new URL('../../',import.meta.url),work=new URL('./.work/mm6-victory/',import.meta.url);fs.mkdirSync(work,{recursive:true});
const rom=fs.readFileSync(new URL('Mega Man 6 (USA).nes',root));assert.equal(createHash('sha256').update(rom).digest('hex'),'86e069792addf21322355c245a0b155ba74e123b4a3eb9cd347175444569d122');
let pixels;const n=new NES({emulateSound:false,onFrame:p=>pixels=p.slice()});n.loadROM(rom.toString('binary'));n.fromJSON(JSON.parse(fs.readFileSync(new URL('./.work/mm6-hit/stage.json',import.meta.url))));
for(let b=0;b<8;b++)n.buttonUp(1,b);
const m=n.cpu.mem;
// Controlled actor0 handoff used by F9B4 after centring/landing. Stage geometry
// remains the naturally booted snapshot, not a reconstructed boss room.
m[0x6a5]=0;m[0x51]=0;m[0x486]=128;m[0x4cb]=180;
m[0x42a]=0x45;m[0x413]=0x91;m[0x5b1]=0;m[0x5c8]=0;
const screenRows=[];let awardStart=-1;let frame=0,finished=false;const events=[],rows=[],em=n.cpu.emulate.bind(n.cpu);
n.cpu.emulate=()=>{
 const pc=(n.cpu.REG_PC+1)&65535;
 if(m[0x4b]===0x3b&&[0xbd76,0xbd86,0xbd93,0xbd9d,0xbdab,0xbdc9,0xbdf0,0xbe06,0xbe0b,0xbe14,0xbe5b,0xbe66,0xbe6f,0xbe74,0xbe9c,0xbea1,0xbf3b].includes(pc))events.push({frame,kind:'screen-timing',pc:pc.toString(16),remaining:m[0x5b9],offset:m[0x49]});
 if(pc===0xc8b2)events.push({frame,kind:'audio-dispatch',command:n.cpu.REG_ACC});
 if([0x9145,0x9167,0x91a7,0x91fe,0x9237].includes(pc)&&n.cpu.mem[0x4a]===0x38){events.push({frame,kind:'linked-victory-code',pc:pc.toString(16)});}
 if([0xdfb9,0xdff3].includes(pc))events.push({frame,kind:'teleport',pc:pc.toString(16)});
 if(n.cpu.mem[0x4b]===0x3b&&[0xbd1b,0xbe42,0xbea9].includes(pc)){events.push({frame,kind:'award',pc:pc.toString(16)});if(pc===0xbd1b)awardStart=frame;if(pc===0xbea9)finished=true;}
 return em();
};
function save(name){const p=new PNG({width:256,height:240});for(let i=0;i<pixels.length;i++){const rgb=mesenRgbFromJsnes(pixels[i]);p.data.set([rgb&255,rgb>>8&255,rgb>>16&255,255],i*4)}fs.writeFileSync(new URL(name,work),PNG.sync.write(p));}
for(frame=0;frame<1800&&!finished;frame++){
 try{n.frame();}catch(e){console.log({frame,events:events.slice(-15),task:m[0x33],bank:m[0x4a]});throw e;}rows.push({frame,x:m[0x486],y:m[0x4cb],pose:m[0x3ce],counter:m[0x624],bank:m[0x4a],audio:m[0xdc]});
 if(awardStart>=0){const age=frame-awardStart;screenRows.push({age,x:m[0x48e],y:m[0x4d3],scroll:m[0x678],palette:Array.from(m.slice(0x360,0x380)),remaining:m[0x5b9],bigActive:m[0x3a8]});if(age%2===0)save(`screen-linked-${age}.png`);}
 if(false){save(`linked-victory-${frame}.png`);fs.writeFileSync(new URL(`linked-victory-${frame}.json`,work),JSON.stringify(n.toJSON()));}
}
assert.ok(finished,'Native award/demo must return to its real caller');
const index=(kind,pc)=>events.findIndex(e=>e.kind===kind&&e.pc===pc);
assert.ok(index('linked-victory-code','9145')<index('teleport','dfb9'));
assert.ok(index('teleport','dfb9')<index('teleport','dff3'));
assert.ok(index('teleport','dff3')<index('award','bd1b'));
assert.ok(index('award','bd1b')<index('award','be42'));
assert.ok(index('award','be42')<index('award','bea9'));
assert.ok(events.filter(e=>e.kind==='audio-dispatch'&&e.command===0x23).length>=4,'Native demo fires weapon');
fs.writeFileSync(new URL('linked-victory-finished.json',work),JSON.stringify(n.toJSON()));
const result={method:'Controlled actor0 handoff042A/0413=9145 used by F9B4; stage0,06A5=0,x128,y180,initial velocity0. Natural stage geometry, not boss-room fixture. Original ROM/code; no sound injection or subsequent scene redirects. Runs continuously through real teleport, native main caller, award and demo return. Does not include final hit/clear/centring.',finished,frames:frame,events,rows};
fs.writeFileSync(new URL('linked-victory-trace.json',work),JSON.stringify(result,null,2)+'\n');console.log({finished,frames:frame,events});

fs.writeFileSync(new URL('screen-linked-timing.json',work),JSON.stringify({awardStart,events:events.filter(e=>e.frame>=awardStart).map(e=>({...e,age:e.frame-awardStart})),rows:screenRows},null,2));
