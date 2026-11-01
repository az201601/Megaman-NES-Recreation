// Controlled original-ROM weapon-get entry, NOT a natural boss kill.
// Start from naturally booted playable snapshot; disclose one native coroutine-entry/bank/stage setup.
import fs from'node:fs';import assert from'node:assert/strict';import{NES}from'jsnes';import{PNG}from'pngjs';import{createHash}from'node:crypto';import{mesenRgbFromJsnes}from'./mesen-palette.mjs';
const root=new URL('../../',import.meta.url),work=new URL('./.work/mm6-victory/',import.meta.url);fs.mkdirSync(work,{recursive:true});
const rom=fs.readFileSync(new URL('Mega Man 6 (USA).nes',root));assert.equal(createHash('sha256').update(rom).digest('hex'),'86e069792addf21322355c245a0b155ba74e123b4a3eb9cd347175444569d122');
let pixels;const n=new NES({emulateSound:false,onFrame:p=>pixels=p.slice()});n.loadROM(rom.toString('binary'));n.fromJSON(JSON.parse(fs.readFileSync(new URL('./.work/mm6-hit/stage.json',import.meta.url))));
for(let b=0;b<8;b++)n.buttonUp(1,b);
const m=n.cpu.mem;
n.mmap.write(0x8000,6);n.mmap.write(0x8001,0x3c);n.mmap.write(0x8000,7);n.mmap.write(0x8001,0x3d);m[0x4a]=0x3c;m[0x4b]=0x3d;m[0x4c]=7;
m[0x51]=0; // Blizzard variant, fixture only; project will award Rolling Cutter.
assert.deepEqual(Array.from({length:5},(_,i)=>n.mmap.load(0x80c5+i)),[0xa9,1,0x20,0xa4,0xca]);
// Restart native coroutine0 through its scheduler, rather than redirecting the
// idle CPU with task33=FF (which would save continuation into the wrong slot).
m[0x21]=8;m[0x29]=0xc5;m[0x2d]=0x80;m[0x34]=0x3c;m[0x38]=0x3d;
let frame=0,finished=false;const events=[],rows=[],em=n.cpu.emulate.bind(n.cpu);
n.cpu.emulate=()=>{
 const pc=(n.cpu.REG_PC+1)&65535;
 if(pc===0xc8b2)events.push({frame,kind:'audio-dispatch',command:n.cpu.REG_ACC});
 if([0x80c5,0x815d,0x8164,0x8175,0x81dc,0x8256,0x8275].includes(pc)&&n.cpu.mem[0x4a]===0x3c){events.push({frame,kind:'weapon-get-code',pc:pc.toString(16)});if(pc===0x8275){finished=true;n.cpu.REG_PC=0xc5e5;}}
 return em();
};
function save(name){const p=new PNG({width:256,height:240});for(let i=0;i<pixels.length;i++){const rgb=mesenRgbFromJsnes(pixels[i]);p.data.set([rgb&255,rgb>>8&255,rgb>>16&255,255],i*4)}fs.writeFileSync(new URL(name,work),PNG.sync.write(p));}
for(frame=0;frame<1800&&!finished;frame++){
 try{n.frame();}catch(e){console.log({frame,events:events.slice(-15),task:m[0x33],bank:m[0x4a]});throw e;}rows.push({frame,x:m[0x486],y:m[0x4cb],pose:m[0x3ce],counter:m[0x624],bank:m[0x4a],audio:m[0xdc]});
 if([0,16,32,64,96,128,160,200,240,320,400,520,640,800,1000,1200,1500].includes(frame)){save(`weapon-get-${frame}.png`);fs.writeFileSync(new URL(`weapon-get-${frame}.json`,work),JSON.stringify(n.toJSON()));}
}
assert.ok(finished,'Native weapon-get routine must reach its own final RTS');
fs.writeFileSync(new URL('weapon-get-finished.json',work),JSON.stringify(n.toJSON()));
const result={method:'Naturally booted MM6 playable-stage snapshot. Release all buttons. One controlled entry: map original banks3C/3D and matching4A/4B/4C shadows, stage51=0(Blizzard), native task0 restart at80C5 via21/29/2D/34/38. Original code/ROM/CHR/palettes/rendering after setup; no audio injections. At final8275 return, end fixture coroutine through nativeC5E6 instead of returning into a nonexistent fixture caller. Not natural boss kill/whole victory.',finished,frames:frame,events,rows};
fs.writeFileSync(new URL('weapon-get-trace.json',work),JSON.stringify(result,null,2)+'\n');console.log({finished,frames:frame,events:events.filter(r=>r.kind==='audio-dispatch'||r.pc!=='81dc')});
