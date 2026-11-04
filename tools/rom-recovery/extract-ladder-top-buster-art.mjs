// Controlled spatial ladder lip, original-ROM OAM/CHR artwork, rendered with approved Mesen0.9.9 colours.
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
  m[0x378]=124;m[0x48]=0;m[0x49]=0;m[0x4a]=32;
  const emulate=n.cpu.emulate.bind(n.cpu);n.cpu.emulate=()=>{
   if(n.cpu.REG_X===0&&[0xc550,0xc658].includes(n.cpu.REG_PC))n.cpu.REG_ACC=m[0x11]>=128?32:0;
   return emulate();
  };
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

const cases=[];
for(const kind of ['basic','mid','full']){
 const n=boot('ladder'),samples=[];
 for(let t=1;t<=18;t++){
  for(let b=0;b<8;b++)n.buttonUp(1,b);
  if(t===3){if(kind==='basic')n.buttonDown(1,Controller.BUTTON_B);else n.cpu.mem[0x38]=kind==='mid'?40:80;}
  const m=n.cpu.mem,rx=(m[0x330]-m[0xfc]+256)%256,ry=m[0x378],pre=m[0x558];n.frame();
  if([6,15].includes(t)){
   assert.equal(pre,21);assert.equal(m[0x30],3);assert.equal(m[0x378],124);
   samples.push(body(n,rx,ry,0x24));
  }
 }
 for(let c=0;c<6;c++)assert.deepEqual(samples[0][c].data,samples[1][c].data);
 cases.push(samples[0]);
}
for(const samples of cases)for(let c=0;c<6;c++)assert.deepEqual(samples[c].data,cases[0][c].data,'Same native top shooting components for basic/mid/full');
const samples=[cases[0]];
const strip=new PNG({width:240,height:40});
for(let c=0;c<6;c++)for(let y=0;y<40;y++)samples[0][c].data.copy(strip.data,(y*240+c*40)*4,y*40*4,(y+1)*40*4);
fs.writeFileSync(new URL('spr_mm5_megaman_ladder_top_shoot_charge_strip6.png',dir),PNG.sync.write(strip));
console.log('Native top shooting animation21, face24, repeat/alpha/face/bounds checks passed. Six40x40 cells; origin16,16.');
