// Executes actual GML core under JS-compatible syntax. No GMS runtime acceptance.
import fs from 'node:fs';import assert from 'node:assert/strict';
const base=new URL('../../Assets/Bosses/MM1/Cut Man/Victory/Scripts/',import.meta.url);
const source=name=>fs.readFileSync(new URL(`scr_mm1_cutman_victory_${name}.gml`,base),'utf8');
const sources=['init','start','step'].map(source),fields=[...new Set(sources.join('\n').match(/\bcmv_\w+/g))];
const [init,start,step]=sources.map(s=>new Function('s','with(s){'+s+'}'));
const make=()=>{const s=Object.fromEntries(fields.map(k=>[k,0]));init(s);return s;};
const begin=s=>{s.argument0=3200;return start(s);};
const update=(s,t,options={})=>{let a=[t,false,false,false,3100,true,false,false,false];for(const[k,v]of Object.entries(options))a[+k]=v;for(let i=0;i<9;i++)s['argument'+i]=a[i];return step(s);};
let checks=0;
function reachWalk(s){assert.equal(begin(s),1);assert.equal(begin(s),0);assert.equal(update(s,0,{3:true}),0);for(let t=1;t<240;t++)assert.equal(update(s,t),0);assert.equal(update(s,240),2);for(let t=241;t<480;t++)assert.equal(update(s,t),0);assert.equal(update(s,480),3);assert.equal(s.cmv_phase,4);checks++;}
for(const x of [3096,3199,3200,3201,3304]){
 const s=make();reachWalk(s);s.cmv_direction=x>=3200?-1:1;
 let px=x,t=481,events=[];
 // Actual speed is a movement-bridge responsibility; fixture strides disclose this.
 for(let n=0;n<200&&s.cmv_phase===4;n++){
  const e=update(s,t++,{4:px,5:false});if(e)events.push(e);
  if(s.cmv_snap)px=s.cmv_center;else px+=s.cmv_move*1.5;
 }
 assert.equal(s.cmv_phase,5);assert.equal(px,3200);assert.equal(update(s,t++,{4:px,5:false}),0);
 assert.equal(update(s,t++,{4:px,5:true}),4);assert.equal(s.cmv_phase,6);
 assert.equal(update(s,t++,{6:false}),0);assert.equal(update(s,t++,{6:true}),5);
 assert.equal(update(s,t++,{7:false}),0);assert.equal(update(s,t++,{7:true}),6);
 assert.equal(update(s,t++,{8:false}),0);assert.equal(s.cmv_reward_requested,false);
 assert.equal(update(s,t++,{8:true}),7);assert.equal(s.cmv_reward_requested,true);
 for(let i=0;i<30;i++)assert.equal(update(s,t++,{6:true,7:true,8:true}),0);
 assert.equal(begin(s),0);checks++;
}
// Frozen updates never consume wait time; duplicate shared clock never advances it.
{const s=make();begin(s);update(s,0,{3:true});for(let t=1;t<=10000;t++){
 const old=s.cmv_timer;assert.equal(update(s,t,{1:true,3:true,6:true,7:true,8:true}),0);assert.equal(s.cmv_timer,old);
}for(let t=10001;t<10101;t++){update(s,t);const old=s.cmv_timer;assert.equal(update(s,t),0);assert.equal(s.cmv_timer,old);}checks++;}
// Cancellation wins in every active phase, even frozen, and can never grant reward.
for(let phase=1;phase<=8;phase++){const s=make();begin(s);s.cmv_phase=phase;assert.equal(update(s,1,{1:true,2:true,3:true,6:true,7:true,8:true}),8);assert.equal(s.cmv_phase,10);assert.equal(s.cmv_reward_requested,false);assert.equal(update(s,2,{8:true}),0);assert.equal(begin(s),0);checks++;}
// Idle ignores all stale completion inputs. A new instance alone can start again.
{const s=make();assert.equal(update(s,1,{3:true,6:true,7:true,8:true}),0);assert.equal(s.cmv_phase,0);checks++;}
console.log(`PASS:${checks} actual-GML controller groups; two240-active-update waits,5 centre starts,airborne landing gate,10000 frozen updates,deduped clock,all8 abort phases,once-only completion. No live player/audio/art/screen bridge installed.`);
