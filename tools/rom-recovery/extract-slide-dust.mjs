// Natural MM5 slide-entry dust: original USA ROM, JSNES runtime, Mesen colours.
// No player-state/terrain injection. Three OAM/CHR tiles, not generated imagery.
import {NES,Controller} from 'jsnes';
import {PNG} from 'pngjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {mesenRgbFromJsnes} from './mesen-palette.mjs';
const root=new URL('../../',import.meta.url);
const rom=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary');
const snapshot=JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json',import.meta.url)));
const cases=['right','left','cancel-restart'];
const results=[],images=[];
for(const name of cases){
 const n=new NES();n.loadROM(rom);n.fromJSON(structuredClone(snapshot));
 for(let b=0;b<8;b++)n.buttonUp(1,b);for(let i=0;i<30;i++)n.frame();
 const m=n.cpu.mem;assert.equal(m[0x30],0);assert.equal(m[0x305],0);
 const startX=m[0x330],startY=m[0x378];
 const rows=[],poses=[];let births=0;
 const write=n.cpu.write.bind(n.cpu);
 n.cpu.write=(a,v)=>{if(a===0x305&&v===1)births++;return write(a,v);};
 for(let t=1;t<=35;t++){
  for(let b=0;b<8;b++)n.buttonUp(1,b);
  if(t===1){n.buttonDown(1,Controller.BUTTON_DOWN);n.buttonDown(1,Controller.BUTTON_A);if(name==='left')n.buttonDown(1,Controller.BUTTON_LEFT);}
  if(name==='cancel-restart'&&t===4)n.buttonDown(1,Controller.BUTTON_LEFT);
  if(name==='cancel-restart'&&t===7){n.buttonDown(1,Controller.BUTTON_DOWN);n.buttonDown(1,Controller.BUTTON_A);n.buttonDown(1,Controller.BUTTON_RIGHT);}
  const previousCamera=m[0xfc];
  n.frame();
  rows.push({t,state:m[0x30],active:m[0x305],x:m[0x335],y:m[0x37d],animation:m[0x55d],phase:m[0x545],timer:m[0x575]});
  if(t<=26){assert.equal(m[0x305],1);assert.equal(m[0x335],startX);assert.equal(m[0x37d],startY+2);assert.equal(m[0x55d],0x17);}
  else assert.equal(m[0x305],0);
  if(![2,11,20].includes(t))continue;
  const phase=[2,11,20].indexOf(t);
  const slots=Array.from({length:64},(_,i)=>i).filter(i=>n.ppu.sprY[i]<239&&n.ppu.sprTile[i]===0x53+phase&&n.ppu.sprCol[i]===4);
  assert.equal(slots.length,1,'Expected one dust OAM component');
  const i=slots[0];assert.equal(n.ppu.f_spriteSize,0);
  assert.equal(n.ppu.sprX[i]+previousCamera,startX-12);
  assert.equal(n.ppu.sprY[i]+1,startY+7);
  const tile=n.ppu.ptTile[n.ppu.sprTile[i]+256*n.ppu.f_spPatternTable];
  const p=new PNG({width:8,height:8});let pixels=0;
  for(let y=0;y<8;y++)for(let x=0;x<8;x++){
   const c=tile.pix[(n.ppu.vertFlip[i]?7-y:y)*8+(n.ppu.horiFlip[i]?7-x:x)];
   if(!c)continue;
   const v=mesenRgbFromJsnes(n.ppu.sprPalette[n.ppu.sprCol[i]+c]);
   p.data.set([v&255,v>>8&255,v>>16&255,255],(y*8+x)*4);pixels++;
  }
  assert.ok(pixels>0);poses.push(p);
 }
 assert.equal(births,1,'One dust birth even on quick re-slide');
 assert.equal(rows[8].phase,1);assert.equal(rows[17].phase,2);assert.equal(rows[26].phase,3);
 if(name==='cancel-restart'){assert.equal(rows[3].state,0);assert.equal(rows[6].state,2);assert.equal(rows[6].timer,7);}
 if(name==='right')images.push(...poses);
 else poses.forEach((p,i)=>assert.deepEqual(p.data,images[i].data,'Dust art must not mirror with player direction'));
 results.push({name,startX,startY,births,rows});
}
for(let i=0;i<3;i++)for(let j=i+1;j<3;j++)assert.notDeepEqual(images[i].data,images[j].data);
const strip=new PNG({width:24,height:8});
images.forEach((p,i)=>{for(let y=0;y<8;y++)p.data.copy(strip.data,(y*24+i*8)*4,y*8*4,(y+1)*8*4);});
const dir=new URL('Assets/Mega Man/MM5/Sliding/Dust/',root);fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(new URL('spr_mm5_slide_dust_strip3.png',dir),PNG.sync.write(strip));
fs.writeFileSync(new URL('./.work/slide-dust.json',import.meta.url),JSON.stringify(results,null,2));
console.log('Dust extracted: three distinct 8x8 poses, 24x8 strip, origin0,0. Fixed world position, identical left/right, phase changes9/18, deletion27; quick re-slide does not respawn.');
