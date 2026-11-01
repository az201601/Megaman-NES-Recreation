// Controlled empty-queue native driver takes; no ROM edits/channel muting/synthetic audio.
import fs from'node:fs';import assert from'node:assert/strict';import{NES}from'jsnes';import{createHash}from'node:crypto';
const root=new URL('../../',import.meta.url),base=new URL('Assets/Bosses/MM1/Cut Man/Combat/',root),rom=fs.readFileSync(new URL('Mega Man (USA).nes',root)),snap=JSON.parse(fs.readFileSync(new URL('./.work/cutman-boss-entrance/before-approach.json',import.meta.url))),hash=b=>createHash('sha256').update(b).digest('hex');
function take(id,frames){let f=0,pending=null;const samples=[],bounds=[],dispatch=[],writes=[],pointers=[],commands=[],lifecycle=[];const n=new NES({sampleRate:48000,onAudioSample:(l,r)=>samples.push((l+r)/2)});n.loadROM(rom.toString('binary'));n.fromJSON(structuredClone(snap));assert.equal(n.papu.sampleRate,48000);n.papu.setPanning([128,128,128,128,128]);const m=n.cpu.mem;for(let b=0;b<8;b++)n.buttonUp(1,b);const em=n.cpu.emulate.bind(n.cpu);n.cpu.emulate=()=>{if(n.cpu.REG_PC+1===0xd554&&pending!==null&&m[0x45]===0){m[0x580]=pending;m[0x45]=1;pending=null}if(n.cpu.REG_PC+1===0x9003&&n.mmap.load(0x9003)===0xc9&&n.mmap.load(0x9004)===0xfc)dispatch.push({f,id:n.cpu.REG_ACC});if(f>=180&&n.cpu.REG_PC+1===0x96ac)commands.push({f,addr:m[0xf0]+256*m[0xf1],byte:n.mmap.load(m[0xf0]+256*m[0xf1]),loop:m[0xf3]});return em()};const wr=n.papu.writeReg.bind(n.papu);n.papu.writeReg=(a,v)=>{writes.push({f,a,v});return wr(a,v)};for(f=0;f<frames;f++){bounds.push(samples.length);if(f===0)pending=255;if(f===180)pending=id;for(let s=16;s<32;s++)m[0x6a0+s]=0;m[0x55]=100;n.frame();lifecycle.push({f,usage:m[0xe1],addr:m[0xf0]+256*m[0xf1],wait:m[0xf2],loop:m[0xf3]});pointers.push({f,p:Array.from({length:4},(_,i)=>m[0x500+i*31]+256*m[0x501+i*31])});}bounds.push(samples.length);assert.deepEqual(dispatch.filter(d=>d.f>=180),[{f:180,id}]);assert.ok(samples.slice(bounds[120],bounds[180]).every(v=>v===0));return{samples,bounds,dispatch,writes,pointers,commands,lifecycle};}
function pcm(samples,gain){const p=Buffer.alloc(samples.length*2);let peak=0;for(let i=0;i<samples.length;i++){const v=samples[i]*gain;peak=Math.max(peak,Math.abs(v));assert.ok(Math.abs(v)<1,'no clipping');p.writeInt16LE(Math.round(v*32767),i*2)}return{p,peak};}
function wav(p){const b=Buffer.alloc(44+p.length);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(48000,24);b.writeUInt32LE(96000,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(p.length,40);p.copy(b,44);return b;}

// Actual throw25, NOT rejected stand/appearance26. Research audition only.
for (const d of ['Audio/Review/','Reference/']) fs.mkdirSync(new URL(d,base),{recursive:true});
assert.equal(hash(rom),'58fb9ef0c14c2947332929b9330d56c38a78040fd388274c39efd84e8d5446c7');
const offset=16+7*16384+(0xdfb4&16383);
assert.equal(rom.subarray(offset,offset+5).toString('hex'),'a9252077c4');
const t=take(0x25,480), s=t.samples.slice(t.bounds[180]);
const life=t.lifecycle.filter(r=>r.f>=180);
const end=life.find((r,i)=>i&&life[i-1].usage!==0&&r.usage===0);
assert.ok(end,'Native throw cue must release naturally');
assert.ok(end.f<420,'At least60frames available after release');
assert.ok(t.samples.slice(t.bounds[end.f+30]).every(v=>v===0),'Final tail must reach exact silence');
const fullEnd=t.bounds[end.f+8]-t.bounds[180];
const full=pcm(s.slice(0,fullEnd),2);
const first=s.findIndex(v=>v!==0);let last=s.length-1;while(last>=0&&s[last]===0)last--;
assert.ok(first>=0&&last>=first);
const trimStart=Math.max(0,first-96),trimEnd=Math.min(fullEnd,last+1+480);
assert.ok(trimEnd>last,'No nonzero tail removed');
const preview=pcm(s.slice(trimStart,trimEnd),2);
assert.deepEqual(preview.p,full.p.subarray(trimStart*2,trimEnd*2));
const files=[];
for(const[name,data]of [['mm1-cutman-rolling-cutter-throw-review.wav',preview],['mm1-cutman-rolling-cutter-throw-full-tail.wav',full]]){
 const file='Audio/Review/'+name, bytes=wav(data.p);fs.writeFileSync(new URL(file,base),bytes);
 files.push({file,bytes:bytes.length,seconds:data.p.length/96000,peak:data.peak,sha256:hash(bytes)});
}
const report={romSha256:hash(rom),status:'Awaiting user listening approval; NOT installed',
 method:'Original USA initialized approach snapshot, native FF stop then wait60exact-silent frames. Empty D554 queue receives25 at180; original driver, allAPUchannels centred, no ROM edits/channel muting/synthesis/filtering/stretching.48kHz mono16bit, accepted2xSFX gain with no clipping. Full-tail take begins at command and ends8updates after natural driver release. Preview removes exact-zero silence only, retains2ms lead/10ms tail, asserted byte-identical subrange.',
 throwCall:{cpu:'DFB4',offset,hex:'a9252077c4'},dispatch:t.dispatch,driverEnd:end,firstNonzero:first,lastNonzero:last,trimStart,trimEnd,
 commands:t.commands,lifecycle:life.filter(r=>r.f<=end.f+8),files,
 limitations:['Controlled driver extraction, not live mix with boss music.','Native cue identity/duration are evidence, not user listening approval.','No runtime resource import or event/script audio changes.','Rejected26 remains removed.']};
fs.writeFileSync(new URL('Reference/rolling-cutter-throw-audio.json',base),JSON.stringify(report,null,2)+'\n');
console.log('PASS actual25 throw/native release/full tail/no clipping/exact-zero-only trim',files);
