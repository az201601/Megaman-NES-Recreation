// Review only: scene-observed weapon-award effect65; preserves approved clear13.
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
for(const [id,name,frames,gain]of [[0x65,'mm6-weapon-acquisition-effect-review',600,2]]){
 const t=take(id,frames);let first=t.samples.findIndex(v=>v!==0),last=t.samples.length-1;while(last>=0&&t.samples[last]===0)last--;
 assert.ok(first>=0);const endsNaturally=last<t.samples.length-48000;
 assert.ok(endsNaturally,'Acquisition effect must finish with at least one second silence');
 const end=endsNaturally?Math.min(t.samples.length,last+481):t.samples.length;
 const p=Buffer.alloc(end*2);let peak=0;for(let i=0;i<end;i++){const v=t.samples[i]*gain;peak=Math.max(peak,Math.abs(v));assert.ok(Math.abs(v)<1,'No clipping');p.writeInt16LE(Math.round(v*32767),i*2);}
 const data=wav(p),file='Audio/Review/'+name+'.wav';fs.writeFileSync(new URL(file,base),data);
 files.push({id:'0x'+id.toString(16),file,framesCaptured:frames,endsNaturally,firstSample:first,lastNonzero:last,seconds:p.length/96000,gain,peak,sha256:hash(data),dispatch:t.dispatch,driverDispatch:t.driverDispatch});
}
fs.writeFileSync(new URL('Reference/mm6-weapon-acquisition-effect.json',base),JSON.stringify({method:'Full native APU export from playable snapshot, requested65 after silence/warmup. Scene identity separately verified by native BD1B probe and YOU GET B.ATTACK screenshot. Effect65 dispatched at native animation frame97 (BD9D), before award text at195. Listening approval pending; not integrated.',files},null,2)+'\n');console.log(files);
