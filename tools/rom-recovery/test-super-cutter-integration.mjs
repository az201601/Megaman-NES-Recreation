// Actual GML through limited JS adapter, NOT the GameMaker compiler/runtime.
process.env.SUPER_CUTTER_OVERLAY='1';
const{Engine,eq,check}=await import('./test-blader-combat-integration.mjs');
const fs=await import('node:fs');const root=new URL('../../',import.meta.url);
const native=JSON.parse(fs.readFileSync(new URL('Assets/Enemies/MM1/Super Cutter/Reference/native-super-cutter.json',root)));
const{createHash}=await import('node:crypto');const{PNG}=await import('pngjs');
const rom=fs.readFileSync(new URL('Mega Man (USA).nes',root));
eq(createHash('sha256').update(rom).digest('hex'),native.romSha256);
eq(native.spans.reduce((n,s)=>n+s.hex.length/2,0),187);
for(const s of native.spans)eq(rom.subarray(s.offset,s.offset+s.hex.length/2).toString('hex'),s.hex);
const art=JSON.parse(fs.readFileSync(new URL('Assets/Enemies/MM1/Super Cutter/Reference/native-super-cutter-art.json',root))),strip=PNG.sync.read(fs.readFileSync(new URL('Assets/Enemies/MM1/Super Cutter/spr_mm1_super_cutter_strip2.png',root)));
eq([strip.width,strip.height],[32,32]);eq(art.origin,[8,15]);
for(const r of art.poses){const rgba=Buffer.alloc(16*32*4);for(let y=0;y<32;y++)strip.data.copy(rgba,y*64,(y*32+r.index*16)*4,(y*32+r.index*16+16)*4);eq(createHash('sha256').update(rgba).digest('hex'),r.rgbaSha256);}
let states=0;
function setup(){const e=new Engine().setup();e.owner.combat_spawn_count=0;e.owner.blaster_spawn_count=0;e.view=[768,960];e.p.x=872;e.p.y=996;return e;}
for(const t of native.trials){const e=setup();e.p.x=912+t.delta;const launches=[];let first;
 for(let f=1;f<=160;f++){e.owner.combat_tick=f;e.call('scr_mm1_super_cutter_world_step',e.owner,[e.p]);const newborn=e.list('obj_mm1_super_cutter').filter(a=>a.super_born_tick===f);if(newborn.length){launches.push(f);if(!first)first=newborn[0];eq(newborn.length,1);eq(newborn[0].super_vx,(t.delta<0?-1:1)*Math.floor(Math.abs(t.delta)*256/51)/256);eq(newborn[0].super_hp,5);}
 const r=t.firstCutter.find(v=>v.f===f);if(r){check(first&&!first.dead);eq(first.x,r.x-1024);eq(first.y,r.y+960);eq(first.super_vy,-r.vy/256);eq(Math.floor(first.super_age/10)%2,r.state>>4);states++;}}
 eq(launches,t.launches.map(v=>v.f));eq(e.sounds.length,0);}
// Both accepted building anchors; vertical band separation and facing at zero.
{const e=setup();eq(e.owner.super_spawn_x,[912,1424]);eq(e.owner.super_spawn_y,[1140,180]);eq(e.owner.super_spawn_band,[960,0]);e.view=[1280,0];e.p.x=1424;e.call('scr_mm1_super_cutter_world_step',e.owner,[e.p]);const a=e.list('obj_mm1_super_cutter')[0];eq(a.x,1424);eq(a.y,180);eq(a.super_direction,1);eq(a.super_vx,0);e.view=[1280,240];e.owner.combat_tick++;e.call('scr_mm1_super_cutter_world_step',e.owner,[e.p]);check(a.dead);eq(e.owner.super_spawn_timer,[0,0]);}
for(const type of['obj_mm5_buster_shot','obj_mm5_buster_mid','obj_mm5_buster_full']){const e=setup(),a=e.make('obj_mm1_super_cutter',900,1100);let hp=5,n=0;
 while(!a.dead){const s=e.shot(type,895,1100);const old=hp;e.call('scr_mm1_super_cutter_hit',e.owner,[a,s]);hp-=type==='obj_mm5_buster_full'?3:1;n++;eq(a.super_hp,hp);eq(s.dead,type!=='obj_mm5_buster_full'||old>=4);eq(e.list('obj_mm5_enemy_explosion').length,hp<=0?1:0);check(n<=5);}
 eq(n,type==='obj_mm5_buster_full'?2:5);eq(e.sounds.length,n);check(e.sounds.every(v=>v.sound==='snd_mm6_enemy_hit'));e.rolls=[3];for(let i=0;i<13;i++)e.tick();eq(e.list('obj_mm5_pickup').length,1);}
