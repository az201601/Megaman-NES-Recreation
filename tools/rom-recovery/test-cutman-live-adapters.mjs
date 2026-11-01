// Actual-GML actor/world/contact/post-frame under limited engine mocks.
// No GMS compiler/scheduler/GPU or full player/camera/pause instance-deactivation test.
import fs from'node:fs';import assert from'node:assert/strict';import{createHash}from'node:crypto';
const root=new URL('../../',import.meta.url),base=new URL('Assets/Bosses/MM1/Cut Man/Combat/',root),read=p=>fs.readFileSync(new URL(p,base),'utf8');
const compile=s=>new Function('c','with(c){'+s.replace(/\bmod\b/g,'%').replace(/\bexit\s*;/g,'return;')+'}');
const createSource=read('Objects/obj_mm1_cutman_boss_create.gml'),world=compile(read('Scripts/scr_mm1_cutman_boss_world_step.gml')),contact=compile(read('Scripts/scr_mm1_cutman_boss_contact.gml')),post=compile(read('Scripts/scr_mm1_cutman_boss_post_frame.gml')),draw=compile(read('Objects/obj_mm1_cutman_boss_draw.gml'));
const names=['scr_mm1_cutman_boss_face','scr_mm1_cutman_boss_motion','scr_mm1_cutman_boss_decide','scr_mm1_cutman_boss_animate','scr_mm1_cutman_cutter_manage','scr_mm1_cutman_cutter_aim','scr_mm1_cutman_cutter_throw','scr_mm1_cutman_cutter_move','scr_mm1_cutman_animation_header','scr_mm1_cutman_animation_sprite'];
const actor={x:3264,y:900,sprite_index:0,image_index:0,image_speed:0,depth:0,spr_mm1_cutman_boss_entrance:1};
for(const match of createSource.matchAll(/^((?:cm_|cc_|boss_)\w+)\s*=/gm))actor[match[1]]=0;
compile(createSource)(actor);
const nativeHandoff=JSON.parse(fs.readFileSync(new URL('./.work/cutman-boss-entrance/frame-473.json',import.meta.url))).cpu.mem;
for(const[key,address]of [['cm_state',0x3e],['cm_pose',0x401],['cm_anim',0x441],['cm_fire',0x641]])assert.equal(actor[key],nativeHandoff[address],`native handoff ${key}`);
assert.equal(actor.cm_speed_y,nativeHandoff[0x661]|nativeHandoff[0x681]<<8);

