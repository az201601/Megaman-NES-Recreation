// Actual GML via limited engine adapter; NOT GMS compiler/runtime.
process.env.FLEA_OVERLAY='1';
const{Engine,eq,check}=await import('./test-blader-combat-integration.mjs');
const fs=await import('node:fs');const root=new URL('../../',import.meta.url),base=new URL('Assets/Combat/MM5/Flea Checkpoint/',root),native=JSON.parse(fs.readFileSync(new URL('Assets/Enemies/MM1/Flea/Reference/native-flea-gameplay.json',root)));
function setup(){const e=new Engine().setup();e.owner.combat_spawn_count=0;e.owner.blaster_spawn_count=0;e.owner.super_spawn_count=0;e.owner.flea_spawn_count=0;e.view=[1024,960];e.p.x=1040;e.p.y=996;return e;}
function box(l,t,r,b,type='obj_stage_solid'){return{type,bbox_left:l,bbox_top:t,bbox_right:r,bbox_bottom:b};}
let free=0,ground=0,skip=0;
for(const t of native.trials)for(let k=0;k<t.rows.length-1;k++){
 const a=t.rows[k],b=t.rows[k+1];if(b.frame!==a.frame+1)continue;
 const airborne=a.state>=16,j=t.jumps.find(v=>v.frame===a.frame),isSkip=airborne&&(a.clock&3)===0;
 const signedVX=(j??a).vx*(((j??a).flags&64)?1:-1),upVY=(j??a).vy;
 let kind;
 if(isSkip){kind='skip';skip++;}
 else if(!airborne&&a.timer>1&&b.y===a.y){kind='ground';ground++;}
 else if(b.x-a.x===signedVX/256&&b.y-a.y===-upVY/256&&b.vy===Math.max(-3072,upVY-64)){kind='free';free++;}
 else continue; // native wall/ceiling/floor edges are separately exercised below.
 const e=setup(),f=e.make('obj_mm1_flea',a.x,a.y);Object.assign(f,{flea_facing:a.flags&64?1:-1,flea_vx:a.vx/256,flea_vy:-a.vy/256,flea_airborne:airborne,flea_timer:a.timer});
 if(kind==='ground')e.terrain=[box(0,a.y+8,4095,a.y+23)];
 const target=j?j.x+((j.flags&64)?64:-64):a.x+64;
 e.call('scr_mm1_flea_step',f,[target,a.clock,a.random]);
 eq(f.x,b.x);eq(f.y,b.y);eq(f.flea_vx,b.vx/256);eq(f.flea_vy||0,(-b.vy/256)||0);eq(f.flea_airborne,b.state>=16);eq(f.flea_timer,b.timer);eq(e.sounds.length,0);
}
check(free>1000);check(ground>400);check(skip>400);
// All actual accepted terrain rectangles support original spawn heights.
const geometry=JSON.parse(fs.readFileSync(new URL('Assets/Cut Man/Stage/Second Gate Passage/geometry.json',root)));
const terrain=[...geometry.solids.map(v=>box(v.x,v.y,v.x+v.width-1,v.y+v.height-1)),...geometry.tops.map(v=>box(v.x,v.y,v.x+v.width-1,v.y+v.height-1,'obj_stage_ladder_top'))];
for(const o of geometry.objects)terrain.push(box(o.x,o.y,o.x+31,o.y+31));
for(const [x,y]of[[1080,1144],[1112,1112],[1144,1080]]){const e=setup(),f=e.make('obj_mm1_flea',x,y);e.terrain=terrain;f.flea_timer=15;f.flea_vy=.75;for(let i=0;i<14;i++)e.call('scr_mm1_flea_step',f,[1040,i,0]);eq(f.x,x);eq(f.y,y);eq(f.flea_timer,1);e.call('scr_mm1_flea_step',f,[1040,15,0]);check(f.flea_airborne);check(f.y<y);}
// Controlled geometry boundary fixtures, not assertions of full NES tile solver identity.
for(const facing of[-1,1]){const e=setup(),f=e.make('obj_mm1_flea',1100,1100);Object.assign(f,{flea_airborne:true,flea_vx:3,flea_facing:facing,flea_vy:0});e.terrain=[facing>0?box(1109,1080,1124,1130):box(1076,1080,1091,1130)];e.call('scr_mm1_flea_step',f,[0,1,0]);eq(f.x,1100+(facing>0?1:0));}
// Ceiling clamp, rebound0.75, no fake ground timer; descending landing15/vx0.
{const e=setup(),f=e.make('obj_mm1_flea',1100,1100);Object.assign(f,{flea_airborne:true,flea_vy:-4});e.terrain=[box(1080,1076,1120,1090)];e.call('scr_mm1_flea_step',f,[0,1,0]);eq(f.y,1099);eq(f.flea_vy,.75);check(f.flea_airborne);eq(f.flea_timer,1);}
for(const type of['obj_stage_solid','obj_stage_ladder_top']){const e=setup(),f=e.make('obj_mm1_flea',1100,1100);Object.assign(f,{flea_airborne:true,flea_vy:4,flea_vx:0});e.terrain=[box(1000,1110,1200,1125,type)];e.call('scr_mm1_flea_step',f,[0,1,0]);eq(f.y,1102);eq(f.flea_vy,.75);eq(f.flea_timer,15);eq(f.flea_vx,0);check(!f.flea_airborne);for(let i=1;i<15;i++)e.call('scr_mm1_flea_step',f,[1200,i,0]);eq(f.flea_timer,1);check(!f.flea_airborne);e.call('scr_mm1_flea_step',f,[1200,15,0]);check(f.flea_airborne);eq(f.flea_vx,304/256);eq(f.flea_vy,-1184/256);eq(e.sounds.length,0);}
// Removed block has no stale floor; airborne springs don't collide with scenery.
{const e=setup(),f=e.make('obj_mm1_flea',1100,1100);f.flea_timer=10;f.flea_vy=.75;e.call('scr_mm1_flea_step',f,[0,0,0]);eq(f.y,1100.75);eq(f.flea_vy,1);}
// Shared manager clock: all airborne Fleas skip together regardless of their ages.
{const e=setup(),a=e.make('obj_mm1_flea',1080,1100),b=e.make('obj_mm1_flea',1112,1100);for(const f of[a,b])Object.assign(f,{flea_airborne:true,flea_vy:-4,flea_vx:3});e.owner.combat_tick=4;e.call('scr_mm1_flea_world_step',e.owner,[e.p]);eq([a.y,b.y],[1100,1100]);e.owner.combat_tick=5;e.call('scr_mm1_flea_world_step',e.owner,[e.p]);eq([a.y,b.y],[1096,1096]);}
// Manager launch path selects the native table bit without a sound or built-in local.
for(const byte of[0,1,254,255]){const e=setup(),f=e.make('obj_mm1_flea',1100,1100);e.rolls=[byte];e.owner.combat_tick=1;e.call('scr_mm1_flea_world_step',e.owner,[e.p]);eq(f.flea_vx,(byte&1)?3:304/256);eq(f.flea_vy,(byte&1)?-3.75:-1184/256);eq(e.rolls.length,0);eq(e.sounds.length,0);}
// All3 anchors, exactly once, re-arm only offscreen; no new art buildings.
{const e=setup();e.owner.flea_spawn_count=3;e.call('scr_mm1_flea_spawn',e.owner);eq(e.list('obj_mm1_flea').map(a=>[a.x,a.y]),[[1080,1144],[1112,1112],[1144,1080]]);e.call('scr_mm1_flea_spawn',e.owner);eq(e.list('obj_mm1_flea').length,3);const a=e.list('obj_mm1_flea')[0];a.dead=true;e.call('scr_mm1_flea_spawn',e.owner);eq(e.list('obj_mm1_flea').length,2);e.view=[768,960];e.call('scr_mm1_flea_spawn',e.owner);e.view=[1024,960];e.call('scr_mm1_flea_spawn',e.owner);eq(e.list('obj_mm1_flea').length,3);}
for(const type of['obj_mm5_buster_shot','obj_mm5_buster_mid','obj_mm5_buster_full']){const e=setup(),f=e.make('obj_mm1_flea',1100,1100),s=e.shot(type,1095,1100);e.call('scr_mm5_combat_shot_step',s);check(f.dead);eq(s.dead,type!=='obj_mm5_buster_full');eq(e.sounds.at(-1).sound,'snd_mm6_enemy_hit');eq(e.list('obj_mm5_enemy_explosion').length,1);e.rolls=[3];for(let i=0;i<13;i++)e.tick();eq(e.list('obj_mm5_pickup').filter(a=>a.pickup_kind===0x75).length,1); // Count the requested random drop, not a fixed E-Tank in the same view.
}
{const e=setup(),a=e.make('obj_mm1_flea',1100,1100),b=e.make('obj_mm1_flea',1103,1100),s=e.shot('obj_mm5_buster_full',1095,1100);e.call('scr_mm5_combat_shot_step',s);check(a.dead&&b.dead&&!s.dead);eq(e.list('obj_mm5_enemy_explosion').length,2);}
for(const slide of[false,true])for(const dy of[0,12,13,19,20]){const e=setup();e.p.sliding=slide;const f=e.make('obj_mm1_flea',e.p.x,e.p.y+dy);e.call('scr_mm1_flea_contact',e.owner,[e.p]);eq(e.p.mm5_health,dy<(slide?13:20)?26:28);e.call('scr_mm1_flea_contact',e.owner,[e.p]);eq(e.p.mm5_health,dy<(slide?13:20)?26:28);check(!f.dead);}
{const e=setup(),f=e.make('obj_mm1_flea',e.p.x,e.p.y);f.flea_born_tick=e.owner.combat_tick;e.call('scr_mm1_flea_contact',e.owner,[e.p]);eq(e.p.mm5_health,28);}
{const e=setup();e.p.x=1100;e.p.y=1100;const f=e.make('obj_mm1_flea',1100,1100);f.flea_timer=10;e.shot('obj_mm5_buster_shot',1095,1100);e.tick();check(f.dead);eq(e.p.mm5_health,28);}
for(const flag of['combat_dead','combat_refilling']){const e=setup(),f=e.make('obj_mm1_flea',1100,1100);e.owner[flag]=true;e.owner.combat_begin_done=true;e.call('scr_mm5_combat_end_frame',e.owner);eq(f.flea_timer,1);eq(f.y,1100);eq(e.sounds.length,0);}
{const e=setup(),f=e.make('obj_mm1_flea',1100,1100);e.route=true;e.tick();check(f.dead);eq(e.list('obj_mm5_pickup').length,0);eq(e.sounds.length,0);}
{const e=setup(),f=e.make('obj_mm1_flea',1024,1100);Object.assign(f,{flea_airborne:true,flea_vx:3,flea_facing:-1});e.owner.combat_tick=1;e.call('scr_mm1_flea_world_step',e.owner,[e.p]);check(f.dead);eq(e.list('obj_mm5_enemy_explosion').length,0);}
{const e=setup(),f=e.make('obj_mm1_flea',1100,1100),s=e.shot('obj_mm5_buster_full',1095,1100);s.mm5_shot_deflected=true;e.call('scr_mm5_combat_shot_step',s);check(!f.dead);eq(e.sounds.length,0);}
const reserved=new Set(['direction','speed','x','y','id','depth','visible','solid','persistent','sprite_index','object_index','image_index','image_speed','hspeed','vspeed','gravity','friction','mask_index']);
for(const dir of['Scripts','Objects','Hooks'])for(const f of fs.readdirSync(new URL(dir+'/',base))){const s=fs.readFileSync(new URL(dir+'/'+f,base),'utf8').replace(/\/\/[^\n]*/g,'');for(const d of s.matchAll(/\bvar\s+([^;]+);/g))for(const name of d[1].split(',').map(n=>n.trim()))check(!reserved.has(name),f+': built-in local '+name);check(!s.includes('variable_instance_exists')&&!s.includes('variable_global_exists'));}
console.log(`PASS Flea actualGML: ${free} native unobstructed transitions/${ground} native grounded transitions/${skip} native skips; wall/ceiling/floor/caps/removal fixtures, shared phase,3spawns, normal/mid/full/pierce, contact2/slide/protection, drops/freeze/cleanup/deflection, builtin local guards. NOT GMSruntime.`);

const old=new URL('Assets/Combat/MM5/Super Cutter Checkpoint/Scripts/',root);
let end=fs.readFileSync(new URL('Scripts/scr_mm5_combat_end_frame.gml',base),'utf8');
end=end.replace('        with (obj_mm1_flea) instance_destroy();\n        for (i = 0; i < flea_spawn_count; i += 1) flea_spawn_armed[i] = true;\n','').replace('scr_mm1_flea_world_step(p);\n','').replace('scr_mm1_flea_contact(p);\n','').replace('if (!combat_dead && !combat_refilling) scr_mm1_flea_spawn();\n','');
eq(end,fs.readFileSync(new URL('scr_mm5_combat_end_frame.gml',old),'utf8'));
let shot=fs.readFileSync(new URL('Scripts/scr_mm5_combat_shot_step.gml',base),'utf8');const a=shot.indexOf('// Flea uses the same native8x8'),b=shot.indexOf('left_edge = view_xview[0];',a);shot=shot.slice(0,a)+shot.slice(b);
eq(shot,fs.readFileSync(new URL('scr_mm5_combat_shot_step.gml',old),'utf8'));
console.log('PASS all accepted central-script lines preserved outside additive Flea calls.');
