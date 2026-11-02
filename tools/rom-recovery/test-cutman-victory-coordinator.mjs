// Actual GML motion bridge with existing normal collision GML and geometry mocks.
import fs from 'node:fs';import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8');
const compile=s=>new Function('s','with(s){'+s.replace(/\bmod\b/g,'%')+'}');
const path='Assets/Bosses/MM1/Cut Man/Victory/Scripts/';
const motion=compile(read(path+'scr_mm1_cutman_victory_player_move.gml'));
const normal='Assets/Mega Man/MM5/Controller/Collision/';
const geometry=[{object:1,bbox_left:3072,bbox_right:3327,bbox_top:912,bbox_bottom:943},{object:1,bbox_left:3072,bbox_right:3087,bbox_top:720,bbox_bottom:911},{object:1,bbox_left:3312,bbox_right:3327,bbox_top:720,bbox_bottom:911}];
let rectangles=geometry;
const make=()=>{const p={x:3120,y:900,feet_offset:12,head_offset:12,fall_speed:0,fall_gravity:0.25,fall_speed_max:12,walk_speed:1.5,walk_pause:0,walk_previous_input:0,grounded:true,sliding:false,slide_overhang_fall:false,slide_timer:0,on_ladder:false,ladder_instance:-1,image_xscale:1,image_speed:0,image_index:0,sprite_index:1,anim_walk_timer:0,anim_walk_frame:0,noone:-1,obj_stage_solid:1,obj_stage_ladder_top:2,spr_mm5_megaman_idle:1,spr_mm5_megaman_walk:2,spr_mm5_megaman_air:3,floor:Math.floor,min:Math.min,max:Math.max,abs:Math.abs,sign:Math.sign};
 p.collision_point=(x,y,o)=>rectangles.find(r=>r.object===o&&x>=r.bbox_left&&x<=r.bbox_right&&y>=r.bbox_top&&y<=r.bbox_bottom)??-1;
 p.collision_rectangle=(x1,y1,x2,y2,o)=>rectangles.find(r=>r.object===o&&x2>=r.bbox_left&&x1<=r.bbox_right&&y2>=r.bbox_top&&y1<=r.bbox_bottom)??-1;
 for(const name of ['supported','can_stand','wall_blocked','wall_limit']){const f=compile(read(normal+'scr_mm5_player_'+name+'.gml'));p['scr_mm5_player_'+name]=(...args)=>{const old=[p.argument0,p.argument1,p.argument2];args.forEach((v,i)=>p['argument'+i]=v);try{return f(p);}finally{old.forEach((v,i)=>p['argument'+i]=v);}};}
 return p;};
// Combined actual phase+motion+player-prefix adapter: fake ONLY defeat-effect ack.
{
 const p=make();p.y=850;p.fall_speed=-4;
 const coreInit=compile(read(path+'scr_mm1_cutman_victory_init.gml'));
 const coreStart=compile(read(path+'scr_mm1_cutman_victory_start.gml'));
 const coreStep=compile(read(path+'scr_mm1_cutman_victory_step.gml'));
 const playerStep=compile(read(path+'scr_mm1_cutman_victory_player_step.gml'));
 const boss={cm_defeat_pending:true,cmv_defeat_done:true,cmv_acquisition_done:false,cmv_teleport_done:false,cmv_screen_done:false,cmv_entry_event:1,cmv_entry_serial:1};
 for(const f of read(path+'scr_mm1_cutman_victory_init.gml').matchAll(/^(cmv_\w+)\s*=/gm))boss[f[1]]=0;
 coreInit(boss);boss.argument0=3200;coreStart(boss);boss.cmv_defeat_done=true;boss.cmv_entry_serial=1;
 boss.scr_mm1_cutman_victory_step=(...a)=>{a.forEach((v,i)=>boss['argument'+i]=v);return coreStep(boss);};
 const owner={combat_tick:0,combat_refilling:false,combat_dead:false};
 Object.assign(p,{mm5_victory_locked:true,mm5_victory_tick:-1,obj_mm1_cutman_boss:10,obj_mm5_combat:11,global:{mm5_pause_active:false},instance_exists:x=>x===boss||x===owner,instance_find:o=>o===10?boss:owner});
 const playerTick=compile(read(path+'scr_mm1_cutman_victory_player_tick.gml'));
 p.scr_mm1_cutman_victory_player_move=dir=>{p.argument0=dir;return motion(p);};
 p.scr_mm1_cutman_victory_player_tick=(tick,frozen,dir)=>{p.argument0=tick;p.argument1=frozen;p.argument2=dir;return playerTick(p);};
 for(let t=1;t<1000&&boss.cmv_phase<6;t++){
  owner.combat_tick=t;p.global.mm5_pause_active=t%20===0;
  const x=p.x,y=p.y,phase=boss.cmv_phase,timer=boss.cmv_timer;
  assert.equal(playerStep(p),true);
  if(p.global.mm5_pause_active){assert.equal(p.x,x);assert.equal(p.y,y);assert.equal(boss.cmv_phase,phase);assert.equal(boss.cmv_timer,timer);}
  const movedX=p.x,movedY=p.y;assert.equal(playerStep(p),true);assert.equal(p.x,movedX);assert.equal(p.y,movedY);
 }
 assert.equal(boss.cmv_phase,6);assert.equal(p.x,3200);assert.equal(p.y,900);assert.equal(boss.cmv_entry_event,4);assert.equal(boss.cmv_entry_serial,4);assert.equal(boss.cmv_reward_requested,false);
 owner.combat_tick++;owner.combat_dead=true;assert.equal(playerStep(p),true);assert.equal(boss.cmv_phase,10);assert.equal(boss.cmv_entry_event,8);
 console.log('PASS:actual player/phase/motion integration to centred acquisition gate;airborne settles,freeze/double-call guards,cancel,no reward. Visual completion deliberately NOT fabricated.');
}
