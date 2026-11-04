// Supported actual GML source with engine mocks, plus original ROM traces. NOT GameMaker.
import {execFileSync} from'node:child_process';
import fs from'node:fs';import assert from'node:assert/strict';import{PNG}from'pngjs';
const first=new URL('../../Assets/Cut Man/Stage/First Ladder Transition/',import.meta.url);
const previous=new URL('../../Assets/Cut Man/Stage/Second Ladder Transition/',import.meta.url);
const third=new URL('../../Assets/Cut Man/Stage/Third Ladder Transition/',import.meta.url);
const corrected=new URL('../../Assets/Cut Man/Stage/Super Cutter Dispenser/',import.meta.url),fourth=new URL('../../Assets/Cut Man/Stage/Fourth Ladder Transition/',import.meta.url);
const fifth=new URL('../../Assets/Cut Man/Stage/Fifth Ladder Transition/',import.meta.url);
const sixth=new URL('../../Assets/Cut Man/Stage/Sixth Ladder Transition/',import.meta.url);
const seventh=new URL('../../Assets/Cut Man/Stage/Seventh Ladder Transition/',import.meta.url);
const eighth=new URL('../../Assets/Cut Man/Stage/Eighth Ladder Transition/',import.meta.url);
const base=new URL('../../Assets/Cut Man/Stage/Ninth Ladder Transition/',import.meta.url),old=new URL('../../Assets/Cut Man/Stage/Opening Route/',import.meta.url),read=f=>fs.readFileSync(fs.existsSync(new URL(f,base))?new URL(f,base):fs.existsSync(new URL(f,previous))?new URL(f,previous):new URL(f,first),'utf8');
const compile=f=>new Function('c','with(c){'+read(f).replace(/\bexit;/g,'return;')+'}');
const begin=compile('obj_mm1_cutman_camera_begin_step.gml'),end=compile('obj_mm1_cutman_camera_end_step.gml'),finish=compile('scr_mm1_cutman_scroll_finish.gml'),start=compile('scr_mm1_cutman_scroll_start.gml'),create=compile('obj_mm1_cutman_camera_create.gml'),dispose=compile('scr_mm1_cutman_scroll_dispose.gml');
let tests=0;function test(n,fn){fn();tests++;console.log('PASS',n);}
function context(){
 const c={};for(const m of read('obj_mm1_cutman_camera_create.gml').matchAll(/^([a-z_]+)\s*=/gm))c[m[1]]=null;
 Object.assign(c,{noone:-4,room_width:2048,room_height:2160,room_speed:60,view_enabled:true,view_visible:[true],view_wview:[256],view_hview:[240],view_object:[-4],view_xview:[0],view_yview:[1920],held:new Set(),pressed:new Set(),physical:new Set(),vk_enter:13,vk_up:38,vk_down:40,obj_mm5_megaman:1,spr_mm5_megaman_climb:2,ord:s=>s.charCodeAt(0),asset_get_index:()=>-1,ds_list_create:()=>[],ds_list_clear:a=>a.splice(0),ds_list_size:a=>a.length,ds_list_find_value:(a,i)=>a[i],ds_list_destroy:a=>a.splice(0),floor:Math.floor,abs:Math.abs,clamp:(x,a,b)=>Math.max(a,Math.min(b,x)),show_error:s=>{throw Error(s);},audio_is_paused:()=>true,audio_resume_sound:()=>{c.resumes++;},resumes:0,shots:['basic','mid','full']});
 c.obj_mm5_buster_shot={instance_destroy:()=>{c.shots=[];}}; // Mock group only; GML descendant iteration itself NOT certified.
 c.keyboard_check=k=>c.held.has(k);c.keyboard_check_pressed=k=>c.pressed.has(k);c.keyboard_check_direct=k=>c.physical.has(k);c.keyboard_clear=k=>{c.held.delete(k);c.pressed.delete(k);};
 c.instance_exists=v=>v&&typeof v==='object'&&v.player===true;c.instance_find=()=>c.camera_player;
 c.scr_mm1_cutman_scroll_start=d=>{c.argument0=d;start(c);};c.scr_mm1_cutman_scroll_finish=()=>finish(c);
 create(c);c.camera_player={player:true,x:984,y:1924.96875,on_ladder:true,ladder_speed:1.296875,fall_speed:0,buster_fire_key:88,buster_pose_timer:0,buster_charge:80,mm5_startup_active:false,anim_climb_timer:0,anim_climb_frame:0,ladder_moving:true};
 return c;
}
// Validate all eighteen trajectories, including the eight accepted prior connections.
for(const [label,dir,section,folder,file,trigger,unlock,localY]of[
 ['first up',-1,0,first,'native-up.json',60,126,4.96875],
 ['first down',1,1,first,'native-down.json',32,126,231.96875],
 ['second up',-1,1,previous,'up-continuation.json',25,126,4.96875],
 ['second down',1,2,previous,'native-down.json',32,95,231.96875],
 ['third up',-1,2,third,'up-continuation.json',25,126,4.96875],
 ['third down',1,3,third,'native-down.json',14,95,231.96875],
 ['fourth up',-1,3,fourth,'up-continuation.json',49,126,4.96875],
 ['fourth down',1,4,fourth,'native-down.json',14,95,231.96875],
 ['fifth up',-1,4,fifth,'up-continuation.json',49,126,4.96875],
 ['fifth down',1,5,fifth,'native-down.json',14,126,231.96875],
 ['sixth up',-1,5,sixth,'up-continuation.json',49,126,4.96875],
 ['sixth down',1,6,sixth,'native-down.json',14,95,231.96875],
 ['seventh up',-1,6,seventh,'up-continuation.json',49,126,4.96875],
 ['seventh down',1,7,seventh,'native-down.json',14,95,231.96875],
 ['eighth up',-1,7,eighth,'up-continuation.json',49,126,4.96875],
 ['eighth down',1,8,eighth,'native-down.json',14,95,231.96875],
 ['ninth down',1,8,base,'native-down.json',14,126,231.96875],
 ['ninth up',-1,9,base,'up-continuation.json',43,126,4.96875],
])test(`Actual GML vs original ${label}: every busy frame and ready${unlock}`,()=>{
 const c=context(),rows=JSON.parse(fs.readFileSync(new URL(file,folder))).rows,origin=section===9?240:1920-section*240;c.route_section=section;c.camera_player.x=label.startsWith('ninth')?1992:label.startsWith('eighth')?1336:label.startsWith('seventh')?1320:(label.startsWith('fifth')||label.startsWith('sixth')||label.startsWith('seventh')||label.startsWith('eighth'))?1496:label.startsWith('fourth')?824:984;c.view_xview[0]=label.startsWith('ninth')?1792:(label.startsWith('fifth')||label.startsWith('sixth')||label.startsWith('seventh')||label.startsWith('eighth'))?1280:768;c.view_yview[0]=origin;c.camera_player.y=origin+localY;c.held.add(dir===-1?38:40);begin(c);assert.ok(c.route_busy);
 for(let age=0;age<unlock;age++){
  if(age)begin(c);const r=rows.find(r=>r.frame===trigger+age),dest=origin+dir*240;
  const cam=age<32?origin:age<92?origin+(dir===-1?-240:0)+r.cameraY:dest;
  const y=age<32?origin+r.playerY:age<92?origin+(dir===-1?-240:0)+r.cameraY+r.playerY:dest+r.playerY;
  assert.ok(c.route_busy,`${label} busy${age}`);assert.equal(c.view_xview[0],label.startsWith('ninth')?1792:(label.startsWith('fifth')||label.startsWith('sixth')||label.startsWith('seventh')||label.startsWith('eighth'))?1280:768);assert.equal(c.view_yview[0],cam,`${label} camera${age}`);assert.equal(c.camera_player.y,y,`${label} player${age}`);end(c);assert.equal(c.view_yview[0],cam);
 }
 begin(c);assert.equal(c.route_busy,false);assert.equal(c.route_section,label.startsWith('ninth')?(dir===1?9:8):section-dir);assert.equal(c.route_tick,unlock);
});
test('Independent fresh-input probes verify ninth up126/down126, not stripe flags',()=>{
 for(const [file,ready,still,moved]of[['native-ready.json',126,229,228.25],['native-down-ready.json',126,7,7.75]]){const p=JSON.parse(read(file)).results;assert.equal(p.length,6);for(const r of p)assert.equal(r.finalY,r.pressAge<ready?still:moved);}
});
test('New section bounds/outgoing limit, falling return and fresh ready95 fire',()=>{
 const c=context();c.route_section=8;c.camera_player.y=4;c.held.add(38);begin(c);assert.equal(c.route_busy,false);end(c);assert.equal(c.view_yview[0],0);
 c.camera_player.x=1336;c.view_xview[0]=1280;c.held.clear();c.camera_player.on_ladder=false;c.camera_player.fall_speed=5;c.camera_player.y=233;begin(c);assert.ok(c.route_busy);assert.equal(c.route_unlock,95);for(let i=0;i<94;i++)begin(c);c.held.add(88);c.pressed.add(88);c.physical.add(88);begin(c);assert.equal(c.route_busy,false);assert.equal(c.route_block_fire,false);assert.equal(c.camera_player.fall_speed,5);
});
test('Accepted layout unchanged at same coordinates; all nine seams have merged ladders',()=>{
 const prev=JSON.parse(fs.readFileSync(new URL('geometry.json',eighth))),next=JSON.parse(read('geometry.json'));assert.deepEqual(next.cells.slice(0,prev.cells.length),prev.cells);assert.deepEqual(next.objects.slice(0,13),prev.objects);
 for(const [y,height]of[[208,96],[448,160],[688,96],[912,112],[1168,112],[1408,80],[1648,80],[1888,96]])assert.ok(next.ladders.some(r=>r.x===(y===208?1328:y===448?1312:y<=912?1488:y===1168?816:976)&&r.y===y&&r.height===height));assert.ok(next.ladders.some(r=>r.x===1984&&r.y===192&&r.height===96));assert.ok(!next.tops.some(r=>r.x===1984&&r.y===240));for(const seam of[240,480,720,960,1200,1440,1680,1920])assert.ok(!next.tops.some(r=>r.x===(seam===240?1328:seam===480?1312:seam<=960?1488:seam===1200?816:976)&&r.y===seam));
});
test('Entry requires correct seam/direction/attached state; shooting/READY/Start prevents race',()=>{
 for(const change of[c=>c.camera_player.mm5_startup_active=true,c=>c.camera_player.x=800,c=>c.camera_player.y=1950,c=>c.camera_player.buster_pose_timer=4,c=>c.pressed.add(13),c=>c.pressed.add(88)]){const c=context();c.held.add(38);change(c);begin(c);assert.equal(c.route_busy,false);}
 const c=context();c.route_section=1;c.camera_player.on_ladder=false;c.camera_player.y=1913;c.camera_player.fall_speed=6;begin(c);assert.ok(c.route_busy);assert.equal(c.route_dir,1);
});
test('Charge release cancels stale charge; old continuous hold resumes own paused voice',()=>{
 const c=context();c.held.add(38);c.held.add(88);c.physical.add(88);begin(c);c.route_voices.push(7);for(let i=0;i<126;i++)begin(c);assert.equal(c.camera_player.buster_charge,80);assert.equal(c.resumes,1);
 const d=context();d.held.add(38);d.held.add(88);begin(d);d.held.delete(88);begin(d);d.held.add(88);d.physical.add(88);for(let i=1;i<126;i++)begin(d);assert.equal(d.camera_player.buster_charge,0);assert.equal(d.route_block_fire,true);assert.equal(d.held.has(88),false);assert.equal(d.route_busy,false);
});
test('Fresh fire on ready126 is allowed; older new hold still release-rearmed',()=>{const c=context();c.held.add(38);begin(c);for(let i=0;i<125;i++)begin(c);c.held.add(88);c.physical.add(88);c.pressed.add(88);begin(c);assert.equal(c.route_busy,false);assert.equal(c.route_block_fire,false);assert.ok(c.held.has(88));});
test('Cleanup is idempotent, no frozen actors, view selects correct section',()=>{const c=context();c.held.add(38);begin(c);dispose(c);dispose(c);assert.equal(c.route_busy,false);assert.equal(c.route_lists_ready,false);const d=context();d.camera_player.x=984;end(d);assert.equal(d.view_yview[0],1920);d.route_section=1;d.camera_player.x=750;end(d);assert.equal(d.camera_player.x,776);assert.equal(d.view_xview[0],768);assert.equal(d.view_yview[0],1680);});
const g=JSON.parse(read('geometry.json'));
test('Actual geometry script produces declared regions; no permanent block solids or seam platform',()=>{
 const regions=[],ctx={obj_stage_solid:'solid',obj_stage_ladder:'ladder',obj_stage_ladder_top:'top',instance_create:(x,y,type)=>{let r={x,y,type};regions.push(r);return r;}};
 compile('scr_mm1_cutman_ladder_route_collision.gml')(ctx);
 for(const [list,type]of[['solids','solid'],['ladders','ladder'],['tops','top']])assert.deepEqual(regions.filter(r=>r.type===type).map(r=>({x:r.x,y:r.y,width:r.image_xscale*16,height:r.image_yscale*16})),g[list]);
 for(const cell of g.cells){const hit=r=>cell.x>=r.x&&cell.x<r.x+r.width&&cell.y>=r.y&&cell.y<r.y+r.height;assert.equal(g.solids.some(hit),cell.class===1&&!cell.object);assert.equal(g.ladders.some(hit),cell.class===2&&!cell.object);}
 assert.ok(g.ladders.some(r=>r.x===976&&r.y===1888&&r.height===96));assert.ok(!g.tops.some(r=>r.x===976&&(r.y===1440||r.y===1680||r.y===1920)));
});
test('ALL THIRTEEN blocks placed by script, none require room editor instances',()=>{const b=[],c={obj_mm1_super_arm_block:1,instance_create:(x,y)=>b.push({x,y,width:32,height:32})};compile('scr_mm1_cutman_ladder_route_blocks.gml')(c);assert.deepEqual(b,g.objects);assert.equal(b.length,13);assert.equal(b.filter(b=>b.x<256).length,4);});
test('Expanded atlas preserves original tiles; actual2076 tile calls +13blocks+two dispensers reconstruct reference',()=>{
 const atlas=PNG.sync.read(fs.readFileSync(new URL('bg_mm1_cutman_ladder_route_tileset.png',base))),ref=PNG.sync.read(fs.readFileSync(new URL('cutman_ninth_route_reference.png',base))),b=PNG.sync.read(fs.readFileSync(new URL('../../Assets/Stage Objects/Super Arm/spr_mm1_super_arm_block.png',import.meta.url))),canvas=Buffer.alloc(2048*2160*4);for(let i=0;i<2048*2160;i++)canvas.set([72,205,222,255],i*4);
 let n=0;for(const m of read('scr_mm1_cutman_ladder_route_tiles.gml').matchAll(/tile_add\(bg_mm1_cutman_ladder_route_tileset, (\d+), (\d+), 16, 16, (\d+), (\d+), 1000\);/g)){const[ax,ay,x,y]=m.slice(1).map(Number);for(let dy=0;dy<16;dy++)for(let dx=0;dx<16;dx++){const k=((ay+dy)*128+ax+dx)*4;if(atlas.data[k+3])canvas.set(atlas.data.subarray(k,k+4),((y+dy)*2048+x+dx)*4);}n++;}assert.equal(n,2076);
 for(const o of g.objects)for(let y=0;y<32;y++)b.data.copy(canvas,((o.y+y)*2048+o.x)*4,y*128,(y+1)*128);const feature=PNG.sync.read(fs.readFileSync(new URL('spr_mm1_super_cutter_dispenser.png',base)));for(const f of g.features)for(let y=0;y<80;y++)for(let x=0;x<96;x++){const k=(y*96+x)*4;if(feature.data[k+3])canvas.set(feature.data.subarray(k,k+4),((f.y+y)*2048+f.x+x)*4);}assert.deepEqual(canvas,ref.data);
});
test('First13atlas tiles unchanged; retained blocks stay separate, no new upper block',()=>{const a=PNG.sync.read(fs.readFileSync(new URL('bg_mm1_cutman_opening_tileset.png',old))),b=PNG.sync.read(fs.readFileSync(new URL('bg_mm1_cutman_ladder_route_tileset.png',base)));for(let t=0;t<13;t++)for(let y=0;y<16;y++){const k=((Math.floor(t/8)*16+y)*128+t%8*16)*4;assert.deepEqual(b.data.subarray(k,k+64),a.data.subarray(k,k+64));}assert.deepEqual(g.objects.at(-1),{x:1376,y:368,width:32,height:32});assert.ok(g.objects.every(o=>o.y>=240));for(const c of g.cells.filter(c=>c.object&&c.y<240))assert.equal(g.solids.some(r=>c.x>=r.x&&c.x<r.x+r.width&&c.y>=r.y&&c.y<r.y+r.height),false);});
test('Horizontal camera actual EndStep matches900 original controlled traversal frames',()=>{const c=context();c.route_section=4;for(const r of JSON.parse(fs.readFileSync(new URL('native-camera.json',fourth))).rows){c.camera_player.x=r.x-1024;end(c);assert.equal(c.view_xview[0],r.cameraX-1024);assert.equal(c.view_yview[0],960);}c.route_section=0;c.camera_player.x=1400;end(c);assert.equal(c.camera_player.x,1016);});
test('Wide-stripe pit does not invent a return teleport into narrow lower room',()=>{const c=context();c.route_section=4;c.view_xview[0]=1024;c.camera_player.x=1192;c.camera_player.y=1193;c.camera_player.on_ladder=false;c.camera_player.fall_speed=6;begin(c);assert.equal(c.route_busy,false);});
test('Both accepted dispensers stay at identical coordinates, sixty marked cells and no duplicate scenery',()=>{const f=[];compile('scr_mm1_cutman_ladder_route_features.gml')({obj_mm1_super_cutter_dispenser:9,instance_create:(x,y,type)=>f.push({x,y,type})});assert.deepEqual(f,[{x:864,y:1088,type:9},{x:1376,y:128,type:9}]);assert.deepEqual(g.features,[{kind:'super_cutter_dispenser',x:864,y:1088,width:96,height:80},{kind:'super_cutter_dispenser',x:1376,y:128,width:96,height:80}]);for(const f of g.features)assert.ok(!g.placements.some(p=>p.x>=f.x&&p.x<f.x+96&&p.y>=f.y&&p.y<f.y+80));assert.equal(g.cells.filter(c=>c.feature==='super_cutter_dispenser').length,60);});
test('Matched coordinate contract rejects old room height; opening and last-room camera bounds',()=>{const c=context();c.room_height=1920;assert.throws(()=>create(c),/2048x2160/);const w=context();w.room_width=1536;assert.throws(()=>create(w),/2048x2160/);const d=context();end(d);assert.equal(d.view_yview[0],1920);d.route_section=8;d.camera_player.x=1000;end(d);assert.equal(d.camera_player.x,1288);assert.equal(d.view_xview[0],1280);assert.equal(d.view_yview[0],0);});
test('Seventh seam uses left ladder only, leaving prior right-hand return intact',()=>{
 for(const [section,key,y,x]of[[6,38,484.96875,1496],[7,40,471.96875,1496]]){const c=context();c.route_section=section;c.view_yview[0]=1920-section*240;c.view_xview[0]=1280;c.camera_player.x=x;c.camera_player.y=y;c.held.add(key);begin(c);assert.equal(c.route_busy,false);}
 const c=context();c.route_section=8;c.camera_player.x=1992;c.camera_player.y=4;c.held.add(38);begin(c);assert.equal(c.route_busy,false);
});
test('New wide camera EndStep matches900 original controlled frames, bounds and old narrow rooms stay fixed',()=>{
 const c=context();c.route_section=8;
 for(const r of JSON.parse(fs.readFileSync(new URL('native-camera.json',eighth))).rows){c.camera_player.x=r.x-2048;end(c);assert.equal(c.view_xview[0],r.cameraX-2048);assert.equal(c.view_yview[0],0);}
 c.camera_player.x=2100;end(c);assert.equal(c.camera_player.x,2040);assert.equal(c.view_xview[0],1792);
 c.route_section=7;end(c);assert.equal(c.camera_player.x,1528);assert.equal(c.view_xview[0],1280);assert.equal(c.view_yview[0],240);
});
test('Right-hand ninth descent is separate from older left-hand return',()=>{
 for(const [section,key,y]of[[7,38,244.96875],[8,40,231.96875]]){const c=context();c.route_section=section;c.camera_player.x=1320;c.camera_player.y=y;c.view_xview[0]=1280;c.held.add(key);begin(c);assert.equal(c.route_busy,false);}
 for(const falling of[false,true]){const c=context();c.route_section=8;c.camera_player.x=1992;c.camera_player.y=233;c.view_xview[0]=1792;c.view_yview[0]=0;c.camera_player.on_ladder=!falling;c.camera_player.fall_speed=falling?6:0;c.held.add(40);begin(c);assert.ok(c.route_busy);assert.equal(c.route_target_section,9);assert.equal(c.route_unlock,126);}
 const c=context();c.route_section=8;c.camera_player.x=1336;c.camera_player.y=231.96875;c.view_xview[0]=1280;c.view_yview[0]=0;c.held.add(40);begin(c);assert.ok(c.route_busy);assert.equal(c.route_dir,1);assert.equal(c.route_unlock,95);
});
test('Accepted entire scene unchanged outside new lower room, no extra blocks or shifted feature',()=>{
 const prev=PNG.sync.read(fs.readFileSync(new URL('cutman_eighth_route_reference.png',eighth))),now=PNG.sync.read(fs.readFileSync(new URL('cutman_ninth_route_reference.png',base)));
 assert.equal(now.width,2048);assert.equal(now.height,2160);
 for(let y=0;y<2160;y++){const outside=y>=240&&y<480?1792:2048;assert.deepEqual(now.data.subarray(y*2048*4,(y*2048+outside)*4),prev.data.subarray(y*2048*4,(y*2048+outside)*4));}
 assert.equal(g.objects.length,13);assert.deepEqual(g.objects,JSON.parse(fs.readFileSync(new URL('geometry.json',eighth))).objects);
});
test('Ninth fixed camera and unconnected lower exit have independent direction guards',()=>{
 for(const falling of[false,true]){const c=context();c.route_section=9;c.camera_player.x=1896;c.camera_player.y=473;c.camera_player.on_ladder=!falling;c.camera_player.fall_speed=falling?6:0;c.held.add(40);begin(c);assert.equal(c.route_busy,false);}
 const c=context();c.route_section=9;c.camera_player.x=1600;end(c);assert.equal(c.camera_player.x,1800);assert.equal(c.view_xview[0],1792);assert.equal(c.view_yview[0],240);c.camera_player.x=2200;end(c);assert.equal(c.camera_player.x,2040);
 const d=context();d.route_section=8;d.camera_player.x=1700;d.camera_player.y=233;d.camera_player.on_ladder=false;d.camera_player.fall_speed=6;d.view_xview[0]=1572;begin(d);assert.equal(d.route_busy,false);
});
test('Repeated ninth down/up resets target and preserves older eighth left return95',()=>{
 const c=context();c.route_section=8;c.camera_player.x=1992;c.camera_player.y=231.96875;c.view_xview[0]=1792;c.held.add(40);begin(c);assert.equal(c.route_target_section,9);for(let i=0;i<126;i++)begin(c);end(c);assert.equal(c.route_section,9);assert.equal(c.view_yview[0],240);assert.equal(c.view_xview[0],1792);
 c.held.clear();c.held.add(38);c.camera_player.y=244.96875;begin(c);assert.equal(c.route_target_section,8);for(let i=0;i<126;i++)begin(c);end(c);assert.equal(c.route_section,8);assert.equal(c.view_yview[0],0);assert.equal(c.view_xview[0],1792);
 c.held.clear();c.held.add(40);c.camera_player.x=1336;c.camera_player.y=231.96875;c.view_xview[0]=1280;begin(c);assert.equal(c.route_target_section,7);assert.equal(c.route_unlock,95);for(let i=0;i<95;i++)begin(c);end(c);assert.equal(c.route_section,7);assert.equal(c.view_yview[0],240);assert.equal(c.view_xview[0],1280);
});
test('Video regression: original ninth camera plus older eighth start silently resets arrival to section0',()=>{
 const historical=f=>execFileSync('git',['show',`1cf4f20:Assets/Cut Man/Stage/Ninth Ladder Transition/${f}`],{cwd:new URL('../../',import.meta.url),encoding:'utf8'});
 const originalBegin=new Function('c','with(c){'+historical('obj_mm1_cutman_camera_begin_step.gml').replace(/\bexit;/g,'return;')+'}');
 const olderStart=new Function('c','with(c){'+fs.readFileSync(new URL('scr_mm1_cutman_scroll_start.gml',eighth),'utf8').replace(/\bexit;/g,'return;')+'}');
 const c=context();c.scr_mm1_cutman_scroll_start=d=>{c.argument0=d;olderStart(c);};c.held.add(38);originalBegin(c);assert.equal(c.route_target_section,0);
 for(let i=0;i<126;i++)originalBegin(c);end(c);assert.equal(c.route_section,0);assert.equal(c.view_yview[0],1920);assert.equal(c.camera_player.y,1909);assert.ok(c.camera_player.y<c.view_yview[0]);
});
test('Mixed start script now stops immediately with a named repair instead of a silent camera reset',()=>{
 const olderStart=new Function('c','with(c){'+fs.readFileSync(new URL('scr_mm1_cutman_scroll_start.gml',eighth),'utf8').replace(/\bexit;/g,'return;')+'}');
 for(const section of[0,5,8]){const c=context();c.route_section=section;c.route_start_version=901;c.camera_player.x=section===0?984:section===5?1496:1992;c.camera_player.y=section===8?231.96875:1920-section*240+4.96875;c.view_xview[0]=section===0?768:section===5?1280:1792;c.held.add(section===8?40:38);c.scr_mm1_cutman_scroll_start=d=>{c.argument0=d;olderStart(c);};assert.throws(()=>begin(c),/replace the ENTIRE scr_mm1_cutman_scroll_start/);assert.equal(c.route_tick,0);assert.equal(c.route_start_version,0);}
});
test('Matched opening arrival stays in section1 after unlock and subsequent neutral frames',()=>{
 const c=context();c.held.add(38);begin(c);assert.equal(c.route_target_section,1);assert.equal(c.route_start_version,901);for(let i=0;i<126;i++)begin(c);c.held.clear();
 for(let i=0;i<120;i++){begin(c);end(c);assert.equal(c.route_section,1);assert.equal(c.view_xview[0],768);assert.equal(c.view_yview[0],1680);assert.equal(c.camera_player.y-c.view_yview[0],229);}
});
test('Source resource/compatibility contracts: minimal guards, no global activation/stop/music edits',()=>{
 const all=fs.readdirSync(base).filter(f=>f.endsWith('.gml')).map(read).join('\n');assert.ok(!/\b(variable_global_exists|variable_instance_exists|instance_activate_all|instance_deactivate_all|audio_stop_all|audio_pause_all|camera_create_view)\s*\(/.test(all));for(const f of['obj_mm5_megaman_step_route_prefix.gml','obj_mm5_pause_menu_begin_step_route_prefix.gml'])assert.ok(read(f).includes('if (scr_mm1_cutman_route_busy()) exit;'));assert.ok(read('scr_mm1_cutman_scroll_start.gml').includes('with (obj_mm5_buster_shot) instance_destroy();'));
});
console.log(`${tests} route source/model checks PASS; NOT GameMaker compiler/GPU/scheduler/native whole-stage traversal certification.`);
