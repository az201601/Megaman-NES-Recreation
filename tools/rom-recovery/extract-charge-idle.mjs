// First small charge-colour batch: original idle components, native body palette tables.
// Palette0 changes only; separate face palette4 never recoloured. NOT Mesen capture.
import {NES,Controller} from 'jsnes';import {PNG} from 'pngjs';
import fs from 'node:fs';import assert from 'node:assert/strict';
import {mesenRgbFromJsnes} from './mesen-palette.mjs';
const root=new URL('../../',import.meta.url),rom=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root));
const state=JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json',import.meta.url)));
const palettes=[0,2,3,4,6,7].map(i=>[0x8f47,0x8f4f,0x8f57].map(a=>rom[0x36010+a-0x8000+i]));
assert.deepEqual(palettes,[[15,44,17],[5,44,17],[21,44,17],[37,44,17],[44,17,15],[17,15,44]]);
function boot(){const n=new NES();n.loadROM(rom.toString('binary'));n.fromJSON(structuredClone(state));return n;}
function render(n,slots,body){
 const p=new PNG({width:32,height:32}),labels=new Uint8Array(1024);
 for(const i of slots.slice().reverse()){
  const pal=n.ppu.sprCol[i];assert.ok(pal===0||pal===4);
  const tile=n.ppu.ptTile[n.ppu.sprTile[i]+256*n.ppu.f_spPatternTable];
  for(let y=0;y<8;y++)for(let x=0;x<8;x++){
   const c=tile.pix[(n.ppu.vertFlip[i]?7-y:y)*8+(n.ppu.horiFlip[i]?7-x:x)];if(!c)continue;
   const dx=n.ppu.sprX[i]+x-112,dy=n.ppu.sprY[i]+1+y-164;
   assert.ok(dx>=0&&dx<32&&dy>=0&&dy<32);
   const v=mesenRgbFromJsnes(pal===0&&body?n.ppu.palTable.curTable[body[c-1]]:n.ppu.sprPalette[pal+c]);
   const k=dy*32+dx;p.data.set([v&255,v>>8&255,v>>16&255,255],k*4);labels[k]=pal===4?4:c;
  }
 }
 assert.ok(labels.includes(4),'Separate face component must survive');return {p,labels};
}
const n=boot();n.frame();const slots=Array.from({length:9},(_,i)=>i+1);
assert.equal(slots.filter(i=>n.ppu.sprCol[i]===4).length,1);
const frames=palettes.map(p=>render(n,slots,p));
const accepted=PNG.sync.read(fs.readFileSync(new URL('Assets/Mega Man/MM5/Standing/spr_mm5_megaman_idle.png',root)));
assert.deepEqual(frames[0].p.data,accepted.data,'Base must match accepted standing sprite exactly');
for(const f of frames)for(let k=0;k<1024;k++){
 assert.equal(f.p.data[k*4+3],accepted.data[k*4+3]);
 if(f.labels[k]===4)assert.deepEqual(f.p.data.subarray(k*4,k*4+4),accepted.data.subarray(k*4,k*4+4),'Never recolour face pixels');
}
// Independently compare every coloured pose against actual held-charge OAM palette output.
const natural=boot();for(let b=0;b<8;b++)natural.buttonUp(1,b);for(let i=0;i<30;i++)natural.frame();
const checks=new Map([[36,1],[56,2],[68,3],[84,4],[86,5]]);
for(let t=1;t<=86;t++){
 if(t===1)natural.buttonDown(1,Controller.BUTTON_B);natural.frame();
 if(!checks.has(t))continue;
 const s=Array.from({length:64},(_,i)=>i).filter(i=>natural.ppu.sprY[i]<239&&natural.ppu.sprX[i]>=116&&natural.ppu.sprX[i]<=136&&(natural.ppu.sprCol[i]===0||natural.ppu.sprCol[i]===4&&natural.ppu.sprTile[i]===8));
 assert.equal(s.length,9);const observed=render(natural,s,null).p;
 assert.deepEqual(observed.data,frames[checks.get(t)].p.data,'Variant must equal actual natural charge OAM/palette pose');
}
const strip=new PNG({width:192,height:32});
for(let f=0;f<6;f++)for(let y=0;y<32;y++)frames[f].p.data.copy(strip.data,(y*192+f*32)*4,y*32*4,(y+1)*32*4);
const dir=new URL('Assets/Mega Man/MM5/Buster/Charging/Player Colours/',root);fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(new URL('spr_mm5_megaman_idle_charge_strip6.png',dir),PNG.sync.write(strip));
console.log('Idle charge strip6x32x32 origin16,16; base, face/alpha invariance and5 natural charge palette poses verified.');
