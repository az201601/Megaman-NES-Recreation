// Full original APU cue extraction. Native sound IDs independently verified in collision/AI trials.
import fs from'node:fs';import assert from'node:assert/strict';import{createHash}from'node:crypto';import{NES,Controller as C}from'jsnes';
const root=new URL('../../',import.meta.url),out=new URL('Assets/Audio/Mega Man/MM1/Blaster/',root),work=new URL('./.work/',import.meta.url);
const rom=fs.readFileSync(new URL('Mega Man (USA).nes',root));
const hash=b=>createHash('sha256').update(b).digest('hex');
function wav(pcm){const b=Buffer.alloc(44+pcm.length*2);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(2,22);b.writeUInt32LE(48000,24);b.writeUInt32LE(192000,28);b.writeUInt16LE(4,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(pcm.length*2,40);pcm.forEach((v,i)=>b.writeInt16LE(v,44+i*2));return b;}
fs.mkdirSync(new URL('Review/',out),{recursive:true});const reports=[];
for(const[name,id]of[['snd_mm1_blaster_fire',0x15],['snd_mm1_blaster_blocked',0x1d]]){
 let pending=[0xff,0xfe],capture=false,frame=0,warmPeak=0;const samples=[],commands=[];
 const n=new NES({sampleRate:48000,onAudioSample:(l,r)=>{if(capture)samples.push(l,r);else if(frame>=100)warmPeak=Math.max(warmPeak,Math.abs(l),Math.abs(r));}});
 n.loadROM(rom.toString('binary'));n.papu.setPanning([128,128,128,128,128]);let booting=true;
 const emulate=n.cpu.emulate.bind(n.cpu);n.cpu.emulate=()=>{
  if(n.cpu.REG_PC===0xd553&&pending.length>0){assert.equal(n.cpu.mem[0x45],0);n.cpu.mem[0x580]=pending.shift();n.cpu.mem[0x45]=1;}
  if(n.cpu.REG_PC===0x9002){if(booting&&n.cpu.REG_ACC<=0x32)n.cpu.REG_ACC=0xff;commands.push({frame,id:n.cpu.REG_ACC,capture});}return emulate();
 };
 const tick=k=>{for(let i=0;i<k;i++)n.frame();};tick(180);n.buttonDown(1,C.BUTTON_START);tick(1);n.buttonUp(1,C.BUTTON_START);tick(333);n.buttonDown(1,C.BUTTON_START);tick(1);n.buttonUp(1,C.BUTTON_START);tick(899);booting=false;warmPeak=0;
 for(frame=0;frame<150;frame++)n.frame();assert.equal(pending.length,0);assert.equal(warmPeak,0,'Music must be PCM silent');
 capture=true;pending=[id];for(frame=0;frame<150;frame++)n.frame();
 assert.deepEqual(commands.filter(v=>v.capture).map(v=>v.id),[id]);
 const pcm=samples.map(v=>Math.round(Math.max(-1,Math.min(1,v))*32767));
 let first=0,last=pcm.length-2;while(first<pcm.length&&pcm[first]===0&&pcm[first+1]===0)first+=2;
 const baseline=pcm.slice(-2);
 while(last>=0&&pcm[last]===baseline[0]&&pcm[last+1]===baseline[1])last-=2;
 assert.ok(first<last&&last<pcm.length-96000,'Require audible cue followed by at least1s stable tail');
 const end=Math.min(pcm.length,last+2+960),trimmed=pcm.slice(first,end),boosted=trimmed.map(v=>v*2);
 const tailRamp=baseline.some(v=>v!==0);
 // JSNES integer DC blocker can settle to +1023 instead of zero. Keep the
 // original capture slice as source; ramp ONLY its already-constant final10ms
 // in the listening/gameplay copy to avoid an artificial file-end click.
 if(tailRamp)for(let i=0;i<480;i++)for(let c=0;c<2;c++){
   const k=boosted.length-960+i*2+c;boosted[k]=Math.round(boosted[k]*(479-i)/479);
 }
 assert.ok(boosted.every(v=>v>=-32768&&v<=32767));
 const raw=wav(trimmed),balanced=wav(boosted);
 fs.writeFileSync(new URL(name+'.wav',out),raw);
 fs.writeFileSync(new URL('Review/'+name+'_balanced.wav',out),balanced);
 // Raw full capture is scratch, not an import deliverable.
 fs.writeFileSync(new URL(name+'-complete.wav',work),wav(pcm));
 reports.push({name,id,method:'Controlled original sound queue at native dispatchD554. Fresh native boot with pre-capture scene sound requests replaced by FF before driver init (no channel muting); this avoids a held-note/DC residual from stopping already-playing music. Original FF/FE queue startup,150warmupupdates, one original cue,150captureupdates. Full unmuted APU, all5channels centered (matching MM1 stage capture),48kHzPCM16. No synthesis,channelisolation,normalization,pitch/timechanges. Raw is exact PCM slice; trim zero leading samples and constant settled tail, retain10ms. Review gain2x matches accepted MM5/MM6 gameplay volume adjustment. If the JSNES integer DC filter settles at nonzero constant, ONLY the already-constant final10ms of review audio is ramped tozero to prevent an export-end click; the raw trimmed file remains an exact capture slice. User audition pending.',commands,warmPeak,firstFrame:first/2,lastAudibleFrame:last/2,endFrame:end/2,frames:trimmed.length/2,seconds:trimmed.length/96000,tailBaseline:baseline,reviewTailRampFrames:tailRamp?480:0,rawPeak:Math.max(...trimmed.map(Math.abs))/32768,balancedPeak:Math.max(...boosted.map(Math.abs))/32768,rawSha256:hash(raw),balancedSha256:hash(balanced)});
}
fs.writeFileSync(new URL('recovery.json',out),JSON.stringify({romSha256:hash(rom),sourceEvidence:'Assets/Enemies/MM1/Blaster/Reference/native-blaster-assets.json',sounds:reports},null,2)+'\n');
console.log(reports.map(r=>({name:r.name,id:r.id,seconds:r.seconds,rawPeak:r.rawPeak,balancedPeak:r.balancedPeak})));
