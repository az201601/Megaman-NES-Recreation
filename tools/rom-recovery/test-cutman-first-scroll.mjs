// Supported actual GML source with engine mocks, plus original ROM traces. NOT GameMaker.
import fs from'node:fs';import assert from'node:assert/strict';import{PNG}from'pngjs';
const base=new URL('../../Assets/Cut Man/Stage/First Ladder Transition/',import.meta.url),old=new URL('../../Assets/Cut Man/Stage/Opening Route/',import.meta.url),read=f=>fs.readFileSync(new URL(f,base),'utf8');
const compile=f=>new Function('c','with(c){'+read(f).replace(/\bexit;/g,'return;')+'}');
const begin=compile('obj_mm1_cutman_camera_begin_step.gml'),end=compile('obj_mm1_cutman_camera_end_step.gml'),finish=compile('scr_mm1_cutman_scroll_finish.gml'),start=compile('scr_mm1_cutman_scroll_start.gml'),create=compile('obj_mm1_cutman_camera_create.gml'),dispose=compile('scr_mm1_cutman_scroll_dispose.gml');
let tests=0;function test(n,fn){fn();tests++;console.log('PASS',n);}
function context(){
 const c={};for(const m of read('obj_mm1_cutman_camera_create.gml').matchAll(/^([a-z_]+)\s*=/gm))c[m[1]]=null;
 Object.assign(c,{noone:-4,room_width:1024,room_height:480,room_speed:60,view_enabled:true,view_visible:[true],view_wview:[256],view_hview:[240],view_object:[-4],view_xview:[0],view_yview:[240],held:new Set(),pressed:new Set(),physical:new Set(),vk_enter:13,vk_up:38,vk_down:40,obj_mm5_megaman:1,spr_mm5_megaman_climb:2,ord:s=>s.charCodeAt(0),asset_get_index:()=>-1,ds_list_create:()=>[],ds_list_clear:a=>a.splice(0),ds_list_size:a=>a.length,ds_list_find_value:(a,i)=>a[i],ds_list_destroy:a=>a.splice(0),floor:Math.floor,abs:Math.abs,clamp:(x,a,b)=>Math.max(a,Math.min(b,x)),show_error:s=>{throw Error(s);},audio_is_paused:()=>true,audio_resume_sound:()=>{c.resumes++;},resumes:0,shots:['basic','mid','full']});
 c.obj_mm5_buster_shot={instance_destroy:()=>{c.shots=[];}}; // Mock group only; GML descendant iteration itself NOT certified.
 c.keyboard_check=k=>c.held.has(k);c.keyboard_check_pressed=k=>c.pressed.has(k);c.keyboard_check_direct=k=>c.physical.has(k);c.keyboard_clear=k=>{c.held.delete(k);c.pressed.delete(k);};
 c.instance_exists=v=>v&&typeof v==='object'&&v.player===true;c.instance_find=()=>c.camera_player;
 c.scr_mm1_cutman_scroll_start=d=>{c.argument0=d;start(c);};c.scr_mm1_cutman_scroll_finish=()=>finish(c);
 create(c);c.camera_player={player:true,x:984,y:244.96875,on_ladder:true,ladder_speed:1.296875,fall_speed:0,buster_fire_key:88,buster_pose_timer:0,buster_charge:80,mm5_startup_active:false,anim_climb_timer:0,anim_climb_frame:0,ladder_moving:true};
 return c;
}
test('Actual camera GML matches original UP camera and carried-Y every busy frame',()=>{
 const c=context(),native=JSON.parse(read('native-up.json')).rows;c.held.add(38);begin(c);assert.ok(c.route_busy);assert.equal(c.route_tick,0);assert.deepEqual(c.shots,[]);
 for(let age=0;age<=125;age++){
  if(age)begin(c);const r=native.find(r=>r.frame===60+age);const expectedCam=age<32?240:age<92?r.cameraY:0;
  const expectedY=age<32?240+r.playerY:age<92?r.playerY+r.cameraY:r.playerY;
  assert.equal(c.view_yview[0],expectedCam,`up camera${age}`);assert.equal(c.camera_player.y,expectedY,`up carry${age}`);assert.ok(c.route_busy);end(c);assert.equal(c.view_yview[0],expectedCam);
 }
 begin(c);assert.equal(c.route_tick,126);assert.equal(c.route_busy,false);assert.equal(c.route_section,1);
});
test('Actual camera GML matches original DOWN camera and carried-Y every busy frame',()=>{
 const c=context(),native=JSON.parse(read('native-down.json')).rows;c.route_section=1;c.camera_player.y=231.96875;c.held.add(40);c.view_yview[0]=0;begin(c);assert.ok(c.route_busy);
 for(let age=0;age<=125;age++){if(age)begin(c);const r=native.find(r=>r.frame===32+age),cam=age<32?0:age<92?r.cameraY:240,y=age<32?r.playerY:age<92?r.playerY+r.cameraY:240+r.playerY;assert.equal(c.view_yview[0],cam,`downcam${age}`);assert.equal(c.camera_player.y,y,`downY${age}`);assert.ok(c.route_busy);}
 begin(c);assert.equal(c.route_busy,false);assert.equal(c.route_section,0);assert.equal(c.camera_player.y,247);
});
test('Fresh native Up ignored123..125, accepted126..128; hold32/scroll60/post33/bookkeeping1',()=>{const p=JSON.parse(read('native-ready.json')).results;assert.equal(p.length,6);for(const r of p)assert.equal(r.finalY,r.pressAge<126?229:228.25);});
test('Entry requires correct seam/direction/attached state; shooting/READY/Start prevents race',()=>{
 for(const change of[c=>c.camera_player.mm5_startup_active=true,c=>c.camera_player.x=800,c=>c.camera_player.y=270,c=>c.camera_player.buster_pose_timer=4,c=>c.pressed.add(13),c=>c.pressed.add(88)]){const c=context();c.held.add(38);change(c);begin(c);assert.equal(c.route_busy,false);}
 const c=context();c.route_section=1;c.camera_player.on_ladder=false;c.camera_player.y=233;c.camera_player.fall_speed=6;begin(c);assert.ok(c.route_busy);assert.equal(c.route_dir,1);
});
test('Charge release cancels stale charge; old continuous hold resumes own paused voice',()=>{
 const c=context();c.held.add(38);c.held.add(88);c.physical.add(88);begin(c);c.route_voices.push(7);for(let i=0;i<126;i++)begin(c);assert.equal(c.camera_player.buster_charge,80);assert.equal(c.resumes,1);
 const d=context();d.held.add(38);d.held.add(88);begin(d);d.held.delete(88);begin(d);d.held.add(88);d.physical.add(88);for(let i=1;i<126;i++)begin(d);assert.equal(d.camera_player.buster_charge,0);assert.equal(d.route_block_fire,true);assert.equal(d.held.has(88),false);assert.equal(d.route_busy,false);
});
test('Fresh fire on ready126 is allowed; older new hold still release-rearmed',()=>{const c=context();c.held.add(38);begin(c);for(let i=0;i<125;i++)begin(c);c.held.add(88);c.physical.add(88);c.pressed.add(88);begin(c);assert.equal(c.route_busy,false);assert.equal(c.route_block_fire,false);assert.ok(c.held.has(88));});
test('Cleanup is idempotent, no frozen actors, view selects correct section',()=>{const c=context();c.held.add(38);begin(c);dispose(c);dispose(c);assert.equal(c.route_busy,false);assert.equal(c.route_lists_ready,false);const d=context();d.camera_player.x=984;end(d);assert.equal(d.view_yview[0],240);d.route_section=1;d.camera_player.x=750;end(d);assert.equal(d.camera_player.x,776);assert.equal(d.view_xview[0],768);assert.equal(d.view_yview[0],0);});
const g=JSON.parse(read('geometry.json'));
test('Actual geometry script produces declared regions; no permanent block solids or seam platform',()=>{
 const regions=[],ctx={obj_stage_solid:'solid',obj_stage_ladder:'ladder',obj_stage_ladder_top:'top',instance_create:(x,y,type)=>{let r={x,y,type};regions.push(r);return r;}};
 compile('scr_mm1_cutman_ladder_route_collision.gml')(ctx);
 for(const [list,type]of[['solids','solid'],['ladders','ladder'],['tops','top']])assert.deepEqual(regions.filter(r=>r.type===type).map(r=>({x:r.x,y:r.y,width:r.image_xscale*16,height:r.image_yscale*16})),g[list]);
 for(const cell of g.cells){const hit=r=>cell.x>=r.x&&cell.x<r.x+r.width&&cell.y>=r.y&&cell.y<r.y+r.height;assert.equal(g.solids.some(hit),cell.class===1&&!cell.object);assert.equal(g.ladders.some(hit),cell.class===2&&!cell.object);}
 assert.ok(g.ladders.some(r=>r.x===976&&r.y===208&&r.height===96));assert.ok(!g.tops.some(r=>r.x===976&&r.y===240));
});
test('ALL NINE blocks placed by script, none require room editor instances',()=>{const b=[],c={obj_mm1_super_arm_block:1,instance_create:(x,y)=>b.push({x,y,width:32,height:32})};compile('scr_mm1_cutman_ladder_route_blocks.gml')(c);assert.deepEqual(b,g.objects);assert.equal(b.length,9);assert.equal(b.filter(b=>b.x<256).length,4);});
test('Existing atlas reused; actual590 tile calls +9blocks reconstruct reference',()=>{
 const atlas=PNG.sync.read(fs.readFileSync(new URL('bg_mm1_cutman_opening_tileset.png',old))),ref=PNG.sync.read(fs.readFileSync(new URL('cutman_ladder_route_reference.png',base))),b=PNG.sync.read(fs.readFileSync(new URL('../../Assets/Stage Objects/Super Arm/spr_mm1_super_arm_block.png',import.meta.url))),canvas=Buffer.alloc(1024*480*4);for(let i=0;i<1024*480;i++)canvas.set([72,205,222,255],i*4);
 let n=0;for(const m of read('scr_mm1_cutman_ladder_route_tiles.gml').matchAll(/tile_add\(bg_mm1_cutman_opening_tileset, (\d+), (\d+), 16, 16, (\d+), (\d+), 1000\);/g)){const[ax,ay,x,y]=m.slice(1).map(Number);for(let dy=0;dy<16;dy++)for(let dx=0;dx<16;dx++){const k=((ay+dy)*128+ax+dx)*4;if(atlas.data[k+3])canvas.set(atlas.data.subarray(k,k+4),((y+dy)*1024+x+dx)*4);}n++;}assert.equal(n,590);
 for(const o of g.objects)for(let y=0;y<32;y++)b.data.copy(canvas,((o.y+y)*1024+o.x)*4,y*128,(y+1)*128);assert.deepEqual(canvas,ref.data);
});
test('Source resource/compatibility contracts: minimal guards, no global activation/stop/music edits',()=>{
 const all=fs.readdirSync(base).filter(f=>f.endsWith('.gml')).map(read).join('\n');assert.ok(!/\b(variable_global_exists|variable_instance_exists|instance_activate_all|instance_deactivate_all|audio_stop_all|audio_pause_all|camera_create_view)\s*\(/.test(all));for(const f of['obj_mm5_megaman_step_route_prefix.gml','obj_mm5_pause_menu_begin_step_route_prefix.gml'])assert.ok(read(f).includes('if (scr_mm1_cutman_route_busy()) exit;'));assert.ok(read('scr_mm1_cutman_scroll_start.gml').includes('with (obj_mm5_buster_shot) instance_destroy();'));
});
console.log(`${tests} route source/model checks PASS; NOT GameMaker compiler/GPU/scheduler/native whole-stage traversal certification.`);
