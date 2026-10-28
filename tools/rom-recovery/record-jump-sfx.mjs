// Stop music through the game's command queue, then record direct full APU output.
import {NES,Controller} from 'jsnes';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url);
let capture=false,frame=0;
const samples=[],requests=[],writes=[];
const n=new NES({sampleRate:48000,onAudioSample:(l,r)=>{if(capture)samples.push([l,r]);}});
n.loadROM(fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary'));
n.fromJSON(JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json',import.meta.url))));
for(let b=0;b<8;b++)n.buttonUp(1,b);
const rate=n.papu.sampleRate;
// $F0 is the stop command used by this ROM before its death sound.
// Queue it in the same ring used by $EC5D; do not patch APU register writes.
const slot=n.cpu.mem[0xda];
assert.equal(n.cpu.mem[0xdc+slot],0x88,'Expected free sound-command queue slot');
n.cpu.mem[0xdc+slot]=0xf0;
n.cpu.mem[0xda]=(slot+1)&7;
let warmPeak=0;
const originalCallback=n.opts.onAudioSample;
n.opts.onAudioSample=(l,r)=>{if(!capture&&frame>=100)warmPeak=Math.max(warmPeak,Math.abs(l),Math.abs(r));originalCallback(l,r);};
for(frame=0;frame<150;frame++)n.frame();
console.log('Post-stop tail peak',warmPeak);
assert.ok(warmPeak<0.002,'Music did not become silent; do not publish this take');
const emulate=n.cpu.emulate.bind(n.cpu);
n.cpu.emulate=()=>{if(n.cpu.REG_PC===0xec5c)requests.push({frame,sound:n.cpu.REG_ACC});return emulate();};
const write=n.papu.writeReg.bind(n.papu);
n.papu.writeReg=(address,value)=>{writes.push({frame,address,value,slot:n.cpu.REG_X});return write(address,value);};
capture=true;
const rows=[];
for(frame=0;frame<100;frame++){
 if(frame===10)n.buttonDown(1,Controller.BUTTON_A);
 if(frame===65)n.buttonUp(1,Controller.BUTTON_A);
 n.frame();
 rows.push({frame,y:n.cpu.mem[0x378]+n.cpu.mem[0x360]/256,state:n.cpu.mem[0x30]});
}
assert.equal(requests.filter(r=>r.sound===27).length,1);
assert.ok(rows.some(r=>r.y<140));
const out=Buffer.alloc(44+samples.length*4);
out.write('RIFF');out.writeUInt32LE(out.length-8,4);out.write('WAVEfmt ',8);
out.writeUInt32LE(16,16);out.writeUInt16LE(1,20);out.writeUInt16LE(2,22);
out.writeUInt32LE(rate,24);out.writeUInt32LE(rate*4,28);out.writeUInt16LE(4,32);out.writeUInt16LE(16,34);
out.write('data',36);out.writeUInt32LE(samples.length*4,40);
for(let i=0;i<samples.length;i++)for(let c=0;c<2;c++)out.writeInt16LE(Math.round(Math.max(-1,Math.min(1,samples[i][c]))*32767),44+i*4+c*2);
fs.writeFileSync('/home/user/mm5-jump-game-audio-no-music.wav',out);
fs.writeFileSync(new URL('./.work/jump-direct-recording.json',import.meta.url),JSON.stringify({rate,requests,warmPeak,rows,writes},null,2));
console.log('Recorded direct full-game output with music stopped:',rate,'Hz;',samples.length,'samples;',requests);
