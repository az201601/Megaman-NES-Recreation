import fs from'node:fs';import assert from'node:assert/strict';import{PNG}from'pngjs';import{createHash}from'node:crypto';
const root=new URL('../../',import.meta.url),work=new URL('./.work/cutman-route/',import.meta.url),out=new URL('../../Assets/Cut Man/Stage/Opening Route/',import.meta.url);fs.mkdirSync(out,{recursive:true});
const raw=PNG.sync.read(fs.readFileSync(new URL('opening-raw.png',work))),cells=JSON.parse(fs.readFileSync(new URL('cells.json',work))),rom=fs.readFileSync(new URL('Mega Man (USA).nes',root));
const block=PNG.sync.read(fs.readFileSync(new URL('Assets/Stage Objects/Super Arm/spr_mm1_super_arm_block.png',root)));
const objects=[];let start=16+0xe00;for(let i=0;i<rom[start];i++){const[kind,page,x,y,x2,y2]=rom.subarray(start+1+i*6,start+7+i*6);if(page<4&&kind===2){assert.equal(x2-x,32);assert.equal(y2-y,32);objects.push({x:page*256+x,y,width:32,height:32});}}
assert.equal(objects.length,9);
const contains=(c,o)=>c.x>=o.x&&c.x<o.x+32&&c.y>=o.y&&c.y<o.y+32;
const oldScenery=PNG.sync.read(fs.readFileSync(new URL('Assets/Cut Man/Stage/Screen 01/cutman_screen01_scenery_reference.png',root)));
const hashes=new Map(),tiles=[],placements=[],sky=[72,205,222,255],scenery=new PNG({width:1024,height:240});for(let i=0;i<1024*240;i++)scenery.data.set(sky,i*4);
for(const c of cells){
 c.object=objects.some(o=>contains(c,o));
 const p=new PNG({width:16,height:16});for(let y=0;y<16;y++)for(let x=0;x<16;x++){let rgb=raw.data.subarray(((c.y+y)*1024+c.x+x)*4,((c.y+y)*1024+c.x+x)*4+4);if(c.object){rgb=c.x<512?oldScenery.data.subarray(((c.y+y)*256+(c.x%256)+x)*4,((c.y+y)*256+(c.x%256)+x)*4+4):Buffer.from(sky);}if(!sky.every((v,i)=>v===rgb[i]))p.data.set(rgb,(y*16+x)*4);scenery.data.set(rgb,((c.y+y)*1024+c.x+x)*4);}
 if(!p.data.some((v,i)=>i%4===3&&v))continue;
 const h=createHash('sha256').update(p.data).digest('hex');if(!hashes.has(h)){hashes.set(h,tiles.length);tiles.push(p);}placements.push({x:c.x,y:c.y,tile:hashes.get(h)});
}
const composed=PNG.sync.read(PNG.sync.write(scenery));for(const o of objects)for(let y=0;y<32;y++)for(let x=0;x<32;x++)composed.data.set(block.data.subarray((y*32+x)*4,(y*32+x+1)*4),((o.y+y)*1024+o.x+x)*4);
assert.deepEqual(composed.data,raw.data,'Scenery + nine separate objects must reconstruct all four decoded screens');
const old=PNG.sync.read(fs.readFileSync(new URL('Assets/Cut Man/Stage/Screen 01/cutman_screen01_scenery_reference.png',root)));let diffs=0;for(let y=0;y<240;y++)for(let x=0;x<256;x++){const a=old.data.subarray((y*256+x)*4,(y*256+x+1)*4),b=scenery.data.subarray((y*1024+x)*4,(y*1024+x+1)*4);if(!a.equals(b)){assert.equal(y,0);diffs++;}}assert.equal(diffs,256);
const atlas=new PNG({width:128,height:Math.ceil(tiles.length/8)*16});tiles.forEach((p,i)=>{for(let y=0;y<16;y++)p.data.copy(atlas.data,(((Math.floor(i/8)*16+y)*128)+(i%8)*16)*4,y*16*4,(y+1)*16*4);});
fs.writeFileSync(new URL('bg_mm1_cutman_opening_tileset.png',out),PNG.sync.write(atlas));fs.writeFileSync(new URL('cutman_opening_layout_reference.png',out),PNG.sync.write(composed));fs.writeFileSync(new URL('cutman_opening_scenery_reference.png',out),PNG.sync.write(scenery));
let g='// Once per room entry. Entire original opening stripe: worldX0..1023. Visual tiles ONLY.\n';for(const p of placements)g+=`tile_add(bg_mm1_cutman_opening_tileset, ${p.tile%8*16}, ${Math.floor(p.tile/8)*16}, 16, 16, ${p.x}, ${p.y}, 1000);\n`;fs.writeFileSync(new URL('scr_mm1_cutman_opening_tiles.gml',out),g);
function rects(cls){let done=new Set(),result=[];const set=new Set(cells.filter(c=>c.class===cls&&!c.object).map(c=>`${c.x},${c.y}`));for(let y=0;y<240;y+=16)for(let x=0;x<1024;x+=16){let key=`${x},${y}`;if(!set.has(key)||done.has(key))continue;let w=16,h=16;while(set.has(`${x+w},${y}`)&&!done.has(`${x+w},${y}`))w+=16;outer:while(y+h<240){for(let dx=0;dx<w;dx+=16)if(!set.has(`${x+dx},${y+h}`)||done.has(`${x+dx},${y+h}`))break outer;h+=16;}for(let dy=0;dy<h;dy+=16)for(let dx=0;dx<w;dx+=16)done.add(`${x+dx},${y+dy}`);result.push({x,y,width:w,height:h});}return result;}
const solids=rects(1),ladders=rects(2),tops=ladders.filter(l=>l.y>0).map(l=>({...l,height:1}));
// Screen01 known query regions must be preserved exactly by class-derived geometry.
const expectedSolids=[[0,192,256,48],[0,96,80,16],[96,96,64,16],[176,96,16,16],[224,96,32,16]],expectedLadders=[[80,96,16,96],[160,96,16,32]];
for(let y=0;y<240;y++)for(let x=0;x<256;x++){
 const inRect=(r)=>x>=r[0]&&x<r[0]+r[2]&&y>=r[1]&&y<r[1]+r[3];const actual=(r)=>x>=r.x&&x<r.x+r.width&&y>=r.y&&y<r.y+r.height;
 assert.equal(solids.some(actual),expectedSolids.some(inRect));assert.equal(ladders.some(actual),expectedLadders.some(inRect));
}
g='// Once per room entry. Original ROM collision classes, NOT visual tile collision.\n// Super Arm cells excluded; child block objects supply their own removable collision.\nvar region;\n';for(const [list,type]of[[solids,'solid'],[ladders,'ladder'],[tops,'ladder_top']])for(const r of list)g+=`region = instance_create(${r.x}, ${r.y}, obj_stage_${type});\nregion.image_xscale = ${r.width/16};\nregion.image_yscale = ${r.height/16};\n`;fs.writeFileSync(new URL('scr_mm1_cutman_opening_collision.gml',out),g);
g='// Keep the FOUR editor-placed Screen01 blocks. Add only the FIVE extension blocks.\n';for(const o of objects.filter(o=>o.x>=256))g+=`instance_create(${o.x}, ${o.y}, obj_mm1_super_arm_block);\n`;fs.writeFileSync(new URL('scr_mm1_cutman_opening_blocks.gml',out),g);
fs.writeFileSync(new URL('tile-placement.csv',out),'world_x,y,atlas_x,atlas_y\n'+placements.map(p=>`${p.x},${p.y},${p.tile%8*16},${Math.floor(p.tile/8)*16}`).join('\n')+'\n');fs.writeFileSync(new URL('geometry.json',out),JSON.stringify({source:'MM1 USA stage0 bank0; 32x32 blocks column-major, classes/palettes from original tables. Original PPU upload checks cover all4screens; pages2/3 via controlled height/protection traversal, not natural playthrough.',world:{width:1024,height:240,firstPage:0,lastPage:3},sky,atlas:{width:atlas.width,height:atlas.height,uniqueTiles:tiles.length,placements:placements.length},solids,ladders,tops,objects,existingScreenDifference:'Only256pixels of firstscreen blacktop scanline in old framebuffer capture. Native CHR decode renders cyan sky there, rather than retaining emulator/capture border artifact.',cells},null,2));
console.log({uniqueTiles:tiles.length,placements:placements.length,solids:solids.length,ladders:ladders.length,tops:tops.length,objects:objects.length,fullReconstruction:'PASS',existingScreenGeometry:'PASS'});

fs.copyFileSync(new URL("camera.json",work),new URL("native-camera-trace.json",out));
fs.writeFileSync(new URL("block-placement.csv",out),"object,x,y,width,height,existing_editor_instance\n"+objects.map(o=>`obj_mm1_super_arm_block,${o.x},${o.y},32,32,${o.x<256}`).join("\n")+"\n");
