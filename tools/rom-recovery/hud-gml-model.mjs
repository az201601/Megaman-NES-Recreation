// Actual GML event subset with engine mocks, NOT GMS runtime certification.
import fs from 'node:fs';import assert from 'node:assert/strict';import {PNG} from 'pngjs';
const base=new URL('../../Assets/Mega Man/MM5/HUD/Controller/',import.meta.url);
const source=n=>fs.readFileSync(new URL(n+'.gml',base),'utf8');
const compile=n=>new Function('env','with(env){'+source(n).replace(/\bexit\s*;/g,'return;')+'}');
const init=compile('obj_mm5_megaman_create_health_append'),create=compile('obj_mm5_hud_create'),room=compile('obj_mm5_hud_room_start'),draw=compile('obj_mm5_hud_draw_gui');
const p={mm5_health:0,mm5_startup_active:false};const h={hud_player:-4,noone:-4,depth:0,obj_mm5_hud:'hud',obj_mm5_megaman:'player',spr_mm5_health_meter:'meter',c_white:0xffffff,floor:Math.floor,min:Math.min,max:Math.max};
const calls=[],sizes=[];let live=true,players=1,huds=1;
h.instance_exists=id=>live&&id===p;h.instance_find=(obj,i)=>{assert.equal(obj,'player');assert.equal(i,0);return p;};h.instance_number=obj=>obj==='player'?players:huds;
h.show_error=(s,fatal)=>{assert.equal(fatal,true);throw Error(s);};h.display_set_gui_size=(...v)=>sizes.push(v);h.draw_sprite_ext=(...v)=>calls.push(v);
for(const order of [0,1]){if(order){create(h);init(p);}else{init(p);create(h);}room(h);assert.equal(p.mm5_health,28);assert.equal(h.hud_player,p);}
assert.deepEqual(sizes,[[256,240],[256,240]]);
const native=JSON.parse(fs.readFileSync(new URL('./.work/mm5-health-hud.json',import.meta.url)));
const png=PNG.sync.read(fs.readFileSync(new URL('../spr_mm5_health_meter_strip29.png',base)));
assert.equal(png.width,232);assert.equal(png.height,56);
for(let hp=0;hp<=28;hp++)for(const locked of [false,true]){
 p.mm5_health=hp;p.mm5_startup_active=locked;draw(h);const c=calls.at(-1);
 assert.deepEqual(c,['meter',hp,24,25,1,1,0,0xffffff,1]);assert.equal(p.mm5_health,hp);
 assert.deepEqual(native[hp].tiles,Array.from({length:7},(_,row)=>96+Math.max(0,Math.min(4,hp-4*(6-row)))));
 let lit=0;for(let y=0;y<56;y++)for(let x=0;x<8;x++){const i=(y*232+hp*8+x)*4;assert.equal(png.data[i+3],255);if(png.data[i]!==0)lit++;}
 assert.equal(lit,hp*6);
}
for(const [value,expected] of [[-5,0],[0.9,0],[14.9,14],[28.8,28],[100,28]]){p.mm5_health=value;draw(h);assert.equal(calls.at(-1)[1],expected);assert.equal(p.mm5_health,value);}
live=false;const count=calls.length;draw(h);assert.equal(calls.length,count);live=true;
players=0;assert.throws(()=>room(h),/exactly ONE obj_mm5_megaman/);players=2;assert.throws(()=>room(h),/exactly ONE obj_mm5_megaman/);players=1;huds=2;assert.throws(()=>room(h),/exactly ONE obj_mm5_hud/);
assert.ok(!/keyboard_|audio_|mm5_startup_active\s*=/.test(source('obj_mm5_hud_draw_gui')));
console.log('PASS: actual HUD GML, both Create orders,29 states vs native tiles/PNG, startup-independent visibility, bounds without mutation, missing player and duplicate guards; GUI256x240. Real GMS runtime pending.');
