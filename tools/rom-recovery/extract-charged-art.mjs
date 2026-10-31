// Original-ROM charged projectile OAM/CHR with pinned Mesen0.9.9 colours, not Mesen capture.
import {NES,Controller} from 'jsnes';import {PNG} from 'pngjs';
import fs from 'node:fs';import assert from 'node:assert/strict';
import {mesenRgbFromJsnes} from './mesen-palette.mjs';
const root=new URL('../../',import.meta.url),dir=new URL('Assets/Mega Man/MM5/Buster/Charging/',root);
fs.mkdirSync(dir,{recursive:true});
function paint(n,slots,w,h,rx,ry,ox,oy){
 assert.equal(n.ppu.f_spriteSize,0);
 const p=new PNG({width:w,height:h});let count=0;
 for(const i of slots.slice().reverse()){
  const tile=n.ppu.ptTile[n.ppu.sprTile[i]+256*n.ppu.f_spPatternTable];
  for(let y=0;y<8;y++)for(let x=0;x<8;x++){
   const c=tile.pix[(n.ppu.vertFlip[i]?7-y:y)*8+(n.ppu.horiFlip[i]?7-x:x)];if(!c)continue;
   const dx=n.ppu.sprX[i]+x-rx+ox,dy=n.ppu.sprY[i]+1+y-ry+oy;
   assert.ok(dx>=0&&dx<w&&dy>=0&&dy<h,'Clipped opaque shooting pixel');
   const v=mesenRgbFromJsnes(n.ppu.sprPalette[n.ppu.sprCol[i]+c]);
   p.data.set([v&255,v>>8&255,v>>16&255,255],(dy*w+dx)*4);count++;
  }
 }
 assert.ok(count>0);return p;
}

const evidence=[];
for(const left of [false,true])for(const held of [41,81]){
 const full=held===81,w=full?32:24,h=full?32:16,ox=left?8:(full?24:16),oy=full?15:7,frames=full?4:2,slot=full?1:3;
 let screen;const n=new NES({onFrame:f=>{screen=f;}});n.loadROM(fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary'));
 n.fromJSON(JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json',import.meta.url))));
 for(let b=0;b<8;b++)n.buttonUp(1,b);for(let i=0;i<30;i++)n.frame();
 if(left){n.cpu.mem[0x31]=2;n.cpu.mem[0x420]=2;n.cpu.mem[0x528]&=0xdf;}
 const poses=new Map(),samples=[],verified=new Set();
 for(let t=1;t<=held+14;t++){
  if(t===1)n.buttonDown(1,Controller.BUTTON_B);if(t===held+1)n.buttonUp(1,Controller.BUTTON_B);
  const m=n.cpu.mem,rx=m[0x330+slot]-m[0xfc],ry=m[0x378+slot],phase=m[0x540+slot];
  n.frame();
  if(t<held+2)continue;
  assert.equal(m[0x558+slot],full?0xa9:0xa8);
  const slots=Array.from({length:64},(_,i)=>i).filter(i=>n.ppu.sprY[i]<239&&n.ppu.sprTile[i]>=(full?0x65:0x75)&&n.ppu.sprTile[i]<=0x79
   &&n.ppu.sprX[i]>=rx-ox&&n.ppu.sprX[i]<=rx+w-ox&&n.ppu.sprY[i]+1>=ry-oy&&n.ppu.sprY[i]+1<=ry+h-oy);
  assert.equal(slots.length,(full?[10,8,12,5]:[5,4])[phase],'Every native projectile component must be retained');
  const image=paint(n,slots,w,h,rx,ry,ox,oy);
  // Once clear of player overlap and first in OAM, compare every opaque pixel.
  // Alternating lower-priority shot OAM can hit NES eight-sprites/scanline loss.
  // This catches wrong CHR/palette/component selection independently of mirrored repeats.
  if(t>=held+6 && Math.min(...slots)===1){
   for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const k=(y*w+x)*4;if(!image.data[k+3])continue;
    const v=mesenRgbFromJsnes(screen[(ry-oy+y)*256+rx-ox+x]);
    assert.deepEqual([...image.data.subarray(k,k+3)],[v&255,v>>8&255,v>>16&255],JSON.stringify({left,held,t,phase,rx,ry,x,y,worldX:rx-ox+x,worldY:ry-oy+y}));
   }
   verified.add(phase);
  }
  if(poses.has(phase))assert.deepEqual(image.data,poses.get(phase).data,'Same original phase must render identically');
  else poses.set(phase,image);
  samples.push({age:t-held,phase,components:slots.map(i=>({tile:n.ppu.sprTile[i],palette:n.ppu.sprCol[i],dx:n.ppu.sprX[i]-rx,dy:n.ppu.sprY[i]+1-ry,hflip:n.ppu.horiFlip[i],vflip:n.ppu.vertFlip[i]}))});
 }
 assert.deepEqual([...poses.keys()].sort(),Array.from({length:frames},(_,i)=>i));
 assert.deepEqual([...verified].sort(),Array.from({length:frames},(_,i)=>i),'Each phase must pass rendered-framebuffer check');
 const strip=new PNG({width:w*frames,height:h});
 for(let i=0;i<frames;i++)for(let y=0;y<h;y++)poses.get(i).data.copy(strip.data,(y*w*frames+i*w)*4,y*w*4,(y+1)*w*4);
 const name='spr_mm5_buster_'+(full?'full':'mid')+'_strip'+frames+'.png';
 if(!left)fs.writeFileSync(new URL(name,dir),PNG.sync.write(strip));
 else{
  const right=PNG.sync.read(fs.readFileSync(new URL(name,dir)));
  for(let frame=0;frame<frames;frame++)for(let y=0;y<h;y++)for(let x=0;x<w;x++){
   const a=(y*w*frames+frame*w+x)*4,b=(y*w*frames+frame*w+w-1-x)*4;
   assert.deepEqual(strip.data.subarray(a,a+4),right.data.subarray(b,b+4),'Native left must match reflection around RAM reference');
  }
 }
 evidence.push({left,name,width:w,height:h,origin:[ox,oy],frames,samples});
}
fs.writeFileSync(new URL('./.work/charged-art.json',import.meta.url),JSON.stringify(evidence,null,2));
console.log('Charged projectile art: mid2x24x16 origin16,7; full4x32x32 origin24,15. Native phase repeat, complete components, rendered-framebuffer pixels, alpha clipping, left/right reflection and Mesen palette checks passed.');
