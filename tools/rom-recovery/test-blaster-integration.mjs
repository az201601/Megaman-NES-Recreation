// Actual GML via existing limited adapter. Not GameMaker compiler/runtime.
process.env.BLASTER_OVERLAY='1';
const {Engine,eq,check}=await import('./test-blader-combat-integration.mjs');
const fs=await import('node:fs');const root=new URL('../../',import.meta.url);
const native=JSON.parse(fs.readFileSync(new URL('Assets/Enemies/MM1/Blaster/Reference/native-blaster-gameplay.json',root)));
for(const t of native.trials){const e=new Engine().setup();e.owner.combat_spawn_count=0;e.owner.blaster_spawn_count=0;const a=e.make('obj_mm1_blaster',100,2000);a.blaster_timer=t.initialTimer;a.blaster_direction=(t.flags&64)?1:-1;for(const r of t.states){eq(a.blaster_state,r.state);eq(a.blaster_timer,r.timer);e.call('scr_mm1_blaster_step',a);}check(e.sounds.every(s=>s.sound==='snd_mm1_blaster_fire'));check(e.sounds.length>=4);const b=e.list('obj_mm1_blaster_bullet');eq(b.slice(0,4).map(v=>[v.blaster_bullet_vx,v.blaster_bullet_vy]),native.speeds.map(v=>[(t.flags&64?1:-1)*v.vxRaw/256,-v.vyRaw/256]));}
function setup(){const e=new Engine().setup();e.owner.combat_spawn_count=0;e.owner.blaster_spawn_count=0;e.view=[768,1920];e.p.x=790;e.p.y=2000;return e;}
for(const type of['obj_mm5_buster_shot','obj_mm5_buster_mid','obj_mm5_buster_full']){
 for(const open of[false,true]){const e=setup(),a=e.make('obj_mm1_blaster',824,2000),shot=e.shot(type,820,2000);a.blaster_open=open;check(e.call('scr_mm1_blaster_hit',e.owner,[a,shot]));
 if(open){check(a.dead);eq(shot.dead,type!=='obj_mm5_buster_full');eq(e.sounds.at(-1).sound,'snd_mm6_enemy_hit');eq(e.list('obj_mm5_enemy_explosion').length,1);}else{check(!a.dead&&!shot.dead);eq(a.blaster_hp,1);check(shot.mm5_shot_deflected);eq(shot.shot_direction,-1);eq(e.sounds.at(-1).sound,'snd_mm6_blocked_hit');const x=shot.x,y=shot.y;e.call('scr_mm5_combat_shot_step',shot);eq(shot.x,x-shot.shot_speed);eq(shot.y,y-4);eq(e.sounds.length,1);}}
}
// Actual shot/cannon scheduling, open kill before contact, and exactly one drop.
{const e=setup();e.p.x=824;const a=e.make('obj_mm1_blaster',824,2000);a.blaster_state=49;a.blaster_timer=8;const s=e.shot('obj_mm5_buster_shot',818,2000);e.tick();check(a.dead);eq(e.p.mm5_health,28);eq(e.sounds.at(-1).sound,'snd_mm6_enemy_hit');e.rolls=[3];for(let i=0;i<13;i++)e.tick();eq(e.list('obj_mm5_pickup').length,1);eq(e.list('obj_mm5_pickup')[0].pickup_kind,0x75);}
// Original body1/bullet2 versus same hurt/protection owner; new bullets do not hit early.
{const e=setup();e.p.x=824;e.make('obj_mm1_blaster',824,2000);e.call('scr_mm1_blaster_contact',e.owner,[e.p]);eq(e.p.mm5_health,27);e.call('scr_mm1_blaster_contact',e.owner,[e.p]);eq(e.p.mm5_health,27);}
for(const slide of[false,true])for(const delta of[0,5,6,12,13]){const e=setup();e.p.sliding=slide;const a=e.make('obj_mm1_blaster_bullet',e.p.x,e.p.y+delta);e.call('scr_mm1_blaster_contact',e.owner,[e.p]);eq(e.p.mm5_health,delta<(slide?6:13)?26:28);eq(a.dead,delta<(slide?6:13));}
{const e=setup();const a=e.make('obj_mm1_blaster_bullet',e.p.x,e.p.y);a.blaster_bullet_born_tick=e.owner.combat_tick;e.call('scr_mm1_blaster_contact',e.owner,[e.p]);eq(e.p.mm5_health,28);}
// All11 route-mapped anchors spawn once, stagger and facing values retained.
{const e=new Engine().setup();e.owner.combat_spawn_count=0;eq(e.owner.blaster_spawn_count,11);eq(e.owner.blaster_spawn_x,[824,952,888,920,984,840,888,952,888,920,952]);eq(e.owner.blaster_spawn_band,[1920,1920,1680,1680,1680,1440,1440,1440,1200,1200,1200]);
 for(const [x,band,count]of[[768,1920,2],[768,1680,3],[768,1440,3],[768,1200,3]]){e.view=[x,band];e.call('scr_mm1_blaster_spawn',e.owner);eq(e.list('obj_mm1_blaster').filter(a=>a.blaster_band===band).length,count);e.call('scr_mm1_blaster_spawn',e.owner);eq(e.list('obj_mm1_blaster').filter(a=>a.blaster_band===band).length,count);}}
// Route cleanup never rolls drops; pause/refill/death freeze both new actors.
{const e=setup();const a=e.make('obj_mm1_blaster',824,2000),b=e.make('obj_mm1_blaster_bullet',820,1990);e.route=true;e.tick();check(a.dead&&b.dead);eq(e.list('obj_mm5_pickup').length,0);eq(e.sounds.length,0);}
for(const flag of['combat_refilling','combat_dead']){const e=setup(),a=e.make('obj_mm1_blaster',824,2000),b=e.make('obj_mm1_blaster_bullet',820,1990);e.owner[flag]=true;e.owner.combat_begin_done=true;e.call('scr_mm5_combat_end_frame',e.owner);eq(a.blaster_timer,0);eq(b.x,820);eq(b.y,1990);eq(e.sounds.length,0);}
{const e=setup(),b=e.make('obj_mm1_blaster_bullet',770,2000);b.blaster_bullet_vx=-3;e.call('scr_mm1_blaster_world_step',e.owner);check(b.dead);eq(e.list('obj_mm5_pickup').length,0);}
console.log('PASS Blaster checkpoint: actualGML matches840 native variant states,4shot vectors; normal/mid/full block/openkill; deflection; body/bullet damage & slideedges;11spawns; oneMM5drop; routecleanup/freeze. NOT GMSruntime.');
