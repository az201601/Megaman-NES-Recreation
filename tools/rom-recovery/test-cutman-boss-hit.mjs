// Actual GML through syntax adapter; project balance/latch tests, not GMS runtime.
import fs from'node:fs';import assert from'node:assert/strict';
const file=new URL('../../Assets/Bosses/MM1/Cut Man/Combat/Scripts/scr_mm1_cutman_boss_hit.gml',import.meta.url);
const hit=new Function('s','with(s){'+fs.readFileSync(file,'utf8')+'}');let checks=0;
const boss=()=>({exists:true,boss_intro_complete:true,cm_active:true,cm_defeat_pending:false,cm_blink:0,boss_health:28,cm_cutter:1,cm_throw_requested:true,cm_speed_x:288,cm_speed_y:1600});
function fire(actor,type){const shot={exists:true,object_index:type};const s={argument0:actor,argument1:shot,obj_mm5_buster_full:3,snd_mm6_enemy_hit:35,max:Math.max,instance_exists:o=>!!o?.exists,instance_destroy:()=>{shot.exists=false},audio_play_sound:(...a)=>s.plays.push(a),plays:[],handoffs:0,scr_mm1_cutman_victory_handoff:()=>{s.handoffs++}};const result=hit(s);checks++;return{shot,result,plays:s.plays,handoffs:s.handoffs};}
for(const[type,hits]of[[1,28],[2,28],[3,10]]){
 const a=boss();let count=0;
 while(a.cm_active){a.cm_blink=0;const r=fire(a,type);assert.equal(r.result,true);assert.equal(r.shot.exists,false);assert.deepEqual(r.plays,[[35,10,false]]);count++;assert.ok(count<=28);}
 assert.equal(count,hits);assert.equal(a.boss_health,0);assert.equal(a.cm_defeat_pending,true);assert.equal(a.cm_cutter,0);assert.equal(a.cm_throw_requested,false);assert.equal(a.cm_speed_x,0);assert.equal(a.cm_speed_y,0);
 const again=fire(a,3);assert.equal(again.result,false);assert.equal(again.plays.length,0);assert.equal(a.boss_health,0);
}
for(let flash=1;flash<=63;flash++)for(const type of[1,2,3]){const a=boss();a.cm_blink=flash;const r=fire(a,type);assert.equal(a.boss_health,28);assert.equal(r.shot.exists,false);assert.equal(r.plays.length,0);assert.equal(a.cm_blink,flash);}
for(const key of['boss_intro_complete','cm_active']){const a=boss();a[key]=false;const r=fire(a,1);assert.equal(r.result,false);assert.equal(a.boss_health,28);assert.equal(r.shot.exists,true);}
{const a=boss();a.boss_health=1;const r=fire(a,3);assert.equal(a.boss_health,0);assert.equal(a.cm_defeat_pending,true);assert.equal(r.plays.length,1);assert.equal(r.handoffs,1);}
console.log(`PASS ${checks} actual-GML damage/absorption/invulnerability/28normal/28partial/10full/once-only final-hit cases. Victory owner and live routing NOT yet integrated.`);
