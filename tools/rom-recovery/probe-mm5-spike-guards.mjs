// Original MM5 guard/death routines with disclosed controlled hazard classifications.
import fs from'node:fs';import assert from'node:assert/strict';import{createHash}from'node:crypto';import{NES,Controller as C}from'jsnes';
const root=new URL('../../',import.meta.url),out=new URL('Assets/Combat/MM5/Cut Man Spikes/Reference/',root),rom=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root));fs.mkdirSync(out,{recursive:true});const hash=b=>createHash('sha256').update(b).digest('hex');assert.equal(hash(rom),'32bd2b4ecd2129aa5337afe9171696ef35646d3fd597339aebba19221764521c');
const spans=[];for(const[bank,pc,len]of[[0x1c,0x8044,23],[0x1c,0x82a5,19],[0x1e,0xc737,18]]){const offset=16+bank*8192+(pc&8191);spans.push({bank,pc,offset,hex:rom.subarray(offset,offset+len).toString('hex')});}
assert.equal(spans[0].hex,'a536f00eadb805d009a530c906b00320a582a900853660');
assert.equal(spans[1].hex,'a5172940d0f9a536c9f0f004c6b0302c4c3283');
assert.equal(spans[2].hex,'e000d00ca536d008a542c9d090028536a5f1');
const make=()=>{const n=new NES({emulateSound:false});n.loadROM(rom.toString('binary'));return n;},boot=make();const tick=k=>{for(let i=0;i<k;i++)boot.frame()},press=b=>{boot.buttonDown(1,b);tick(1);boot.buttonUp(1,b)};tick(900);press(C.BUTTON_START);tick(300);press(C.BUTTON_START);tick(600);press(C.BUTTON_RIGHT);tick(3);press(C.BUTTON_START);tick(900);assert.equal(boot.cpu.mem[0x26],6);const snapshot=boot.toJSON(),trials=[];
for(const[mode,flash]of[['unprotected',0],['flash1',1],['flash2',2],['flash60',60],['hurt-guard',0]]){
 const n=make();n.fromJSON(structuredClone(snapshot));for(let b=0;b<8;b++)n.buttonUp(1,b);const m=n.cpu.mem;m[0x5b8]=flash;m[0xb0]=0x9c;let frame=0,queries=0;const guards=[],deaths=[],spawns=[],sounds=[],rows=[],em=n.cpu.emulate.bind(n.cpu);
 n.cpu.emulate=()=>{const pc=n.cpu.REG_PC+1;
 if(pc===0xc737&&n.cpu.REG_X===0){m[0x42]=0xf0;queries++;}
 if(pc===0x8044&&n.mmap.load(pc)===0xa5&&n.mmap.load(pc+1)===0x36){if(mode==='hurt-guard'&&frame<=3)m[0x30]=6;guards.push({frame,marker:m[0x36],flash:m[0x5b8],state:m[0x30],hp:m[0xb0]&31});}
 if(pc===0x8332&&n.mmap.load(pc)===0xa9&&n.mmap.load(pc+1)===0xf0)deaths.push({frame,flash:m[0x5b8],state:m[0x30]});
 if(pc===0x837f&&n.mmap.load(pc)===0x99&&n.mmap.load(pc+1)===0)spawns.push({frame,type:n.cpu.REG_ACC});
 if(pc===0xec5d)sounds.push({frame,id:n.cpu.REG_ACC});return em();};
 for(frame=1;frame<=70;frame++){m[0x378]=120;m[0x390]=m[0x360]=m[0x3d8]=m[0x3f0]=0;if(mode==='hurt-guard')m[0x30]=0;n.frame();rows.push({frame,state:m[0x30],flash:m[0x5b8],health:m[0xb0]&31});if(deaths.length)break;}
 assert.ok(queries>0);assert.equal(deaths.length,1);assert.equal(spawns.length,16);assert.ok(spawns.every(s=>s.type===3));assert.equal(sounds.filter(s=>s.id===0x1d).length,1);assert.equal(rows.at(-1).health,0);
 for(const g of guards){if(g.marker===0xf0&&(g.flash>0||g.state>=6))assert.ok(!deaths.some(d=>d.frame===g.frame));}
 assert.ok(guards.some(g=>g.marker===0xf0&&g.flash===0&&g.state<6&&deaths.some(d=>d.frame===g.frame)));
 if(mode==='hurt-guard'){assert.ok(guards.filter(g=>g.frame<=3).every(g=>g.state===6));assert.equal(deaths[0].frame,4);}
 trials.push({mode,initialFlash:flash,queries,guards,deaths,spawns,sounds,rows});console.log(mode,'death',deaths[0].frame,'protected guard samples',guards.filter(g=>g.flash>0||g.state>=6).length);
}
fs.writeFileSync(new URL('native-mm5-spike-guards.json',out),JSON.stringify({romSha256:hash(rom),method:'Original supplied USA/JSNES2.1.0 fresh Napalm boot. Every original player terrain query C737 class replaced withF0. Player Y120/high0/verticalspeed0 pinned eachframe to exclude pit; initialflash0/1/2/60, HP28. Original guard/marker/death/particle/audio code unpatched. Hurt-guard trial additionally sets state6 immediately at8044 for3guard samples, restores normalstate0 each frame; fourth sample released. This isolates the guard, NOT a natural recoil animation/spike traversal or collision-mask test. Flash decrements at original engine position; assertions use actual guard-time counter, not assumed initial-timer frame mapping.',spans,trials},null,2)+'\n');
