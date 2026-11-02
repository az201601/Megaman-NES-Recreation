// Actual GML ownership/dispatch tests; audio API mocked, not GMS playback acceptance.
import fs from 'node:fs';import assert from 'node:assert/strict';import{createHash}from'node:crypto';
const base=new URL('../../Assets/Bosses/MM1/Cut Man/Victory/',import.meta.url),read=p=>fs.readFileSync(new URL(p,base),'utf8');
const compile=s=>new Function('s','with(s){'+s+'}'),initSource=read('Scripts/scr_mm1_cutman_victory_init.gml');
const init=compile(initSource),step=compile(read('Scripts/scr_mm1_cutman_victory_audio_step.gml')),dispose=compile(read('Scripts/scr_mm1_cutman_victory_audio_dispose.gml'));
function make(){const s=Object.fromEntries([...new Set(initSource.match(/cmv_\w+/g))].map(k=>[k,0]));init(s);s.snd_mm6_stage_clear=13;s.snd_mm6_weapon_acquisition=95;s.argument0=false;s.log=[];let voice=100;
for(const name of ['stop','pause','resume'])s['audio_'+name+'_sound']=id=>s.log.push([name,id]);
s.audio_play_sound=(...a)=>{s.log.push(['play',...a]);return voice++;};s.scr_mm1_cutman_victory_audio_dispose=()=>dispose(s);return s;}
const entry=(s,event,phase)=>{s.cmv_entry_serial++;s.cmv_entry_event=event;s.cmv_phase=phase;step(s);};
{const s=make();entry(s,1,1);assert.equal(s.log.length,0);entry(s,2,3);for(let i=0;i<600;i++)step(s);assert.deepEqual(s.log,[['play',13,12,false]]);
entry(s,4,6);assert.equal(s.log.length,1,'no acquisition sound on jump entry');s.cmv_acquisition_sound_requested=true;step(s);for(let i=0;i<600;i++)step(s);assert.deepEqual(s.log.slice(1),[['play',95,12,false]]);
entry(s,5,7);assert.equal(s.cmv_acquisition_voice,-1);assert.deepEqual(s.log.at(-1),['stop',101]);entry(s,6,8);assert.equal(s.log.filter(e=>e[0]==='play').length,2,'custom screen music not replaced with MM6 track');entry(s,7,9);assert.equal(s.cmv_audio_closing,true);const n=s.log.length;dispose(s);step(s);assert.equal(s.log.length,n);}
{const s=make();entry(s,2,3);s.argument0=true;step(s);step(s);assert.equal(s.log.filter(e=>e[0]==='pause').length,1);s.argument0=false;step(s);step(s);assert.equal(s.log.filter(e=>e[0]==='resume').length,1);
s.argument0=true;entry(s,8,10);assert.equal(s.cmv_audio_closing,true);assert.equal(s.cmv_clear_voice,-1);}
{const s=make();s.argument0=true;entry(s,2,3);assert.equal(s.log.length,0);s.argument0=false;step(s);assert.equal(s.log.filter(e=>e[0]==='play').length,1);}
for(const file of ['Reference/stage-clear-approval.json','Reference/weapon-acquisition-approval.json','Reference/custom-weapon-get-music-approval.json','Reference/mm5-weapon-get-music-approval.json']){const a=JSON.parse(read(file));assert.equal(createHash('sha256').update(fs.readFileSync(new URL(a.file,base))).digest('hex'),a.sha256);}
console.log('PASS:actual-GML once-only clear/acquisition audio,animation-onset gate,teleport stop,freeze/resume,cancel/finish/idempotent cleanup,no native16 substitution;approved WAV hashes unchanged.');
