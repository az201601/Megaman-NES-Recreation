// Actual lethal-hit + victory transaction under owner mocks. Not GMS runtime.
import fs from'node:fs';import assert from'node:assert/strict';
const root=new URL('../../Assets/Bosses/MM1/Cut Man/',import.meta.url);
const read=p=>fs.readFileSync(new URL(p,root),'utf8'),compile=s=>new Function('s','with(s){'+s+'}');
const initSrc=read('Victory/Scripts/scr_mm1_cutman_victory_init.gml'),init=compile(initSrc),start=compile(read('Victory/Scripts/scr_mm1_cutman_victory_start.gml')),begin=compile(read('Victory/Scripts/scr_mm1_cutman_victory_player_begin.gml')),handoff=compile(read('Victory/Scripts/scr_mm1_cutman_victory_handoff.gml')),hit=compile(read('Combat/Scripts/scr_mm1_cutman_boss_hit.gml'));
const create=read('Combat/Objects/obj_mm1_cutman_boss_create.gml');assert.ok(create.endsWith(initSrc.slice(initSrc.indexOf('cmv_phase ='))));
const boss={...Object.fromEntries([...new Set(initSrc.match(/cmv_\w+/g))].map(k=>[k,0])),boss_intro_complete:true,cm_active:true,cm_defeat_pending:false,cm_blink:0,boss_health:1,cm_cutter:1,cm_throw_requested:true,cm_speed_x:20,cm_speed_y:30};init(boss);
const p={mm5_victory_locked:false,mm5_victory_tick:-1,buster_charge:80,buster_pose_timer:8,buster_slide_at_start:true,mm5_hurt_left:9,mm5_blink_sample:20,mm5_invulnerable:20,on_ladder:true,ladder_instance:7,ladder_moving:true,walk_pause:4,walk_previous_input:1,anim_walk_frame:3,anim_walk_timer:4,fall_speed:-4,y:850,noone:-1};
p.scr_mm1_cutman_victory_player_begin=()=>begin(p);
boss.scr_mm1_cutman_victory_start=center=>{boss.argument0=center;return start(boss)};
let chargeStops=0,bossStops=0,shotCleanups=0,sounds=0;
const shots={instance_destroy:()=>{shotCleanups++}},s={argument0:boss,instance_exists:o=>[boss,p].includes(o),instance_find:()=>p,obj_mm5_megaman:1,obj_mm5_buster_shot:shots,scr_mm5_combat_stop_charge:()=>{chargeStops++},scr_mm1_cutman_boss_stop_combat:()=>{bossStops++}};
const shot={object_index:3};let alive=true;
const h={argument0:boss,argument1:shot,obj_mm5_buster_full:3,snd_mm6_enemy_hit:53,max:Math.max,instance_exists:o=>o===boss||(o===shot&&alive),instance_destroy:()=>{alive=false},audio_play_sound:()=>{sounds++},scr_mm1_cutman_victory_handoff:a=>{s.argument0=a;return handoff(s)}};
assert.equal(hit(h),true);assert.equal(boss.boss_health,0);assert.equal(boss.cmv_phase,1);assert.equal(boss.cmv_center,3200);assert.equal(boss.cm_active,false);assert.equal(boss.cm_cutter,0);assert.equal(p.mm5_victory_locked,true);assert.equal(p.buster_charge,0);assert.equal(p.mm5_hurt_left,0);assert.equal(p.fall_speed,-4);assert.equal(p.y,850);
assert.deepEqual([chargeStops,bossStops,shotCleanups,sounds],[1,1,1,1]);
for(let n=0;n<100;n++){assert.equal(handoff(s),false);assert.equal(hit(h),false);}assert.deepEqual([chargeStops,bossStops,shotCleanups,sounds],[1,1,1,1]);
console.log('PASS:actual lethal-hit -> once-only phase1/player lock/charge stop/boss owner disposal/shot cleanup; airborne momentum preserved;100 repeated handoffs rejected.');
// Run actual central End Frame: both already-latched and same-frame lethal shot
// must exit BEFORE hazard/contact/pickup/spawn code, not merely disable boss AI.
const endSource=read('Combat/Scripts/scr_mm5_combat_end_frame.gml'),end=compile(endSource.replace(/\bexit\s*;/g,'return;'));
for(const alreadyBusy of [true,false]){
 let busy=alreadyBusy,shotUpdates=0,late=0;
 const q={combat_begin_done:true,combat_dead:false,combat_refilling:false,combat_route_was_busy:false,combat_tick:1,obj_mm5_megaman:1,obj_mm1_blader:2,instance_find:()=>p,instance_exists:()=>true,instance_number:()=>0};
 for(const name of [...endSource.matchAll(/\b(scr_\w+)\s*\(/g)].map(m=>m[1]))q[name]=()=>{};
 q.scr_mm1_cutman_route_busy=()=>false;q.scr_mm1_cutman_victory_busy=()=>busy;
 q.scr_mm1_cutman_spike_contact=()=>{late++;return false};
 q.obj_mm5_buster_shot={scr_mm5_combat_shot_step:()=>{shotUpdates++;busy=true}};
 end(q);assert.equal(q.combat_begin_done,false);assert.equal(late,0);assert.equal(shotUpdates,alreadyBusy?0:1);
}
console.log('PASS:actual central End Frame suppresses late hazards/spawns on both pre-existing victory and same-frame final shot.');
