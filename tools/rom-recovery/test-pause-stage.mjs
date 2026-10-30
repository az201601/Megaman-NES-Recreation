// Execute supported event source with mocks + static contracts. NOT GMS compiler/GPU/scheduler.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const dir=new URL('../../Assets/Mega Man/MM5/Pause Menu/Stage Controller/',import.meta.url);
const read=f=>fs.readFileSync(new URL(f,dir),'utf8');
let checks=0;function test(name,fn){fn();checks++;console.log('PASS',name);}
const files=fs.readdirSync(dir).filter(f=>f.endsWith('.gml')),all=files.map(read).join('\n');
const begin=compile('obj_mm5_pause_menu_begin_step.gml'),step=compile('obj_mm5_pause_menu_step.gml'),sample=compile('scr_mm5_pause_transition_sample.gml');
function compile(f){return new Function('c','with(c){'+read(f).replace(/\bexit;/g,'return;').replace(/\bmod\b/g,'%')+'}');}
function context(){
 const c={menu_lists_ready:true,menu_open:true,menu_pending_close:false,menu_phase:1,menu_tick:1,
  menu_fire_held_at_open:false,menu_fire_released:false,menu_fire_key:88,menu_block_fire:false,
  menu_stage_surface:1,menu_page:0,menu_cursor:0,menu_upgrade_cursor:0,menu_last_weapon:0,
  menu_nav_key:-1,menu_nav_timer:0,menu_dim:0,menu_show_stage:false,
  vk_enter:13,vk_space:32,vk_left:37,vk_right:39,vk_up:38,vk_down:40,
  snd_mm5_menu_close:'close',snd_mm5_menu_cursor:'cursor',held:new Set(),pressed:new Set(),physical:new Set(),
  global:{mm5_pause_tanks:[0,0,0]},sounds:[],moves:[],restores:0,opens:0,validSurface:true};
 c.keyboard_check=k=>c.held.has(k);c.keyboard_check_pressed=k=>c.pressed.has(k);
 c.keyboard_check_direct=k=>c.physical.has(k);c.keyboard_clear=k=>{c.held.delete(k);c.pressed.delete(k);};
 c.surface_exists=()=>c.validSurface;c.show_debug_message=()=>{};c.audio_stop_sound=()=>{};
 c.audio_play_sound=s=>c.sounds.push(s);c.scr_mm5_pause_stage_move=(x,y)=>c.moves.push([x,y]);
 c.scr_mm5_pause_open=()=>c.opens++;
 c.scr_mm5_pause_restore=()=>{c.restores++;c.menu_open=false;c.menu_phase=0;c.menu_tick=0;};
 return c;
}
test('Actual GML opening frames match original schedule1..37, ready38',()=>{
 const c=context();const expected=f=>f<2?0:f<6?1:f<10?2:f<14?3:f<24?4:f<27?3:f<31?2:f<35?1:0;
 for(let f=1;f<=37;f++){assert.equal(c.menu_tick,f);sample(c);assert.equal(c.menu_dim,expected(f));assert.equal(c.menu_show_stage,f<24);assert.equal(c.menu_phase,1);begin(c);}
 assert.equal(c.menu_phase,2);assert.equal(c.menu_tick,38);assert.equal(c.restores,0);
});
test('Actual GML close uses shorter blackout, restores before Step38',()=>{
 const c=context();c.menu_phase=3;c.menu_pending_close=true;
 for(let f=1;f<=37;f++){sample(c);const d=f<2?0:f<6?1:f<10?2:f<14?3:f<23?4:f<27?3:f<31?2:f<35?1:0;assert.equal(c.menu_dim,d);assert.equal(c.menu_show_stage,f>=23);assert.equal(c.restores,0);begin(c);}
 assert.equal(c.restores,1);assert.equal(c.menu_open,false);
});
test('No cursor/confirmation during opening; fresh Right accepted38',()=>{
 for(let f=1;f<=38;f++){const c=context();c.menu_tick=f;c.menu_phase=f<38?1:2;c.held.add(39);c.pressed.add(39);step(c);assert.equal(c.moves.length,f===38?1:0);}
});
test('Start and A each begin close immediately, sound exactly once; B/Escape ignored',()=>{
 for(const key of[13,32,88,27]){const c=context();c.menu_phase=2;c.pressed.add(key);step(c);assert.equal(c.menu_phase,key===13||key===32?3:2);assert.equal(c.sounds.length,key===13||key===32?1:0);if(c.menu_phase===3){assert.equal(c.menu_tick,1);step(c);assert.equal(c.sounds.length,1);}}
});
test('Held confirm/navigation no longer extends native close timing',()=>{
 for(const key of[13,32,37,38,39,40]){const c=context();c.menu_phase=3;c.held.add(key);for(let i=0;i<37;i++)begin(c);assert.equal(c.restores,1);assert.ok(!c.menu_open);}
});
test('Fire rearm clears new physical hold without freezing world; reopens only fresh Start',()=>{
 const c=context();c.menu_open=false;c.menu_phase=0;c.menu_block_fire=true;c.physical.add(88);c.held.add(88);c.pressed.add(88);begin(c);assert.ok(!c.held.has(88));assert.equal(c.restores,0);assert.equal(c.opens,0);c.physical.clear();begin(c);assert.equal(c.menu_block_fire,false);c.pressed.add(13);begin(c);assert.equal(c.opens,1);
});
test('Lost volatile stage surface safely restores instead of stranding stage',()=>{const c=context();c.validSurface=false;begin(c);assert.equal(c.restores,1);assert.equal(c.menu_open,false);});
test('Tanks unconsumed and unimplemented weapon cannot resume',()=>{for(const cursor of[1,8,11,12,13]){const c=context();c.menu_phase=2;c.menu_cursor=cursor;c.global.mm5_pause_tanks=[2,2,1];c.pressed.add(13);step(c);assert.equal(c.menu_phase,2);assert.deepEqual(c.global.mm5_pause_tanks,[2,2,1]);}});
test('Custom pages remain accessible, Start/A on return does not resume stage',()=>{const c=context();c.menu_phase=2;c.menu_cursor=14;c.pressed.add(13);step(c);assert.equal(c.menu_page,1);c.menu_upgrade_cursor=1;step(c);assert.equal(c.menu_page,0);assert.equal(c.menu_phase,2);});
test('GMS1.4 source contracts; no obsolete introspection/global activation/audio stops',()=>{assert.equal(files.length,14);assert.ok(!/\b(?:instance_activate_all|instance_deactivate_all|audio_stop_all|audio_pause_all|variable_global_exists|variable_instance_exists|draw_get_font|draw_set_gui_size|array_create|function|gpu_set_texfilter)\s*\(/.test(all));assert.ok(!all.includes('menu_test_'));assert.ok(read('scr_mm5_pause_restore.gml').includes('instance_activate_object(ds_list_find_value'));});
test('Freeze exact active IDs only, async charge survives; release clears stale charge',()=>{
 const open=read('scr_mm5_pause_open.gml'),restore=read('scr_mm5_pause_restore.gml');assert.ok(open.indexOf('surface_exists(menu_stage_surface)')<open.indexOf('instance_deactivate_object'));assert.ok(open.includes('else ds_list_add(other.menu_frozen_list, id)'));assert.ok(open.includes('audio_pause_sound(charge_audio_voice)'));assert.ok(restore.includes('menu_player.buster_charge = 0'));assert.ok(restore.includes('audio_resume_sound(voice)'));assert.ok(restore.includes('menu_fire_released'));assert.ok(!restore.includes('instance_exists(ds_list_find_value'));
});
test('Cached stage includes installed health HUD and surfaces clean up idempotently',()=>{
 const draw=read('obj_mm5_pause_menu_draw_gui.gml'),dispose=read('scr_mm5_pause_dispose.gml');assert.ok(draw.includes('draw_surface_stretched(application_surface'));assert.ok(draw.includes('draw_sprite_ext(spr_mm5_health_meter'));assert.ok(draw.includes('24, 25, 1, 1, 0, c_white, 1'));assert.ok(draw.includes('d3d_set_projection_ortho(0, 0, 64, 512, 0)'));for(const name of['menu_stage_surface','menu_frame_surface','menu_lut_surface'])assert.ok(dispose.includes(`surface_free(${name})`));assert.ok(dispose.includes('if (!menu_lists_ready) exit;'));
});
test('Sprite/sound/script references include only installed/shared/new transition resources',()=>{
 const m=JSON.parse(fs.readFileSync(new URL('../Import Pack/resource-manifest.json',dir))),known=new Set([...m.sprites.map(r=>r.name),...m.sounds,'spr_mm5_health_meter','spr_mm5_pause_fade_lut']);for(const n of all.match(/\b(?:spr|snd)_mm5_\w+/g)||[])assert.ok(known.has(n),n);const scripts=new Set(files.filter(f=>f.startsWith('scr_')).map(f=>f.slice(0,-4)));for(const n of['scr_mm5_pause_box','scr_mm5_pause_text','scr_mm5_pause_meter','scr_mm5_charge_audio_stop'])scripts.add(n);for(const n of all.match(/\bscr_\w+(?=\()/g)||[])assert.ok(scripts.has(n),n);
});
test('Starting02 spare lives/inventory persists, explicit reset only, no test ownership',()=>{const s=read('scr_mm5_pause_inventory_init.gml');for(const line of['if (!argument0) exit;','global.mm5_lives = 2','global.mm5_pause_owned[i] = false','global.mm5_pause_tanks[j] = 0'])assert.ok(s.includes(line));assert.ok(read('obj_mm5_pause_menu_create.gml').includes('if (!instance_exists(obj_mm5_pause_state))'));assert.ok(read('obj_mm5_pause_state_create.gml').includes('scr_mm5_pause_inventory_init(true)'));});
test('Unowned rows hidden/skipped at same slots; unchanged approved glyph alphabet/layout',()=>{
 const draw=read('scr_mm5_pause_draw_page.gml'),nav=read('scr_mm5_pause_stage_move.gml');assert.ok(draw.includes('if (!global.mm5_pause_owned[i]) continue;'));assert.ok(nav.includes('if (!global.mm5_pause_owned[i]) continue;'));assert.ok(draw.includes('scr_mm5_pause_box(80, 208, 96, 18'));for(const m of draw.matchAll(/scr_mm5_pause_text\("([^"]*)"/g))assert.ok([...m[1]].every(c=>'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .'.includes(c)));
});
test('Palette shader preserves alpha, indexes lookup, no smooth dim overlay; selected white convention explicit',()=>{const f=read('Transition Resources/shd_mm5_pause_fade.fsh');assert.ok(f.includes('src.a'));assert.ok(f.includes('texture2D(s_fade_lut'));assert.ok(!f.includes('mix('));assert.ok(read('scr_mm5_pause_draw_page.gml').includes('shader_set_uniform_f(menu_white_uniform, selected)'));});
console.log(`${checks} stage source/model checks PASS; GameMaker1.4 compiler, GPU, event scheduler, key handling and async runtime still require user test.`);
