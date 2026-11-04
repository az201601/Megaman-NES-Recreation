// Actual press/charge/release SEQUENCES for review, not isolated import sounds:
// Charge review recording: stop music through the game's command queue, then record direct full APU output.
import {NES,Controller} from 'jsnes';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url);
for(const {kind,held,releaseSound} of [{kind:'mid',held:41,releaseSound:32},{kind:'full',held:81,releaseSound:33}]){
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
for(frame=0;frame<180;frame++){
 if(frame===10)n.buttonDown(1,Controller.BUTTON_B);
 if(frame===10+held)n.buttonUp(1,Controller.BUTTON_B);
 n.frame();
 rows.push({frame,y:n.cpu.mem[0x378]+n.cpu.mem[0x360]/256,state:n.cpu.mem[0x30]});
}
assert.equal(requests.filter(r=>r.sound===26).length,1);
assert.ok(rows.every(r=>r.state===0),'Standing shot recording changed player state');
assert.deepEqual(requests.map(r=>r.sound),[26,34,releaseSound],'Reject unrelated sound commands');
const out=Buffer.alloc(44+samples.length*4);
out.write('RIFF');out.writeUInt32LE(out.length-8,4);out.write('WAVEfmt ',8);
out.writeUInt32LE(16,16);out.writeUInt16LE(1,20);out.writeUInt16LE(2,22);
out.writeUInt32LE(rate,24);out.writeUInt32LE(rate*4,28);out.writeUInt16LE(4,32);out.writeUInt16LE(16,34);
out.write('data',36);out.writeUInt32LE(samples.length*4,40);
for(let i=0;i<samples.length;i++)for(let c=0;c<2;c++)out.writeInt16LE(Math.round(Math.max(-1,Math.min(1,samples[i][c]))*32767),44+i*4+c*2);
const dir=new URL('Assets/Audio/Mega Man/MM5/Buster/Charging/Review/',root);
fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(new URL(`./.work/charge-${kind}-full-take.wav`,import.meta.url),out);
// Trim only PCM-zero silence, retaining5ms silent padding at both ends.
let first=-1,last=-1;
for(let i=0;i<samples.length;i++){
 if(out.readInt16LE(44+i*4)!==0||out.readInt16LE(46+i*4)!==0){if(first<0)first=i;last=i;}
}
assert.ok(first>240&&last<samples.length-1000,'Capture needs longer silent margins');
const start=Math.max(0,first-240),end=Math.min(samples.length,last+241);
const trimmed=Buffer.concat([out.subarray(0,44),out.subarray(44+start*4,44+end*4)]);
trimmed.writeUInt32LE(trimmed.length-8,4);trimmed.writeUInt32LE((end-start)*4,40);
assert.deepEqual(trimmed.subarray(44),out.subarray(44+start*4,44+end*4));
fs.writeFileSync(new URL(`mm5-charge-${kind}-sequence-review.wav`,dir),trimmed);
console.log('Silence-only review trim:',{kind,start,end,frames:end-start,seconds:(end-start)/rate});
fs.writeFileSync(new URL(`./.work/charge-${kind}-direct-recording.json`,import.meta.url),JSON.stringify({rate,requests,warmPeak,rows,writes},null,2));
console.log('Recorded charge sequence',kind,'direct full-game output with music stopped:',rate,'Hz;',samples.length,'samples;',requests);

}
