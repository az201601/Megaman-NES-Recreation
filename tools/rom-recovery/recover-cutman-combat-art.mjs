// Controlled pose/counter fixtures, ORIGINAL USA renderer and full PPU frames.
// Not natural combat animation timing; art only. No ROM/CHR/palette patches.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { NES } from 'jsnes';
import { PNG } from 'pngjs';
import { mesenRgbFromJsnes } from './mesen-palette.mjs';
const root=new URL('../../',import.meta.url),base=new URL('Assets/Bosses/MM1/Cut Man/Combat/',root);
const rom=fs.readFileSync(new URL('Mega Man (USA).nes',root)),hash=b=>createHash('sha256').update(b).digest('hex');
assert.equal(hash(rom),'58fb9ef0c14c2947332929b9330d56c38a78040fd388274c39efd84e8d5446c7');
const rb=a=>rom[16+6*16384+(a&16383)], rw=a=>rb(a)|rb(a+1)<<8;
const snap=JSON.parse(fs.readFileSync(new URL('./.work/cutman-boss-entrance/frame-473.json',import.meta.url)));
let pixels;const n=new NES({emulateSound:false,onFrame:p=>pixels=p.slice()});n.loadROM(rom.toString('binary'));
const frames=new Map(),animations=[],fixtures=[];
fs.mkdirSync(new URL('Art/',base),{recursive:true});
for(const {pose,hurt} of [...[27,28,63,64,65,66,67,68,69,70,71,87,88].map(pose=>({pose,hurt:false})),{pose:87,hurt:true}]){
 const pointer=rw(0x8186+pose*2),header=rb(pointer),count=(header>>4)+1,animation={pose,hurt,pointer,header,frames:[]};
 assert.ok(count<=8&&count>=1);
 for(let index=0;index<count;index++)for(const right of[false,true]){
  n.fromJSON(structuredClone(snap));for(let b=0;b<8;b++)n.buttonUp(1,b);
  const m=n.cpu.mem;
  // Two updates pair completed PPU output with forced actor pose; original
  // actor lifecycle1 skips its AI/animation. Does not alter source art/palettes.
  for(let f=0;f<2;f++){
   m[0x6a1]=1;m[0x44]=0;m[0x56]=hurt?2:0;m[0x55]=100;m[0x401]=pose;m[0x441]=index*16;m[0x641]=0;
   m[0x481]=128;m[0x601]=120;m[0x4a1]=m[0x621]=0;m[0x421]=right?0x43:3;
   n.frame();
  }
  const cells=[];
  for(let i=0;i<64;i++){
   const[y,tile,attr,x]=n.ppu.spriteMem.slice(i*4,i*4+4);
   if(x>=104&&x<152&&y>=88&&y<152)cells.push({x:x-128,y:y+1-120,tile,attr});
  }
  assert.ok(cells.length>0,`pose${pose}/${index}`);
  const p=new PNG({width:48,height:64});
  for(const cell of[...cells].reverse())for(let y=0;y<8;y++)for(let x=0;x<8;x++){
   const tile=n.ppu.ptTile[cell.tile+256*n.ppu.f_spPatternTable];
   const v=tile.pix[(cell.attr&128?7-y:y)*8+(cell.attr&64?7-x:x)];if(!v)continue;
   const px=24+cell.x+x,py=32+cell.y+y;assert.ok(px>=0&&px<48&&py>=0&&py<64);
   const rgb=mesenRgbFromJsnes(n.ppu.sprPalette[(cell.attr&3)*4+v]);p.data.set([rgb&255,rgb>>8&255,rgb>>16&255,255],(py*48+px)*4);
  }
  let matched=0;
  for(let y=0;y<64;y++)for(let x=0;x<48;x++){
   const k=(y*48+x)*4;if(!p.data[k+3])continue;
   const rgb=mesenRgbFromJsnes(pixels[(88+y)*256+104+x]);
   assert.deepEqual([...p.data.subarray(k,k+3)],[rgb&255,rgb>>8&255,rgb>>16&255],`PPU pose${pose}/${index}/${right} at${x},${y}`);matched++;
  }
  const key=hash(p.data);if(!frames.has(key))frames.set(key,{index:frames.size,p,rgbaSha256:key});
  const stripIndex=frames.get(key).index;
  if(right)animation.frames[index].right=stripIndex;else animation.frames[index]={left:stripIndex};
  fixtures.push({pose,hurt,frame:index,right,stripIndex,cells,matched});
 }
 animations.push(animation);
}
const strip=new PNG({width:frames.size*48,height:64});
for(const{index,p}of frames.values())for(let y=0;y<64;y++)p.data.copy(strip.data,(y*strip.width+index*48)*4,y*192,(y+1)*192);
const name=`spr_mm1_cutman_combat_strip${frames.size}.png`,data=PNG.sync.write(strip);fs.writeFileSync(new URL('Art/'+name,base),data);
const report={romSha256:hash(rom),method:'Original-USA entrance snapshot frame473; controlled boss pose/counter/X128/Y120/facing/lifecycle1 over two updates per fixture. Full original renderer/APU-disabled PPU frame. All opaque exported sprite pixels independently matched to completed native frame. Both facings exported explicitly, no inferred mirror offset. No ROM,CHR or palette changes.',limitations:['Pose substitution/lifecycle fixture, not natural combat animation timing.','Strip includes both facings and no-head-cutter pose variants.','No GMS render/installation acceptance.'],file:'Art/'+name,sha256:hash(data),cell:[48,64],origin:[24,32],animations,frames:[...frames.values()].map(({p,...r})=>r),fixtures};
fs.writeFileSync(new URL('Reference/combat-art.json',base),JSON.stringify(report,null,2)+'\n');
console.log(`PASS ${fixtures.length} native rendered pose/facing fixtures; ${frames.size} unique48x64 frames, all opaque pixels matched.`,name);
