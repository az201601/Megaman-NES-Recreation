// Render only the landing SFX's noise-register stream into a separate APU.
// In this ROM sound-driver slot X=0 is the observed landing SFX; music noise uses X=40.
import {NES,Controller} from 'jsnes';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url);
const rom=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary');
let frame=-30;
const samples=[],events=[];
const renderer=new NES({sampleRate:44100,onAudioSample:(l,r)=>{
  if(frame>=41&&frame<=50)samples.push((l+r)/2);
}});
renderer.loadROM(rom);
renderer.papu.setPanning([128,128,128,128,128]);
renderer.papu.writeReg(0x4015,8);
const n=new NES();n.loadROM(rom);
n.fromJSON(JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json',import.meta.url))));
const write=n.papu.writeReg.bind(n.papu);
n.papu.writeReg=(address,value)=>{
  if(frame>=41&&frame<=49&&n.cpu.REG_X===0&&address>=0x4000&&address<=0x400f){
    events.push({frame,address,value});
    assert.ok(address>=0x400c,'Unexpected non-noise landing SFX channel');
    renderer.papu.writeReg(address,value);
  }
  return write(address,value);
};
const clock=n.papu.clockFrameCounter.bind(n.papu);
n.papu.clockFrameCounter=(cycles,advanced=0)=>{
  renderer.papu.clockFrameCounter(cycles);
  return clock(cycles,advanced);
};
for(;frame<0;frame++)n.frame();
n.buttonDown(1,Controller.BUTTON_A);
for(frame=1;frame<=50;frame++)n.frame();
assert.ok(events.some(e=>e.frame===43&&e.address===0x400c&&e.value===0x3f));
assert.ok(events.some(e=>e.frame===49&&e.address===0x400c&&e.value===0x30));
const wav=Buffer.alloc(44+samples.length*2);
wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);
wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);
wav.writeUInt32LE(44100,24);wav.writeUInt32LE(88200,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);
wav.write('data',36);wav.writeUInt32LE(samples.length*2,40);
let peak=0;
for(let i=0;i<samples.length;i++){
  // Fixed gain and short end fade; keep the observed request-to-audibility delay.
  const v=samples[i]*2.5*Math.min(1,(samples.length-1-i)/64);
  peak=Math.max(peak,Math.abs(v));
  wav.writeInt16LE(Math.round(Math.max(-1,Math.min(1,v))*32767),44+2*i);
}
assert.ok(peak>0.01&&peak<1);
const dir=new URL('Assets/Audio/Mega Man/MM5/Movement/',root);
fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(new URL('snd_mm5_megaman_land.wav',dir),wav);
fs.writeFileSync(new URL('./.work/landing-audio-events.json',import.meta.url),JSON.stringify({events,samples:samples.length,peak},null,2));
console.log('Exported isolated landing-noise SFX:',samples.length,'samples, peak',peak);
