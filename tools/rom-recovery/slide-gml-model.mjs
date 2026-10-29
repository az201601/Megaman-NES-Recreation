// Execute the JS-compatible GML subset of the actual slide scripts with mocked
// GMS collision/input/drawing APIs. NOT a GMS compiler/runtime substitute.
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const base=new URL('../../Assets/Mega Man/MM5/Controller/',import.meta.url);
const source=fs.readFileSync(new URL('scr_mm5_player_slide_step.gml',base),'utf8');
const clearance=fs.readFileSync(new URL('Collision/scr_mm5_player_can_stand.gml',base),'utf8');
const run=new Function('env','with(env){'+source+'}');
const stand=new Function('env','argument0','argument1','with(env){'+clearance+'}');
const noone=-4;
const floor={l:0,r:255,t:192,b:239,type:'solid'};
function world(solids=[floor]){
 const env={x:48,y:180,feet_offset:12,head_offset:10,grounded:true,fall_speed:0,fall_gravity:.25,fall_speed_max:7,
  slide_overhang_fall:false,sliding:false,slide_speed:2.5,slide_duration:26,slide_timer:0,slide_direction:1,
  image_xscale:1,image_speed:0,image_index:0,sprite_index:'idle',
  walk_pause:0,walk_previous_input:0,anim_walk_frame:0,anim_walk_timer:0,
  vk_down:'down',vk_up:'up',vk_left:'left',vk_right:'right',vk_space:'space',
  obj_mm5_slide_dust:'dust',dustInstances:[],obj_stage_solid:'solid',obj_stage_ladder_top:'top',spr_mm5_megaman_idle:'idle',
  spr_mm5_megaman_air:'air',spr_mm5_megaman_slide:'slide',snd_mm5_megaman_land:'land',
  noone,floor:Math.floor,min:Math.min,max:Math.max,sign:Math.sign,
  keys:[],fresh:[],sounds:[],
  instance_exists:obj=>obj==='dust'&&env.dustInstances.length>0,
  instance_create:(x,y,obj)=>{assert.equal(obj,'dust');const d={x,y};env.dustInstances.push(d);return d;},
  keyboard_check:k=>env.keys.includes(k)?1:0,
  keyboard_check_pressed:k=>env.fresh.includes(k)?1:0,
  collision_rectangle:(l,t,r,b,type)=>solids.find(s=>s.type===type&&l<=s.r&&r>=s.l&&t<=s.b&&b>=s.t)||noone,
  collision_point:(x,y,type)=>solids.find(s=>s.type===type&&x>=s.l&&x<=s.r&&y>=s.t&&y<=s.b)||noone,
  audio_play_sound:s=>env.sounds.push(s),
 };
 // Real GMS instances expose bbox properties; preserve rectangle bounds too.
 solids.forEach(s=>Object.assign(s,{bbox_top:s.t,bbox_bottom:s.b,bbox_left:s.l,bbox_right:s.r}));
 env.scr_mm5_player_can_stand=(x,y)=>stand(env,x,y);
 return env;
}
function tick(e,keys=[],fresh=[]){e.keys=keys;e.fresh=fresh;return run(e);}
const e=world();assert.equal(tick(e),false);assert.equal(tick(e,['down'],[]),false);
assert.equal(tick(e,['down','space'],['space']),true);assert.equal(e.x,50.5);assert.equal(e.slide_timer,25);
for(let i=1;i<26;i++)tick(e);
assert.equal(e.x,113);assert.equal(e.sliding,false);assert.equal(e.sprite_index,'idle');assert.equal(e.y,180);
const held=world();tick(held,['down','space'],['space']);for(let i=1;i<26;i++)tick(held,['down','space']);assert.equal(tick(held,['down','space']),false);
const rev=world();tick(rev,['down','space'],['space']);const rx=rev.x;tick(rev,['left']);assert.equal(rev.x,rx-2.5);assert.equal(rev.sliding,false);
const jump=world();tick(jump,['down','space'],['space']);assert.equal(tick(jump,['space'],['space']),false);assert.equal(jump.sliding,false);assert.equal(jump.grounded,true);
const roof={l:96,r:159,t:160,b:175,type:'solid'};
const tunnel=world([floor,roof]);tick(tunnel,['down','space'],['space']);for(let i=1;i<26;i++)tick(tunnel);
assert.equal(tunnel.sliding,true);assert.equal(tunnel.slide_timer,0);assert.equal(tunnel.scr_mm5_player_can_stand(tunnel.x,tunnel.y),false);
const tx=tunnel.x;tick(tunnel,['space'],['space']);assert.equal(tunnel.sliding,true);assert.equal(tunnel.x,tx+2.5);
for(let i=0;i<30&&tunnel.sliding;i++)tick(tunnel);assert.equal(tunnel.sliding,false);assert.ok(tunnel.x>=167);
const wall=world([floor,{l:96,r:111,t:128,b:191,type:'solid'}]);tick(wall,['down','space'],['space']);for(let i=0;i<26&&wall.sliding;i++)tick(wall);assert.equal(wall.sliding,false);assert.ok(wall.x+14<97);
const ledge=world([{...floor,r:119}]);ledge.x=80;tick(ledge,['down','space'],['space']);for(let i=0;i<26&&ledge.sliding;i++)tick(ledge);assert.equal(ledge.grounded,false);assert.equal(ledge.sliding,false);assert.equal(ledge.sprite_index,'air');assert.equal(ledge.fall_speed,1);
const blocked=world([floor,{l:34,r:62,t:177,b:177,type:'solid'}]);assert.equal(tick(blocked,['down','space'],['space']),false);assert.equal(blocked.sliding,false);
const markers=world([{l:0,r:255,t:192,b:192,type:'top'}]);tick(markers,['down','space'],['space']);for(let i=1;i<26;i++)tick(markers);assert.equal(markers.x,113);assert.equal(markers.grounded,true);
console.log('Slide script model passed: 26 moves/65px, no held repeat, reversal, jump handoff, tunnel hold/clearance, wall, ledge, blocked entry and one-way support. GMS runtime validation pending.');

