// Controlled native sound queue extraction, NOT a natural MM5 gate playthrough.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {NES} from 'jsnes';
const root = new URL('../../', import.meta.url);
const work = new URL('./.work/cutman-first-gate/', import.meta.url);
const out = new URL('Assets/Audio/Mega Man/MM5/Stage/Gate/', root);
fs.mkdirSync(out, {recursive:true});
const rom = fs.readFileSync(new URL('Mega Man 5 (USA).nes', root));
const spans = [
  [0xcb93, '20fcd0', 'Gate before automatic horizontal passage calls opening routine'],
  [0xd0fc, 'a900859da5260a0a0aaa', 'Opening routine entry'],
  [0xd11c, 'a9038511a925205dec', 'Three PPU edits and native sound command 25'],
  [0xd1b5, 'a925205dec', 'Paired shutter routine uses same command']
].map(([cpu, hex, purpose]) => {
  const offset=16+30*8192+cpu-0xc000;
  assert.equal(rom.subarray(offset,offset+hex.length/2).toString('hex'),hex);
  return {cpu:cpu.toString(16),bank:'1E',fileOffset:offset,hex,purpose};
});
let capture=false,frame=0,warmPeak=0;
const samples=[],writes=[],requests=[];
const n=new NES({sampleRate:48000,onAudioSample:(l,r)=>{
  if(capture)samples.push([l,r]);
  else if(frame>=100)warmPeak=Math.max(warmPeak,Math.abs(l),Math.abs(r));
}});
n.loadROM(rom.toString('binary'));
n.fromJSON(JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json',import.meta.url))));
for(let b=0;b<8;b++)n.buttonUp(1,b);
function queue(command){
  const q=n.cpu.mem[0xda];assert.equal(n.cpu.mem[0xdc+q],0x88,'Queue must be free');
  n.cpu.mem[0xdc+q]=command;n.cpu.mem[0xda]=(q+1)&7;
}
queue(0xf0);
for(frame=0;frame<150;frame++)n.frame();
assert.equal(warmPeak,0,'Music must be completely silent before capture');
const emulate=n.cpu.emulate.bind(n.cpu);
n.cpu.emulate=()=>{
  if(n.cpu.REG_PC===0xec5c)requests.push({frame,sound:n.cpu.REG_ACC});
  return emulate();
};
const write=n.papu.writeReg.bind(n.papu);
n.papu.writeReg=(address,value)=>{writes.push({frame,address,value});return write(address,value);};
capture=true;queue(0x25);
for(frame=0;frame<150;frame++)n.frame();
assert.deepEqual(requests,[],'No unrelated native sound requests allowed during controlled queue take');
assert.ok(writes.length>0);
const pcm=samples.map(s=>s.map(v=>Math.round(Math.max(-1,Math.min(1,v))*32767)));
const first=pcm.findIndex(s=>s.some(v=>v!==0));
let last=pcm.length-1;while(last>=0&&pcm[last].every(v=>v===0))last--;
assert.ok(first>=0&&last>first&&last<pcm.length-48000,'Require audible cue followed by at least one second of PCM silence');
const end=Math.min(last+1+480,pcm.length),count=end-first,rate=n.papu.sampleRate;
const wav=Buffer.alloc(44+count*4);
wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);
wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(2,22);
wav.writeUInt32LE(rate,24);wav.writeUInt32LE(rate*4,28);wav.writeUInt16LE(4,32);wav.writeUInt16LE(16,34);
wav.write('data',36);wav.writeUInt32LE(count*4,40);
for(let i=first;i<end;i++)for(let c=0;c<2;c++)wav.writeInt16LE(pcm[i][c],44+(i-first)*4+c*2);
const report={method:'Original supplied USA MM5 ROM, native queue F0 stop,150 frames warmup,queue25,150 frames full APU capture. No channels muted, no synthesized replacement, no normalization. Trim only PCM silence; retain 10ms silent tail. Not a natural MM5 gate playthrough.',disassembly:{url:'https://github.com/refreshing-lemonade/megaman5-disassembly',commit:'03e59a6855c1aca85d063bd2973005dc3ffd02ef',file:'bank1B_1F.asm'},spans,rate,channels:2,bits:16,warmPeak,firstSample:first,lastAudibleSample:last,endSample:end,samples:count,seconds:count/rate,peak:pcm.reduce((p,s)=>Math.max(p,Math.abs(s[0]),Math.abs(s[1])),0),bytes:wav.length,sha256:crypto.createHash('sha256').update(wav).digest('hex')};
fs.writeFileSync(new URL('snd_mm5_gate_open.wav',out),wav);
fs.writeFileSync(new URL('recovery.json',out),JSON.stringify(report,null,2)+'\n');
fs.writeFileSync(new URL('mm5-audio-writes.json',work),JSON.stringify({requests,writes},null,2));
console.log(report);
