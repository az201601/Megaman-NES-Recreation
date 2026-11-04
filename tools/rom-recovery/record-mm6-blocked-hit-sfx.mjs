// MM6 original reflected-projectile cue, separate from approved35 successfulhit.
import fs from'node:fs';import assert from'node:assert/strict';import{createHash}from'node:crypto';import{NES}from'jsnes';
const root=new URL('../../',import.meta.url),out=new URL('Assets/Audio/Mega Man/MM6/Combat/Blocked Hit/',root);fs.mkdirSync(out,{recursive:true});
const rom=fs.readFileSync(new URL('Mega Man 6 (USA).nes',root));
const spans=[[56,0x90ee,'bdc80549ff9dc805fec805a9fc9ddf05'],[56,0x90fe,'bdb70349409db703'],[56,0x9112,'a92785dc'],[62,0xc61b,'a5dcc9fff00720b2c8a9ff85dc']].map(([bank,cpu,hex])=>{const offset=16+bank*8192+(cpu&8191);assert.equal(rom.subarray(offset,offset+hex.length/2).toString('hex'),hex);return{bank,cpu,offset,hex};});
let capture=false,frame=0,warmPeak=0;const samples=[],commands=[];
const n=new NES({sampleRate:48000,onAudioSample:(l,r)=>{if(capture)samples.push(l,r);else if(frame>=100)warmPeak=Math.max(warmPeak,Math.abs(l),Math.abs(r));}});
n.loadROM(rom.toString('binary'));n.fromJSON(JSON.parse(fs.readFileSync(new URL('./.work/mm6-hit/stage.json',import.meta.url))));for(let b=0;b<8;b++)n.buttonUp(1,b);
assert.equal(n.cpu.mem[0xdc],255);n.cpu.mem[0xdc]=0xf0;for(let i=0;i<150;i++)n.frame();
// Same uncaptured native35 settling step used for the already approved hitcue.
n.cpu.mem[0xdc]=0x35;for(frame=0;frame<150;frame++)n.frame();assert.equal(warmPeak,0);
const em=n.cpu.emulate.bind(n.cpu);n.cpu.emulate=()=>{if(n.cpu.REG_PC===0xc8b1)commands.push({frame,id:n.cpu.REG_ACC});return em();};
capture=true;n.cpu.mem[0xdc]=0x27;for(frame=0;frame<150;frame++)n.frame();assert.deepEqual(commands.map(v=>v.id),[0x27]);
const pcm=samples.map(v=>Math.round(Math.max(-1,Math.min(1,v))*32767));let first=0,last=pcm.length-2;
while(first<pcm.length&&pcm[first]===0&&pcm[first+1]===0)first+=2;while(last>=0&&pcm[last]===0&&pcm[last+1]===0)last-=2;
assert.ok(first<last&&last<pcm.length-96000,'Require exactzero ending');const clip=pcm.slice(first,last+2+960),balanced=clip.map(v=>v*2);assert.ok(balanced.every(v=>v>=-32768&&v<=32767));
function wav(data){const b=Buffer.alloc(44+data.length*2);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(2,22);b.writeUInt32LE(48000,24);b.writeUInt32LE(192000,28);b.writeUInt16LE(4,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(data.length*2,40);data.forEach((v,i)=>b.writeInt16LE(v,44+i*2));return b;}
const hash=b=>createHash('sha256').update(b).digest('hex');const files=[];
for(const[name,data]of[['mm6-blocked-hit-raw.wav',clip],['mm6-blocked-hit-balanced-review.wav',balanced]]){const b=wav(data);fs.writeFileSync(new URL(name,out),b);files.push({name,sha256:hash(b),seconds:data.length/96000});}
const report={method:'Supplied originalMM6USA, fullAPU/defaultstereo,48kHzstereoPCM16. NativeDCmailboxF0stop, uncaptured35settlingcue and150warmupdates(final50exactzero), original27queued once/150captureupdates. Isolated originaldrivercue, NOT a natural armored-enemy collision trace. Identity independently established by byte-checked projectile bounce routine: horizontal speed negated, upwardspeedFC, facing toggled,27->DC. No fade/filter/synthesis/channelisolation/normalization. Silence-only trim10mstail; review exact2xgain. Prior35successfulhit file untouched.',romSha256:hash(rom),source:{repository:'https://github.com/refreshing-lemonade/megaman6-disassembly',commit:'f0763c46fad2bbcb45e4b8a2f759a10ee3c7c421',file:'bank38_3F.asm'},spans,warmPeak,commands,firstSample:first/2,lastAudibleSample:last/2,samples:clip.length/2,peak:Math.max(...balanced.map(Math.abs))/32768,files};
fs.writeFileSync(new URL('recovery.json',out),JSON.stringify(report,null,2)+'\n');console.log(report);
