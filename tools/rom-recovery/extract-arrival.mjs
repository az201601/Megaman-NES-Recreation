// Natural Napalm Man arrival OAM/CHR, approved Mesen0.9.9 palette via JSNES.
import {NES} from 'jsnes';import {PNG} from 'pngjs';import fs from 'node:fs';import assert from 'node:assert/strict';
import {mesenRgbFromJsnes} from './mesen-palette.mjs';
const root=new URL('../../',import.meta.url),work=new URL('./.work/',import.meta.url);
const rom=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary');
const snapshots=JSON.parse(fs.readFileSync(new URL('mm5-arrival-snapshots.json',work)));
const strip=new PNG({width:160,height:48}),inventory=[];
for(const [f,t] of [670,682,685,688,690].entries()){
 const n=new NES();n.loadROM(rom);n.fromJSON(snapshots.find(s=>s.t===t-1).snapshot);
 const m=n.cpu.mem,rx=m[0x330]-m[0xfc],ry=m[0x378];
 assert.equal(m[0x558],19);assert.equal(m[0x540],f);n.frame();
 const slots=Array.from({length:64},(_,i)=>i).filter(i=>n.ppu.sprY[i]<239&&n.ppu.sprY[i]>40&&Math.abs(n.ppu.sprY[i]+1-ry)<32&&n.ppu.sprX[i]>=rx-20&&n.ppu.sprX[i]<=rx+20);
 inventory.push({phase:f,t,rx,ry,components:slots.map(i=>({tile:n.ppu.sprTile[i],palette:n.ppu.sprCol[i],x:n.ppu.sprX[i],y:n.ppu.sprY[i]+1}))});
 assert.deepEqual(slots.map(i=>n.ppu.sprTile[i]),[[52,52,52,52],[54,53,54,54,53,54,57,55,57],[52,52,52,52],[54,53,54,57,55,57],[54,53,54,57,55,57]][f]);
 assert.ok(slots.every(i=>n.ppu.sprCol[i]===0),'Arrival effects have no separate face component; idle afterward does');
 for(const i of slots.slice().reverse()){
  const pal=n.ppu.sprCol[i];assert.ok(pal===0||pal===4);
  const tile=n.ppu.ptTile[n.ppu.sprTile[i]+256*n.ppu.f_spPatternTable];
  for(let y=0;y<8;y++)for(let x=0;x<8;x++){
   const c=tile.pix[(n.ppu.vertFlip[i]?7-y:y)*8+(n.ppu.horiFlip[i]?7-x:x)];if(!c)continue;
   const dx=n.ppu.sprX[i]+x-rx+16,dy=n.ppu.sprY[i]+1+y-ry+24;
   assert.ok(dx>=0&&dx<32&&dy>=0&&dy<48,`Arrival opaque pixel clipped phase${f} tile${n.ppu.sprTile[i]} at${dx},${dy}`);
   const v=mesenRgbFromJsnes(n.ppu.sprPalette[pal+c]);strip.data.set([v&255,v>>8&255,v>>16&255,255],(dy*160+f*32+dx)*4);
  }
 }
}
for(let y=0;y<48;y++){
 assert.deepEqual(strip.data.subarray((y*160)*4,(y*160+32)*4),strip.data.subarray((y*160+64)*4,(y*160+96)*4),'Beam phases0/2 equal');
 assert.deepEqual(strip.data.subarray((y*160+96)*4,(y*160+128)*4),strip.data.subarray((y*160+128)*4,(y*160+160)*4),'Last phase repeats observed partial materialization before idle');
}
const dir=new URL('Assets/Mega Man/MM5/Arrival/',root);fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(new URL('spr_mm5_megaman_arrival_strip5.png',dir),PNG.sync.write(strip));
fs.writeFileSync(new URL('mm5-arrival-components.json',work),JSON.stringify(inventory,null,2));
console.log(inventory);
