import fs from'node:fs';import assert from'node:assert/strict';import{PNG}from'pngjs';import{NES}from'jsnes';import{mesenRgbFromJsnes}from'./mesen-palette.mjs';
const root=new URL('../../',import.meta.url),base=new URL('Assets/Cut Man/Stage/First Gate Passage/',root),out=new URL('Assets/Cut Man/Stage/Second Gate Passage/',root),w=new URL('./.work/cutman-second-gate/',import.meta.url);fs.mkdirSync(out,{recursive:true});
const read=f=>fs.readFileSync(new URL(f,base),'utf8'),write=(f,s)=>fs.writeFileSync(new URL(f,out),s),old=JSON.parse(read('geometry.json')),raw=PNG.sync.read(fs.readFileSync(new URL('upper-raw.png',w))),atlas=PNG.sync.read(fs.readFileSync(new URL('bg_mm1_cutman_ladder_route_tileset.png',base))),sky=[72,205,222,255],rom=fs.readFileSync(new URL('Mega Man (USA).nes',root));
const blocks=[];for(let i=0;i<rom[16+0xe00];i++){let[k,p,x,y,x2,y2]=rom.subarray(16+0xe01+i*6,16+0xe07+i*6);if(k===2&&p===23)blocks.push({x:3072+x,y:720+y,width:x2-x,height:y2-y});}assert.deepEqual(blocks,[{x:3104,y:880,width:32,height:32},{x:3136,y:880,width:32,height:32}]);
const cells=old.cells.concat(JSON.parse(fs.readFileSync(new URL('upper-cells.json',w))).map(c=>({...c,x:c.x+3072,y:c.y+720,object:blocks.some(b=>c.x+3072>=b.x&&c.x+3072<b.x+b.width&&c.y+720>=b.y&&c.y+720<b.y+b.height)}))),objects=old.objects.concat(blocks),features=old.features,placements=old.placements.map(p=>({...p})),tiles=[];
for(let t=0;t<old.atlas.tiles;t++){const b=Buffer.alloc(1024);for(let y=0;y<16;y++)atlas.data.copy(b,y*64,((Math.floor(t/8)*16+y)*128+t%8*16)*4,((Math.floor(t/8)*16+y)*128+t%8*16)*4+64);tiles.push(b);}
for(const c of cells.slice(old.cells.length).filter(c=>!c.object)){const b=Buffer.alloc(1024);for(let y=0;y<16;y++)for(let x=0;x<16;x++){const k=((c.y-720+y)*256+c.x-3072+x)*4,a=raw.data.subarray(k,k+4);if(!sky.every((v,i)=>v===a[i]))b.set(a,(y*16+x)*4);}if(!b.some((v,i)=>i%4===3&&v))continue;let t=tiles.findIndex(v=>v.equals(b));if(t<0){t=tiles.length;tiles.push(b);}placements.push({x:c.x,y:c.y,tile:t});}
const expanded=new PNG({width:128,height:Math.ceil(tiles.length/8)*16});for(let t=0;t<tiles.length;t++)for(let y=0;y<16;y++)tiles[t].copy(expanded.data,((Math.floor(t/8)*16+y)*128+t%8*16)*4,y*64,(y+1)*64);write('bg_mm1_cutman_ladder_route_tileset.png',PNG.sync.write(expanded));
// Merge only new-page terrain; exclude both scripted block footprints.
const solidCells=cells.slice(old.cells.length).filter(c=>c.class===1&&!c.object),done=new Set(),added=[];
for(const c of solidCells){const key=(x,y)=>`${x},${y}`,exists=(x,y)=>solidCells.some(c=>c.x===x&&c.y===y)&&!done.has(key(x,y));if(!exists(c.x,c.y))continue;let width=16,height=16;while(exists(c.x+width,c.y))width+=16;loop:while(c.y+height<960){for(let x=c.x;x<c.x+width;x+=16)if(!exists(x,c.y+height))break loop;height+=16;}for(let y=c.y;y<c.y+height;y+=16)for(let x=c.x;x<c.x+width;x+=16)done.add(key(x,y));added.push({x:c.x,y:c.y,width,height});}
added.push({x:3072,y:816,width:16,height:64});const solids=old.solids.concat(added),ladders=old.ladders,tops=old.tops;
for(const f of fs.readdirSync(base).filter(f=>f.endsWith('.gml')))write(f,read(f));
let s='// All accepted content plus original page23, once per room entry.\n';for(const p of placements)s+=`tile_add(bg_mm1_cutman_ladder_route_tileset, ${p.tile%8*16}, ${Math.floor(p.tile/8)*16}, 16, 16, ${p.x}, ${p.y}, 1000);\n`;write('scr_mm1_cutman_ladder_route_tiles.gml',s);
s=read('scr_mm1_cutman_ladder_route_collision.gml');for(const r of added)s+=`region = instance_create(${r.x}, ${r.y}, obj_stage_solid);\nregion.image_xscale = ${r.width/16};\nregion.image_yscale = ${r.height/16};\n`;write('scr_mm1_cutman_ladder_route_collision.gml',s);
write('scr_mm1_cutman_ladder_route_blocks.gml',read('scr_mm1_cutman_ladder_route_blocks.gml')+'\n// Two original boss-room blocks, still scripted; no manual placements.\n'+blocks.map(b=>`instance_create(${b.x}, ${b.y}, obj_mm1_super_arm_block);\n`).join(''));
write('obj_mm1_cutman_camera_create.gml',read('obj_mm1_cutman_camera_create.gml').replace('// First gate: corridor20..22 atX2304..3071/Y720, width3072, handshake1201.','// Second gate adds page23 atX3072/Y720; width3328, handshake1301.').replace('room_width != 3072','room_width != 3328').replace('requires3072x2160','requires3328x2160')+'\nroute_gate_origin_x = 2048;\nroute_gate_second = false;\n');
write('scr_mm1_cutman_scroll_start.gml',read('scr_mm1_cutman_scroll_start.gml').replaceAll('1201','1301'));
s=read('scr_mm1_cutman_gate_start.gml').replace('route_gate = instance_nearest(2272, 816, obj_mm1_cutman_boss_gate);','var gate_x;\nroute_gate_second = (route_section == 12);\ngate_x = 2272;\nif (route_gate_second) gate_x = 3056;\nroute_gate_origin_x = gate_x - 224;\nif (route_gate_second) route_gate_origin_x = 2816;\nroute_gate = instance_nearest(gate_x, 816, obj_mm1_cutman_boss_gate);').replace('route_gate.x != 2272','route_gate.x != gate_x').replaceAll('1201','1301').replaceAll('First Gate Passage version','Second Gate Passage version').replace('route_target_section = 12;','route_target_section = 12;\nif (route_gate_second) route_target_section = 13;').replace('route_entry_x = 2264.25;','route_entry_x = gate_x - 8 + 0.25;').replace('view_xview[0] = 2048;','view_xview[0] = route_gate_origin_x;');write('scr_mm1_cutman_gate_start.gml',s);
s=read('obj_mm1_cutman_camera_begin_step.gml').replaceAll('1201','1301').replaceAll('First Gate Passage version','Second Gate Passage version');
const a=s.indexOf('if (route_busy && route_gate_mode)'),b=s.indexOf('if (route_busy)\n{',a);let busy=s.slice(a,b).replaceAll('view_xview[0] = 2048','view_xview[0] = route_gate_origin_x').replace('camera_player.x = route_entry_x + gate_step;','camera_player.x = route_entry_x + gate_step;\n        if (route_gate_second)\n        {\n            camera_player.x = route_entry_x + gate_step * (11 / 16);\n            // Native final frame resolves against the incoming left boundary.\n            if (gate_step == 64) camera_player.x = 3096.5625;\n        }').replace('route_section = 12;','route_section = route_target_section;');s=s.slice(0,a)+busy+s.slice(b);
const marker='var up, down, climbing;';s=s.replace(marker,`// Second gate: standing floor contact, immediate approved opening, no boss AI.
if (route_section == 12 && view_xview[0] == 2816
    && keyboard_check(vk_right) && !keyboard_check(vk_left)
    && camera_player.grounded && !camera_player.sliding && !camera_player.on_ladder
    && camera_player.fall_speed == 0
    && camera_player.x >= 3048 && camera_player.x < 3049
    && abs(camera_player.y + camera_player.feet_offset - 880) <= 1)
{
    scr_mm1_cutman_gate_start();
    exit;
}
`+marker);write('obj_mm1_cutman_camera_begin_step.gml',s);
write('obj_mm1_cutman_camera_end_step.gml',read('obj_mm1_cutman_camera_end_step.gml').replace('else if (route_section >= 9)',`else if (route_section == 13)
{
    camera_player.x = clamp(camera_player.x, 3096, 3304);
    view_xview[0] = 3072;
    view_yview[0] = 720;
}
else if (route_section >= 9)`));
write('obj_mm1_cutman_boss_gate_draw.gml',read('obj_mm1_cutman_boss_gate_draw.gml').replace('if (gate_first && gate_open_rows > 0)\n    draw_sprite(spr_mm1_cutman_boss_gate_open_backdrop, 0, x, y);',`if (gate_open_rows > 0)
{
    if (gate_first) draw_sprite(spr_mm1_cutman_boss_gate_open_backdrop, 0, x, y);
    else draw_sprite(spr_mm1_cutman_second_gate_open_backdrop, 0, x, y);
}`));
// Recover the second gate's erased background, not cyan from the first gate.
const n=new NES();n.loadROM(rom.toString('binary'));n.fromJSON(JSON.parse(fs.readFileSync(new URL('frame-72.json',w))));const nt=n.ppu.nameTable[n.ppu.ntable1[0]],backdrop=new PNG({width:16,height:64});for(let y=0;y<64;y++)for(let x=0;x<16;x++){let idx=(12+Math.floor(y/8))*32+30+Math.floor(x/8),tile=n.ppu.ptTile[n.ppu.f_bgPatternTable*256+nt.tile[idx]],rgb=mesenRgbFromJsnes(n.ppu.imgPalette[nt.attrib[idx]+tile.pix[y%8*8+x%8]]);backdrop.data.set([rgb&255,rgb>>8&255,rgb>>16&255,255],(y*16+x)*4);}write('spr_mm1_cutman_second_gate_open_backdrop.png',PNG.sync.write(backdrop));
const scene=new PNG({width:3328,height:2160}),oldScene=PNG.sync.read(fs.readFileSync(new URL('cutman_first_gate_route_reference.png',base)));for(let i=0;i<3328*2160;i++)scene.data.set(sky,i*4);for(let y=0;y<2160;y++)oldScene.data.copy(scene.data,y*3328*4,y*3072*4,(y+1)*3072*4);for(let y=0;y<240;y++)raw.data.copy(scene.data,((720+y)*3328+3072)*4,y*256*4,(y+1)*256*4);
write('cutman_second_gate_route_reference.png',PNG.sync.write(scene));write('cutman_boss_room_reference.png',PNG.sync.write(raw));write('geometry.json',JSON.stringify({world:{width:3328,height:2160},atlas:{width:128,height:expanded.height,tiles:tiles.length},cells,placements,objects,features,solids,ladders,tops},null,2));write('native-second-gate.json',fs.readFileSync(new URL('native-second-gate.json',w)));
console.log({tiles:tiles.length,atlasHeight:expanded.height,placements:placements.length,solids:solids.length,blocks:objects.length});
const closed=PNG.sync.read(fs.readFileSync(new URL('spr_mm1_cutman_second_gate_closed.png',base)));
for(const[frame,removed]of[[56,1],[64,2],[72,4]]){n.fromJSON(JSON.parse(fs.readFileSync(new URL(`frame-${frame}.json`,w))));const nt=n.ppu.nameTable[n.ppu.ntable1[0]];for(let y=0;y<64;y++)for(let x=0;x<16;x++){let idx=(12+Math.floor(y/8))*32+30+Math.floor(x/8),t=n.ppu.ptTile[n.ppu.f_bgPatternTable*256+nt.tile[idx]],rgb=mesenRgbFromJsnes(n.ppu.imgPalette[nt.attrib[idx]+t.pix[y%8*8+x%8]]),art=y<64-removed*16?closed:backdrop;assert.deepEqual([...art.data.subarray((y*16+x)*4,(y*16+x+1)*4)],[rgb&255,rgb>>8&255,rgb>>16&255,255]);}}
console.log('PASS second-gate cropped Draw composition matches native PPU first/second/full-open phases.');
