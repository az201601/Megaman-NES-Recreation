// End-to-end original-ROM final projectile hit -> clear -> centre -> acquisition -> teleport -> award/demo.
// Disclosed checkpoint warp and one-hit/position setup BEFORE first projectile; no post-hit game RAM patches.
// Start from naturally booted playable snapshot; disclose one native coroutine-entry/bank/stage setup.
import fs from'node:fs';import assert from'node:assert/strict';import{NES}from'jsnes';import{PNG}from'pngjs';import{createHash}from'node:crypto';import{mesenRgbFromJsnes}from'./mesen-palette.mjs';
const root=new URL('../../',import.meta.url),work=new URL('./.work/mm6-victory/',import.meta.url);fs.mkdirSync(work,{recursive:true});
const rom=fs.readFileSync(new URL('Mega Man 6 (USA).nes',root));assert.equal(createHash('sha256').update(rom).digest('hex'),'86e069792addf21322355c245a0b155ba74e123b4a3eb9cd347175444569d122');
let pixels;const n=new NES({emulateSound:false,onFrame:p=>pixels=p.slice()});n.loadROM(rom.toString('binary'));n.fromJSON(JSON.parse(fs.readFileSync(new URL('./.work/mm6-hit/stage.json',import.meta.url))));
for(let b=0;b<8;b++)n.buttonUp(1,b);
const m=n.cpu.mem,airborne=!process.argv.includes('--grounded'),scenario=airborne?'airborne':'grounded';
// Controlled checkpoint warp; native restart loads room/actors/graphics.
m[0x51]=5;m[0x684]=0x1f;m[0x685]=0;m[0x686]=0;m[0x6a5]=0;
m[0x21]=8;m[0x29]=0x4c;m[0x2d]=0xcd;m[0x34]=0x3e;m[0x38]=0x3f;
let frame=0,finished=false,lethal=false,selectFrame=-1;const events=[],rows=[],em=n.cpu.emulate.bind(n.cpu);
const write=n.cpu.write.bind(n.cpu);n.cpu.write=(addr,value)=>{if(addr===0x3ed||addr===0x3a8){events.push({frame,kind:'boss-write',address:addr.toString(16),value,previous:m[addr],x:m[0x486],y:m[0x4cb],damage:m[0],pending:m[0x574],pc:((n.cpu.REG_PC+1)&65535).toString(16),bank:m[0x4a]});if(frame>360&&addr===0x3ed&&value>=128)lethal=true;}return write(addr,value);};
n.cpu.emulate=()=>{
 const pc=(n.cpu.REG_PC+1)&65535;
 if([0xef99,0xefa8,0xf95a,0xf964,0xf97e,0xf999,0xf9c6,0xf9f5,0xf9b4].includes(pc)){events.push({frame,kind:'boss-clear',pc:pc.toString(16),slot:n.cpu.REG_X,x:m[0x486],y:m[0x4cb],hp:m[0x3ed]});if(pc===0xefa8)lethal=true;}
 if(pc===0xc8b2)events.push({frame,kind:'audio-dispatch',command:n.cpu.REG_ACC});
 if([0x9145,0x9167,0x91a7,0x91fe,0x9237].includes(pc)&&n.cpu.mem[0x4a]===0x38){events.push({frame,kind:'whole-victory-code',pc:pc.toString(16)});}
 if([0xdfb9,0xdff3].includes(pc))events.push({frame,kind:'teleport',pc:pc.toString(16)});
 if(n.cpu.mem[0x4b]===0x3b&&[0xbd1b,0xbe42,0xbea9].includes(pc)){events.push({frame,kind:'award',pc:pc.toString(16)});}
 if(lethal&&pc===0xf05e){events.push({frame,kind:'stage-select',pc:'f05e'});selectFrame=frame;}
 return em();
};
function save(name){const p=new PNG({width:256,height:240});for(let i=0;i<pixels.length;i++){const rgb=mesenRgbFromJsnes(pixels[i]);p.data.set([rgb&255,rgb>>8&255,rgb>>16&255,255],i*4)}fs.writeFileSync(new URL(name,work),PNG.sync.write(p));}
for(frame=0;frame<4000&&!finished;frame++){
 if(frame===360){m[0x3ed]=0;m[0x3e5]=27;m[0x486]=80;} // one controlled low-HP fixture before any shot
 if(airborne&&frame===480&&!lethal)n.buttonDown(1,0);if(frame===500)n.buttonUp(1,0);
 if(frame>=365&&!lethal){if(frame%18===5)n.buttonDown(1,1);if(frame%18===6)n.buttonUp(1,1);}
 if(lethal)for(let b=0;b<8;b++)n.buttonUp(1,b);
 if(frame===2500)n.buttonDown(1,3); // Start dismisses any native post-clear password prompt
 if(selectFrame>=0&&frame>=selectFrame+180)finished=true;
 try{n.frame();}catch(e){console.log({frame,events:events.slice(-15),task:m[0x33],bank:m[0x4a]});throw e;}rows.push({frame,x:m[0x486],y:m[0x4cb],pose:m[0x3ce],counter:m[0x624],bank:m[0x4a],audio:m[0xdc]});
 if([400,498,780,1021,1076,1130,1300,1358,1397,1600,2000,2400,2600,2800,3000,3500].includes(frame)){save(`whole-victory-${scenario}-${frame}.png`);fs.writeFileSync(new URL(`whole-victory-${frame}.json`,work),JSON.stringify(n.toJSON()));}
}
assert.ok(finished,'Whole sequence must reach native demo return');
const hit=events.find(e=>e.kind==='boss-write'&&e.frame>360&&e.address==='3ed'&&e.previous===0&&e.value===255);
assert.ok(hit&&hit.damage===1&&hit.pc==='9a18'&&hit.bank===0x31,'Native projectile damage subtract is lethal');
assert.ok(hit.x<128,'Off-centre last hit');if(airborne)assert.ok(hit.y<180,'Airborne last hit');else assert.equal(hit.y,180);
const find=(kind,pc)=>events.find(e=>e.frame>=hit.frame&&e.kind===kind&&e.pc===pc);
const ordered=[hit,find('boss-clear','f964'),find('boss-clear','f97e'),find('boss-clear','f9c6'),find('boss-clear','f9b4'),find('whole-victory-code','91a7'),find('teleport','dfb9'),find('teleport','dff3'),find('award','bd1b'),find('award','be42'),find('award','bea9')];
assert.ok(ordered.every(Boolean));for(let i=1;i<ordered.length;i++)assert.ok(ordered[i].frame>ordered[i-1].frame);
assert.equal(find('boss-clear','f9b4').x,128);
assert.ok(selectFrame>find('award','bea9').frame,'Native stage selection follows demo and password prompt');
assert.ok(events.filter(e=>e.frame>find('award','be42').frame&&e.kind==='audio-dispatch'&&e.command===0x23).length>=4);
const result={romSha256:createHash('sha256').update(rom).digest('hex'),scenario,method:'Native checkpoint restartCD4C stage5/room1F(Tomahawk true boss). At frame360 only: bossHP=0(native one-hit health), playerHP=27, playerX=80. Native B inputs starting365; optional A480..500; release all controls upon lethal native HP write, then one Start at2500 to dismiss native password screen. No game RAM, code, scene or audio patches after lethal hit. Natural room graphics/collision/actors and all subsequent original-ROM transitions.',limitations:['Controlled checkpoint/one-hit/placement fixture, not an unassisted full-stage playthrough.','MM6 Tomahawk normal-stage trace; not Cut Man/MM5 runtime acceptance.','EmulateSound false: dispatch frames, not measured acoustic onset.'],finished,frames:frame,hit,ordered,events};
fs.writeFileSync(new URL(`whole-victory-${scenario}-trace.json`,work),JSON.stringify(result,null,2)+'\n');
console.log({scenario,finished,hit,ordered});
