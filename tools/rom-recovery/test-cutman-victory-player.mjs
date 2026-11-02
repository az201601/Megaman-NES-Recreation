// Actual GML with rectangular-terrain fixtures; not GMS collision/runtime acceptance.
import fs from 'node:fs';import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url),base=new URL('Assets/Bosses/MM1/Cut Man/Victory/',root);
const read=p=>fs.readFileSync(new URL(p,base),'utf8');
const compile=s=>new Function('s','with(s){'+s.replace(/\bmod\b/g,'%')+'}');
const begin=compile(read('Scripts/scr_mm1_cutman_victory_player_begin.gml')),moveSource=read('Scripts/scr_mm1_cutman_victory_player_move.gml'),move=compile(moveSource),tick=compile(read('Scripts/scr_mm1_cutman_victory_player_tick.gml'));
// Assert retained source boundaries, rather than only testing a reimplemented approximation.
const baseline=fs.readFileSync(new URL('Assets/Mega Man/MM5/Controller/obj_mm5_megaman_step.gml',root),'utf8');
assert.ok(moveSource.includes(baseline.slice(baseline.indexOf('// VERTICAL MOVEMENT'),baseline.indexOf('    // MM5 release cut'))));
assert.ok(!/keyboard_|try_buster|slide_step/.test(moveSource));
const floor={bbox_top:912,bbox_bottom:943,bbox_left:3072,bbox_right:3327};
const ceiling={bbox_top:720,bbox_bottom:735,bbox_left:3072,bbox_right:3327};
const fields=[...new Set(read('Scripts/scr_mm1_cutman_victory_player_begin.gml').match(/\b(?:mm5_|buster_|anim_|walk_|ladder_)\w+/g))];
function player(){let p={...Object.fromEntries(fields.map(k=>[k,0])),mm5_victory_locked:false,mm5_victory_tick:-1,x:3120,y:900,fall_speed:0,fall_gravity:0.25,fall_speed_max:6,walk_speed:1.5,feet_offset:12,head_offset:12,grounded:true,sliding:false,slide_timer:0,on_ladder:false,image_xscale:1,image_index:0,image_speed:0,sprite_index:0,noone:-1,obj_stage_solid:1,obj_stage_ladder_top:2,spr_mm5_megaman_air:10,spr_mm5_megaman_idle:11,spr_mm5_megaman_walk:12,abs:Math.abs,sign:Math.sign,min:Math.min,max:Math.max,floor:Math.floor,standFits:true};
 p.scr_mm5_player_can_stand=()=>p.standFits;
 p.scr_mm5_player_supported=(x,y)=>y+12>=floor.bbox_top&&y+12<=floor.bbox_top+0.001;
 p.scr_mm5_player_wall_blocked=(x,y,d)=>x<3096||x>3304;
 p.scr_mm5_player_wall_limit=(x,y,d)=>Math.max(3096,Math.min(3304,x));
 p.collision_point=(x,y,obj)=>obj===1?[floor,ceiling].find(b=>x>=b.bbox_left&&x<=b.bbox_right&&y>=b.bbox_top&&y<=b.bbox_bottom)??-1:-1;
 p.scr_mm1_cutman_victory_player_move=dir=>{const old=p.argument0;p.argument0=dir;try{return move(p);}finally{p.argument0=old;}};return p;}
const run=(p,t,dir=0,frozen=false)=>{p.argument0=t;p.argument1=frozen;p.argument2=dir;return tick(p);};
let checks=0;
// Immediate handoff cancels shooting/hurt/ladder without teleporting an airborne player.
{let p=player();Object.assign(p,{y:850,fall_speed:-3,grounded:false,sliding:true,on_ladder:true,buster_charge:80,mm5_hurt_left:20});assert.equal(begin(p),true);assert.equal(p.y,850);assert.equal(p.fall_speed,-3);assert.equal(p.grounded,false);assert.equal(p.buster_charge,0);assert.equal(p.on_ladder,false);assert.equal(p.mm5_hurt_left,0);assert.equal(begin(p),false);checks++;}
for(const vy of [-5,-1,0,2,6]){let p=player();p.y=850;p.fall_speed=vy;p.grounded=false;begin(p);for(let t=0;t<160&&!p.grounded;t++)run(p,t);assert.equal(p.y,900);assert.equal(p.fall_speed,0);assert.equal(p.grounded,true);checks++;}
// Duplicate tick, freeze and unlocked guards cannot move or consume animation.
{let p=player();assert.equal(run(p,0,1),false);begin(p);run(p,1,1);let x=p.x,timer=p.anim_walk_timer;assert.equal(run(p,1,1),false);assert.equal(p.x,x);assert.equal(p.anim_walk_timer,timer);for(let t=2;t<200;t++)assert.equal(run(p,t,1,true),false);assert.equal(p.x,x);checks++;}
// Standing walk startup and collision helpers remain active; no through-wall tween.
for(const dir of [-1,1]){let p=player();begin(p);for(let t=0;t<300;t++)run(p,t,dir);assert.equal(p.x,dir<0?3096:3304);assert.equal(p.y,900);checks++;}
// Ceiling reset follows original MM5 down1 path, not floor snapping.
{let p=player();p.y=749;p.fall_speed=-4;p.grounded=false;begin(p);run(p,0);assert.equal(p.y,748);assert.equal(p.fall_speed,1);checks++;}
// Slide must fit before standing. No forced mask expansion through overhang.
{let p=player();p.sliding=true;p.standFits=false;begin(p);assert.equal(run(p,0,1),false);assert.equal(p.x,3120);assert.equal(p.sliding,true);p.standFits=true;assert.equal(run(p,1,1),true);assert.equal(p.sliding,false);checks++;}
console.log(`PASS:${checks} actual-GML player bridge groups; preserved baseline vertical collision,airborne momentum/landing,ceiling,wall bounds,slide fit,charge/hurt/ladder cancellation,freeze/duplicate clock. Source only, not installed.`);