// Exact temporary in-room tunnel fixture: player16,180, roof48..79 at160..175.
const shortRoof={l:48,r:79,t:160,b:175,type:'solid'};
const roomTunnel=world([floor,shortRoof,{l:128,r:159,t:160,b:191,type:'solid'}]);roomTunnel.x=16;
tick(roomTunnel,['down','space'],['space']);for(let i=1;i<26;i++)tick(roomTunnel);
assert.equal(roomTunnel.x,81);assert.equal(roomTunnel.sliding,true);assert.equal(roomTunnel.slide_timer,0);
let extra=0;while(roomTunnel.sliding&&extra<10){tick(roomTunnel);extra++;}
assert.equal(extra,3);assert.equal(roomTunnel.x,88.5);assert.equal(roomTunnel.grounded,true);assert.equal(roomTunnel.y,180);
const reverseTunnel=world([floor,shortRoof]);reverseTunnel.x=16;tick(reverseTunnel,['down','space'],['space']);
for(let i=1;i<18;i++)tick(reverseTunnel);
assert.equal(reverseTunnel.x,61);
tick(reverseTunnel,['space'],['space']);assert.equal(reverseTunnel.sliding,true);
tick(reverseTunnel,['left']);assert.equal(reverseTunnel.sliding,true);
for(let i=0;i<30&&reverseTunnel.sliding;i++)tick(reverseTunnel,['left']);
assert.equal(reverseTunnel.sliding,false);assert.ok(reverseTunnel.x<41);
console.log('Temporary low-tunnel model passed: timer expiry at81 stays sliding, exit at88.5 stands safely; jump denied/reversal retreats under roof. Local GMS test pending.');

