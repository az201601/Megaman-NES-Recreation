// Separate original-game charge / release reviews. Never mute/isolate APU channels.
// Releases use an explicitly controlled meter preset just before actual B release,
// avoiding the preceding charge effect while running the original emission/driver routines.
import {NES,Controller} from 'jsnes';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url);
const dir=new URL('Assets/Audio/Mega Man/MM5/Buster/Charging/Review/Separate/',root);
fs.mkdirSync(dir,{recursive:true});
for(const kind of ['charge','mid','full']){
 let frame=0,capture=false,warmPeak=0;
 const samples=[],requests=[],writes=[],rows=[];
 const n=new NES({sampleRate:48000,onAudioSample:(l,r)=>{if(capture)samples.push([l,r]);}});
 n.loadROM(fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary'));
 n.fromJSON(JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json',import.meta.url))));
 for(let b=0;b<8;b++)n.buttonUp(1,b);
 const q=n.cpu.mem[0xda];assert.equal(n.cpu.mem[0xdc+q],0x88);
 n.cpu.mem[0xdc+q]=0xf0;n.cpu.mem[0xda]=(q+1)&7;
 const callback=n.opts.onAudioSample;
 n.opts.onAudioSample=(l,r)=>{if(!capture&&frame>=100)warmPeak=Math.max(warmPeak,Math.abs(l),Math.abs(r));callback(l,r);};
 for(frame=0;frame<150;frame++)n.frame();assert.equal(warmPeak,0);
 const emulate=n.cpu.emulate.bind(n.cpu);
 n.cpu.emulate=()=>{if(n.cpu.REG_PC===0xec5c)requests.push({frame,sound:n.cpu.REG_ACC,captured:capture});return emulate();};
 const write=n.papu.writeReg.bind(n.papu);
 n.papu.writeReg=(address,value)=>{writes.push({frame,address,value});return write(address,value);};
 const total=kind==='charge'?260:120;
 for(frame=0;frame<total;frame++){
  if(frame===10)n.buttonDown(1,Controller.BUTTON_B);
  if(frame===35)capture=true; // Ordinary press shot has already finished; verify below.
  if(kind!=='charge'&&frame===40){
   // Only29 increments held so far: charge sound22 has NOT been requested.
   // Original press projectile has cleared. Preset meter, release naturally.
   assert.equal(n.cpu.mem[0x38],29);
   assert.ok([1,2,3].every(i=>n.cpu.mem[0x300+i]===0));
   n.cpu.mem[0x38]=kind==='mid'?40:80;
   n.buttonUp(1,Controller.BUTTON_B);
  }
  const start=samples.length;n.frame();
  rows.push({frame,start,end:samples.length,charge:n.cpu.mem[0x38],state:n.cpu.mem[0x30],pose:n.cpu.mem[0x33],
   active:[1,2,3].filter(i=>n.cpu.mem[0x300+i]===0x70).map(i=>({slot:i,animation:n.cpu.mem[0x558+i]}))});
 }
 assert.ok(rows.every(r=>r.state===0));
 const expected=kind==='charge'?34:kind==='mid'?32:33;
 assert.deepEqual(requests.filter(r=>r.captured).map(r=>r.sound),[expected]);
 assert.deepEqual(requests.filter(r=>!r.captured).map(r=>r.sound),[26]);
 const quietEnd=rows[39].end;
 assert.ok(samples.slice(0,quietEnd).every(s=>s[0]===0&&s[1]===0),'Initial ordinary-shot tail must be absent');
 if(kind!=='charge'){
  assert.equal(rows[40].pose,16);assert.equal(rows[40].charge,0);
  assert.equal(rows[40].active.length,1);assert.equal(rows[40].active[0].animation,kind==='mid'?0xa8:0xa9);
 }
 const out=Buffer.alloc(44+samples.length*4);
 out.write('RIFF');out.writeUInt32LE(out.length-8,4);out.write('WAVEfmt ',8);out.writeUInt32LE(16,16);
 out.writeUInt16LE(1,20);out.writeUInt16LE(2,22);out.writeUInt32LE(48000,24);out.writeUInt32LE(192000,28);
 out.writeUInt16LE(4,32);out.writeUInt16LE(16,34);out.write('data',36);out.writeUInt32LE(samples.length*4,40);
 for(let i=0;i<samples.length;i++)for(let c=0;c<2;c++)out.writeInt16LE(Math.round(Math.max(-1,Math.min(1,samples[i][c]))*32767),44+i*4+c*2);
 fs.writeFileSync(new URL(`./.work/charge-effect-${kind}-raw.wav`,import.meta.url),out);
 let first=-1,last=-1;
 for(let i=0;i<samples.length;i++)if(out.readInt16LE(44+i*4)||out.readInt16LE(46+i*4)){if(first<0)first=i;last=i;}
 assert.ok(first>240);
 if(kind!=='charge')assert.ok(last<samples.length-1000);
 const start=first-240,end=kind==='charge'?samples.length:last+241;
 const clip=Buffer.concat([out.subarray(0,44),out.subarray(44+start*4,44+end*4)]);
 clip.writeUInt32LE(clip.length-8,4);clip.writeUInt32LE(clip.length-44,40);
 assert.deepEqual(clip.subarray(44),out.subarray(44+start*4,44+end*4));
 const filename=kind==='charge'?'mm5-charge-only-preview.wav':`mm5-${kind}-release-only-review.wav`;
 fs.writeFileSync(new URL(filename,dir),clip);
 const info={kind,filename,controlledMeter:kind!=='charge',warmPeak,rate:48000,start,end,samples:end-start,seconds:(end-start)/48000,
  note:kind==='charge'?'Natural held input, ongoing-effect excerpt; NOT a seamless loop/import-ready sound.':'Controlled charge-meter preset; actual original B-release emission, full-APU effect, silence-only trim.',requests,rows,writes};
 fs.writeFileSync(new URL(`./.work/charge-effect-${kind}.json`,import.meta.url),JSON.stringify(info,null,2));
 console.log(kind,info.samples,info.seconds,requests);
}
