// Controlled original opening-routine execution, NOT a natural MM5 gate approach.
// At the normal camera-update JSR entry, replace its destination with the native
// opening subroutine. Existing caller stack is retained; no ROM instructions edited.
import fs from'node:fs';import assert from'node:assert/strict';import crypto from'node:crypto';import{NES}from'jsnes';
const root=new URL('../../',import.meta.url),rom=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root)),n=new NES();
n.loadROM(rom.toString('binary'));n.fromJSON(JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json',import.meta.url))));
for(let b=0;b<8;b++)n.buttonUp(1,b);
const span=(cpu,hex)=>{let offset=16+30*8192+cpu-0xc000;assert.equal(rom.subarray(offset,offset+hex.length/2).toString('hex'),hex);return{cpu:cpu.toString(16),offset,hex};};
const spans=[span(0xcb8d,'b968a948100320fcd0'),span(0xd11c,'a9038511a925205dec'),span(0xd133,'2022ffe695e69da59d2903d0ef')];
let frame=0,injected=false,returned=false;const events=[],rows=[],emulate=n.cpu.emulate.bind(n.cpu);
n.cpu.emulate=()=>{
 if(!injected&&n.cpu.REG_PC===0xc9dc){
  events.push({frame,event:'controlled-camera-call-redirection',stage:n.cpu.mem[0x26]});
  n.cpu.REG_PC=0xd0fb;injected=true;
 }
 if(injected&&!returned){
  const labels={0xd0fb:'opening-entry',0xd121:'queue-opening-sound',0xd127:'build-PPU-edit',0xd132:'yield-one-frame',0xd169:'opening-return'};
  if(labels[n.cpu.REG_PC])events.push({frame,event:labels[n.cpu.REG_PC],a:n.cpu.REG_ACC,counter:n.cpu.mem[0x9d]});
  if(n.cpu.REG_PC===0xd169)returned=true;
 }
 return emulate();
};
for(frame=1;frame<=40;frame++){n.frame();rows.push({frame,counter:n.cpu.mem[0x9d],returned});if(returned)break;}
assert.ok(returned);const edits=events.filter(e=>e.event==='build-PPU-edit').map(e=>e.frame),start=events.find(e=>e.event==='opening-entry').frame,finish=events.find(e=>e.event==='opening-return').frame,sound=events.find(e=>e.event==='queue-opening-sound');
assert.deepEqual(edits,[start,start+4,start+8]);assert.equal(finish-start,12);assert.equal(sound.frame,start);assert.equal(sound.a,0x25);
const result={method:'Controlled original-USA routine execution: at normal camera-update entry C9DD, redirect PC once to original D0FC using existing caller stack. Stage6 snapshot, no extra input, no ROM edits. This verifies opening-routine timing, NOT natural gate contact/approach or full opening+scroll+closing sequence.',disassembly:{repository:'https://github.com/refreshing-lemonade/megaman5-disassembly',commit:'03e59a6855c1aca85d063bd2973005dc3ffd02ef',file:'bank1B_1F.asm'},romSha256:crypto.createHash('sha256').update(rom).digest('hex'),spans,events,opening:{startFrame:start,soundFrame:sound.frame,editFrames:edits,returnFrame:finish,totalWaitFrames:finish-start,edits:3,intervalFrames:4,nominalSecondsAt60Hz:(finish-start)/60},interpretation:'First PPU edit is built and command25 queued on the entry frame; no initial32-frame hold inside the opener. Caller CB8D/CB91/CB93 directly invokes opener when its gate flag is set, without a frame-wait call between flag test and opener. PPU presentation occurs on an NMI; exact visible contact-to-first-edit still requires a natural/controlled gate-trigger PPU trace, not this redirected-call probe.'};
fs.writeFileSync(new URL('Assets/Cut Man/Stage/First Gate Research/native-mm5-opening-timing.json',root),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
