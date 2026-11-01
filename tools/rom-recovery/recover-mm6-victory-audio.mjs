// Original MM6 driver, full APU. Controlled isolated auditions, NOT runtime imports.
import fs from'node:fs';import assert from'node:assert/strict';import{NES}from'jsnes';import{createHash}from'node:crypto';
const root=new URL('../../',import.meta.url),base=new URL('Assets/Bosses/MM1/Cut Man/Victory/',root),work=new URL('./.work/mm6-victory/',import.meta.url);
const rom=fs.readFileSync(new URL('Mega Man 6 (USA).nes',root)),hash=b=>createHash('sha256').update(b).digest('hex'),snap=JSON.parse(fs.readFileSync(new URL('./.work/mm6-hit/stage.json',import.meta.url)));
assert.equal(hash(rom),'86e069792addf21322355c245a0b155ba74e123b4a3eb9cd347175444569d122');
fs.mkdirSync(new URL('Audio/Review/',base),{recursive:true});
function wav(p){const b=Buffer.alloc(44+p.length);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(48000,24);b.writeUInt32LE(96000,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(p.length,40);p.copy(b,44);return b;}
function take(id,frames){
 let capture=false,frame=-1;const samples=[],baseline=[],dispatch=[],driverDispatch=[];
 const n=new NES({sampleRate:48000,onAudioSample:(l,r)=>{(capture?samples:baseline).push((l+r)/2)}});n.loadROM(rom.toString('binary'));n.fromJSON(structuredClone(snap));assert.equal(n.papu.sampleRate,48000);
 const m=n.cpu.mem;for(let b=0;b<8;b++)n.buttonUp(1,b);
 assert.equal(m[0xdc],255);m[0xdc]=0xf0;for(let f=0;f<150;f++)n.frame();
 // Native35 warmup settles the known JSNES post-F0 DC residual, no subtraction.
 m[0xdc]=0x35;baseline.length=0;for(let f=0;f<180;f++)n.frame();assert.ok(baseline.slice(-48000).every(v=>v===0),'one second exact silence prerequisite; peak='+Math.max(...baseline.slice(-48000).map(Math.abs))+' mailbox='+m[0xdc]);
 const em=n.cpu.emulate.bind(n.cpu);n.cpu.emulate=()=>{if(n.cpu.REG_PC===0xc8b1)dispatch.push({frame,command:n.cpu.REG_ACC});if(n.cpu.REG_PC===0x8002&&n.mmap.load(0x8003)===rom[16+0x34*8192+3])driverDispatch.push({frame,command:n.cpu.REG_ACC});return em();};
 capture=true;m[0xdc]=id;for(frame=0;frame<frames;frame++)n.frame();
 assert.deepEqual(dispatch.map(r=>r.command),[id]);assert.deepEqual(driverDispatch.map(r=>r.command),[id]);return{samples,dispatch,driverDispatch};
}
const files=[];
for(const [id,name,frames,gain]of [[0x13,'mm6-stage-clear-review',900,2.125],[0x10,'mm6-weapon-get-music-review',1200,2.125],[0x61,'mm6-weapon-acquisition-flash-review',300,2],[0x27,'mm6-weapon-screen-text-tick-review',240,2]]){
 const t=take(id,frames);let first=t.samples.findIndex(v=>v!==0),last=t.samples.length-1;while(last>=0&&t.samples[last]===0)last--;
 assert.ok(first>=0);const endsNaturally=last<t.samples.length-48000;
 const end=endsNaturally?Math.min(t.samples.length,last+481):t.samples.length;
 const p=Buffer.alloc(end*2);let peak=0;for(let i=0;i<end;i++){const v=t.samples[i]*gain;peak=Math.max(peak,Math.abs(v));assert.ok(Math.abs(v)<1,'No clipping');p.writeInt16LE(Math.round(v*32767),i*2);}
 const data=wav(p),file='Audio/Review/'+name+'.wav';fs.writeFileSync(new URL(file,base),data);
 files.push({id:'0x'+id.toString(16),file,framesCaptured:frames,endsNaturally,firstSample:first,lastNonzero:last,seconds:p.length/96000,gain,peak,sha256:hash(data),dispatch:t.dispatch,driverDispatch:t.driverDispatch});
}
const trace=JSON.parse(fs.readFileSync(new URL('weapon-get-trace.json',work)));
const report={romSha256:hash(rom),status:'Auditions only, not approved or installed',method:'Original full-APU48kmono16bit MM6 native DC mailbox from naturally booted playable-stage snapshot (same neutral fixture used by accepted MM6 combat audio). F0 stop then uncaptured native35 warmup; final1second exact silence checked. Only requested command dispatch allowed/asserted. No ROM patches/channel mutes/filtering/normalization/stitched cues. Command lead retained, exact-zero-only trailing trim with10ms padding when complete. Accepted SFX2x/music2.125 gain; no clipping.',files,weaponGetNativeTrace:{method:trace.method,frames:trace.frames,events:trace.events.filter(e=>e.kind==='audio-dispatch'||e.pc!=='81dc')},limitations:['Controlled isolated export, not live music+effects mixture or GMS playback.', 'Finished weapon-get task fixture does not produce sound here; isolated exports deliberately use the original playable-stage snapshot instead.','13 source identifies stage-clear cue; weapon-get10 and effects61/27 independently dispatched by original weapon-get fixture.','If endsNaturally=false, file is a finite audition window, not a verified runtime loop or complete track.','No approval for additional effects/music implied.']};
fs.writeFileSync(new URL('Reference/mm6-victory-audio.json',base),JSON.stringify(report,null,2)+'\n');console.log(files);
