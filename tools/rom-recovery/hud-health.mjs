// MM5 health HUD recovery. Original ROM routines, controlled HP presets labelled.
import {NES} from 'jsnes';import {PNG} from 'pngjs';import fs from 'node:fs';import assert from 'node:assert/strict';
import {mesenRgbFromJsnes} from './mesen-palette.mjs';
const root=new URL('../../',import.meta.url),work=new URL('./.work/',import.meta.url);
const rom=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary');
const snap=JSON.parse(fs.readFileSync(new URL('mm5-stage.json',work)));
const inventory=[],strip=new PNG({width:29*8,height:56});
for(let hp=0;hp<=28;hp++){
 const n=new NES();n.loadROM(rom);n.fromJSON(structuredClone(snap));for(let b=0;b<8;b++)n.buttonUp(1,b);
 n.cpu.mem[0xb0]=(n.cpu.mem[0xb0]&0xe0)|hp;
 for(let t=0;t<3;t++)n.frame();
 const p=n.ppu,slots=Array.from({length:64},(_,i)=>i).filter(i=>p.sprX[i]===24&&p.sprY[i]>=24&&p.sprY[i]<=72).sort((a,b)=>p.sprY[a]-p.sprY[b]);
 assert.equal(slots.length,7);assert.deepEqual(slots.map(i=>p.sprY[i]+1),[25,33,41,49,57,65,73]);
 assert.ok(slots.every(i=>p.sprCol[i]===4));
 assert.equal(n.cpu.mem[0xb0]&31,hp);assert.equal(n.cpu.mem[0x30],0);
 assert.deepEqual(slots.map(i=>p.sprTile[i]),Array.from({length:7},(_,row)=>96+Math.max(0,Math.min(4,hp-4*(6-row)))));
 inventory.push({hp,tiles:slots.map(i=>p.sprTile[i]),state:n.cpu.mem[0x30],stored:n.cpu.mem[0xb0],palette:Array.from(p.sprPalette.slice(4,8))});
 for(const i of slots){
  const tile=p.ptTile[p.sprTile[i]+256*p.f_spPatternTable];
  for(let y=0;y<8;y++)for(let x=0;x<8;x++){
   const c=tile.pix[(p.vertFlip[i]?7-y:y)*8+(p.horiFlip[i]?7-x:x)];if(!c)continue;
   const dx=x,dy=p.sprY[i]+1+y-25;const v=mesenRgbFromJsnes(p.sprPalette[4+c]);
   strip.data.set([v&255,v>>8&255,v>>16&255,255],(dy*strip.width+hp*8+dx)*4);
  }
 }

}
for(let hp=0;hp<=28;hp++){
 let cream=0,white=0,black=0;
 for(let y=0;y<56;y++)for(let x=0;x<8;x++){
  const i=(y*strip.width+hp*8+x)*4,rgb=Array.from(strip.data.subarray(i,i+3)).join(',');assert.equal(strip.data[i+3],255);
  if(rgb==='247,216,165')cream++;else if(rgb==='255,254,255')white++;else{assert.equal(rgb,'0,0,0');black++;}
 }
 assert.equal(cream,4*hp);assert.equal(white,2*hp);assert.equal(black,448-6*hp);
}
const dir=new URL('Assets/Mega Man/MM5/HUD/',root);fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(new URL('spr_mm5_health_meter_strip29.png',dir),PNG.sync.write(strip));
fs.writeFileSync(new URL('mm5-health-hud.json',work),JSON.stringify(inventory,null,2));

// Natural full-health visibility through existing READY/arrival sequence, no HP preset.
const ss=JSON.parse(fs.readFileSync(new URL('mm5-arrival-snapshots.json',work)));
const arrival=new NES();arrival.loadROM(rom);arrival.fromJSON(structuredClone(ss.find(s=>s.t===572).snapshot));
const startup=[];
for(let t=573;t<=704;t++){
 arrival.frame();
 if(![573,580,660,662,678,679,690,691,700,704].includes(t))continue;
 const p=arrival.ppu,slots=Array.from({length:64},(_,i)=>i).filter(i=>p.sprX[i]===24&&p.sprY[i]>=24&&p.sprY[i]<=72);
 assert.equal(arrival.cpu.mem[0xb0]&31,28);assert.equal(slots.length,7);assert.ok(slots.every(i=>p.sprTile[i]===100));
 startup.push({t,hp:28,tiles:slots.map(i=>p.sprTile[i])});
}
fs.writeFileSync(new URL('mm5-health-startup.json',work),JSON.stringify(startup,null,2));
console.log('PASS:29 original-ROM controlled HP states, seven native tiles,8x56 at24,25; cream4/white2 pixels per unit; full meter visible in10 natural READY/arrival/idle samples.');
