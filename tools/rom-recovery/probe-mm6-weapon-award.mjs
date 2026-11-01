// Controlled original-ROM weapon-award candidate; verify screenshots before identifying audio.
// Start from naturally booted playable snapshot; disclose one native coroutine-entry/bank/stage setup.
import fs from'node:fs';import assert from'node:assert/strict';import{NES}from'jsnes';import{PNG}from'pngjs';import{createHash}from'node:crypto';import{mesenRgbFromJsnes}from'./mesen-palette.mjs';
const root=new URL('../../',import.meta.url),work=new URL('./.work/mm6-victory/',import.meta.url);fs.mkdirSync(work,{recursive:true});
const rom=fs.readFileSync(new URL('Mega Man 6 (USA).nes',root));assert.equal(createHash('sha256').update(rom).digest('hex'),'86e069792addf21322355c245a0b155ba74e123b4a3eb9cd347175444569d122');
let pixels;const n=new NES({emulateSound:false,onFrame:p=>pixels=p.slice()});n.loadROM(rom.toString('binary'));n.fromJSON(JSON.parse(fs.readFileSync(new URL('./.work/mm6-hit/stage.json',import.meta.url))));
for(let b=0;b<8;b++)n.buttonUp(1,b);
const m=n.cpu.mem;
n.mmap.write(0x8000,6);n.mmap.write(0x8001,0x3a);n.mmap.write(0x8000,7);n.mmap.write(0x8001,0x3b);m[0x4a]=0x3a;m[0x4b]=0x3b;m[0x4c]=7;
m[0x6a5]=0;m[0x51]=0; // Blizzard award variant; controlled scene fixture, not a natural kill.
assert.deepEqual(Array.from({length:5},(_,i)=>n.mmap.load(0xbd1b+i)),[0xad,0xa5,0x06,0x30,0xfa]);
// Restart native coroutine0 through its scheduler, rather than redirecting the
// idle CPU with task33=FF (which would save continuation into the wrong slot).
m[0x21]=8;m[0x29]=0x1b;m[0x2d]=0xbd;m[0x34]=0x3a;m[0x38]=0x3b;
let frame=0,finished=false;const events=[],rows=[],em=n.cpu.emulate.bind(n.cpu);
n.cpu.emulate=()=>{
 const pc=(n.cpu.REG_PC+1)&65535;
 if(pc===0xc8b2)events.push({frame,kind:'audio-dispatch',command:n.cpu.REG_ACC});
 if([0xbd1b,0xbd33,0xbd9d,0xbdf0,0xbe42,0xbea9].includes(pc)&&n.cpu.mem[0x4b]===0x3b){events.push({frame,kind:'weapon-award-code',pc:pc.toString(16)});if(pc===0xbea9){finished=true;n.cpu.REG_PC=0xc5e5;}}
 return em();
};
function save(name){const p=new PNG({width:256,height:240});for(let i=0;i<pixels.length;i++){const rgb=mesenRgbFromJsnes(pixels[i]);p.data.set([rgb&255,rgb>>8&255,rgb>>16&255,255],i*4)}fs.writeFileSync(new URL(name,work),PNG.sync.write(p));}
for(frame=0;frame<1800&&!finished;frame++){
 try{n.frame();}catch(e){console.log({frame,events:events.slice(-15),task:m[0x33],bank:m[0x4a]});throw e;}rows.push({frame,x:m[0x486],y:m[0x4cb],pose:m[0x3ce],counter:m[0x624],bank:m[0x4a],audio:m[0xdc]});
 if([0,16,32,64,96,128,160,200,240,320,400,520,640,800,1000,1200,1500].includes(frame)){save(`weapon-award-${frame}.png`);fs.writeFileSync(new URL(`weapon-award-${frame}.json`,work),JSON.stringify(n.toJSON()));}
}
assert.ok(finished,'Native weapon-award routine must reach its own final RTS');
fs.writeFileSync(new URL('weapon-award-finished.json',work),JSON.stringify(n.toJSON()));
const result={method:'Controlled native coroutine0 entry at3B:BD1B, from natural playable snapshot; banks3A/3B, stage0, acquisition flag06A5=0. No patched ROM/code/audio injections. Final RTS ended via C5E6 because fixture has no caller. Not natural boss defeat.',finished,frames:frame,events,rows};
fs.writeFileSync(new URL('weapon-award-trace.json',work),JSON.stringify(result,null,2)+'\n');console.log({finished,frames:frame,events});
