// Charge movement colours: palette-state banks, NOT a sequential24-frame walk animation.
import {mesenRgbFromJsnes} from './mesen-palette.mjs';
// Extract normal MM5 walk loop and airborne artwork from live OAM/pattern data.
// Requires mm5-stage.json. No image generation or scenery pixels are used.
import {NES,Controller} from 'jsnes';
import {PNG} from 'pngjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url);
const bytes=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root));
const rom=bytes.toString('binary');
const palettes=[0,2,3,4,6,7].map(i=>[0x8f47,0x8f4f,0x8f57].map(a=>bytes[0x36010+a-0x8000+i]));
assert.deepEqual(palettes,[[15,44,17],[5,44,17],[21,44,17],[37,44,17],[44,17,15],[17,15,44]]);
const state=JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json',import.meta.url)));
function boot(){const n=new NES();n.loadROM(rom);n.fromJSON(structuredClone(state));for(let b=0;b<8;b++)n.buttonUp(1,b);for(let i=0;i<30;i++)n.frame();return n;}
function render(n,referenceY,height,body){
 assert.equal(n.ppu.f_spriteSize,0);
 // The short, early test keeps player components in this screen window.
 // HUD is at X24; enemies have not reached this cluster.
 const slots=Array.from({length:64},(_,i)=>i).filter(i=>n.ppu.sprY[i]<239&&n.ppu.sprX[i]>90&&n.ppu.sprX[i]<175);
 const face=slots.filter(i=>n.ppu.sprCol[i]===4);
 assert.equal(face.length,1,'Expected one separate face sprite');
 const referenceX=n.ppu.sprX[face[0]]+3;
 const p=new PNG({width:32,height});
 let pixels=0; p.labels=new Uint8Array(32*height);
 for(const i of slots.slice().reverse()){
  assert.ok(n.ppu.sprCol[i]===0||n.ppu.sprCol[i]===4);
  const tile=n.ppu.ptTile[n.ppu.sprTile[i]+256*n.ppu.f_spPatternTable];
  for(let y=0;y<8;y++)for(let x=0;x<8;x++){
   const c=tile.pix[(n.ppu.vertFlip[i]?7-y:y)*8+(n.ppu.horiFlip[i]?7-x:x)];
   if(!c)continue;
   const dx=n.ppu.sprX[i]+x-referenceX+16;
   const dy=n.ppu.sprY[i]+1+y-referenceY+16;
   assert.ok(dx>=0&&dx<32&&dy>=0&&dy<height,'Opaque sprite pixel would be clipped');
   const pal=n.ppu.sprCol[i];
   const v=mesenRgbFromJsnes(pal===0?n.ppu.palTable.curTable[body[c-1]]:n.ppu.sprPalette[pal+c]);
   p.labels[dy*32+dx]=pal===4?4:c;
   p.data.set([v&255,(v>>8)&255,(v>>16)&255,255],(dy*32+dx)*4);pixels++;
  }
 }
 assert.ok(pixels>150);
 return p;
}

function capture(n,ry,height){
 const variants=palettes.map(p=>render(n,ry,height,p));
 for(const p of variants)for(let k=0;k<32*height;k++){
  assert.equal(p.data[k*4+3],variants[0].data[k*4+3]);
  if(p.labels[k]===4)assert.deepEqual(p.data.subarray(k*4,k*4+4),variants[0].data.subarray(k*4,k*4+4),'Face pixels must never flash');
 }
 return variants;
}
const walk=boot(),poses=[];walk.buttonDown(1,Controller.BUTTON_RIGHT);
for(let t=1;t<=31;t++){const y=walk.cpu.mem[0x378];walk.frame();if([10,17,24,31].includes(t))poses.push(capture(walk,y,32));}
const air=boot();air.buttonDown(1,Controller.BUTTON_A);let airborne;
for(let t=1;t<=25;t++){const y=air.cpu.mem[0x378];air.frame();if(t===5)airborne=capture(air,y,40);if(t===25){const falling=capture(air,y,40);for(let c=0;c<6;c++)assert.deepEqual(falling[c].data,airborne[c].data);}}
const dir=new URL('Assets/Mega Man/MM5/Buster/Charging/Player Colours/',root);fs.mkdirSync(dir,{recursive:true});
for(const [name,list,height,acceptedPath] of [
 ['walk',poses,32,'Assets/Mega Man/MM5/Movement/spr_mm5_megaman_walk_strip4.png'],
 ['air',[airborne],40,'Assets/Mega Man/MM5/Movement/spr_mm5_megaman_air.png']]){
 const count=list.length,strip=new PNG({width:32*count*6,height});
 const accepted=PNG.sync.read(fs.readFileSync(new URL(acceptedPath,root)));
 for(let c=0;c<6;c++)for(let f=0;f<count;f++){
  const p=list[f][c];
  for(let y=0;y<height;y++){
   if(c===0)assert.deepEqual(p.data.subarray(y*32*4,(y+1)*32*4),accepted.data.subarray((y*32*count+f*32)*4,(y*32*count+(f+1)*32)*4),'Base frames must equal installed movement art');
   p.data.copy(strip.data,(y*strip.width+(c*count+f)*32)*4,y*32*4,(y+1)*32*4);
  }
 }
 if(name==='walk')for(let c=0;c<6;c++){assert.deepEqual(list[1][c].data,list[3][c].data);assert.notDeepEqual(list[0][c].data,list[2][c].data);}
 fs.writeFileSync(new URL('spr_mm5_megaman_'+name+'_charge_strip'+count*6+'.png',dir),PNG.sync.write(strip));
}
console.log('Walk charge24x32x32, air charge6x32x40, origins16,16: base equivalence, six native palette banks, face/alpha invariance, strides and ascent/descent checks passed.');
