// Natural READY display measurement; original player/animation code unaltered.
import {NES} from 'jsnes';import {PNG} from 'pngjs';import fs from 'node:fs';import assert from 'node:assert/strict';
import {mesenRgbFromJsnes} from './mesen-palette.mjs';
const root=new URL('../../',import.meta.url),work=new URL('./.work/',import.meta.url);
const ss=JSON.parse(fs.readFileSync(new URL('mm5-arrival-snapshots.json',work)));
const n=new NES();n.loadROM(fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary'));n.fromJSON(ss.find(s=>s.t===572).snapshot);
const rows=[];
for(let t=573;t<=663;t++){
 const m=n.cpu.mem,phase=m[0x540];n.frame();
 const slots=Array.from({length:64},(_,i)=>i).filter(i=>n.ppu.sprY[i]>=110&&n.ppu.sprY[i]<145&&n.ppu.sprX[i]>=95&&n.ppu.sprX[i]<=160);
 rows.push({t,prePhase:phase,phase:m[0x540],animation:m[0x558],components:slots.map(i=>({tile:n.ppu.sprTile[i],pal:n.ppu.sprCol[i],x:n.ppu.sprX[i],y:n.ppu.sprY[i]+1}))});
 if(phase%2===1&&t<663){assert.equal(slots.length,1);assert.equal(n.ppu.sprTile[slots[0]],127);assert.ok(n.ppu.ptTile[127+256*n.ppu.f_spPatternTable].pix.every(c=>c===0),'Blank phase really transparent');}
 if(t===574){
  assert.deepEqual(slots.map(i=>n.ppu.sprTile[i]),[129,130,131,132,133]);
  const p=new PNG({width:40,height:8});
  for(const i of slots)for(let y=0;y<8;y++)for(let x=0;x<8;x++){
   const tile=n.ppu.ptTile[n.ppu.sprTile[i]+256*n.ppu.f_spPatternTable];
   const c=tile.pix[(n.ppu.vertFlip[i]?7-y:y)*8+(n.ppu.horiFlip[i]?7-x:x)];if(!c)continue;
   const dx=n.ppu.sprX[i]+x-108,dy=n.ppu.sprY[i]+1+y-125;assert.ok(dx>=0&&dx<40&&dy>=0&&dy<8);
   const v=mesenRgbFromJsnes(n.ppu.sprPalette[n.ppu.sprCol[i]+c]);p.data.set([v&255,v>>8&255,v>>16&255,255],(dy*40+dx)*4);
  }
  const dir=new URL('Assets/Mega Man/MM5/Arrival/',root);fs.writeFileSync(new URL('spr_mm5_ready.png',dir),PNG.sync.write(p));
 }
}
fs.writeFileSync(new URL('ready-arrival.json',work),JSON.stringify(rows,null,2));
console.log(rows.filter((r,i)=>!i||r.components.length!==rows[i-1].components.length));

for(const row of rows.filter(r=>r.t<662))assert.equal(row.components.length,row.prePhase%2?1:5);
for(let start=578;start<=650;start+=6)assert.ok(rows.filter(r=>r.t>=start&&r.t<start+6).every(r=>r.prePhase===rows.find(r=>r.t===start).prePhase));
console.log('PASS: READY original tiles81..85hex, transparent7F blank, six-update alternating phases;40x8 origin20,3 at native128,128.');
