// Live original-ROM OAM/CHR artwork, rendered with approved Mesen0.9.9 colours.
// JSNES extraction, NOT a direct Mesen runtime capture. No generated artwork.
import {NES,Controller} from 'jsnes';
import {PNG} from 'pngjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {mesenRgbFromJsnes} from './mesen-palette.mjs';
const root=new URL('../../',import.meta.url);
const rom=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary');
const bytes=Buffer.from(rom,'binary');
const palettes=[0,2,3,4,6,7].map(i=>[0x8f47,0x8f4f,0x8f57].map(a=>bytes[0x36010+a-0x8000+i]));
assert.deepEqual(palettes,[[15,44,17],[5,44,17],[21,44,17],[37,44,17],[44,17,15],[17,15,44]]);
const snapshot=JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json',import.meta.url)));
const dir=new URL('Assets/Mega Man/MM5/Buster/Charging/Player Colours/',root);fs.mkdirSync(dir,{recursive:true});
function boot(mode){
 const n=new NES();n.loadROM(rom);n.fromJSON(structuredClone(snapshot));
 for(let b=0;b<8;b++)n.buttonUp(1,b);for(let i=0;i<30;i++)n.frame();
 if(mode==='ladder'){
  const m=n.cpu.mem;m[0x30]=3;m[0x330]=136;m[0x318]=0;m[0x378]=140;m[0x360]=0;m[0x3d8]=0x4c;m[0x3f0]=1;
  const write=n.cpu.write.bind(n.cpu);n.cpu.write=(a,v)=>{if(a>=0x48&&a<=0x4a&&n.cpu.REG_X===0&&n.cpu.REG_PC>=0xc4a1&&n.cpu.REG_PC<0xc6db)v=0x20;return write(a,v);};
 }
 return n;
}
function paint(n,slots,w,h,rx,ry,ox,oy,colours){
 assert.equal(n.ppu.f_spriteSize,0);
 const p=new PNG({width:w,height:h});let count=0;p.labels=new Uint8Array(w*h);
 for(const i of slots.slice().reverse()){
  const tile=n.ppu.ptTile[n.ppu.sprTile[i]+256*n.ppu.f_spPatternTable];
  for(let y=0;y<8;y++)for(let x=0;x<8;x++){
   const c=tile.pix[(n.ppu.vertFlip[i]?7-y:y)*8+(n.ppu.horiFlip[i]?7-x:x)];if(!c)continue;
   const dx=n.ppu.sprX[i]+x-rx+ox,dy=n.ppu.sprY[i]+1+y-ry+oy;
   assert.ok(dx>=0&&dx<w&&dy>=0&&dy<h,'Clipped opaque shooting pixel');
   const pal=n.ppu.sprCol[i];
   const v=mesenRgbFromJsnes(pal===0?n.ppu.palTable.curTable[colours[c-1]]:n.ppu.sprPalette[pal+c]);
   p.labels[dy*w+dx]=pal===4?4:c;
   p.data.set([v&255,v>>8&255,v>>16&255,255],(dy*w+dx)*4);count++;
  }
 }
 assert.ok(count>0);return p;
}
function body(n,rx,ry,expectedFace){
 const slots=Array.from({length:64},(_,i)=>i).filter(i=>n.ppu.sprY[i]<239&&n.ppu.sprX[i]>=rx-20&&n.ppu.sprX[i]<=rx+20
  &&(n.ppu.sprCol[i]===0||(n.ppu.sprCol[i]===4&&[0x08,0x24,0x2f,0x38].includes(n.ppu.sprTile[i]))));
 assert.ok(slots.length>=7&&slots.length<=12);
 // Face tile varies with pose/stride; tile08 alone silently drops air/stride faces.
 const faces=slots.filter(i=>n.ppu.sprCol[i]===4);
 assert.equal(faces.length,1,'Every shooting pose must retain its original face component');
 assert.equal(n.ppu.sprTile[faces[0]],expectedFace,'Wrong face component for shooting pose');
 const frames=palettes.map(colours=>paint(n,slots,40,40,rx,ry,16,16,colours));
 for(const p of frames)for(let k=0;k<1600;k++){
  assert.equal(p.data[k*4+3],frames[0].data[k*4+3]);
  if(p.labels[k]===4)assert.deepEqual(p.data.subarray(k*4,k*4+4),frames[0].data.subarray(k*4,k*4+4),'Face must remain intact and unchanged');
 }
 return frames;
}
for(const mode of ['idle','air','ladder','walk']){
 const n=boot(mode),poses=[],walkPoses=new Map();
 for(let t=1;t<=40;t++){
  for(let b=0;b<8;b++)n.buttonUp(1,b);
  if(mode==='air')n.buttonDown(1,Controller.BUTTON_A);
  if(mode==='walk')n.buttonDown(1,Controller.BUTTON_RIGHT);
  const fire=mode==='walk'?[7,15,23,31].includes(t):t===(mode==='ladder'?3:1);
  if(fire)n.buttonDown(1,Controller.BUTTON_B);
  const m=n.cpu.mem,rx=(m[0x330]-m[0xfc]+256)%256,ry=m[0x378],preAnim=m[0x558],prePhase=m[0x540];
  n.frame();
  if(mode==='walk'){
   if(preAnim===5&&!walkPoses.has(prePhase))walkPoses.set(prePhase,body(n,rx,ry,prePhase===2?0x38:0x08));
  }else if((mode==='ladder'?[6,15]:[4,13]).includes(t)){
   assert.equal(preAnim,{idle:2,air:8,ladder:0x0b}[mode],mode+' must be in the native shooting animation');
   poses.push(body(n,rx,ry,{idle:0x08,air:0x2f,ladder:0x24}[mode]));
  }
 }

 const name=(mode==='ladder'?'climb':mode)+'_shoot',count=mode==='walk'?4:1;
 let list;
 if(mode==='walk'){
  assert.deepEqual([...walkPoses.keys()].sort(),[0,1,2,3]);list=[0,1,2,3].map(i=>walkPoses.get(i));
  for(let c=0;c<6;c++){assert.deepEqual(list[1][c].data,list[3][c].data);assert.notDeepEqual(list[0][c].data,list[2][c].data);}
 }else{
  assert.equal(poses.length,2);for(let c=0;c<6;c++)assert.deepEqual(poses[0][c].data,poses[1][c].data);list=[poses[0]];
 }
 const accepted=PNG.sync.read(fs.readFileSync(new URL('Assets/Mega Man/MM5/Buster/spr_mm5_megaman_'+name+(count===4?'_strip4':'')+'.png',root)));
 const strip=new PNG({width:40*count*6,height:40});
 for(let c=0;c<6;c++)for(let f=0;f<count;f++)for(let y=0;y<40;y++){
  const p=list[f][c];
  if(c===0)assert.deepEqual(p.data.subarray(y*40*4,(y+1)*40*4),accepted.data.subarray((y*40*count+f*40)*4,(y*40*count+(f+1)*40)*4),'Base must equal corrected accepted shooting sprites');
  p.data.copy(strip.data,(y*strip.width+(c*count+f)*40)*4,y*40*4,(y+1)*40*4);
 }
 fs.writeFileSync(new URL('spr_mm5_megaman_'+name+'_charge_strip'+count*6+'.png',dir),PNG.sync.write(strip));
}
console.log('Shooting charge idle6/walk24/air6/climb6 cells40x40, origin16,16. Native pose/face tiles, base equality, face/alpha invariance, strides/repeat poses and bounds passed.');