// Exact open-ledge room fixture: raised platform16..79 at160..175, floor192.
const platform={l:16,r:79,t:160,b:175,type:'solid'};
const raisedLedge=world([floor,platform]);raisedLedge.x=32;raisedLedge.y=148;
tick(raisedLedge,['down','space'],['space']);
let raisedMoves=1;
while(raisedLedge.sliding&&raisedMoves<30){tick(raisedLedge);raisedMoves++;}
assert.equal(raisedMoves,25);assert.equal(raisedLedge.x,94.5);
assert.equal(raisedLedge.y,148);assert.equal(raisedLedge.sliding,false);
assert.equal(raisedLedge.grounded,false);assert.equal(raisedLedge.fall_speed,1);
assert.equal(raisedLedge.sprite_index,'air');
// Normal physics, not this slide-only model, must validate the later landing.
console.log('Raised open-ledge fixture passed: loses support on move25 at94.5,148, hands off to air/fall1. Subsequent normal landing needs local runtime validation.');

// Integrate the actual ordinary-physics tail and both wall scripts, not just slide.
const load=(name)=>fs.readFileSync(new URL(name,base),'utf8');
const blockedRun=new Function('env','argument0','argument1','argument2','with(env){'+load('Collision/scr_mm5_player_wall_blocked.gml')+'}');
const limitRun=new Function('env','argument0','argument1','argument2','with(env){'+load('Collision/scr_mm5_player_wall_limit.gml')+'}');
const supportRun=new Function('env','argument0','argument1','with(env){'+load('Collision/scr_mm5_player_supported.gml')+'}');
const stepTail=load('obj_mm5_megaman_step.gml').split('// MM5 player checkpoint:')[1];
assert.ok(stepTail);
const normalRun=new Function('env','with(env){ // MM5 player checkpoint:'+stepTail.replace(/\bexit;/g,'return;').replace(/\bmod\b/g,'%')+'}');
function integrate(e){
 Object.assign(e,{walk_speed:1.296875,jump_speed:5,abs:Math.abs,spr_mm5_megaman_walk:'walk',obj_stage_ladder:'ladder',ladder_candidate:noone,ladder_top_candidate:noone});
 e.scr_mm5_player_slide_step=()=>run(e);
 e.scr_mm5_player_wall_blocked=(x,y,d)=>blockedRun(e,x,y,d);
 e.scr_mm5_player_wall_limit=(x,y,d)=>limitRun(e,x,y,d);
 e.scr_mm5_player_supported=(x,y)=>supportRun(e,x,y);
 return e;
}
const overhang={l:48,r:111,t:128,b:143,type:'solid'};
for(const input of [[],['right'],['left']]){
 const combo=integrate(world([floor,platform,overhang]));combo.x=32;combo.y=148;
 tick(combo,['down','space'],['space']);for(let i=1;i<25;i++)tick(combo);
 assert.equal(combo.sliding,false);assert.equal(combo.sprite_index,'air');assert.equal(combo.slide_overhang_fall,true);assert.equal(combo.y,148);
 combo.keys=input;combo.fresh=[];
 let cleared=false;
 for(let t=0;t<60&&!combo.grounded;t++){
  const oldX=combo.x;normalRun(combo);
  assert.ok(Math.abs(combo.x-oldX)<=1.296875+1e-10,'No global-bbox ejection after overlap');
  assert.equal(combo.sliding,false);
  if(!combo.slide_overhang_fall)cleared=true;
 }
 assert.ok(cleared);assert.equal(combo.grounded,true);assert.equal(combo.y,180);
 assert.equal(combo.slide_overhang_fall,false);assert.deepEqual(combo.sounds,['land']);
}
// Grace is narrow: normal collision unchanged when off; middle/feet remain solid.
const contact=integrate(world([floor,overhang]));contact.x=94.5;contact.y=148;contact.grounded=false;contact.fall_speed=1;
assert.equal(blockedRun(contact,95.5,148,1),true);
contact.slide_overhang_fall=true;assert.equal(blockedRun(contact,95.5,148,1),false);
assert.equal(limitRun(contact,95.5,148,1),95.5);
contact.grounded=true;assert.equal(blockedRun(contact,95.5,148,1),true);
contact.grounded=false;contact.fall_speed=-1;assert.equal(blockedRun(contact,95.5,148,1),true);
const side=integrate(world([floor,overhang,{l:103,r:118,t:144,b:191,type:'solid'}]));
side.x=94.5;side.y=148;side.grounded=false;side.fall_speed=1;side.slide_overhang_fall=true;
assert.equal(blockedRun(side,95.5,148,1),true);assert.equal(limitRun(side,95.5,148,1),95);
const freshRoof=integrate(world([floor,{l:103,r:118,t:128,b:143,type:'solid'}]));
freshRoof.x=94;freshRoof.y=148;freshRoof.grounded=false;freshRoof.fall_speed=1;freshRoof.slide_overhang_fall=true;
assert.equal(blockedRun(freshRoof,95,148,1),true,'New overhead contact must still block');
console.log('Combined slide/normal-physics tests passed: immediate air, neutral/left/right descent without sideways ejection, grace clears, one landing sound; side walls/new upper contacts still block.');

