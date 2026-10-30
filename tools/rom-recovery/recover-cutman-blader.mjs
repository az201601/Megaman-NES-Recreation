// Supplied MM1 ROM only. External disassembly labels are checked against original bytes.
import {NES,Controller as C} from 'jsnes';
import {PNG} from 'pngjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mesenRgbFromJsnes} from './mesen-palette.mjs';
const root=new URL('../../',import.meta.url),work=new URL('./.work/',import.meta.url);
const rom=fs.readFileSync(new URL('Mega Man (USA).nes',root));
const snap=JSON.parse(fs.readFileSync(new URL('mm1-stage.json',work)));
const out=new URL('../../Assets/Enemies/MM1/Blader/Reference/',import.meta.url);fs.mkdirSync(out,{recursive:true});
const poses=new Map(),branches={};
// AI + flip helper $AAD1..AB78, division helper$C5AC..C5D4, search$F63B..F662.
const disasm=[['mm1-bank5.s',0x16ad1,0x16b78],['mm1-bank7.s',0x1c5ac,0x1c5d4],['mm1-bank7.s',0x1f63b,0x1f662]];
let byteCount=0;
for(const [file,lo,hi] of disasm){
 const text=fs.readFileSync(new URL(file,work),'utf8');
 for(const m of text.matchAll(/\/\* ([0-9A-F]{5}): ([0-9A-F ]+) \*\//g)){
  const addr=parseInt(m[1],16);if(addr<lo||addr>hi)continue;
  const bytes=m[2].trim().split(/\s+/).map(v=>parseInt(v,16));
  assert.deepEqual([...rom.subarray(addr+16,addr+16+bytes.length)],bytes,`USA byte mismatch${addr.toString(16)}`);byteCount+=bytes.length;
 }
}
assert.equal(byteCount,168+41+40); // Entire routine/flip helper + divider + search.
function fields(n){const m=n.cpu.mem,i=16;return {active:m[0x400+i]!==0&&m[0x600+i]!==248,type:m[0x6e0+i],x:m[0x480+i]+256*m[0x460+i]+m[0x4a0+i]/256,y:m[0x600+i]+m[0x620+i]/256,px:m[0x480]+256*m[0x460],py:m[0x600],timer:m[0x640+i],vx:m[0x4c0+i]+m[0x4e0+i]/256,vyRaw:m[0x680+i]*256+m[0x660+i],flags:m[0x420+i]};}
for(const mode of ['idle','right','right-jump','approach-stop']){
 let pixels;const n=new NES({onFrame:p=>pixels=p.slice(),emulateSound:false});n.loadROM(rom.toString('binary'));n.fromJSON(structuredClone(snap));for(let b=0;b<8;b++)n.buttonUp(1,b);
 let entry=null;const emulate=n.cpu.emulate.bind(n.cpu);n.cpu.emulate=()=>{if(n.cpu.REG_PC===0xaad0&&n.cpu.REG_X===16)entry=fields(n);return emulate();};
 const rows=[];if(mode!=='idle')n.buttonDown(1,C.BUTTON_RIGHT);
 for(let t=1;t<=360;t++){
  if(mode==='right-jump'){if(t%70===1)n.buttonDown(1,C.BUTTON_A);if(t%70===25)n.buttonUp(1,C.BUTTON_A);}
  if(mode==='approach-stop'&&t===30)n.buttonUp(1,C.BUTTON_RIGHT);
  const before=fields(n);entry=null;n.frame();const after=fields(n);
  const cells=[];for(let i=0;i<64;i++){const[y,tile,attr,x]=n.ppu.spriteMem.slice(i*4,i*4+4);if(y<240&&tile>=0x8a&&tile<=0x8f)cells.push({slot:i,x,y,tile,attr});}
  let pose=null;
  // Retain canonical left-facing art only; right-facing is the mirrored counterpart.
  if(cells.length===6 && !(cells[2].attr&64)){
   const ox=Math.min(...cells.map(c=>c.x)),oy=Math.min(...cells.map(c=>c.y))+1;
   if(Math.max(...cells.map(c=>c.x))-ox===8&&Math.max(...cells.map(c=>c.y))+1-oy===16){
    const p=new PNG({width:16,height:24});
    for(const c of [...cells].reverse())for(let y=0;y<8;y++)for(let x=0;x<8;x++){
     const v=n.ppu.ptTile[c.tile+256*n.ppu.f_spPatternTable].pix[(c.attr&128?7-y:y)*8+(c.attr&64?7-x:x)];if(!v)continue;
     const rgb=mesenRgbFromJsnes(n.ppu.sprPalette[(c.attr&3)*4+v]);
     p.data.set([rgb&255,rgb>>8&255,rgb>>16&255,255],((c.y+1+y-oy)*16+c.x+x-ox)*4);
    }
    const hash=createHash('sha256').update(p.data).digest('hex');
    if(!poses.has(hash))poses.set(hash,{frame:p,cells,mode,update:t});pose=[...poses.keys()].indexOf(hash);
    // Fully visible sprites, no clipping; confirm extracted opaque pixels really match render.
    if(ox>=8&&ox<=232&&oy>=8&&oy<=208&&t<100){
     let mismatch=0;for(let y=0;y<24;y++)for(let x=0;x<16;x++){const k=(y*16+x)*4;if(!p.data[k+3])continue;const rgb=mesenRgbFromJsnes(pixels[(oy+y)*256+ox+x]);if(p.data[k]!=(rgb&255)||p.data[k+1]!=(rgb>>8&255)||p.data[k+2]!=(rgb>>16&255))mismatch++;}
     // OAM can be queued ahead of current rendered frame; don't pretend all frames align.
     if(mismatch===0)poses.get(hash).matchedRender=true;
    }
   }
  }
  rows.push({update:t,before,entry,after,pose});
 }
 branches[mode]=rows;
}
assert.equal(poses.size,2,'Expected two observed rotor frames');for(const p of poses.values())assert.ok(p.matchedRender,'Need actual rendered-pixel match per pose');
const strip=new PNG({width:32,height:24});let i=0;for(const p of poses.values()){
 for(let y=0;y<24;y++)p.frame.data.copy(strip.data,(y*32+i*16)*4,y*16*4,(y+1)*16*4);
 fs.writeFileSync(new URL(`blader-pose-${i}.png`,out),PNG.sync.write(p.frame));i++;
}
fs.writeFileSync(new URL('spr_mm1_blader_reference_strip2.png',out),PNG.sync.write(strip));
fs.writeFileSync(new URL('../spr_mm1_blader_strip2.png',out),PNG.sync.write(strip));
const preview=new PNG({width:256,height:192});
for(let y=0;y<192;y++)for(let x=0;x<256;x++){const k=(Math.floor(y/8)*32+Math.floor(x/8))*4,bg=((Math.floor(x/32)+Math.floor(y/32))%2)?72:96;preview.data.set(strip.data[k+3]?[...strip.data.subarray(k,k+3),255]:[bg,bg,bg,255],(y*256+x)*4);}
fs.writeFileSync(new URL('../blader_sprite_preview.png',out),PNG.sync.write(preview));
fs.writeFileSync(new URL('native-blader-trace.json',out),JSON.stringify({source:'Supplied MM1 USA, natural inputs only; JSNES2.1.0 with pinned Mesen0.9.9 RGB, NOT Mesen executable.',disassembly:'TheRealQuantam/mm1base commit9c1cb05bd1d63c176e1930053dda76bcb85cd977 bank5.s/bank7.s (RockmanJ-based modified project); all249 relevant AI/helper bytes MATCH supplied USA original. Never run modified disassembly.',romSha256:createHash('sha256').update(rom).digest('hex'),verifiedBytes:byteCount,poses:[...poses.values()].map(({frame,...p})=>p),branches},null,2));
console.log(`PASS${byteCount}USA original routine bytes;2 transparent16x24poses; each matches native rendered pixels;4 natural360-update traces`);
