// Executes actual GML subset with inherited-event mocks, NOT a GMS runtime/compiler.
// Re-run charge-values.mjs first to supply independent original-ROM traces.
import fs from 'node:fs';import assert from 'node:assert/strict';
const base=new URL('../../Assets/Mega Man/MM5/Buster/',import.meta.url);
const compile=name=>new Function('env','with(env){'+fs.readFileSync(new URL(name,base),'utf8').replace(/\bmod\b/g,'%')+'}');
const parentCreate=compile('obj_mm5_buster_shot_create.gml'),parentStep=compile('obj_mm5_buster_shot_end_step.gml');
const childStep=compile('Charging/Objects/obj_mm5_charged_buster_end_step.gml');
const traces=JSON.parse(fs.readFileSync(new URL('./.work/charge-values.json',import.meta.url)));
for(const kind of ['mid','full'])for(const dir of [1,-1]){
 const childCreate=compile('Charging/Objects/obj_mm5_buster_'+kind+'_create.gml');
 const e={x:dir===1?148:108,y:179,shot_direction:0,shot_speed:0,shot_anim_age:0,shot_anim_period:0,shot_anim_frames:0,
  speed:0,gravity:0,image_speed:0,image_index:0,image_xscale:0,image_yscale:0,depth:0,sprite_index:'basic',
  spr_mm5_buster_mid:'mid',spr_mm5_buster_full:'full',floor:Math.floor,
  room_width:256,view_enabled:true,view_visible:[true],view_xview:[0],view_wview:[256],dead:false};
 let createCalls=0,motionCalls=0;
 e.instance_destroy=()=>e.dead=true;
 e.event_inherited=()=>{createCalls++;parentCreate(e);};childCreate(e);e.shot_direction=dir;
 assert.equal(createCalls,1);assert.equal(e.speed,0);assert.equal(e.gravity,0);assert.equal(e.image_speed,0);assert.equal(e.shot_speed,5);
 assert.equal(e.sprite_index,kind);assert.equal(e.x,dir===1?148:108,'Create must not move');
 e.event_inherited=()=>{motionCalls++;parentStep(e);};
 const h=kind==='mid'?41:81,trace=traces.find(c=>c.held===h&&!c.left);
 for(let age=1;age<=22;age++){
  childStep(e);assert.equal(motionCalls,age);assert.equal(e.x,(dir===1?148:108)+dir*5*age);
  assert.equal(e.y,179);assert.equal(e.image_xscale,dir);assert.equal(e.dead,age===22);
  const source=trace.rows[h+age-1].shots;
  if(age<22){assert.equal(source.length,1);assert.equal(e.image_index,source[0].phase);if(dir===1)assert.equal(e.x,source[0].x);}
  else assert.equal(source.length,0);
 }
}
console.log('Charged objects passed: inherited Create/EndStep once, zero Create movement, speed5/both directions, fixedY, native RAM phases including creation age, static-window live21/delete22. No GMS runtime/inheritance/count certification.');
