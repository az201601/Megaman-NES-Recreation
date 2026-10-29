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
