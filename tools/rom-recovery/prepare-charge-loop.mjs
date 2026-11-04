// Find a PCM seam within measured steady native8-update charge cycles.
// Crops/repeats captured PCM only; no fades, synthesis, resampling or channel isolation.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const work=new URL('./.work/',import.meta.url);
const info=JSON.parse(fs.readFileSync(new URL('charge-effect-charge.json',work)));
const raw=fs.readFileSync(new URL('charge-effect-charge-raw.wav',work));
const sample=(i,c=0)=>raw.readInt16LE(44+i*4+c*2);
const pattern=t=>info.writes.filter(w=>w.frame>=t&&w.frame<t+8).map(w=>[w.frame-t,w.address,w.value]);
for(let i=1;i<=17;i++)assert.deepEqual(pattern(110+i*8),pattern(110));
assert.deepEqual(info.requests.filter(r=>r.captured).map(r=>r.sound),[34]);
const begin=info.rows[174].start,limit=info.rows[174].end;

let best;
// Align full waveform windows, not merely two near-zero samples.
for(let cycles=1;cycles<=9;cycles++)for(let start=begin;start<limit;start+=2)for(let delta=-20;delta<=20;delta++){
 const length=info.rows[174+cycles*8].start-begin+delta;
 const end=start+length;let error=0,max=0;
 for(let j=-32;j<96;j++)for(let c=0;c<2;c++){
  const d=sample(start+j,c)-sample(end+j,c);error+=d*d;max=Math.max(max,Math.abs(d));
 }
 // Avoid a seam on a pulse edge; compare join step with its original neighbour.
 const jump=Math.max(...[0,1].map(c=>Math.abs(sample(end-1,c)-sample(start,c))));
 const score=error+256*jump*jump;
 if(!best||score<best.score)best={start,end,length,cycles,rms:Math.sqrt(error/256),max,jump,score};
}
console.log(best);
assert.ok(best.rms<50,'Waveform seam not close enough; do not publish');
assert.ok(best.max<512,'Waveform window contains excessive mismatch');
assert.ok(best.jump<50,'Loop seam has a discontinuity; do not publish');
const dir=new URL('../../Assets/Audio/Mega Man/MM5/Buster/Charging/Loop Review/',import.meta.url);
fs.mkdirSync(dir,{recursive:true});
const intro=raw.subarray(44+info.start*4,44+best.start*4),loop=raw.subarray(44+best.start*4,44+best.end*4);
function wav(name,payload){
 const out=Buffer.concat([raw.subarray(0,44),payload]);out.writeUInt32LE(out.length-8,4);out.writeUInt32LE(payload.length,40);
 fs.writeFileSync(new URL(name,dir),out);
}
wav('mm5-charge-intro-review.wav',intro);wav('mm5-charge-loop-review.wav',loop);
// This is an audible review of the proposed repeat, not an installable full-action effect.
wav('mm5-charge-looped-preview.wav',Buffer.concat([intro,...Array(16).fill(loop)]));
assert.deepEqual(loop,raw.subarray(44+best.start*4,44+best.end*4));
fs.writeFileSync(new URL('charge-loop-seam.json',work),JSON.stringify({...best,introStart:info.start,introSamples:intro.length/4,loopSamples:loop.length/4,rate:48000},null,2));
console.log('Unmodified PCM intro/loop and16-repeat listening preview prepared. User seam hearing approval pending.');
