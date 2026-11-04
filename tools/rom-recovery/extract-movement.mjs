// Artwork colours: approved Mesen0.9.9 default palette; emulation remains JSNES.
import {mesenRgbFromJsnes} from './mesen-palette.mjs';
// Extract normal MM5 walk loop and airborne artwork from live OAM/pattern data.
// Requires mm5-stage.json. No image generation or scenery pixels are used.
import {NES,Controller} from 'jsnes';
import {PNG} from 'pngjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url);
const rom=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary');
const state=JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json',import.meta.url)));
function boot(){const n=new NES();n.loadROM(rom);n.fromJSON(structuredClone(state));for(let b=0;b<8;b++)n.buttonUp(1,b);for(let i=0;i<30;i++)n.frame();return n;}
function render(n,referenceY,height){
 assert.equal(n.ppu.f_spriteSize,0);
 // The short, early test keeps player components in this screen window.
 // HUD is at X24; enemies have not reached this cluster.
 const slots=Array.from({length:64},(_,i)=>i).filter(i=>n.ppu.sprY[i]<239&&n.ppu.sprX[i]>90&&n.ppu.sprX[i]<175);
 const face=slots.filter(i=>n.ppu.sprCol[i]===4);
 assert.equal(face.length,1,'Expected one separate face sprite');
 const referenceX=n.ppu.sprX[face[0]]+3;
 const p=new PNG({width:32,height});
 let pixels=0;
 for(const i of slots.slice().reverse()){
  assert.ok(n.ppu.sprCol[i]===0||n.ppu.sprCol[i]===4);
  const tile=n.ppu.ptTile[n.ppu.sprTile[i]+256*n.ppu.f_spPatternTable];
  for(let y=0;y<8;y++)for(let x=0;x<8;x++){
   const c=tile.pix[(n.ppu.vertFlip[i]?7-y:y)*8+(n.ppu.horiFlip[i]?7-x:x)];
   if(!c)continue;
   const dx=n.ppu.sprX[i]+x-referenceX+16;
   const dy=n.ppu.sprY[i]+1+y-referenceY+16;
   assert.ok(dx>=0&&dx<32&&dy>=0&&dy<height,'Opaque sprite pixel would be clipped');
   const v=mesenRgbFromJsnes(n.ppu.sprPalette[n.ppu.sprCol[i]+c]);
   p.data.set([v&255,(v>>8)&255,(v>>16)&255,255],(dy*32+dx)*4);pixels++;
  }
 }
 assert.ok(pixels>150);
 return p;
}
const walk=boot(),poses=[];
walk.buttonDown(1,Controller.BUTTON_RIGHT);
for(let t=1;t<=31;t++){
 const previousY=walk.cpu.mem[0x378];walk.frame();
 if([10,17,24,31].includes(t))poses.push(render(walk,previousY,32));
}
assert.equal(poses.length,4);
assert.deepEqual(poses[1].data,poses[3].data,'Middle walk pose should repeat');
assert.notDeepEqual(poses[0].data,poses[2].data,'Two stride poses must differ');
const strip=new PNG({width:128,height:32});
poses.forEach((p,i)=>{for(let y=0;y<32;y++)p.data.copy(strip.data,(y*128+i*32)*4,y*32*4,(y+1)*32*4);});
const air=boot();air.buttonDown(1,Controller.BUTTON_A);
let rising,falling;
for(let t=1;t<=30;t++){
 const previousY=air.cpu.mem[0x378];air.frame();
 if(t===5)rising=render(air,previousY,40);
 if(t===25)falling=render(air,previousY,40);
}
assert.deepEqual(rising.data,falling.data,'Tested non-shooting ascent/descent pose must match');
const dir=new URL('Assets/Mega Man/MM5/Movement/',root);fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(new URL('spr_mm5_megaman_walk_strip4.png',dir),PNG.sync.write(strip));
fs.writeFileSync(new URL('spr_mm5_megaman_air.png',dir),PNG.sync.write(rising));
console.log('Extracted walk strip 128x32 / four 32x32 cells; air 32x40. Both use origin 16,16. No opaque pixels clipped.');
