// Recapture from the actual MM1 Blaster AI; no isolated sound-command injection.
import fs from'node:fs';import assert from'node:assert/strict';import{createHash}from'node:crypto';import{NES,Controller as C}from'jsnes';
const root=new URL('../../',import.meta.url),out=new URL('Assets/Audio/Mega Man/MM1/Blaster/Review V2/',root);fs.mkdirSync(out,{recursive:true});
const rom=fs.readFileSync(new URL('Mega Man (USA).nes',root));let f=-1,phase='boot',capture=false,stop=false;const samples=[],requests=[],dispatch=[],suppressed=[];
const n=new NES({sampleRate:48000,onAudioSample:(l,r)=>{if(capture)samples.push(l,r);}});n.loadROM(rom.toString('binary'));
// Match the already accepted MM5/MM6 capture panning, not the rejected centered take.
const em=n.cpu.emulate.bind(n.cpu);n.cpu.emulate=()=>{
 if(n.cpu.REG_PC===0x9002&&n.mmap.load(0x9003)===0xc9&&n.mmap.load(0x9004)===0xfc){if(n.cpu.REG_ACC===5){suppressed.push({phase,f,id:5});n.cpu.REG_ACC=0xff;}dispatch.push({phase,f,id:n.cpu.REG_ACC,sample:samples.length/2});}
 if(n.cpu.REG_PC===0xc476){const id=n.cpu.REG_ACC,source=n.cpu.mem[0x2f];if(phase==='encounter'&&id===0x15&&source===16){if(!capture)capture=true;requests.push({f,id,source,sample:samples.length/2});}}
 return em();
};
const tick=k=>{for(let i=0;i<k;i++)n.frame();};tick(180);n.buttonDown(1,C.BUTTON_START);tick(1);n.buttonUp(1,C.BUTTON_START);tick(333);n.buttonDown(1,C.BUTTON_START);tick(1);n.buttonUp(1,C.BUTTON_START);tick(899);
phase='encounter';n.buttonDown(1,C.BUTTON_RIGHT);
for(f=1;f<=700;f++){const m=n.cpu.mem;m[0x600]=36;m[0x620]=m[0x660]=m[0x680]=0;m[0x55]=100;if(!stop&&m[0x480]+256*m[0x460]>=760){stop=true;n.buttonUp(1,C.BUTTON_RIGHT);}n.frame();}
assert.equal(requests.length,4);assert.ok(suppressed.length>=1);assert.deepEqual(requests.map(v=>v.f),[532,564,596,628]);
const pcm=samples.map(v=>Math.round(Math.max(-1,Math.min(1,v))*32767));
function wav(data){const b=Buffer.alloc(44+data.length*2);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(2,22);b.writeUInt32LE(48000,24);b.writeUInt32LE(192000,28);b.writeUInt16LE(4,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(data.length*2,40);data.forEach((v,i)=>b.writeInt16LE(v,44+i*2));return b;}
// Keep the complete original first cue, including any quiet lead-in before driver receipt.
const second=requests[1].sample*2,firstTake=pcm.slice(0,second);
const tail=firstTake.slice(-2);let last=firstTake.length-2;while(last>=0&&firstTake[last]===tail[0]&&firstTake[last+1]===tail[1])last-=2;
const end=Math.min(firstTake.length,last+2+960);const clip=firstTake.slice(0,end);assert.ok(last<firstTake.length-960,'First cue must settle before nextshot');
const mixed=clip.map(v=>v*2);assert.ok(mixed.every(v=>v>=-32768&&v<=32767));
assert.deepEqual(tail,[0,0],'Do not fade/filter/resynthesize revisedfire');
const hash=b=>createHash('sha256').update(b).digest('hex');const files=[];
for(const[name,data]of[['mm1-blaster-fire-live-balanced.wav',mixed],['mm1-blaster-four-shot-burst-live-balanced.wav',pcm.map(v=>v*2)]]){
 assert.ok(data.every(v=>v>=-32768&&v<=32767));const b=wav(data);fs.writeFileSync(new URL(name,out),b);files.push({name,seconds:data.length/96000,sha256:hash(b),peak:data.reduce((p,v)=>Math.max(p,Math.abs(v)),0)/32768});}
fs.writeFileSync(new URL('mm1-blaster-fire-live-raw.wav',out),wav(clip));
const report={method:'Fresh native MM1 boot with only Cut Man music request05 changed toFF before driverinit; original select/intro/arrival audio allowed to complete. Original stage AI creates real bullets and issues15. Controlled playerY36/verticalspeed0/protection100, Right toX760 then released. Default JSNES stereo as accepted MM5/MM6 SFX captures; no channels isolated. First real cue and actual four-shot sequence, exact2xPCM gain; no fade/filter/channel muting/command-injected cue. Not natural unassisted traversal or hardware certification.',romSha256:hash(rom),suppressed,requests,dispatch:dispatch.filter(v=>v.phase==='encounter'),tail,firstClipFrames:clip.length/2,files};fs.writeFileSync(new URL('recovery.json',out),JSON.stringify(report,null,2)+'\n');console.log(report);
