// Review-only replacement: preserve the original running game's noise channel.
// Unlike extract-landing.mjs, this never replays writes into a fresh APU.
import {NES,Controller} from 'jsnes';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url);
const rom=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary');
const state=JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json',import.meta.url)));
function run(stem){
 let frame=-30,active=false,ended=false;
 const samples=[],states=[],events=[];
 const n=new NES({sampleRate:48000,onAudioSample:(l,r)=>{
   if(stem){if(frame>=41&&frame<=50)samples.push(active&&!ended?(l+r)/2:0);}
   else if(frame>=16&&frame<=75)samples.push((l+r)/2);
 }});
 n.loadROM(rom);n.fromJSON(structuredClone(state));
 for(let b=0;b<8;b++)n.buttonUp(1,b);
 n.papu.setPanning([128,128,128,128,128]);
 if(stem){
   for(const side of ['L','R'])for(const ch of ['Square1','Square2','Triangle','DMC'])n.papu['stereoPos'+side+ch]=0;
 }
 const write=n.papu.writeReg.bind(n.papu);
 n.papu.writeReg=(address,value)=>{
   if(address>=0x400c&&address<=0x400f&&frame>=41){
     const slot=n.cpu.REG_X;events.push({frame,address,value,slot});
     if(slot===0&&!ended)active=true;
     if(slot===40&&active)ended=true;
   }
   return write(address,value);
 };
 for(;frame<0;frame++)n.frame();
 n.buttonDown(1,Controller.BUTTON_A);
 for(frame=1;frame<=75;frame++){
   n.frame();
   states.push(n.papu.noise.toJSON());
 }
 return{samples,states,events};
}
const full=run(false),stem=run(true);
assert.equal(state.papu.sampleRate,48000,'Write WAV headers at the restored APU sample rate');
assert.deepEqual(stem.states,full.states,'Noise state must be identical to full original playback');
assert.deepEqual(stem.events,full.events,'APU register writes must be identical');
assert.equal(stem.events.find(e=>e.slot===0).frame,42);
assert.equal(stem.events.find(e=>e.slot===40&&e.frame>=42).frame,49);
function wav(samples,path,fade){
 const out=Buffer.alloc(44+samples.length*2);
 out.write('RIFF');out.writeUInt32LE(out.length-8,4);out.write('WAVEfmt ',8);
 out.writeUInt32LE(16,16);out.writeUInt16LE(1,20);out.writeUInt16LE(1,22);
 out.writeUInt32LE(48000,24);out.writeUInt32LE(96000,28);out.writeUInt16LE(2,32);out.writeUInt16LE(16,34);
 out.write('data',36);out.writeUInt32LE(samples.length*2,40);
 for(let i=0;i<samples.length;i++){
   const gain=fade?Math.min(1,i/32,(samples.length-1-i)/64):1;
   out.writeInt16LE(Math.round(Math.max(-1,Math.min(1,samples[i]*gain))*32767),44+i*2);
 }
 fs.writeFileSync(path,out);
}
const dir=new URL('Assets/Audio/Mega Man/MM5/Movement/Review/',root);
fs.mkdirSync(dir,{recursive:true});
wav(stem.samples,new URL('snd_mm5_megaman_land_review.wav',dir),true);
wav(full.samples,new URL('mm5_original_mix_landing_reference.wav',dir),false);
fs.writeFileSync(new URL('./.work/landing-review.json',import.meta.url),JSON.stringify({events:stem.events,fullSamples:full.samples.length,stemSamples:stem.samples.length,noiseStatesEqual:true},null,2));
console.log('Review generated; original noise state and register-stream equality passed. No fresh APU or gain boost.');
