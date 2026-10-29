// Actual GML-subset execution against queue API mocks. NOT GMS1.4 runtime proof.
import fs from 'node:fs';import assert from 'node:assert/strict';
const base=new URL('../../Assets/Audio/Mega Man/MM5/Buster/Charging/Playback/',import.meta.url);
const compile=name=>new Function('env','with(env){'+fs.readFileSync(new URL(name+'.gml',base),'utf8').replace(/\bexit\s*;/g,'return;')+'}');
const create=compile('obj_mm5_charge_audio_create'),start=compile('scr_mm5_charge_audio_start'),stop=compile('scr_mm5_charge_audio_stop'),dispose=compile('scr_mm5_charge_audio_dispose'),asyncEvent=compile('obj_mm5_charge_audio_audio_playback'),testStep=compile('obj_mm5_charge_audio_step_TEST_ONLY');
function world(failFile='',failQueue=false,failPlay=false){
 let id=10;const buffers=new Map(),queues=new Map(),voices=new Map([[999,'stage']]),events=[];
 const e={charge_audio_queue:0,charge_audio_voice:0,charge_audio_intro:0,charge_audio_loop:0,charge_audio_closing:false,
 working_directory:'',buffer_s16:16,audio_stereo:2,vk_f6:117,held:false,fresh:false,async_load:{},events,buffers,queues,voices,
 buffer_load:name=>{if(name===failFile)return -1;const b=fs.readFileSync(new URL(name,base));buffers.set(++id,b);return id;},
 buffer_get_size:b=>{assert.ok(buffers.has(b));return buffers.get(b).length;},
 buffer_delete:b=>{assert.ok(buffers.has(b));assert.equal(queues.size,0,'Queue freed before buffers');buffers.delete(b);events.push(['delete',b]);},
 audio_create_play_queue:(format,rate,channels)=>{assert.equal(format,16);assert.equal(rate,48000);assert.equal(channels,2);if(failQueue)return -1;queues.set(++id,[]);return id;},
 audio_queue_sound:(q,b,offset,size)=>{assert.ok(queues.has(q));assert.ok(buffers.has(b));assert.equal(offset,0);assert.equal(size,buffers.get(b).length);queues.get(q).push(b);},
 audio_play_sound:(q,priority,loop)=>{assert.ok(queues.has(q));assert.equal(priority,1);assert.equal(loop,false);if(failPlay)return -1;voices.set(++id,q);return id;},
 audio_stop_sound:v=>{assert.notEqual(v,999);assert.ok(voices.has(v));voices.delete(v);events.push(['stop',v]);},
 audio_free_play_queue:q=>{assert.ok(queues.has(q));queues.delete(q);events.push(['free',q]);},
 ds_map_find_value:(map,key)=>map[key],show_error:(message,fatal)=>events.push(['error',fatal]),
 keyboard_check:k=>e.held,keyboard_check_pressed:k=>e.fresh};
 e.scr_mm5_charge_audio_stop=()=>stop(e);e.scr_mm5_charge_audio_start=()=>start(e);e.scr_mm5_charge_audio_dispose=()=>dispose(e);
 create(e);return e;
}
const e=world();assert.equal(e.buffers.size,2);assert.equal(e.queues.size,0);
e.held=true;e.fresh=true;testStep(e);const q=e.charge_audio_queue;
assert.deepEqual(e.queues.get(q),[e.charge_audio_intro,e.charge_audio_loop,e.charge_audio_loop]);
assert.equal(start(e),false,'Repeated start must not replay intro');
function finish(buffer){assert.equal(e.queues.get(q).shift(),buffer);e.async_load={queue_id:q,buffer_id:buffer,queue_shutdown:0};asyncEvent(e);}
finish(e.charge_audio_intro);assert.equal(e.queues.get(q).length,2);
for(let i=0;i<50;i++){finish(e.charge_audio_loop);assert.equal(e.queues.get(q).length,2);}
e.held=false;e.fresh=false;testStep(e);assert.equal(e.queues.size,0);assert.equal(e.buffers.size,2);assert.equal(e.voices.get(999),'stage');
e.async_load={queue_id:q,buffer_id:e.charge_audio_loop,queue_shutdown:0};asyncEvent(e);assert.equal(e.queues.size,0);
assert.equal(start(e),true);const q2=e.charge_audio_queue;assert.notEqual(q2,q);
e.async_load={queue_id:q,buffer_id:e.charge_audio_loop,queue_shutdown:0};asyncEvent(e);assert.equal(e.queues.get(q2).length,3);
e.async_load={queue_id:q2,buffer_id:e.charge_audio_loop,queue_shutdown:1};asyncEvent(e);assert.equal(e.queues.get(q2).length,3);
dispose(e);dispose(e);assert.equal(e.buffers.size,0);assert.equal(e.queues.size,0);assert.equal(e.voices.size,1);assert.equal(start(e),false);
const missing=world('mm5_charge_intro.pcm');assert.equal(missing.buffers.size,0);assert.equal(missing.charge_audio_closing,true);assert.ok(missing.events.some(v=>v[0]==='error'));
const noQueue=world('',true);assert.equal(start(noQueue),false);dispose(noQueue);
const noPlay=world('',false,true);assert.equal(start(noPlay),false);assert.equal(noPlay.queues.size,0);dispose(noPlay);
console.log('Charge audio GML mock passed: intro once,50 loop refills, idempotent stop/dispose, stale/shutdown callbacks, restart, failure cleanup, stage voice unaffected. GMS1.4 real queue/event/rapid-restart behaviour pending runtime test.');
