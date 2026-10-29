// Original MM5 pause-open sound: actual Start input, full APU, music stopped via ROM queue.
import{NES,Controller}from'jsnes';import fs from'node:fs';import assert from'node:assert/strict';
const root=new URL('../../',import.meta.url),work=new URL('./.work/',import.meta.url),dir=new URL('Assets/Audio/Mega Man/MM5/Pause Menu/',root);fs.mkdirSync(dir,{recursive:true});
let capture=false,frame=0,warmPeak=0;const samples=[],requests=[];
const n=new NES({sampleRate:48000,onAudioSample:(l,r)=>{if(capture)samples.push([l,r]);else if(frame>=100)warmPeak=Math.max(warmPeak,Math.abs(l),Math.abs(r));}});
n.loadROM(fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary'));n.fromJSON(structuredClone(JSON.parse(fs.readFileSync(new URL('mm5-stage.json',work)))));for(let b=0;b<8;b++)n.buttonUp(1,b);
const q=n.cpu.mem[0xda];assert.equal(n.cpu.mem[0xdc+q],0x88);n.cpu.mem[0xdc+q]=0xf0;n.cpu.mem[0xda]=(q+1)&7;
for(frame=0;frame<150;frame++)n.frame();assert.equal(warmPeak,0,'No music tail');
const emulate=n.cpu.emulate.bind(n.cpu);n.cpu.emulate=()=>{if(n.cpu.REG_PC===0xec5c)requests.push({frame,command:n.cpu.REG_ACC});return emulate();};
capture=true;for(frame=0;frame<150;frame++){if(frame===10)n.buttonDown(1,Controller.BUTTON_START);if(frame===11)n.buttonUp(1,Controller.BUTTON_START);n.frame();}
assert.deepEqual(requests,[{frame:10,command:0x29}],'Only original menu-opening sound, no closing/navigation/gameplay effects');
const pcm=Buffer.alloc(samples.length*4);let first=-1,last=-1,peak=0;
for(let i=0;i<samples.length;i++)for(let c=0;c<2;c++){assert.ok(Math.abs(samples[i][c])<1,'Reject clipped audio');let v=Math.round(samples[i][c]*32767);pcm.writeInt16LE(v,i*4+c*2);peak=Math.max(peak,Math.abs(v));if(v){if(first<0)first=i;last=i;}}
assert.ok(first>240&&last<samples.length-1000,'Require silence before and after');const start=first-240,end=last+241,clip=pcm.subarray(start*4,end*4),wav=Buffer.alloc(44+clip.length);
wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(2,22);wav.writeUInt32LE(48000,24);wav.writeUInt32LE(192000,28);wav.writeUInt16LE(4,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(clip.length,40);clip.copy(wav,44);assert.deepEqual(wav.subarray(44),pcm.subarray(start*4,end*4));
fs.writeFileSync(new URL('snd_mm5_menu_open.wav',dir),wav);
fs.writeFileSync(new URL('menu-open-recovery.json',dir),JSON.stringify({source:'Supplied Mega Man5 USA ROM, actual fresh Start opens pause menu',renderer:'JSNES2.1.0 full APU, NOT a Mesen execution/capture',rate:48000,channels:2,bits:16,requests,musicStop:'Original F0 command via sound ring; warm tail verified zero',warmPeak,first,last,start,end,sampleFrames:end-start,seconds:(end-start)/48000,peakPCM:peak,processing:'PCM16 conversion; trim only PCM-zero silence, retain5ms silent margin each side. No normalization, fades, synthesis or isolated channels.',scope:'Menu-open effect only. No close/move/confirm sounds or GMS menu implementation.'},null,2));
console.log('PASS: natural Start -> original29 sound only; zero music tail; no clipping; silence-only5ms margins; exact PCM source segment.',{seconds:(end-start)/48000,peak});
