import fs from'node:fs';import assert from'node:assert/strict';import{createHash}from'node:crypto';import{NES}from'jsnes';import{PNG}from'pngjs';import{mesenRgbFromJsnes}from'./mesen-palette.mjs';
const root=new URL('../../',import.meta.url),work=new URL('./.work/',import.meta.url),out=new URL('Assets/Enemies/MM1/Super Cutter/',root),rom=fs.readFileSync(new URL('Mega Man (USA).nes',root));let pixels;
const n=new NES({emulateSound:false,onFrame:p=>pixels=p.slice()});n.loadROM(rom.toString('binary'));n.fromJSON(JSON.parse(fs.readFileSync(new URL('cutman-fourth-scroll/after-continuation.json',work))));for(let b=0;b<8;b++)n.buttonUp(1,b);
const poses=new Map();
for(let f=1;f<=31;f++){const m=n.cpu.mem;m[0x480]=1896&255;m[0x460]=1896>>8;m[0x4a0]=0;m[0x600]=36;m[0x620]=m[0x660]=m[0x680]=0;m[0x55]=100;n.frame();const cells=[];
 for(let i=0;i<64;i++){const[y,tile,attr,x]=n.ppu.spriteMem.slice(i*4,i*4+4);if(y<240&&tile>=0xa3&&tile<=0xae)cells.push({x,y,tile,attr});}
 if(![4,8].includes(cells.length))continue;
 const ox=Math.min(...cells.map(v=>v.x)),top=Math.min(...cells.map(v=>v.y))+1;
 const rowOffset=cells.length===4?8:0,oy=top-rowOffset,p=new PNG({width:16,height:32});
 if(Math.max(...cells.map(v=>v.x))-ox!==8)continue;
 for(const c of [...cells].reverse())for(let y=0;y<8;y++)for(let x=0;x<8;x++){
 const v=n.ppu.ptTile[c.tile+256*n.ppu.f_spPatternTable].pix[(c.attr&128?7-y:y)*8+(c.attr&64?7-x:x)];if(!v)continue;const rgb=mesenRgbFromJsnes(n.ppu.sprPalette[(c.attr&3)*4+v]);p.data.set([rgb&255,rgb>>8&255,rgb>>16&255,255],((c.y+1+y-oy)*16+c.x+x-ox)*4);}
 let matches=true;for(let y=0;y<32;y++)for(let x=0;x<16;x++){const k=(y*16+x)*4;if(!p.data[k+3])continue;const rgb=mesenRgbFromJsnes(pixels[(oy+y)*256+ox+x]);if(p.data[k]!=(rgb&255)||p.data[k+1]!=(rgb>>8&255)||p.data[k+2]!=(rgb>>16&255))matches=false;}
 if(matches){const key=createHash('sha256').update(p.data).digest('hex');if(!poses.has(key))poses.set(key,{p,f,cells,rowOffset,rgbaSha256:key});}
}
assert.equal(poses.size,2);const strip=new PNG({width:32,height:32});let i=0;const meta=[];for(const {p,...record}of poses.values()){for(let y=0;y<32;y++)p.data.copy(strip.data,(y*32+i*16)*4,y*16*4,(y+1)*16*4);meta.push({index:i,...record});i++;}
fs.writeFileSync(new URL('spr_mm1_super_cutter_strip2.png',out),PNG.sync.write(strip));fs.writeFileSync(new URL('Reference/native-super-cutter-art.json',out),JSON.stringify({method:'Supplied MM1USA/JSNES2.1.0 controlled firstdispenser, playerX1896/Y36/verticalspeed0/protection100. Both2original poses independently match opaque native-renderpixels. Original OAM components/colors with Mesen0.9.9RGB mapping, not Mesen.exe. Common16x32cell retains all original tall-pose pixels; shortpose centered with8transparent rows top/bottom, no repainting.',cell:[16,32],frames:2,origin:[8,15],canonical:'left',poses:meta},null,2)+'\n');console.log('PASS 2original poses independently native-render-matched,16x32commoncells/origin8,15.');
