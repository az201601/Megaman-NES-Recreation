// Reproducible colour-only migration from pinned pre-migration assets.
// No nearest-colour guessing; dimensions, frame arrangements and alpha invariant.
import {PNG} from 'pngjs';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {mesenRgbFromJsnes} from './mesen-palette.mjs';
const root=new URL('../../',import.meta.url);
const files=[
 ['Standing/spr_mm5_megaman_idle.png',32,32],
 ['Movement/spr_mm5_megaman_walk_strip4.png',128,32],
 ['Movement/spr_mm5_megaman_air.png',32,40],
 ['Ladders/spr_mm5_megaman_climb_strip2.png',64,40],
 ['Ladders/spr_mm5_megaman_ladder_top.png',32,40],
 ['Sliding/spr_mm5_megaman_slide.png',32,40],
];
for(const [name,w,h] of files){
 const path='Assets/Mega Man/MM5/'+name;
 const old=PNG.sync.read(execFileSync('git',['show','daf1d40:'+path],{cwd:root}));
 const p=PNG.sync.read(PNG.sync.write(old));
 assert.equal(p.width,w);assert.equal(p.height,h);
 let opaque=0,changed=0;
 for(let i=0;i<p.data.length;i+=4){
  if(!p.data[i+3])continue;
  assert.equal(p.data[i+3],255);
  const packed=p.data[i]|p.data[i+1]<<8|p.data[i+2]<<16;
  const rgb=mesenRgbFromJsnes(packed);
  if(packed!==rgb)changed++;
  p.data[i]=rgb&255;p.data[i+1]=(rgb>>8)&255;p.data[i+2]=(rgb>>16)&255;opaque++;
 }
 for(let i=3;i<p.data.length;i+=4)assert.equal(p.data[i],old.data[i]);
 assert.ok(opaque>0);assert.ok(changed>0);
 fs.writeFileSync(new URL(path,root),PNG.sync.write(p));
 console.log(`${name}: ${w}x${h}, ${opaque} opaque pixels, ${changed} RGB changes; alpha preserved.`);
}
