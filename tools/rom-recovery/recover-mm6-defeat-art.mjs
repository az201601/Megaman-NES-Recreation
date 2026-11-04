// Controlled single-particle art fixtures from real native boss defeat. No ROM/CHR/palette edits.
import fs from'node:fs';import assert from'node:assert/strict';import{NES}from'jsnes';import{PNG}from'pngjs';import{createHash}from'node:crypto';import{mesenRgbFromJsnes}from'./mesen-palette.mjs';
const root=new URL('../../',import.meta.url),base=new URL('Assets/Bosses/MM1/Cut Man/Victory/',root),hash=b=>createHash('sha256').update(b).digest('hex');
const rom=fs.readFileSync(new URL('Mega Man 6 (USA).nes',root));let pixels;
const n=new NES({emulateSound:false,onFrame:p=>pixels=p.slice()});n.loadROM(rom.toString('binary'));n.fromJSON(JSON.parse(fs.readFileSync(new URL('.work/mm6-victory/whole-victory-498.json',import.meta.url))));for(let f=0;f<4;f++)n.frame();
const m=n.cpu.mem,slot=14;assert.equal(m[0x3a0+slot],8);const frames=new Map(),fixtures=[];
for(let f=0;f<40;f++){
 // Art-only fixture: keep one original particle, reposition before each update.
 for(let i=0;i<23;i++)if(i!==slot)m[0x3a0+i]=0;
 m[0x486+slot]=128;m[0x4cb+slot]=120;m[0x46f+slot]=m[0x57];m[0x4b4+slot]=0;n.frame();
 const cells=[];for(let i=0;i<64;i++){const[y,tile,attr,x]=n.ppu.spriteMem.slice(i*4,i*4+4);if(x>=104&&x<152&&y>=88&&y<144)cells.push({x,y:y+1,tile,attr});}
 if(!cells.length)continue;
 const left=Math.min(...cells.map(c=>c.x)),top=Math.min(...cells.map(c=>c.y)),right=Math.max(...cells.map(c=>c.x+8)),bottom=Math.max(...cells.map(c=>c.y+8));
 assert.ok(right-left<=32&&bottom-top<=32);const originX=(left+right)/2,originY=(top+bottom)/2,p=new PNG({width:32,height:32});let opaque=0;
 for(const c of [...cells].reverse())for(let y=0;y<8;y++)for(let x=0;x<8;x++){
 const v=n.ppu.ptTile[n.ppu.f_spPatternTable*256+c.tile].pix[(c.attr&128?7-y:y)*8+(c.attr&64?7-x:x)];if(!v)continue;
 const rgb=mesenRgbFromJsnes(n.ppu.sprPalette[(c.attr&3)*4+v]),xx=c.x-originX+16+x,yy=c.y-originY+16+y;
 p.data.set([rgb&255,rgb>>8&255,rgb>>16&255,255],(yy*32+xx)*4);}
 for(let y=0;y<32;y++)for(let x=0;x<32;x++){let k=(y*32+x)*4;if(!p.data[k+3])continue;const rgb=mesenRgbFromJsnes(pixels[(originY-16+y)*256+originX-16+x]);assert.deepEqual([...p.data.subarray(k,k+3)],[rgb&255,rgb>>8&255,rgb>>16&255]);opaque++;}
 const key=hash(p.data);if(!frames.has(key))frames.set(key,{index:frames.size,p});fixtures.push({frame:f,index:frames.get(key).index,opaque,cells,originX,originY});
}
assert.ok(frames.size>0);const strip=new PNG({width:frames.size*32,height:32});for(const{index,p}of frames.values())PNG.bitblt(p,strip,0,0,32,32,index*32,0);
fs.mkdirSync(new URL('Art/',base),{recursive:true});const file=`Art/spr_mm6_boss_defeat_strip${frames.size}.png`,data=PNG.sync.write(strip);fs.writeFileSync(new URL(file,base),data);
const rb=(bank,a)=>rom[16+bank*8192+(a&8191)],signed=v=>v>=32768?v-65536:v,vectors=[];
for(const speed of [5,9]){const ptr=rb(0x3f,0xe646+speed)|rb(0x3f,0xe655+speed)<<8;for(let angle=0;angle<16;angle+=2)vectors.push({speed,angle,vx256:signed(rb(0x3f,ptr+angle+24)|rb(0x3f,ptr+angle+4)<<8),vy256:signed(rb(0x3f,ptr+angle+20)|rb(0x3f,ptr+angle)<<8)});}
fs.writeFileSync(new URL('Reference/mm6-defeat-art.json',base),JSON.stringify({romSha256:hash(rom),method:'Real boss-defeat snapshot498 advanced4updates; original particle slot14/type8. Art-only isolate/reposition fixture40updates, no ROM/CHR/palette patch. Opaque exported pixels matched to native renderer. Cells geometrically centred in32x32, not a measured native anchor offset.',file,sha256:hash(data),cell:[32,32],origin:[16,16],fixtures,vectors,limitations:['Art fixture is not native timing proof.','Vectors read from original E61A table selectors5/9; runtime trajectory verification still required.','No integration/installed animation acceptance.']},null,2)+'\n');console.log({unique:frames.size,fixtures:fixtures.length,vectors});
