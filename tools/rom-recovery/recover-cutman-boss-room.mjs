// Original page23 after second gate. PPU validate all three pages, controlled Right traverse.
import fs from'node:fs';import assert from'node:assert/strict';import{NES,Controller as C}from'jsnes';import{PNG}from'pngjs';import{mesenRgbFromJsnes}from'./mesen-palette.mjs';
const root=new URL('../../',import.meta.url),work=new URL('./.work/cutman-second-gate/',import.meta.url),rom=fs.readFileSync(new URL('Mega Man (USA).nes',root)),n=new NES();n.loadROM(rom.toString('binary'));n.fromJSON(JSON.parse(fs.readFileSync(new URL('frame-172.json',work))));const m=n.cpu.mem,get=a=>rom[16+a-0x8000],word=a=>get(a)+256*get(a+1),cells=[],p=new PNG({width:256,height:240});let checked=0;
assert.equal(m[0x27],23);assert.equal(m[0x28],23);
function page(page){const ptr=word(0x8c30+get(0x8c00+page)*2),nt=n.ppu.nameTable[n.ppu.ntable1[page%2]];for(let ty=0;ty<15;ty++)for(let tx=0;tx<16;tx++){
 const block=get(ptr+Math.floor(tx/2)*8+Math.floor(ty/2)),raw=get(0x8000+block*4+tx%2*2+ty%2),pal=get(0x8300+block)>>((tx%2)*2+(ty%2)*4)&3,c={x:(page-23)*256+tx*16,y:ty*16,raw,class:raw>>6,palette:pal,block,page};cells.push(c);
 for(let sy=0;sy<2;sy++)for(let sx=0;sx<2;sx++){let k=(ty*2+sy)*32+tx*2+sx;assert.equal(nt.tile[k],(raw&63)*4+sx*2+sy,`page${page}tile${k}`);assert.equal(nt.attrib[k],pal*4);checked++;}
 for(let y=0;y<16;y++)for(let x=0;x<16;x++){const t=n.ppu.ptTile[n.ppu.f_bgPatternTable*256+(raw&63)*4+Math.floor(x/8)*2+Math.floor(y/8)],v=mesenRgbFromJsnes(n.ppu.imgPalette[pal*4+t.pix[y%8*8+x%8]]);p.data.set([v&255,v>>8&255,v>>16&255,255],((c.y+y)*256+c.x+x)*4);}
}}
page(23);
fs.writeFileSync(new URL('upper-raw.png',work),PNG.sync.write(p));fs.writeFileSync(new URL('upper-cells.json',work),JSON.stringify(cells));console.log({checked});
