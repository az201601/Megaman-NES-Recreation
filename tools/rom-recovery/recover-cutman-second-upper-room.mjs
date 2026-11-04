// Decode original page5; validate against completed original ladder scroll nametable.
import fs from'node:fs';import assert from'node:assert/strict';import{NES}from'jsnes';import{PNG}from'pngjs';import{mesenRgbFromJsnes}from'./mesen-palette.mjs';
const root=new URL('../../',import.meta.url),work=new URL('./.work/cutman-second-scroll/',import.meta.url),rom=fs.readFileSync(new URL('Mega Man (USA).nes',root));
const n=new NES();n.loadROM(rom.toString('binary'));n.fromJSON(JSON.parse(fs.readFileSync(new URL('after-continuation.json',work))));
const get=a=>rom[16+a-0x8000],word=a=>get(a)+256*get(a+1),page=5,room=get(0x8c00+page),ptr=word(0x8c30+room*2),cells=[],p=new PNG({width:256,height:240});
let checked=0;for(let ty=0;ty<15;ty++)for(let tx=0;tx<16;tx++){
 const block=get(ptr+Math.floor(tx/2)*8+Math.floor(ty/2)),raw=get(0x8000+block*4+(tx%2)*2+ty%2),pal=(get(0x8300+block)>>((tx%2)*2+(ty%2)*4))&3;
 cells.push({x:tx*16,y:ty*16,raw,class:raw>>6,palette:pal,block});
 const nt=n.ppu.nameTable[n.ppu.ntable1[page % 2]];
 for(let sy=0;sy<2;sy++)for(let sx=0;sx<2;sx++){const k=(ty*2+sy)*32+tx*2+sx;assert.equal(nt.tile[k],(raw&63)*4+sx*2+sy);assert.equal(nt.attrib[k],pal*4);checked++;}
 for(let y=0;y<16;y++)for(let x=0;x<16;x++){const tile=n.ppu.ptTile[n.ppu.f_bgPatternTable*256+(raw&63)*4+Math.floor(x/8)*2+Math.floor(y/8)],v=mesenRgbFromJsnes(n.ppu.imgPalette[pal*4+tile.pix[(y%8)*8+x%8]]);p.data.set([v&255,v>>8&255,v>>16&255,255],((ty*16+y)*256+tx*16+x)*4);}
}
fs.writeFileSync(new URL('upper-raw.png',work),PNG.sync.write(p));fs.writeFileSync(new URL('upper-cells.json',work),JSON.stringify(cells));console.log({room,checked,ladder:cells.filter(c=>c.class===2)});
