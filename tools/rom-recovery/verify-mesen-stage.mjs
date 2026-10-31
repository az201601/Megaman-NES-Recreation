// Pixel-exact composition check for palette-matched Cut Man first-screen art.
import fs from 'node:fs';
import {PNG} from 'pngjs';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url);
const stage=new URL('Assets/Cut Man/Stage/Screen 01/',root);
const read=(name)=>PNG.sync.read(fs.readFileSync(new URL(name,stage)));
const scene=read('bg_mm1_cutman_screen01_background.png');
const tiles=read('bg_mm1_cutman_screen01_tileset.png');
assert.equal(scene.width,256);assert.equal(scene.height,240);
assert.equal(tiles.width,128);assert.equal(tiles.height,32);
function blit(src,sx,sy,w,h,dx,dy){
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const a=((sy+y)*src.width+sx+x)*4,b=((dy+y)*scene.width+dx+x)*4;
  assert.ok(dx+x>=0&&dx+x<256&&dy+y>=0&&dy+y<240);
  assert.ok(src.data[a+3]===0||src.data[a+3]===255);
  if(src.data[a+3])src.data.copy(scene.data,b,a,a+4);
 }
}
const placements=fs.readFileSync(new URL('tile-placement.csv',stage),'utf8').trim().split(/\r?\n/).slice(1);
assert.equal(placements.length,123);
for(const row of placements){const [x,y,sx,sy]=row.split(',').map(Number);blit(tiles,sx,sy,16,16,x,y);}
assert.deepEqual(scene.data,read('cutman_screen01_scenery_reference.png').data,'Scenery mismatch');
const block=PNG.sync.read(fs.readFileSync(new URL('Assets/Stage Objects/Super Arm/spr_mm1_super_arm_block.png',root)));
assert.equal(block.width,32);assert.equal(block.height,32);
const objects=fs.readFileSync(new URL('object-placement.csv',stage),'utf8').trim().split(/\r?\n/).slice(1);
assert.equal(objects.length,4);
for(const row of objects){const [name,x,y]=row.split(',');assert.equal(name,'obj_mm1_super_arm_block');blit(block,0,0,32,32,Number(x),Number(y));}
assert.deepEqual(scene.data,read('cutman_screen01_layout_reference.png').data,'Full layout mismatch');
console.log('Mesen-colour stage verified: sky + 123 tiles equals scenery; adding four separate block sprites equals full layout, zero differing RGBA pixels.');