// Disabled grace must preserve both old wall helpers across a geometry grid.
const oldBlocked=new Function('env','argument0','argument1','argument2','with(env){'+execFileSync('git',['show','ea24baa:Assets/Mega Man/MM5/Controller/Collision/scr_mm5_player_wall_blocked.gml'],{encoding:'utf8'})+'}');
const oldLimit=new Function('env','argument0','argument1','argument2','with(env){'+execFileSync('git',['show','ea24baa:Assets/Mega Man/MM5/Controller/Collision/scr_mm5_player_wall_limit.gml'],{encoding:'utf8'})+'}');
const unchanged=integrate(world([floor,platform,overhang,{l:128,r:159,t:160,b:191,type:'solid'}]));
for(let xx=8;xx<=180;xx+=2.5)for(let yy=120;yy<=190;yy+=3.25)for(const d of [-1,1]){
 unchanged.x=xx;unchanged.y=yy;
 const nx=xx+d;
 assert.equal(blockedRun(unchanged,nx,yy,d),oldBlocked(unchanged,nx,yy,d));
 assert.equal(limitRun(unchanged,nx,yy,d),oldLimit(unchanged,nx,yy,d));
}
console.log('Disabled-grace regression grid passed: normal wall block/resolve results identical to pre-change helpers.');

// Dust entry hook and actual one-shot object event snippets.
const dustCase=world();tick(dustCase,['down','space'],['space']);
assert.deepEqual(dustCase.dustInstances,[{x:36,y:187}]);
tick(dustCase,['left']);assert.equal(dustCase.sliding,false);
tick(dustCase,['down','space','right'],['space']);
assert.equal(dustCase.dustInstances.length,1,'Quick re-slide must not duplicate/reset active puff');
const dustBase=new URL('../Sliding/Dust/',base);
const dustCreate=new Function('env','with(env){'+fs.readFileSync(new URL('obj_mm5_slide_dust_create.gml',dustBase),'utf8')+'}');
const dustStep=new Function('env','with(env){'+fs.readFileSync(new URL('obj_mm5_slide_dust_step.gml',dustBase),'utf8').replace(/\bexit;/g,'return;')+'}');
const d={x:36,y:187,dust_age:0,image_speed:1,image_index:0,image_xscale:-1,image_yscale:1,depth:0,floor:Math.floor,dead:false};
d.instance_destroy=()=>{d.dead=true;dustCase.dustInstances.length=0;};dustCreate(d);
assert.equal(d.image_speed,0);assert.equal(d.image_xscale,1);assert.equal(d.depth,-9);
const frames=[];
for(let age=0;age<27;age++){assert.equal(d.dead,false);frames.push(d.image_index);dustStep(d);assert.equal(d.x,36);assert.equal(d.y,187);}
assert.deepEqual(frames,Array.from({length:27},(_,i)=>Math.floor(i/9)));assert.equal(d.dead,true);
tick(dustCase,['left']);assert.equal(dustCase.sliding,false);
tick(dustCase,['down','space','right'],['space']);assert.equal(dustCase.dustInstances.length,1,'New puff permitted after expiry');
assert.equal(blocked.dustInstances.length,0,'Blocked entry must not produce dust');
assert.equal(e.dustInstances.length,1,'Normal slide emits once, not every update');
assert.deepEqual(dustCase.sounds,[]);
console.log('Dust GML tests passed: successful-entry placement, no blocked/continuous/duplicate spawn, stationary 3x9 one-shot, expiry/re-spawn, fixed facing, no added sound.');
