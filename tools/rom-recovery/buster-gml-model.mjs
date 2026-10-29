// Actual GML-subset execution with mocked GMS APIs; NOT a GMS1.4 runtime test.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const base=new URL('../../Assets/Mega Man/MM5/Buster/',import.meta.url);
const compile=name=>new Function('env','with(env){'+fs.readFileSync(new URL(name,base),'utf8')+'}');
const create=compile('obj_mm5_buster_shot_create.gml');
const step=compile('obj_mm5_buster_shot_end_step.gml');
function spawn(x,y,dir,view=false,left=0,width=256){
 const e={x,y,shot_direction:0,shot_speed:0,speed:0,gravity:0,image_speed:0,image_index:0,image_xscale:0,image_yscale:0,depth:0,
  room_width:256,view_enabled:view,view_visible:[true],view_xview:[left],view_wview:[width],dead:false};
 e.instance_destroy=()=>{e.dead=true;};create(e);e.shot_direction=dir;return e;
}
for(const dir of [1,-1]){
 const e=spawn(dir===1?144:113,179,dir);assert.equal(e.shot_speed,1075/256);assert.equal(e.speed,0);assert.equal(e.gravity,0);
 for(let t=1;t<=27;t++){
  step(e);assert.equal(e.x,(dir===1?144:113)+dir*t*1075/256);assert.equal(e.y,179);
  assert.equal(e.image_xscale,dir);assert.equal(e.dead,t===27);
 }
}
const offset=spawn(400+144,179,1,true,400);
for(let t=1;t<=27;t++){step(offset);assert.equal(offset.dead,t===27);}
const wide=spawn(250,179,1,true,0,512);step(wide);step(wide);assert.equal(wide.dead,false);
const hidden=spawn(250,179,1,true,0,512);hidden.view_visible[0]=false;step(hidden);step(hidden);assert.equal(hidden.dead,true);
const still=spawn(144,179,1);assert.equal(still.x,144,'Create must not move: one later End Step owns movement');
console.log('Buster object model passed: exact fractional motion both ways, no gravity/double built-in movement, stationaryY, direction, static ROM trace lifetime27, translated/wider/hidden view fallback. GMS runtime validation pending.');

