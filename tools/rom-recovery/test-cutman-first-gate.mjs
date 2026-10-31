// Execute supported actual GML using existing engine mocks. NOT a GMS compiler/runtime.
import fs from'node:fs';import{execFileSync}from'node:child_process';
const previous=new URL('./test-cutman-eleventh-scroll.mjs',import.meta.url);
let harness=fs.readFileSync(previous,'utf8').split("test('Independent fresh-input probes")[0];
harness=harness.replaceAll('import.meta.url',JSON.stringify(previous.href)).replace("const base=new URL('../../Assets/Cut Man/Stage/Eleventh Ladder Transition/'","const eleventh=new URL('../../Assets/Cut Man/Stage/Eleventh Ladder Transition/',"+JSON.stringify(previous.href)+");\nconst base=new URL('../../Assets/Cut Man/Stage/First Gate Passage/'").replaceAll(",base,'native-down.json'",",eleventh,'native-down.json'").replaceAll(",base,'up-continuation.json'",",eleventh,'up-continuation.json'").replaceAll('room_width:2304','room_width:3072').replace("read(f).replace(/\\bexit;/g,'return;')","read(f).replace(/\\bexit;/g,'return;').replace(/\\bmod\\b/g,'%')");
harness+=String.raw`
const gateStart=compile('scr_mm1_cutman_gate_start.gml');
function gateContext(){const c=context();Object.assign(c,{vk_right:39,vk_left:37,min:Math.min,spr_mm5_megaman_walk:91,spr_mm5_megaman_idle:92,snd_mm5_gate_open:93,obj_mm1_cutman_boss_gate:94,plays:[],stops:[],audio_play_sound:(...args)=>{c.plays.push(args);return 555;},audio_stop_sound:v=>c.stops.push(v)});c.gate={gate:true,x:2272,y:816,gate_open_rows:0};c.instance_exists=v=>!!v&&(v.player===true||v.gate===true);c.instance_nearest=()=>c.gate;c.scr_mm1_cutman_gate_start=()=>gateStart(c);c.route_section=11;c.view_xview[0]=2048;c.view_yview[0]=720;Object.assign(c.camera_player,{x:2264,y:868,grounded:true,feet_offset:12,sliding:false,on_ladder:false,fall_speed:0,anim_walk_frame:0,anim_walk_timer:0,walk_pause:0,walk_previous_input:0});c.held.add(39);return c;}
const research=new URL('../../Assets/Cut Man/Stage/First Gate Research/',`+JSON.stringify(previous.href)+String.raw`),rows=JSON.parse(fs.readFileSync(new URL('native-gate.json',research))).rows;
test('Gate actual GML: age0..121, MM5 immediate start and shifted MM1 X/camera steps, four strips, one approved MM5 cue, section commit and control release',()=>{
 const c=gateContext();begin(c);assert.ok(c.route_busy);assert.equal(c.route_start_version,1201);assert.equal(c.shots.length,0);
 for(let age=0;age<=121;age++){
  if(age)begin(c);const r=rows.find(r=>r.frame===52+Math.min(age,120));
  assert.equal(c.view_xview[0],r.cameraX-2816,'camera age'+age);assert.equal(c.view_yview[0],720);assert.equal(c.camera_player.x,r.logicalX-2816,'player age'+age);assert.equal(c.camera_player.y,868);
  assert.equal(c.route_busy,age<121);assert.equal(c.route_section,age<120?11:12);assert.equal(c.gate.gate_open_rows,Math.min(4,1+Math.floor(age/6)));assert.equal(c.plays.length,1);
  assert.equal(c.camera_player.sprite_index,age<87?91:92);end(c);assert.equal(c.view_xview[0],r.cameraX-2816);
 }
 assert.deepEqual(c.plays,[[93,15,false]]);assert.equal(c.camera_player.walk_previous_input,0);
});
test('Gate trigger rejects slide/midair/wrong floor/left/both/READY/Start and no duplicate gate entries',()=>{
 for(const edit of[c=>c.camera_player.sliding=true,c=>c.camera_player.grounded=false,c=>c.camera_player.y=820,c=>c.camera_player.x=2260,c=>c.held.add(37),c=>c.held.clear(),c=>c.pressed.add(13),c=>c.camera_player.mm5_startup_active=true]){const c=gateContext();edit(c);begin(c);assert.equal(c.route_busy,false);}
 const c=gateContext();begin(c);for(let i=0;i<121;i++)begin(c);c.camera_player.x=2264;begin(c);assert.equal(c.route_busy,false);assert.equal(c.plays.length,1);
});
test('Gate shares charge release/rearm, continuous charge resume and fresh ready121 fire',()=>{
 let c=gateContext();c.held.add(88);begin(c);c.route_voices.push(7);for(let i=0;i<121;i++)begin(c);assert.equal(c.camera_player.buster_charge,80);assert.equal(c.resumes,1);
 c=gateContext();c.held.add(88);begin(c);c.held.delete(88);begin(c);c.held.add(88);c.physical.add(88);for(let i=1;i<121;i++)begin(c);assert.equal(c.camera_player.buster_charge,0);assert.equal(c.route_block_fire,true);assert.equal(c.held.has(88),false);
 c=gateContext();begin(c);for(let i=0;i<120;i++)begin(c);c.held.add(88);c.physical.add(88);c.pressed.add(88);begin(c);assert.equal(c.route_block_fire,false);assert.equal(c.held.has(88),true);
});
test('Gate stale Eleventh1101 start rejected before passage',()=>{const c=gateContext();c.scr_mm1_cutman_scroll_start=()=>{c.route_start_version=1101;};assert.throws(()=>begin(c),/gate script mismatch/);});
test('Camera voice cleanup is idempotent, owned-only, including mid-opening teardown',()=>{const c=gateContext();begin(c);for(let i=0;i<32;i++)begin(c);compile('obj_mm1_cutman_camera_room_end.gml')(Object.assign(c,{scr_mm1_cutman_scroll_dispose:()=>dispose(c)}));compile('obj_mm1_cutman_camera_destroy.gml')(c);assert.deepEqual(c.stops,[555]);assert.equal(c.route_lists_ready,false);assert.equal(c.route_busy,false);});
test('Corridor camera min/max/floor, no spurious ladder return or second-gate opening',()=>{const c=gateContext();c.route_section=12;for(const x of[2200,2328,2432,2560,2944,3100]){c.camera_player.x=x;end(c);assert.equal(c.camera_player.x,Math.max(2328,Math.min(3048,x)));assert.equal(c.view_xview[0],Math.max(2304,Math.min(2816,Math.floor(c.camera_player.x)-128)));assert.equal(c.view_yview[0],720);}c.held.add(38);c.camera_player.on_ladder=true;c.camera_player.x=1832;c.camera_player.y=960;begin(c);assert.equal(c.route_busy,false);});
const g=JSON.parse(read('geometry.json')),oldg=JSON.parse(fs.readFileSync(new URL('geometry.json',eleventh)));
test('All accepted placements/regions/blocks/features and old28 atlas tiles preserved; native corridor classifications exact',()=>{
 for(const k of['cells','placements','solids','ladders','tops','objects','features'])assert.deepEqual(g[k].slice(0,oldg[k].length),oldg[k]);
 assert.equal(g.objects.length,17);assert.equal(g.solids.length,109);assert.equal(g.features.filter(f=>f.kind==='boss_gate').length,2);assert.equal(g.features.filter(f=>f.kind==='spike').length,10);assert.equal(g.features.filter(f=>f.kind==='super_cutter_dispenser').length,2);
 const a=PNG.sync.read(fs.readFileSync(new URL('bg_mm1_cutman_ladder_route_tileset.png',base))),b=PNG.sync.read(fs.readFileSync(new URL('bg_mm1_cutman_ladder_route_tileset.png',eleventh)));
 for(let t=0;t<28;t++)for(let y=0;y<16;y++){let k=((Math.floor(t/8)*16+y)*128+t%8*16)*4;assert.deepEqual(a.data.subarray(k,k+64),b.data.subarray(k,k+64));}
 for(const c of g.cells.filter(c=>c.x>=2304))if(c.class===1)assert.ok(g.solids.some(r=>c.x>=r.x&&c.x<r.x+r.width&&c.y>=r.y&&c.y<r.y+r.height));
 assert.ok(g.solids.some(r=>r.x===2304&&r.y===816&&r.width===16&&r.height===64));
});
test('Actual tile/region/feature/block GML produces exactly declared records',()=>{
 const placed=[];compile('scr_mm1_cutman_ladder_route_tiles.gml')({bg_mm1_cutman_ladder_route_tileset:1,tile_add:(id,sx,sy,w,h,x,y,d)=>placed.push({x,y,tile:sy/16*8+sx/16})});assert.deepEqual(placed,g.placements);
 const regions=[],c={obj_stage_solid:'solid',obj_stage_ladder:'ladder',obj_stage_ladder_top:'top',instance_create:(x,y,type)=>{const r={x,y,type};regions.push(r);return r;}};compile('scr_mm1_cutman_ladder_route_collision.gml')(c);assert.deepEqual(regions,g.solids.map(r=>({...r,type:'solid'})).concat(g.ladders.map(r=>({...r,type:'ladder'})),g.tops.map(r=>({...r,type:'top'}))).map(r=>({x:r.x,y:r.y,type:r.type,image_xscale:r.width/16,image_yscale:r.height/16})));
 const feature=[],fc={obj_mm1_cutman_boss_gate:'boss_gate',obj_mm1_cutman_spike:'spike',obj_mm1_super_cutter_dispenser:'super_cutter_dispenser',spr_mm1_cutman_second_gate_closed:7,instance_create:(x,y,kind)=>{const o={x,y,kind};feature.push(o);return o;}};compile('scr_mm1_cutman_ladder_route_features.gml')(fc);assert.deepEqual(feature.map(({x,y,kind})=>({x,y,kind})),g.features.map(({x,y,kind})=>({x,y,kind})));assert.equal(feature.at(-1).gate_first,false);assert.equal(feature.at(-1).mask_index,7);
 const blocks=[];compile('scr_mm1_cutman_ladder_route_blocks.gml')({obj_mm1_super_arm_block:1,instance_create:(x,y)=>blocks.push({x,y,width:32,height:32})});assert.deepEqual(blocks,g.objects);
});
test('Complete reference preserves old2304x2160 pixels and exactly reproduces native new corridor',()=>{
 const a=PNG.sync.read(fs.readFileSync(new URL('cutman_first_gate_route_reference.png',base))),b=PNG.sync.read(fs.readFileSync(new URL('cutman_eleventh_route_reference.png',eleventh))),native=PNG.sync.read(fs.readFileSync(new URL('cutman_gate_corridor_reference.png',base)));
 for(let y=0;y<2160;y++)assert.deepEqual(a.data.subarray(y*3072*4,(y*3072+2304)*4),b.data.subarray(y*2304*4,(y+1)*2304*4));
 for(let y=0;y<240;y++)assert.deepEqual(a.data.subarray(((y+720)*3072+2304)*4,((y+720)*3072+3072)*4),native.data.subarray(y*768*4,(y+1)*768*4));
});
test('Gate Draw crops four16px strips over recovered backdrop, separate second gate unaffected',()=>{const draw=compile('obj_mm1_cutman_boss_gate_draw.gml'),calls=[],c={gate_first:true,gate_open_rows:0,x:2272,y:816,sprite_index:1,spr_mm1_cutman_boss_gate_open_backdrop:2,sprite_get_width:()=>32,draw_sprite:(...a)=>calls.push(['backdrop',...a]),draw_sprite_part:(...a)=>calls.push(['gate',...a])};for(let rows=0;rows<=4;rows++){calls.length=0;c.gate_open_rows=rows;draw(c);assert.equal(calls.filter(c=>c[0]==='backdrop').length,rows>0?1:0);assert.equal(calls.filter(c=>c[0]==='gate').length,rows<4?1:0);if(rows<4)assert.equal(calls.at(-1)[6],64-rows*16);}c.gate_first=false;c.gate_open_rows=0;calls.length=0;draw(c);assert.equal(calls.length,1);});
test('No obsolete introspection/global audio stops; room width guard and resource ownership',()=>{const all=fs.readdirSync(base).filter(f=>f.endsWith('.gml')).map(read).join('\n');assert.ok(!/variable_(global|instance)_exists|audio_stop_all|instance_deactivate/.test(all));const c=gateContext();c.room_width=2304;assert.throws(()=>create(c),/3072x2160/);});
test('New corridor reconstructed from actual tile atlas placements plus separate second-gate sprite',()=>{
 const atlas=PNG.sync.read(fs.readFileSync(new URL('bg_mm1_cutman_ladder_route_tileset.png',base))),native=PNG.sync.read(fs.readFileSync(new URL('cutman_gate_corridor_reference.png',base))),second=PNG.sync.read(fs.readFileSync(new URL('spr_mm1_cutman_second_gate_closed.png',base))),scene=new PNG({width:768,height:240});
 for(let i=0;i<768*240;i++)scene.data.set([72,205,222,255],i*4);
 for(const p of g.placements.filter(p=>p.x>=2304))for(let y=0;y<16;y++)for(let x=0;x<16;x++){let k=((Math.floor(p.tile/8)*16+y)*128+p.tile%8*16+x)*4;if(atlas.data[k+3])scene.data.set(atlas.data.subarray(k,k+4),((p.y-720+y)*768+p.x-2304+x)*4);}
 for(let y=0;y<64;y++)second.data.copy(scene.data,((96+y)*768+752)*4,y*64,(y+1)*64);
 assert.deepEqual(scene.data,native.data);
});
test('Actual MM5 wall probes resolve native one-way left boundary and closed second gate without adding gate art to terrain',()=>{
 const dir=new URL('../../Assets/Mega Man/MM5/Controller/Collision/',`+JSON.stringify(previous.href)+String.raw`),wall=f=>new Function('c','with(c){'+fs.readFileSync(new URL(f,dir),'utf8')+'}');
 const regions=g.solids.map(r=>({bbox_left:r.x,bbox_top:r.y,bbox_right:r.x+r.width-1,bbox_bottom:r.y+r.height-1})).concat(g.features.filter(f=>f.kind==='boss_gate').map(r=>({bbox_left:r.x,bbox_top:r.y,bbox_right:r.x+r.width-1,bbox_bottom:r.y+r.height-1})));
 const c={argument0:2327.25,argument1:868,argument2:-1,slide_overhang_fall:false,grounded:true,fall_speed:0,noone:-4,obj_stage_solid:1,floor:Math.floor,sign:Math.sign,min:Math.min,max:Math.max,x:2328.25,collision_point:(x,y)=>regions.find(r=>x>=r.bbox_left&&x<=r.bbox_right&&y>=r.bbox_top&&y<=r.bbox_bottom)||-4};
 assert.equal(wall('scr_mm5_player_wall_blocked.gml')(c),true);assert.equal(wall('scr_mm5_player_wall_limit.gml')(c),2328);
 c.argument0=3049;c.argument2=1;c.x=3048;assert.equal(wall('scr_mm5_player_wall_blocked.gml')(c),true);assert.equal(wall('scr_mm5_player_wall_limit.gml')(c),3048);
 c.argument0=2600;assert.equal(wall('scr_mm5_player_wall_blocked.gml')(c),false);
});
console.log(tests+' first-gate source/model checks PASS; NOT GameMaker compiler/GPU/scheduler/collision certification.');
`;
execFileSync(process.execPath,['--input-type=module','--eval',harness],{cwd:new URL('.',import.meta.url),stdio:'inherit'});
