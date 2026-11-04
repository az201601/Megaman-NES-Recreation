// Original action-theme audition, following user's explicit "driving" direction.
// No ROM music or samples. Offline NES-style instruments, not APU emulation.
import fs from'node:fs';import{createHash}from'node:crypto';
const base=new URL('../../Assets/Bosses/MM1/Cut Man/Victory/',import.meta.url),sr=48000,bpm=160,beat=60/bpm,step=beat/4,bars=8,seconds=32*beat,count=Math.round(seconds*sr),mix=new Float64Array(count);
// Sixteenth-note riff grid: -2 sustains, -1 rests. Repetition/accents are intentional.
const riffs=[
 [62,-2,62,-1,65,-2,67,65,62,-2,69,-2,67,65,62,60],
 [62,-2,62,-1,65,-2,67,65,69,-2,67,65,62,-2,-1,62],
 [58,-2,58,-1,62,-2,65,62,58,-2,65,-2,62,60,58,60],
 [60,-2,60,-1,64,-2,67,64,72,-2,70,67,64,-2,-1,60],
 [74,-2,74,-1,72,-2,69,67,69,-2,67,65,62,-2,65,67],
 [65,-2,65,-1,69,-2,72,69,77,-2,74,72,69,-2,67,65],
 [67,-2,67,-1,72,-2,70,67,64,-2,67,-2,72,70,67,64],
 [69,-2,69,-1,73,-2,76,73,69,-2,67,64,61,-2,-1,60]
];
const roots=[38,38,34,36,38,41,36,33],cpu=1789773;
function tone(start,duration,midi,kind,level,duty=.25){const first=Math.round(start*sr),len=Math.round(duration*sr),target=440*2**((midi-69)/12),div=kind==='triangle'?32:16,freq=cpu/(div*(Math.round(cpu/(div*target))-1+1));let phase=0;for(let j=0;j<len&&first+j<count;j++){const t=j/sr,left=(len-j)/sr,env=Math.min(1,t/.0015,left/.008)*(kind==='triangle'?.95:.5+.5*Math.exp(-t*14)),v=kind==='triangle'?1-4*Math.abs(phase-.5):(phase<duty?1:-1);mix[first+j]+=v*level*env;phase=(phase+freq/sr)%1;}}
let lfsr=1;
function drum(start,kind){const first=Math.round(start*sr),duration=kind==='snare'?.105:kind==='kick'?.055:.025,len=Math.round(duration*sr);let phase=0,held=0;for(let j=0;j<len&&first+j<count;j++){const t=j/sr;if(j%(kind==='hat'?5:kind==='snare'?13:39)===0){lfsr=(lfsr>>1)|(((lfsr^(lfsr>>1))&1)<<14);held=(lfsr&1)?1:-1;}const env=Math.min(1,j/30)*Math.exp(-t*(kind==='hat'?170:kind==='snare'?43:72));mix[first+j]+=held*env*(kind==='hat'?.023:kind==='snare'?.13:.095);phase++;}}
for(let bar=0;bar<bars;bar++){
 const start=bar*4*beat;
 for(let k=0;k<16;k++){
  const note=riffs[bar][k];if(note>=0){let length=1;while(k+length<16&&riffs[bar][k+length]===-2)length++;tone(start+k*step,length*step-.008,note,'pulse',.17,.125);}
 }
 // Chopped low pulse supports the riff with roots/fifths, no tinkling arpeggio.
 for(const [k,length,fifth]of [[0,2,0],[3,1,0],[6,2,7],[8,2,0],[11,1,0],[14,2,7]])tone(start+k*step,length*step*.72,roots[bar]+12+fifth,'pulse',.09,.5);
 // Syncopated triangle bass with octave accents; groove repeats instead of bouncing melody.
 for(const [k,length,octave]of [[0,2,0],[3,1,0],[4,2,0],[6,2,12],[8,2,0],[11,1,0],[12,2,0],[14,2,12]])tone(start+k*step,length*step*.87,roots[bar]+octave,'triangle',.17);
 for(let k=0;k<16;k+=2)drum(start+k*step,'hat');
 for(const k of [0,6,8,11])drum(start+k*step,'kick');
 for(const k of [4,12])drum(start+k*step,'snare');
 if(bar===3||bar===7)for(const k of [14,15])drum(start+k*step,'snare');
}
const mean=mix.reduce((a,b)=>a+b,0)/count;let peak=0;for(let i=0;i<count;i++){mix[i]=(mix[i]-mean)*Math.min(1,i/(sr*.002),(count-1-i)/(sr*.002));peak=Math.max(peak,Math.abs(mix[i]));}const pcm=Buffer.alloc(count*2);for(let i=0;i<count;i++)pcm.writeInt16LE(Math.round(mix[i]/peak*.7*32767),i*2);
const wav=Buffer.alloc(44+pcm.length);wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(sr,24);wav.writeUInt32LE(sr*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(pcm.length,40);pcm.copy(wav,44);
const file='Audio/Custom Review/rolling-cutter-weapon-get-action-v3.wav';fs.writeFileSync(new URL(file,base),wav);const report={status:'Revision3 audition. User selected driving action theme after rejecting revisions1/2. Not approved or integrated.',file,sha256:createHash('sha256').update(wav).digest('hex'),bpm,bars,seconds,sampleRate:sr,channels:1,bits:16,peak:.7,composition:'Original riff-led action theme: repeated sixteenth-note pulse hook,low root/fifth pulse stabs,syncopated triangle bass,noise kick/snare/hat and turnaround fills. D minor centre with dominant turnaround.',method:'Offline custom synth with NES-like quantized pitched periods and15bit noise. Custom envelopes/mixing,not native APU or hardware recording; no ROM music/samples.',riffs,roots};fs.writeFileSync(new URL('Reference/custom-weapon-get-music-action-v3.json',base),JSON.stringify(report,null,2)+'\n');console.log({file,seconds,sha256:report.sha256});
