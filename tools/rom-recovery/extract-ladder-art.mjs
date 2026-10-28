// ROM-OAM ladder artwork extraction using controlled ladder-result inputs.
// Not a natural ladder encounter or proof of endpoint timing.
import {NES,Controller} from 'jsnes';
import {PNG} from 'pngjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url);
const rom=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary');
const snapshot=JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json',import.meta.url)));
function boot(top){
 const n=new NES();n.loadROM(rom);n.fromJSON(structuredClone(snapshot));
 for(let t=0;t<30;t++)n.frame();for(let b=0;b<8;b++)n.buttonUp(1,b);
 const m=n.cpu.mem;
 m[0x30]=3;m[0x330]=136;m[0x318]=0;m[0x378]=140;m[0x360]=0;m[0x3d8]=0x4c;m[0x3f0]=1;
 const write=n.cpu.write.bind(n.cpu);
 n.cpu.write=(a,v)=>{
  if(a>=0x48&&a<=0x4a&&n.cpu.REG_X===0&&n.cpu.REG_PC>=0xc4a1&&n.cpu.REG_PC<0xc6db)v=top?(a===0x4a?0x20:0):0x20;
  return write(a,v);
 };
 return n;
}
function render(n,referenceY){
 assert.equal(n.ppu.f_spriteSize,0);
 const slots=Array.from({length:64},(_,i)=>i).filter(i=>n.ppu.sprY[i]<239&&n.ppu.sprX[i]>90&&n.ppu.sprX[i]<175);
 assert.ok(slots.length>=5&&slots.length<=7);
 assert.ok(slots.every(i=>n.ppu.sprCol[i]===0));
 const minX=Math.min(...slots.map(i=>n.ppu.sprX[i]));
 const maxX=Math.max(...slots.map(i=>n.ppu.sprX[i]));
 assert.equal(maxX-minX,8);
 // Both measured component columns straddle the draw reference at minX+8.
 const refX=minX+8;
 const p=new PNG({width:32,height:40});
 for(const i of slots.slice().reverse()){
  const tile=n.ppu.ptTile[n.ppu.sprTile[i]+256*n.ppu.f_spPatternTable];
  for(let y=0;y<8;y++)for(let x=0;x<8;x++){
   const c=tile.pix[(n.ppu.vertFlip[i]?7-y:y)*8+(n.ppu.horiFlip[i]?7-x:x)];
   if(!c)continue;
   const dx=n.ppu.sprX[i]+x-refX+16,dy=n.ppu.sprY[i]+1+y-referenceY+16;
   assert.ok(dx>=0&&dx<32&&dy>=0&&dy<40,'Clipped opaque ladder pixel');
   const v=n.ppu.sprPalette[n.ppu.sprCol[i]+c];
   p.data.set([v&255,(v>>8)&255,(v>>16)&255,255],(dy*32+dx)*4);
  }
 }
 return p;
}
const climb=boot(false),poses=[],trace=[];
climb.buttonDown(1,Controller.BUTTON_UP);
for(let t=1;t<=24;t++){
 const prevY=climb.cpu.mem[0x378];climb.frame();
 const m=climb.cpu.mem;
 assert.equal(m[0x30],3);assert.equal(m[0x558],10);
 trace.push({t,frame:m[0x540],timer:m[0x570]});
 if(t===4||t===13||t===22)poses.push(render(climb,prevY));
}
assert.notDeepEqual(poses[0].data,poses[1].data);
assert.deepEqual(poses[0].data,poses[2].data);
assert.equal(trace.find(r=>r.frame===1).t,9);
assert.equal(trace.find(r=>r.t>9&&r.frame===0).t,18);
// Neutral resets the cadence counter while preserving the current phase.
climb.buttonUp(1,Controller.BUTTON_UP);
let heldFrame;
for(let t=0;t<5;t++){
 climb.frame();
 if(t===0)heldFrame=climb.cpu.mem[0x540];
 // Handler resets to zero; animation rendering advances it to one each update.
 assert.equal(climb.cpu.mem[0x540],heldFrame);assert.equal(climb.cpu.mem[0x570],1);
}
const top=boot(true),topPoses=[];
top.buttonDown(1,Controller.BUTTON_UP);
for(let t=1;t<=13;t++){
 const prevY=top.cpu.mem[0x378];top.frame();
 assert.equal(top.cpu.mem[0x558],20);
 if(t===4||t===13)topPoses.push(render(top,prevY));
}
assert.deepEqual(topPoses[0].data,topPoses[1].data);
const strip=new PNG({width:64,height:40});
for(let i=0;i<2;i++)for(let y=0;y<40;y++)poses[i].data.copy(strip.data,(y*64+i*32)*4,y*32*4,(y+1)*32*4);
const dir=new URL('Assets/Mega Man/MM5/Ladders/',root);fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(new URL('spr_mm5_megaman_climb_strip2.png',dir),PNG.sync.write(strip));
fs.writeFileSync(new URL('spr_mm5_megaman_ladder_top.png',dir),PNG.sync.write(topPoses[0]));
fs.writeFileSync(new URL('./.work/ladder-art-timing.json',import.meta.url),JSON.stringify(trace,null,2));
console.log('Extracted two 32x40 climb cells and one 32x40 top pose; origin 16,16.');
console.log('Nine-update climb phases, neutral frame hold / timer reset, repeated-pose equality and no-clipping checks passed.');