// Execute actual player hook/helper/Draw sources, leaving movement to the accepted controller.
const init=compile('obj_mm5_megaman_create_buster_append.gml');
const begin=compile('obj_mm5_megaman_step_buster_prefix.gml');
const fire=compile('scr_mm5_player_try_buster.gml');
const ladderHook=compile('obj_mm5_megaman_ladder_buster_insert.gml');
const draw=compile('obj_mm5_megaman_draw_buster_replace.gml');
function player(){
 const p={x:128,y:180.5,sliding:false,on_ladder:false,ladder_instance:{bbox_top:100},ladder_vertical_input:0,
 buster_fire_key:0,buster_pose_timer:0,buster_slide_at_start:false,anim_walk_frame:0,anim_walk_timer:0,
 image_xscale:1,image_yscale:1,image_angle:0,image_blend:0xffffff,image_alpha:1,image_index:0,
 sprite_index:'idle',obj_mm5_buster_shot:'shot',snd_mm5_buster_shot:'sound',
 spr_mm5_megaman_idle:'idle',spr_mm5_megaman_walk:'walk',spr_mm5_megaman_air:'air',spr_mm5_megaman_climb:'climb',
 spr_mm5_megaman_idle_shoot:'idle-shoot',spr_mm5_megaman_walk_shoot:'walk-shoot',spr_mm5_megaman_air_shoot:'air-shoot',spr_mm5_megaman_climb_shoot:'climb-shoot',
 vk_left:'left',vk_right:'right',keys:[],fresh:false,shots:[],sounds:[],draws:[],
 ord:s=>s.charCodeAt(0),floor:Math.floor,sign:Math.sign};
 p.keyboard_check=k=>p.keys.includes(k)?1:0;
 p.keyboard_check_pressed=k=>k===88&&p.fresh;
 p.instance_number=obj=>{assert.equal(obj,'shot');return p.shots.length;};
 p.instance_create=(x,y,obj)=>{assert.equal(obj,'shot');const b=spawn(x,y,1);p.shots.push(b);return b;};
 p.audio_play_sound=(s,priority,loop)=>{assert.equal(s,'sound');assert.equal(priority,1);assert.equal(loop,false);p.sounds.push(s);};
 p.draw_sprite_ext=(...args)=>p.draws.push(args);
 p.scr_mm5_player_try_buster=()=>fire(p);
 init(p);assert.equal(p.buster_fire_key,88);return p;
}
function tickPlayer(p,fresh=false){
 p.fresh=fresh;begin(p);fire(p);
 for(const b of p.shots)step(b);p.shots=p.shots.filter(b=>!b.dead);
 draw(p);
}
const tap=player();
for(let t=1;t<=40;t++){
 tickPlayer(tap,t===1);assert.equal(tap.buster_pose_timer,Math.max(0,17-t));
 assert.equal(tap.draws.at(-1)[0],t<=16?'idle-shoot':'idle');
}
assert.equal(tap.sounds.length,1);
const rapid=player(),birthTicks=[];
for(let t=1;t<=35;t++){
 const count=rapid.sounds.length;tickPlayer(rapid,t%2===1);
 if(rapid.sounds.length>count)birthTicks.push(t);
 assert.ok(rapid.shots.length<=3);
 if(t===7)assert.equal(rapid.buster_pose_timer,14);
}
assert.deepEqual(birthTicks.slice(0,4),[1,3,5,29]);
const left=player();left.image_xscale=-1;tickPlayer(left,true);
assert.equal(left.shots[0].x,113-1075/256);assert.equal(left.shots[0].y,179);
left.image_xscale=1;tickPlayer(left);assert.equal(left.shots[0].shot_direction,-1);
const moved=player();moved.x+=1.296875;moved.y=158;moved.sprite_index='air';tickPlayer(moved,true);
assert.equal(moved.shots[0].x,145+1075/256);assert.equal(moved.shots[0].y,157);
assert.equal(moved.draws.at(-1)[0],'air-shoot');assert.equal(moved.sprite_index,'air','Draw must not change collision sprite');
const walker=player();walker.sprite_index='walk';walker.image_index=2;tickPlayer(walker,true);
assert.equal(walker.draws.at(-1)[0],'walk-shoot');assert.equal(walker.draws.at(-1)[1],2);
const slide=player();slide.sliding=true;tickPlayer(slide,true);assert.equal(slide.shots.length,0);assert.equal(slide.sounds.length,0);assert.equal(slide.draws.at(-1)[3],182.5);
const endingSlide=player();endingSlide.sliding=true;begin(endingSlide);endingSlide.sliding=false;endingSlide.fresh=true;
assert.equal(fire(endingSlide),false);
const ladder=player();ladder.on_ladder=true;ladder.sprite_index='climb';ladder.y=140;ladder.keys=['left'];
for(let t=1;t<=17;t++){
 begin(ladder);ladder.fresh=t===1;ladder.ladder_vertical_input=-1;
 ladderHook(ladder);ladder.y+=ladder.ladder_vertical_input*1.296875;draw(ladder);
 assert.equal(ladder.y,t<=16?140:140-1.296875);
 if(t<=16)assert.equal(ladder.draws.at(-1)[0],'climb-shoot');
}
assert.equal(ladder.shots.length,1);assert.equal(ladder.shots[0].shot_direction,-1);assert.equal(ladder.sounds.length,1);
const lip=player();lip.on_ladder=true;lip.y=90;lip.fresh=true;assert.equal(fire(lip),false);assert.equal(lip.sounds.length,0);
console.log('Player firing hooks passed: freshX, exact birth coordinates, one sound/emission, timer16/not cooldown, three-shot blocked refresh/reuse29, retained direction, post-movement spawn, draw-only poses/no mask changes, slide gate, continuous-ladder pause16/resume and lip guard. GMS runtime validation pending.');
// Exercise the real combined Step's attached-ladder path, including its early exit.
const stepSource=fs.readFileSync(new URL('../../Assets/Mega Man/MM5/Controller/obj_mm5_megaman_step.gml',import.meta.url),'utf8');
const fullStep=new Function('env','with(env){'+stepSource.replace(/\bmod\b/g,'%').replace(/\bexit\s*;/g,'return;')+'}');
const integrated=player();Object.assign(integrated,{
 on_ladder:true,x:128,y:140,fall_speed:0,grounded:false,walk_pause:0,walk_previous_input:0,
 anim_climb_frame:0,anim_climb_timer:0,ladder_moving:false,feet_offset:12,head_offset:10,ladder_speed:1.296875,
 ladder_instance:{bbox_left:120,bbox_right:135,bbox_top:100,bbox_bottom:220},
 vk_up:'up',vk_down:'down',vk_space:'space',noone:-4,
 obj_stage_ladder:'ladder',obj_stage_ladder_top:'top',obj_stage_solid:'solid',spr_mm5_megaman_ladder_top:'lip',
 ladder_candidate:-4,ladder_top_candidate:-4,min:Math.min,max:Math.max,
 instance_exists:()=>true,collision_point:()=>-4,keys:['up'],
});
for(let t=1;t<=17;t++){
 integrated.fresh=t===1;fullStep(integrated);draw(integrated);
 assert.equal(integrated.y,t<=16?140:140-1.296875);
 assert.equal(integrated.on_ladder,true);
}
assert.equal(integrated.sounds.length,1);assert.equal(integrated.shots.length,1);
assert.equal((stepSource.match(/scr_mm5_player_try_buster\(\);/g)||[]).length,2);
console.log('Combined actual player Step passed continuous-ladder pause16, resume17, one emission and attached early exit; GMS runtime validation pending.');
const normal=player();Object.assign(normal,{
 fall_speed:0,grounded:true,walk_pause:0,walk_previous_input:0,walk_speed:1.296875,
 jump_speed:5,fall_gravity:.25,fall_speed_max:7,feet_offset:12,head_offset:10,slide_overhang_fall:false,
 vk_up:'up',vk_down:'down',vk_space:'space',noone:-4,
 obj_stage_ladder:'ladder',obj_stage_ladder_top:'top',obj_stage_solid:'solid',
 ladder_candidate:-4,ladder_top_candidate:-4,min:Math.min,max:Math.max,abs:Math.abs,
 scr_mm5_player_supported:()=>true,scr_mm5_player_slide_step:()=>false,
 scr_mm5_player_can_stand:()=>true,scr_mm5_player_wall_blocked:()=>false,
 collision_point:()=>-4,
});
for(let t=1;t<=35;t++){
 normal.fresh=t%2===1;fullStep(normal);
 for(const b of normal.shots)step(b);normal.shots=normal.shots.filter(b=>!b.dead);
 draw(normal);assert.ok(normal.shots.length<=3);assert.equal(normal.x,128);assert.equal(normal.y,180.5);
 if(t===7)assert.equal(normal.buster_pose_timer,14);
 if(t===27)assert.equal(normal.sounds.length,3);
 if(t===29)assert.equal(normal.sounds.length,4);
}
console.log('Combined actual normal player Step passed standing rapid-X limit/blocked refresh/reuse, unchangedXY and one firing call per update.');
