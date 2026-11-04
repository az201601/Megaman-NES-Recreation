// Original MM5 menu CHR inspection/recovery; no generated typeface.
import{NES}from'jsnes';import{PNG}from'pngjs';import fs from'node:fs';import assert from'node:assert/strict';
import{mesenRgbFromJsnes}from'./mesen-palette.mjs';
const root=new URL('../../',import.meta.url),work=new URL('./.work/',import.meta.url);
const n=new NES();n.loadROM(fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary'));n.fromJSON(structuredClone(JSON.parse(fs.readFileSync(new URL('mm5-pause-reference.json',work)))));n.frame();
const p=n.ppu,nt=p.nameTable[p.ntable1[p.regV*2+p.regH]],atlas=new PNG({width:128,height:128});
for(let t=0;t<256;t++)for(let y=0;y<8;y++)for(let x=0;x<8;x++){
 const c=p.ptTile[t+256*p.f_bgPatternTable].pix[y*8+x];const v=c?255:0;
 atlas.data.set([v,v,v,255],((Math.floor(t/16)*8+y)*128+(t%16)*8+x)*4);
}
fs.writeFileSync(new URL('mm5-menu-chr-atlas.png',work),PNG.sync.write(atlas));
console.log('M.BUSTER tiles',Array.from(nt.tile.slice(4*32+7,4*32+15)));console.log('font palette indices',Array.from(n.ppu.imgPalette));

// This font is a menu-specific subset, not a contiguous ASCII alphabet.
const order='ABCDEGHIJKLMNORSTUWYVP';assert.equal(order.length,22);
const mapping=Object.fromEntries([...order].map((c,i)=>[c,224+i]));
for(let i=0;i<10;i++)mapping[String(i)]=176+i;
mapping[' ']=0;mapping['.']=94;
assert.deepEqual([...'M.BUSTER'].map(c=>mapping[c]),Array.from(nt.tile.slice(4*32+7,4*32+15)));
assert.deepEqual([...'R.COIL'].map(c=>mapping[c]),Array.from(nt.tile.slice(12*32+21,12*32+27)));
const chars='ABCDEGHIJKLMNOPRSTUVWY0123456789 .';
assert.equal(new Set(chars).size,34);assert.equal(chars.length,34);
const font=new PNG({width:8*chars.length,height:8});
for(const [f,c]of[...chars].entries()){
 const tile=p.ptTile[mapping[c]+256*p.f_bgPatternTable];assert.ok(c===' '||tile.pix.some(v=>v));
 for(let y=0;y<8;y++)for(let x=0;x<8;x++){
  const index=tile.pix[y*8+x];assert.ok(index===0||index===1);
  if(!index)continue;
  const v=mesenRgbFromJsnes(p.imgPalette[index]);font.data.set([v&255,v>>8&255,v>>16&255,255],(y*font.width+f*8+x)*4);
 }
}
const dir=new URL('Assets/Mega Man/MM5/Pause Menu/Reference/',root);fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(new URL('mm5-menu-font-original-subset.png',dir),PNG.sync.write(font));
fs.writeFileSync(new URL('mm5-menu-font-original-subset.json',dir),JSON.stringify({chars,mapping,cell:[8,8],missing:'FQXZ',status:'Reference only. No invented glyphs. Not GMS import-ready complete alphabet.'},null,2));
console.log('PASS:34 original glyph/space frames, exact M.BUSTER/R.COIL tile mappings. Compact menu subset lacks F/Q/X/Z; no replacement invented.');
