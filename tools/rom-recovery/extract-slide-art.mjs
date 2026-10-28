// Extract the normal MM5 slide pose from live OAM/CHR/palette data.
// Natural slide entry in the saved Napalm opening, no terrain/state injection.
import {NES,Controller} from 'jsnes';
import {PNG} from 'pngjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url);
const n=new NES();
n.loadROM(fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary'));
n.fromJSON(JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json',import.meta.url))));
for(let b=0;b<8;b++)n.buttonUp(1,b);
for(let i=0;i<30;i++)n.frame();
assert.equal(n.cpu.mem[0x30],0);
n.buttonDown(1,Controller.BUTTON_DOWN);n.buttonDown(1,Controller.BUTTON_A);
const poses=[];
for(let t=1;t<=10;t++){
 const referenceX=(n.cpu.mem[0x330]-n.cpu.mem[0xfc]+256)%256;
 const referenceY=n.cpu.mem[0x378];
 n.frame();
 assert.equal(n.cpu.mem[0x30],2);assert.equal(n.cpu.mem[0x558],0x10);
 if(![2,5,10].includes(t))continue;
 assert.equal(n.ppu.f_spriteSize,0);
 // Normal slide's body CHR tiles $25-$2E and face $2F only.
 // Explicitly exclude the separate trailing dust effect (tile $53).
 const slots=Array.from({length:64},(_,i)=>i).filter(i=>
  n.ppu.sprY[i]<239&&Math.abs(n.ppu.sprX[i]-referenceX)<=16
  &&((n.ppu.sprCol[i]===0&&n.ppu.sprTile[i]>=0x25&&n.ppu.sprTile[i]<=0x2e)
  ||(n.ppu.sprCol[i]===4&&n.ppu.sprTile[i]===0x2f)));
 assert.equal(slots.length,11);
 assert.equal(new Set(slots.map(i=>n.ppu.sprTile[i])).size,11);
 const face=slots.find(i=>n.ppu.sprCol[i]===4);
 assert.equal(n.ppu.sprX[face]+6,referenceX);
 assert.equal(Math.min(...slots.map(i=>n.ppu.sprX[i])),referenceX-16);
 const p=new PNG({width:32,height:40});
 let opaque=0;
 for(const i of slots.slice().reverse()){
  const tile=n.ppu.ptTile[n.ppu.sprTile[i]+256*n.ppu.f_spPatternTable];
  for(let y=0;y<8;y++)for(let x=0;x<8;x++){
   const c=tile.pix[(n.ppu.vertFlip[i]?7-y:y)*8+(n.ppu.horiFlip[i]?7-x:x)];
   if(!c)continue;
   const dx=n.ppu.sprX[i]+x-referenceX+16;
   const dy=n.ppu.sprY[i]+1+y-referenceY+16;
   assert.ok(dx>=0&&dx<32&&dy>=0&&dy<40,'Clipped slide pixel');
   const v=n.ppu.sprPalette[n.ppu.sprCol[i]+c];
   p.data.set([v&255,(v>>8)&255,(v>>16)&255,255],(dy*32+dx)*4);opaque++;
  }
 }
 assert.ok(opaque>150);poses.push(p);
}
assert.equal(poses.length,3);
assert.deepEqual(poses[0].data,poses[1].data);
assert.deepEqual(poses[0].data,poses[2].data);
const dir=new URL('Assets/Mega Man/MM5/Sliding/',root);fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(new URL('spr_mm5_megaman_slide.png',dir),PNG.sync.write(poses[0]));
console.log('Extracted static right-facing slide pose: 32x40, origin16,16. Three live samples equal; no clipping; trailing dust excluded.');
