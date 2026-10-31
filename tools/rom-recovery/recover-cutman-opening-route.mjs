// Original stage data decoder, validated against prior approved screen and natural PPU uploads.
import fs from'node:fs';import assert from'node:assert/strict';import{PNG}from'pngjs';import{NES}from'jsnes';import{mesenRgbFromJsnes}from'./mesen-palette.mjs';
const root=new URL('../../',import.meta.url),work=new URL('./.work/',import.meta.url),out=new URL('./.work/cutman-route/',import.meta.url);fs.mkdirSync(out,{recursive:true});
const rom=fs.readFileSync(new URL('Mega Man (USA).nes',root));
const n=new NES();n.loadROM(rom.toString('binary'));n.fromJSON(JSON.parse(fs.readFileSync(new URL('mm1-stage.json',work))));assert.equal(n.cpu.mem[0x31],0);assert.equal(n.cpu.mem[0x27],0);assert.equal(n.cpu.mem[0x28],3);
const get=a=>rom[16+a-0x8000],word=a=>get(a)+256*get(a+1);
const width=1024,full=new PNG({width,height:240}),cells=[];
for(let page=0;page<4;page++){
 const room=get(0x8c00+page),ptr=word(0x8c30+room*2);
 for(let ty=0;ty<15;ty++)for(let tx=0;tx<16;tx++){
  const block=get(ptr+Math.floor(tx/2)*8+Math.floor(ty/2));
  const raw=get(0x8000+block*4+(tx%2)*2+(ty%2));
  const pal=(get(0x8300+block)>>((tx%2)*2+(ty%2)*4))&3;
  const cell={x:page*256+tx*16,y:ty*16,room,block,raw,class:raw>>6,palette:pal};cells.push(cell);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){
   const tile=n.ppu.ptTile[n.ppu.f_bgPatternTable*256+(raw&63)*4+Math.floor(x/8)*2+Math.floor(y/8)];
   const c=tile.pix[(y%8)*8+x%8],v=mesenRgbFromJsnes(n.ppu.imgPalette[pal*4+c]);full.data.set([v&255,v>>8&255,v>>16&255,255],((cell.y+y)*width+cell.x+x)*4);
  }
 }
}
fs.writeFileSync(new URL('opening-raw.png',out),PNG.sync.write(full));fs.writeFileSync(new URL('cells.json',out),JSON.stringify(cells));
const expected=PNG.sync.read(fs.readFileSync(new URL('Assets/Cut Man/Stage/Screen 01/cutman_screen01_layout_reference.png',root)));
let wrong=0;for(let y=0;y<240;y++)for(let x=0;x<256;x++)for(let c=0;c<4;c++)if(expected.data[(y*256+x)*4+c]!==full.data[(y*width+x)*4+c])wrong++;
console.log({wrong,pattern:n.ppu.f_bgPatternTable,objects:cells.filter(c=>c.class===3),classes:[0,1,2,3].map(cl=>cells.filter(c=>c.class===cl).length)});
let tileChecks=0,palChecks=0;
for(const cell of cells.filter(c=>c.x<512))for(let sy=0;sy<2;sy++)for(let sx=0;sx<2;sx++){
 const page=Math.floor(cell.x/256),nt=n.ppu.nameTable[n.ppu.ntable1[page]],k=(cell.y/8+sy)*32+(cell.x%256)/8+sx;
 assert.equal(nt.tile[k],(cell.raw&63)*4+sx*2+sy,`tile${cell.x},${cell.y}`);tileChecks++;
 assert.equal(nt.attrib[k],cell.palette*4);palChecks++;
}
assert.equal(wrong,768); // Only256black top-scanline pixels in earlier framebuffer reference.
console.log('PASS original PPU boot upload',tileChecks,'tile IDs',palChecks,'palette attributes');
