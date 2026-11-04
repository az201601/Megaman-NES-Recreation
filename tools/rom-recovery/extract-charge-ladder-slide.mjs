// Original OAM/CHR plus native body-palette banks. No controller changes.
// Ladder initialization/class20 injection matches accepted ladder extractor, not natural endpoints.
import {NES,Controller} from 'jsnes';import {PNG} from 'pngjs';
import fs from 'node:fs';import assert from 'node:assert/strict';
import {mesenRgbFromJsnes} from './mesen-palette.mjs';
const root=new URL('../../',import.meta.url),bytes=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root));
const snapshot=JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json',import.meta.url)));
const palettes=[0,2,3,4,6,7].map(i=>[0x8f47,0x8f4f,0x8f57].map(a=>bytes[0x36010+a-0x8000+i]));
assert.deepEqual(palettes,[[15,44,17],[5,44,17],[21,44,17],[37,44,17],[44,17,15],[17,15,44]]);
function boot(top=null){
 const n=new NES();n.loadROM(bytes.toString('binary'));n.fromJSON(structuredClone(snapshot));
 for(let b=0;b<8;b++)n.buttonUp(1,b);for(let i=0;i<30;i++)n.frame();
 if(top!==null){
  const m=n.cpu.mem;m[0x30]=3;m[0x330]=136;m[0x318]=0;m[0x378]=140;m[0x360]=0;m[0x3d8]=0x4c;m[0x3f0]=1;
  const write=n.cpu.write.bind(n.cpu);
  n.cpu.write=(a,v)=>{if(a>=0x48&&a<=0x4a&&n.cpu.REG_X===0&&n.cpu.REG_PC>=0xc4a1&&n.cpu.REG_PC<0xc6db)v=top?(a===0x4a?0x20:0):0x20;return write(a,v);};
 }
 return n;
}
function capture(n,slots,rx,ry,faceCount){
 assert.equal(n.ppu.f_spriteSize,0);assert.equal(slots.filter(i=>n.ppu.sprCol[i]===4).length,faceCount);
 const frames=palettes.map(body=>{
  const p=new PNG({width:32,height:40});p.labels=new Uint8Array(1280);
  for(const i of slots.slice().reverse()){
   const pal=n.ppu.sprCol[i];assert.ok(pal===0||pal===4);
   const tile=n.ppu.ptTile[n.ppu.sprTile[i]+256*n.ppu.f_spPatternTable];
   for(let y=0;y<8;y++)for(let x=0;x<8;x++){
    const c=tile.pix[(n.ppu.vertFlip[i]?7-y:y)*8+(n.ppu.horiFlip[i]?7-x:x)];if(!c)continue;
    const dx=n.ppu.sprX[i]+x-rx+16,dy=n.ppu.sprY[i]+1+y-ry+16;
    assert.ok(dx>=0&&dx<32&&dy>=0&&dy<40,'Opaque pixel clipped');
    const v=mesenRgbFromJsnes(pal===0?n.ppu.palTable.curTable[body[c-1]]:n.ppu.sprPalette[pal+c]),k=dy*32+dx;
    p.data.set([v&255,v>>8&255,v>>16&255,255],k*4);p.labels[k]=pal===4?4:c;
   }
  }
  return p;
 });
 for(const p of frames)for(let k=0;k<1280;k++){
  assert.equal(p.data[k*4+3],frames[0].data[k*4+3]);
  if(p.labels[k]===4)assert.deepEqual(p.data.subarray(k*4,k*4+4),frames[0].data.subarray(k*4,k*4+4),'Separate face must not flash');
 }
 return frames;
}
function save(name,poses,acceptedPath){
 const count=poses.length,accepted=PNG.sync.read(fs.readFileSync(new URL(acceptedPath,root)));
 const strip=new PNG({width:32*count*6,height:40});
 for(let c=0;c<6;c++)for(let f=0;f<count;f++)for(let y=0;y<40;y++){
  const p=poses[f][c];
  if(c===0)assert.deepEqual(p.data.subarray(y*32*4,(y+1)*32*4),accepted.data.subarray((y*32*count+f*32)*4,(y*32*count+(f+1)*32)*4),'Base must equal accepted sprite');
  p.data.copy(strip.data,(y*strip.width+(c*count+f)*32)*4,y*32*4,(y+1)*32*4);
 }
 const dir=new URL('Assets/Mega Man/MM5/Buster/Charging/Player Colours/',root);fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(new URL('spr_mm5_megaman_'+name+'_charge_strip'+count*6+'.png',dir),PNG.sync.write(strip));
}
for(const top of [false,true]){
 const n=boot(top),poses=[];n.buttonDown(1,Controller.BUTTON_UP);
 for(let t=1;t<=22;t++){
  const y=n.cpu.mem[0x378];n.frame();assert.equal(n.cpu.mem[0x558],top?20:10);
  if(![4,13,22].includes(t))continue;
  const slots=Array.from({length:64},(_,i)=>i).filter(i=>n.ppu.sprY[i]<239&&n.ppu.sprX[i]>90&&n.ppu.sprX[i]<175);
  assert.ok(slots.length>=5&&slots.length<=7);assert.ok(slots.every(i=>n.ppu.sprCol[i]===0));
  const min=Math.min(...slots.map(i=>n.ppu.sprX[i]));assert.equal(Math.max(...slots.map(i=>n.ppu.sprX[i]))-min,8);
  poses.push(capture(n,slots,min+8,y,0));
 }
 for(let c=0;c<6;c++){
  assert.deepEqual(poses[0][c].data,poses[2][c].data);
  if(top)assert.deepEqual(poses[0][c].data,poses[1][c].data);else assert.notDeepEqual(poses[0][c].data,poses[1][c].data);
 }
 save(top?'ladder_top':'climb',top?[poses[0]]:poses.slice(0,2),top?'Assets/Mega Man/MM5/Ladders/spr_mm5_megaman_ladder_top.png':'Assets/Mega Man/MM5/Ladders/spr_mm5_megaman_climb_strip2.png');
}
const slide=boot(),poses=[];slide.buttonDown(1,Controller.BUTTON_DOWN);slide.buttonDown(1,Controller.BUTTON_A);
for(let t=1;t<=10;t++){
 const rx=(slide.cpu.mem[0x330]-slide.cpu.mem[0xfc]+256)%256,ry=slide.cpu.mem[0x378];slide.frame();
 assert.equal(slide.cpu.mem[0x30],2);assert.equal(slide.cpu.mem[0x558],0x10);if(![2,5,10].includes(t))continue;
 const slots=Array.from({length:64},(_,i)=>i).filter(i=>slide.ppu.sprY[i]<239&&Math.abs(slide.ppu.sprX[i]-rx)<=16
  &&((slide.ppu.sprCol[i]===0&&slide.ppu.sprTile[i]>=0x25&&slide.ppu.sprTile[i]<=0x2e)||(slide.ppu.sprCol[i]===4&&slide.ppu.sprTile[i]===0x2f)));
 assert.equal(slots.length,11);assert.ok(slots.every(i=>slide.ppu.sprTile[i]!==0x53));
 poses.push(capture(slide,slots,rx,ry,1));
}
for(let c=0;c<6;c++){assert.deepEqual(poses[0][c].data,poses[1][c].data);assert.deepEqual(poses[0][c].data,poses[2][c].data);}
save('slide',[poses[0]],'Assets/Mega Man/MM5/Sliding/spr_mm5_megaman_slide.png');
console.log('Charge climb12/top6/slide6 cells32x40 origin16,16: native palettes, accepted-base equality, alpha/face/phase invariance, no clipping or dust passed.');
