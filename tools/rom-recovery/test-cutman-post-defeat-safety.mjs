// Actual-GML regression: an already-overlapping cutter cannot hurt after lethal hit.
import fs from 'node:fs';import assert from 'node:assert/strict';
const base=new URL('../../Assets/Bosses/MM1/Cut Man/Combat/Scripts/',import.meta.url);
const read=n=>fs.readFileSync(new URL(n+'.gml',base),'utf8');
const compile=s=>new Function('s','with(s){'+s.replace(/\bexit\s*;/g,'return;')+'}');
const hit=compile(read('scr_mm1_cutman_boss_hit')),contact=compile(read('scr_mm1_cutman_boss_contact'));
let checks=0;
for(const type of [1,2,3])for(const staleCutter of [false,true]){
 const boss={exists:true,cm_initialized:true,boss_intro_complete:true,cm_active:true,cm_defeat_pending:false,cm_blink:0,boss_health:1,cm_cutter:1,cm_throw_requested:true,cm_speed_x:288,cm_speed_y:1600,x:3200,y:900,cc_x:128,cc_y:180};
 const p={exists:true,x:3200,y:900,sliding:false,health:28};
 const shot={exists:true,object_index:type};let damageCalls=0,handoffs=0;
 const env={argument0:p,instance_exists:o=>!!o?.exists,instance_find:()=>boss,obj_mm1_cutman_boss:1,scr_mm5_combat_overlap:()=>true,scr_mm5_combat_damage:(player,damage)=>{damageCalls++;player.health-=damage;}};
 const firing={argument0:boss,argument1:shot,obj_mm5_buster_full:3,snd_mm6_enemy_hit:35,max:Math.max,instance_exists:env.instance_exists,instance_destroy:()=>{shot.exists=false;},audio_play_sound:()=>{},scr_mm1_cutman_victory_handoff:()=>{handoffs++;}};
 assert.equal(hit(firing),true);assert.equal(boss.cm_defeat_pending,true);assert.equal(boss.cm_cutter,0);assert.equal(boss.cm_active,false);assert.equal(handoffs,1);
 // Even a stale renderer/projectile marker must never bypass the defeat guard.
 if(staleCutter){boss.cm_cutter=1;boss.cm_active=true;}
 for(let frame=0;frame<600;frame++)contact(env);
 assert.equal(damageCalls,0);assert.equal(p.health,28);checks++;
}
console.log(`PASS:${checks} lethal-hit post-defeat safety cases:normal/partial/full shots,overlapping body+cutter,same-update and600 later contact passes,including stale cutter/active flags. No timer-based invulnerability dependency.`);
