import fs from'node:fs';import assert from'node:assert/strict';import{PNG}from'pngjs';import{NES}from'jsnes';import{mesenRgbFromJsnes}from'./mesen-palette.mjs';
const root=new URL('../../',import.meta.url),base=new URL('Assets/Cut Man/Stage/Eleventh Ladder Transition/',root),out=new URL('Assets/Cut Man/Stage/First Gate Passage/',root),work=new URL('./.work/cutman-first-gate/',import.meta.url);
fs.mkdirSync(out,{recursive:true});const read=(f)=>fs.readFileSync(new URL(f,base),'utf8'),write=(f,s)=>fs.writeFileSync(new URL(f,out),s);
const g=JSON.parse(read('geometry.json')),raw=PNG.sync.read(fs.readFileSync(new URL('upper-raw.png',work))),incoming=JSON.parse(fs.readFileSync(new URL('upper-cells.json',work))),oldAtlas=PNG.sync.read(fs.readFileSync(new URL('bg_mm1_cutman_ladder_route_tileset.png',base))),sky=[72,205,222,255];
const cells=g.cells.concat(incoming.map(c=>({...c,x:c.x+2304,y:c.y+720,object:false,...(c.x===752&&c.y>=96&&c.y<160?{feature:'boss_gate'}:{})}))),features=g.features.concat({kind:'boss_gate',x:3056,y:816,width:16,height:64}),placements=g.placements.map(p=>({...p})),objects=g.objects;
const tiles=[];for(let t=0;t<g.atlas.tiles;t++){const b=Buffer.alloc(1024);for(let y=0;y<16;y++)oldAtlas.data.copy(b,y*64,((Math.floor(t/8)*16+y)*128+t%8*16)*4,((Math.floor(t/8)*16+y)*128+t%8*16)*4+64);tiles.push(b);}
for(const c of cells.slice(g.cells.length).filter(c=>!c.feature)){const b=Buffer.alloc(1024),x=c.x-2304,y=c.y-720;for(let dy=0;dy<16;dy++)for(let dx=0;dx<16;dx++){let k=((y+dy)*768+x+dx)*4;const a=raw.data.subarray(k,k+4);if(!sky.every((v,i)=>v===a[i]))b.set(a,(dy*16+dx)*4);}if(!b.some((v,i)=>i%4===3&&v))continue;let t=tiles.findIndex(v=>v.equals(b));if(t<0){t=tiles.length;tiles.push(b);}placements.push({x:c.x,y:c.y,tile:t});}
const atlas=new PNG({width:128,height:Math.ceil(tiles.length/8)*16});for(let t=0;t<tiles.length;t++)for(let y=0;y<16;y++)tiles[t].copy(atlas.data,((Math.floor(t/8)*16+y)*128+t%8*16)*4,y*64,(y+1)*64);write('bg_mm1_cutman_ladder_route_tileset.png',PNG.sync.write(atlas));
// Preserve prior merged regions exactly; append only new floor/ceiling and native return blocker.
const solids=g.solids.concat({x:2304,y:784,width:768,height:32},{x:2304,y:880,width:768,height:32},{x:2304,y:816,width:16,height:64}),ladders=g.ladders,tops=g.tops;
for(const c of cells.slice(g.cells.length))if(c.class===1)assert.ok(solids.some(r=>c.x>=r.x&&c.x<r.x+r.width&&c.y>=r.y&&c.y<r.y+r.height));
let s='// Complete route through first gate; once per room entry only.\n';for(const p of placements)s+=`tile_add(bg_mm1_cutman_ladder_route_tileset, ${p.tile%8*16}, ${Math.floor(p.tile/8)*16}, 16, 16, ${p.x}, ${p.y}, 1000);\n`;write('scr_mm1_cutman_ladder_route_tiles.gml',s);
s='// Previous regions retained; new corridor floor/ceiling and original invisible one-way return boundary.\nvar region;\n';for(const[list,type]of[[solids,'solid'],[ladders,'ladder'],[tops,'ladder_top']])for(const r of list)s+=`region = instance_create(${r.x}, ${r.y}, obj_stage_${type});\nregion.image_xscale = ${r.width/16};\nregion.image_yscale = ${r.height/16};\n`;write('scr_mm1_cutman_ladder_route_collision.gml',s);
write('scr_mm1_cutman_ladder_route_blocks.gml',read('scr_mm1_cutman_ladder_route_blocks.gml'));
write('scr_mm1_cutman_ladder_route_features.gml',read('scr_mm1_cutman_ladder_route_features.gml')+'\n// Closed second gate is a separate scripted object; its operation is deferred.\nvar gate;\ngate = instance_create(3056, 816, obj_mm1_cutman_boss_gate);\ngate.gate_first = false;\ngate.sprite_index = spr_mm1_cutman_second_gate_closed;\ngate.mask_index = spr_mm1_cutman_second_gate_closed;\n');
const second=new PNG({width:16,height:64});for(let y=0;y<64;y++)raw.data.copy(second.data,y*64,((96+y)*768+752)*4,((96+y)*768+768)*4);write('spr_mm1_cutman_second_gate_closed.png',PNG.sync.write(second));
const n=new NES();n.loadROM(fs.readFileSync(new URL('Mega Man (USA).nes',root),'binary'));n.fromJSON(JSON.parse(fs.readFileSync(new URL('frame-72.json',work))));const backdrop=new PNG({width:32,height:64}),nt=n.ppu.nameTable[n.ppu.ntable1[1]];
for(let y=0;y<64;y++)for(let x=0;x<32;x++){const tx=28+Math.floor(x/8),ty=12+Math.floor(y/8),idx=ty*32+tx,t=n.ppu.ptTile[n.ppu.f_bgPatternTable*256+nt.tile[idx]],rgb=mesenRgbFromJsnes(n.ppu.imgPalette[nt.attrib[idx]+t.pix[y%8*8+x%8]]);backdrop.data.set([rgb&255,rgb>>8&255,rgb>>16&255,255],(y*32+x)*4);}write('spr_mm1_cutman_boss_gate_open_backdrop.png',PNG.sync.write(backdrop));
write('obj_mm1_cutman_boss_gate_create.gml',read('obj_mm1_cutman_boss_gate_create.gml').replace('// Static closed gate; parent obj_stage_solid. Opening/passage deferred.','// Parent obj_stage_solid; retain closed mask during the camera-owned passage.')+'gate_open_rows = 0;\ngate_first = true;\n');
write('obj_mm1_cutman_boss_gate_draw.gml',`// Draw bottom-up removal over the recovered native open-door background.
// Keep explicit full closed mask; camera owns player motion during passage.
if (gate_first && gate_open_rows > 0)
    draw_sprite(spr_mm1_cutman_boss_gate_open_backdrop, 0, x, y);
if (gate_open_rows < 4)
    draw_sprite_part(sprite_index, 0, 0, 0, sprite_get_width(sprite_index),
        64 - gate_open_rows * 16, x, y);
`);
write('obj_mm1_cutman_camera_create.gml',('// First gate: corridor20..22 atX2304..3071/Y720, width3072, handshake1201.\n' + read('obj_mm1_cutman_camera_create.gml').slice(read('obj_mm1_cutman_camera_create.gml').indexOf('camera_player ='))).replace('room_width != 2304','room_width != 3072').replace('requires2304x2160','requires3072x2160')+'\nroute_gate_mode = false;\nroute_gate = noone;\nroute_gate_voice = -1;\n');
write('scr_mm1_cutman_scroll_start.gml',read('scr_mm1_cutman_scroll_start.gml').replace('route_start_version = 1101;','route_start_version = 1201;\nroute_gate_mode = false;'));
let begin=read('obj_mm1_cutman_camera_begin_step.gml').replaceAll('1101','1201').replaceAll('Eleventh Ladder Transition version','First Gate Passage version');
const busy=`if (route_busy && route_gate_mode)
{
    if (route_fire_held && !keyboard_check(route_fire_key)) route_fire_released = true;
    route_tick += 1;
    camera_player.x = route_entry_x;
    camera_player.y = route_entry_y;
    if (instance_exists(route_gate))
    {
        route_gate.gate_open_rows = min(4, 1 + floor(route_tick / 6));
    }
    view_yview[0] = 720;
    view_xview[0] = 2048;
    if (route_tick >= 24)
    {
        var gate_step;
        gate_step = min(64, route_tick - 23);
        view_xview[0] = 2048 + gate_step * 4;
        camera_player.x = route_entry_x + gate_step;
    }
    if (route_tick < 87)
    {
        camera_player.anim_walk_timer += 1;
        if (camera_player.anim_walk_timer >= 7)
        {
            camera_player.anim_walk_timer = 0;
            camera_player.anim_walk_frame = (camera_player.anim_walk_frame + 1) mod 4;
        }
        camera_player.sprite_index = spr_mm5_megaman_walk;
        camera_player.image_index = camera_player.anim_walk_frame;
    }
    else
    {
        camera_player.sprite_index = spr_mm5_megaman_idle;
        camera_player.image_index = 0;
    }
    camera_player.image_speed = 0;
    if (route_tick >= 120) route_section = 12;
    if (route_tick >= 121)
    {
        camera_player.walk_pause = 0;
        camera_player.walk_previous_input = 0;
        scr_mm1_cutman_scroll_finish();
        route_gate_mode = false;
        if (route_block_fire && keyboard_check_direct(route_fire_key)) keyboard_clear(route_fire_key);
    }
    exit;
}
`;
begin=begin.replace('if (route_busy)\n{',busy+'if (route_busy)\n{');
const trigger=`// MM5 grounded standing contact adaptation: no midair/slide teleport.
if (route_section == 11 && view_xview[0] == 2048
    && keyboard_check(vk_right) && !keyboard_check(vk_left)
    && camera_player.grounded && !camera_player.sliding && !camera_player.on_ladder
    && camera_player.fall_speed == 0
    && camera_player.x >= 2264 && camera_player.x < 2265
    && abs(camera_player.y + camera_player.feet_offset - 880) <= 1)
{
    scr_mm1_cutman_gate_start();
    exit;
}
`;
begin=begin.replace('var up, down, climbing;',trigger+'var up, down, climbing;').replace('(route_section < 8 || route_section >= 9)','(route_section < 8 || (route_section >= 9 && route_section <= 11))');write('obj_mm1_cutman_camera_begin_step.gml',begin);
write('obj_mm1_cutman_camera_end_step.gml',read('obj_mm1_cutman_camera_end_step.gml').replace('else if (route_section >= 9)','else if (route_section == 12)\n{\n    camera_player.x = clamp(camera_player.x, 2328, 3048);\n    view_xview[0] = clamp(floor(camera_player.x) - 128, 2304, 2816);\n    view_yview[0] = 720;\n}\nelse if (route_section >= 9)'));
write('scr_mm1_cutman_gate_start.gml',`// Camera context; share existing shot/charge/rearm ownership, not a new player controller.
if (route_busy || !route_lists_ready || !instance_exists(camera_player)) exit;
route_gate = instance_nearest(2272, 816, obj_mm1_cutman_boss_gate);
if (!instance_exists(route_gate)) exit;
if (route_gate.x != 2272 || route_gate.y != 816) exit;
route_start_version = 0;
scr_mm1_cutman_scroll_start(0);
if (route_start_version != 1201)
    show_error("Cut Man gate script mismatch: replace the ENTIRE scr_mm1_cutman_scroll_start with the First Gate Passage version, then restart.", true);
// MM5-style immediate response; retain adapted MM1 four-strip artwork/cadence.
route_gate_voice = audio_play_sound(snd_mm5_gate_open, 15, false);
route_gate.gate_open_rows = 1;
route_gate_mode = true;
route_target_section = 12;
route_unlock = 121;
// Snap only the quarter-pixel native gate-entry phase; floor adapts MM5 feet reference.
route_entry_x = 2264.25;
route_entry_y = 880 - camera_player.feet_offset;
route_was_ladder = false;
route_fall_speed = 0;
camera_player.x = route_entry_x;
camera_player.y = route_entry_y;
camera_player.fall_speed = 0;
camera_player.grounded = true;
camera_player.image_xscale = 1;
camera_player.anim_walk_frame = 0;
camera_player.anim_walk_timer = 0;
camera_player.sprite_index = spr_mm5_megaman_walk;
camera_player.image_index = 0;
camera_player.image_speed = 0;
view_xview[0] = 2048;
view_yview[0] = 720;
`);
for(const f of['obj_mm1_cutman_camera_destroy.gml','obj_mm1_cutman_camera_room_end.gml'])write(f,'// Stop only the gate voice owned by this camera. Idempotent Room End/Destroy.\nif (route_gate_voice != -1)\n{\n    audio_stop_sound(route_gate_voice);\n    route_gate_voice = -1;\n}\nscr_mm1_cutman_scroll_dispose();\n');
// Full closed scene preserves every accepted pixel; only add new corridor outside old width.
const scene=new PNG({width:3072,height:2160});for(let i=0;i<3072*2160;i++)scene.data.set(sky,i*4);
const old=PNG.sync.read(fs.readFileSync(new URL('cutman_eleventh_route_reference.png',base)));for(let y=0;y<2160;y++)old.data.copy(scene.data,y*3072*4,y*2304*4,(y+1)*2304*4);for(let y=0;y<240;y++)raw.data.copy(scene.data,((y+720)*3072+2304)*4,y*768*4,(y+1)*768*4);
write('cutman_first_gate_route_reference.png',PNG.sync.write(scene));write('cutman_gate_corridor_reference.png',PNG.sync.write(raw));write('geometry.json',JSON.stringify({world:{width:3072,height:2160},atlas:{width:128,height:atlas.height,tiles:tiles.length},cells,objects,features,placements,solids,ladders,tops},null,2));
console.log({tiles:tiles.length,atlasHeight:atlas.height,placements:placements.length,solids:solids.length,ladders:ladders.length,tops:tops.length,blocks:objects.length,features:features.length});
// Verify the actual top-crop composition against native PPU at multiple opening phases.
const closed=PNG.sync.read(fs.readFileSync(new URL('spr_mm1_cutman_boss_gate_closed.png',base)));
for(const[frame,removed]of[[56,1],[64,2],[72,4]]){
 n.fromJSON(JSON.parse(fs.readFileSync(new URL(`frame-${frame}.json`,work))));const nt=n.ppu.nameTable[n.ppu.ntable1[1]];
 for(let y=0;y<64;y++)for(let x=0;x<32;x++){
  const tx=28+Math.floor(x/8),ty=12+Math.floor(y/8),idx=ty*32+tx,t=n.ppu.ptTile[n.ppu.f_bgPatternTable*256+nt.tile[idx]],rgb=mesenRgbFromJsnes(n.ppu.imgPalette[nt.attrib[idx]+t.pix[y%8*8+x%8]]),expected=[rgb&255,rgb>>8&255,rgb>>16&255,255],art=y<64-removed*16?closed:backdrop;
  assert.deepEqual([...art.data.subarray((y*32+x)*4,(y*32+x+1)*4)],expected,`Gate draw matches native frame${frame} pixel${x},${y}`);
 }
}
console.log('PASS native opening pixels: first, second and fully-open phases; recovered backdrop and cropped closed artwork.');
