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
const ninth=new URL('../../Assets/Cut Man/Stage/Ninth Ladder Transition/',import.meta.url);
const tenth=new URL('../../Assets/Cut Man/Stage/Tenth Ladder Transition/',import.meta.url);
const base=new URL('../../Assets/Cut Man/Stage/Eleventh Ladder Transition/',import.meta.url),old=new URL('../../Assets/Cut Man/Stage/Opening Route/',import.meta.url),read=f=>fs.readFileSync(fs.existsSync(new URL(f,base))?new URL(f,base):fs.existsSync(new URL(f,tenth))?new URL(f,tenth):fs.existsSync(new URL(f,previous))?new URL(f,previous):new URL(f,first),'utf8');
const compile=f=>new Function('c','with(c){'+read(f).replace(/\bexit;/g,'return;')+'}');
const begin=compile('obj_mm1_cutman_camera_begin_step.gml'),end=compile('obj_mm1_cutman_camera_end_step.gml'),finish=compile('scr_mm1_cutman_scroll_finish.gml'),start=compile('scr_mm1_cutman_scroll_start.gml'),create=compile('obj_mm1_cutman_camera_create.gml'),dispose=compile('scr_mm1_cutman_scroll_dispose.gml');
let tests=0;function test(n,fn){fn();tests++;console.log('PASS',n);}
function context(){
 const c={};for(const m of read('obj_mm1_cutman_camera_create.gml').matchAll(/^([a-z_]+)\s*=/gm))c[m[1]]=null;
 Object.assign(c,{noone:-4,room_width:2304,room_height:2160,room_speed:60,view_enabled:true,view_visible:[true],view_wview:[256],view_hview:[240],view_object:[-4],view_xview:[0],view_yview:[1920],held:new Set(),pressed:new Set(),physical:new Set(),vk_enter:13,vk_up:38,vk_down:40,obj_mm5_megaman:1,spr_mm5_megaman_climb:2,ord:s=>s.charCodeAt(0),asset_get_index:()=>-1,ds_list_create:()=>[],ds_list_clear:a=>a.splice(0),ds_list_size:a=>a.length,ds_list_find_value:(a,i)=>a[i],ds_list_destroy:a=>a.splice(0),floor:Math.floor,abs:Math.abs,clamp:(x,a,b)=>Math.max(a,Math.min(b,x)),show_error:s=>{throw Error(s);},audio_is_paused:()=>true,audio_resume_sound:()=>{c.resumes++;},resumes:0,shots:['basic','mid','full']});
 c.obj_mm5_buster_shot={instance_destroy:()=>{c.shots=[];}}; // Mock group only; GML descendant iteration itself NOT certified.
 c.keyboard_check=k=>c.held.has(k);c.keyboard_check_pressed=k=>c.pressed.has(k);c.keyboard_check_direct=k=>c.physical.has(k);c.keyboard_clear=k=>{c.held.delete(k);c.pressed.delete(k);};
 c.instance_exists=v=>v&&typeof v==='object'&&v.player===true;c.instance_find=()=>c.camera_player;
 c.scr_mm1_cutman_scroll_start=d=>{c.argument0=d;start(c);};c.scr_mm1_cutman_scroll_finish=()=>finish(c);
 create(c);c.camera_player={player:true,x:984,y:1924.96875,on_ladder:true,ladder_speed:1.296875,fall_speed:0,buster_fire_key:88,buster_pose_timer:0,buster_charge:80,mm5_startup_active:false,anim_climb_timer:0,anim_climb_frame:0,ladder_moving:true};
 return c;
}
// Validate all twenty-two trajectories, including the ten accepted prior connections.
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
 ['ninth down',1,8,ninth,'native-down.json',14,126,231.96875],
 ['ninth up',-1,9,ninth,'up-continuation.json',43,126,4.96875],
 ['tenth down',1,9,tenth,'native-down.json',14,126,231.96875],
 ['tenth up',-1,10,tenth,'up-continuation.json',50,95,4.96875],
 ['eleventh down',1,10,base,'native-down.json',14,126,231.96875],
 ['eleventh up',-1,11,base,'up-continuation.json',50,95,4.96875],
])test(`Actual GML vs original ${label}: every busy frame and ready${unlock}`,()=>{
 const c=context(),rows=JSON.parse(fs.readFileSync(new URL(file,folder))).rows,origin=section>=9?(section-8)*240:1920-section*240;c.route_section=section;c.camera_player.x=label.startsWith('eleventh')?1832:label.startsWith('tenth')?1896:label.startsWith('ninth')?1992:label.startsWith('eighth')?1336:label.startsWith('seventh')?1320:(label.startsWith('fifth')||label.startsWith('sixth')||label.startsWith('seventh')||label.startsWith('eighth'))?1496:label.startsWith('fourth')?824:984;c.view_xview[0]=(label.startsWith('ninth')||label.startsWith('tenth')||label.startsWith('eleventh'))?1792:(label.startsWith('fifth')||label.startsWith('sixth')||label.startsWith('seventh')||label.startsWith('eighth'))?1280:768;c.view_yview[0]=origin;c.camera_player.y=origin+localY;c.held.add(dir===-1?38:40);begin(c);assert.ok(c.route_busy);
 for(let age=0;age<unlock;age++){
  if(age)begin(c);const r=rows.find(r=>r.frame===trigger+age),dest=origin+dir*240;
  const cam=age<32?origin:age<92?origin+(dir===-1?-240:0)+r.cameraY:dest;
  const y=age<32?origin+r.playerY:age<92?origin+(dir===-1?-240:0)+r.cameraY+r.playerY:dest+r.playerY;
  assert.ok(c.route_busy,`${label} busy${age}`);assert.equal(c.view_xview[0],(label.startsWith('ninth')||label.startsWith('tenth')||label.startsWith('eleventh'))?1792:(label.startsWith('fifth')||label.startsWith('sixth')||label.startsWith('seventh')||label.startsWith('eighth'))?1280:768);assert.equal(c.view_yview[0],cam,`${label} camera${age}`);assert.equal(c.camera_player.y,y,`${label} player${age}`);end(c);assert.equal(c.view_yview[0],cam);
 }
 begin(c);assert.equal(c.route_busy,false);assert.equal(c.route_section,label.startsWith('eleventh')?(dir===1?11:10):label.startsWith('tenth')?(dir===1?10:9):label.startsWith('ninth')?(dir===1?9:8):section-dir);assert.equal(c.route_tick,unlock);
});
test('Independent fresh-input probes verify eleventh up95/down126, not stripe flags',()=>{
 for(const [file,ready,still,moved]of[['native-ready.json',95,229,228.25],['native-down-ready.json',126,7,7.75]]){const p=JSON.parse(read(file)).results;assert.equal(p.length,6);for(const r of p)assert.equal(r.finalY,r.pressAge<ready?still:moved);}
});
test('New section bounds/outgoing limit, falling return and fresh ready95 fire',()=>{
 const c=context();c.route_section=8;c.camera_player.y=4;c.held.add(38);begin(c);assert.equal(c.route_busy,false);end(c);assert.equal(c.view_yview[0],0);
 c.camera_player.x=1336;c.view_xview[0]=1280;c.held.clear();c.camera_player.on_ladder=false;c.camera_player.fall_speed=5;c.camera_player.y=233;begin(c);assert.ok(c.route_busy);assert.equal(c.route_unlock,95);for(let i=0;i<94;i++)begin(c);c.held.add(88);c.pressed.add(88);c.physical.add(88);begin(c);assert.equal(c.route_busy,false);assert.equal(c.route_block_fire,false);assert.equal(c.camera_player.fall_speed,5);
});
test('Accepted layout unchanged at same coordinates; all eleven seams have merged ladders',()=>{
 const prev=JSON.parse(fs.readFileSync(new URL('geometry.json',tenth))),next=JSON.parse(read('geometry.json'));assert.deepEqual(next.cells.slice(0,prev.cells.length),prev.cells);assert.deepEqual(next.objects.slice(0,13),prev.objects);
 for(const [y,height]of[[208,96],[448,160],[688,96],[912,112],[1168,112],[1408,80],[1648,80],[1888,96]])assert.ok(next.ladders.some(r=>r.x===(y===208?1328:y===448?1312:y<=912?1488:y===1168?816:976)&&r.y===y&&r.height===height));assert.ok(next.ladders.some(r=>r.x===1984&&r.y===192&&r.height===96));assert.ok(!next.tops.some(r=>r.x===1984&&r.y===240));assert.ok(next.ladders.some(r=>r.x===1888&&r.y===448&&r.height===64));assert.ok(!next.tops.some(r=>r.x===1888&&r.y===480));assert.ok(next.ladders.some(r=>r.x===1824&&r.y===688&&r.height===96));assert.ok(!next.tops.some(r=>r.x===1824&&r.y===720));for(const seam of[240,480,720,960,1200,1440,1680,1920])assert.ok(!next.tops.some(r=>r.x===(seam===240?1328:seam===480?1312:seam<=960?1488:seam===1200?816:976)&&r.y===seam));
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
test('ALL SEVENTEEN blocks placed by script, none require room editor instances',()=>{const b=[],c={obj_mm1_super_arm_block:1,instance_create:(x,y)=>b.push({x,y,width:32,height:32})};compile('scr_mm1_cutman_ladder_route_blocks.gml')(c);assert.deepEqual(b,g.objects);assert.equal(b.length,17);assert.equal(b.filter(b=>b.x<256).length,4);});
test('Expanded atlas preserves original tiles; actual2354 tile calls +17blocks+two dispensers+ten spikes+gate reconstruct reference',()=>{
 const atlas=PNG.sync.read(fs.readFileSync(new URL('bg_mm1_cutman_ladder_route_tileset.png',base))),ref=PNG.sync.read(fs.readFileSync(new URL('cutman_eleventh_route_reference.png',base))),b=PNG.sync.read(fs.readFileSync(new URL('../../Assets/Stage Objects/Super Arm/spr_mm1_super_arm_block.png',import.meta.url))),canvas=Buffer.alloc(2304*2160*4);for(let i=0;i<2304*2160;i++)canvas.set([72,205,222,255],i*4);
 let n=0;for(const m of read('scr_mm1_cutman_ladder_route_tiles.gml').matchAll(/tile_add\(bg_mm1_cutman_ladder_route_tileset, (\d+), (\d+), 16, 16, (\d+), (\d+), 1000\);/g)){const[ax,ay,x,y]=m.slice(1).map(Number);for(let dy=0;dy<16;dy++)for(let dx=0;dx<16;dx++){const k=((ay+dy)*128+ax+dx)*4;if(atlas.data[k+3])canvas.set(atlas.data.subarray(k,k+4),((y+dy)*2304+x+dx)*4);}n++;}assert.equal(n,2354);
 for(const o of g.objects)for(let y=0;y<32;y++)b.data.copy(canvas,((o.y+y)*2304+o.x)*4,y*128,(y+1)*128);const feature=PNG.sync.read(fs.readFileSync(new URL('spr_mm1_super_cutter_dispenser.png',base)));const spike=PNG.sync.read(fs.readFileSync(new URL('spr_mm1_cutman_spike.png',base)));const gate=PNG.sync.read(fs.readFileSync(new URL('spr_mm1_cutman_boss_gate_closed.png',base)));for(const f of g.features){const art=f.kind==='spike'?spike:f.kind==='boss_gate'?gate:feature;for(let y=0;y<f.height;y++)for(let x=0;x<f.width;x++){const k=(y*f.width+x)*4;if(art.data[k+3])canvas.set(art.data.subarray(k,k+4),((f.y+y)*2304+f.x+x)*4);}}assert.deepEqual(canvas,ref.data);
});
test('First13atlas tiles unchanged; retained blocks stay separate, no new upper block',()=>{const a=PNG.sync.read(fs.readFileSync(new URL('bg_mm1_cutman_opening_tileset.png',old))),b=PNG.sync.read(fs.readFileSync(new URL('bg_mm1_cutman_ladder_route_tileset.png',base)));for(let t=0;t<13;t++)for(let y=0;y<16;y++){const k=((Math.floor(t/8)*16+y)*128+t%8*16)*4;assert.deepEqual(b.data.subarray(k,k+64),a.data.subarray(k,k+64));}assert.deepEqual(g.objects.at(-1),{x:1888,y:880,width:32,height:32});assert.ok(g.objects.every(o=>o.y>=240));for(const c of g.cells.filter(c=>c.object&&c.y<240))assert.equal(g.solids.some(r=>c.x>=r.x&&c.x<r.x+r.width&&c.y>=r.y&&c.y<r.y+r.height),false);});
test('Horizontal camera actual EndStep matches900 original controlled traversal frames',()=>{const c=context();c.route_section=4;for(const r of JSON.parse(fs.readFileSync(new URL('native-camera.json',fourth))).rows){c.camera_player.x=r.x-1024;end(c);assert.equal(c.view_xview[0],r.cameraX-1024);assert.equal(c.view_yview[0],960);}c.route_section=0;c.camera_player.x=1400;end(c);assert.equal(c.camera_player.x,1016);});
test('Wide-stripe pit does not invent a return teleport into narrow lower room',()=>{const c=context();c.route_section=4;c.view_xview[0]=1024;c.camera_player.x=1192;c.camera_player.y=1193;c.camera_player.on_ladder=false;c.camera_player.fall_speed=6;begin(c);assert.equal(c.route_busy,false);});
test('Scripted feature factory preserves both buildings and places ten native spike objects, no duplicate scenery',()=>{
 const f=[];compile('scr_mm1_cutman_ladder_route_features.gml')({obj_mm1_super_cutter_dispenser:9,obj_mm1_cutman_spike:10,obj_mm1_cutman_boss_gate:11,instance_create:(x,y,type)=>f.push({x,y,type})});
 assert.deepEqual(f.slice(0,2),[{x:864,y:1088,type:9},{x:1376,y:128,type:9}]);
 const spikes=[{x:2000,y:528},{x:2016,y:528},...Array.from({length:8},(_,i)=>({x:1920+i*16,y:688}))];assert.deepEqual(f.slice(2,12),spikes.map(p=>({...p,type:10})));assert.deepEqual(f.at(-1),{x:2272,y:816,type:11});
 assert.deepEqual(g.features.filter(f=>f.kind==='spike'),spikes.map(p=>({kind:'spike',...p,width:16,height:16})));for(const f of g.features)assert.ok(!g.placements.some(p=>p.x>=f.x&&p.x<f.x+f.width&&p.y>=f.y&&p.y<f.y+f.height));assert.equal(g.cells.filter(c=>c.feature==='super_cutter_dispenser').length,60);assert.equal(g.cells.filter(c=>c.feature==='spike').length,10);
});
test('Matched coordinate contract rejects old room height; opening and last-room camera bounds',()=>{const c=context();c.room_height=1920;assert.throws(()=>create(c),/2304x2160/);const w=context();w.room_width=1536;assert.throws(()=>create(w),/2304x2160/);const d=context();end(d);assert.equal(d.view_yview[0],1920);d.route_section=8;d.camera_player.x=1000;end(d);assert.equal(d.camera_player.x,1288);assert.equal(d.view_xview[0],1280);assert.equal(d.view_yview[0],0);});
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
test('Accepted scene unchanged outside new stripe, extra width cyan elsewhere, four added blocks only',()=>{
 const prev=PNG.sync.read(fs.readFileSync(new URL('cutman_tenth_route_reference.png',tenth))),now=PNG.sync.read(fs.readFileSync(new URL('cutman_eleventh_route_reference.png',base)));
 assert.equal(now.width,2304);assert.equal(now.height,2160);
 for(let y=0;y<2160;y++){const outside=y>=720&&y<960?1792:2048;assert.deepEqual(now.data.subarray(y*2304*4,(y*2304+outside)*4),prev.data.subarray(y*2048*4,(y*2048+outside)*4));if(y<720||y>=960)for(let x=2048;x<2304;x++)assert.deepEqual([...now.data.subarray((y*2304+x)*4,(y*2304+x+1)*4)],[72,205,222,255]);}
 assert.equal(g.objects.length,17);assert.deepEqual(g.objects.slice(0,13),JSON.parse(fs.readFileSync(new URL('geometry.json',tenth))).objects);
 assert.deepEqual(g.objects.slice(13),[{x:1824,y:848,width:32,height:32},{x:1856,y:848,width:32,height:32},{x:1856,y:880,width:32,height:32},{x:1888,y:880,width:32,height:32}]);
});
test('Eleventh incoming up95 and closed route floor have independent direction guards',()=>{
 for(const falling of[false,true]){const c=context();c.route_section=11;c.camera_player.x=2100;c.camera_player.y=953;c.camera_player.on_ladder=!falling;c.camera_player.fall_speed=falling?6:0;c.held.add(40);begin(c);assert.equal(c.route_busy,false);}
 const c=context();c.route_section=10;c.camera_player.x=1600;end(c);assert.equal(c.camera_player.x,1800);assert.equal(c.view_xview[0],1792);assert.equal(c.view_yview[0],480);c.camera_player.x=2200;end(c);assert.equal(c.camera_player.x,2040);
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
 const c=context();c.held.add(38);begin(c);assert.equal(c.route_target_section,1);assert.equal(c.route_start_version,1101);for(let i=0;i<126;i++)begin(c);c.held.clear();
 for(let i=0;i<120;i++){begin(c);end(c);assert.equal(c.route_section,1);assert.equal(c.view_xview[0],768);assert.equal(c.view_yview[0],1680);assert.equal(c.camera_player.y-c.view_yview[0],229);}
});
test('Eleventh handshake rejects repaired Ninth start so old targets and wrong origin cannot be reused',()=>{
 const oldStart=new Function('c','with(c){'+fs.readFileSync(new URL('scr_mm1_cutman_scroll_start.gml',ninth),'utf8').replace(/\bexit;/g,'return;')+'}');
 const c=context();c.route_start_version=1101;c.route_section=9;c.camera_player.x=1896;c.camera_player.y=471.96875;c.view_xview[0]=1792;c.held.add(40);c.scr_mm1_cutman_scroll_start=d=>{c.argument0=d;oldStart(c);};assert.throws(()=>begin(c),/Eleventh Ladder Transition/);assert.equal(c.route_start_version,901);
});
test('Repeated tenth down126/up95 followed by ninth up126 and old left return95 resets target and timing',()=>{
 const c=context();c.route_section=9;c.camera_player.x=1896;c.camera_player.y=471.96875;c.view_xview[0]=1792;c.view_yview[0]=240;c.held.add(40);begin(c);assert.equal(c.route_target_section,10);assert.equal(c.route_unlock,126);for(let i=0;i<126;i++)begin(c);end(c);assert.equal(c.route_section,10);assert.equal(c.view_yview[0],480);
 c.held.clear();c.held.add(38);c.camera_player.y=484.96875;begin(c);assert.equal(c.route_target_section,9);assert.equal(c.route_unlock,95);for(let i=0;i<94;i++)begin(c);c.held.add(88);c.physical.add(88);c.pressed.add(88);begin(c);end(c);assert.equal(c.route_section,9);assert.equal(c.view_yview[0],240);assert.equal(c.route_block_fire,false);assert.ok(c.held.has(88));
 c.held.clear();c.pressed.clear();c.physical.clear();c.held.add(38);c.camera_player.x=1992;c.camera_player.y=244.96875;begin(c);assert.equal(c.route_target_section,8);assert.equal(c.route_unlock,126);for(let i=0;i<126;i++)begin(c);end(c);assert.equal(c.route_section,8);assert.equal(c.view_yview[0],0);
 c.held.clear();c.held.add(40);c.camera_player.x=1336;c.camera_player.y=231.96875;c.view_xview[0]=1280;begin(c);assert.equal(c.route_target_section,7);assert.equal(c.route_unlock,95);
});
test('Spike sprite is recovered native16x16 art with transparent sky, Create only displays artwork',()=>{
 const sprite=PNG.sync.read(fs.readFileSync(new URL('spr_mm1_cutman_spike.png',base))),native=PNG.sync.read(fs.readFileSync(new URL('cutman_tenth_lower_reference.png',tenth)));assert.equal(sprite.width,16);assert.equal(sprite.height,16);
 for(const c of g.cells.filter(c=>c.feature==='spike')){assert.equal(c.class,3);for(let y=0;y<16;y++)for(let x=0;x<16;x++){const k=(y*16+x)*4,a=sprite.data.subarray(k,k+4),n=((c.y-480+y)*256+c.x-1792+x)*4;assert.deepEqual([...native.data.subarray(n,n+4)],a[3]?[...a]:[72,205,222,255]);}}
 const c={depth:0,image_speed:1,image_index:3};compile('obj_mm1_cutman_spike_create.gml')(c);assert.deepEqual(c,{depth:999,image_speed:0,image_index:0});assert.ok(!/instance_destroy|health\s*[-=]|damage\s*=/i.test(read('obj_mm1_cutman_spike_create.gml')));
});
test('Eleventh camera matches263 original controlled frames and preserves old route bounds',()=>{
 const c=context();c.route_section=11;const rows=JSON.parse(read('native-camera.json')).rows;assert.equal(rows.length,263);
 for(const r of rows){c.camera_player.x=r.x-2816;end(c);assert.equal(c.view_xview[0],r.cameraX-2816);assert.equal(c.view_yview[0],720);}
 c.camera_player.x=2400;end(c);assert.equal(c.camera_player.x,2296);assert.equal(c.view_xview[0],2048);c.route_section=10;end(c);assert.equal(c.camera_player.x,2040);assert.equal(c.view_xview[0],1792);assert.equal(c.view_yview[0],480);
 c.room_width=2048;assert.throws(()=>create(c),/2304x2160/);
});
test('Repeated eleventh down126/up95 preserves tenth up95, ninth up126 and start protocol',()=>{
 const c=context();c.route_section=10;c.camera_player.x=1832;c.camera_player.y=711.96875;c.view_xview[0]=1792;c.view_yview[0]=480;c.held.add(40);begin(c);assert.equal(c.route_target_section,11);assert.equal(c.route_unlock,126);for(let i=0;i<126;i++)begin(c);end(c);assert.equal(c.route_section,11);assert.equal(c.view_yview[0],720);
 c.held.clear();c.held.add(38);c.camera_player.y=724.96875;begin(c);assert.equal(c.route_target_section,10);assert.equal(c.route_unlock,95);for(let i=0;i<95;i++)begin(c);end(c);assert.equal(c.route_section,10);assert.equal(c.view_yview[0],480);assert.equal(c.view_xview[0],1792);
 c.camera_player.x=1896;c.camera_player.y=484.96875;begin(c);assert.equal(c.route_target_section,9);assert.equal(c.route_unlock,95);for(let i=0;i<95;i++)begin(c);end(c);assert.equal(c.route_section,9);c.camera_player.x=1992;c.camera_player.y=244.96875;begin(c);assert.equal(c.route_target_section,8);assert.equal(c.route_unlock,126);
 const d=context();d.route_section=11;d.camera_player.x=1832;d.camera_player.y=724.96875;d.view_xview[0]=2048;d.held.add(38);begin(d);assert.equal(d.route_busy,false);
});
test('Old25 atlas tiles retained exactly; three new gate-wall tiles appended, spike art unchanged',()=>{
 const old=PNG.sync.read(fs.readFileSync(new URL('bg_mm1_cutman_ladder_route_tileset.png',tenth))),now=PNG.sync.read(fs.readFileSync(new URL('bg_mm1_cutman_ladder_route_tileset.png',base)));assert.equal(g.atlas.tiles,28);assert.equal(now.width,128);assert.equal(now.height,64);
 for(let t=0;t<25;t++)for(let y=0;y<16;y++){const k=((Math.floor(t/8)*16+y)*128+t%8*16)*4;assert.deepEqual(now.data.subarray(k,k+64),old.data.subarray(k,k+64));}assert.deepEqual(fs.readFileSync(new URL('spr_mm1_cutman_spike.png',base)),fs.readFileSync(new URL('spr_mm1_cutman_spike.png',tenth)));
});
test('Closed gate is separate native32x64 artwork, no baked eight cells or phantom permanent terrain',()=>{
 const gate=PNG.sync.read(fs.readFileSync(new URL('spr_mm1_cutman_boss_gate_closed.png',base))),ref=PNG.sync.read(fs.readFileSync(new URL('cutman_eleventh_lower_reference.png',base)));assert.equal(gate.width,32);assert.equal(gate.height,64);
 for(let y=0;y<64;y++)assert.deepEqual(gate.data.subarray(y*32*4,(y+1)*32*4),ref.data.subarray(((96+y)*512+480)*4,((96+y)*512+512)*4));
 const cells=g.cells.filter(c=>c.feature==='boss_gate');assert.equal(cells.length,8);for(const c of cells){assert.equal(c.class,0);assert.ok(!g.solids.some(r=>c.x>=r.x&&c.x<r.x+r.width&&c.y>=r.y&&c.y<r.y+r.height));}
 const c={depth:0,image_speed:1,image_index:5,spr_mm1_cutman_boss_gate_closed:7,mask_index:-1};compile('obj_mm1_cutman_boss_gate_create.gml')(c);assert.deepEqual(c,{depth:999,image_speed:0,image_index:0,spr_mm1_cutman_boss_gate_closed:7,mask_index:7});
});
test('Eleventh rejects accepted Tenth start instead of silently choosing obsolete descending target',()=>{
 const oldStart=new Function('c','with(c){'+fs.readFileSync(new URL('scr_mm1_cutman_scroll_start.gml',tenth),'utf8').replace(/\bexit;/g,'return;')+'}');const c=context();c.route_section=10;c.camera_player.x=1832;c.camera_player.y=711.96875;c.held.add(40);c.scr_mm1_cutman_scroll_start=d=>{c.argument0=d;oldStart(c);};assert.throws(()=>begin(c),/Eleventh Ladder Transition/);assert.equal(c.route_start_version,1001);
});
test('Source resource/compatibility contracts: minimal guards, no global activation/stop/music edits',()=>{
 const all=fs.readdirSync(base).filter(f=>f.endsWith('.gml')).map(read).join('\n');assert.ok(!/\b(variable_global_exists|variable_instance_exists|instance_activate_all|instance_deactivate_all|audio_stop_all|audio_pause_all|camera_create_view)\s*\(/.test(all));for(const f of['obj_mm5_megaman_step_route_prefix.gml','obj_mm5_pause_menu_begin_step_route_prefix.gml'])assert.ok(read(f).includes('if (scr_mm1_cutman_route_busy()) exit;'));assert.ok(read('scr_mm1_cutman_scroll_start.gml').includes('with (obj_mm5_buster_shot) instance_destroy();'));
});
console.log(`${tests} route source/model checks PASS; NOT GameMaker compiler/GPU/scheduler/native whole-stage traversal certification.`);
