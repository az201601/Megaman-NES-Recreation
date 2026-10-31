import fs from'node:fs';import assert from'node:assert/strict';import{PNG}from'pngjs';
const out=new URL('../../Assets/Cut Man/Stage/Opening Route/',import.meta.url),read=f=>fs.readFileSync(new URL(f,out),'utf8');
const g=JSON.parse(read('geometry.json')),atlas=PNG.sync.read(fs.readFileSync(new URL('bg_mm1_cutman_opening_tileset.png',out))),ref=PNG.sync.read(fs.readFileSync(new URL('cutman_opening_layout_reference.png',out))),scenery=PNG.sync.read(fs.readFileSync(new URL('cutman_opening_scenery_reference.png',out)));
assert.equal(g.world.width,1024);assert.equal(atlas.width,128);assert.equal(atlas.height,32);
let canvas=Buffer.alloc(1024*240*4);for(let i=0;i<1024*240;i++)canvas.set(g.sky,i*4);
const call=/tile_add\(bg_mm1_cutman_opening_tileset, (\d+), (\d+), 16, 16, (\d+), (\d+), 1000\);/g;
let count=0;for(const m of read('scr_mm1_cutman_opening_tiles.gml').matchAll(call)){const[ax,ay,x,y]=m.slice(1).map(Number);for(let dy=0;dy<16;dy++)for(let dx=0;dx<16;dx++){let k=((ay+dy)*atlas.width+ax+dx)*4;if(atlas.data[k+3])canvas.set(atlas.data.subarray(k,k+4),((y+dy)*1024+x+dx)*4);}count++;}
assert.equal(count,462);assert.deepEqual(canvas,scenery.data);
const block=PNG.sync.read(fs.readFileSync(new URL('../../Assets/Stage Objects/Super Arm/spr_mm1_super_arm_block.png',import.meta.url)));
for(const o of g.objects)for(let y=0;y<32;y++)for(let x=0;x<32;x++)canvas.set(block.data.subarray((y*32+x)*4,(y*32+x+1)*4),((o.y+y)*1024+o.x+x)*4);
assert.deepEqual(canvas,ref.data);assert.equal(g.objects.length,9);
const extension=read('scr_mm1_cutman_opening_blocks.gml');assert.equal((extension.match(/instance_create\(/g)||[]).length,5);for(const o of g.objects.filter(o=>o.x>=256))assert.ok(extension.includes(`instance_create(${o.x}, ${o.y}, obj_mm1_super_arm_block)`));
const instances=[];const env={obj_stage_solid:'solid',obj_stage_ladder:'ladder',obj_stage_ladder_top:'top',instance_create:(x,y,type)=>{const o={x,y,type,image_xscale:1,image_yscale:1};instances.push(o);return o;}};
new Function('c','with(c){'+read('scr_mm1_cutman_opening_collision.gml')+'}')(env);
for(const [key,type] of [['solids','solid'],['ladders','ladder'],['tops','top']])assert.deepEqual(instances.filter(o=>o.type===type).map(o=>({x:o.x,y:o.y,width:o.image_xscale*16,height:o.image_yscale*16})),g[key]);
// Collision rectangles must cover ONLY decoded solid/ladder classes, never block cells.
for(const c of g.cells){const includes=r=>c.x>=r.x&&c.x<r.x+r.width&&c.y>=r.y&&c.y<r.y+r.height;assert.equal(g.solids.some(includes),c.class===1&&!c.object);assert.equal(g.ladders.some(includes),c.class===2&&!c.object);}
assert.equal(g.tops.length,5);assert.ok(g.tops.every(t=>t.y>0&&t.height===1));
const fn=new Function('c','with(c){'+read('obj_mm1_cutman_camera_end_step.gml').replace(/\bexit;/g,'return;')+'}');
const trace=JSON.parse(read('native-camera-trace.json'));
let tested=0;for(const rows of Object.values(trace.results))for(const row of rows){const player={x:row.x+row.xfraction/256,mm5_startup_active:false};const c={camera_player:player,obj_mm5_megaman:1,view_xview:[0],view_yview:[99],floor:Math.floor,clamp:(x,a,b)=>Math.max(a,Math.min(b,x)),instance_exists:()=>true};fn(c);assert.equal(c.view_xview[0],row.camera);assert.equal(c.view_yview[0],0);tested++;}
const player={x:800,mm5_startup_active:true},c={camera_player:player,obj_mm5_megaman:1,view_xview:[10],view_yview:[10],instance_exists:()=>true};fn(c);assert.equal(c.view_xview[0],0);assert.equal(c.view_yview[0],0);
const all=['obj_mm1_cutman_camera_create.gml','obj_mm1_cutman_camera_end_step.gml','scr_mm1_cutman_opening_tiles.gml','scr_mm1_cutman_opening_collision.gml','scr_mm1_cutman_opening_blocks.gml'].map(read).join('\n');assert.ok(!/\b(variable_global_exists|variable_instance_exists|camera_create_view|layer_create|draw_set_gui_size)\s*\(/.test(all));
console.log(`PASS scenery462placements+9separateblocks, geometry classes/no duplicate block solids,5one-way ladder tops; actual cameraGML matches${tested}original frames incl controlled traversal. NOT GMS runtime.`);
