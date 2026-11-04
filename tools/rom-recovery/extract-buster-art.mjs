// Live original-ROM OAM/CHR artwork, rendered with approved Mesen0.9.9 colours.
// JSNES extraction, NOT a direct Mesen runtime capture. No generated artwork.
import {NES,Controller} from 'jsnes';
import {PNG} from 'pngjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {mesenRgbFromJsnes} from './mesen-palette.mjs';
const root=new URL('../../',import.meta.url);
const rom=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary');
const snapshot=JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json',import.meta.url)));
const dir=new URL('Assets/Mega Man/MM5/Buster/',root);fs.mkdirSync(dir,{recursive:true});
function boot(mode){
 const n=new NES();n.loadROM(rom);n.fromJSON(structuredClone(snapshot));
 for(let b=0;b<8;b++)n.buttonUp(1,b);for(let i=0;i<30;i++)n.frame();
 if(mode==='ladder'){
  const m=n.cpu.mem;m[0x30]=3;m[0x330]=136;m[0x318]=0;m[0x378]=140;m[0x360]=0;m[0x3d8]=0x4c;m[0x3f0]=1;
  const write=n.cpu.write.bind(n.cpu);n.cpu.write=(a,v)=>{if(a>=0x48&&a<=0x4a&&n.cpu.REG_X===0&&n.cpu.REG_PC>=0xc4a1&&n.cpu.REG_PC<0xc6db)v=0x20;return write(a,v);};
 }
 return n;
}
function paint(n,slots,w,h,rx,ry,ox,oy){
 assert.equal(n.ppu.f_spriteSize,0);
 const p=new PNG({width:w,height:h});let count=0;
 for(const i of slots.slice().reverse()){
  const tile=n.ppu.ptTile[n.ppu.sprTile[i]+256*n.ppu.f_spPatternTable];
  for(let y=0;y<8;y++)for(let x=0;x<8;x++){
   const c=tile.pix[(n.ppu.vertFlip[i]?7-y:y)*8+(n.ppu.horiFlip[i]?7-x:x)];if(!c)continue;
   const dx=n.ppu.sprX[i]+x-rx+ox,dy=n.ppu.sprY[i]+1+y-ry+oy;
   assert.ok(dx>=0&&dx<w&&dy>=0&&dy<h,'Clipped opaque shooting pixel');
   const v=mesenRgbFromJsnes(n.ppu.sprPalette[n.ppu.sprCol[i]+c]);
   p.data.set([v&255,v>>8&255,v>>16&255,255],(dy*w+dx)*4);count++;
  }
 }
 assert.ok(count>0);return p;
}
function body(n,rx,ry,expectedFace){
 const slots=Array.from({length:64},(_,i)=>i).filter(i=>n.ppu.sprY[i]<239&&n.ppu.sprX[i]>=rx-20&&n.ppu.sprX[i]<=rx+20
  &&(n.ppu.sprCol[i]===0||(n.ppu.sprCol[i]===4&&[0x08,0x24,0x2f,0x38].includes(n.ppu.sprTile[i]))));
 assert.ok(slots.length>=7&&slots.length<=12);
 // Face tile varies with pose/stride; tile08 alone silently drops air/stride faces.
 const faces=slots.filter(i=>n.ppu.sprCol[i]===4);
 assert.equal(faces.length,1,'Every shooting pose must retain its original face component');
 assert.equal(n.ppu.sprTile[faces[0]],expectedFace,'Wrong face component for shooting pose');
 return paint(n,slots,40,40,rx,ry,16,16);
}
function save(name,p){fs.writeFileSync(new URL(name,dir),PNG.sync.write(p));}
let bullet;
for(const mode of ['idle','air','ladder','walk']){
 const n=boot(mode),poses=[],walkPoses=new Map();
 const rows=[];
 for(let t=1;t<=40;t++){
  for(let b=0;b<8;b++)n.buttonUp(1,b);
  if(mode==='air')n.buttonDown(1,Controller.BUTTON_A);
  if(mode==='walk')n.buttonDown(1,Controller.BUTTON_RIGHT);
  const fire=mode==='walk'?[7,15,23,31].includes(t):t===(mode==='ladder'?3:1);
  if(fire)n.buttonDown(1,Controller.BUTTON_B);
  const m=n.cpu.mem,rx=(m[0x330]-m[0xfc]+256)%256,ry=m[0x378],preAnim=m[0x558],prePhase=m[0x540];
  const bulletX=m[0x333]-m[0xfc],bulletY=m[0x37b];
  n.frame();rows.push({t,anim:m[0x558],phase:m[0x540],timer:m[0x570]});
  if(mode==='idle'&&t===3){
   const slots=Array.from({length:64},(_,i)=>i).filter(i=>n.ppu.sprY[i]<239&&n.ppu.sprTile[i]===0x40&&n.ppu.sprCol[i]===4);
   assert.equal(slots.length,1);assert.equal(n.ppu.sprX[slots[0]],bulletX-4);assert.equal(n.ppu.sprY[slots[0]]+1,bulletY-3);
   bullet=paint(n,slots,8,8,bulletX,bulletY,4,3);
  }
  if(mode==='walk'){
   if(preAnim===5&&!walkPoses.has(prePhase))walkPoses.set(prePhase,body(n,rx,ry,prePhase===2?0x38:0x08));
  }else if((mode==='ladder'?[6,15]:[4,13]).includes(t)){
   assert.equal(preAnim,{idle:2,air:8,ladder:0x0b}[mode],mode+' must be in the native shooting animation');
   poses.push(body(n,rx,ry,{idle:0x08,air:0x2f,ladder:0x24}[mode]));
  }
 }
 if(mode==='walk'){
  assert.deepEqual([...walkPoses.keys()].sort(),[0,1,2,3]);
  const p=new PNG({width:160,height:40});
  for(let i=0;i<4;i++){const f=walkPoses.get(i);for(let y=0;y<40;y++)f.data.copy(p.data,(y*160+i*40)*4,y*40*4,(y+1)*40*4);}
  assert.deepEqual(walkPoses.get(1).data,walkPoses.get(3).data);
  assert.notDeepEqual(walkPoses.get(0).data,walkPoses.get(2).data);
  save('spr_mm5_megaman_walk_shoot_strip4.png',p);
 }else{
  assert.equal(poses.length,2);assert.deepEqual(poses[0].data,poses[1].data,mode+' shooting samples differ');
  save('spr_mm5_megaman_'+(mode==='ladder'?'climb':mode)+'_shoot.png',poses[0]);
 }
}
save('spr_mm5_buster_shot.png',bullet);
console.log('Extracted projectile8x8 origin4,3; idle/air/climb shooting40x40 origin16,16; walk strip160x40/four40x40 cells. Repeat/distinctness and opaque-clipping checks passed.');
