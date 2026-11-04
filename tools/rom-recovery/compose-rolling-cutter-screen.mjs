// Original composition for this project; no sampled/transcribed ROM music.
// Offline four-voice NES-style synth (NOT a native APU/hardware recording).
import fs from'node:fs';import{createHash}from'node:crypto';
const base=new URL('../../Assets/Bosses/MM1/Cut Man/Victory/',import.meta.url),sr=48000,bpm=144,beat=60/bpm,eighth=beat/2,bars=8,seconds=bars*4*beat;
// Revision2: D minor, restrained register. -1 rest, -2 sustains preceding note.
const melody=[
 [74,-2,-2,72,69,-2,65,-1], [70,-2,69,-2,65,-2,-1,69],
 [67,-2,-2,69,70,-2,74,-2], [73,-2,69,-2,76,-2,73,-1],
 [74,-2,77,-2,76,-2,74,72], [70,-2,-2,69,65,-2,62,-1],
 [67,-2,70,-2,74,-2,72,70], [69,-2,73,-2,76,-2,73,-1]
];
const chords=[[62,65,69],[58,62,65],[55,58,62],[57,61,64],[62,65,69],[58,62,65],[55,58,62],[57,61,64]],bass=[38,34,31,33,38,34,31,33];
const count=Math.round(seconds*sr),mix=new Float64Array(count);const hz=m=>440*2**((m-69)/12),cpu=1789773;
function note(start,duration,midi,kind,level,duty=.25){if(midi<0)return;const first=Math.round(start*sr),length=Math.round(duration*sr),freq=kind==='triangle'?cpu/(32*(Math.round(cpu/(32*hz(midi))-1)+1)):cpu/(16*(Math.round(cpu/(16*hz(midi))-1)+1));let phase=0;for(let j=0;j<length&&first+j<count;j++){const t=j/sr,remaining=(length-j)/sr,gate=Math.min(1,t/.002,remaining/.012),decay=kind==='triangle'?.92:Math.exp(-t*1.8),v=kind==='triangle'?1-4*Math.abs(phase-.5):(phase<duty?1:-1);mix[first+j]+=v*level*gate*decay;phase=(phase+freq/sr)%1;}}
let lfsr=1;function noise(start,duration,level){let held=0;const first=Math.round(start*sr),length=Math.round(duration*sr);for(let j=0;j<length&&first+j<count;j++){if(j%24===0){lfsr=(lfsr>>1)|(((lfsr^(lfsr>>1))&1)<<14);held=(lfsr&1)?1:-1;}mix[first+j]+=held*level*Math.exp(-j/sr*65)*Math.min(1,j/24);}}
for(let bar=0;bar<bars;bar++){
 const start=bar*4*beat;
 for(let step=0;step<8;step++){
  if(melody[bar][step]>=0){let held=1;while(step+held<8&&melody[bar][step+held]===-2)held++;
   note(start+step*eighth,eighth*held-.018,melody[bar][step],'pulse',.15,.25);}
 }
 // Lower rhythmic backing replaces the bright, constantly ascending arpeggio.
 for(let step=0;step<4;step++){
  note(start+step*beat,beat*.48,chords[bar][step%2===0?0:2],'pulse',.065,.125);
  note(start+step*beat,beat*.82,bass[bar],'triangle',.145);
  noise(start+step*beat,.04,.018);
  if(step===1||step===3)noise(start+step*beat,.11,.075);
 }

}
// Remove DC, normalize ONCE; no approved audio files are touched.
const mean=mix.reduce((a,b)=>a+b,0)/count;let peak=0;for(let i=0;i<count;i++){mix[i]-=mean;peak=Math.max(peak,Math.abs(mix[i]));}const gain=.62/peak,pcm=Buffer.alloc(count*2);for(let i=0;i<count;i++)pcm.writeInt16LE(Math.round(mix[i]*gain*32767),i*2);
const wav=Buffer.alloc(44+pcm.length);wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(sr,24);wav.writeUInt32LE(sr*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(pcm.length,40);pcm.copy(wav,44);
const file='Audio/Custom Review/rolling-cutter-weapon-get-determined-v2.wav';fs.mkdirSync(new URL('Audio/Custom Review/',base),{recursive:true});fs.writeFileSync(new URL(file,base),wav);
const report={status:'Revision2 audition after user found revision1 too cute/happy. Listening approval required; NOT integrated.',file,sha256:createHash('sha256').update(wav).digest('hex'),composition:'Revision2: eight original bars in D minor,144BPM; lower sustained pulse melody,restrained rhythmic second pulse,stronger triangle bass and noise backbeat. No ROM notes/music/samples copied.',method:'Offline deterministic four-voice synth. Pulse/triangle frequencies quantized to NES-like periods; envelopes are a custom software instrument, not an APU emulation or hardware recording.',sampleRate:sr,channels:1,bits:16,bpm,bars,seconds,peak:.62,loop:'One complete8bar phrase. Bar8 dominant returns to bar1 tonic. Sample-accurate musical length; not a claim of a native seamless streaming loop.',melody,chords,bass};fs.writeFileSync(new URL('Reference/custom-weapon-get-music-draft.json',base),JSON.stringify(report,null,2)+'\n');console.log({file,seconds,bytes:wav.length,sha256:report.sha256});