const math={floor:Math.floor,abs:Math.abs,min:Math.min,max:Math.max,sign:Math.sign,clamp:(v,a,b)=>Math.max(a,Math.min(b,v))};
Object.assign(actor,math,{noone:-1,obj_stage_solid:1,argument0:0,argument1:0,argument2:0,argument3:0,snd_mm1_cutman_rolling_cutter_throw:37,plays:[],irandom:n=>(seed=(Math.imul(seed,1664525)+1013904223)>>>0)%(n+1)});
let seed=0x714;actor.audio_play_sound=(...a)=>actor.plays.push(a);
const solids=[{bbox_left:3072,bbox_right:3327,bbox_top:912,bbox_bottom:943},{bbox_left:3072,bbox_right:3087,bbox_top:720,bbox_bottom:911},{bbox_left:3312,bbox_right:3327,bbox_top:720,bbox_bottom:911}];
actor.collision_point=(x,y)=>solids.find(b=>x>=b.bbox_left&&x<=b.bbox_right&&y>=b.bbox_top&&y<=b.bbox_bottom)??-1;
for(const name of names){const fn=compile(read('Scripts/'+name+'.gml'));actor[name]=(...args)=>{const old=[actor.argument0,actor.argument1,actor.argument2,actor.argument3];args.forEach((a,i)=>actor['argument'+i]=a);try{return fn(actor)}finally{old.forEach((a,i)=>actor['argument'+i]=a);}};}
const p={exists:true,x:3120,y:900,on_ladder:false,sliding:false,mm5_startup_active:false,health:28,invulnerable:0};
const owner={...math,argument0:p,obj_mm1_cutman_boss:1,combat_tick:1,combat_dead:false,combat_refilling:false,global:{mm5_pause_active:false},instance_exists:v=>v===actor||v===p,instance_find:()=>actor};
owner.scr_mm5_combat_overlap=(x,y,xx,yy,hx,hy)=>Math.abs(Math.floor(x)-Math.floor(xx))<hx&&Math.abs(Math.floor(y)-Math.floor(yy))<hy;
let contacts=0;owner.scr_mm5_combat_damage=(player,damage)=>{if(player.invulnerable||owner.combat_dead||owner.combat_refilling)return false;contacts++;player.health-=damage;player.invulnerable=60;return true};
let checks=0;
world(owner);assert.equal(actor.cm_initialized,false);checks++;
actor.boss_intro_complete=true;actor.boss_visible=true;actor.boss_health=28;world(owner);assert.equal(actor.cm_initialized,true);assert.equal(actor.cm_active,true);checks++;
const serial=()=>JSON.stringify(Object.fromEntries(Object.entries(actor).filter(([k,v])=>(k.startsWith('cm_')||k.startsWith('cc_')||['x','y'].includes(k))&&typeof v!=='function')));
const before=serial();world(owner);assert.equal(serial(),before);checks++;
post(owner);const afterPost=serial();post(owner);assert.equal(serial(),afterPost);checks++;
for(const guard of['combat_dead','combat_refilling','paused','startup']){
 owner.combat_tick++;if(guard==='paused')owner.global.mm5_pause_active=true;else if(guard==='startup')p.mm5_startup_active=true;else owner[guard]=true;
 const old=serial();world(owner);assert.equal(serial(),old);checks++;
 owner.combat_dead=owner.combat_refilling=owner.global.mm5_pause_active=p.mm5_startup_active=false;
}
const naturalStates=new Set();let catches=0;
for(let frame=0;frame<1200;frame++){
 owner.combat_tick++;const wasOut=actor.cm_cutter!==0;world(owner);post(owner);naturalStates.add(actor.cm_state);
 if(wasOut&&actor.cm_cutter===0)catches++;
 const pose=actor.cm_render_pose,frameIndex=actor.cm_animation_frame;
 const table=JSON.parse(fs.readFileSync(new URL('Reference/combat-art.json',base))).animations.find(a=>a.pose===pose&&!a.hurt);
 assert.ok(table,`Mapped runtime pose${pose}`);assert.ok(frameIndex<table.frames.length,`Mapped frame${frameIndex} for pose${pose}`);
}
assert.ok(actor.plays.length>0,'Original decision path must actually throw');assert.ok(catches>0,'Return management must catch live simulated cutters');checks++;
let shotExists=true;const hit=compile(read('Scripts/scr_mm1_cutman_boss_hit.gml'));
const hitContext={argument0:actor,argument1:{object_index:3},obj_mm5_buster_full:3,snd_mm6_enemy_hit:53,max:Math.max,instance_exists:o=>o===actor||(o===hitContext.argument1&&shotExists),instance_destroy:()=>{shotExists=false},audio_play_sound:()=>{}};
let landedHits=0;const states=new Set();
for(let frame=0;frame<2000&&!actor.cm_defeat_pending;frame++){
 owner.combat_tick++;world(owner);states.add(actor.cm_state);
 if(actor.cm_blink===0){shotExists=true;hit(hitContext);landedHits++;assert.equal(shotExists,false);}
 post(owner);assert.ok(actor.cm_draw_sprite>=0&&actor.cm_draw_sprite<34);assert.ok(actor.cc_draw_sprite>=0&&actor.cc_draw_sprite<34);
}
assert.equal(landedHits,10);assert.equal(actor.boss_health,0);assert.equal(actor.cm_defeat_pending,true);assert.equal(actor.cm_cutter,0);checks++;
p.x=actor.x;p.y=actor.y;contact(owner);assert.equal(contacts,0);checks++;
const stopped=serial();owner.combat_tick++;world(owner);post(owner);assert.equal(serial().replace(/"cm_last_tick":\d+/,''),stopped.replace(/"cm_last_tick":\d+/,''));checks++;
// Body and cutter damage use native4, while protection is delegated to existing
// MM5 damage owner (mocked here). Final-hit shutdown above prevents both.
actor.cm_active=true;actor.cm_defeat_pending=false;actor.cm_cutter=0;p.invulnerable=0;contact(owner);assert.equal(p.health,24);assert.equal(contacts,1);checks++;
p.x=3200;p.y=900;actor.x=3264;actor.cc_x=128;actor.cc_y=180;actor.cm_cutter=1;p.invulnerable=0;contact(owner);assert.equal(p.health,20);assert.equal(contacts,2);checks++;
actor.spr_mm1_cutman_combat=34;actor.draws=[];actor.draw_sprite=(...a)=>actor.draws.push(a);actor.draw_self=()=>actor.draws.push(['intro']);const old=serial();draw(actor);draw(actor);assert.equal(serial(),old);assert.equal(actor.draws.length,4);checks++;
// Exact latest baselines retained, with only declared integration additions.
const end=read('Scripts/scr_mm5_combat_end_frame.gml'),oldEnd=fs.readFileSync(new URL('Assets/Combat/MM5/Cut Man E-Tank/Scripts/scr_mm5_combat_end_frame.gml',root),'utf8');
assert.equal(end.replace('\nscr_mm1_cutman_boss_world_step(p);','').replace('\nscr_mm1_cutman_boss_contact(p);\nscr_mm1_cutman_boss_post_frame();',''),oldEnd);
assert.ok(end.indexOf('scr_mm1_cutman_boss_world_step(p)')<end.indexOf('with (obj_mm5_buster_shot)'));
assert.ok(end.indexOf('with (obj_mm5_buster_shot)')<end.indexOf('scr_mm1_cutman_boss_contact(p)'));
assert.ok(end.indexOf('scr_mm1_cutman_boss_contact(p)')<end.indexOf('scr_mm1_cutman_boss_post_frame()'));
const shot=read('Scripts/scr_mm5_combat_shot_step.gml'),oldShot=fs.readFileSync(new URL('Assets/Combat/MM5/Screw Bomber Checkpoint/Scripts/scr_mm5_combat_shot_step.gml',root),'utf8');
assert.equal(shot.replace(/\/\/ Cut Man8x12 body:[\s\S]*?(?=left_edge =)/,''),oldShot);
assert.equal(createSource.slice(0,createSource.indexOf('// Combat extension.')),fs.readFileSync(new URL('Assets/Bosses/MM1/Cut Man/Entrance/Objects/obj_mm1_cutman_boss_create.gml',root),'utf8'));
// Execute the WHOLE latest shot-step under no-other-enemies mocks; boss target
// executes actual hit adapter. Full-charge must be absorbed, not keep travelling.
const shotStep=compile(shot);let routedShots=0;
for(const[type,damage]of[[1,1],[2,1],[3,3]]){
 actor.cm_active=true;actor.cm_defeat_pending=false;actor.boss_health=28;actor.cm_blink=0;
 const q={...math,x:actor.x-4,y:actor.y,object_index:type,shot_direction:1,shot_speed:4,shot_anim_age:0,shot_anim_period:1,shot_anim_frames:1,image_index:0,image_xscale:1,mm5_shot_deflected:false,view_xview:[3072],view_yview:[720],view_wview:[256],alive:true};q.id=q;
 for(const[name]of shot.matchAll(/obj_[a-z0-9_]+/g))q[name]=50+Object.keys(q).length;
 q.obj_mm5_buster_mid=2;q.obj_mm5_buster_full=3;q.obj_mm1_cutman_boss=9;
 q.instance_number=t=>t===9?1:0;q.instance_find=()=>actor;q.instance_exists=o=>o===actor||(o===q&&q.alive);q.instance_destroy=()=>{q.alive=false};
 q.scr_mm5_combat_overlap=owner.scr_mm5_combat_overlap;
 q.scr_mm1_cutman_boss_hit=(a,b)=>hit({argument0:a,argument1:b,obj_mm5_buster_full:3,snd_mm6_enemy_hit:53,max:Math.max,instance_exists:q.instance_exists,instance_destroy:q.instance_destroy,audio_play_sound:()=>{}});
 shotStep(q);assert.equal(q.alive,false);assert.equal(actor.boss_health,28-damage);routedShots++;
}
assert.equal(routedShots,3);
// Player-death replacement retains latest Free Fall pit reset/retry source;
// only boss shutdown is added, stopping its independent PCM owner too.
const deathSource=read('Scripts/scr_mm5_combat_die.gml');
assert.equal(deathSource.replace('\nscr_mm1_cutman_boss_stop_combat();',''),fs.readFileSync(new URL('Assets/Cut Man/Stage/Free Fall Correction/scr_mm5_combat_die.gml',root),'utf8'));
const stopCombat=compile(read('Scripts/scr_mm1_cutman_boss_stop_combat.gml')),die=compile(deathSource);
let disposals=0,deathSounds=0;
const music={scr_mm1_cutman_boss_music_dispose:()=>{disposals++}},stage={stage_audio_closing:false,stage_music_voice:8,alarm:[1]};
const d={argument0:p,obj_mm5_combat:1,obj_mm1_cutman_stage:2,obj_mm1_cutman_boss:3,obj_mm1_cutman_boss_music:4,obj_mm5_buster_shot:5,snd_mm5_megaman_death:9,instance_exists:v=>[owner,p,stage,actor,music].includes(v),instance_find:t=>({1:owner,2:stage,3:actor,4:music})[t],instance_destroy:()=>{},scr_mm5_combat_stop_charge:()=>{},audio_stop_sound:()=>{},audio_play_sound:()=>{deathSounds++}};
d.scr_mm1_cutman_boss_stop_combat=()=>stopCombat(d);owner.combat_dead=false;actor.cm_cutter=1;actor.cm_active=true;
die(d);die(d);assert.equal(owner.combat_dead,true);assert.equal(owner.combat_pit_death,false);assert.equal(actor.cm_cutter,0);assert.equal(actor.cm_active,false);assert.equal(disposals,1);assert.equal(deathSounds,1);assert.equal(stage.alarm[0],-1);checks++;
// Supplied USA, not modified-source addresses: damage override and actual cutter bounds.
const rom=fs.readFileSync(new URL('Mega Man (USA).nes',root)),romByte=a=>rom[16+7*16384+(a&16383)];assert.equal(romByte(0xfebb),4);assert.equal(romByte(0xfab5+69),6);assert.equal(romByte(0xfb83+69),6);
console.log(`PASS ${checks} actor/controller/duplicate-tick/guard/contact/final-hit/Draw fixtures; ten full hits via actual world adapter; exact central/shot baseline preservation; three actual full-shot-step boss routes. States exercised:${[...naturalStates]}; simulated throws:${actor.plays.length}/catches:${catches}. NOT GMS, full player/pause scheduler or victory integration.`);