// Consumed full shot must exit immediately, not hit a second target in that pass.
for(const hp of[3,4,5]){const e=setup();e.owner.super_spawn_count=0;const a=e.make('obj_mm1_super_cutter',900,1100),b=e.make('obj_mm1_super_cutter',900,1100);a.super_hp=hp;b.super_hp=hp;const s=e.shot('obj_mm5_buster_full',895,1100);e.call('scr_mm5_combat_shot_step',s);eq(b.super_hp,hp-3);eq(a.super_hp,hp<4?hp-3:hp);eq(s.dead,hp>=4);eq(e.list('obj_mm5_enemy_explosion').length,hp<4?2:0);}
// Contact uses 8x8 native cutter bounds, NOT the32px open-pose alpha/mask.
for(const slide of[false,true])for(const dy of[0,12,13,19,20]){const e=setup();e.p.sliding=slide;const a=e.make('obj_mm1_super_cutter',e.p.x,e.p.y+dy);e.call('scr_mm1_super_cutter_contact',e.owner,[e.p]);eq(e.p.mm5_health,dy<(slide?13:20)?24:28);check(!a.dead);e.call('scr_mm1_super_cutter_contact',e.owner,[e.p]);eq(e.p.mm5_health,dy<(slide?13:20)?24:28);}
{const e=setup(),a=e.make('obj_mm1_super_cutter',e.p.x,e.p.y);a.super_born_tick=e.owner.combat_tick;e.call('scr_mm1_super_cutter_contact',e.owner,[e.p]);eq(e.p.mm5_health,28);}
// Shot resolution still precedes contacts; accepted offscreen/route cleanup never drops.
{const e=setup();e.owner.super_spawn_count=0;e.p.x=900;e.p.y=1100;const a=e.make('obj_mm1_super_cutter',900,1100);a.super_hp=1;a.super_vy=0;e.shot('obj_mm5_buster_shot',895,1100);e.tick();check(a.dead);eq(e.p.mm5_health,28);eq(e.list('obj_mm5_enemy_explosion').length,1);}
for(const flag of['combat_dead','combat_refilling']){const e=setup(),a=e.make('obj_mm1_super_cutter',900,1100);e.owner[flag]=true;e.owner.combat_begin_done=true;e.call('scr_mm5_combat_end_frame',e.owner);eq(a.y,1100);eq(a.super_age,0);eq(e.owner.super_spawn_timer,[0,0]);}
{const e=setup(),a=e.make('obj_mm1_super_cutter',900,1100);e.owner.super_spawn_timer=[12,13];e.route=true;e.tick();check(a.dead);eq(e.owner.super_spawn_timer,[0,0]);eq(e.list('obj_mm5_pickup').length,0);eq(e.sounds.length,0);}
{const e=setup(),a=e.make('obj_mm1_super_cutter',900,1199);a.super_vy=2;e.owner.super_spawn_count=0;e.call('scr_mm1_super_cutter_world_step',e.owner,[e.p]);check(a.dead);eq(e.list('obj_mm5_enemy_explosion').length,0);eq(e.sounds.length,0);}
// Existing deflected Blaster shots cannot hit cutters.
{const e=setup(),a=e.make('obj_mm1_super_cutter',900,1100),s=e.shot('obj_mm5_buster_full',895,1100);s.mm5_shot_deflected=true;e.call('scr_mm5_combat_shot_step',s);eq(a.super_hp,5);eq(e.sounds.length,0);}
console.log(`PASS Super Cutter: ${states} native position/velocity/animation states;9trigger trials;2anchors; five normal/mid or2full hits; highHP fullshot consumed/weakpierce; body4/slide/protection; no launch sound; one drop; born/route/offscreen/freeze guards. NOT GMSruntime.`);

// GMS1.4 built-ins cannot be redeclared by var; JS adapter alone misses this.
const checkpoint=new URL('Assets/Combat/MM5/Super Cutter Checkpoint/',root);
const reservedLocals=new Set(['direction','speed','hspeed','vspeed','gravity','gravity_direction','friction','x','y','id','depth','visible','solid','persistent','object_index','sprite_index','image_index','image_speed','image_xscale','image_yscale','image_angle','image_alpha','image_blend','mask_index']);
for(const dir of ['Scripts','Objects','Hooks'])for(const file of fs.readdirSync(new URL(dir+'/',checkpoint))){if(!file.endsWith('.gml'))continue;const text=fs.readFileSync(new URL(dir+'/'+file,checkpoint),'utf8').replace(/\/\/[^\n]*/g,'');for(const declaration of text.matchAll(/\bvar\s+([^;]+);/g))for(const name of declaration[1].split(',').map(v=>v.trim()))check(!reservedLocals.has(name),`${file}: cannot redeclare built-in ${name}`);}
console.log('PASS checkpoint local-variable declarations avoid checked GMS1.4 built-ins.');
