// Actual GML-subset model vs independent ROM traces. NOT GMS runtime certification.
import fs from 'node:fs';import assert from 'node:assert/strict';
const base=new URL('../../Assets/Mega Man/MM5/Buster/',import.meta.url);
const compile=name=>new Function('env','with(env){'+fs.readFileSync(new URL(name,base),'utf8').replace(/\bmod\b/g,'%')+'}');
const fire=compile('Charging/Controller/scr_mm5_player_try_buster.gml'),colour=compile('Charging/Controller/scr_mm5_player_charge_colour.gml'),draw=compile('Charging/Controller/obj_mm5_megaman_draw_charge_replace.gml');
const prefix=compile('obj_mm5_megaman_step_buster_prefix.gml'),init=compile('obj_mm5_megaman_create_buster_append.gml'),chargeInit=compile('Charging/Controller/obj_mm5_megaman_create_charge_append.gml');
const parentCreate=compile('obj_mm5_buster_shot_create.gml'),parentStep=compile('obj_mm5_buster_shot_end_step.gml');
const childStep=compile('Charging/Objects/obj_mm5_charged_buster_end_step.gml');
const childCreate={mid:compile('Charging/Objects/obj_mm5_buster_mid_create.gml'),full:compile('Charging/Objects/obj_mm5_buster_full_create.gml')};
function player(left=false){
 const p={x:128,y:180.5,sliding:false,buster_slide_at_start:false,on_ladder:false,ladder_instance:{bbox_top:0},
 buster_charge:0,buster_fire_key:0,buster_pose_timer:0,anim_walk_frame:0,anim_walk_timer:0,
 image_xscale:left?-1:1,image_yscale:1,image_index:0,image_angle:0,image_blend:0xffffff,image_alpha:1,sprite_index:'idle',
 obj_mm5_buster_shot:'basic',obj_mm5_buster_mid:'mid',obj_mm5_buster_full:'full',
 snd_mm5_buster_shot:26,snd_mm5_buster_mid:32,snd_mm5_buster_full:33,vk_left:'left',vk_right:'right',
 floor:Math.floor,sign:Math.sign,ord:s=>s.charCodeAt(0),held:false,fresh:false,keys:[],shots:[],sounds:[],events:[],draws:[],audioActive:false};
 for(const name of ['idle','walk','air','climb','ladder_top','slide']){
  p['spr_mm5_megaman_'+name]=name;p['spr_mm5_megaman_'+name+'_charge']=name+'-colour';
  if(['idle','walk','air','climb'].includes(name))p['spr_mm5_megaman_'+name+'_shoot_charge']=name+'-shoot-colour';
 }
 p.obj_mm5_charge_audio={scr_mm5_charge_audio_start:()=>{if(!p.audioActive){p.audioActive=true;p.sounds.push(34);p.events.push('start');}},scr_mm5_charge_audio_stop:()=>{p.audioActive=false;p.events.push('stop');}};
 p.keyboard_check_pressed=k=>k===88&&p.fresh;
 p.keyboard_check=k=>k===88?p.held:p.keys.includes(k);
 p.instance_exists=obj=>p.shots.some(s=>s.kind===obj);
 p.instance_number=obj=>{assert.equal(obj,'basic');return p.shots.length;};
 p.instance_create=(x,y,kind)=>{
  const e={kind,x,y,shot_direction:0,shot_speed:0,shot_anim_age:0,shot_anim_frames:0,shot_anim_period:0,speed:0,gravity:0,image_speed:0,image_index:0,image_xscale:0,image_yscale:0,depth:0,sprite_index:'basic',
   spr_mm5_buster_mid:'mid',spr_mm5_buster_full:'full',floor:Math.floor,room_width:256,view_enabled:false,view_visible:[false],view_xview:[0],view_wview:[256],dead:false};
  e.instance_destroy=()=>e.dead=true;e.event_inherited=()=>parentCreate(e);
  if(kind==='basic')parentCreate(e);else childCreate[kind](e);
  e.step=()=>{e.event_inherited=()=>parentStep(e);if(kind==='basic')parentStep(e);else childStep(e);};p.shots.push(e);return e;
 };
 p.audio_play_sound=(sound,priority,loop)=>{assert.equal(p.audioActive,false,'Charge stopped before shot sample');assert.equal(priority,1);assert.equal(loop,false);p.sounds.push(sound);p.events.push('emit'+sound);};
 p.scr_mm5_player_charge_colour=()=>colour(p);p.draw_sprite_ext=(...args)=>p.draws.push(args);
 init(p);chargeInit(p);return p;
}
function tick(p,held,fresh){p.held=held;p.fresh=fresh;prefix(p);const emitted=fire(p);for(const s of p.shots)s.step();p.shots=p.shots.filter(s=>!s.dead);return emitted;}
const traces=JSON.parse(fs.readFileSync(new URL('./.work/charge-values.json',import.meta.url)));
for(const c of traces){
 const p=player(c.left);
 for(const row of c.rows){
  tick(p,row.t<=c.held,row.t===1);
  assert.equal(p.buster_charge,row.charge,'Charge counter '+c.held+'/'+row.t);
  assert.equal(p.buster_pose_timer,row.pose);
  assert.deepEqual([[15,44,17],[5,44,17],[21,44,17],[37,44,17],[44,17,15],[17,15,44]][colour(p)],row.paletteIndices,'Bank agrees with original palette shadow');
  const actual=p.shots.map(s=>[s.x,s.y,s.kind==='basic'?24:s.kind==='mid'?168:169]).sort((a,b)=>a[0]-b[0]);
  const expected=row.shots.map(s=>[s.x,s.y,s.animation]).sort((a,b)=>a[0]-b[0]);
  assert.deepEqual(actual,expected,'Actual projectile source vs ROM '+c.held+'/'+row.t);
 }
 assert.deepEqual(p.sounds,c.sounds.map(s=>s.command));
}
// Occupancy: initialized basic instances atX200, matching controlled ROM cases.
const interactions=JSON.parse(fs.readFileSync(new URL('./.work/charge-interactions.json',import.meta.url)));
for(const c of interactions.filter(c=>c.controlledOccupancy)){
 const p=player();
 for(const row of c.rows){
  if(row.t===c.release){p.shots=[];for(let i=0;i<3;i++)if(c.controlledOccupancy&(1<<i))p.instance_create(200,179,'basic');}
  tick(p,row.t<c.release||c.name==='mid pending repress'&&row.t===56,row.t===1||c.name==='mid pending repress'&&row.t===56);
  assert.equal(p.buster_charge,row.charge,c.name+'/'+row.t);assert.equal(p.buster_pose_timer,row.pose);
  assert.deepEqual(p.shots.map(s=>s.x).sort((a,b)=>a-b),row.shots.map(s=>s.x).sort((a,b)=>a-b));
 }
 if(c.name.startsWith('full occupied'))assert.equal(p.audioActive,true,'Native rejected full retains charge voice');
 assert.deepEqual(p.sounds.filter(s=>s!==34),c.sounds.map(s=>s.command).filter(s=>s!==34));
}
// Draw banks, every current player pose, every charge count: no collision sprite mutation.
for(let c=0;c<=85;c++)for(const pose of ['idle','walk','air','climb','ladder_top','slide'])for(const shooting of [false,true]){
 const p=player();p.buster_charge=c;p.sprite_index=pose;p.sliding=pose==='slide';p.buster_pose_timer=shooting?5:0;p.image_index=pose==='walk'?3:pose==='climb'?1:0;
 draw(p);assert.equal(p.sprite_index,pose);const d=p.draws.at(-1),bank=colour(p);
 const expectedFrame=pose==='slide'||pose==='ladder_top'||pose==='idle'||pose==='air'||shooting&&pose==='climb'?bank:pose==='walk'?bank*4+3:bank*2+1;
 assert.equal(d[1],expectedFrame);assert.equal(d[3],p.y+(pose==='slide'?2:0));
}
const stopped=player();stopped.sliding=true;stopped.buster_charge=48;tick(stopped,false,false);assert.equal(stopped.buster_charge,48);assert.equal(stopped.shots.length,0);
// Counter resumes one update after slide is already gone; release pending then emits.
stopped.sliding=false;tick(stopped,false,false);assert.equal(stopped.shots[0].kind,'mid');assert.equal(stopped.buster_charge,0);
const ladder=player();ladder.on_ladder=true;ladder.y=140;ladder.keys=['left'];ladder.buster_charge=80;tick(ladder,false,false);
assert.equal(ladder.shots[0].kind,'full');assert.equal(ladder.shots[0].shot_direction,-1);assert.equal(ladder.buster_pose_timer,16);
console.log('Charge controller actual-source model passed33 standing traces,9 occupancy cases, full/medium gating, retained-charge re-press, audio ordering, all colour banks/pose mappings and slide/ladder release. Real GMS runtime pending.');
const repress=JSON.parse(fs.readFileSync(new URL('./.work/charge-repress.json',import.meta.url)));
for(const c of repress){
 const p=player();for(const row of c.rows){
  if(c.pending&&row.t===c.held+3)p.buster_charge=40;
  tick(p,row.t<=c.held||row.t===c.held+2,row.t===1||row.t===c.held+2);
  assert.equal(p.buster_charge,row.charge);assert.equal(p.buster_pose_timer,row.pose);
  assert.deepEqual(p.shots.map(s=>s.x).sort((a,b)=>a-b),row.shots.map(s=>s.x).sort((a,b)=>a-b));
 }
 assert.deepEqual(p.sounds,c.sounds.map(s=>s.command));
}
// Replay native movement references into new helper. Does not pretend GMS rectangles=NES terrain.
for(const c of interactions.filter(c=>!c.controlledOccupancy)){
 const p=player();let previousState=c.controlledLadder?3:0,heldBefore=false;
 const start=c.controlledLadder?3:c.name==='start hold during slide'?5:1;
 for(const row of c.rows.filter(r=>r.t<=c.release+1)){
  p.held=row.t>=start&&row.t<c.release;p.fresh=p.held&&!heldBefore;heldBefore=p.held;
  p.sliding=previousState===2;prefix(p);p.sliding=row.state===2;p.on_ladder=row.state===3;p.x=row.x;p.y=row.y;
  fire(p);for(const s of p.shots)s.step();p.shots=p.shots.filter(s=>!s.dead);
  assert.equal(p.buster_charge,row.charge,c.name+'/'+row.t);assert.equal(p.buster_pose_timer,row.pose);
  previousState=row.state;
 }
 assert.deepEqual(p.sounds,c.sounds.filter(s=>s.t<=c.release+1).map(s=>s.command));
}
// Actual combined GML Step attached-ladder path with NEW helper (no movement replacement).
const fullSource=fs.readFileSync(new URL('../Controller/obj_mm5_megaman_step.gml',base),'utf8');
const fullStep=new Function('env','with(env){'+fullSource.replace(/\bmod\b/g,'%').replace(/\bexit\s*;/g,'return;')+'}');
const integrated=player();Object.assign(integrated,{
 on_ladder:true,x:136,y:140,fall_speed:0,grounded:false,walk_pause:0,walk_previous_input:0,
 anim_climb_frame:0,anim_climb_timer:0,ladder_moving:false,feet_offset:12,head_offset:10,ladder_speed:1.296875,
 ladder_instance:{bbox_left:128,bbox_right:143,bbox_top:-200,bbox_bottom:500},
 vk_up:'up',vk_down:'down',vk_space:'space',noone:-4,obj_stage_ladder:'ladder',obj_stage_ladder_top:'top',obj_stage_solid:'solid',
 ladder_candidate:-4,ladder_top_candidate:-4,min:Math.min,max:Math.max,collision_point:()=>-4,keys:['up'],
});
integrated.instance_exists=obj=>typeof obj==='object'||obj===integrated.ladder_instance||integrated.shots.some(s=>s.kind===obj);
integrated.scr_mm5_player_try_buster=()=>fire(integrated);
let beforeRelease;
for(let t=1;t<=101;t++){
 integrated.held=t>=3&&t<84;integrated.fresh=t===3;
 if(t===84)beforeRelease=integrated.y;
 fullStep(integrated);for(const s of integrated.shots)s.step();integrated.shots=integrated.shots.filter(s=>!s.dead);
 if(t>=84&&t<100)assert.equal(integrated.y,beforeRelease);
 if(t===100)assert.equal(integrated.y,beforeRelease-1.296875);
 assert.equal(integrated.on_ladder,true);
}
assert.deepEqual(integrated.sounds,[26,34,33]);
console.log('Also passed4 charged-repress ROM cases,7 movement/slide reference replays and actual combined ladder Step: full release freezes16/resumes17, one emission.');
const normal=player();Object.assign(normal,{
 fall_speed:0,grounded:true,walk_pause:0,walk_previous_input:0,walk_speed:1.296875,jump_speed:5,fall_gravity:.25,fall_speed_max:7,
 feet_offset:12,head_offset:10,slide_overhang_fall:false,vk_up:'up',vk_down:'down',vk_space:'space',noone:-4,
 obj_stage_ladder:'ladder',obj_stage_ladder_top:'top',obj_stage_solid:'solid',ladder_candidate:-4,ladder_top_candidate:-4,
 min:Math.min,max:Math.max,abs:Math.abs,scr_mm5_player_supported:()=>true,scr_mm5_player_slide_step:()=>false,
 scr_mm5_player_can_stand:()=>true,scr_mm5_player_wall_blocked:()=>false,collision_point:()=>-4,
});
normal.scr_mm5_player_try_buster=()=>fire(normal);
const fullTrace=traces.find(c=>c.held===81&&!c.left);
for(const row of fullTrace.rows){
 normal.held=row.t<=81;normal.fresh=row.t===1;fullStep(normal);
 for(const s of normal.shots)s.step();normal.shots=normal.shots.filter(s=>!s.dead);draw(normal);
 assert.equal(normal.buster_charge,row.charge);assert.equal(normal.buster_pose_timer,row.pose);
 assert.equal(normal.x,128);assert.equal(normal.y,180.5);
 assert.deepEqual(normal.shots.map(s=>s.x),row.shots.map(s=>s.x));
}
assert.deepEqual(normal.sounds,[26,34,33]);
console.log('Combined actual normal Step + new helper/Draw also matches full-charge ROM trace with unchanged standingXY.');
