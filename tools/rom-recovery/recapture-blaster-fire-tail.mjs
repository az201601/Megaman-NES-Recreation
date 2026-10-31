// Tail diagnostic: original music initializes normally, native FF stops it; real Blaster fires.
import fs from'node:fs';import assert from'node:assert/strict';import{createHash}from'node:crypto';import{NES,Controller as C}from'jsnes';
const root=new URL('../../',import.meta.url),out=new URL('Assets/Audio/Mega Man/MM1/Blaster/Tail Check/',root);fs.mkdirSync(out,{recursive:true});
const rom=fs.readFileSync(new URL('Mega Man (USA).nes',root));let f=-1,phase='boot',capture=false,stop=false;const samples=[],requests=[],dispatch=[],suppressed=[],ends=[];
const n=new NES({sampleRate:48000,onAudioSample:(l,r)=>{if(capture)samples.push(l,r);}});n.loadROM(rom.toString('binary'));
// Match the already accepted MM5/MM6 capture panning, not the rejected centered take.
let stopPending=false;const em=n.cpu.emulate.bind(n.cpu);n.cpu.emulate=()=>{
 if(n.cpu.REG_PC===0xd553&&stopPending){assert.equal(n.cpu.mem[0x45],0);n.cpu.mem[0x580]=0xff;n.cpu.mem[0x45]=1;stopPending=false;suppressed.push({phase,f,id:255});}
 if(n.cpu.REG_PC===0x9002&&n.mmap.load(0x9003)===0xc9&&n.mmap.load(0x9004)===0xfc){dispatch.push({phase,f,id:n.cpu.REG_ACC,sample:samples.length/2});}
 if(n.cpu.REG_PC===0x9661&&n.mmap.load(0x9662)===0xa5&&n.mmap.load(0x9663)===0xf0&&capture)ends.push({f,sample:samples.length/2,channel:n.cpu.mem[0xee],usage:n.cpu.mem[0xe1]});
 if(n.cpu.REG_PC===0xc476){const id=n.cpu.REG_ACC,source=n.cpu.mem[0x2f];if(phase==='encounter'&&id===0x15&&source===16){if(!capture)capture=true;requests.push({f,id,source,sample:samples.length/2});}}
 return em();
};
const tick=k=>{for(let i=0;i<k;i++)n.frame();};tick(180);n.buttonDown(1,C.BUTTON_START);tick(1);n.buttonUp(1,C.BUTTON_START);tick(333);n.buttonDown(1,C.BUTTON_START);tick(1);n.buttonUp(1,C.BUTTON_START);tick(899);
phase='encounter';n.buttonDown(1,C.BUTTON_RIGHT);
for(f=1;f<=700;f++){const m=n.cpu.mem;if(f===525)capture=true;if(f===300)stopPending=true;m[0x600]=36;m[0x620]=m[0x660]=m[0x680]=0;m[0x55]=100;if(!stop&&m[0x480]+256*m[0x460]>=760){stop=true;n.buttonUp(1,C.BUTTON_RIGHT);}n.frame();}
assert.equal(requests.length,4);assert.ok(suppressed.length>=1);assert.deepEqual(requests.map(v=>v.f),[532,564,596,628]);
const pcm=samples.map(v=>Math.round(Math.max(-1,Math.min(1,v))*32767));
function wav(data){const b=Buffer.alloc(44+data.length*2);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(2,22);b.writeUInt32LE(48000,24);b.writeUInt32LE(192000,28);b.writeUInt16LE(4,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(data.length*2,40);data.forEach((v,i)=>b.writeInt16LE(v,44+i*2));return b;}
// No PCM trimming in these previews. Keep50ms before the request and every
// captured sample after the finalshot until frame700, including its full quiettail.
const start=Math.max(0,requests[3].sample-2400)*2,fullTail=pcm.slice(start);
const firstStart=Math.max(0,requests[0].sample-2400)*2,firstEnd=requests[1].sample*2;
const tail=pcm.slice(-2);assert.deepEqual(tail,[0,0]);assert.ok(ends.length>=4);
const hash=b=>createHash('sha256').update(b).digest('hex');const files=[];
for(const[name,data]of[['mm1-blaster-last-shot-full-tail-balanced.wav',fullTail.map(v=>v*2)],['mm1-blaster-first-shot-untrimmed-balanced.wav',pcm.slice(firstStart,firstEnd).map(v=>v*2)],['mm1-blaster-full-burst-untrimmed-balanced.wav',pcm.map(v=>v*2)]]){
 assert.ok(data.every(v=>v>=-32768&&v<=32767));const b=wav(data);fs.writeFileSync(new URL(name,out),b);files.push({name,seconds:data.length/96000,sha256:hash(b),peak:data.reduce((p,v)=>Math.max(p,Math.abs(v)),0)/32768});}
const report={method:'Fresh native MM1 boot and normal music initialization/playback. At controlled approachframe300 originalFF is queued at nativeD554 tostopmusic,232updates before firstfire. No music request is replaced duringboot. Original stage AI creates real bullets and issues15. Controlled playerY36/verticalspeed0/protection100, Right toX760 then released. Default JSNES stereo as accepted MM5/MM6 SFX captures; no channels isolated. Firstshot through nextrequest and finalshot with50mspreroll/fulltail through frame700 (no zero trimming), plus completeburst; exact2xPCM gain; no fade/filter/channel muting/command-injected cue. Not natural unassisted traversal or hardware certification.',romSha256:hash(rom),suppressed,requests,dispatch:dispatch.filter(v=>v.phase==='encounter'),tail,ends,firstStartSample:firstStart/2,firstEndSample:firstEnd/2,lastStartSample:start/2,totalSamples:pcm.length/2,files};fs.writeFileSync(new URL('recovery.json',out),JSON.stringify(report,null,2)+'\n');console.log(report);
