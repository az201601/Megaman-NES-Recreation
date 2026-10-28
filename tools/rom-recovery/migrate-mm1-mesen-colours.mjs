// Stage select, Cut Man intro and first-screen scenery: pinned colour-only migration.
// Mesen palette matching, NOT a direct Mesen runtime capture.
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {PNG} from 'pngjs';
import assert from 'node:assert/strict';
import {mesenRgbFromJsnes,mesenRgbColors} from './mesen-palette.mjs';
const root=new URL('../../',import.meta.url);
// Title/font use this target already; do not recolour them twice.
for(const name of ['Assets/title_screen.png','Assets/sprite_font_strip.png']){
 const p=PNG.sync.read(fs.readFileSync(new URL(name,root)));
 for(let i=0;i<p.data.length;i+=4)if(p.data[i+3])
  assert.ok(mesenRgbColors.has(p.data[i]<<16|p.data[i+1]<<8|p.data[i+2]),name+' has a non-target colour');
 console.log(name+': already entirely in the Mesen default palette; unchanged.');
}
const files=[
 ['spr_mm1_stage_select_background.png',256,240],
 ['spr_mm1_stage_select_frame_strip2.png',96,48],
 ...['bombman','cutman','elecman','fireman','gutsman','iceman'].map(n=>['Portraits/spr_mm1_stage_select_'+n+'.png',32,32]),
 ['stage_select_preview.png',256,240],
].map(([name,w,h])=>['Assets/Stage Select/'+name,w,h]);
files.push(
 ['Assets/Cut Man/Boss Intro/spr_mm1_cutman_boss_intro_strip3.png',96,32],
 ['Assets/Cut Man/Boss Intro/spr_mm1_cutman_boss_intro_background_strip2.png',512,240],
 ['Assets/Cut Man/Boss Intro/cutman_boss_intro_preview.png',256,240],
 ['Assets/Cut Man/Stage/Screen 01/bg_mm1_cutman_screen01_background.png',256,240],
 ['Assets/Cut Man/Stage/Screen 01/bg_mm1_cutman_screen01_tileset.png',128,32],
 ['Assets/Cut Man/Stage/Screen 01/cutman_screen01_layout_reference.png',256,240],
 ['Assets/Cut Man/Stage/Screen 01/cutman_screen01_scenery_reference.png',256,240],
 ['Assets/Stage Objects/Super Arm/spr_mm1_super_arm_block.png',32,32]
);
for(const [path,w,h] of files){
 const name=path.split('/').pop();
 const old=PNG.sync.read(execFileSync('git',['show','4acf61c:'+path],{cwd:root}));
 const p=PNG.sync.read(PNG.sync.write(old));
 assert.equal(p.width,w);assert.equal(p.height,h);let changed=0;
 for(let i=0;i<p.data.length;i+=4){
  if(!p.data[i+3])continue;
  const from=p.data[i]|p.data[i+1]<<8|p.data[i+2]<<16;
  const to=mesenRgbFromJsnes(from);if(from!==to)changed++;
  p.data[i]=to&255;p.data[i+1]=to>>8&255;p.data[i+2]=to>>16&255;
 }
 for(let i=3;i<p.data.length;i+=4)assert.equal(p.data[i],old.data[i]);
 assert.ok(changed>0);
 if(name==='spr_mm1_stage_select_background.png' || name==='bg_mm1_cutman_screen01_background.png'){
  const first=p.data.subarray(0,4);
  for(let i=0;i<p.data.length;i+=4)assert.deepEqual(p.data.subarray(i,i+4),first,'Background must remain solid edge-to-edge');
 }
 fs.writeFileSync(new URL(path,root),PNG.sync.write(p));
 console.log(`${name}: ${w}x${h}, ${changed} RGB changes; alpha/geometry unchanged.`);
}
