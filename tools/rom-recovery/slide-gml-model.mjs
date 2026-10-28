// Execute the JS-compatible GML subset of the actual slide scripts with mocked
// GMS collision/input/drawing APIs. NOT a GMS compiler/runtime substitute.
import fs from 'node:fs';
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
  sliding:false,slide_speed:2.5,slide_duration:26,slide_timer:0,slide_direction:1,
  image_xscale:1,image_speed:0,image_index:0,sprite_index:'idle',
  walk_pause:0,walk_previous_input:0,anim_walk_frame:0,anim_walk_timer:0,
  vk_down:'down',vk_up:'up',vk_left:'left',vk_right:'right',vk_space:'space',
  obj_stage_solid:'solid',obj_stage_ladder_top:'top',spr_mm5_megaman_idle:'idle',
  spr_mm5_megaman_air:'air',spr_mm5_megaman_slide:'slide',snd_mm5_megaman_land:'land',
  noone,floor:Math.floor,min:Math.min,max:Math.max,sign:Math.sign,
  keys:[],fresh:[],sounds:[],
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
