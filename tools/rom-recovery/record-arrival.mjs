// Natural original MM5 arrival sound, full APU; original F0 music-stop command only.
import {NES} from 'jsnes';import fs from 'node:fs';import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url),work=new URL('./.work/',import.meta.url);
const snapshots=JSON.parse(fs.readFileSync(new URL('mm5-arrival-snapshots.json',work)));
let t=557;const samples=[],requests=[],peaks=[];
const n=new NES({sampleRate:48000,onAudioSample:(l,r)=>{if(t>=665)samples.push([l,r]);if(t>=650&&t<679)peaks.push(Math.max(Math.abs(l),Math.abs(r)));}});
n.loadROM(fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary'));n.fromJSON(snapshots.find(s=>s.t===556).snapshot);
const m=n.cpu.mem,q=m[0xda];assert.equal(m[0xdc+q],0x88);m[0xdc+q]=0xf0;m[0xda]=(q+1)&7;
const emulate=n.cpu.emulate.bind(n.cpu);n.cpu.emulate=()=>{if(n.cpu.REG_PC===0xec5c)requests.push({t,command:n.cpu.REG_ACC});return emulate();};
for(;t<=760;t++)n.frame();
assert.ok(peaks.length>0);assert.equal(Math.max(...peaks),0,'No music tail before arrival request');assert.deepEqual(requests,[{t:679,command:45}]);
const pcm=Buffer.alloc(samples.length*4);let first=-1,last=-1;
for(let i=0;i<samples.length;i++)for(let c=0;c<2;c++){
 const v=Math.round(Math.max(-1,Math.min(1,samples[i][c]))*32767);pcm.writeInt16LE(v,i*4+c*2);
 if(v){if(first<0)first=i;last=i;}
}
assert.ok(first>240);assert.ok(last<samples.length-1000);
const start=first-240,end=last+241,clip=pcm.subarray(start*4,end*4),wav=Buffer.alloc(44+clip.length);
wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(2,22);wav.writeUInt32LE(48000,24);wav.writeUInt32LE(192000,28);wav.writeUInt16LE(4,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(clip.length,40);clip.copy(wav,44);
const dir=new URL('Assets/Audio/Mega Man/MM5/Arrival/Review/',root);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(new URL('mm5-arrival-review.wav',dir),wav);
fs.writeFileSync(new URL('mm5-arrival-audio.json',work),JSON.stringify({requests,warmPeak:Math.max(...peaks),first,last,start,end,frames:end-start,seconds:(end-start)/48000},null,2));
console.log('Arrival full-APU review',requests,(end-start)/48000,'seconds, silence-only5ms padding.');
