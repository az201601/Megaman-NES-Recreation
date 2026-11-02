// Original composition for this project; no sampled/transcribed ROM music.
// Offline four-voice NES-style synth (NOT a native APU/hardware recording).
import fs from'node:fs';import{createHash}from'node:crypto';
const base=new URL('../../Assets/Bosses/MM1/Cut Man/Victory/',import.meta.url),sr=48000,bpm=150,beat=60/bpm,eighth=beat/2,bars=8,seconds=bars*4*beat;
// D major; eight original melodic phrases, eighth-note grid, -1 means rest.
const melody=[
 [74,78,81,78,83,81,78,76], [78,81,85,83,81,78,76,73],
 [74,79,83,81,79,78,76,74], [73,76,81,85,83,81,76,-1],
 [78,81,85,88,85,83,81,78], [79,83,86,85,83,81,79,78],
 [76,79,83,81,79,76,74,73], [76,81,85,83,81,76,73,69]
];
const chords=[[62,66,69],[59,62,66],[55,59,62],[57,61,64],[54,57,61],[55,59,62],[52,55,59],[57,61,64]],bass=[38,35,31,33,30,31,28,33];
const count=Math.round(seconds*sr),mix=new Float64Array(count);const hz=m=>440*2**((m-69)/12),cpu=1789773;
function note(start,duration,midi,kind,level,duty=.25){if(midi<0)return;const first=Math.round(start*sr),length=Math.round(duration*sr),freq=kind==='triangle'?cpu/(32*(Math.round(cpu/(32*hz(midi))-1)+1)):cpu/(16*(Math.round(cpu/(16*hz(midi))-1)+1));let phase=0;for(let j=0;j<length&&first+j<count;j++){const t=j/sr,remaining=(length-j)/sr,gate=Math.min(1,t/.002,remaining/.012),decay=kind==='triangle'?.92:Math.exp(-t*3.3),v=kind==='triangle'?1-4*Math.abs(phase-.5):(phase<duty?1:-1);mix[first+j]+=v*level*gate*decay;phase=(phase+freq/sr)%1;}}
let lfsr=1;function noise(start,duration,level){let held=0;const first=Math.round(start*sr),length=Math.round(duration*sr);for(let j=0;j<length&&first+j<count;j++){if(j%8===0){lfsr=(lfsr>>1)|(((lfsr^(lfsr>>1))&1)<<14);held=(lfsr&1)?1:-1;}mix[first+j]+=held*level*Math.exp(-j/sr*100)*Math.min(1,j/24);}}
for(let bar=0;bar<bars;bar++){
 const start=bar*4*beat;
 for(let step=0;step<8;step++){
  note(start+step*eighth,eighth*.88,melody[bar][step],'pulse',.15,.25);
  // Quieter high arpeggio answers the lead; different duty, not another lead.
  note(start+step*eighth,eighth*.65,chords[bar][[0,2,1,2,0,2,1,2][step]]+12,'pulse',.047,.125);
  noise(start+step*eighth,.045,step%2?.025:.014);
 }
 for(let step=0;step<4;step++){note(start+step*beat,beat*.9,bass[bar]+(step===2?12:0),'triangle',.115);if(step===1||step===3)noise(start+step*beat,.09,.055);}
}
// Remove DC, normalize ONCE; no approved audio files are touched.
const mean=mix.reduce((a,b)=>a+b,0)/count;let peak=0;for(let i=0;i<count;i++){mix[i]-=mean;peak=Math.max(peak,Math.abs(mix[i]));}const gain=.62/peak,pcm=Buffer.alloc(count*2);for(let i=0;i<count;i++)pcm.writeInt16LE(Math.round(mix[i]*gain*32767),i*2);
const wav=Buffer.alloc(44+pcm.length);wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(sr,24);wav.writeUInt32LE(sr*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(pcm.length,40);pcm.copy(wav,44);
const file='Audio/Custom Review/rolling-cutter-weapon-get-original-draft.wav';fs.mkdirSync(new URL('Audio/Custom Review/',base),{recursive:true});fs.writeFileSync(new URL(file,base),wav);
const report={status:'Original custom composition DRAFT. Listening approval required; NOT integrated.',file,sha256:createHash('sha256').update(wav).digest('hex'),composition:'Eight original bars in D major,150BPM; pulse lead,quiet pulse arpeggio,triangle bass,15bit-LFSR noise percussion. No ROM notes/music/samples copied.',method:'Offline deterministic four-voice synth. Pulse/triangle frequencies quantized to NES-like periods; envelopes are a custom software instrument, not an APU emulation or hardware recording.',sampleRate:sr,channels:1,bits:16,bpm,bars,seconds,peak:.62,loop:'One complete8bar phrase. Bar8 dominant returns to bar1 tonic. Sample-accurate musical length; not a claim of a native seamless streaming loop.',melody,chords,bass};fs.writeFileSync(new URL('Reference/custom-weapon-get-music-draft.json',base),JSON.stringify(report,null,2)+'\n');console.log({file,seconds,bytes:wav.length,sha256:report.sha256});
